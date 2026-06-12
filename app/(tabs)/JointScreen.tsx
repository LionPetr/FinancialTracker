import { StyleSheet } from 'react-native';

import { Text, View } from '@/components/Themed';

import { router } from 'expo-router';
import { Pressable } from 'react-native';

export default function JointScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Spent this Month</Text>
      <Text style={styles.title}>$0.00</Text>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      <Text style={styles.transactions}>No transactions yet</Text>
      <Pressable
        style={styles.fab}
        onPress={() =>
          router.push({
            pathname: '/add-expense',
            params: { scope: 'joint' },
          })
        }>
        <Text style={styles.fabText}>+</Text>
      </Pressable>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
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
  fab: {
    position: 'absolute',
    right: 24,
    bottom: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#2f95dc',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fabText: {
    color: '#fff',
    fontSize: 32,
    fontWeight: '600',
    lineHeight: 32,
    textAlign: 'center',
  }

});

