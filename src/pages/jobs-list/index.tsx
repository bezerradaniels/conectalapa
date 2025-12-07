import React, { useEffect, useState } from 'react';
import { Search, Briefcase, DollarSign, Calendar, X } from 'lucide-react';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { supabase } from '../../lib/supabase';

export const JobsList: React.FC = () => {
    const [jobs, setJobs] = useState<any[]>([]);

    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        loadJobs();
    }, []);

    useEffect(() => {
        filterJobs();
    }, [searchTerm]);

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

            {/* Search */}
            <Card className="mb-6">
                <div className="space-y-4">
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
                    {searchTerm && (
                        <div className="flex justify-end">
                            <Button
                                variant="ghost"
                                onClick={clearFilters}
                                className="flex items-center gap-2 text-danger cursor-pointer"
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
                <p className="text-sm text-neutral-500">
                    {jobs.length} {jobs.length === 1 ? 'vaga encontrada' : 'vagas encontradas'}
                </p>
            </div>

            {/* Jobs List */}
            {jobs.length === 0 ? (
                <Card className="text-center py-12">
                    <Briefcase size={48} className="mx-auto mb-4 text-neutral-400" />
                    <p className="text-neutral-500 mb-4">
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
