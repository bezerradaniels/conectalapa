import React, { useEffect, useState } from 'react';
import { Search, Palmtree, MapPin, Calendar, X } from 'lucide-react';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { supabase } from '../../lib/supabase';

export const TravelPackagesList: React.FC = () => {
    const [packages, setPackages] = useState<any[]>([]);

    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        loadPackages();
    }, []);

    useEffect(() => {
        filterPackages();
    }, [searchTerm]);

    const loadPackages = async () => {
        try {

            const { data } = await supabase
                .from('travel_packages')
                .select('*')
                .eq('status', 'active')
                .order('departure_date', { ascending: true });

            setPackages(data || []);
        } catch (error) {
            console.error('Error loading packages:', error);
        }
    };

    const filterPackages = async () => {
        try {
            let query = supabase
                .from('travel_packages')
                .select('*')
                .eq('status', 'active');

            if (searchTerm) {
                query = query.or(`destination.ilike.%${searchTerm}%,departure_location.ilike.%${searchTerm}%`);
            }

            const { data } = await query.order('departure_date', { ascending: true });
            setPackages(data || []);
        } catch (error) {
            console.error('Error filtering packages:', error);
        }
    };

    const clearFilters = () => {
        setSearchTerm('');
    };



    return (
        <div className="max-w-[1140px] mx-auto py-8 px-6">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-[var(--color-neutral-900)] mb-2">
                    Viagens e Turismo
                </h1>
                <p className="text-[var(--color-neutral-500)]">
                    Explore destinos incríveis com agências locais
                </p>
            </div>

            {/* Search */}
            <Card className="mb-6">
                <div className="space-y-4">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-neutral-400)]" size={20} />
                        <input
                            type="text"
                            placeholder="Buscar por destino..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full h-12 pl-12 pr-4 rounded-xl border-2 border-[var(--color-neutral-200)] bg-[var(--color-cream)] text-[var(--color-neutral-900)] placeholder:text-[var(--color-neutral-400)] focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary-light)] outline-none transition-all"
                        />
                    </div>
                    {searchTerm && (
                        <div className="flex justify-end">
                            <Button
                                variant="ghost"
                                onClick={clearFilters}
                                className="flex items-center gap-2 text-[var(--color-danger)] cursor-pointer"
                            >
                                <X size={18} />
                                Limpar Busca
                            </Button>
                        </div>
                    )}
                </div>
            </Card>

            {/* Results Count */}
            <div className="mb-4">
                <p className="text-sm text-[var(--color-neutral-500)]">
                    {packages.length} {packages.length === 1 ? 'viagem encontrada' : 'viagens encontradas'}
                </p>
            </div>

            {/* Packages Grid */}
            {packages.length === 0 ? (
                <Card className="text-center py-12">
                    <Palmtree size={48} className="mx-auto mb-4 text-[var(--color-neutral-400)]" />
                    <p className="text-[var(--color-neutral-500)] mb-4">
                        {searchTerm ? 'Nenhuma viagem encontrada.' : 'Nenhuma viagem disponível no momento.'}
                    </p>
                    {searchTerm && (
                        <Button variant="secondary" onClick={clearFilters} className="cursor-pointer">
                            Limpar Busca
                        </Button>
                    )}
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {packages.map((pkg) => (
                        <Card key={pkg.id} className="hover:shadow-xl transition-shadow">
                            <div className="aspect-video bg-gradient-to-br from-[var(--color-primary-light)] to-[var(--color-primary)] rounded-lg mb-4 flex items-center justify-center">
                                <Palmtree size={48} className="text-white" />
                            </div>
                            <h3 className="text-xl font-semibold text-[var(--color-neutral-900)] mb-2">
                                {pkg.destination}
                            </h3>
                            <div className="space-y-2 mb-4">
                                <div className="flex items-center gap-2 text-sm text-[var(--color-neutral-600)]">
                                    <MapPin size={16} />
                                    <span>Saída de: {pkg.departure_location}</span>
                                </div>
                                {pkg.departure_date && (
                                    <div className="flex items-center gap-2 text-sm text-[var(--color-neutral-600)]">
                                        <Calendar size={16} />
                                        <span>
                                            {new Date(pkg.departure_date).toLocaleDateString('pt-BR')}
                                            {pkg.return_date && ` - ${new Date(pkg.return_date).toLocaleDateString('pt-BR')}`}
                                        </span>
                                    </div>
                                )}
                            </div>
                            {pkg.description && (
                                <p className="text-sm text-[var(--color-neutral-600)] line-clamp-3 mb-4">
                                    {pkg.description}
                                </p>
                            )}
                            <Button
                                variant="primary"
                                className="w-full cursor-pointer"
                                onClick={() => alert('Funcionalidade em desenvolvimento')}
                            >
                                Ver Detalhes
                            </Button>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
};
