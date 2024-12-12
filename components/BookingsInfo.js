import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import supabase from '../src/supabaseClient'; // Import the Supabase client

const BookingsInfo = ({ navigation }) => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        // Fetch the logged-in user's ID from Supabase Auth
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        
        if (userError) {
          console.error('Error fetching user:', userError.message);
          return;
        }

        const userId = user ? user.id : null; // If user is logged in, get the user ID, else null

        if (!userId) {
          console.log("User is not logged in");
          return;
        }

        // Fetch bookings data, including related tutor (from users table), subject, and schedule information
        const { data, error } = await supabase
  .from('bookings')
  .select(`
    booking_id,
    booking_date_time,
    tutors:tutor_id (
      user_id, 
      users:user_id (full_name)
    ),
    tutees:tutee_id (full_name),  // Assuming tutee_id relates to the users table
    subject_id, // Include or expand for subjects if necessary
    schedule_id  // Include or expand for schedules if necessary
  `)
  .eq('tutee_id', userId); // Filter for bookings belonging to the logged-in tutee (user)


if (error) {
  throw error;
}

setBookings(data);


      } catch (error) {
        console.error('Error fetching bookings:', error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  return (
    <View style={styles.container}>
      {/* Header with Back Button */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#003366" />
        </TouchableOpacity>
        <Text style={styles.title}>Your Bookings</Text>
      </View>

      {/* Bookings List */}
      {loading ? (
        <Text style={styles.noBookings}>Loading...</Text>
      ) : bookings.length === 0 ? (
        <Text style={styles.noBookings}>No bookings found.</Text>
      ) : (
        <FlatList
  data={bookings}
  keyExtractor={(item) => item.booking_id.toString()}
  renderItem={({ item }) => (
    <View style={styles.bookingContainer}>
      <Text style={styles.bookingText}>
        Tutor: {item.tutors?.users?.full_name || 'No tutor assigned'}
      </Text>
      <Text style={styles.bookingText}>
        Tutee: {item.tutees?.full_name || 'No tutee assigned'}
      </Text>
      <Text style={styles.bookingText}>
        Booking Date & Time: {item.booking_date_time || 'No date/time provided'}
      </Text>
    </View>
  )}
/>

      )}

      {/* Bottom Navigation Bar */}
      <View style={styles.bottomNav}>
        <TouchableOpacity>
          <Ionicons name="home-outline" size={24} color="#003366" />
        </TouchableOpacity>
        <TouchableOpacity>
          <Ionicons name="person-outline" size={24} color="#808080" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Subjects')}>
          <Ionicons name="book-outline" size={24} color="#808080" />
        </TouchableOpacity>
        <TouchableOpacity>
          <Ionicons name="chatbubble-outline" size={24} color="#808080" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
          <Ionicons name="settings-outline" size={24} color="#808080" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    marginTop: 30,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#003366',
    marginLeft: -230,
  },
  bookingContainer: {
    backgroundColor: '#ffffff',
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3, // For Android shadow effect
  },
  bookingText: {
    fontSize: 16,
    color: '#003366',
    marginBottom: 5,
  },
  status: (status) => {
    switch (status) {
      case 'Pending':
        return { color: 'orange' };
      case 'Accepted':
        return { color: 'green' };
      case 'Rejected':
        return { color: 'red' };
      default:
        return {};
    }
  },
  noBookings: {
    fontSize: 16,
    color: '#808080',
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    borderTopWidth: 3,
    borderTopColor: 'gray',
  },
});

export default BookingsInfo;
