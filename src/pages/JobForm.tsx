import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Briefcase, Building2, ArrowLeft, Mail, MessageCircle, Linkedin } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export const JobForm: React.FC = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [currentStep, setCurrentStep] = useState(1);
    
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        company_name: '',
        salary: '',
        deadline: '',
        application_email: false,
        application_whatsapp: false,
        application_in_person: false,
        application_linkedin: false,
    });

    useEffect(() => {
        if (!user) {
            navigate('/login');
        }
    }, [user, navigate]);

    const nextStep = () => {
        if (currentStep < 3) setCurrentStep(currentStep + 1);
    };

    const prevStep = () => {
        if (currentStep > 1) setCurrentStep(currentStep - 1);
    };

    const validateStep1 = () => {
        return formData.title && formData.company_name;
    };

    const validateStep2 = () => {
        return formData.description;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            // TODO: Inserção no banco
            navigate('/painel');
        } catch (err: any) {
            setError(err.message || 'Erro ao cadastrar vaga');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="h-screen bg-[#FAF8F5] flex items-center justify-center px-4 py-4 overflow-hidden">
            <div className="w-full max-w-6xl h-[calc(100vh-2rem)] bg-white/90 backdrop-blur-sm rounded-[2rem] shadow-2xl flex flex-col lg:flex-row overflow-hidden">
                {/* Visual Section */}
                <div className="relative flex-1 bg-gradient-to-br from-[#FAF8F5] to-[#F4F4F4] flex items-center justify-center p-8 lg:p-12">
                    <div className="relative z-0">
                        <img
                            src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=600&q=80"
                            alt="Vagas"
                            className="rounded-3xl shadow-2xl object-cover w-[280px] h-[360px] lg:w-[320px] lg:h-[420px]"
                        />
                    </div>

                    <div className="absolute top-8 left-6 lg:top-12 lg:left-8 animate-float z-10">
                        <div className="backdrop-blur-md bg-white/70 rounded-2xl shadow-xl p-3 flex items-center gap-2 border border-white/40">
                            <div className="w-10 h-10 rounded-xl bg-[#00A82D]/10 flex items-center justify-center">
                                <Briefcase size={20} className="text-[#00A82D]" strokeWidth={2} />
                            </div>
                            <div className="pr-2">
                                <p className="text-xs font-semibold text-neutral-800">Sua Vaga</p>
                                <p className="text-[10px] text-neutral-500">Encontre talentos</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Form Section */}
                <div className="flex-1 flex flex-col justify-center p-6 lg:p-10 bg-white overflow-y-auto">
                    <Link
                        to="/painel"
                        className="inline-flex items-center gap-2 text-neutral-600 hover:text-[#00A82D] transition-colors mb-6 w-fit cursor-pointer"
                    >
                        <ArrowLeft size={18} />
                        <span className="text-sm font-medium">Voltar para o painel</span>
                    </Link>
                    
                    <h1 className="text-3xl lg:text-4xl font-bold text-neutral-900 mb-3 leading-tight">
                        Cadastre uma vaga
                    </h1>
                    <p className="text-sm lg:text-base text-neutral-600 mb-4 leading-relaxed">
                        Encontre profissionais qualificados para sua empresa.
                    </p>

                    {/* Progress Indicator */}
                    <div className="flex items-center justify-center gap-2 mb-6">
                        {[1, 2, 3].map((step) => (
                            <div key={step} className="flex items-center">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                                    currentStep >= step ? 'bg-[#00A82D] text-white' : 'bg-gray-200 text-gray-500'
                                }`}>
                                    {step}
                                </div>
                                {step < 3 && (
                                    <div className={`w-8 h-1 mx-1 transition-all ${
                                        currentStep > step ? 'bg-[#00A82D]' : 'bg-gray-200'
                                    }`} />
                                )}
                            </div>
                        ))}
                    </div>

                    <p className="text-center text-sm text-neutral-600 mb-6">
                        {currentStep === 1 && 'Etapa 1 de 3: Informações da Vaga'}
                        {currentStep === 2 && 'Etapa 2 de 3: Descrição'}
                        {currentStep === 3 && 'Etapa 3 de 3: Como se Candidatar'}
                    </p>

                    {error && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Step 1 */}
                        {currentStep === 1 && (
                            <>
                                <div>
                                    <label className="block text-xs font-semibold text-neutral-800 mb-1.5">Nome da Vaga</label>
                                    <input
                                        type="text"
                                        className="w-full h-12 px-4 rounded-xl border-2 border-[#E7E7E7] bg-[#FAFAFA] text-neutral-900 placeholder:text-neutral-400 focus:border-[#00A82D] focus:ring-2 focus:ring-[#D8F5E0] outline-none transition-all duration-200"
                                        placeholder="Ex: Desenvolvedor Frontend"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-neutral-800 mb-1.5">Nome da Empresa</label>
                                    <input
                                        type="text"
                                        className="w-full h-12 px-4 rounded-xl border-2 border-[#E7E7E7] bg-[#FAFAFA] text-neutral-900 placeholder:text-neutral-400 focus:border-[#00A82D] focus:ring-2 focus:ring-[#D8F5E0] outline-none transition-all duration-200"
                                        placeholder="Nome da sua empresa"
                                        value={formData.company_name}
                                        onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-neutral-800 mb-1.5">Salário</label>
                                    <input
                                        type="text"
                                        className="w-full h-12 px-4 rounded-xl border-2 border-[#E7E7E7] bg-[#FAFAFA] text-neutral-900 placeholder:text-neutral-400 focus:border-[#00A82D] focus:ring-2 focus:ring-[#D8F5E0] outline-none transition-all duration-200"
                                        placeholder="Ex: R$ 3.000,00 ou A definir"
                                        value={formData.salary}
                                        onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-neutral-800 mb-1.5">Prazo para Candidatura</label>
                                    <input
                                        type="date"
                                        className="w-full h-12 px-4 rounded-xl border-2 border-[#E7E7E7] bg-[#FAFAFA] text-neutral-900 focus:border-[#00A82D] focus:ring-2 focus:ring-[#D8F5E0] outline-none transition-all duration-200"
                                        value={formData.deadline}
                                        onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                                    />
                                </div>

                                <button
                                    type="button"
                                    onClick={nextStep}
                                    disabled={!validateStep1()}
                                    className="w-full h-12 mt-4 rounded-xl bg-[#00A82D] text-white font-bold text-base shadow-xl transition-all duration-200 hover:bg-[#0A7A27] hover:shadow-2xl focus:outline-none focus:ring-2 focus:ring-[#D8F5E0] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                                >
                                    Próximo
                                </button>
                            </>
                        )}

                        {/* Step 2 */}
                        {currentStep === 2 && (
                            <>
                                <div>
                                    <label className="block text-xs font-semibold text-neutral-800 mb-1.5">Descrição da Vaga</label>
                                    <textarea
                                        className="w-full h-40 px-4 py-3 rounded-xl border-2 border-[#E7E7E7] bg-[#FAFAFA] text-neutral-900 placeholder:text-neutral-400 focus:border-[#00A82D] focus:ring-2 focus:ring-[#D8F5E0] outline-none transition-all duration-200 resize-none"
                                        placeholder="Descreva as responsabilidades, requisitos e benefícios da vaga..."
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        required
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4 mt-4">
                                    <button
                                        type="button"
                                        onClick={prevStep}
                                        className="h-12 rounded-xl bg-gray-200 text-gray-700 font-bold text-base transition-all duration-200 hover:bg-gray-300 cursor-pointer"
                                    >
                                        Voltar
                                    </button>
                                    <button
                                        type="button"
                                        onClick={nextStep}
                                        disabled={!validateStep2()}
                                        className="h-12 rounded-xl bg-[#00A82D] text-white font-bold text-base shadow-xl transition-all duration-200 hover:bg-[#0A7A27] hover:shadow-2xl focus:outline-none focus:ring-2 focus:ring-[#D8F5E0] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                                    >
                                        Próximo
                                    </button>
                                </div>
                            </>
                        )}

                        {/* Step 3 */}
                        {currentStep === 3 && (
                            <>
                                <div>
                                    <label className="block text-sm font-semibold text-neutral-800 mb-3">Como os candidatos devem se inscrever?</label>
                                    
                                    <div className="space-y-3">
                                        <label className="flex items-center gap-3 p-3 border-2 border-gray-200 rounded-xl hover:border-[#00A82D] transition-all cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={formData.application_email}
                                                onChange={(e) => setFormData({ ...formData, application_email: e.target.checked })}
                                                className="w-5 h-5 rounded border-2 border-[#E7E7E7] text-[#00A82D] focus:ring-2 focus:ring-[#D8F5E0] cursor-pointer"
                                            />
                                            <Mail size={20} className="text-[#00A82D]" />
                                            <span className="text-sm font-medium text-neutral-800">Enviar e-mail</span>
                                        </label>

                                        <label className="flex items-center gap-3 p-3 border-2 border-gray-200 rounded-xl hover:border-[#00A82D] transition-all cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={formData.application_whatsapp}
                                                onChange={(e) => setFormData({ ...formData, application_whatsapp: e.target.checked })}
                                                className="w-5 h-5 rounded border-2 border-[#E7E7E7] text-[#00A82D] focus:ring-2 focus:ring-[#D8F5E0] cursor-pointer"
                                            />
                                            <MessageCircle size={20} className="text-[#00A82D]" />
                                            <span className="text-sm font-medium text-neutral-800">Falar no WhatsApp</span>
                                        </label>

                                        <label className="flex items-center gap-3 p-3 border-2 border-gray-200 rounded-xl hover:border-[#00A82D] transition-all cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={formData.application_in_person}
                                                onChange={(e) => setFormData({ ...formData, application_in_person: e.target.checked })}
                                                className="w-5 h-5 rounded border-2 border-[#E7E7E7] text-[#00A82D] focus:ring-2 focus:ring-[#D8F5E0] cursor-pointer"
                                            />
                                            <Building2 size={20} className="text-[#00A82D]" />
                                            <span className="text-sm font-medium text-neutral-800">Deixar currículo na empresa</span>
                                        </label>

                                        <label className="flex items-center gap-3 p-3 border-2 border-gray-200 rounded-xl hover:border-[#00A82D] transition-all cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={formData.application_linkedin}
                                                onChange={(e) => setFormData({ ...formData, application_linkedin: e.target.checked })}
                                                className="w-5 h-5 rounded border-2 border-[#E7E7E7] text-[#00A82D] focus:ring-2 focus:ring-[#D8F5E0] cursor-pointer"
                                            />
                                            <Linkedin size={20} className="text-[#00A82D]" />
                                            <span className="text-sm font-medium text-neutral-800">Inscrição pelo LinkedIn</span>
                                        </label>
                                    </div>
                                </div>

                                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mt-4">
                                    <p className="text-sm text-blue-800 font-semibold mb-2">📝 Resumo:</p>
                                    <div className="text-xs text-blue-700 space-y-1">
                                        <p><strong>Vaga:</strong> {formData.title}</p>
                                        <p><strong>Empresa:</strong> {formData.company_name}</p>
                                        <p><strong>Salário:</strong> {formData.salary || 'Não informado'}</p>
                                        <p><strong>Prazo:</strong> {formData.deadline || 'Não informado'}</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4 mt-4">
                                    <button
                                        type="button"
                                        onClick={prevStep}
                                        className="h-12 rounded-xl bg-gray-200 text-gray-700 font-bold text-base transition-all duration-200 hover:bg-gray-300 cursor-pointer"
                                    >
                                        Voltar
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="h-12 rounded-xl bg-[#00A82D] text-white font-bold text-base shadow-xl transition-all duration-200 hover:bg-[#0A7A27] hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                                    >
                                        {loading ? 'Cadastrando...' : 'Cadastrar Vaga'}
                                    </button>
                                </div>
                            </>
                        )}
                    </form>
                </div>
            </div>
        </div>
    );
};
