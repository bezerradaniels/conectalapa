import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Building2, MapPin, Phone, Tag, FileText, Image as ImageIcon, ArrowLeft, Store, TrendingUp, Users } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

export const CompanyForm: React.FC = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [categories, setCategories] = useState<any[]>([]);
    const [neighborhoods, setNeighborhoods] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [currentStep, setCurrentStep] = useState(1);
    const [logo, setLogo] = useState<File | null>(null);
    const [coverImage, setCoverImage] = useState<File | null>(null);
    const [galleryImages, setGalleryImages] = useState<File[]>([]);
    
    const [formData, setFormData] = useState({
        name: '',
        category_id: '',
        neighborhood_id: '',
        description: '',
        address: '',
        phone: '',
        whatsapp: '',
        email: '',
    });

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }
        loadCategories();
        loadNeighborhoods();
    }, [user, navigate]);

    const loadCategories = async () => {
        const { data } = await supabase
            .from('business_categories')
            .select('*')
            .is('parent_id', null)
            .order('sort_order');
        if (data) setCategories(data);
    };

    const loadNeighborhoods = async () => {
        const { data } = await supabase
            .from('neighborhoods')
            .select('*')
            .order('name');
        if (data) setNeighborhoods(data);
    };

    const formatPhone = (value: string): string => {
        const cleaned = value.replace(/\D/g, '');
        if (cleaned.length <= 2) return cleaned;
        if (cleaned.length <= 7) return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2)}`;
        if (cleaned.length <= 11) return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7)}`;
        return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7, 11)}`;
    };

    const handlePhoneChange = (field: 'phone' | 'whatsapp', value: string) => {
        setFormData({ ...formData, [field]: formatPhone(value) });
    };

    const nextStep = () => {
        if (currentStep < 4) setCurrentStep(currentStep + 1);
    };

    const prevStep = () => {
        if (currentStep > 1) setCurrentStep(currentStep - 1);
    };

    const validateStep1 = () => {
        return formData.name && formData.category_id && formData.neighborhood_id;
    };

    const validateStep2 = () => {
        return formData.address && formData.whatsapp;
    };

    const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const validTypes = ['image/png', 'image/jpeg', 'image/webp'];
            if (!validTypes.includes(file.type)) {
                setError('Logo deve ser PNG, JPG ou WEBP');
                return;
            }
            setLogo(file);
            setError('');
        }
    };

    const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const validTypes = ['image/png', 'image/jpeg', 'image/webp'];
            if (!validTypes.includes(file.type)) {
                setError('Capa deve ser PNG, JPG ou WEBP');
                return;
            }
            setCoverImage(file);
            setError('');
        }
    };

    const handleGalleryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (galleryImages.length + files.length > 10) {
            setError('Máximo de 10 imagens na galeria');
            return;
        }
        
        const validTypes = ['image/png', 'image/jpeg', 'image/webp'];
        const validFiles = files.filter(file => validTypes.includes(file.type));
        
        if (validFiles.length !== files.length) {
            setError('Todas as imagens devem ser PNG, JPG ou WEBP');
            return;
        }
        
        setGalleryImages([...galleryImages, ...validFiles]);
        setError('');
    };

    const removeGalleryImage = (index: number) => {
        setGalleryImages(galleryImages.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const { error: insertError } = await supabase
                .from('companies')
                .insert({
                    ...formData,
                    user_id: user?.id,
                    status: 'pending'
                });

            if (insertError) throw insertError;

            navigate('/painel');
        } catch (err: any) {
            setError(err.message || 'Erro ao cadastrar empresa');
        } finally {
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
                            src="https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=600&q=80"
                            alt="Empreendedorismo"
                            className="rounded-3xl shadow-2xl object-cover w-[280px] h-[360px] lg:w-[320px] lg:h-[420px]"
                        />
                    </div>

                    {/* Floating Icons & Badges */}
                    <div className="absolute top-8 left-6 lg:top-12 lg:left-8 animate-float z-10">
                        <div className="backdrop-blur-md bg-white/70 rounded-2xl shadow-xl p-3 flex items-center gap-2 border border-white/40">
                            <div className="w-10 h-10 rounded-xl bg-[#00A82D]/10 flex items-center justify-center">
                                <Store size={20} className="text-[#00A82D]" strokeWidth={2} />
                            </div>
                            <div className="pr-2">
                                <p className="text-xs font-semibold text-neutral-800">Seu Negócio</p>
                                <p className="text-[10px] text-neutral-500">Na plataforma</p>
                            </div>
                        </div>
                    </div>

                    <div className="absolute top-16 right-6 lg:top-20 lg:right-12 animate-float-delayed z-10">
                        <div className="backdrop-blur-md bg-yellow-50/80 rounded-2xl shadow-xl p-3 flex items-center gap-2 border border-yellow-100/40">
                            <div className="w-10 h-10 rounded-xl bg-yellow-100 flex items-center justify-center">
                                <TrendingUp size={20} className="text-yellow-700" strokeWidth={2} />
                            </div>
                            <div className="pr-2">
                                <p className="text-xs font-semibold text-neutral-800">Crescimento</p>
                                <p className="text-[10px] text-neutral-500">Alcance clientes</p>
                            </div>
                        </div>
                    </div>

                    <div className="absolute bottom-12 left-6 lg:bottom-16 lg:left-10 animate-float-delayed z-10">
                        <div className="backdrop-blur-md bg-gray-50/80 rounded-2xl shadow-xl p-3 flex items-center gap-2 border border-gray-100/40">
                            <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center">
                                <Users size={20} className="text-gray-600" strokeWidth={2} />
                            </div>
                            <div className="pr-2">
                                <p className="text-xs font-semibold text-neutral-800">Visibilidade</p>
                                <p className="text-[10px] text-neutral-500">Mais clientes</p>
                            </div>
                        </div>
                    </div>

                    <div className="absolute bottom-10 right-8 lg:bottom-14 lg:right-14 animate-float z-10">
                        <div className="backdrop-blur-md bg-white/70 rounded-full shadow-xl p-3 border border-white/40">
                            <Building2 size={24} className="text-[#00A82D]" strokeWidth={2} />
                        </div>
                    </div>

                    <div className="absolute top-1/3 left-2 lg:left-4 animate-float-delayed z-10">
                        <div className="bg-[#00A82D]/10 text-[#00A82D] rounded-full px-5 py-2 text-xs font-bold shadow-lg backdrop-blur-sm border border-[#00A82D]/20">
                            Divulgação
                        </div>
                    </div>

                    <div className="absolute bottom-6 right-1/3 translate-x-1/2 animate-float z-10">
                        <div className="bg-yellow-100 text-yellow-700 rounded-full px-4 py-2 text-xs font-bold shadow-lg border border-yellow-200">
                            Oportunidades
                        </div>
                    </div>
                </div>

                {/* Form Section - Right Side */}
                <div className="flex-1 flex flex-col justify-center p-6 lg:p-10 bg-white overflow-y-auto">
                    <Link
                        to="/painel"
                        className="inline-flex items-center gap-2 text-neutral-600 hover:text-[#00A82D] transition-colors mb-6 w-fit"
                    >
                        <ArrowLeft size={18} />
                        <span className="text-sm font-medium">Voltar para o painel</span>
                    </Link>
                    
                    <h1 className="text-3xl lg:text-4xl font-bold text-neutral-900 mb-3 leading-tight">
                        Cadastre sua empresa
                    </h1>
                    <p className="text-sm lg:text-base text-neutral-600 mb-4 leading-relaxed">
                        Preencha os dados e comece a divulgar seu negócio na plataforma.
                    </p>

                    {/* Progress Indicator */}
                    <div className="flex items-center justify-center gap-2 mb-6">
                        {[1, 2, 3, 4].map((step) => (
                            <div key={step} className="flex items-center">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                                    currentStep >= step 
                                        ? 'bg-[#00A82D] text-white' 
                                        : 'bg-gray-200 text-gray-500'
                                }`}>
                                    {step}
                                </div>
                                {step < 4 && (
                                    <div className={`w-8 h-1 mx-1 transition-all ${
                                        currentStep > step ? 'bg-[#00A82D]' : 'bg-gray-200'
                                    }`} />
                                )}
                            </div>
                        ))}
                    </div>

                    <p className="text-center text-sm text-neutral-600 mb-6">
                        {currentStep === 1 && 'Etapa 1 de 4: Informações Básicas'}
                        {currentStep === 2 && 'Etapa 2 de 4: Localização e Contato'}
                        {currentStep === 3 && 'Etapa 3 de 4: Imagens'}
                        {currentStep === 4 && 'Etapa 4 de 4: Descrição'}
                    </p>

                    {error && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Step 1: Informações Básicas */}
                        {currentStep === 1 && (
                            <>
                                <div>
                                    <label className="block text-xs font-semibold text-neutral-800 mb-1.5">Nome da Empresa</label>
                                    <input
                                        type="text"
                                        className="w-full h-12 px-4 rounded-xl border-2 border-[#E7E7E7] bg-[#FAFAFA] text-neutral-900 placeholder:text-neutral-400 focus:border-[#00A82D] focus:ring-2 focus:ring-[#D8F5E0] outline-none transition-all duration-200"
                                        placeholder="Nome do seu negócio"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-neutral-800 mb-1.5">Categoria</label>
                                    <select
                                        className="w-full h-12 px-4 rounded-xl border-2 border-[#E7E7E7] bg-[#FAFAFA] text-neutral-900 focus:border-[#00A82D] focus:ring-2 focus:ring-[#D8F5E0] outline-none transition-all duration-200"
                                        value={formData.category_id}
                                        onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                                        required
                                    >
                                        <option value="">Selecione uma categoria</option>
                                        {categories.map(cat => (
                                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-neutral-800 mb-1.5">Bairro</label>
                                    <select
                                        className="w-full h-12 px-4 rounded-xl border-2 border-[#E7E7E7] bg-[#FAFAFA] text-neutral-900 focus:border-[#00A82D] focus:ring-2 focus:ring-[#D8F5E0] outline-none transition-all duration-200"
                                        value={formData.neighborhood_id}
                                        onChange={(e) => setFormData({ ...formData, neighborhood_id: e.target.value })}
                                        required
                                    >
                                        <option value="">Selecione um bairro</option>
                                        {neighborhoods.map(nb => (
                                            <option key={nb.id} value={nb.id}>{nb.name}</option>
                                        ))}
                                    </select>
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

                        {/* Step 2: Localização e Contato */}
                        {currentStep === 2 && (
                            <>
                                <div>
                                    <label className="block text-xs font-semibold text-neutral-800 mb-1.5">Endereço</label>
                                    <input
                                        type="text"
                                        className="w-full h-12 px-4 rounded-xl border-2 border-[#E7E7E7] bg-[#FAFAFA] text-neutral-900 placeholder:text-neutral-400 focus:border-[#00A82D] focus:ring-2 focus:ring-[#D8F5E0] outline-none transition-all duration-200"
                                        placeholder="Rua, número, complemento"
                                        value={formData.address}
                                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                        required
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-semibold text-neutral-800 mb-1.5">Telefone</label>
                                        <input
                                            type="tel"
                                            className="w-full h-12 px-4 rounded-xl border-2 border-[#E7E7E7] bg-[#FAFAFA] text-neutral-900 placeholder:text-neutral-400 focus:border-[#00A82D] focus:ring-2 focus:ring-[#D8F5E0] outline-none transition-all duration-200"
                                            placeholder="(77) 3491-0000"
                                            value={formData.phone}
                                            onChange={(e) => handlePhoneChange('phone', e.target.value)}
                                            maxLength={16}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-neutral-800 mb-1.5">WhatsApp</label>
                                        <input
                                            type="tel"
                                            className="w-full h-12 px-4 rounded-xl border-2 border-[#E7E7E7] bg-[#FAFAFA] text-neutral-900 placeholder:text-neutral-400 focus:border-[#00A82D] focus:ring-2 focus:ring-[#D8F5E0] outline-none transition-all duration-200"
                                            placeholder="(77) 99999-9999"
                                            value={formData.whatsapp}
                                            onChange={(e) => handlePhoneChange('whatsapp', e.target.value)}
                                            maxLength={16}
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-neutral-800 mb-1.5">E-mail</label>
                                    <input
                                        type="email"
                                        className="w-full h-12 px-4 rounded-xl border-2 border-[#E7E7E7] bg-[#FAFAFA] text-neutral-900 placeholder:text-neutral-400 focus:border-[#00A82D] focus:ring-2 focus:ring-[#D8F5E0] outline-none transition-all duration-200"
                                        placeholder="contato@empresa.com"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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

                        {/* Step 3: Imagens */}
                        {currentStep === 3 && (
                            <>
                                {/* Logo */}
                                <div>
                                    <label className="block text-xs font-semibold text-neutral-800 mb-1.5">
                                        Logo da Empresa
                                    </label>
                                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center hover:border-[#00A82D] transition-all cursor-pointer">
                                        <input
                                            type="file"
                                            accept="image/png,image/jpeg,image/webp"
                                            onChange={handleLogoChange}
                                            className="hidden"
                                            id="logo-upload"
                                        />
                                        <label htmlFor="logo-upload" className="cursor-pointer">
                                            {logo ? (
                                                <div className="flex items-center justify-center gap-2">
                                                    <img 
                                                        src={URL.createObjectURL(logo)} 
                                                        alt="Logo preview" 
                                                        className="w-20 h-20 object-cover rounded-lg"
                                                    />
                                                    <div className="text-left">
                                                        <p className="text-sm font-semibold text-[#00A82D]">✓ Logo adicionada</p>
                                                        <p className="text-xs text-gray-500">{logo.name}</p>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div>
                                                    <ImageIcon className="mx-auto mb-2 text-gray-400" size={32} />
                                                    <p className="text-sm text-gray-600">Clique para adicionar logo</p>
                                                    <p className="text-xs text-gray-400 mt-1">PNG, JPG ou WEBP</p>
                                                </div>
                                            )}
                                        </label>
                                    </div>
                                </div>

                                {/* Foto de Capa */}
                                <div>
                                    <label className="block text-xs font-semibold text-neutral-800 mb-1.5">
                                        Foto de Capa
                                    </label>
                                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center hover:border-[#00A82D] transition-all cursor-pointer">
                                        <input
                                            type="file"
                                            accept="image/png,image/jpeg,image/webp"
                                            onChange={handleCoverChange}
                                            className="hidden"
                                            id="cover-upload"
                                        />
                                        <label htmlFor="cover-upload" className="cursor-pointer">
                                            {coverImage ? (
                                                <div>
                                                    <img 
                                                        src={URL.createObjectURL(coverImage)} 
                                                        alt="Cover preview" 
                                                        className="w-full h-24 object-cover rounded-lg mb-2"
                                                    />
                                                    <p className="text-sm font-semibold text-[#00A82D]">✓ Capa adicionada</p>
                                                    <p className="text-xs text-gray-500">{coverImage.name}</p>
                                                </div>
                                            ) : (
                                                <div>
                                                    <ImageIcon className="mx-auto mb-2 text-gray-400" size={32} />
                                                    <p className="text-sm text-gray-600">Clique para adicionar capa</p>
                                                    <p className="text-xs text-gray-400 mt-1">PNG, JPG ou WEBP</p>
                                                </div>
                                            )}
                                        </label>
                                    </div>
                                </div>

                                {/* Galeria */}
                                <div>
                                    <label className="block text-xs font-semibold text-neutral-800 mb-1.5">
                                        Galeria de Fotos (Até 10 fotos)
                                    </label>
                                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center hover:border-[#00A82D] transition-all cursor-pointer">
                                        <input
                                            type="file"
                                            accept="image/png,image/jpeg,image/webp"
                                            onChange={handleGalleryChange}
                                            multiple
                                            className="hidden"
                                            id="gallery-upload"
                                            disabled={galleryImages.length >= 10}
                                        />
                                        <label htmlFor="gallery-upload" className="cursor-pointer">
                                            <ImageIcon className="mx-auto mb-2 text-gray-400" size={32} />
                                            <p className="text-sm text-gray-600">
                                                Clique para adicionar fotos ({galleryImages.length}/10)
                                            </p>
                                            <p className="text-xs text-gray-400 mt-1">PNG, JPG ou WEBP</p>
                                        </label>
                                    </div>
                                    
                                    {galleryImages.length > 0 && (
                                        <div className="grid grid-cols-3 gap-2 mt-3">
                                            {galleryImages.map((img, index) => (
                                                <div key={index} className="relative group">
                                                    <img 
                                                        src={URL.createObjectURL(img)} 
                                                        alt={`Gallery ${index + 1}`}
                                                        className="w-full h-20 object-cover rounded-lg"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => removeGalleryImage(index)}
                                                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                                                    >
                                                        ×
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
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
                                        className="h-12 rounded-xl bg-[#00A82D] text-white font-bold text-base shadow-xl transition-all duration-200 hover:bg-[#0A7A27] hover:shadow-2xl focus:outline-none focus:ring-2 focus:ring-[#D8F5E0] cursor-pointer"
                                    >
                                        Próximo
                                    </button>
                                </div>
                            </>
                        )}

                        {/* Step 4: Descrição */}
                        {currentStep === 4 && (
                            <>
                                <div>
                                    <label className="block text-xs font-semibold text-neutral-800 mb-1.5">Descrição</label>
                                    <textarea
                                        className="w-full h-32 px-4 py-3 rounded-xl border-2 border-[#E7E7E7] bg-[#FAFAFA] text-neutral-900 placeholder:text-neutral-400 focus:border-[#00A82D] focus:ring-2 focus:ring-[#D8F5E0] outline-none transition-all duration-200 resize-none"
                                        placeholder="Conte um pouco sobre sua empresa... O que vocês fazem? Quais produtos ou serviços oferecem?"
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        required
                                    />
                                </div>

                                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mt-4">
                                    <p className="text-sm text-blue-800 font-semibold mb-2">📝 Resumo do cadastro:</p>
                                    <div className="text-xs text-blue-700 space-y-1">
                                        <p><strong>Nome:</strong> {formData.name}</p>
                                        <p><strong>Categoria:</strong> {categories.find(c => c.id === parseInt(formData.category_id))?.name}</p>
                                        <p><strong>Bairro:</strong> {neighborhoods.find(n => n.id === parseInt(formData.neighborhood_id))?.name}</p>
                                        <p><strong>WhatsApp:</strong> {formData.whatsapp}</p>
                                        <p><strong>Imagens:</strong> {logo ? '✓ Logo' : ''} {coverImage ? '✓ Capa' : ''} {galleryImages.length > 0 ? `✓ ${galleryImages.length} foto(s)` : ''}</p>
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
                                        disabled={loading || !formData.description}
                                        className="h-12 rounded-xl bg-[#00A82D] text-white font-bold text-base shadow-xl transition-all duration-200 hover:bg-[#0A7A27] hover:shadow-2xl focus:outline-none focus:ring-2 focus:ring-[#D8F5E0] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                                    >
                                        {loading ? 'Cadastrando...' : 'Cadastrar Empresa'}
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
