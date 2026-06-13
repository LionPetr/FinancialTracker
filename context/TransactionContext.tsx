import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

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

const TransactionContext = createContext<TransactionContextValue | null>(null);

export function TransactionContextProvider({ children }: { children: ReactNode }) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const value = useMemo<TransactionContextValue>(() => {
    const getTransactionsForScope = (scope: 'joint' | 'personal') =>
      transactions.filter((transaction) => transaction.scope === scope);

    const getTotalCentsForScope = (scope: 'joint' | 'personal') =>
      getTransactionsForScope(scope).reduce(
        (total, transaction) => total + transaction.amountCents,
        0
      );

    const addTransaction = (input: AddTransactionInput) => {
      const transaction: Transaction = {
        ...input,
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        occurredAt: new Date().toISOString(),
      };

      setTransactions((current) => [...current, transaction]);
    };

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
