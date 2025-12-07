import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    MapPin,
    Phone,
    Mail,
    Clock,
    Share2,
    Heart,
    ExternalLink,
    ChevronLeft,
    ChevronRight,
    X
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';

interface Company {
    id: string;
    name: string;
    category: string;
    description: string;
    address: string;
    phone: string;
    email?: string;
    website?: string;
    opening_hours?: string;
    cover_image?: string;
    images?: string[];
    created_at: string;
}

export const CompanyDetail: React.FC = () => {
    const { slug } = useParams<{ slug: string }>();
    const navigate = useNavigate();
    const [company, setCompany] = useState<Company | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [showGallery, setShowGallery] = useState(false);
    const [isFavorite, setIsFavorite] = useState(false);

    useEffect(() => {
        loadCompany();
    }, [slug]);

    const loadCompany = async () => {
        setIsLoading(true);
        try {

            // Buscar empresa pelo slug
            const { data, error } = await supabase
                .from('companies')
                .select('*')
                .eq('status', 'active')
                .eq('slug', slug)
                .single();

            if (error) {
                // Se não encontrar por slug, tentar por ID
                const { data: idData, error: idError } = await supabase
                    .from('companies')
                    .select('*')
                    .eq('status', 'active')
                    .eq('id', slug)
                    .single();

                if (!idError && idData) {
                    setCompany(idData);
                    setIsLoading(false);
                } else {
                    // Se não encontrar por ID, tentar por nome (fallback para dados antigos)
                    const { data: fallbackData, error: fallbackError } = await supabase
                        .from('companies')
                        .select('*')
                        .eq('status', 'active')
                        .ilike('name', `%${slug?.replace(/-/g, ' ')}%`)
                        .single();

                    if (fallbackError) throw fallbackError;
                    setCompany(fallbackData);
                    setIsLoading(false);
                }
            } else {
                setCompany(data);
                setIsLoading(false);
            }
        } catch (error) {
            console.error('Error loading company:', error);
            setIsLoading(false);
            // Não redireciona automaticamente, deixa o usuário ver a mensagem
        }
    };

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: company?.name,
                    text: company?.description,
                    url: window.location.href,
                });
            } catch (error) {
                console.log('Error sharing:', error);
            }
        } else {
            // Fallback: copiar link
            navigator.clipboard.writeText(window.location.href);
            alert('Link copiado para a área de transferência!');
        }
    };

    const toggleFavorite = () => {
        setIsFavorite(!isFavorite);
        // TODO: Salvar favorito no Supabase
    };

    const nextImage = () => {
        const images = company?.images || [company?.cover_image];
        setCurrentImageIndex((prev) => (prev + 1) % images.length);
    };

    const prevImage = () => {
        const images = company?.images || [company?.cover_image];
        setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
    };



    if (isLoading) {
        return null; // Não mostra nada enquanto carrega
    }

    if (!company) {
        return (
            <div className="max-w-[1140px] mx-auto py-8 px-6">
                <div className="text-center py-12">
                    <h2 className="text-2xl font-bold text-neutral-900 mb-4">
                        Empresa não encontrada
                    </h2>
                    <Button onClick={() => navigate('/empresas')}>
                        Voltar para empresas
                    </Button>
                </div>
            </div>
        );
    }

    const images = company.images || (company.cover_image ? [company.cover_image] : []);

    return (
        <>
            <div className="max-w-[1140px] mx-auto py-8 px-6">
                {/* Header */}
                <div className="mb-6">
                    <div className="flex flex-col gap-3 md:flex-row md:justify-between items-start mb-4">
                        <div className="w-full">
                            <h1 className="text-3xl font-bold text-neutral-900 mb-2">
                                {company.name}
                            </h1>
                            <div className="flex flex-wrap items-center gap-3 text-sm text-neutral-500">
                                <span className="px-3 py-1 bg-primary-light text-primary-dark rounded-full font-medium">
                                    {company.category}
                                </span>
                                {company.address && (
                                    <div className="flex items-center gap-3">
                                        <div className="flex items-center gap-1">
                                            <MapPin size={16} />
                                            <span>{company.address}</span>
                                        </div>
                                        {/* Mobile-only share/save icons next to address */}
                                        <div className="flex items-center gap-2 md:hidden">
                                            <button
                                                type="button"
                                                onClick={handleShare}
                                                className="p-2 rounded-full bg-neutral-100 text-neutral-700 hover:bg-neutral-200 transition-colors"
                                            >
                                                <Share2 size={18} />
                                            </button>
                                            <button
                                                type="button"
                                                onClick={toggleFavorite}
                                                className="p-2 rounded-full bg-neutral-100 text-neutral-700 hover:bg-neutral-200 transition-colors"
                                            >
                                                <Heart
                                                    size={18}
                                                    className={isFavorite ? 'fill-red-500 text-red-500' : ''}
                                                />
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                        {/* Desktop / tablet share & save buttons with labels */}
                        <div className="hidden md:flex gap-2">
                            <Button
                                variant="ghost"
                                className="flex items-center gap-2"
                                onClick={handleShare}
                            >
                                <Share2 size={18} />
                                Compartilhar
                            </Button>
                            <Button
                                variant="ghost"
                                className="flex items-center gap-2"
                                onClick={toggleFavorite}
                            >
                                <Heart
                                    size={18}
                                    className={isFavorite ? 'fill-red-500 text-red-500' : ''}
                                />
                                Salvar
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Gallery */}
                {images.length > 0 && (
                    <div className="mb-8">
                        <div className="grid grid-cols-4 gap-2 rounded-2xl overflow-hidden">
                            {/* Main Image */}
                            <div
                                className="col-span-2 row-span-2 relative cursor-pointer group"
                                onClick={() => setShowGallery(true)}
                            >
                                <img
                                    src={images[0] || 'https://via.placeholder.com/800x600/FAF8F5/00A82D?text=Sem+Imagem'}
                                    alt={company.name}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all" />
                            </div>

                            {/* Secondary Images */}
                            {images.slice(1, 5).map((image, index) => (
                                <div
                                    key={index}
                                    className="relative cursor-pointer group overflow-hidden"
                                    onClick={() => {
                                        setCurrentImageIndex(index + 1);
                                        setShowGallery(true);
                                    }}
                                >
                                    <img
                                        src={image}
                                        alt={`${company.name} - ${index + 2}`}
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all" />
                                    {index === 3 && images.length > 5 && (
                                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                                            <span className="text-white font-semibold">
                                                +{images.length - 5} fotos
                                            </span>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-8 order-2 lg:order-1">
                        {/* Description */}
                        <Card>
                            <h2 className="text-xl font-semibold text-neutral-900 mb-4">
                                Sobre
                            </h2>
                            <p className="text-neutral-700 leading-relaxed whitespace-pre-line">
                                {company.description}
                            </p>
                        </Card>

                        {/* Contact Info */}
                        <Card>
                            <h2 className="text-xl font-semibold text-neutral-900 mb-4">
                                Informações de Contato
                            </h2>
                            <div className="space-y-4">
                                {company.phone && (
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-primary-light rounded-lg flex items-center justify-center">
                                            <Phone size={20} className="text-primary-dark" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-neutral-500">Telefone</p>
                                            <a
                                                href={`tel:${company.phone}`}
                                                className="text-neutral-900 font-medium hover:text-primary transition-colors"
                                            >
                                                {company.phone}
                                            </a>
                                        </div>
                                    </div>
                                )}

                                {company.email && (
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-primary-light rounded-lg flex items-center justify-center">
                                            <Mail size={20} className="text-primary-dark" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-neutral-500">Email</p>
                                            <a
                                                href={`mailto:${company.email}`}
                                                className="text-neutral-900 font-medium hover:text-primary transition-colors"
                                            >
                                                {company.email}
                                            </a>
                                        </div>
                                    </div>
                                )}

                                {company.address && (
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-primary-light rounded-lg flex items-center justify-center">
                                            <MapPin size={20} className="text-primary-dark" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-neutral-500">Endereço</p>
                                            <p className="text-neutral-900 font-medium">
                                                {company.address}
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {company.opening_hours && (
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-primary-light rounded-lg flex items-center justify-center">
                                            <Clock size={20} className="text-primary-dark" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-neutral-500">Horário de Funcionamento</p>
                                            <p className="text-neutral-900 font-medium">
                                                {company.opening_hours}
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </Card>
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-1 order-1 lg:order-2">
                        <Card className="sticky top-8">
                            <h3 className="text-lg font-semibold text-neutral-900 mb-4">
                                Entre em Contato
                            </h3>

                            <div className="flex flex-col gap-4">
                                {company.phone && (
                                    <a 
                                        href={`https://wa.me/55${company.phone.replace(/\D/g, '')}`} 
                                        target="_blank" 
                                        rel="noopener noreferrer" 
                                        className="block"
                                    >
                                        <Button variant="primary" className="w-full flex items-center justify-center gap-2 cursor-pointer">
                                            <Phone size={18} />
                                            WhatsApp
                                        </Button>
                                    </a>
                                )}

                                {company.website && (
                                    <a href={company.website} target="_blank" rel="noopener noreferrer" className="block">
                                        <Button variant="secondary" className="w-full flex items-center justify-center gap-2 cursor-pointer">
                                            <ExternalLink size={18} />
                                            Visitar Site
                                        </Button>
                                    </a>
                                )}

                                {company.email && (
                                    <a href={`mailto:${company.email}`} className="block">
                                        <Button variant="secondary" className="w-full flex items-center justify-center gap-2 cursor-pointer">
                                            <Mail size={18} />
                                            Enviar Email
                                        </Button>
                                    </a>
                                )}
                            </div>

                            <div className="mt-6 pt-6 border-t border-neutral-200">
                                <p className="text-xs text-neutral-500 text-center">
                                    Cadastrado em {new Date(company.created_at).toLocaleDateString('pt-BR')}
                                </p>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>

            {/* Gallery Modal */}
            {showGallery && (
                <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center">
                    <button
                        onClick={() => setShowGallery(false)}
                        className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors"
                    >
                        <X size={32} />
                    </button>

                    <button
                        onClick={prevImage}
                        className="absolute left-4 text-white hover:text-gray-300 transition-colors"
                    >
                        <ChevronLeft size={48} />
                    </button>

                    <button
                        onClick={nextImage}
                        className="absolute right-4 text-white hover:text-gray-300 transition-colors"
                    >
                        <ChevronRight size={48} />
                    </button>

                    <div className="max-w-5xl max-h-[90vh] flex items-center justify-center">
                        <img
                            src={images[currentImageIndex]}
                            alt={`${company.name} - ${currentImageIndex + 1}`}
                            className="max-w-full max-h-full object-contain"
                        />
                    </div>

                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white">
                        {currentImageIndex + 1} / {images.length}
                    </div>
                </div>
            )}
        </>
    );
};
