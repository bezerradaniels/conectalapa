import React, { createContext, useContext, useEffect, useState } from 'react';
import type { User, Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

interface Profile {
    id: string;
    name: string;
    role: 'user' | 'admin';
}

interface AuthContextType {
    user: User | null;
    profile: Profile | null;
    session: Session | null;
    loading: boolean;
    signUp: (email: string, password: string, name: string) => Promise<void>;
    signIn: (email: string, password: string) => Promise<void>;
    signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [profile, setProfile] = useState<Profile | null>(null);
    const [session, setSession] = useState<Session | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Get initial session
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            setUser(session?.user ?? null);
            if (session?.user) {
                loadProfile(session.user.id);
            } else {
                setLoading(false);
            }
        });

        // Listen for auth changes
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            setUser(session?.user ?? null);
            if (session?.user) {
                loadProfile(session.user.id);
            } else {
                setProfile(null);
                setLoading(false);
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    const loadProfile = async (userId: string) => {
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', userId)
                .single();

            if (error) {
                console.error('Error loading profile:', error);
                // Se o perfil não existir, criar um perfil básico
                if (error.code === 'PGRST116') {
                    console.log('Profile not found, creating...');
                    const { data: newProfile, error: insertError } = await supabase
                        .from('profiles')
                        .insert({ id: userId, name: 'Usuário', role: 'user' })
                        .select()
                        .single();
                    
                    if (insertError) {
                        console.error('Error creating profile:', insertError);
                    } else {
                        setProfile(newProfile);
                    }
                } else {
                    throw error;
                }
            } else {
                setProfile(data);
            }
        } catch (error) {
            console.error('Error in loadProfile:', error);
        } finally {
            setLoading(false);
        }
    };

    const signUp = async (email: string, password: string, name: string) => {
        try {
            console.log('Attempting signup for:', email);
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        name,
                    },
                },
            });

            if (error) {
                console.error('Signup error:', error);
                throw error;
            }

            console.log('Signup response:', data);

            if (data.user) {
                console.log('User created:', data.user.id);
                // Profile will be created automatically by trigger
                await loadProfile(data.user.id);
            }
            
            // Se o email precisa ser confirmado, avisar o usuário
            if (data.user && !data.session) {
                console.warn('Email confirmation required');
                throw new Error('Por favor, confirme seu email antes de fazer login. Verifique sua caixa de entrada.');
            }
        } catch (error: any) {
            console.error('Sign up error:', error);
            throw new Error(error.message || 'Erro ao criar conta');
        }
    };

    const signIn = async (email: string, password: string) => {
        try {
            console.log('Attempting login for:', email);
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) {
                console.error('Login error:', error);
                throw error;
            }

            console.log('Login successful:', data.user?.id);

            if (data.user) {
                await loadProfile(data.user.id);
                console.log('Profile loaded successfully');
            }
        } catch (error: any) {
            console.error('Sign in error:', error);
            throw new Error(error.message || 'Erro ao fazer login');
        }
    };

    const signOut = async () => {
        try {
            const { error } = await supabase.auth.signOut();
            if (error) throw error;
            setProfile(null);
        } catch (error: any) {
            throw new Error(error.message || 'Erro ao sair');
        }
    };

    const value = {
        user,
        profile,
        session,
        loading,
        signUp,
        signIn,
        signOut,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
