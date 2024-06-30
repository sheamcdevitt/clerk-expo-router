import * as React from 'react';
import { TextInput, Button, View, TouchableOpacity, Text } from 'react-native';
import { useSignUp } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';
import { styles } from '../styles';

export default function SignUpScreen() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const router = useRouter();

  const [emailAddress, setEmailAddress] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [pendingVerification, setPendingVerification] = React.useState(false);
  const [code, setCode] = React.useState('');

  const onSignUpPress = async () => {
    if (!isLoaded) {
      return;
    }

    try {
      await signUp.create({
        emailAddress,
        password,
      });

      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });

      setPendingVerification(true);
    } catch (err: any) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(err, null, 2));
    }
  };

  const onPressVerify = async () => {
    if (!isLoaded) {
      return;
    }

    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code,
      });

      if (completeSignUp.status === 'complete') {
        await setActive({ session: completeSignUp.createdSessionId });
        router.replace('/');
      } else {
        console.error(JSON.stringify(completeSignUp, null, 2));
      }
    } catch (err: any) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(err, null, 2));
    }
  };

  return (
    <View style={styles.container}>
      {!pendingVerification && (
        <>
          <View style={styles.inputView}>
            <TextInput
              autoCapitalize='none'
              value={emailAddress}
              placeholder='Email...'
              onChangeText={(email) => setEmailAddress(email)}
              style={styles.textInput}
            />
          </View>
          <View style={styles.inputView}>
            <TextInput
              value={password}
              style={styles.textInput}
              placeholder='Password...'
              secureTextEntry={true}
              onChangeText={(password) => setPassword(password)}
            />
          </View>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={onSignUpPress}
          >
            <Text style={styles.primaryButtonText}>Sign up</Text>
          </TouchableOpacity>
        </>
      )}
      {pendingVerification && (
        <>
          <View style={styles.inputView}>
            <TextInput
              value={code}
              placeholder='Code...'
              onChangeText={(code) => setCode(code)}
              style={styles.textInput}
            />
          </View>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={onPressVerify}
          >
            <Text style={styles.primaryButtonText}>Verify Email</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}
