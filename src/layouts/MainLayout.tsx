import React from 'react';
import { Sidebar } from '../components/Sidebar';
import { BottomBar } from '../components/BottomBar';

interface MainLayoutProps {
    children: React.ReactNode;
    user?: { name: string; role: string } | null;
    onLogout?: () => void;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children, user, onLogout }) => {
    return (
        <div className="flex min-h-screen bg-[var(--color-cream)]">
            <Sidebar user={user} onLogout={onLogout} />
            <main className="flex-1 overflow-auto pb-20 md:pb-0">
                {children}
            </main>
            <BottomBar user={user} onLogout={onLogout} />
        </div>
    );
};
