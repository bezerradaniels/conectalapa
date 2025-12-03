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
import { supabase } from '../lib/supabase';
import { Button } from '../components/Button';
import { Card } from '../components/Card';

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
    const [loading, setLoading] = useState(true);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [showGallery, setShowGallery] = useState(false);
    const [isFavorite, setIsFavorite] = useState(false);

    useEffect(() => {
        loadCompany();
    }, [slug]);

    const loadCompany = async () => {
        try {
            setLoading(true);

            // Buscar empresa pelo slug
            const { data, error } = await supabase
                .from('companies')
                .select('*')
                .eq('status', 'active')
                .eq('slug', slug)
                .single();

            if (error) {
                // Se não encontrar por slug, tentar por nome (fallback para dados antigos)
                const { data: fallbackData, error: fallbackError } = await supabase
                    .from('companies')
                    .select('*')
                    .eq('status', 'active')
                    .ilike('name', `%${slug?.replace(/-/g, ' ')}%`)
                    .single();

                if (fallbackError) throw fallbackError;
                setCompany(fallbackData);
            } else {
                setCompany(data);
            }
        } catch (error) {
            console.error('Error loading company:', error);
            navigate('/empresas');
        } finally {
            setLoading(false);
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

    if (loading) {
        return (
            <div className="max-w-[1140px] mx-auto py-8 px-6">
                <div className="text-center py-12">
                    <div className="inline-block w-8 h-8 border-4 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin mb-4"></div>
                    <p className="text-[var(--color-neutral-500)]">Carregando...</p>
                </div>
            </div>
        );
    }

    if (!company) {
        return (
            <div className="max-w-[1140px] mx-auto py-8 px-6">
                <div className="text-center py-12">
                    <h2 className="text-2xl font-bold text-[var(--color-neutral-900)] mb-4">
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
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <h1 className="text-3xl font-bold text-[var(--color-neutral-900)] mb-2">
                                {company.name}
                            </h1>
                            <div className="flex items-center gap-4 text-sm text-[var(--color-neutral-500)]">
                                <span className="px-3 py-1 bg-[var(--color-primary-light)] text-[var(--color-primary-dark)] rounded-full font-medium">
                                    {company.category}
                                </span>
                                {company.address && (
                                    <div className="flex items-center gap-1">
                                        <MapPin size={16} />
                                        <span>{company.address}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="flex gap-2">
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
                    <div className="lg:col-span-2 space-y-8">
                        {/* Description */}
                        <Card>
                            <h2 className="text-xl font-semibold text-[var(--color-neutral-900)] mb-4">
                                Sobre
                            </h2>
                            <p className="text-[var(--color-neutral-700)] leading-relaxed whitespace-pre-line">
                                {company.description}
                            </p>
                        </Card>

                        {/* Contact Info */}
                        <Card>
                            <h2 className="text-xl font-semibold text-[var(--color-neutral-900)] mb-4">
                                Informações de Contato
                            </h2>
                            <div className="space-y-4">
                                {company.phone && (
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-[var(--color-primary-light)] rounded-lg flex items-center justify-center">
                                            <Phone size={20} className="text-[var(--color-primary-dark)]" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-[var(--color-neutral-500)]">Telefone</p>
                                            <a
                                                href={`tel:${company.phone}`}
                                                className="text-[var(--color-neutral-900)] font-medium hover:text-[var(--color-primary)] transition-colors"
                                            >
                                                {company.phone}
                                            </a>
                                        </div>
                                    </div>
                                )}

                                {company.email && (
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-[var(--color-primary-light)] rounded-lg flex items-center justify-center">
                                            <Mail size={20} className="text-[var(--color-primary-dark)]" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-[var(--color-neutral-500)]">Email</p>
                                            <a
                                                href={`mailto:${company.email}`}
                                                className="text-[var(--color-neutral-900)] font-medium hover:text-[var(--color-primary)] transition-colors"
                                            >
                                                {company.email}
                                            </a>
                                        </div>
                                    </div>
                                )}

                                {company.address && (
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-[var(--color-primary-light)] rounded-lg flex items-center justify-center">
                                            <MapPin size={20} className="text-[var(--color-primary-dark)]" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-[var(--color-neutral-500)]">Endereço</p>
                                            <p className="text-[var(--color-neutral-900)] font-medium">
                                                {company.address}
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {company.opening_hours && (
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-[var(--color-primary-light)] rounded-lg flex items-center justify-center">
                                            <Clock size={20} className="text-[var(--color-primary-dark)]" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-[var(--color-neutral-500)]">Horário de Funcionamento</p>
                                            <p className="text-[var(--color-neutral-900)] font-medium">
                                                {company.opening_hours}
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </Card>
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        <Card className="sticky top-8">
                            <h3 className="text-lg font-semibold text-[var(--color-neutral-900)] mb-4">
                                Entre em Contato
                            </h3>

                            <div className="space-y-3">
                                {company.phone && (
                                    <a href={`tel:${company.phone}`}>
                                        <Button variant="primary" className="w-full flex items-center justify-center gap-2">
                                            <Phone size={18} />
                                            Ligar Agora
                                        </Button>
                                    </a>
                                )}

                                {company.website && (
                                    <a href={company.website} target="_blank" rel="noopener noreferrer">
                                        <Button variant="secondary" className="w-full flex items-center justify-center gap-2">
                                            <ExternalLink size={18} />
                                            Visitar Site
                                        </Button>
                                    </a>
                                )}

                                {company.email && (
                                    <a href={`mailto:${company.email}`}>
                                        <Button variant="secondary" className="w-full flex items-center justify-center gap-2">
                                            <Mail size={18} />
                                            Enviar Email
                                        </Button>
                                    </a>
                                )}
                            </div>

                            <div className="mt-6 pt-6 border-t border-[var(--color-neutral-200)]">
                                <p className="text-xs text-[var(--color-neutral-500)] text-center">
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
