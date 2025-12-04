import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, MapPin, Filter, X } from 'lucide-react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { supabase } from '../lib/supabase';

export const CompaniesList: React.FC = () => {
    const [companies, setCompanies] = useState<any[]>([]);
    const [categories, setCategories] = useState<any[]>([]);
    const [neighborhoods, setNeighborhoods] = useState<any[]>([]);

    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedNeighborhood, setSelectedNeighborhood] = useState('');
    const [showFilters, setShowFilters] = useState(false);

    useEffect(() => {
        loadData();
    }, []);

    useEffect(() => {
        filterCompanies();
    }, [searchTerm, selectedCategory, selectedNeighborhood]);

    const loadData = async () => {
        try {


            // Carregar empresas ativas
            const { data: companiesData } = await supabase
                .from('companies')
                .select(`
                    *,
                    business_categories(name),
                    neighborhoods(name)
                `)
                .eq('status', 'active')
                .order('created_at', { ascending: false });

            setCompanies(companiesData || []);

            // Carregar categorias
            const { data: categoriesData } = await supabase
                .from('business_categories')
                .select('id, name')
                .is('parent_id', null)
                .order('name');

            setCategories(categoriesData || []);

            // Carregar bairros
            const { data: neighborhoodsData } = await supabase
                .from('neighborhoods')
                .select('id, name')
                .order('name');

            setNeighborhoods(neighborhoodsData || []);
        } catch (error) {
            console.error('Error loading companies:', error);
        }
    };

    const filterCompanies = async () => {
        try {
            let query = supabase
                .from('companies')
                .select(`
                    *,
                    business_categories(name),
                    neighborhoods(name)
                `)
                .eq('status', 'active');

            if (searchTerm) {
                query = query.ilike('name', `%${searchTerm}%`);
            }

            if (selectedCategory) {
                query = query.eq('category_id', selectedCategory);
            }

            if (selectedNeighborhood) {
                query = query.eq('neighborhood_id', selectedNeighborhood);
            }

            const { data } = await query.order('created_at', { ascending: false });
            setCompanies(data || []);
        } catch (error) {
            console.error('Error filtering companies:', error);
        }
    };

    const clearFilters = () => {
        setSearchTerm('');
        setSelectedCategory('');
        setSelectedNeighborhood('');
    };

    const hasActiveFilters = searchTerm || selectedCategory || selectedNeighborhood;



    return (
        <div className="max-w-[1140px] mx-auto py-8 px-6">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-[var(--color-neutral-900)] mb-2">
                    Empresas Locais
                </h1>
                <p className="text-[var(--color-neutral-500)]">
                    Encontre empresas em Bom Jesus da Lapa
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
                            placeholder="Buscar por nome da empresa..."
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
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-[var(--color-neutral-200)]">
                            <div>
                                <label className="block text-sm font-semibold text-[var(--color-neutral-700)] mb-2">
                                    Categoria
                                </label>
                                <select
                                    value={selectedCategory}
                                    onChange={(e) => setSelectedCategory(e.target.value)}
                                    className="w-full h-12 px-4 rounded-xl border-2 border-[var(--color-neutral-200)] bg-[var(--color-cream)] text-[var(--color-neutral-900)] focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary-light)] outline-none transition-all cursor-pointer"
                                >
                                    <option value="">Todas as categorias</option>
                                    {categories.map((cat) => (
                                        <option key={cat.id} value={cat.id}>
                                            {cat.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-[var(--color-neutral-700)] mb-2">
                                    Bairro
                                </label>
                                <select
                                    value={selectedNeighborhood}
                                    onChange={(e) => setSelectedNeighborhood(e.target.value)}
                                    className="w-full h-12 px-4 rounded-xl border-2 border-[var(--color-neutral-200)] bg-[var(--color-cream)] text-[var(--color-neutral-900)] focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary-light)] outline-none transition-all cursor-pointer"
                                >
                                    <option value="">Todos os bairros</option>
                                    {neighborhoods.map((nb) => (
                                        <option key={nb.id} value={nb.id}>
                                            {nb.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    )}
                </div>
            </Card>

            {/* Results Count */}
            <div className="mb-4">
                <p className="text-sm text-[var(--color-neutral-500)]">
                    {companies.length} {companies.length === 1 ? 'empresa encontrada' : 'empresas encontradas'}
                </p>
            </div>

            {/* Companies Grid */}
            {companies.length === 0 ? (
                <Card className="text-center py-12">
                    <p className="text-[var(--color-neutral-500)] mb-4">
                        Nenhuma empresa encontrada com os filtros selecionados.
                    </p>
                    {hasActiveFilters && (
                        <Button variant="secondary" onClick={clearFilters} className="cursor-pointer">
                            Limpar Filtros
                        </Button>
                    )}
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {companies.map((company) => (
                        <Card key={company.id} className="hover:shadow-xl transition-shadow cursor-pointer">
                            <div className="aspect-video bg-[var(--color-neutral-100)] rounded-lg mb-4 overflow-hidden">
                                {company.logo_url ? (
                                    <img
                                        src={company.logo_url}
                                        alt={company.name}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-[var(--color-neutral-400)]">
                                        <span className="text-4xl font-bold">
                                            {company.name.charAt(0)}
                                        </span>
                                    </div>
                                )}
                            </div>
                            <h3 className="text-lg font-semibold text-[var(--color-neutral-900)] mb-2">
                                {company.name}
                            </h3>
                            <div className="flex items-center gap-2 text-sm text-[var(--color-neutral-600)] mb-2">
                                <span className="px-2 py-1 bg-[var(--color-primary-light)] text-[var(--color-primary-dark)] rounded-full text-xs font-medium">
                                    {company.business_categories?.name}
                                </span>
                            </div>
                            {company.neighborhoods && (
                                <div className="flex items-center gap-2 text-sm text-[var(--color-neutral-600)] mb-3">
                                    <MapPin size={16} />
                                    <span>{company.neighborhoods.name}</span>
                                </div>
                            )}
                            {company.summary && (
                                <p className="text-sm text-[var(--color-neutral-600)] line-clamp-2 mb-4">
                                    {company.summary}
                                </p>
                            )}
                            <Link to={`/empresa/${company.slug || company.id}`}>
                                <Button variant="secondary" className="w-full cursor-pointer">
                                    Ver Detalhes
                                </Button>
                            </Link>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
};
