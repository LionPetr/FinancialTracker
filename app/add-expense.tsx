import { useColorScheme } from '@/components/useColorScheme';
import Colors from '@/constants/Colors';
import { useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';


export default function AddExpenseScreen() {

    const colorScheme = useColorScheme() ?? 'light';
    const isDark = colorScheme === 'dark';

    const inputColors = {
        text: Colors[colorScheme].text,
        background: isDark ? '1c1c1e' : '#fff',
        border: isDark ? '#444' : '#ccc',
        placeholder: isDark ? '#888' : '#888',
    };
    const [amount, setAmount] = useState('');
    const [note, setNote] = useState('');
    const [paidBy, setPaidBy] = useState<'you' | 'partner'>('you');
    const { scope } = useLocalSearchParams<{ scope?: string }>();

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Adding to: {scope} account</Text>
            <TextInput
                style={[styles.input, { color: inputColors.text, backgroundColor: inputColors.background, borderColor: inputColors.border }]}
                keyboardType="decimal-pad"
                placeholder="0.00"
                placeholderTextColor="#888"
                value={amount}
                onChangeText={setAmount}
            />
            <TextInput
                style={[styles.input, { color: inputColors.text, backgroundColor: inputColors.background, borderColor: inputColors.border }]}
                placeholder="what is this for?"
                placeholderTextColor="#888"
                value={note}
                onChangeText={setNote}
            />
            {scope === 'joint' && (
                <>
                    <Text style={styles.label}>Paid by</Text>
                    <View style={styles.choiceRow}>
                        <Pressable
                            style={[
                                styles.choiceButton,
                                { borderColor: inputColors.border },
                                paidBy === 'you' && styles.choiceButtonActive,
                            ]}
                            onPress={() => setPaidBy('you')}>
                            <Text
                                style={[
                                    styles.choiceText,
                                    paidBy === 'you' && styles.choiceTextActive,
                                ]}>
                                You
                            </Text>
                        </Pressable>

                        <Pressable
                            style={[
                                styles.choiceButton,
                                { borderColor: inputColors.border },
                                paidBy === 'partner' && styles.choiceButtonActive,
                            ]}
                            onPress={() => setPaidBy('partner')}>
                            <Text
                                style={[
                                    styles.choiceText,
                                    paidBy === 'partner' && styles.choiceTextActive,
                                ]}>
                                Partner
                            </Text>
                        </Pressable>
                    </View>
                </>
            )}
        </View>
    );


}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#fff',
    },
    input: {
        width: '80%',
        height: 40,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        paddingHorizontal: 10,
        marginVertical: 10,
    },
    picker: {
        width: '80%',
        height: 40,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        paddingHorizontal: 10,
        marginVertical: 10,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 8,
        alignSelf: 'flex-start',
        width: '80%',
        color: '#fff',
    },
    choiceRow: {
        flexDirection: 'row',
        width: '80%',
        gap: 12,
    },
    choiceButton: {
        flex: 1,
        height: 44,
        borderWidth: 1,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    choiceButtonActive: {
        borderColor: '#2f95dc',
        backgroundColor: 'rgba(47, 149, 220, 0.15)',
    },
    choiceText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#fff',
    },
    choiceTextActive: {
        color: '#2f95dc',
    },
})