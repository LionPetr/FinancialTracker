import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';

type Transaction = {
  id: string;
  scope: 'joint' | 'personal';
  amountCents: number;
  note: string;
  paidBy: 'you' | 'partner' | null;
  occurredAt: string;
};

type AddTransactionInput = Omit<Transaction, 'id' | 'occurredAt'>;

type TransactionContextValue = {
  transactions: Transaction[];
  addTransaction: (input: AddTransactionInput) => void;
  getTransactionsForScope: (scope: 'joint' | 'personal') => Transaction[];
  getTotalCentsForScope: (scope: 'joint' | 'personal') => number;
};

function isThisMonth(isDate: string): boolean {
  const date = new Date(isDate);
  const now = new Date();

  return (
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth()
  );
}

type TransactionRow = {
  id: string;
  scope: 'joint' | 'personal';
  amount_cents: number;
  note: string;
  paid_by_user_id: string | null;
  occurred_at: string;
};

function mapRow(row: TransactionRow): Transaction {
  return {
    id: row.id,
    scope: row.scope,
    amountCents: row.amount_cents,
    note: row.note,
    paidBy: null,
    occurredAt: row.occurred_at,
  };
}

const TransactionContext = createContext<TransactionContextValue | null>(null);

export function TransactionContextProvider({ children }: { children: ReactNode }) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);


  const { session } = useAuth();

  useEffect(() => {
    if (!session) {
      setTransactions([]);
      return;
    }

    let active = true;

    supabase
      .from('transactions')
      .select('id, scope, amount_cents, note, paid_by_user_id, occurred_at')
      .order('occurred_at', { ascending: false })
      .then(({ data, error }) => {
        if (!active) return;
        if (error) {
          console.error('Error fetching transactions:', error.message);
          return;
        }

        setTransactions((data as TransactionRow[]).map(mapRow));
      });

    return () => {
      active = false;
    };
  }, [session?.user?.id]);


  const value = useMemo<TransactionContextValue>(() => {
    const getTransactionsForScope = (scope: 'joint' | 'personal') =>
      transactions.filter((transaction) => transaction.scope === scope && isThisMonth(transaction.occurredAt));

    const getTotalCentsForScope = (scope: 'joint' | 'personal') =>
      getTransactionsForScope(scope).reduce(
        (total, transaction) => total + transaction.amountCents,
        0
      );

    const addTransaction = (input: AddTransactionInput) => {
      supabase.from('transactions').insert({
        user_id: session?.user?.id,
        scope: input.scope,
        amount_cents: input.amountCents,
        note: input.note,
      }).select().then(({ data, error }) => {
        if (error) {
          console.error('Error storing transaction:', error.message);
          return;
        }

        setTransactions((current) => [...current, mapRow(data[0] as TransactionRow)]);
      });
    }

    return {
      transactions,
      addTransaction,
      getTransactionsForScope,
      getTotalCentsForScope,
    };
  }, [transactions]);

  return (
    <TransactionContext.Provider value={value}>{children}</TransactionContext.Provider>
  );
}

export function useTransactions() {
  const context = useContext(TransactionContext);
  if (!context) {
    throw new Error('useTransactions must be used within TransactionContextProvider');
  }
  return context;
}
