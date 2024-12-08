import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, FlatList, TouchableOpacity, Alert } from 'react-native';
import supabase from '../src/supabaseClient';

const SchedulePage = ({ route, navigation }) => {
  const { tutorId } = route.params; // tutorId is passed from the previous screen
  const [schedules, setSchedules] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [subjectId, setSubjectId] = useState(null); // State to store subject_id

  // Fetch schedules for the tutor
  const fetchSchedules = async () => {
    try {
      const { data, error } = await supabase
        .from('schedule')
        .select('schedule_id, availability_date_time')
        .eq('tutor_id', tutorId);
  
      if (error) throw error;
  
      // Check if the schedule is already booked
      const schedulesWithStatus = await Promise.all(
        data.map(async (schedule) => {
          const { data: bookingData, error: bookingError } = await supabase
            .from('bookings')
            .select('booking_id')
            .eq('schedule_id', schedule.schedule_id)
            .single(); // Check if there is a booking for this schedule
  
          if (bookingError) {
            console.error('Error checking booking status:', bookingError.message);
            return { ...schedule, status: 'available' }; // No booking, status is available
          }
  
          // If booking exists, mark it as booked
          return { ...schedule, status: 'booked' };
        })
      );
  
      setSchedules(schedulesWithStatus); // Update state with schedules and status
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
        console.log('User is not logged in.');
        Alert.alert('Error', 'User not logged in. Please log in to continue.');
        return null;
      }
  
      console.log('User ID:', user.id);
  
      // Query the tutees table to find the tutee_id associated with the user_id
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
  
      return data?.tutee_id; // Return the tutee_id if found
    } catch (err) {
      console.error('Error in fetchTuteeId:', err.message);
      Alert.alert('Error', 'Failed to fetch tutee information.');
      return null;
    }
  };

  // Fetch the subject_id from the tutor_subjects table
  const fetchSubjectId = async () => {
    try {
      const { data, error } = await supabase
        .from('tutor_subjects') // Query the tutor_subjects table
        .select('subject_id') // Select the subject_id column
        .eq('tutor_id', tutorId); // Match the tutor_id

      if (error) {
        console.error('Error fetching subject_id:', error.message);
        Alert.alert('Error', 'Failed to fetch subject information.');
        return null;
      }

      if (data.length === 0) {
        Alert.alert('Error', 'No subjects found for this tutor.');
        return null; // No subjects found
      }

      // If multiple subjects are found, choose the first one (or handle accordingly)
      const subjectId = data[0].subject_id;
      console.log('Fetched subject data:', subjectId);
      return subjectId;

    } catch (err) {
      console.error('Error in fetchSubjectId:', err.message);
      Alert.alert('Error', 'Failed to fetch subject information.');
      return null;
    }
  };

  // Handle booking a slot
  const handleBooking = async (scheduleId, availabilityDateTime) => {
    console.log('Booking button pressed');
    
    const tuteeId = await fetchTuteeId();
    const fetchedSubjectId = await fetchSubjectId(); // Fetch subject_id
  
    if (!tuteeId || !fetchedSubjectId) return; // Ensure subject_id and tuteeId are available
  
    try {
      // Insert booking without manually specifying booking_id (auto-increment handled by DB)
      const { data, error } = await supabase
        .from('bookings')
        .insert([{
          tutor_id: tutorId,
          tutee_id: tuteeId,
          subject_id: fetchedSubjectId, // Use fetched subject_id
          schedule_id: scheduleId,
          booking_date_time: availabilityDateTime,
        }]);
  
      if (error) {
        Alert.alert('Error', 'Failed to book the slot.');
        console.error('Insert Error:', error.message);
      } else {
        Alert.alert('Success', 'Your booking has been confirmed!');
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
