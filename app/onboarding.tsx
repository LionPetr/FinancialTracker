import { Text, View } from '@/components/Themed';
import { useColorScheme } from '@/components/useColorScheme';
import Colors, { palette } from '@/constants/Colors';
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import { Button, StyleSheet } from "react-native";

export default function OnboardingScreen() {

    const { refreshHousehold } = useAuth();

    const colorScheme = useColorScheme() ?? 'light';
    const theme = Colors[colorScheme];

    const handleCreateHousehold = async () => {
        const { error } = await supabase.rpc('create_household', {
            p_name: 'Our household',
        });
        if (error) {
            console.log('Error creating household:', error.message);
            return;
        }
        await refreshHousehold();
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}> Set up your household</Text>
            <Text style={[styles.subtitle, { color: theme.textMuted }]}>
                Create a new household or join an existing one. (coming soon.)
            </Text>
            <Button title="Create Household" onPress={handleCreateHousehold} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 24,
        gap: 12,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: palette.brand,
    },
    subtitle: {
        fontSize: 16,
    },
});