import { StyleSheet } from 'react-native';

import ExpenseTabScreen from '@/components/ExpenseTabScreen';
import FloatingAddButton from '@/components/FloatingAddButton';
import { Text, View } from '@/components/Themed';
import { useAuth } from '@/context/AuthContext';
import { useTransactions } from '@/context/TransactionContext';
import { formatMoney } from '@/lib/money';
import { supabase } from '@/lib/supabase';
import { useEffect, useState } from 'react';

export default function JointScreen() {

  const { getTotalCentsForScope } = useTransactions();
  const totalCents = getTotalCentsForScope('joint');

  const { session, householdId } = useAuth();
  const [inviteCode, setInviteCode] = useState<string | null>(null);

  useEffect(() => {
    if (!householdId) {
      setInviteCode(null);
      return;
    }

    supabase
      .from('households')
      .select('invite_code')
      .eq('id', householdId)
      .single()
      .then(({ data, error }) => {
        if (error) {
          console.error('Error fetching invite code:', error.message);
          return;
        }
        setInviteCode(data?.invite_code || null);
      });
  }, [householdId]);



  return (
    <View style={styles.container}>
      <Text style={styles.note}>household invite code: {inviteCode || 'No invite code'} </Text>
      <View style={styles.header}>
        <Text style={styles.title}>Spent this Month</Text>
        <Text style={styles.title}>{formatMoney(totalCents)}</Text>
      </View>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      <ExpenseTabScreen scope="joint" />
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
    marginTop: 30,
    marginBottom: 0,
    height: 1,
    width: '100%',
  },
  note: {
    fontSize: 12,
  }
});