import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import supabase from '../src/supabaseClient';

const formatDate = (day, schedule) => {
  const today = new Date();
  const dayOfWeek = today.getDay(); // 0-6 (Sunday to Saturday)
  const dayOffset = (Object.keys(schedule).indexOf(day) - dayOfWeek + 7) % 7; // Days until target day

  const targetDate = new Date(today);
  targetDate.setDate(today.getDate() + dayOffset);

  return targetDate.toISOString().split('T')[0]; // Format as YYYY-MM-DD
};

const Booking = ({ route, navigation }) => {
  const { tutorId, tutorName, subjectTitle } = route.params;
  const [selectedSlot, setSelectedSlot] = useState(null);

  const schedule = {
    Sunday: [
      { time: '08:00 AM - 10:00 AM', status: 'Available' },
      { time: '10:00 AM - 12:00 PM', status: 'Taken' },
      { time: '01:00 PM - 03:00 PM', status: 'Available' },
      { time: '03:00 PM - 05:00 PM', status: 'Available' },
    ],
    Monday: [
      { time: '08:00 AM - 10:00 AM', status: 'Available' },
      { time: '10:00 AM - 12:00 PM', status: 'Taken' },
      { time: '01:00 PM - 03:00 PM', status: 'Available' },
      { time: '03:00 PM - 05:00 PM', status: 'Available' },
    ],
    Tuesday: [
      { time: '08:00 AM - 10:00 AM', status: 'Available' },
      { time: '10:00 AM - 12:00 PM', status: 'Taken' },
      { time: '01:00 PM - 03:00 PM', status: 'Available' },
      { time: '03:00 PM - 05:00 PM', status: 'Available' },
    ],
    Wednesday: [
      { time: '08:00 AM - 10:00 AM', status: 'Available' },
      { time: '10:00 AM - 12:00 PM', status: 'Taken' },
      { time: '01:00 PM - 03:00 PM', status: 'Available' },
      { time: '03:00 PM - 05:00 PM', status: 'Available' },
    ],
    Thursday: [
      { time: '08:00 AM - 10:00 AM', status: 'Available' },
      { time: '10:00 AM - 12:00 PM', status: 'Taken' },
      { time: '01:00 PM - 03:00 PM', status: 'Available' },
      { time: '03:00 PM - 05:00 PM', status: 'Available' },
    ],
    Friday: [
      { time: '08:00 AM - 10:00 AM', status: 'Available' },
      { time: '10:00 AM - 12:00 PM', status: 'Taken' },
      { time: '01:00 PM - 03:00 PM', status: 'Available' },
      { time: '03:00 PM - 05:00 PM', status: 'Available' },
    ],
    Saturday: [
      { time: '08:00 AM - 10:00 AM', status: 'Available' },
      { time: '10:00 AM - 12:00 PM', status: 'Taken' },
      { time: '01:00 PM - 03:00 PM', status: 'Available' },
      { time: '03:00 PM - 05:00 PM', status: 'Available' },
    ],
    // Add other days as needed
  };

  const handleSlotSelect = (day, index) => {
    if (schedule[day][index].status === 'Available') {
      setSelectedSlot({ day, timeSlot: index });
    }
  };

  const handleBookNow = async () => {
    const user = await supabase.auth.getUser();
    const userId = user?.data?.user?.id;

    if (!userId) {
      Alert.alert('Error', 'User not logged in. Please log in to continue.');
      return;
    }

    if (!selectedSlot) {
      Alert.alert('Selection Required', 'Please select a time slot first.');
      return;
    }

    if (!subjectTitle) {
      Alert.alert('Error', 'Subject title is missing.');
      return;
    }

    // Fetch tutee_id
    try {
      const { data: tuteeData, error: tuteeError } = await supabase
        .from('tutees')
        .select('tutee_id')
        .eq('user_id', userId)
        .single();

      if (tuteeError || !tuteeData) {
        Alert.alert('Error', 'Failed to fetch tutee information.');
        return;
      }

      const tuteeId = tuteeData.tutee_id;

      const selectedTime = schedule[selectedSlot.day][selectedSlot.timeSlot].time;
      const [startTime] = selectedTime.split(' - ');
      const bookingDate = formatDate(selectedSlot.day, schedule);
      const bookingDateTime = `${bookingDate} ${startTime}`;

      // Insert booking
      const { data, error } = await supabase
        .from('bookings')
        .insert([{
          tutor_id: tutorId,
          tutee_id: tuteeId,
          subject: subjectTitle,
          booking_date_time: bookingDateTime,
        }]);

      if (error) {
        Alert.alert('Error', 'Booking failed.');
      } else {
        Alert.alert('Success', 'Your booking has been confirmed!');
        navigation.navigate('Dashboard');
      }
    } catch (err) {
      Alert.alert('Error', 'An unexpected error occurred.');
    }
  };

  const slotStyles = (day, index) => {
    const isSelected = selectedSlot && selectedSlot.day === day && selectedSlot.timeSlot === index;
    const isAvailable = schedule[day][index].status === 'Available';
    const isTaken = schedule[day][index].status === 'Taken';

    return {
      ...styles.slot,
      backgroundColor: isSelected
        ? '#FFEB3B' // Yellow for selected
        : isAvailable
        ? '#4CAF50' // Green for available
        : isTaken
        ? '#F44336' // Red for taken
        : '#f1f1f1',
      borderColor: isSelected ? '#FFEB3B' : '#ccc',
    };
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back-outline" size={24} color="#003366" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Book a session with {tutorName}</Text>
      </View>

      <Text style={styles.subjectTitle}>{subjectTitle}</Text>

      <ScrollView contentContainerStyle={styles.scheduleContainer}>
        {Object.keys(schedule).map((day) => (
          <View key={day} style={styles.dayContainer}>
            <Text style={styles.dayTitle}>
              {day} - {formatDate(day, schedule)} {/* Display the date */}
            </Text>
            {schedule[day].map((slot, index) => (
              <TouchableOpacity
                key={index}
                style={slotStyles(day, index)}
                onPress={() => handleSlotSelect(day, index)}
              >
                <Text style={styles.slotText}>{slot.time}</Text>
                <Text style={[styles.statusText, { color: 'black' }]}>{slot.status}</Text>
              </TouchableOpacity>
            ))}
          </View>
        ))}
      </ScrollView>

      <TouchableOpacity style={styles.bookButton} onPress={handleBookNow}>
        <Text style={styles.bookButtonText}>Book Now</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    marginTop:30
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#003366',
    marginLeft: 10,
  },
  subjectTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10,
    color: '#003366',
  },
  scheduleContainer: {
    paddingBottom: 20,
  },
  dayContainer: {
    marginBottom: 20,
  },
  dayTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#003366',
    marginBottom: 10,
  },
  slot: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  slotText: {
    fontSize: 14,
    color: '#003366',
  },
  statusText: {
    fontSize: 12,
  },
  bookButton: {
    backgroundColor: '#003366',
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
  },
  bookButtonText: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
  },
});

export default Booking;