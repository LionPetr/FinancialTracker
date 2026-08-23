import { Text, View } from '@/components/Themed';
import { FlatList, StyleSheet } from "react-native";

import { useColorScheme } from '@/components/useColorScheme';
import Colors from '@/constants/Colors';
import { useAuth } from '@/context/AuthContext';
import { useTransactions } from "@/context/TransactionContext";
import { formatMoney } from '@/lib/money';


export default function ExpenseTabScreen({ scope }: { scope: 'joint' | 'personal' }) {

    const { getTransactionsForScope } = useTransactions();
    const transactions = getTransactionsForScope(scope);
    const colorScheme = useColorScheme() ?? 'light';
    const theme = Colors[colorScheme];

    const { session } = useAuth();

    return (
        <View style={styles.list}>
            {transactions.length === 0 ? (
                <Text style={[styles.transactions, { color: theme.textMuted }]}>No transactions yet</Text>
            ) : (
                <FlatList
                    data={[...transactions].reverse()}
                    keyExtractor={(item) => item.id}
                    style={styles.list}
                    contentContainerStyle={styles.listContent}
                    renderItem={({ item: transaction }) => (
                        <View style={[styles.row, { borderBottomColor: theme.separator }]}>
                            <Text style={styles.mainLine} numberOfLines={1}>
                                {formatMoney(transaction.amountCents)} - {transaction.note || 'No note'}
                            </Text>
                            {transaction.paidBy && (
                                <Text style={[styles.paidByText, { color: theme.textMuted }]}>
                                    {scope === 'joint' && transaction.paidBy && (transaction.paidBy === session?.user?.id ? 'You Paid' : 'Someone else Paid')}
                                </Text>
                            )}
                        </View>
                    )}
                />
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    list: {
        width: '100%',
        flex: 1,
    },
    listContainer: {
        flex: 1,
        alignSelf: 'stretch',
        width: '100%',
    },
    paidByText: {
        fontSize: 13,
        marginTop: 4,
        textAlign: 'right',
    },
    mainLine: {
        fontSize: 16,
        fontWeight: '500',
        textAlign: 'left',
    },
    listContent: {
        paddingBottom: 96,
    },
    transactions: {
        fontSize: 16,
    },
    row: {
        padding: 16,
        borderBottomWidth: 1,
        marginBottom: 16,
        gap: 8,
    },
})