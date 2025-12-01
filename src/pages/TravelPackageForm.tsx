import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Palmtree, Image as ImageIcon, ArrowLeft } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export const TravelPackageForm: React.FC = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [currentStep, setCurrentStep] = useState(1);
    const [coverImage, setCoverImage] = useState<File | null>(null);
    
    const [formData, setFormData] = useState({
        destination: '',
        departure_location: '',
        departure_date: '',
        return_date: '',
        description: '',
        whatsapp: '',
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
        return formData.destination && formData.departure_location;
    };

    const validateStep2 = () => {
        return formData.departure_date && formData.return_date;
    };

    const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const validTypes = ['image/png', 'image/jpeg', 'image/webp'];
            if (!validTypes.includes(file.type)) {
                setError('Imagem deve ser PNG, JPG ou WEBP');
                return;
            }
            setCoverImage(file);
            setError('');
        }
    };

    const formatWhatsApp = (value: string) => {
        const numbers = value.replace(/\D/g, '');
        if (numbers.length <= 11) {
            return numbers.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
        }
        return value;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            // TODO: Upload de imagem e inserção no banco
            navigate('/painel');
        } catch (err: any) {
            setError(err.message || 'Erro ao cadastrar viagem');
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
                            src="https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=600&q=80"
                            alt="Viagens"
                            className="rounded-3xl shadow-2xl object-cover w-[280px] h-[360px] lg:w-[320px] lg:h-[420px]"
                        />
                    </div>

                    <div className="absolute top-8 left-6 lg:top-12 lg:left-8 animate-float z-10">
                        <div className="backdrop-blur-md bg-white/70 rounded-2xl shadow-xl p-3 flex items-center gap-2 border border-white/40">
                            <div className="w-10 h-10 rounded-xl bg-[#00A82D]/10 flex items-center justify-center">
                                <Palmtree size={20} className="text-[#00A82D]" strokeWidth={2} />
                            </div>
                            <div className="pr-2">
                                <p className="text-xs font-semibold text-neutral-800">Sua Viagem</p>
                                <p className="text-[10px] text-neutral-500">Leve turistas</p>
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
                        Cadastre uma viagem
                    </h1>
                    <p className="text-sm lg:text-base text-neutral-600 mb-4 leading-relaxed">
                        Divulgue sua viagem e alcance mais turistas.
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
                        {currentStep === 1 && 'Etapa 1 de 3: Destino'}
                        {currentStep === 2 && 'Etapa 2 de 3: Datas e Contato'}
                        {currentStep === 3 && 'Etapa 3 de 3: Descrição e Imagem'}
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
                                    <label className="block text-xs font-semibold text-neutral-800 mb-1.5">Nome do Destino</label>
                                    <input
                                        type="text"
                                        className="w-full h-12 px-4 rounded-xl border-2 border-[#E7E7E7] bg-[#FAFAFA] text-neutral-900 placeholder:text-neutral-400 focus:border-[#00A82D] focus:ring-2 focus:ring-[#D8F5E0] outline-none transition-all duration-200"
                                        placeholder="Ex: Salvador, Bahia"
                                        value={formData.destination}
                                        onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-neutral-800 mb-1.5">Local de Saída</label>
                                    <input
                                        type="text"
                                        className="w-full h-12 px-4 rounded-xl border-2 border-[#E7E7E7] bg-[#FAFAFA] text-neutral-900 placeholder:text-neutral-400 focus:border-[#00A82D] focus:ring-2 focus:ring-[#D8F5E0] outline-none transition-all duration-200"
                                        placeholder="Ex: Bom Jesus da Lapa"
                                        value={formData.departure_location}
                                        onChange={(e) => setFormData({ ...formData, departure_location: e.target.value })}
                                        required
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
                                    <label className="block text-xs font-semibold text-neutral-800 mb-1.5">Data de Saída</label>
                                    <input
                                        type="date"
                                        className="w-full h-12 px-4 rounded-xl border-2 border-[#E7E7E7] bg-[#FAFAFA] text-neutral-900 focus:border-[#00A82D] focus:ring-2 focus:ring-[#D8F5E0] outline-none transition-all duration-200"
                                        value={formData.departure_date}
                                        onChange={(e) => setFormData({ ...formData, departure_date: e.target.value })}
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-neutral-800 mb-1.5">Data de Retorno</label>
                                    <input
                                        type="date"
                                        className="w-full h-12 px-4 rounded-xl border-2 border-[#E7E7E7] bg-[#FAFAFA] text-neutral-900 focus:border-[#00A82D] focus:ring-2 focus:ring-[#D8F5E0] outline-none transition-all duration-200"
                                        value={formData.return_date}
                                        onChange={(e) => setFormData({ ...formData, return_date: e.target.value })}
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-neutral-800 mb-1.5">WhatsApp para Contato</label>
                                    <input
                                        type="tel"
                                        className="w-full h-12 px-4 rounded-xl border-2 border-[#E7E7E7] bg-[#FAFAFA] text-neutral-900 placeholder:text-neutral-400 focus:border-[#00A82D] focus:ring-2 focus:ring-[#D8F5E0] outline-none transition-all duration-200"
                                        placeholder="(77) 98888-8888"
                                        value={formData.whatsapp}
                                        onChange={(e) => setFormData({ ...formData, whatsapp: formatWhatsApp(e.target.value) })}
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
                                    <label className="block text-xs font-semibold text-neutral-800 mb-1.5">Descrição da Viagem</label>
                                    <textarea
                                        className="w-full h-32 px-4 py-3 rounded-xl border-2 border-[#E7E7E7] bg-[#FAFAFA] text-neutral-900 placeholder:text-neutral-400 focus:border-[#00A82D] focus:ring-2 focus:ring-[#D8F5E0] outline-none transition-all duration-200 resize-none"
                                        placeholder="Descreva a viagem, incluindo hospedagem, passeios, etc..."
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-neutral-800 mb-1.5">Foto de Capa (Cidade de Destino)</label>
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
                                                    <img src={URL.createObjectURL(coverImage)} alt="Cover preview" className="w-full h-32 object-cover rounded-lg mb-2" />
                                                    <p className="text-sm font-semibold text-[#00A82D]">✓ Foto adicionada</p>
                                                </div>
                                            ) : (
                                                <div>
                                                    <ImageIcon className="mx-auto mb-2 text-gray-400" size={32} />
                                                    <p className="text-sm text-gray-600">Clique para adicionar foto</p>
                                                    <p className="text-xs text-gray-400 mt-1">PNG, JPG ou WEBP</p>
                                                </div>
                                            )}
                                        </label>
                                    </div>
                                </div>

                                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mt-4">
                                    <p className="text-sm text-blue-800 font-semibold mb-2">📝 Resumo:</p>
                                    <div className="text-xs text-blue-700 space-y-1">
                                        <p><strong>Destino:</strong> {formData.destination}</p>
                                        <p><strong>Saída de:</strong> {formData.departure_location}</p>
                                        <p><strong>Período:</strong> {formData.departure_date} até {formData.return_date}</p>
                                        <p><strong>Contato:</strong> {formData.whatsapp}</p>
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
                                        className="h-12 rounded-xl bg-[#00A82D] text-white font-bold text-base shadow-xl transition-all duration-200 hover:bg-[#0A7A27] hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                                    >
                                        {loading ? 'Cadastrando...' : 'Cadastrar Viagem'}
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
