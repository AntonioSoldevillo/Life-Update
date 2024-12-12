import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, FlatList, TouchableOpacity, Alert } from 'react-native';
import supabase from '../src/supabaseClient';

const SchedulePage = ({ route, navigation }) => {
  const { tutorId } = route.params; // Passed from the previous screen
  const [schedules, setSchedules] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch schedules for the tutor
  const fetchSchedules = async () => {
    try {
      const { data, error } = await supabase
        .from('schedule')
        .select('schedule_id, availability_date_time')
        .eq('tutor_id', tutorId);

      if (error) throw error;

      // Check if each schedule is already booked
      const schedulesWithStatus = await Promise.all(
        data.map(async (schedule) => {
          const { data: bookingData, error: bookingError } = await supabase
            .from('bookings')
            .select('booking_id')
            .eq('schedule_id', schedule.schedule_id)
            .single();

          if (bookingError) {
            console.error('Error checking booking status:', bookingError.message);
            return { ...schedule, status: 'available' }; // Assume no booking
          }

          return { ...schedule, status: 'booked' }; // If booking exists
        })
      );

      setSchedules(schedulesWithStatus); // Update state with schedules
    } catch (error) {
      console.error('Error fetching schedules:', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch the tutee ID for the current user
  const fetchTuteeId = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user || !user.id) {
        Alert.alert('Error', 'User not logged in. Please log in to continue.');
        return null;
      }

      const { data, error } = await supabase
        .from('tutees')
        .select('tutee_id')
        .eq('user_id', user.id)
        .single();

      if (error) {
        console.error('Error fetching tutee_id:', error.message);
        Alert.alert('Error', 'Failed to fetch tutee information.');
        return null;
      }

      return data?.tutee_id;
    } catch (err) {
      console.error('Error in fetchTuteeId:', err.message);
      Alert.alert('Error', 'Failed to fetch tutee information.');
      return null;
    }
  };

  // Fetch all subject_ids from the tutor_subjects table
  const fetchSubjectIds = async () => {
    try {
      const { data, error } = await supabase
        .from('tutor_subjects')
        .select('subject_id')
        .eq('tutor_id', tutorId);

      if (error) {
        console.error('Error fetching subject_ids:', error.message);
        Alert.alert('Error', 'Failed to fetch subject information.');
        return [];
      }

      if (!data || data.length === 0) {
        Alert.alert('Error', 'No subjects found for this tutor.');
        return [];
      }

      const subjectIds = data.map((entry) => entry.subject_id); // Collect all subject_ids
      console.log('Fetched Subject IDs:', subjectIds);
      return subjectIds;
    } catch (err) {
      console.error('Error in fetchSubjectIds:', err.message);
      Alert.alert('Error', 'Failed to fetch subject information.');
      return [];
    }
  };

  // Handle booking a slot
  const handleBooking = async (scheduleId, availabilityDateTime) => {
    console.log('Booking button pressed');

    const tuteeId = await fetchTuteeId();
    const subjectIds = await fetchSubjectIds(); // Fetch all subject_ids

    if (!tuteeId || subjectIds.length === 0) return;

    const subjectId = subjectIds[0]; // Use the first subject_id (or implement selection logic)

    try {
      const { data, error } = await supabase
        .from('bookings')
        .insert([{
          tutor_id: tutorId,
          tutee_id: tuteeId,
          subject_id: subjectId,
          schedule_id: scheduleId,
          booking_date_time: availabilityDateTime,
        }]);

      if (error) {
        Alert.alert('Error', 'Failed to book the slot.');
        console.error('Insert Error:', error.message);
      } else {
        Alert.alert('Success', 'Your booking has been confirmed!');
        console.log('Booking Data:', data); // Debug inserted booking
        navigation.navigate('Dashboard');
      }
    } catch (err) {
      Alert.alert('Error', 'An unexpected error occurred.');
      console.error(err.message);
    }
  };

  useEffect(() => {
    fetchSchedules();
  }, [tutorId]);

  return (
    <View style={styles.container}>
      {isLoading ? (
        <ActivityIndicator size="large" color="#003366" />
      ) : schedules.length > 0 ? (
        <FlatList
          data={schedules}
          keyExtractor={(item) => item.schedule_id.toString()}
          renderItem={({ item }) => (
            <View style={styles.scheduleCard}>
              <Text style={styles.scheduleText}>
                {new Date(item.availability_date_time).toLocaleString()}
              </Text>
              <Text style={styles.statusText}>{item.status === 'booked' ? 'Booked' : 'Available'}</Text>
              <TouchableOpacity
                style={styles.bookButton}
                onPress={() => handleBooking(item.schedule_id, item.availability_date_time)}
                disabled={item.status === 'booked'}
              >
                <Text style={styles.bookButtonText}>
                  {item.status === 'booked' ? 'Slot Taken' : 'Book This Slot'}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        />
      ) : (
        <Text style={styles.noSchedulesText}>No schedules available for this tutor.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
    marginTop: 30,
  },
  scheduleCard: {
    padding: 15,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#003366',
    marginBottom: 15,
  },
  scheduleText: {
    fontSize: 16,
    color: '#003366',
  },
  statusText: {
    fontSize: 14,
    color: '#808080',
    marginTop: 5,
  },
  bookButton: {
    marginTop: 10,
    backgroundColor: '#003366',
    padding: 10,
    borderRadius: 5,
  },
  bookButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  noSchedulesText: {
    fontSize: 16,
    color: '#808080',
    textAlign: 'center',
  },
});

export default SchedulePage;
