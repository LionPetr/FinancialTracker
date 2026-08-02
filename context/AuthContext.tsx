import { supabase } from '@/lib/supabase';
import type { AuthError, Session } from '@supabase/supabase-js';
import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
    type ReactNode,
} from 'react';

type AuthContextValue = {
    session: Session | null;
    user: Session['user'] | null;
    loading: boolean;
    householdId: string | null;
    hasHousehold: boolean;
    householdLoading: boolean;
    refreshHousehold: () => Promise<void>;
    signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>;
    signUp: (email: string, password: string) => Promise<{ error: AuthError | null }>;
    signOut: () => Promise<{ error: AuthError | null }>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [session, setSession] = useState<Session | null>(null);
    const [loading, setLoading] = useState(true);

    const [householdId, setHouseholdId] = useState<string | null>(null);
    const [householdLoading, setHouseholdLoading] = useState(true);

    const refreshHousehold = useCallback(async () => {
        setHouseholdLoading(true);
        if (!session?.user) {
            setHouseholdId(null);
            setHouseholdLoading(false);
            return;
        }

        const { data: householdMemberData, error: householdMemberError } = await supabase.from('household_members').select('household_id').eq('user_id', session.user.id).maybeSingle();
        if (householdMemberError) {
            console.error('Error fetching household member:', householdMemberError.message);
            setHouseholdLoading(false);
            return;
        }
        if (!householdMemberData?.household_id) {
            console.log('No household found for user:', session.user.id);
            setHouseholdId(null);
            setHouseholdLoading(false);
            return;
        }
        setHouseholdId(householdMemberData.household_id);
        setHouseholdLoading(false);
    }, [session?.user?.id]);

    useEffect(() => {
        refreshHousehold();
    }, [refreshHousehold]);
    useEffect(() => {
        supabase.auth.getSession().then(({ data }) => {
            setSession(data.session);
            setLoading(false);
        });

        const { data: sub } = supabase.auth.onAuthStateChange((_event, newSession) => {
            setSession(newSession);
        });

        return () => sub.subscription.unsubscribe();
    }, []);

    const value = useMemo<AuthContextValue>(() => ({
        session,
        user: session?.user ?? null,
        loading,
        householdId,
        hasHousehold: !!householdId,
        householdLoading,
        refreshHousehold,
        signIn: (email: string, password: string) => supabase.auth.signInWithPassword({ email, password }),
        signUp: (email: string, password: string) => supabase.auth.signUp({ email, password }),
        signOut: () => supabase.auth.signOut(),
    }), [session, loading, householdId, householdLoading, refreshHousehold]);

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used within AuthProvider');
    return ctx;
}
