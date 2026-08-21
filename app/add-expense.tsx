import { useColorScheme } from '@/components/useColorScheme';
import Colors, { palette } from '@/constants/Colors';
import { useTransactions } from '@/context/TransactionContext';
import { formatMoney } from '@/lib/money';
import { router, useLocalSearchParams } from 'expo-router';
import { useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';


export default function AddExpenseScreen() {

    const colorScheme = useColorScheme() ?? 'light';
    const theme = Colors[colorScheme];

    const { addTransaction } = useTransactions();

    const inputColors = {
        text: theme.text,
        background: theme.background,
        border: theme.border,
        placeholder: theme.placeholder,
    };
    const amountInputRef = useRef<TextInput>(null);
    const [amountCents, setAmountCents] = useState(0);
    const [note, setNote] = useState('');
    const [paidBy, setPaidBy] = useState<'you' | 'partner'>('you');
    const { scope } = useLocalSearchParams<{ scope?: string }>();

    const [isFocused, setIsFocused] = useState(false);

    const handleAmountChange = (text: string) => {
        const digits = text.replace(/\D/g, '');
        setAmountCents(parseInt(digits || '0', 10));
    };
    const handleSave = () => {
        addTransaction({
            scope: scope as 'joint' | 'personal',
            amountCents: amountCents,
            note,
            paidBy: scope === 'joint' ? paidBy : null,
        });

        if (router.canGoBack()) {
            router.back();
        } else {
            router.replace(
                scope === 'personal' ? '/(tabs)/PersonalScreen' : '/(tabs)/JointScreen'
            );
        }
    };

    return (
        <View style={styles.container}>
            <Text style={[styles.title, { color: inputColors.text }]}>Adding to: {scope} account</Text>
            <Pressable onPress={() => amountInputRef.current?.focus()}>
                <View style={styles.amountRow}>
                    <Text style={[styles.amountText, { color: inputColors.text }]}>{formatMoney(amountCents)}</Text>
                    {isFocused && (
                        <View style={[styles.caret, { backgroundColor: Colors[colorScheme].tint }]} />
                    )}
                </View>
            </Pressable>

            <TextInput
                ref={amountInputRef}
                style={styles.hiddenInput}
                keyboardType="number-pad"
                value={amountCents === 0 ? '' : String(amountCents)}
                onChangeText={handleAmountChange}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                autoFocus
            />
            <TextInput
                style={[styles.input, { color: inputColors.text, backgroundColor: inputColors.background, borderColor: inputColors.border }]}
                placeholder="what is this for?"
                placeholderTextColor={inputColors.placeholder}
                value={note}
                onChangeText={setNote}
            />
            {scope === 'joint' && (
                <>
                    <Text style={[styles.label, { color: inputColors.text }]}>Paid by</Text>
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
                                    { color: inputColors.text },
                                    paidBy === 'you' && { color: theme.brand },
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
                                    { color: inputColors.text },
                                    paidBy === 'partner' && { color: theme.brand },
                                ]}>
                                Partner
                            </Text>
                        </Pressable>
                    </View>
                </>
            )}
            <Pressable style={styles.saveButton} onPress={handleSave}>
                <Text style={styles.saveButtonText}>Save</Text>
            </Pressable>
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
    },
    input: {
        width: '80%',
        height: 40,
        borderWidth: 1,
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
        borderColor: palette.brand,
        backgroundColor: palette.brandSubtle,
    },
    choiceText: {
        fontSize: 14,
        fontWeight: '600',
    },
    saveButton: {
        backgroundColor: palette.brand,
        padding: 10,
        borderRadius: 8,
        marginTop: 20,
    },
    saveButtonText: {
        color: palette.onBrand,
        fontSize: 16,
        fontWeight: '600',
    },
    amountText: {
        fontSize: 40,
        fontWeight: 'bold',
    },
    hiddenInput: {
        position: 'absolute',
        opacity: 0,
        height: 1,
        width: 1,
    },
    amountRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    caret: {
        width: 2,
        height: 40,
        marginLeft: 1,
        borderRadius: 1,
    },

})