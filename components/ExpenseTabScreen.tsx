import { FlatList, StyleSheet, Text, View } from "react-native";

import { useTransactions } from "@/context/TransactionContext";


export default function ExpenseTabScreen({ scope }: { scope: 'joint' | 'personal' }) {

    const { getTransactionsForScope } = useTransactions();
    const transactions = getTransactionsForScope(scope);
    const formatMoney = (cents: number) => `$${(cents / 100).toFixed(2)}`;

    return (
        <View style={styles.list}>
            {transactions.length === 0 ? (
                <Text style={styles.transactions}>No transactions yet</Text>
            ) : (
                <FlatList
                    data={[...transactions].reverse()}
                    keyExtractor={(item) => item.id}
                    style={styles.list}
                    contentContainerStyle={styles.listContent}
                    renderItem={({ item: transaction }) => (
                        <View style={styles.row}>
                            <Text style={styles.mainLine} numberOfLines={1}>
                                {formatMoney(transaction.amountCents)} - {transaction.note || 'No note'}
                            </Text>
                            {transaction.paidBy && (
                                <Text style={styles.paidByText}>
                                    {scope === 'joint' && transaction.paidBy && (transaction.paidBy === 'you' ? 'You paid' : 'Partner paid')}
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
        color: '#888',
        marginTop: 4,
        textAlign: 'right',
    },
    mainLine: {
        fontSize: 16,
        fontWeight: '500',
        textAlign: 'left',
        color: '#fff',
    },
    listContent: {
        paddingBottom: 96,
    },
    transactions: {
        fontSize: 16,
        color: '#666',
    },
    row: {
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        marginBottom: 16,
        gap: 8,
    },
})