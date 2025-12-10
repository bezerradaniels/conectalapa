import React, { useEffect, useState } from 'react';
import { Search, Briefcase, DollarSign, Calendar, X, Filter, MapPin, Clock } from 'lucide-react';

const WORK_TYPES = [
    { value: 'tempo-integral', label: 'Tempo Integral' },
    { value: 'meio-periodo', label: 'Meio Período' },
    { value: 'temporario', label: 'Temporário' },
];

const WORK_LOCATIONS = [
    { value: 'presencial', label: 'Presencial' },
    { value: 'remoto', label: 'Remoto' },
    { value: 'hibrido', label: 'Híbrido' },
];

const DEADLINE_FILTERS = [
    { value: 'open', label: 'Inscrições Abertas' },
    { value: 'closed', label: 'Inscrições Encerradas' },
];
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { supabase } from '../../lib/supabase';

export const JobsList: React.FC = () => {
    const [jobs, setJobs] = useState<any[]>([]);

    const [searchTerm, setSearchTerm] = useState('');
    const [selectedWorkType, setSelectedWorkType] = useState('');
    const [selectedWorkLocation, setSelectedWorkLocation] = useState('');
    const [selectedDeadline, setSelectedDeadline] = useState('');
    const [showFilters, setShowFilters] = useState(false);

    useEffect(() => {
        loadJobs();
    }, []);

    useEffect(() => {
        filterJobs();
    }, [searchTerm, selectedWorkType, selectedWorkLocation, selectedDeadline]);

    const loadJobs = async () => {
        try {

            const { data } = await supabase
                .from('jobs')
                .select('*')
                .eq('status', 'active')
                .order('created_at', { ascending: false });

            setJobs(data || []);
        } catch (error) {
            console.error('Error loading jobs:', error);
        }
    };

    const filterJobs = async () => {
        try {
            const today = new Date().toISOString().split('T')[0];
            let query = supabase
                .from('jobs')
                .select('*')
                .eq('status', 'active');

            if (searchTerm) {
                query = query.or(`title.ilike.%${searchTerm}%,company_name.ilike.%${searchTerm}%`);
            }

            if (selectedWorkType) {
                query = query.eq('work_type', selectedWorkType);
            }

            if (selectedWorkLocation) {
                query = query.eq('work_location', selectedWorkLocation);
            }

            if (selectedDeadline === 'open') {
                query = query.or(`deadline.is.null,deadline.gte.${today}`);
            } else if (selectedDeadline === 'closed') {
                query = query.not('deadline', 'is', null).lt('deadline', today);
            }

            const { data } = await query.order('created_at', { ascending: false });
            setJobs(data || []);
        } catch (error) {
            console.error('Error filtering jobs:', error);
        }
    };

    const clearFilters = () => {
        setSearchTerm('');
        setSelectedWorkType('');
        setSelectedWorkLocation('');
        setSelectedDeadline('');
    };

    const hasActiveFilters = searchTerm || selectedWorkType || selectedWorkLocation || selectedDeadline;



    return (
        <div className="max-w-[1140px] mx-auto py-8 px-6">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-neutral-900 mb-2">
                    Vagas de Emprego
                </h1>
                <p className="text-neutral-500">
                    Encontre oportunidades de trabalho em Bom Jesus da Lapa
                </p>
            </div>

            {/* Search and Filters */}
            <Card className="mb-6">
                <div className="space-y-4">
                    {/* Search Bar */}
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" size={20} />
                        <input
                            type="text"
                            placeholder="Buscar vagas por título ou empresa..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full h-12 pl-12 pr-4 rounded-xl border-2 border-neutral-200 bg-cream text-neutral-900 placeholder:text-neutral-400 focus:border-primary focus:ring-2 focus:ring-primary-light outline-none transition-all"
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
                                className="flex items-center gap-2 text-danger cursor-pointer"
                            >
                                <X size={18} />
                                Limpar Filtros
                            </Button>
                        )}
                    </div>

                    {/* Filters */}
                    {showFilters && (
                        <div className="pt-4 border-t border-neutral-200 grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-neutral-700 mb-2">
                                    <Clock size={14} className="inline mr-1" />
                                    Tipo de Contratação
                                </label>
                                <select
                                    value={selectedWorkType}
                                    onChange={(e) => setSelectedWorkType(e.target.value)}
                                    className="w-full h-12 px-4 rounded-xl border-2 border-neutral-200 bg-cream text-neutral-900 focus:border-primary focus:ring-2 focus:ring-primary-light outline-none transition-all cursor-pointer"
                                >
                                    <option value="">Todos os tipos</option>
                                    {WORK_TYPES.map((type) => (
                                        <option key={type.value} value={type.value}>
                                            {type.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-neutral-700 mb-2">
                                    <MapPin size={14} className="inline mr-1" />
                                    Modalidade
                                </label>
                                <select
                                    value={selectedWorkLocation}
                                    onChange={(e) => setSelectedWorkLocation(e.target.value)}
                                    className="w-full h-12 px-4 rounded-xl border-2 border-neutral-200 bg-cream text-neutral-900 focus:border-primary focus:ring-2 focus:ring-primary-light outline-none transition-all cursor-pointer"
                                >
                                    <option value="">Todas as modalidades</option>
                                    {WORK_LOCATIONS.map((loc) => (
                                        <option key={loc.value} value={loc.value}>
                                            {loc.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-neutral-700 mb-2">
                                    <Calendar size={14} className="inline mr-1" />
                                    Status das Inscrições
                                </label>
                                <select
                                    value={selectedDeadline}
                                    onChange={(e) => setSelectedDeadline(e.target.value)}
                                    className="w-full h-12 px-4 rounded-xl border-2 border-neutral-200 bg-cream text-neutral-900 focus:border-primary focus:ring-2 focus:ring-primary-light outline-none transition-all cursor-pointer"
                                >
                                    <option value="">Todas</option>
                                    {DEADLINE_FILTERS.map((df) => (
                                        <option key={df.value} value={df.value}>
                                            {df.label}
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
                <p className="text-sm text-neutral-500">
                    {jobs.length} {jobs.length === 1 ? 'vaga encontrada' : 'vagas encontradas'}
                </p>
            </div>

            {/* Jobs List */}
            {jobs.length === 0 ? (
                <Card className="text-center py-12">
                    <Briefcase size={48} className="mx-auto mb-4 text-neutral-400" />
                    <p className="text-neutral-500 mb-4">
                        {hasActiveFilters ? 'Nenhuma vaga encontrada com os filtros selecionados.' : 'Nenhuma vaga disponível no momento.'}
                    </p>
                    {hasActiveFilters && (
                        <Button variant="secondary" onClick={clearFilters} className="cursor-pointer">
                            Limpar Filtros
                        </Button>
                    )}
                </Card>
            ) : (
                <div className="space-y-4">
                    {jobs.map((job) => (
                        <Card key={job.id} className="hover:shadow-xl transition-shadow">
                            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                                <div className="flex-1">
                                    <h3 className="text-xl font-semibold text-neutral-900 mb-2">
                                        {job.title}
                                    </h3>
                                    <div className="flex items-center gap-2 text-sm text-neutral-600 mb-3">
                                        <Briefcase size={16} />
                                        <span className="font-medium">{job.company_name}</span>
                                    </div>
                                    {job.salary && (
                                        <div className="flex items-center gap-2 text-sm text-neutral-600 mb-3">
                                            <DollarSign size={16} />
                                            <span>
                                                {new Intl.NumberFormat('pt-BR', {
                                                    style: 'currency',
                                                    currency: 'BRL'
                                                }).format(parseFloat(job.salary.replace(/[^\d,]/g, '').replace(',', '.')) || 0)}
                                            </span>
                                        </div>
                                    )}
                                    {job.deadline && (
                                        <div className="flex items-center gap-2 text-sm text-neutral-600 mb-3">
                                            <Calendar size={16} />
                                            <span>Inscrições até: {new Date(job.deadline).toLocaleDateString('pt-BR')}</span>
                                        </div>
                                    )}

                                </div>
                                <div className="flex md:flex-col gap-2">
                                    <div className="flex-1 md:flex-initial">
                                        <Button
                                            variant="primary"
                                            className="w-full cursor-pointer"
                                            onClick={() => alert('Funcionalidade em desenvolvimento')}
                                        >
                                            Ver Vaga
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
};
