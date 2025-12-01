import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Building2, Briefcase, Palmtree, Megaphone, LayoutDashboard, LogOut, Calendar, UtensilsCrossed, Home } from 'lucide-react';
import { Button } from './Button';

interface SidebarProps {
    user?: { name: string; role: string } | null;
    onLogout?: () => void;
    isMobileMenu?: boolean;
    onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ user, onLogout, isMobileMenu, onClose }) => {
    const location = useLocation();

    const menuItems = [
        { icon: Home, label: 'Início', path: '/' },
        { icon: Building2, label: 'Empresas', path: '/empresas' },
        { icon: Briefcase, label: 'Vagas', path: '/vagas' },
        { icon: Palmtree, label: 'Viagens', path: '/pacotes' },
        { icon: Calendar, label: 'Eventos', path: '/eventos' },
        { icon: UtensilsCrossed, label: 'Alimentação', path: '/alimentacao' },
        { icon: Megaphone, label: 'Anuncie', path: '/anuncie' },
    ];

    const isActive = (path: string) => location.pathname === path;

    const handleLinkClick = () => {
        if (isMobileMenu && onClose) {
            onClose();
        }
    };

    return (
        <aside className={`bg-white flex flex-col ${isMobileMenu ? '' : 'w-64 border-r border-[var(--color-neutral-200)] h-screen sticky top-0 hidden md:flex'}`}>
            {/* Logo */}
            {!isMobileMenu && (
                <div className="p-6 border-b border-[var(--color-neutral-200)]">
                    <Link to="/" className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-[var(--color-primary)] rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold text-lg">C</span>
                    </div>
                    <span className="font-semibold text-lg text-[var(--color-neutral-900)]">
                        Central BJL
                    </span>
                </Link>
            </div>
            )}

            {/* User Section */}
            <div className="p-6 border-b border-[var(--color-neutral-200)]">
                {user ? (
                    <div className="space-y-3">
                        <p className="text-sm text-[var(--color-neutral-500)]">
                            Olá, <span className="font-semibold text-[var(--color-neutral-900)]">{user.name}</span>
                        </p>
                        <div className="flex flex-col gap-2">
                            <Link to="/painel" onClick={handleLinkClick}>
                                <Button variant="secondary" className="w-full justify-center flex items-center gap-2 cursor-pointer">
                                    <LayoutDashboard size={16} />
                                    Painel
                                </Button>
                            </Link>
                            <Button
                                variant="ghost"
                                className="w-full justify-center flex items-center gap-2 cursor-pointer"
                                onClick={() => {
                                    onLogout?.();
                                    handleLinkClick();
                                }}
                            >
                                <LogOut size={16} />
                                Sair
                            </Button>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col gap-2">
                        <Link to="/login" onClick={handleLinkClick}>
                            <Button variant="primary" className="w-full cursor-pointer">Entrar</Button>
                        </Link>
                        <Link to="/cadastro" onClick={handleLinkClick}>
                            <Button variant="secondary" className="w-full cursor-pointer">Cadastrar</Button>
                        </Link>
                    </div>
                )}
            </div>

            {/* Menu */}
            <nav className="flex-1 p-4">
                <ul className="space-y-1">
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        const active = isActive(item.path);

                        return (
                            <li key={item.path}>
                                <Link
                                    to={item.path}
                                    onClick={handleLinkClick}
                                    className={`
                    flex items-center gap-3 px-4 py-3 rounded-lg
                    transition-all duration-200
                    ${active
                                            ? 'bg-[var(--color-primary-light)] text-[var(--color-primary-dark)] font-medium'
                                            : 'text-[var(--color-neutral-700)] hover:bg-[var(--color-neutral-100)]'
                                        }
                  `}
                                >
                                    <Icon size={20} />
                                    <span>{item.label}</span>
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </nav>
        </aside>
    );
};
