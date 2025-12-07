import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Image as ImageIcon, ArrowLeft, Music } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';

export const EventForm: React.FC = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [currentStep, setCurrentStep] = useState(1);
    const [logo, setLogo] = useState<File | null>(null);
    const [coverImage, setCoverImage] = useState<File | null>(null);
    const [galleryImages, setGalleryImages] = useState<File[]>([]);
    
    const [formData, setFormData] = useState({
        name: '',
        event_date: '',
        location: '',
        event_type: '',
        is_free: true,
        ticket_price: '',
        description: '',
        age_rating: '',
    });

    useEffect(() => {
        if (!user) {
            navigate('/login');
        }
    }, [user, navigate]);

    const nextStep = () => {
        if (currentStep < 4) setCurrentStep(currentStep + 1);
    };

    const prevStep = () => {
        if (currentStep > 1) setCurrentStep(currentStep - 1);
    };

    const validateStep1 = () => {
        return formData.name && formData.event_type && formData.event_date;
    };

    const validateStep2 = () => {
        return formData.location;
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
            if (!user) throw new Error('Usuário não autenticado');

            // TODO: Upload de imagens e inserção no banco
            // Simplified insertion for now
            
            const { error: insertError } = await supabase.from('events').insert({
                name: formData.name,
                event_date: formData.event_date || null,
                location: formData.location,
                event_type: formData.event_type,
                is_free: formData.is_free,
                ticket_price: formData.ticket_price,
                description: formData.description,
                age_rating: formData.age_rating,
                // logo_url: logoUrl,
                // cover_image: coverUrl,
                status: 'pending',
                user_id: user.id
            });

            if (insertError) throw insertError;

            navigate('/painel');
        } catch (err: any) {
            console.error('Erro ao cadastrar evento:', err);
            setError(err.message || 'Erro ao cadastrar evento');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="h-screen bg-cream flex items-center justify-center px-4 py-4 overflow-hidden">
            <div className="w-full max-w-6xl h-[calc(100vh-2rem)] bg-white/90 backdrop-blur-sm rounded-4xl shadow-2xl flex flex-col lg:flex-row overflow-hidden">
                {/* Visual Section */}
                <div className="relative flex-1 bg-linear-to-br from-cream to-neutral-100 flex items-center justify-center p-8 lg:p-12">
                    <div className="relative z-0">
                        <img
                            src="https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=600&q=80"
                            alt="Eventos"
                            className="rounded-3xl shadow-2xl object-cover w-[280px] h-[360px] lg:w-[320px] lg:h-[420px]"
                        />
                    </div>

                    <div className="absolute top-8 left-6 lg:top-12 lg:left-8 animate-float z-10">
                        <div className="backdrop-blur-md bg-white/70 rounded-2xl shadow-xl p-3 flex items-center gap-2 border border-white/40">
                            <div className="w-10 h-10 rounded-xl bg-[#00A82D]/10 flex items-center justify-center">
                                <Music size={20} className="text-[#00A82D]" strokeWidth={2} />
                            </div>
                            <div className="pr-2">
                                <p className="text-xs font-semibold text-neutral-800">Seu Evento</p>
                                <p className="text-[10px] text-neutral-500">Divulgue aqui</p>
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
                        Cadastre seu evento
                    </h1>
                    <p className="text-sm lg:text-base text-neutral-600 mb-4 leading-relaxed">
                        Divulgue seu evento e alcance mais pessoas.
                    </p>

                    {/* Progress Indicator */}
                    <div className="flex items-center justify-center gap-2 mb-6">
                        {[1, 2, 3, 4].map((step) => (
                            <div key={step} className="flex items-center">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                                    currentStep >= step ? 'bg-[#00A82D] text-white' : 'bg-gray-200 text-gray-500'
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
                        {currentStep === 2 && 'Etapa 2 de 4: Local e Ingresso'}
                        {currentStep === 3 && 'Etapa 3 de 4: Imagens'}
                        {currentStep === 4 && 'Etapa 4 de 4: Descrição'}
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
                                    <label className="block text-xs font-semibold text-neutral-800 mb-1.5">Nome do Evento</label>
                                    <input
                                        type="text"
                                        className="w-full h-12 px-4 rounded-xl border-2 border-neutral-200 bg-[#FAFAFA] text-neutral-900 placeholder:text-neutral-400 focus:border-[#00A82D] focus:ring-2 focus:ring-primary-light outline-none transition-all duration-200"
                                        placeholder="Nome do evento"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-neutral-800 mb-1.5">Tipo de Evento</label>
                                    <select
                                        className="w-full h-12 px-4 rounded-xl border-2 border-neutral-200 bg-[#FAFAFA] text-neutral-900 focus:border-[#00A82D] focus:ring-2 focus:ring-primary-light outline-none transition-all duration-200"
                                        value={formData.event_type}
                                        onChange={(e) => setFormData({ ...formData, event_type: e.target.value })}
                                        required
                                    >
                                        <option value="">Selecione o tipo</option>
                                        <option value="show">Show</option>
                                        <option value="esportivo">Esportivo</option>
                                        <option value="religioso">Religioso</option>
                                        <option value="educacao">Educação</option>
                                        <option value="negocios">Negócios</option>
                                        <option value="feira">Feira</option>
                                        <option value="palestra">Palestra</option>
                                        <option value="teatro">Teatro</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-neutral-800 mb-1.5">Data do Evento</label>
                                    <input
                                        type="date"
                                        className="w-full h-12 px-4 rounded-xl border-2 border-neutral-200 bg-[#FAFAFA] text-neutral-900 focus:border-[#00A82D] focus:ring-2 focus:ring-primary-light outline-none transition-all duration-200"
                                        value={formData.event_date}
                                        onChange={(e) => setFormData({ ...formData, event_date: e.target.value })}
                                        required
                                    />
                                </div>

                                <button
                                    type="button"
                                    onClick={nextStep}
                                    disabled={!validateStep1()}
                                    className="w-full h-12 mt-4 rounded-xl bg-[#00A82D] text-white font-bold text-base shadow-xl transition-all duration-200 hover:bg-primary-dark hover:shadow-2xl focus:outline-none focus:ring-2 focus:ring-primary-light disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                                >
                                    Próximo
                                </button>
                            </>
                        )}

                        {/* Step 2 */}
                        {currentStep === 2 && (
                            <>
                                <div>
                                    <label className="block text-xs font-semibold text-neutral-800 mb-1.5">Local do Evento</label>
                                    <input
                                        type="text"
                                        className="w-full h-12 px-4 rounded-xl border-2 border-neutral-200 bg-[#FAFAFA] text-neutral-900 placeholder:text-neutral-400 focus:border-[#00A82D] focus:ring-2 focus:ring-primary-light outline-none transition-all duration-200"
                                        placeholder="Endereço ou nome do local"
                                        value={formData.location}
                                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-neutral-800 mb-1.5">Faixa Etária</label>
                                    <input
                                        type="text"
                                        className="w-full h-12 px-4 rounded-xl border-2 border-neutral-200 bg-[#FAFAFA] text-neutral-900 placeholder:text-neutral-400 focus:border-[#00A82D] focus:ring-2 focus:ring-primary-light outline-none transition-all duration-200"
                                        placeholder="Ex: Livre, 18+, 16+"
                                        value={formData.age_rating}
                                        onChange={(e) => setFormData({ ...formData, age_rating: e.target.value })}
                                    />
                                </div>

                                <div>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={formData.is_free}
                                            onChange={(e) => setFormData({ ...formData, is_free: e.target.checked, ticket_price: '' })}
                                            className="w-4 h-4 rounded border-2 border-neutral-200 text-[#00A82D] focus:ring-2 focus:ring-primary-light cursor-pointer"
                                        />
                                        <span className="text-sm font-semibold text-neutral-800">Evento Gratuito</span>
                                    </label>
                                </div>

                                {!formData.is_free && (
                                    <div>
                                        <label className="block text-xs font-semibold text-neutral-800 mb-1.5">Valor do Ingresso</label>
                                        <input
                                            type="text"
                                            className="w-full h-12 px-4 rounded-xl border-2 border-neutral-200 bg-[#FAFAFA] text-neutral-900 placeholder:text-neutral-400 focus:border-[#00A82D] focus:ring-2 focus:ring-primary-light outline-none transition-all duration-200"
                                            placeholder="R$ 50,00"
                                            value={formData.ticket_price}
                                            onChange={(e) => setFormData({ ...formData, ticket_price: e.target.value })}
                                        />
                                    </div>
                                )}

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
                                        className="h-12 rounded-xl bg-[#00A82D] text-white font-bold text-base shadow-xl transition-all duration-200 hover:bg-primary-dark hover:shadow-2xl focus:outline-none focus:ring-2 focus:ring-primary-light disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                                    >
                                        Próximo
                                    </button>
                                </div>
                            </>
                        )}

                        {/* Step 3: Imagens */}
                        {currentStep === 3 && (
                            <>
                                <div>
                                    <label className="block text-xs font-semibold text-neutral-800 mb-1.5">Logo do Evento</label>
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
                                                    <img src={URL.createObjectURL(logo)} alt="Logo preview" className="w-20 h-20 object-cover rounded-lg" />
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

                                <div>
                                    <label className="block text-xs font-semibold text-neutral-800 mb-1.5">Foto de Capa</label>
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
                                                    <img src={URL.createObjectURL(coverImage)} alt="Cover preview" className="w-full h-24 object-cover rounded-lg mb-2" />
                                                    <p className="text-sm font-semibold text-[#00A82D]">✓ Capa adicionada</p>
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

                                <div>
                                    <label className="block text-xs font-semibold text-neutral-800 mb-1.5">Galeria de Fotos (Até 10)</label>
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
                                            <p className="text-sm text-gray-600">Clique para adicionar fotos ({galleryImages.length}/10)</p>
                                        </label>
                                    </div>
                                    
                                    {galleryImages.length > 0 && (
                                        <div className="grid grid-cols-3 gap-2 mt-3">
                                            {galleryImages.map((img, index) => (
                                                <div key={index} className="relative group">
                                                    <img src={URL.createObjectURL(img)} alt={`Gallery ${index + 1}`} className="w-full h-20 object-cover rounded-lg" />
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
                                    <button type="button" onClick={prevStep} className="h-12 rounded-xl bg-gray-200 text-gray-700 font-bold text-base transition-all duration-200 hover:bg-gray-300 cursor-pointer">
                                        Voltar
                                    </button>
                                    <button type="button" onClick={nextStep} className="h-12 rounded-xl bg-[#00A82D] text-white font-bold text-base shadow-xl transition-all duration-200 hover:bg-primary-dark hover:shadow-2xl cursor-pointer">
                                        Próximo
                                    </button>
                                </div>
                            </>
                        )}

                        {/* Step 4 */}
                        {currentStep === 4 && (
                            <>
                                <div>
                                    <label className="block text-xs font-semibold text-neutral-800 mb-1.5">Descrição do Evento</label>
                                    <textarea
                                        className="w-full h-32 px-4 py-3 rounded-xl border-2 border-neutral-200 bg-[#FAFAFA] text-neutral-900 placeholder:text-neutral-400 focus:border-[#00A82D] focus:ring-2 focus:ring-primary-light outline-none transition-all duration-200 resize-none"
                                        placeholder="Descreva o evento..."
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        required
                                    />
                                </div>

                                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                                    <p className="text-sm text-blue-800 font-semibold mb-2">📝 Resumo:</p>
                                    <div className="text-xs text-blue-700 space-y-1">
                                        <p><strong>Nome:</strong> {formData.name}</p>
                                        <p><strong>Tipo:</strong> {formData.event_type}</p>
                                        <p><strong>Data:</strong> {formData.event_date}</p>
                                        <p><strong>Local:</strong> {formData.location}</p>
                                        <p><strong>Ingresso:</strong> {formData.is_free ? 'Gratuito' : formData.ticket_price}</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4 mt-4">
                                    <button type="button" onClick={prevStep} className="h-12 rounded-xl bg-gray-200 text-gray-700 font-bold text-base transition-all duration-200 hover:bg-gray-300 cursor-pointer">
                                        Voltar
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={loading || !formData.description}
                                        className="h-12 rounded-xl bg-[#00A82D] text-white font-bold text-base shadow-xl transition-all duration-200 hover:bg-primary-dark hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                                    >
                                        {loading ? 'Cadastrando...' : 'Cadastrar Evento'}
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
