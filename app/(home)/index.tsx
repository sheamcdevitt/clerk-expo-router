import { SignedIn, SignedOut, useUser, useAuth } from '@clerk/clerk-expo';
import { Link } from 'expo-router';
import { Text, View, Button, TouchableOpacity, Linking } from 'react-native';
import { styles } from '../styles';

export default function Page() {
  const { user } = useUser();
  const { signOut } = useAuth();

  const onSignOutPress = async () => {
    try {
      await signOut();
    } catch (err: any) {
      // Handle error
    }
  };

  return (
    <View style={styles.container}>
      <SignedIn>
        <Text style={{ marginBottom: 20, fontSize: 16 }}>
          Welcome, {user?.emailAddresses[0].emailAddress}
        </Text>
        <Button title='Sign Out' onPress={onSignOutPress} />
      </SignedIn>
      <SignedOut>
        <Text
          style={{
            fontSize: 24,
            fontWeight: 'bold',
            marginBottom: 20,
          }}
        >
          Welcome
        </Text>
        <Text style={{ marginBottom: 20, fontSize: 16 }}>
          Let's get started by signing in or creating an account.
        </Text>
        <Link href='/sign-in' asChild>
          <TouchableOpacity style={styles.primaryButton}>
            <Text style={styles.primaryButtonText}>Sign In</Text>
          </TouchableOpacity>
        </Link>
        <Link href='/sign-up' style={styles.secondaryButton}>
          <Text style={styles.secondaryButtonText}>Sign Up</Text>
        </Link>
      </SignedOut>
    </View>
  );
}
