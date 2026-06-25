import { StyleSheet } from 'react-native';

import ExpenseTabScreen from '@/components/ExpenseTabScreen';
import FloatingAddButton from '@/components/FloatingAddButton';
import { Text, View } from '@/components/Themed';
import { useTransactions } from '@/context/TransactionContext';
import { formatMoney } from '@/lib/money';

export default function PersonalScreen() {

  const { getTotalCentsForScope } = useTransactions();

  const totalCents = getTotalCentsForScope('personal');

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Spent this Month</Text>
        <Text style={styles.title}>{formatMoney(totalCents)}</Text>
      </View>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      <ExpenseTabScreen scope="personal" />
      <FloatingAddButton scope="personal" />
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
});

