import React, { useEffect, useState } from 'react';
import { Search, UtensilsCrossed, Filter, X } from 'lucide-react';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { supabase } from '../../lib/supabase';

const FOOD_TYPES = [
    'Restaurante',
    'Lanchonete',
    'Bar',
    'Espetinho',
    'Sorveteria',
    'Açaí',
    'Creperia',
    'Hamburgeria',
    'Acarajé',
];

export const FoodsList: React.FC = () => {
    const [foods, setFoods] = useState<any[]>([]);

    const [searchTerm, setSearchTerm] = useState('');
    const [selectedType, setSelectedType] = useState('');
    const [showFilters, setShowFilters] = useState(false);

    useEffect(() => {
        loadFoods();
    }, []);

    useEffect(() => {
        filterFoods();
    }, [searchTerm, selectedType]);

    const loadFoods = async () => {
        try {

            const { data } = await supabase
                .from('foods')
                .select('*')
                .eq('status', 'active')
                .order('created_at', { ascending: false });

            setFoods(data || []);
        } catch (error) {
            console.error('Error loading foods:', error);
        }
    };

    const filterFoods = async () => {
        try {
            let query = supabase
                .from('foods')
                .select('*')
                .eq('status', 'active');

            if (searchTerm) {
                query = query.ilike('name', `%${searchTerm}%`);
            }

            if (selectedType) {
                query = query.contains('types', [selectedType.toLowerCase()]);
            }

            const { data } = await query.order('created_at', { ascending: false });
            setFoods(data || []);
        } catch (error) {
            console.error('Error filtering foods:', error);
        }
    };

    const clearFilters = () => {
        setSearchTerm('');
        setSelectedType('');
    };

    const getFoodTypes = (types: any) => {
        if (!types) return [];
        if (typeof types === 'string') {
            try {
                types = JSON.parse(types);
            } catch {
                return [];
            }
        }
        return Object.entries(types)
            .filter(([_, value]) => value)
            .map(([key]) => key.charAt(0).toUpperCase() + key.slice(1));
    };

    const hasActiveFilters = searchTerm || selectedType;



    return (
        <div className="max-w-[1140px] mx-auto py-8 px-6">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-[var(--color-neutral-900)] mb-2">
                    Alimentação
                </h1>
                <p className="text-[var(--color-neutral-500)]">
                    Restaurantes, lanchonetes e muito mais
                </p>
            </div>

            {/* Search and Filters */}
            <Card className="mb-6">
                <div className="space-y-4">
                    {/* Search Bar */}
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-neutral-400)]" size={20} />
                        <input
                            type="text"
                            placeholder="Buscar por nome..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full h-12 pl-12 pr-4 rounded-xl border-2 border-[var(--color-neutral-200)] bg-[var(--color-cream)] text-[var(--color-neutral-900)] placeholder:text-[var(--color-neutral-400)] focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary-light)] outline-none transition-all"
                        />
                    </div>

                    {/* Filter Toggle Button */}
                    <div className="flex items-center justify-between">
                        <Button
                            variant="ghost"
                            onClick={() => setShowFilters(!showFilters)}
                            className="flex items-center gap-2 cursor-pointer"
                        >
                            <Filter size={18} />
                            {showFilters ? 'Ocultar Filtros' : 'Mostrar Filtros'}
                        </Button>
                        {hasActiveFilters && (
                            <Button
                                variant="ghost"
                                onClick={clearFilters}
                                className="flex items-center gap-2 text-[var(--color-danger)] cursor-pointer"
                            >
                                <X size={18} />
                                Limpar Filtros
                            </Button>
                        )}
                    </div>

                    {/* Filters */}
                    {showFilters && (
                        <div className="pt-4 border-t border-[var(--color-neutral-200)]">
                            <label className="block text-sm font-semibold text-[var(--color-neutral-700)] mb-2">
                                Tipo de Estabelecimento
                            </label>
                            <select
                                value={selectedType}
                                onChange={(e) => setSelectedType(e.target.value)}
                                className="w-full h-12 px-4 rounded-xl border-2 border-[var(--color-neutral-200)] bg-[var(--color-cream)] text-[var(--color-neutral-900)] focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary-light)] outline-none transition-all cursor-pointer"
                            >
                                <option value="">Todos os tipos</option>
                                {FOOD_TYPES.map((type) => (
                                    <option key={type} value={type}>
                                        {type}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}
                </div>
            </Card>

            {/* Results Count */}
            <div className="mb-4">
                <p className="text-sm text-[var(--color-neutral-500)]">
                    {foods.length} {foods.length === 1 ? 'estabelecimento encontrado' : 'estabelecimentos encontrados'}
                </p>
            </div>

            {/* Foods Grid */}
            {foods.length === 0 ? (
                <Card className="text-center py-12">
                    <UtensilsCrossed size={48} className="mx-auto mb-4 text-[var(--color-neutral-400)]" />
                    <p className="text-[var(--color-neutral-500)] mb-4">
                        {hasActiveFilters ? 'Nenhum estabelecimento encontrado.' : 'Nenhum estabelecimento cadastrado no momento.'}
                    </p>
                    {hasActiveFilters && (
                        <Button variant="secondary" onClick={clearFilters} className="cursor-pointer">
                            Limpar Filtros
                        </Button>
                    )}
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {foods.map((food) => (
                        <Card key={food.id} className="hover:shadow-xl transition-shadow cursor-pointer">
                            <div className="aspect-video bg-[var(--color-neutral-100)] rounded-lg mb-4 overflow-hidden">
                                {food.logo_url ? (
                                    <img
                                        src={food.logo_url}
                                        alt={food.name}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-[var(--color-neutral-400)]">
                                        <UtensilsCrossed size={48} />
                                    </div>
                                )}
                            </div>
                            <h3 className="text-lg font-semibold text-[var(--color-neutral-900)] mb-2">
                                {food.name}
                            </h3>
                            <div className="flex flex-wrap gap-1 mb-3">
                                {getFoodTypes(food.types).slice(0, 3).map((type) => (
                                    <span
                                        key={type}
                                        className="px-2 py-1 bg-[var(--color-primary-light)] text-[var(--color-primary-dark)] rounded-full text-xs font-medium"
                                    >
                                        {type}
                                    </span>
                                ))}
                                {getFoodTypes(food.types).length > 3 && (
                                    <span className="px-2 py-1 bg-[var(--color-neutral-200)] text-[var(--color-neutral-700)] rounded-full text-xs font-medium">
                                        +{getFoodTypes(food.types).length - 3}
                                    </span>
                                )}
                            </div>
                            <Button
                                variant="secondary"
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
