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
    console.error('❌ Erro: Variáveis de ambiente VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY não encontradas');
    console.error('   Certifique-se de que o arquivo .env existe na raiz do projeto');
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
 * Script para gerar slugs amigáveis para empresas que não possuem
 */
async function generateCompanySlugs() {
    console.log('🔄 Iniciando geração de slugs para empresas...\n');

    try {
        // Buscar todas as empresas sem slug
        const { data: companies, error: fetchError } = await supabase
            .from('companies')
            .select('id, name, slug')
            .or('slug.is.null,slug.eq.');

        if (fetchError) {
            console.error('❌ Erro ao buscar empresas:', fetchError);
            return;
        }

        if (!companies || companies.length === 0) {
            console.log('✅ Todas as empresas já possuem slugs!');
            return;
        }

        console.log(`📊 Encontradas ${companies.length} empresas sem slug\n`);

        // Gerar e atualizar slugs
        let successCount = 0;
        let errorCount = 0;

        for (const company of companies) {
            const slug = generateSlug(company.name);

            // Verificar se o slug já existe
            const { data: existingSlug } = await supabase
                .from('companies')
                .select('id')
                .eq('slug', slug)
                .neq('id', company.id)
                .single();

            // Se o slug já existe, adicionar um sufixo único
            const finalSlug = existingSlug
                ? `${slug}-${company.id.slice(0, 8)}`
                : slug;

            // Atualizar empresa com o novo slug
            const { error: updateError } = await supabase
                .from('companies')
                .update({ slug: finalSlug })
                .eq('id', company.id);

            if (updateError) {
                console.error(`❌ Erro ao atualizar "${company.name}":`, updateError.message);
                errorCount++;
            } else {
                console.log(`✅ ${company.name.padEnd(40)} → ${finalSlug}`);
                successCount++;
            }
        }

        console.log('\n' + '='.repeat(60));
        console.log('📈 Resumo:');
        console.log(`   ✅ Sucesso: ${successCount}`);
        console.log(`   ❌ Erros: ${errorCount}`);
        console.log('='.repeat(60));
        console.log('🎉 Processo concluído!\n');

    } catch (error) {
        console.error('❌ Erro geral:', error);
        process.exit(1);
    }
}

// Executar o script
generateCompanySlugs()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error('❌ Erro fatal:', error);
        process.exit(1);
    });
