import { Text, View } from '@/components/Themed';
import { FlatList, View as RNView, StyleSheet } from "react-native";

import { useColorScheme } from '@/components/useColorScheme';
import { getCategory, getContrastText } from '@/constants/Categories';
import Colors from '@/constants/Colors';
import { useAuth } from '@/context/AuthContext';
import { useTransactions } from "@/context/TransactionContext";
import { formatMoney } from '@/lib/money';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';


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
                    renderItem={({ item: transaction }) => {
                        const category = getCategory(transaction.category);
                        return (
                            <View style={[styles.row, { borderBottomColor: theme.separator }]}>
                                <View style={styles.rowContent}>
                                    <Text style={styles.mainLine} numberOfLines={1}>
                                        {formatMoney(transaction.amountCents)} - {transaction.note || 'No note'}
                                    </Text>
                                    {transaction.paidBy && (
                                        <Text style={[styles.paidByText, { color: theme.textMuted }]}>
                                            {scope === 'joint' && transaction.paidBy && (transaction.paidBy === session?.user?.id ? 'You Paid' : 'Someone else Paid')}
                                        </Text>
                                    )}
                                </View>
                                <RNView style={[styles.banner, { backgroundColor: category.color }]}>
                                    <MaterialCommunityIcons name={category.icon} size={16} color={getContrastText(category.color)} />
                                    <RNView style={[styles.bannerNotch, { borderBottomColor: theme.background }]} />
                                </RNView>
                            </View>
                        );
                    }}
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
        borderBottomWidth: 1,
        //marginBottom: 16,
    },
    rowContent: {
        padding: 16,
        paddingRight: 52,
        gap: 8,
    },
    banner: {
        position: 'absolute',
        top: 0,
        right: 16,
        width: 28,
        height: 40,
        overflow: 'visible',
        alignItems: 'center',
        paddingTop: 5,
    },
    bannerNotch: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        width: 0,
        height: 0,
        backgroundColor: 'transparent',
        borderTopWidth: 0,
        borderLeftWidth: 14,
        borderRightWidth: 14,
        borderBottomWidth: 14,
        borderLeftColor: 'transparent',
        borderRightColor: 'transparent',
    },
})