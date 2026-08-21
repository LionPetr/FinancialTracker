import { Text } from '@/components/Themed';
import { palette } from '@/constants/Colors';
import { router } from 'expo-router';
import { Pressable, StyleSheet } from 'react-native';

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
        backgroundColor: palette.brand,
        alignItems: 'center',
        justifyContent: 'center',
    },
    fabText: {
        color: palette.onBrand,
        fontSize: 32,
        fontWeight: '600',
        lineHeight: 32,
        textAlign: 'center',
    }

});

