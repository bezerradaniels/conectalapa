import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plane, Briefcase, Globe, BarChart3, Users, MessageCircle, Search, Asterisk, ArrowLeft } from 'lucide-react';

import { useAuth } from '../../contexts/AuthContext';

export const Signup: React.FC = () => {
    const navigate = useNavigate();
    const { signUp, profile } = useAuth();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [whatsapp, setWhatsapp] = useState('');
    const [password, setPassword] = useState('');
    const [acceptedTerms, setAcceptedTerms] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [justSignedUp, setJustSignedUp] = useState(false);

    // Redirecionar quando o perfil for carregado após o cadastro
    React.useEffect(() => {
        if (justSignedUp && profile) {
            setLoading(false);
            navigate('/painel');
        }

        // Timeout de segurança: se após 5s o perfil não carregar, desbloqueia o botão
        if (justSignedUp && !profile) {
            const timeout = setTimeout(() => {
                setLoading(false);
                setError('Conta criada, mas houve um problema ao carregar o perfil. Tente fazer login.');
            }, 5000);
            return () => clearTimeout(timeout);
        }
    }, [profile, justSignedUp, navigate]);

    const validateEmail = (email: string): boolean => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const validateWhatsApp = (phone: string): boolean => {
        const phoneRegex = /^\(?([0-9]{2})\)?[-. ]?([0-9]{4,5})[-. ]?([0-9]{4})$/;
        return phoneRegex.test(phone.replace(/\s/g, ''));
    };

    const formatWhatsApp = (value: string): string => {
        const cleaned = value.replace(/\D/g, '');
        if (cleaned.length <= 2) return cleaned;
        if (cleaned.length <= 7) return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2)}`;
        if (cleaned.length <= 11) return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7)}`;
        return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7, 11)}`;
    };

    const handleWhatsAppChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const formatted = formatWhatsApp(e.target.value);
        setWhatsapp(formatted);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!validateEmail(email)) {
            setError('Email inválido');
            return;
        }

        if (!validateWhatsApp(whatsapp)) {
            setError('WhatsApp inválido. Use o formato: (77) 99999-9999');
            return;
        }

        if (!acceptedTerms) {
            setError('Você deve aceitar os Termos de Serviço para continuar');
            return;
        }

        setLoading(true);

        try {
            await signUp(email, password, name);
            setJustSignedUp(true);
        } catch (err: any) {
            setError(err.message || 'Erro ao criar conta');
            setJustSignedUp(false);
            setLoading(false);
        }
    };

    return (
        <div className="h-screen bg-[#FAF8F5] flex items-center justify-center px-4 py-4 overflow-hidden">
            <div className="w-full max-w-6xl h-[calc(100vh-2rem)] bg-white/90 backdrop-blur-sm rounded-[2rem] shadow-2xl flex flex-col lg:flex-row overflow-hidden">
                {/* Visual Section - Left Side */}
                <div className="relative flex-1 bg-gradient-to-br from-[#FAF8F5] to-[#F4F4F4] flex items-center justify-center p-8 lg:p-12">
                    {/* Main Image */}
                    <div className="relative z-0">
                        <img
                            src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80"
                            alt="Pessoa organizando trabalho"
                            className="rounded-3xl shadow-2xl object-cover w-[280px] h-[360px] lg:w-[320px] lg:h-[420px]"
                        />
                    </div>

                    {/* Floating Icons & Badges */}
                    {/* Travel Badge - Top Left */}
                    <div className="absolute top-8 left-6 lg:top-12 lg:left-8 animate-float z-10">
                        <div className="backdrop-blur-md bg-white/70 rounded-2xl shadow-xl p-3 flex items-center gap-2 border border-white/40">
                            <div className="w-10 h-10 rounded-xl bg-[#00A82D]/10 flex items-center justify-center">
                                <Plane size={20} className="text-[#00A82D]" strokeWidth={2} />
                            </div>
                            <div className="pr-2">
                                <p className="text-xs font-semibold text-neutral-800">Viagens</p>
                                <p className="text-[10px] text-neutral-500">Explore destinos</p>
                            </div>
                        </div>
                    </div>

                    {/* Business Badge - Top Right */}
                    <div className="absolute top-16 right-6 lg:top-20 lg:right-12 animate-float-delayed z-10">
                        <div className="backdrop-blur-md bg-yellow-50/80 rounded-2xl shadow-xl p-3 flex items-center gap-2 border border-yellow-100/40">
                            <div className="w-10 h-10 rounded-xl bg-yellow-100 flex items-center justify-center">
                                <BarChart3 size={20} className="text-yellow-700" strokeWidth={2} />
                            </div>
                            <div className="pr-2">
                                <p className="text-xs font-semibold text-neutral-800">Business</p>
                                <p className="text-[10px] text-neutral-500">Gerencie empresas</p>
                            </div>
                        </div>
                    </div>

                    {/* Employment Badge - Middle Left */}
                    <div className="absolute top-1/2 left-4 lg:left-8 -translate-y-1/2 animate-float z-10">
                        <div className="backdrop-blur-md bg-white/70 rounded-2xl shadow-xl p-3 flex items-center gap-2 border border-white/40">
                            <div className="w-10 h-10 rounded-xl bg-[#00A82D]/10 flex items-center justify-center">
                                <Briefcase size={20} className="text-[#00A82D]" strokeWidth={2} />
                            </div>
                            <div className="pr-2">
                                <p className="text-xs font-semibold text-neutral-800">Emprego</p>
                                <p className="text-[10px] text-neutral-500">Encontre vagas</p>
                            </div>
                        </div>
                    </div>

                    {/* Social Badge - Bottom Left */}
                    <div className="absolute bottom-12 left-6 lg:bottom-16 lg:left-10 animate-float-delayed z-10">
                        <div className="backdrop-blur-md bg-gray-50/80 rounded-2xl shadow-xl p-3 flex items-center gap-2 border border-gray-100/40">
                            <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center">
                                <Users size={20} className="text-gray-600" strokeWidth={2} />
                            </div>
                            <div className="pr-2">
                                <p className="text-xs font-semibold text-neutral-800">Social</p>
                                <p className="text-[10px] text-neutral-500">Conecte-se</p>
                            </div>
                        </div>
                    </div>

                    {/* Globe Icon - Bottom Right */}
                    <div className="absolute bottom-10 right-8 lg:bottom-14 lg:right-14 animate-float z-10">
                        <div className="backdrop-blur-md bg-white/70 rounded-full shadow-xl p-3 border border-white/40">
                            <Globe size={24} className="text-[#00A82D]" strokeWidth={2} />
                        </div>
                    </div>

                    {/* Artistic Floating Elements */}
                    <div className="absolute top-1/3 left-2 lg:left-4 animate-float-delayed z-10">
                        <div className="bg-[#00A82D]/10 text-[#00A82D] rounded-full px-5 py-2 text-xs font-bold shadow-lg backdrop-blur-sm border border-[#00A82D]/20">
                            Organização
                        </div>
                    </div>

                    <div className="absolute bottom-6 right-1/3 translate-x-1/2 animate-float z-10">
                        <div className="bg-yellow-100 text-yellow-700 rounded-full px-4 py-2 text-xs font-bold shadow-lg border border-yellow-200">
                            Comunidade
                        </div>
                    </div>

                    {/* Small Floating Icons */}
                    <div className="absolute top-1/3 right-4 opacity-60 animate-float-delayed z-10">
                        <MessageCircle size={18} className="text-[#00A82D]" strokeWidth={2} />
                    </div>

                    <div className="absolute bottom-1/3 left-2 opacity-60 animate-float z-10">
                        <Search size={18} className="text-gray-400" strokeWidth={2} />
                    </div>
                </div>

                {/* Form Section - Right Side */}
                <div className="flex-1 flex flex-col justify-center p-6 lg:p-10 bg-white overflow-y-auto">
                    <Link
                        to="/"
                        className="inline-flex items-center gap-2 text-neutral-600 hover:text-[#00A82D] transition-colors mb-6 w-fit cursor-pointer"
                    >
                        <ArrowLeft size={18} />
                        <span className="text-sm font-medium">Voltar para a home</span>
                    </Link>

                    <h1 className="text-3xl lg:text-4xl font-bold text-neutral-900 mb-3 leading-tight">
                        Crie sua conta
                    </h1>
                    <p className="text-sm lg:text-base text-neutral-600 mb-6 leading-relaxed">
                        Comece a organizar sua vida profissional e social em um só lugar. É rápido, seguro e gratuito.
                    </p>

                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl text-red-700 text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-xs font-semibold text-neutral-800 mb-1.5 flex items-center gap-1">
                                Nome
                                <Asterisk size={8} className="text-red-500" />
                            </label>
                            <input
                                type="text"
                                className="w-full h-12 px-4 rounded-xl border-2 border-[#E7E7E7] bg-[#FAFAFA] text-neutral-900 placeholder:text-neutral-400 focus:border-[#00A82D] focus:ring-2 focus:ring-[#D8F5E0] outline-none transition-all duration-200"
                                placeholder="Seu nome completo"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-neutral-800 mb-1.5 flex items-center gap-1">
                                Email
                                <Asterisk size={8} className="text-red-500" />
                            </label>
                            <input
                                type="email"
                                className="w-full h-12 px-4 rounded-xl border-2 border-[#E7E7E7] bg-[#FAFAFA] text-neutral-900 placeholder:text-neutral-400 focus:border-[#00A82D] focus:ring-2 focus:ring-[#D8F5E0] outline-none transition-all duration-200"
                                placeholder="seu@email.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-neutral-800 mb-1.5 flex items-center gap-1">
                                WhatsApp
                                <Asterisk size={8} className="text-red-500" />
                            </label>
                            <input
                                type="tel"
                                className="w-full h-12 px-4 rounded-xl border-2 border-[#E7E7E7] bg-[#FAFAFA] text-neutral-900 placeholder:text-neutral-400 focus:border-[#00A82D] focus:ring-2 focus:ring-[#D8F5E0] outline-none transition-all duration-200"
                                placeholder="(77) 99999-9999"
                                value={whatsapp}
                                onChange={handleWhatsAppChange}
                                maxLength={16}
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-neutral-800 mb-1.5 flex items-center gap-1">
                                Senha
                                <Asterisk size={8} className="text-red-500" />
                            </label>
                            <input
                                type="password"
                                className="w-full h-12 px-4 rounded-xl border-2 border-[#E7E7E7] bg-[#FAFAFA] text-neutral-900 placeholder:text-neutral-400 focus:border-[#00A82D] focus:ring-2 focus:ring-[#D8F5E0] outline-none transition-all duration-200"
                                placeholder="Mínimo 6 caracteres"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                minLength={6}
                            />
                        </div>

                        <div className="flex items-start gap-3 pt-2">
                            <input
                                type="checkbox"
                                id="terms"
                                checked={acceptedTerms}
                                onChange={(e) => setAcceptedTerms(e.target.checked)}
                                className="mt-1 w-4 h-4 rounded border-2 border-[#E7E7E7] text-[#00A82D] focus:ring-2 focus:ring-[#D8F5E0] cursor-pointer"
                                required
                            />
                            <label htmlFor="terms" className="text-xs text-neutral-600 leading-relaxed cursor-pointer">
                                Li e aceito os{' '}
                                <Link
                                    to="/termos"
                                    target="_blank"
                                    className="text-[#00A82D] font-semibold hover:text-[#0A7A27] hover:underline cursor-pointer"
                                >
                                    Termos de Serviço
                                </Link>
                                {' '}da plataforma
                            </label>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full h-12 mt-2 rounded-xl bg-[#00A82D] text-white font-bold text-base shadow-xl transition-all duration-200 hover:bg-[#0A7A27] hover:shadow-2xl focus:outline-none focus:ring-2 focus:ring-[#D8F5E0] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                        >
                            {loading ? 'Criando conta...' : 'Criar conta'}
                        </button>
                    </form>

                    <div className="mt-5 text-center">
                        <span className="text-neutral-600 text-sm">Já possui conta? </span>
                        <Link
                            to="/login"
                            className="text-[#00A82D] font-semibold hover:text-[#0A7A27] hover:underline transition-colors cursor-pointer"
                        >
                            Entrar
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};
