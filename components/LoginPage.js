import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Button, TextInput, Checkbox } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons'; // For eye icon
import supabase from '../src/supabaseClient';  // Default import instead of named import

const LoginPage = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false); // To toggle visibility
  const [errorMessage, setErrorMessage] = useState(null); // To store error messages

  // Handle the login process
  const handleLogin = async () => {
    if (!email || !password) {
      alert('Please enter both email and password');
      return;
    }

    try {
      // Sign in with email and password
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      console.log('Supabase Response Data:', data); // Log the response data
      console.log('Supabase Response Error:', error); // Log the error (if any)

      if (error) {
        setErrorMessage(error.message);  // Show error message to the user
        return;
      }

      if (data) {
        // Successful login
        alert('Logged in successfully');
        navigation.navigate('Dashboard'); // Navigate to Dashboard on success
      } else {
        setErrorMessage('Login failed');  // If no data is returned, show a generic message
      }
    } catch (error) {
      console.error('Error during login:', error); // Log unexpected errors
      setErrorMessage('Error during login: ' + error.message);
    }
  };

  useEffect(() => {
    // Listen for authentication state changes
    const { data: subscription } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        // If the session is valid (user is authenticated), navigate to the Dashboard
        navigation.navigate('Dashboard');
      }
    });
  
    // Clean up the listener when the component unmounts
    return () => {
      subscription?.unsubscribe();  // Safely unsubscribe
    };
  }, [navigation]);
  

  return (
    <View style={styles.container}>
      <Image source={require('../assets/logo.png')} style={styles.logo} />
      <Text style={styles.title}>TutorLink</Text>

      {/* Email input */}
      <TextInput
        label="Email address"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        keyboardType="email-address"
        mode="outlined"
      />

      {/* Password input with visibility toggle */}
      <View style={styles.passwordContainer}>
        <TextInput
          label="Enter password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!passwordVisible} // Toggle secureTextEntry based on state
          style={styles.input}
          mode="outlined"
        />
        <TouchableOpacity
          style={styles.eyeIcon}
          onPress={() => setPasswordVisible(!passwordVisible)}
        >
          <Ionicons
            name={passwordVisible ? 'eye-off-outline' : 'eye-outline'}
            size={24}
            color="#808080"
          />
        </TouchableOpacity>
      </View>

      {/* Display error message if login fails */}
      {errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>}

      {/* Remember me checkbox */}
      <View style={styles.rememberMeContainer}>
        <Checkbox
          status={rememberMe ? 'checked' : 'unchecked'}
          onPress={() => setRememberMe(!rememberMe)}
        />
        <Text>Remember me</Text>
      </View>

      {/* Forgot password link */}
      <TouchableOpacity>
        <Text style={styles.forgotPassword}>Forgot password?</Text>
      </TouchableOpacity>

      {/* Login button */}
      <Button mode="contained" onPress={handleLogin} style={styles.button}>
        Login
      </Button>

      {/* Sign up link */}
      <View style={styles.signUpContainer}>
        <Text>Don't have an account? </Text>
        <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
          <Text style={styles.signUpText}>Sign Up</Text>
        </TouchableOpacity>
      </View>

      {/* Social media login options */}
      <Text style={styles.orText}>OR</Text>
      <Button mode="outlined" icon="google" style={styles.socialButton}>
        Continue with Google
      </Button>
      <Button mode="outlined" icon="facebook" style={styles.socialButton}>
        Continue with Facebook
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  logo: {
    width: 80,
    height: 80,
    alignSelf: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#003366',
  },
  input: {
    marginBottom: 10,
    backgroundColor: 'transparent',
    width: '100%', // Ensure full width for inputs
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
    width: '100%', // Stretch the container to full width
  },
  eyeIcon: {
    position: 'absolute',
    right: 15,
    top: 15, // Adjusted to align better with the TextInput
  },
  rememberMeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  forgotPassword: {
    color: '#003366',
    textAlign: 'right',
    marginTop: -39,
  },
  button: {
    marginBottom: 20,
    backgroundColor: '#003366',
  },
  signUpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  signUpText: {
    color: '#003366',
    fontWeight: 'bold',
  },
  orText: {
    textAlign: 'center',
    marginVertical: 5,
    color: '#808080',
    marginBottom: 20,
  },
  socialButton: {
    marginBottom: 10,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 10,
  },
});

export default LoginPage;
