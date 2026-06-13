import { FlatList, StyleSheet } from 'react-native';

import FloatingAddButton from '@/components/FloatingAddButton';
import { Text, View } from '@/components/Themed';
import { useTransactions } from '@/context/TransactionContext';


export default function JointScreen() {

  const { getTransactionsForScope, getTotalCentsForScope } = useTransactions();
  const transactions = getTransactionsForScope('joint');
  const totalCents = getTotalCentsForScope('joint');
  const formatMoney = (cents: number) => `$${(cents / 100).toFixed(2)}`;


  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Spent this Month</Text>
        <Text style={styles.title}>{formatMoney(totalCents)}</Text>
      </View>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      <View style={styles.list}>
        {transactions.length === 0 ? (
          <Text style={styles.transactions}>No transactions yet</Text>
        ) : (
          <FlatList
            data={[...transactions].reverse()}
            keyExtractor={(item) => item.id}
            style={styles.listContent}
            contentContainerStyle={styles.list}
            renderItem={({ item: transaction }) => (
              <View style={styles.row}>
                <Text style={styles.mainLine} numberOfLines={1}>
                  {formatMoney(transaction.amountCents)} - {transaction.note || 'No note'}
                </Text>
                {transaction.paidBy && (
                  <Text style={styles.paidByText}>
                    {transaction.paidBy === 'you' ? 'You paid' : 'Partner paid'}
                  </Text>
                )}
              </View>
            )}
          />
        )}
      </View>


      <FloatingAddButton scope="joint" />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    alignItems: 'center',
  },
  header: {
    padding: 24,
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
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
  list: {
    alignItems: 'stretch',
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
  },
  listContent: {
    paddingBottom: 96,
  }
});