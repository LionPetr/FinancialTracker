import { router } from 'expo-router';
import { Pressable, StyleSheet, Text } from 'react-native';

type FloatingAddButtonProps = {
    scope: 'joint' | 'personal';
}

export default function FloatingAddButton({ scope }: FloatingAddButtonProps) {
    return (
        <Pressable
            style={styles.fab}
            onPress={() =>
                router.push({
                    pathname: '/add-expense',
                    params: { scope },
                })
            }>
            <Text style={styles.fabText}>+</Text>
        </Pressable>
    );
}

const styles = StyleSheet.create({
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

