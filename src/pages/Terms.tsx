import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Shield, FileText, Users, Lock, AlertCircle, Mail } from 'lucide-react';

export const Terms: React.FC = () => {
    return (
        <div className="min-h-screen bg-[#FAF8F5]">
            {/* Header */}
            <header className="bg-white border-b border-[#E7E7E7] sticky top-0 z-50">
                <div className="max-w-4xl mx-auto px-6 py-4 flex items-center gap-4">
                    <Link
                        to="/signup"
                        className="flex items-center gap-2 text-[#00A82D] hover:text-[#0A7A27] transition-colors font-medium"
                    >
                        <ArrowLeft size={20} />
                        Voltar
                    </Link>
                    <div className="flex items-center gap-2">
                        <Shield className="text-[#00A82D]" size={24} />
                        <h1 className="text-xl font-bold text-neutral-900">Termos de Serviço</h1>
                    </div>
                </div>
            </header>

            {/* Content */}
            <main className="max-w-4xl mx-auto px-6 py-12">
                <div className="bg-white rounded-3xl shadow-lg p-8 lg:p-12">
                    {/* Intro */}
                    <div className="mb-10">
                        <h2 className="text-3xl font-bold text-neutral-900 mb-4">
                            Termos de Serviço - Central de Empresas BJL
                        </h2>
                        <p className="text-sm text-neutral-500 mb-4">
                            <strong>Última atualização:</strong> 29 de novembro de 2025
                        </p>
                        <p className="text-base text-neutral-700 leading-relaxed">
                            Bem-vindo à Central de Empresas de Bom Jesus da Lapa. Ao utilizar nossa plataforma, 
                            você concorda com os termos e condições descritos abaixo. Por favor, leia atentamente 
                            antes de se cadastrar.
                        </p>
                    </div>

                    {/* Section 1 */}
                    <section className="mb-8">
                        <div className="flex items-center gap-3 mb-4">
                            <FileText className="text-[#00A82D]" size={24} />
                            <h3 className="text-2xl font-bold text-neutral-900">1. Aceitação dos Termos</h3>
                        </div>
                        <p className="text-neutral-700 leading-relaxed mb-3">
                            Ao criar uma conta e utilizar os serviços da Central de Empresas BJL, você declara que:
                        </p>
                        <ul className="list-disc list-inside space-y-2 text-neutral-700 ml-4">
                            <li>Tem pelo menos 18 anos de idade ou possui autorização de um responsável legal</li>
                            <li>Todas as informações fornecidas são verdadeiras e precisas</li>
                            <li>Concorda em cumprir todas as leis locais, estaduais e federais aplicáveis</li>
                            <li>Aceita receber comunicações relacionadas ao seu cadastro e atividades na plataforma</li>
                        </ul>
                    </section>

                    {/* Section 2 */}
                    <section className="mb-8">
                        <div className="flex items-center gap-3 mb-4">
                            <Users className="text-[#00A82D]" size={24} />
                            <h3 className="text-2xl font-bold text-neutral-900">2. Uso da Plataforma</h3>
                        </div>
                        <p className="text-neutral-700 leading-relaxed mb-3">
                            A Central de Empresas BJL é uma plataforma para centralizar informações sobre empresas, 
                            vagas de emprego e pacotes de viagem na região de Bom Jesus da Lapa. Os usuários podem:
                        </p>
                        <ul className="list-disc list-inside space-y-2 text-neutral-700 ml-4">
                            <li>Cadastrar informações sobre empresas locais</li>
                            <li>Publicar vagas de emprego</li>
                            <li>Divulgar pacotes de viagem e turismo</li>
                            <li>Buscar e visualizar informações públicas cadastradas por outros usuários</li>
                        </ul>
                        <p className="text-neutral-700 leading-relaxed mt-3">
                            <strong>É proibido:</strong> Publicar conteúdo falso, ofensivo, discriminatório, 
                            ilegal ou que viole direitos de terceiros.
                        </p>
                    </section>

                    {/* Section 3 */}
                    <section className="mb-8">
                        <div className="flex items-center gap-3 mb-4">
                            <Lock className="text-[#00A82D]" size={24} />
                            <h3 className="text-2xl font-bold text-neutral-900">3. Privacidade e Dados</h3>
                        </div>
                        <p className="text-neutral-700 leading-relaxed mb-3">
                            Respeitamos sua privacidade e protegemos seus dados conforme a Lei Geral de Proteção 
                            de Dados (LGPD). Coletamos e armazenamos apenas as informações necessárias para o 
                            funcionamento da plataforma:
                        </p>
                        <ul className="list-disc list-inside space-y-2 text-neutral-700 ml-4">
                            <li>Nome completo</li>
                            <li>Endereço de e-mail</li>
                            <li>Número de WhatsApp</li>
                            <li>Informações de empresas, vagas e pacotes cadastrados</li>
                        </ul>
                        <p className="text-neutral-700 leading-relaxed mt-3">
                            Seus dados não serão compartilhados com terceiros sem seu consentimento explícito, 
                            exceto quando exigido por lei.
                        </p>
                    </section>

                    {/* Section 4 */}
                    <section className="mb-8">
                        <div className="flex items-center gap-3 mb-4">
                            <AlertCircle className="text-[#00A82D]" size={24} />
                            <h3 className="text-2xl font-bold text-neutral-900">4. Moderação de Conteúdo</h3>
                        </div>
                        <p className="text-neutral-700 leading-relaxed mb-3">
                            Todos os cadastros passam por moderação antes de serem publicados. A equipe 
                            administrativa se reserva o direito de:
                        </p>
                        <ul className="list-disc list-inside space-y-2 text-neutral-700 ml-4">
                            <li>Aprovar ou rejeitar cadastros que não atendam aos critérios da plataforma</li>
                            <li>Remover conteúdo inadequado ou que viole os termos de serviço</li>
                            <li>Suspender ou banir usuários que violarem repetidamente as regras</li>
                            <li>Editar informações para correção de erros ou adequação às normas</li>
                        </ul>
                    </section>

                    {/* Section 5 */}
                    <section className="mb-8">
                        <div className="flex items-center gap-3 mb-4">
                            <Shield className="text-[#00A82D]" size={24} />
                            <h3 className="text-2xl font-bold text-neutral-900">5. Responsabilidades</h3>
                        </div>
                        <p className="text-neutral-700 leading-relaxed mb-3">
                            A Central de Empresas BJL atua como intermediária e não se responsabiliza por:
                        </p>
                        <ul className="list-disc list-inside space-y-2 text-neutral-700 ml-4">
                            <li>Veracidade das informações cadastradas pelos usuários</li>
                            <li>Transações comerciais realizadas entre usuários e empresas</li>
                            <li>Qualidade dos serviços, produtos ou vagas anunciados</li>
                            <li>Danos diretos ou indiretos decorrentes do uso da plataforma</li>
                        </ul>
                        <p className="text-neutral-700 leading-relaxed mt-3">
                            Os usuários são os únicos responsáveis pelas informações que cadastram e pelas 
                            consequências de suas ações na plataforma.
                        </p>
                    </section>

                    {/* Section 6 */}
                    <section className="mb-8">
                        <div className="flex items-center gap-3 mb-4">
                            <FileText className="text-[#00A82D]" size={24} />
                            <h3 className="text-2xl font-bold text-neutral-900">6. Propriedade Intelectual</h3>
                        </div>
                        <p className="text-neutral-700 leading-relaxed">
                            Todo o conteúdo da plataforma (design, código, textos, logos) é de propriedade 
                            exclusiva da Central de Empresas BJL. É proibida a reprodução, distribuição ou 
                            uso comercial sem autorização prévia por escrito.
                        </p>
                    </section>

                    {/* Section 7 */}
                    <section className="mb-8">
                        <div className="flex items-center gap-3 mb-4">
                            <AlertCircle className="text-[#00A82D]" size={24} />
                            <h3 className="text-2xl font-bold text-neutral-900">7. Alterações nos Termos</h3>
                        </div>
                        <p className="text-neutral-700 leading-relaxed">
                            Reservamo-nos o direito de modificar estes Termos de Serviço a qualquer momento. 
                            Os usuários serão notificados por e-mail sobre alterações significativas. O uso 
                            continuado da plataforma após as alterações constitui aceitação dos novos termos.
                        </p>
                    </section>

                    {/* Section 8 */}
                    <section className="mb-8">
                        <div className="flex items-center gap-3 mb-4">
                            <Mail className="text-[#00A82D]" size={24} />
                            <h3 className="text-2xl font-bold text-neutral-900">8. Contato</h3>
                        </div>
                        <p className="text-neutral-700 leading-relaxed mb-3">
                            Para dúvidas, sugestões ou reclamações sobre os Termos de Serviço, entre em contato:
                        </p>
                        <div className="bg-[#FAF8F5] rounded-xl p-4 border border-[#E7E7E7]">
                            <p className="text-neutral-700">
                                <strong>Email:</strong> contato@centralbjl.com.br
                            </p>
                            <p className="text-neutral-700">
                                <strong>WhatsApp:</strong> (77) 99999-9999
                            </p>
                            <p className="text-neutral-700">
                                <strong>Endereço:</strong> Bom Jesus da Lapa - BA
                            </p>
                        </div>
                    </section>

                    {/* Footer */}
                    <div className="mt-12 pt-8 border-t border-[#E7E7E7]">
                        <p className="text-sm text-neutral-500 text-center">
                            Ao clicar em "Criar conta", você declara que leu, compreendeu e aceita 
                            integralmente os Termos de Serviço da Central de Empresas BJL.
                        </p>
                    </div>
                </div>
            </main>
        </div>
    );
};
