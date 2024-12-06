import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { supabase } from './src/supabaseClient'; // Correct import of Supabase client
import LoginPage from './components/LoginPage';
import SignUpPage from './components/SignUp';
import DashboardPage from './components/Dashboard'; // Import DashboardPage
import SubjectPage from './components/Subject'; // Import SubjectPage
import TutorsPage from './components/Tutors'; // Import TutorsPage
import BookingPage from './components/Book'; // Import BookingPage
import FeePage from './components/Fee';
import Pending from './components/Pending';
import Settings from './components/Settings'; 
import TutorDash from './components/TutorDash';
import Schedule from './components/Schedule'
import TutorSub from './components/TutorSub';

const Stack = createStackNavigator();

export default function App() {
  const [user, setUser] = useState(null);

  // Check if user is logged in
  useEffect(() => {
    if (!supabase) {
      console.error('Supabase client is not initialized');
      return;
    }

    const currentUser = supabase.auth.user(); // Get current logged-in user
    if (currentUser) {
      setUser(currentUser); // Set the user if logged in
    } else {
      setUser(null); // No user logged in
    }

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null); // Update user state on auth state change
    });

    return () => {
      authListener?.unsubscribe(); // Clean up the listener when the component is unmounted
    };
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={user ? "Dashboard" : "Login"}>
        <Stack.Screen 
          name="Login" 
          component={LoginPage} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="SignUp" 
          component={SignUpPage} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="Dashboard" 
          component={DashboardPage} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="Subjects" 
          component={SubjectPage} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="Tutors" 
          component={TutorsPage} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="Booking" 
          component={BookingPage} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen
          name="Fee"
          component={FeePage}
          options={{ headerShown: false }}
        />
        <Stack.Screen 
            name="Pending" 
            component={Pending} 
            options={{ headerShown: false }} 
          />
          <Stack.Screen 
          name="Settings" 
          component={Settings} 
          options={{ headerShown: false }} // Optional: Hide header for consistency
        />
        <Stack.Screen 
          name="TutorDashboard" 
          component={TutorDash} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="Schedule" 
          component={Schedule} 
          options={{ headerShown: false }} 
/>

<Stack.Screen 
          name="TutorSub" 
          component={TutorSub} 
          options={{
            title: 'My Subjects',
            headerBackTitleVisible: false,
            color: '#003366'
          }} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
