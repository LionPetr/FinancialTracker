import { StyleSheet } from 'react-native';

import { Text, View } from '@/components/Themed';

export default function PersonalScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Spent this Month</Text>
      <Text style={styles.title}>$0.00</Text>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      <Text style={styles.transactions}>No transactions yet</Text>
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
  }
});
