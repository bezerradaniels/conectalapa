import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Star, Search, Building2, Menu, X } from 'lucide-react';
import { Sidebar } from './Sidebar';
import { Input } from './Input';

interface BottomBarProps {
    user?: { name: string; role: string } | null;
    onLogout?: () => void;
}

export const BottomBar: React.FC<BottomBarProps> = ({ user, onLogout }) => {
    const location = useLocation();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const isActive = (path: string) => location.pathname === path;

    return (
        <>
            {/* Mobile Bottom Bar */}
            <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-[var(--color-neutral-200)] z-40 safe-area-inset-bottom">
                <div className="flex items-center justify-around px-2 py-3">
                    {/* Destaques */}
                    <Link
                        to="/"
                        className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-colors ${
                            isActive('/') 
                                ? 'text-[var(--color-primary)] bg-[var(--color-primary-light)]' 
                                : 'text-[var(--color-neutral-500)] hover:text-[var(--color-primary)]'
                        }`}
                    >
                        <Star size={22} strokeWidth={2} />
                        <span className="text-[10px] font-medium">Destaques</span>
                    </Link>

                    {/* Pesquisa */}
                    <button
                        onClick={() => setIsSearchOpen(!isSearchOpen)}
                        className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-colors ${
                            isSearchOpen 
                                ? 'text-[var(--color-primary)] bg-[var(--color-primary-light)]' 
                                : 'text-[var(--color-neutral-500)] hover:text-[var(--color-primary)]'
                        }`}
                    >
                        <Search size={22} strokeWidth={2} />
                        <span className="text-[10px] font-medium">Pesquisa</span>
                    </button>

                    {/* Empresas */}
                    <Link
                        to="/empresas"
                        className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-colors ${
                            isActive('/empresas') 
                                ? 'text-[var(--color-primary)] bg-[var(--color-primary-light)]' 
                                : 'text-[var(--color-neutral-500)] hover:text-[var(--color-primary)]'
                        }`}
                    >
                        <Building2 size={22} strokeWidth={2} />
                        <span className="text-[10px] font-medium">Empresas</span>
                    </Link>

                    {/* Menu */}
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-colors ${
                            isMenuOpen 
                                ? 'text-[var(--color-primary)] bg-[var(--color-primary-light)]' 
                                : 'text-[var(--color-neutral-500)] hover:text-[var(--color-primary)]'
                        }`}
                    >
                        <Menu size={22} strokeWidth={2} />
                        <span className="text-[10px] font-medium">Menu</span>
                    </button>
                </div>
            </nav>

            {/* Search Overlay */}
            {isSearchOpen && (
                <>
                    {/* Backdrop */}
                    <div 
                        className="md:hidden fixed inset-0 bg-black/50 z-50 backdrop-blur-sm"
                        onClick={() => setIsSearchOpen(false)}
                    />
                    
                    {/* Search Panel */}
                    <div className="md:hidden fixed top-0 left-0 right-0 bg-white z-50 shadow-xl animate-slide-in-top">
                        <div className="p-4 border-b border-[var(--color-neutral-200)]">
                            <div className="flex items-center gap-3 mb-4">
                                <h2 className="text-lg font-bold text-[var(--color-neutral-900)] flex-1">Buscar</h2>
                                <button
                                    onClick={() => setIsSearchOpen(false)}
                                    className="p-2 rounded-lg hover:bg-[var(--color-neutral-100)] transition-colors"
                                >
                                    <X size={24} className="text-[var(--color-neutral-700)]" />
                                </button>
                            </div>
                            <div className="relative">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-neutral-500)]" size={20} />
                                <Input
                                    type="text"
                                    placeholder="Buscar empresas, vagas, eventos..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-12"
                                    autoFocus
                                />
                            </div>
                        </div>
                        {searchQuery && (
                            <div className="p-4 max-h-[60vh] overflow-y-auto">
                                <p className="text-sm text-[var(--color-neutral-500)] text-center py-8">
                                    Busque por empresas, vagas, eventos ou estabelecimentos
                                </p>
                            </div>
                        )}
                    </div>
                </>
            )}

            {/* Overlay Menu */}
            {isMenuOpen && (
                <>
                    {/* Backdrop */}
                    <div 
                        className="md:hidden fixed inset-0 bg-black/50 z-50 backdrop-blur-sm"
                        onClick={() => setIsMenuOpen(false)}
                    />
                    
                    {/* Menu Sidebar */}
                    <div className="md:hidden fixed top-0 right-0 bottom-0 w-80 max-w-[85vw] bg-white z-50 shadow-2xl overflow-y-auto animate-slide-in-right">
                        <div className="flex items-center justify-between p-4 border-b border-[var(--color-neutral-200)]">
                            <h2 className="text-lg font-bold text-[var(--color-neutral-900)]">Menu</h2>
                            <button
                                onClick={() => setIsMenuOpen(false)}
                                className="p-2 rounded-lg hover:bg-[var(--color-neutral-100)] transition-colors"
                            >
                                <X size={24} className="text-[var(--color-neutral-700)]" />
                            </button>
                        </div>
                        <div className="p-4">
                            <Sidebar user={user} onLogout={onLogout} isMobileMenu onClose={() => setIsMenuOpen(false)} />
                        </div>
                    </div>
                </>
            )}
        </>
    );
};
