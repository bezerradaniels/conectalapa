import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as path from 'path';
import { fileURLToPath } from 'url';

// Carregar variáveis de ambiente
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

// Configurar Supabase
const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Erro: Variáveis de ambiente não encontradas');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * Converte um texto em slug amigável para URL
 */
function generateSlug(text: string): string {
    return text
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
}

/**
 * Script para ATUALIZAR slugs de TODAS as empresas
 * Use este script quando quiser regenerar todos os slugs
 */
async function updateAllCompanySlugs() {
    console.log('🔄 Atualizando slugs de TODAS as empresas...\n');

    try {
        // Buscar TODAS as empresas
        const { data: companies, error: fetchError } = await supabase
            .from('companies')
            .select('id, name, slug');

        if (fetchError) {
            console.error('❌ Erro ao buscar empresas:', fetchError);
            return;
        }

        if (!companies || companies.length === 0) {
            console.log('⚠️  Nenhuma empresa encontrada!');
            return;
        }

        console.log(`📊 Encontradas ${companies.length} empresas\n`);

        // Gerar e atualizar slugs
        let successCount = 0;
        let errorCount = 0;
        let skippedCount = 0;

        for (const company of companies) {
            const newSlug = generateSlug(company.name);

            // Se o slug já está correto, pular
            if (company.slug === newSlug) {
                console.log(`⏭️  ${company.name.padEnd(40)} → ${newSlug} (já correto)`);
                skippedCount++;
                continue;
            }

            // Verificar se o novo slug já existe em outra empresa
            const { data: existingSlug } = await supabase
                .from('companies')
                .select('id')
                .eq('slug', newSlug)
                .neq('id', company.id)
                .single();

            // Se o slug já existe, adicionar um sufixo único
            const finalSlug = existingSlug
                ? `${newSlug}-${company.id.slice(0, 8)}`
                : newSlug;

            // Atualizar empresa com o novo slug
            const { error: updateError } = await supabase
                .from('companies')
                .update({ slug: finalSlug })
                .eq('id', company.id);

            if (updateError) {
                console.error(`❌ Erro ao atualizar "${company.name}":`, updateError.message);
                errorCount++;
            } else {
                const oldSlug = company.slug || '(sem slug)';
                console.log(`✅ ${company.name.padEnd(40)} → ${oldSlug} ➜ ${finalSlug}`);
                successCount++;
            }
        }

        console.log('\n' + '='.repeat(70));
        console.log('📈 Resumo:');
        console.log(`   ✅ Atualizados: ${successCount}`);
        console.log(`   ⏭️  Já corretos: ${skippedCount}`);
        console.log(`   ❌ Erros: ${errorCount}`);
        console.log('='.repeat(70));
        console.log('🎉 Processo concluído!\n');

    } catch (error) {
        console.error('❌ Erro geral:', error);
        process.exit(1);
    }
}

// Executar o script
updateAllCompanySlugs()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error('❌ Erro fatal:', error);
        process.exit(1);
    });
