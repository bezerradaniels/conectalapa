import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, MapPin, Music, DollarSign, Filter, X } from 'lucide-react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { supabase } from '../lib/supabase';

const EVENT_TYPES = [
    { value: 'show', label: 'Show' },
    { value: 'esportivo', label: 'Esportivo' },
    { value: 'religioso', label: 'Religioso' },
    { value: 'educacao', label: 'Educação' },
    { value: 'negocios', label: 'Negócios' },
    { value: 'feira', label: 'Feira' },
    { value: 'palestra', label: 'Palestra' },
    { value: 'teatro', label: 'Teatro' },
];

export const EventsList: React.FC = () => {
    const [events, setEvents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedType, setSelectedType] = useState('');
    const [showFilters, setShowFilters] = useState(false);

    useEffect(() => {
        loadEvents();
    }, []);

    useEffect(() => {
        filterEvents();
    }, [searchTerm, selectedType]);

    const loadEvents = async () => {
        try {
            setLoading(true);
            const { data } = await supabase
                .from('events')
                .select('*')
                .eq('status', 'active')
                .gte('event_date', new Date().toISOString().split('T')[0])
                .order('event_date', { ascending: true });

            setEvents(data || []);
        } catch (error) {
            console.error('Error loading events:', error);
        } finally {
            setLoading(false);
        }
    };

    const filterEvents = async () => {
        try {
            let query = supabase
                .from('events')
                .select('*')
                .eq('status', 'active')
                .gte('event_date', new Date().toISOString().split('T')[0]);

            if (searchTerm) {
                query = query.or(`name.ilike.%${searchTerm}%,location.ilike.%${searchTerm}%`);
            }

            if (selectedType) {
                query = query.eq('event_type', selectedType);
            }

            const { data } = await query.order('event_date', { ascending: true });
            setEvents(data || []);
        } catch (error) {
            console.error('Error filtering events:', error);
        }
    };

    const clearFilters = () => {
        setSearchTerm('');
        setSelectedType('');
    };

    const hasActiveFilters = searchTerm || selectedType;

    if (loading) {
        return (
            <div className="max-w-[1140px] mx-auto py-8 px-6">
                <div className="text-center py-12">
                    <div className="inline-block w-8 h-8 border-4 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin mb-4"></div>
                    <p className="text-[var(--color-neutral-500)]">Carregando eventos...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-[1140px] mx-auto py-8 px-6">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-[var(--color-neutral-900)] mb-2">
                    Eventos
                </h1>
                <p className="text-[var(--color-neutral-500)]">
                    Descubra os próximos eventos em Bom Jesus da Lapa
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
                            placeholder="Buscar eventos..."
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
                                Tipo de Evento
                            </label>
                            <select
                                value={selectedType}
                                onChange={(e) => setSelectedType(e.target.value)}
                                className="w-full h-12 px-4 rounded-xl border-2 border-[var(--color-neutral-200)] bg-[var(--color-cream)] text-[var(--color-neutral-900)] focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary-light)] outline-none transition-all cursor-pointer"
                            >
                                <option value="">Todos os tipos</option>
                                {EVENT_TYPES.map((type) => (
                                    <option key={type.value} value={type.value}>
                                        {type.label}
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
                    {events.length} {events.length === 1 ? 'evento encontrado' : 'eventos encontrados'}
                </p>
            </div>

            {/* Events Grid */}
            {events.length === 0 ? (
                <Card className="text-center py-12">
                    <Music size={48} className="mx-auto mb-4 text-[var(--color-neutral-400)]" />
                    <p className="text-[var(--color-neutral-500)] mb-4">
                        {hasActiveFilters ? 'Nenhum evento encontrado com os filtros selecionados.' : 'Nenhum evento disponível no momento.'}
                    </p>
                    {hasActiveFilters && (
                        <Button variant="secondary" onClick={clearFilters} className="cursor-pointer">
                            Limpar Filtros
                        </Button>
                    )}
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {events.map((event) => (
                        <Card key={event.id} className="hover:shadow-xl transition-shadow">
                            <div className="flex gap-4">
                                {/* Date Badge */}
                                <div className="flex-shrink-0 w-20 h-20 bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-dark)] rounded-xl flex flex-col items-center justify-center text-white">
                                    <span className="text-2xl font-bold">
                                        {new Date(event.event_date).getDate()}
                                    </span>
                                    <span className="text-xs uppercase">
                                        {new Date(event.event_date).toLocaleDateString('pt-BR', { month: 'short' })}
                                    </span>
                                </div>

                                {/* Event Info */}
                                <div className="flex-1">
                                    <div className="flex items-start justify-between mb-2">
                                        <h3 className="text-lg font-semibold text-[var(--color-neutral-900)]">
                                            {event.name}
                                        </h3>
                                        <span className="px-2 py-1 bg-[var(--color-primary-light)] text-[var(--color-primary-dark)] rounded-full text-xs font-medium whitespace-nowrap ml-2">
                                            {EVENT_TYPES.find(t => t.value === event.event_type)?.label || event.event_type}
                                        </span>
                                    </div>

                                    <div className="space-y-1 mb-3">
                                        <div className="flex items-center gap-2 text-sm text-[var(--color-neutral-600)]">
                                            <MapPin size={14} />
                                            <span className="line-clamp-1">{event.location}</span>
                                        </div>
                                        {event.age_rating && (
                                            <div className="text-sm text-[var(--color-neutral-600)]">
                                                Classificação: {event.age_rating}
                                            </div>
                                        )}
                                        {event.is_free ? (
                                            <div className="flex items-center gap-1 text-sm font-semibold text-[var(--color-success)]">
                                                <DollarSign size={14} />
                                                Gratuito
                                            </div>
                                        ) : event.ticket_price && (
                                            <div className="flex items-center gap-1 text-sm text-[var(--color-neutral-600)]">
                                                <DollarSign size={14} />
                                                {event.ticket_price}
                                            </div>
                                        )}
                                    </div>

                                    <Link to={`/evento/${event.id}`}>
                                        <Button variant="secondary" className="w-full cursor-pointer text-sm">
                                            Ver Detalhes
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
};
