import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { useAuth } from '../../contexts/AuthContext';

export const Login: React.FC = () => {
    const navigate = useNavigate();
    const { signIn, profile } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [justLoggedIn, setJustLoggedIn] = useState(false);

    // Redirecionar quando o perfil for carregado após o login
    React.useEffect(() => {
        if (justLoggedIn && profile) {
            setLoading(false);
            navigate('/painel');
        }

        // Timeout de segurança: se após 5s o perfil não carregar, desbloqueia o botão
        if (justLoggedIn && !profile) {
            const timeout = setTimeout(() => {
                setLoading(false);
                setError('Login realizado, mas houve um problema ao carregar o perfil. Recarregue a página.');
            }, 5000);
            return () => clearTimeout(timeout);
        }
    }, [profile, justLoggedIn, navigate]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await signIn(email, password);
            setJustLoggedIn(true);
        } catch (err: any) {
            setError(err.message || 'Erro ao fazer login');
            setJustLoggedIn(false);
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[var(--color-cream)] flex items-center justify-center px-6">
            <div className="w-full max-w-md">
                {/* Logo */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center gap-2 mb-4">
                        <div className="w-12 h-12 bg-[var(--color-primary)] rounded-xl flex items-center justify-center">
                            <span className="text-white font-bold text-2xl">C</span>
                        </div>
                        <span className="font-bold text-2xl text-[var(--color-neutral-900)]">
                            Central BJL
                        </span>
                    </div>
                    <h1 className="text-3xl font-bold text-[var(--color-neutral-900)] mb-2">Entrar</h1>
                    <p className="text-[var(--color-neutral-500)]">Acesse sua conta</p>
                </div>

                {/* Form */}
                <div className="bg-white rounded-2xl border border-[var(--color-neutral-200)] p-8">
                    {error && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <Input
                            type="email"
                            label="Email"
                            placeholder="seu@email.com"
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
                            {loading ? 'Entrando...' : 'Entrar'}
                        </Button>
                    </form>

                    <div className="mt-6 text-center space-y-3">
                        <button
                            type="button"
                            onClick={() => alert('Funcionalidade em desenvolvimento')}
                            className="text-sm text-[var(--color-primary)] hover:text-[var(--color-primary-dark)] transition-colors cursor-pointer bg-transparent border-none p-0"
                        >
                            Esqueci a senha
                        </button>
                        <p className="text-sm text-[var(--color-neutral-500)]">
                            Ainda não tem conta?{' '}
                            <Link
                                to="/cadastro"
                                className="text-[var(--color-primary)] hover:text-[var(--color-primary-dark)] font-medium transition-colors cursor-pointer"
                            >
                                Criar conta
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};
