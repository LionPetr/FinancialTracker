import { Text, View } from '@/components/Themed';
import { useColorScheme } from '@/components/useColorScheme';
import Colors, { palette } from '@/constants/Colors';
import { useAuth } from '@/context/AuthContext';
import { useState } from 'react';
import { Pressable, StyleSheet, TextInput } from 'react-native';

export default function SignInScreen() {
    const { signIn, signUp } = useAuth();
    const [mode, setMode] = useState<'signIn' | 'signUp'>('signIn');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const colorScheme = useColorScheme() ?? 'light';
    const theme = Colors[colorScheme];

    const handleSubmit = async () => {
        setSubmitting(true);
        setError(null);
        const action = mode === 'signIn' ? signIn : signUp;
        const { error } = await action(email.trim(), password);
        if (error) setError(error.message);
        setSubmitting(false);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{mode === 'signIn' ? 'Sign In' : 'Create Account'}</Text>

            <TextInput
                style={[styles.input, { color: theme.text, borderColor: theme.border }]}
                placeholder="Email"
                placeholderTextColor={theme.placeholder}
                autoCapitalize="none"
                keyboardType="email-address"
                value={email}
                onChangeText={setEmail}
            />
            <TextInput
                style={[styles.input, { color: theme.text, borderColor: theme.border }]}
                placeholder="Password"
                placeholderTextColor={theme.placeholder}
                secureTextEntry
                value={password}
                onChangeText={setPassword}
            />

            {error && <Text style={styles.error}>{error}</Text>}

            <Pressable style={styles.button} onPress={handleSubmit} disabled={submitting}>
                <Text style={styles.buttonText}>
                    {submitting ? '...' : mode === 'signIn' ? 'Sign in' : 'Sign up'}
                </Text>
            </Pressable>

            <Pressable onPress={() => setMode(mode === 'signIn' ? 'signUp' : 'signIn')}>
                <Text style={styles.toggle}>
                    {mode === 'signIn' ? 'No account? Sign up' : "Have an account? Sign in"}
                </Text>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
        gap: 12
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 12
    },
    input: {
        borderWidth: 1,
        borderRadius: 8,
        padding: 12,
        fontSize: 16
    },
    button: {
        backgroundColor: palette.brand,
        padding: 14,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 8
    },
    buttonText: {
        color: palette.onBrand,
        fontSize: 16,
        fontWeight: '600'
    },
    error: {
        color: palette.danger
    },
    toggle: {
        color: palette.brand,
        textAlign: 'center',
        marginTop: 8
    },
})