import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { useAuth } from '../contexts/AuthContext';

export const AdminLogin: React.FC = () => {
    const navigate = useNavigate();
    const { signIn, profile } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // Redirecionar se já estiver logado como admin
    React.useEffect(() => {
        if (profile && loading) {
            if (profile.role === 'admin') {
                setLoading(false);
                navigate('/admin/painel');
            } else {
                setError('Acesso negado. Esta área é restrita a administradores.');
                setLoading(false);
            }
        }
    }, [profile, loading, navigate]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await signIn(email, password);
            // O useEffect acima vai redirecionar quando o profile carregar
        } catch (err: any) {
            setError(err.message || 'Erro ao fazer login. Verifique suas credenciais.');
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#00A82D] to-[#0A7A27] flex items-center justify-center px-6">
            <div className="w-full max-w-md">
                {/* Logo */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center gap-2 mb-4">
                        <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-lg">
                            <span className="text-[#00A82D] font-bold text-2xl">C</span>
                        </div>
                        <span className="font-bold text-2xl text-white">
                            Central BJL
                        </span>
                    </div>
                    <h1 className="text-3xl font-bold text-white mb-2">Área Administrativa</h1>
                    <p className="text-white/80">Acesso restrito a administradores</p>
                </div>

                {/* Form */}
                <div className="bg-white rounded-2xl border border-white/20 shadow-2xl p-8">
                    {error && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <Input
                            type="email"
                            label="Email Administrativo"
                            placeholder="admin@conectalapa.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />

                        <Input
                            type="password"
                            label="Senha"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />

                        <Button type="submit" variant="primary" className="w-full cursor-pointer" disabled={loading}>
                            {loading ? 'Entrando...' : 'Acessar Painel'}
                        </Button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-sm text-[var(--color-neutral-500)]">
                            🔒 Área protegida - Apenas administradores autorizados
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};
