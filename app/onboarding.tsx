import { StyleSheet, Text, View } from "react-native";

export default function OnboardingScreen() {
    return (
        <View style={styles.container}>
            <Text style={styles.title}> Set up your household</Text>
            <Text style={styles.subtitle}>
                Create a new household or join an existing one. (coming soon.)
            </Text>
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
        color: '#2f95dc',
    },
    subtitle: {
        fontSize: 16,
        opacity: 0.7,
        color: '#fff',
    },
});