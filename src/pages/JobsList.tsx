import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Briefcase, DollarSign, Calendar, X } from 'lucide-react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { supabase } from '../lib/supabase';

export const JobsList: React.FC = () => {
    const [jobs, setJobs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        loadJobs();
    }, []);

    useEffect(() => {
        filterJobs();
    }, [searchTerm]);

    const loadJobs = async () => {
        try {
            setLoading(true);
            const { data } = await supabase
                .from('jobs')
                .select('*')
                .eq('status', 'active')
                .order('created_at', { ascending: false });

            setJobs(data || []);
        } catch (error) {
            console.error('Error loading jobs:', error);
        } finally {
            setLoading(false);
        }
    };

    const filterJobs = async () => {
        try {
            let query = supabase
                .from('jobs')
                .select('*')
                .eq('status', 'active');

            if (searchTerm) {
                query = query.or(`title.ilike.%${searchTerm}%,company_name.ilike.%${searchTerm}%`);
            }

            const { data } = await query.order('created_at', { ascending: false });
            setJobs(data || []);
        } catch (error) {
            console.error('Error filtering jobs:', error);
        }
    };

    const clearFilters = () => {
        setSearchTerm('');
    };

    if (loading) {
        return (
            <div className="max-w-[1140px] mx-auto py-8 px-6">
                <div className="text-center py-12">
                    <div className="inline-block w-8 h-8 border-4 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin mb-4"></div>
                    <p className="text-[var(--color-neutral-500)]">Carregando vagas...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-[1140px] mx-auto py-8 px-6">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-[var(--color-neutral-900)] mb-2">
                    Vagas de Emprego
                </h1>
                <p className="text-[var(--color-neutral-500)]">
                    Encontre oportunidades de trabalho em Bom Jesus da Lapa
                </p>
            </div>

            {/* Search */}
            <Card className="mb-6">
                <div className="space-y-4">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-neutral-400)]" size={20} />
                        <input
                            type="text"
                            placeholder="Buscar vagas por título ou empresa..."
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
                    {jobs.length} {jobs.length === 1 ? 'vaga encontrada' : 'vagas encontradas'}
                </p>
            </div>

            {/* Jobs List */}
            {jobs.length === 0 ? (
                <Card className="text-center py-12">
                    <Briefcase size={48} className="mx-auto mb-4 text-[var(--color-neutral-400)]" />
                    <p className="text-[var(--color-neutral-500)] mb-4">
                        {searchTerm ? 'Nenhuma vaga encontrada com esse termo.' : 'Nenhuma vaga disponível no momento.'}
                    </p>
                    {searchTerm && (
                        <Button variant="secondary" onClick={clearFilters} className="cursor-pointer">
                            Limpar Busca
                        </Button>
                    )}
                </Card>
            ) : (
                <div className="space-y-4">
                    {jobs.map((job) => (
                        <Card key={job.id} className="hover:shadow-xl transition-shadow">
                            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                                <div className="flex-1">
                                    <h3 className="text-xl font-semibold text-[var(--color-neutral-900)] mb-2">
                                        {job.title}
                                    </h3>
                                    <div className="flex items-center gap-2 text-sm text-[var(--color-neutral-600)] mb-3">
                                        <Briefcase size={16} />
                                        <span className="font-medium">{job.company_name}</span>
                                    </div>
                                    {job.salary && (
                                        <div className="flex items-center gap-2 text-sm text-[var(--color-neutral-600)] mb-3">
                                            <DollarSign size={16} />
                                            <span>{job.salary}</span>
                                        </div>
                                    )}
                                    {job.deadline && (
                                        <div className="flex items-center gap-2 text-sm text-[var(--color-neutral-600)] mb-3">
                                            <Calendar size={16} />
                                            <span>Inscrições até: {new Date(job.deadline).toLocaleDateString('pt-BR')}</span>
                                        </div>
                                    )}
                                    <p className="text-sm text-[var(--color-neutral-600)] line-clamp-2">
                                        {job.description}
                                    </p>
                                </div>
                                <div className="flex md:flex-col gap-2">
                                    <Link to={`/vaga/${job.id}`} className="flex-1 md:flex-initial">
                                        <Button variant="primary" className="w-full cursor-pointer">
                                            Ver Vaga
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
