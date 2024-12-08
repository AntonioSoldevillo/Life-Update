import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const BookingsInfo = ({ navigation }) => {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    // Dummy data for bookings
    const dummyBookings = [
      {
        booking_id: 1,
        subject: 'Math 101',
        tutor: 'John Doe',
        booking_date_time: '2024-12-10 10:00 AM',
        status: 'Pending',
      },
      {
        booking_id: 2,
        subject: 'Physics 102',
        tutor: 'Jane Smith',
        booking_date_time: '2024-12-12 02:00 PM',
        status: 'Accepted',
      },
      {
        booking_id: 3,
        subject: 'Chemistry 103',
        tutor: 'Alice Johnson',
        booking_date_time: '2024-12-14 01:00 PM',
        status: 'Rejected',
      },
      {
        booking_id: 4,
        subject: 'History 101',
        tutor: 'Bob Lee',
        booking_date_time: '2024-12-16 09:00 AM',
        status: 'Pending',
      },
    ];

    // Set dummy data to bookings state
    setBookings(dummyBookings);
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
      {bookings.length === 0 ? (
        <Text style={styles.noBookings}>No bookings found.</Text>
      ) : (
        <FlatList
          data={bookings}
          keyExtractor={(item) => item.booking_id.toString()}
          renderItem={({ item }) => (
            <View style={styles.bookingContainer}>
              <Text style={styles.bookingText}>Subject: {item.subject}</Text>
              <Text style={styles.bookingText}>Tutor: {item.tutor}</Text>
              <Text style={styles.bookingText}>Date & Time: {item.booking_date_time}</Text>
              <Text style={[styles.bookingText, styles.status(item.status)]}>Status: {item.status}</Text>
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
    marginLeft: 10,
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
