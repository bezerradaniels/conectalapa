import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Eye } from 'lucide-react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';

export const AdminDashboard: React.FC = () => {
    const { profile } = useAuth();
    const navigate = useNavigate();
    const [pendingCompanies, setPendingCompanies] = useState<any[]>([]);
    const [pendingJobs, setPendingJobs] = useState<any[]>([]);
    const [pendingPackages, setPendingPackages] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [previewItem, setPreviewItem] = useState<{ type: string; data: any } | null>(null);

    useEffect(() => {
        if (!profile || profile.role !== 'admin') {
            navigate('/admin/login');
            return;
        }
        loadPendingItems();
    }, [profile, navigate]);

    const loadPendingItems = async () => {
        setLoading(true);
        try {
            // Empresas pendentes
            const { data: companies } = await supabase
                .from('companies')
                .select('*, profiles(name)')
                .eq('status', 'pending')
                .order('created_at', { ascending: false });

            // Vagas pendentes
            const { data: jobs } = await supabase
                .from('jobs')
                .select('*, profiles(name)')
                .eq('status', 'pending')
                .order('created_at', { ascending: false });

            // Pacotes pendentes
            const { data: packages } = await supabase
                .from('travel_packages')
                .select('*, profiles(name)')
                .eq('status', 'pending')
                .order('created_at', { ascending: false });

            setPendingCompanies(companies || []);
            setPendingJobs(jobs || []);
            setPendingPackages(packages || []);
        } catch (error) {
            console.error('Erro ao carregar itens pendentes:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (table: string, id: string) => {
        try {
            const { error } = await supabase
                .from(table)
                .update({ status: 'active' })
                .eq('id', id);

            if (error) throw error;
            loadPendingItems();
        } catch (error) {
            console.error('Erro ao aprovar:', error);
        }
    };

    const handleReject = async (table: string, id: string) => {
        try {
            const { error } = await supabase
                .from(table)
                .update({ status: 'inactive' })
                .eq('id', id);

            if (error) throw error;
            loadPendingItems();
        } catch (error) {
            console.error('Erro ao rejeitar:', error);
        }
    };

    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString('pt-BR');
    };

    const openPreview = (type: string, data: any) => {
        setPreviewItem({ type, data });
    };

    const closePreview = () => {
        setPreviewItem(null);
    };

    const PreviewModal = () => {
        if (!previewItem) return null;

        const { type, data } = previewItem;

        return (
            <>
                {/* Backdrop */}
                <div 
                    className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm"
                    onClick={closePreview}
                />
                
                {/* Modal */}
                <div className="fixed inset-4 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-3xl md:max-h-[90vh] bg-white rounded-2xl shadow-2xl z-50 overflow-hidden flex flex-col">
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b border-[var(--color-neutral-200)]">
                        <div>
                            <h2 className="text-2xl font-bold text-[var(--color-neutral-900)]">
                                Pré-visualização
                            </h2>
                            <p className="text-sm text-[var(--color-neutral-500)] mt-1">
                                {type === 'company' && 'Empresa'}
                                {type === 'job' && 'Vaga de Emprego'}
                                {type === 'package' && 'Pacote de Viagem'}
                            </p>
                        </div>
                        <button
                            onClick={closePreview}
                            className="p-2 rounded-lg hover:bg-[var(--color-neutral-100)] transition-colors"
                        >
                            <XCircle size={24} className="text-[var(--color-neutral-700)]" />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-y-auto p-6">
                        {type === 'company' && (
                            <div className="space-y-4">
                                <div>
                                    <label className="text-sm font-semibold text-[var(--color-neutral-700)]">Nome da Empresa</label>
                                    <p className="text-lg text-[var(--color-neutral-900)] mt-1">{data.name}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-semibold text-[var(--color-neutral-700)]">Descrição</label>
                                    <p className="text-[var(--color-neutral-900)] mt-1">{data.description || 'Não informado'}</p>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm font-semibold text-[var(--color-neutral-700)]">WhatsApp</label>
                                        <p className="text-[var(--color-neutral-900)] mt-1">{data.whatsapp || 'Não informado'}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-semibold text-[var(--color-neutral-700)]">Email</label>
                                        <p className="text-[var(--color-neutral-900)] mt-1">{data.email || 'Não informado'}</p>
                                    </div>
                                </div>
                                <div>
                                    <label className="text-sm font-semibold text-[var(--color-neutral-700)]">Endereço</label>
                                    <p className="text-[var(--color-neutral-900)] mt-1">{data.address || 'Não informado'}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-semibold text-[var(--color-neutral-700)]">Data de Cadastro</label>
                                    <p className="text-[var(--color-neutral-900)] mt-1">{formatDate(data.created_at)}</p>
                                </div>
                            </div>
                        )}

                        {type === 'job' && (
                            <div className="space-y-4">
                                <div>
                                    <label className="text-sm font-semibold text-[var(--color-neutral-700)]">Título da Vaga</label>
                                    <p className="text-lg text-[var(--color-neutral-900)] mt-1">{data.title}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-semibold text-[var(--color-neutral-700)]">Empresa</label>
                                    <p className="text-[var(--color-neutral-900)] mt-1">{data.company_name}</p>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm font-semibold text-[var(--color-neutral-700)]">Salário</label>
                                        <p className="text-[var(--color-neutral-900)] mt-1">{data.salary || 'A combinar'}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-semibold text-[var(--color-neutral-700)]">Prazo</label>
                                        <p className="text-[var(--color-neutral-900)] mt-1">
                                            {data.deadline ? formatDate(data.deadline) : 'Não informado'}
                                        </p>
                                    </div>
                                </div>
                                <div>
                                    <label className="text-sm font-semibold text-[var(--color-neutral-700)]">Descrição</label>
                                    <p className="text-[var(--color-neutral-900)] mt-1 whitespace-pre-wrap">{data.description || 'Não informado'}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-semibold text-[var(--color-neutral-700)]">Data de Cadastro</label>
                                    <p className="text-[var(--color-neutral-900)] mt-1">{formatDate(data.created_at)}</p>
                                </div>
                            </div>
                        )}

                        {type === 'package' && (
                            <div className="space-y-4">
                                <div>
                                    <label className="text-sm font-semibold text-[var(--color-neutral-700)]">Destino</label>
                                    <p className="text-lg text-[var(--color-neutral-900)] mt-1">{data.destination}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-semibold text-[var(--color-neutral-700)]">Local de Saída</label>
                                    <p className="text-[var(--color-neutral-900)] mt-1">{data.departure_location}</p>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm font-semibold text-[var(--color-neutral-700)]">Data de Saída</label>
                                        <p className="text-[var(--color-neutral-900)] mt-1">{formatDate(data.departure_date)}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-semibold text-[var(--color-neutral-700)]">Data de Retorno</label>
                                        <p className="text-[var(--color-neutral-900)] mt-1">{formatDate(data.return_date)}</p>
                                    </div>
                                </div>
                                <div>
                                    <label className="text-sm font-semibold text-[var(--color-neutral-700)]">WhatsApp</label>
                                    <p className="text-[var(--color-neutral-900)] mt-1">{data.whatsapp || 'Não informado'}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-semibold text-[var(--color-neutral-700)]">Descrição</label>
                                    <p className="text-[var(--color-neutral-900)] mt-1 whitespace-pre-wrap">{data.description || 'Não informado'}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-semibold text-[var(--color-neutral-700)]">Data de Cadastro</label>
                                    <p className="text-[var(--color-neutral-900)] mt-1">{formatDate(data.created_at)}</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Footer with Actions */}
                    <div className="border-t border-[var(--color-neutral-200)] p-6 bg-[var(--color-neutral-50)]">
                        <div className="flex justify-end gap-3">
                            <Button 
                                variant="secondary"
                                onClick={closePreview}
                                className="cursor-pointer"
                            >
                                Fechar
                            </Button>
                            <Button 
                                variant="ghost"
                                onClick={() => {
                                    const tableName = type === 'company' ? 'companies' : type === 'job' ? 'jobs' : 'travel_packages';
                                    handleReject(tableName, data.id);
                                    closePreview();
                                }}
                                className="cursor-pointer text-red-600 hover:bg-red-50"
                            >
                                <XCircle size={18} className="mr-2" />
                                Rejeitar
                            </Button>
                            <Button 
                                onClick={() => {
                                    const tableName = type === 'company' ? 'companies' : type === 'job' ? 'jobs' : 'travel_packages';
                                    handleApprove(tableName, data.id);
                                    closePreview();
                                }}
                                className="cursor-pointer"
                            >
                                <CheckCircle size={18} className="mr-2" />
                                Aprovar
                            </Button>
                        </div>
                    </div>
                </div>
            </>
        );
    };

    const TableSection = ({ 
        title, 
        data, 
        tableName,
        nameField 
    }: { 
        title: string; 
        data: any[]; 
        tableName: string;
        nameField: string;
    }) => (
        <Card className="mb-8">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-[var(--color-neutral-900)]">{title}</h2>
                <span className="px-3 py-1 bg-[var(--color-accent-yellow)] text-[var(--color-neutral-900)] rounded-full text-sm font-semibold">
                    {data.length} pendente{data.length !== 1 ? 's' : ''}
                </span>
            </div>
            
            {data.length === 0 ? (
                <div className="text-center py-8 text-[var(--color-neutral-500)]">
                    ✓ Nenhuma solicitação pendente
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-[var(--color-neutral-200)]">
                                <th className="text-left py-3 px-4 text-sm font-semibold text-[var(--color-neutral-700)]">
                                    Nome
                                </th>
                                <th className="text-left py-3 px-4 text-sm font-semibold text-[var(--color-neutral-700)]">
                                    Cadastrado por
                                </th>
                                <th className="text-left py-3 px-4 text-sm font-semibold text-[var(--color-neutral-700)]">
                                    Data
                                </th>
                                <th className="text-right py-3 px-4 text-sm font-semibold text-[var(--color-neutral-700)]">
                                    Ações
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((item) => (
                                <tr key={item.id} className="border-b border-[var(--color-neutral-200)] last:border-0 hover:bg-[var(--color-neutral-50)]">
                                    <td className="py-4 px-4 text-[var(--color-neutral-900)] font-medium">
                                        {item[nameField]}
                                    </td>
                                    <td className="py-4 px-4 text-[var(--color-neutral-700)]">
                                        {item.profiles?.name || 'Usuário'}
                                    </td>
                                    <td className="py-4 px-4 text-[var(--color-neutral-700)]">
                                        {formatDate(item.created_at)}
                                    </td>
                                    <td className="py-4 px-4">
                                        <div className="flex justify-end gap-2">
                                            <Button 
                                                variant="ghost" 
                                                className="p-2 cursor-pointer hover:bg-green-50" 
                                                title="Aprovar"
                                                onClick={() => handleApprove(tableName, item.id)}
                                            >
                                                <CheckCircle size={18} className="text-green-600" />
                                            </Button>
                                            <Button 
                                                variant="ghost" 
                                                className="p-2 cursor-pointer hover:bg-red-50" 
                                                title="Rejeitar"
                                                onClick={() => handleReject(tableName, item.id)}
                                            >
                                                <XCircle size={18} className="text-red-600" />
                                            </Button>
                                            <Button 
                                                variant="ghost" 
                                                className="p-2 cursor-pointer hover:bg-blue-50" 
                                                title="Visualizar"
                                                onClick={() => {
                                                    const type = tableName === 'companies' ? 'company' : 
                                                                tableName === 'jobs' ? 'job' : 'package';
                                                    openPreview(type, item);
                                                }}
                                            >
                                                <Eye size={18} className="text-blue-600" />
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
                    <p className="text-[var(--color-neutral-500)]">Carregando solicitações...</p>
                </div>
            </div>
        );
    }

    const totalPending = pendingCompanies.length + pendingJobs.length + pendingPackages.length;

    return (
        <div className="max-w-[1140px] mx-auto py-8 px-6">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-[var(--color-neutral-900)] mb-2">
                    Painel de Aprovações
                </h1>
                <p className="text-[var(--color-neutral-500)]">
                    Gerencie e aprove os cadastros pendentes da plataforma
                </p>
                {totalPending > 0 && (
                    <div className="mt-4 inline-flex items-center gap-2 bg-[var(--color-accent-yellow)] px-4 py-2 rounded-full">
                        <span className="font-bold text-[var(--color-neutral-900)]">{totalPending}</span>
                        <span className="text-sm text-[var(--color-neutral-700)]">
                            solicitaç{totalPending === 1 ? 'ão' : 'ões'} aguardando aprovação
                        </span>
                    </div>
                )}
            </div>

            <TableSection 
                title="Empresas Pendentes" 
                data={pendingCompanies} 
                tableName="companies"
                nameField="name"
            />
            
            <TableSection 
                title="Vagas Pendentes" 
                data={pendingJobs} 
                tableName="jobs"
                nameField="title"
            />
            
            <TableSection 
                title="Pacotes de Viagem Pendentes" 
                data={pendingPackages} 
                tableName="travel_packages"
                nameField="destination"
            />

            {/* Preview Modal */}
            <PreviewModal />
        </div>
    );
};
