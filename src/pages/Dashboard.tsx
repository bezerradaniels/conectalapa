import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Edit2, Pause, Trash2, CheckCircle, XCircle, Plus } from 'lucide-react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

interface DashboardProps {
    isAdmin?: boolean;
}

export const Dashboard: React.FC<DashboardProps> = ({ isAdmin = false }) => {
    const { profile, user } = useAuth();
    const [companies, setCompanies] = useState<any[]>([]);
    const [jobs, setJobs] = useState<any[]>([]);
    const [packages, setPackages] = useState<any[]>([]);
    const [events, setEvents] = useState<any[]>([]);
    const [foods, setFoods] = useState<any[]>([]);
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) {
            loadData();
        }
    }, [user, isAdmin]);

    const loadData = async () => {
        try {
            setLoading(true);
            
            // Carregar empresas
            let companiesQuery = supabase.from('companies').select('*');
            if (!isAdmin && user) {
                companiesQuery = companiesQuery.eq('user_id', user.id);
            }
            const { data: companiesData } = await companiesQuery;
            setCompanies(companiesData || []);

            // Carregar vagas
            let jobsQuery = supabase.from('jobs').select('*');
            if (!isAdmin && user) {
                jobsQuery = jobsQuery.eq('user_id', user.id);
            }
            const { data: jobsData } = await jobsQuery;
            setJobs(jobsData || []);

            // Carregar pacotes
            let packagesQuery = supabase.from('travel_packages').select('*');
            if (!isAdmin && user) {
                packagesQuery = packagesQuery.eq('user_id', user.id);
            }
            const { data: packagesData } = await packagesQuery;
            setPackages(packagesData || []);

            // Carregar eventos (quando a tabela existir)
            // let eventsQuery = supabase.from('events').select('*');
            // if (!isAdmin && user) {
            //     eventsQuery = eventsQuery.eq('user_id', user.id);
            // }
            // const { data: eventsData } = await eventsQuery;
            // setEvents(eventsData || []);

            // Carregar alimentação (quando a tabela existir)
            // let foodsQuery = supabase.from('foods').select('*');
            // if (!isAdmin && user) {
            //     foodsQuery = foodsQuery.eq('user_id', user.id);
            // }
            // const { data: foodsData } = await foodsQuery;
            // setFoods(foodsData || []);

            // Carregar usuários (apenas para admin)
            if (isAdmin) {
                const { data: usersData } = await supabase
                    .from('profiles')
                    .select('id, name, role, created_at')
                    .order('created_at', { ascending: false });
                setUsers(usersData || []);
            }
        } catch (error) {
            console.error('Error loading dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusBadge = (status: string) => {
        const styles = {
            pending: 'bg-[var(--color-accent-yellow)] text-[var(--color-neutral-900)]',
            active: 'bg-[var(--color-primary-light)] text-[var(--color-primary-dark)]',
            inactive: 'bg-[var(--color-neutral-200)] text-[var(--color-neutral-700)]',
        };

        const labels = {
            pending: 'Aguardando aprovação',
            active: 'Ativo',
            inactive: 'Inativo',
        };

        return (
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${styles[status as keyof typeof styles]}`}>
                {labels[status as keyof typeof labels]}
            </span>
        );
    };

    const getCreateLink = (type: string) => {
        const links: { [key: string]: string } = {
            'companies': '/empresa/cadastrar',
            'jobs': '/vaga/cadastrar',
            'packages': '/pacote/cadastrar',
            'events': '/evento/cadastrar',
            'foods': '/alimentacao/cadastrar',
        };
        return links[type] || '#';
    };

    const TableSection = ({ title, data, type }: { title: string; data: any[]; type: string }) => (
        <Card className="mb-8">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-[var(--color-neutral-900)]">{title}</h2>
                {type !== 'users' && (
                    <Link to={getCreateLink(type)}>
                        <Button variant="primary" className="flex items-center gap-2 cursor-pointer">
                            <Plus size={18} />
                            Adicionar
                        </Button>
                    </Link>
                )}
            </div>
            {data.length === 0 ? (
                <div className="text-center py-8">
                    <p className="text-[var(--color-neutral-500)] mb-4">
                        Nenhum item cadastrado ainda.
                    </p>
                    {type !== 'users' && (
                        <Link to={getCreateLink(type)}>
                            <Button variant="secondary" className="cursor-pointer">
                                Criar primeiro cadastro
                            </Button>
                        </Link>
                    )}
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-[var(--color-neutral-200)]">
                                <th className="text-left py-3 px-4 text-sm font-semibold text-[var(--color-neutral-700)]">
                                    {type === 'users' ? 'Nome' : type === 'packages' ? 'Destino' : type === 'jobs' ? 'Título' : 'Nome'}
                                </th>
                                {type === 'users' && (
                                    <th className="text-left py-3 px-4 text-sm font-semibold text-[var(--color-neutral-700)]">Role</th>
                                )}
                                {type !== 'users' && (
                                    <th className="text-left py-3 px-4 text-sm font-semibold text-[var(--color-neutral-700)]">Status</th>
                                )}
                                <th className="text-left py-3 px-4 text-sm font-semibold text-[var(--color-neutral-700)]">Data</th>
                                <th className="text-right py-3 px-4 text-sm font-semibold text-[var(--color-neutral-700)]">Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((item) => (
                                <tr key={item.id} className="border-b border-[var(--color-neutral-200)] last:border-0">
                                    <td className="py-4 px-4 text-[var(--color-neutral-900)]">
                                        {item.name || item.title || item.destination}
                                    </td>
                                    {type === 'users' && (
                                        <td className="py-4 px-4 text-[var(--color-neutral-700)]">{item.role || 'user'}</td>
                                    )}
                                    {type !== 'users' && (
                                        <td className="py-4 px-4">{getStatusBadge(item.status)}</td>
                                    )}
                                    <td className="py-4 px-4 text-[var(--color-neutral-700)]">
                                        {type === 'users' 
                                            ? new Date(item.created_at).toLocaleDateString('pt-BR')
                                            : (item.date || new Date(item.created_at).toLocaleDateString('pt-BR'))
                                        }
                                    </td>
                                    <td className="py-4 px-4">
                                        <div className="flex justify-end gap-2">
                                            {isAdmin && item.status === 'pending' && (
                                                <>
                                                    <Button variant="ghost" className="p-2 cursor-pointer" title="Aprovar">
                                                        <CheckCircle size={18} className="text-[var(--color-success)]" />
                                                    </Button>
                                                    <Button variant="ghost" className="p-2 cursor-pointer" title="Rejeitar">
                                                        <XCircle size={18} className="text-[var(--color-danger)]" />
                                                    </Button>
                                                </>
                                            )}
                                            <Button variant="ghost" className="p-2 cursor-pointer" title="Editar">
                                                <Edit2 size={18} className="text-[var(--color-neutral-700)]" />
                                            </Button>
                                            <Button variant="ghost" className="p-2 cursor-pointer" title="Pausar">
                                                <Pause size={18} className="text-[var(--color-neutral-700)]" />
                                            </Button>
                                            <Button variant="ghost" className="p-2 cursor-pointer" title="Excluir">
                                                <Trash2 size={18} className="text-[var(--color-danger)]" />
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </Card>
    );

    if (loading) {
        return (
            <div className="max-w-[1140px] mx-auto py-8 px-6">
                <div className="text-center py-12">
                    <div className="inline-block w-8 h-8 border-4 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin mb-4"></div>
                    <p className="text-[var(--color-neutral-500)]">Carregando seus dados...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-[1140px] mx-auto py-8 px-6">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-[var(--color-neutral-900)] mb-2">
                    {isAdmin ? 'Painel Administrativo' : 'Meu Painel'}
                </h1>
                <p className="text-[var(--color-neutral-500)]">
                    {isAdmin ? 'Gerencie todos os cadastros e aprovações' : 'Gerencie seus cadastros'}
                </p>
                {!isAdmin && (
                    <p className="text-sm text-[var(--color-neutral-400)] mt-2">
                        💡 Seus cadastros precisam ser aprovados por um administrador antes de ficarem públicos
                    </p>
                )}
            </div>

            <TableSection title={isAdmin ? "Todas as Empresas" : "Minhas Empresas"} data={companies} type="companies" />
            <TableSection title={isAdmin ? "Todas as Vagas" : "Minhas Vagas"} data={jobs} type="jobs" />
            <TableSection title={isAdmin ? "Todas as Viagens" : "Minhas Viagens"} data={packages} type="packages" />
            <TableSection title={isAdmin ? "Todos os Eventos" : "Meus Eventos"} data={events} type="events" />
            <TableSection title={isAdmin ? "Toda Alimentação" : "Minha Alimentação"} data={foods} type="foods" />
            {isAdmin && <TableSection title="Usuários Cadastrados" data={users} type="users" />}
        </div>
    );
};
