import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { UtensilsCrossed, Image as ImageIcon, ArrowLeft, Plus, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface DishField {
    id: number;
    name: string;
}

interface Schedule {
    id: number;
    day: string;
    times: { id: number; open: string; close: string }[];
}

const DAYS = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'];

export const FoodForm: React.FC = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [currentStep, setCurrentStep] = useState(1);
    const [logo, setLogo] = useState<File | null>(null);
    const [coverImage, setCoverImage] = useState<File | null>(null);
    const [galleryImages, setGalleryImages] = useState<File[]>([]);
    const [dishes, setDishes] = useState<DishField[]>([{ id: 1, name: '' }]);
    const [schedules, setSchedules] = useState<Schedule[]>([]);
    
    const [formData, setFormData] = useState({
        name: '',
        types: {
            restaurante: false,
            lanchonete: false,
            bar: false,
            espetinho: false,
            sorveteria: false,
            acai: false,
            creperia: false,
            hamburgeria: false,
            acaraje: false,
        },
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
        return formData.name && Object.values(formData.types).some(v => v);
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

    const addDish = () => {
        setDishes([...dishes, { id: Date.now(), name: '' }]);
    };

    const removeDish = (id: number) => {
        setDishes(dishes.filter(d => d.id !== id));
    };

    const updateDish = (id: number, name: string) => {
        setDishes(dishes.map(d => d.id === id ? { ...d, name } : d));
    };

    const toggleDay = (day: string) => {
        const exists = schedules.find(s => s.day === day);
        if (exists) {
            setSchedules(schedules.filter(s => s.day !== day));
        } else {
            setSchedules([...schedules, { id: Date.now(), day, times: [{ id: Date.now(), open: '', close: '' }] }]);
        }
    };

    const addTimeSlot = (scheduleId: number) => {
        setSchedules(schedules.map(s => 
            s.id === scheduleId 
                ? { ...s, times: [...s.times, { id: Date.now(), open: '', close: '' }] }
                : s
        ));
    };

    const removeTimeSlot = (scheduleId: number, timeId: number) => {
        setSchedules(schedules.map(s => 
            s.id === scheduleId 
                ? { ...s, times: s.times.filter(t => t.id !== timeId) }
                : s
        ));
    };

    const updateTimeSlot = (scheduleId: number, timeId: number, field: 'open' | 'close', value: string) => {
        setSchedules(schedules.map(s => 
            s.id === scheduleId 
                ? { ...s, times: s.times.map(t => t.id === timeId ? { ...t, [field]: value } : t) }
                : s
        ));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            // TODO: Upload de imagens e inserção no banco
            navigate('/painel');
        } catch (err: any) {
            setError(err.message || 'Erro ao cadastrar estabelecimento');
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
                            src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=600&q=80"
                            alt="Alimentação"
                            className="rounded-3xl shadow-2xl object-cover w-[280px] h-[360px] lg:w-[320px] lg:h-[420px]"
                        />
                    </div>

                    <div className="absolute top-8 left-6 lg:top-12 lg:left-8 animate-float z-10">
                        <div className="backdrop-blur-md bg-white/70 rounded-2xl shadow-xl p-3 flex items-center gap-2 border border-white/40">
                            <div className="w-10 h-10 rounded-xl bg-[#00A82D]/10 flex items-center justify-center">
                                <UtensilsCrossed size={20} className="text-[#00A82D]" strokeWidth={2} />
                            </div>
                            <div className="pr-2">
                                <p className="text-xs font-semibold text-neutral-800">Seu Local</p>
                                <p className="text-[10px] text-neutral-500">Atraia clientes</p>
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
                        Cadastre seu local
                    </h1>
                    <p className="text-sm lg:text-base text-neutral-600 mb-4 leading-relaxed">
                        Divulgue seu restaurante, bar ou lanchonete.
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
                        {currentStep === 2 && 'Etapa 2 de 4: Imagens'}
                        {currentStep === 3 && 'Etapa 3 de 4: Pratos Principais'}
                        {currentStep === 4 && 'Etapa 4 de 4: Horário de Funcionamento'}
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
                                    <label className="block text-xs font-semibold text-neutral-800 mb-1.5">Nome do Local</label>
                                    <input
                                        type="text"
                                        className="w-full h-12 px-4 rounded-xl border-2 border-[#E7E7E7] bg-[#FAFAFA] text-neutral-900 placeholder:text-neutral-400 focus:border-[#00A82D] focus:ring-2 focus:ring-[#D8F5E0] outline-none transition-all duration-200"
                                        placeholder="Nome do estabelecimento"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-neutral-800 mb-3">Tipo de Local</label>
                                    <div className="grid grid-cols-2 gap-2">
                                        {Object.entries(formData.types).map(([key, value]) => (
                                            <label key={key} className="flex items-center gap-2 p-2 border-2 border-gray-200 rounded-lg hover:border-[#00A82D] transition-all cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={value}
                                                    onChange={(e) => setFormData({ ...formData, types: { ...formData.types, [key]: e.target.checked } })}
                                                    className="w-4 h-4 rounded border-2 border-[#E7E7E7] text-[#00A82D] focus:ring-2 focus:ring-[#D8F5E0] cursor-pointer"
                                                />
                                                <span className="text-xs font-medium text-neutral-800 capitalize">{key}</span>
                                            </label>
                                        ))}
                                    </div>
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

                        {/* Step 2: Imagens */}
                        {currentStep === 2 && (
                            <>
                                <div>
                                    <label className="block text-xs font-semibold text-neutral-800 mb-1.5">Logo</label>
                                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center hover:border-[#00A82D] transition-all cursor-pointer">
                                        <input type="file" accept="image/png,image/jpeg,image/webp" onChange={handleLogoChange} className="hidden" id="logo-upload" />
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
                                                </div>
                                            )}
                                        </label>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-neutral-800 mb-1.5">Imagem de Capa</label>
                                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center hover:border-[#00A82D] transition-all cursor-pointer">
                                        <input type="file" accept="image/png,image/jpeg,image/webp" onChange={handleCoverChange} className="hidden" id="cover-upload" />
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
                                                </div>
                                            )}
                                        </label>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-neutral-800 mb-1.5">Galeria de Fotos (Até 10)</label>
                                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center hover:border-[#00A82D] transition-all cursor-pointer">
                                        <input type="file" accept="image/png,image/jpeg,image/webp" onChange={handleGalleryChange} multiple className="hidden" id="gallery-upload" disabled={galleryImages.length >= 10} />
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
                                                    <button type="button" onClick={() => removeGalleryImage(index)} className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">×</button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <div className="grid grid-cols-2 gap-4 mt-4">
                                    <button type="button" onClick={prevStep} className="h-12 rounded-xl bg-gray-200 text-gray-700 font-bold text-base transition-all duration-200 hover:bg-gray-300 cursor-pointer">Voltar</button>
                                    <button type="button" onClick={nextStep} className="h-12 rounded-xl bg-[#00A82D] text-white font-bold text-base shadow-xl transition-all duration-200 hover:bg-[#0A7A27] hover:shadow-2xl cursor-pointer">Próximo</button>
                                </div>
                            </>
                        )}

                        {/* Step 3: Pratos */}
                        {currentStep === 3 && (
                            <>
                                <div>
                                    <label className="block text-sm font-semibold text-neutral-800 mb-3">Pratos Principais</label>
                                    <div className="space-y-2">
                                        {dishes.map((dish, index) => (
                                            <div key={dish.id} className="flex gap-2">
                                                <input
                                                    type="text"
                                                    className="flex-1 h-12 px-4 rounded-xl border-2 border-[#E7E7E7] bg-[#FAFAFA] text-neutral-900 placeholder:text-neutral-400 focus:border-[#00A82D] focus:ring-2 focus:ring-[#D8F5E0] outline-none transition-all duration-200"
                                                    placeholder={`Prato ${index + 1}`}
                                                    value={dish.name}
                                                    onChange={(e) => updateDish(dish.id, e.target.value)}
                                                />
                                                {dishes.length > 1 && (
                                                    <button type="button" onClick={() => removeDish(dish.id)} className="w-12 h-12 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 transition-all flex items-center justify-center cursor-pointer">
                                                        <X size={18} />
                                                    </button>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                    <button type="button" onClick={addDish} className="w-full mt-3 h-10 rounded-xl border-2 border-dashed border-[#00A82D] text-[#00A82D] font-semibold text-sm hover:bg-[#D8F5E0] transition-all flex items-center justify-center gap-2 cursor-pointer">
                                        <Plus size={18} /> Adicionar Prato
                                    </button>
                                </div>

                                <div className="grid grid-cols-2 gap-4 mt-4">
                                    <button type="button" onClick={prevStep} className="h-12 rounded-xl bg-gray-200 text-gray-700 font-bold text-base transition-all duration-200 hover:bg-gray-300 cursor-pointer">Voltar</button>
                                    <button type="button" onClick={nextStep} className="h-12 rounded-xl bg-[#00A82D] text-white font-bold text-base shadow-xl transition-all duration-200 hover:bg-[#0A7A27] hover:shadow-2xl cursor-pointer">Próximo</button>
                                </div>
                            </>
                        )}

                        {/* Step 4: Horários */}
                        {currentStep === 4 && (
                            <>
                                <div>
                                    <label className="block text-sm font-semibold text-neutral-800 mb-3">Horário de Funcionamento</label>
                                    <div className="space-y-3">
                                        {DAYS.map((day) => {
                                            const schedule = schedules.find(s => s.day === day);
                                            const isSelected = !!schedule;
                                            
                                            return (
                                                <div key={day} className="border-2 border-gray-200 rounded-xl p-3">
                                                    <label className="flex items-center gap-2 cursor-pointer mb-2">
                                                        <input
                                                            type="checkbox"
                                                            checked={isSelected}
                                                            onChange={() => toggleDay(day)}
                                                            className="w-4 h-4 rounded border-2 border-[#E7E7E7] text-[#00A82D] focus:ring-2 focus:ring-[#D8F5E0] cursor-pointer"
                                                        />
                                                        <span className="text-sm font-semibold text-neutral-800">{day}</span>
                                                    </label>
                                                    
                                                    {isSelected && schedule && (
                                                        <div className="space-y-2 ml-6">
                                                            {schedule.times.map((time) => (
                                                                <div key={time.id} className="flex gap-2 items-center">
                                                                    <input
                                                                        type="time"
                                                                        className="flex-1 h-10 px-3 rounded-lg border-2 border-[#E7E7E7] bg-[#FAFAFA] text-neutral-900 focus:border-[#00A82D] focus:ring-2 focus:ring-[#D8F5E0] outline-none text-sm"
                                                                        value={time.open}
                                                                        onChange={(e) => updateTimeSlot(schedule.id, time.id, 'open', e.target.value)}
                                                                    />
                                                                    <span className="text-sm text-gray-500">até</span>
                                                                    <input
                                                                        type="time"
                                                                        className="flex-1 h-10 px-3 rounded-lg border-2 border-[#E7E7E7] bg-[#FAFAFA] text-neutral-900 focus:border-[#00A82D] focus:ring-2 focus:ring-[#D8F5E0] outline-none text-sm"
                                                                        value={time.close}
                                                                        onChange={(e) => updateTimeSlot(schedule.id, time.id, 'close', e.target.value)}
                                                                    />
                                                                    {schedule.times.length > 1 && (
                                                                        <button type="button" onClick={() => removeTimeSlot(schedule.id, time.id)} className="w-8 h-8 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-all flex items-center justify-center cursor-pointer">
                                                                            <X size={14} />
                                                                        </button>
                                                                    )}
                                                                </div>
                                                            ))}
                                                            <button type="button" onClick={() => addTimeSlot(schedule.id)} className="text-xs text-[#00A82D] font-semibold hover:underline flex items-center gap-1 cursor-pointer">
                                                                <Plus size={14} /> Adicionar horário
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4 mt-4">
                                    <button type="button" onClick={prevStep} className="h-12 rounded-xl bg-gray-200 text-gray-700 font-bold text-base transition-all duration-200 hover:bg-gray-300 cursor-pointer">Voltar</button>
                                    <button type="submit" disabled={loading} className="h-12 rounded-xl bg-[#00A82D] text-white font-bold text-base shadow-xl transition-all duration-200 hover:bg-[#0A7A27] hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer">
                                        {loading ? 'Cadastrando...' : 'Cadastrar Local'}
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
