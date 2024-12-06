import React, { useState } from 'react';
import { View, Text, StyleSheet, Platform, TouchableOpacity } from 'react-native';
import  supabase  from '../src/supabaseClient'; // Adjust this import path as needed
import { Calendar } from 'react-native-calendars';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons'; // For back button and navigation icons

const Schedule = ({ navigation }) => {
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState(new Date());
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [error, setError] = useState(null);

  const handleDateSelect = (date) => {
    setSelectedDate(date.dateString); // Update selected date from the calendar
  };

  const handleTimeChange = (event, selectedDate) => {
    setShowTimePicker(Platform.OS === 'ios' ? true : false); // Hide time picker on iOS after selection
    if (selectedDate) {
      setSelectedTime(selectedDate);
    }
  };

  const handleSubmit = async () => {
    if (!selectedDate || !selectedTime) {
      setError('Please select a valid date and time');
      return;
    }

    const availabilityDateTime = new Date(
      `${selectedDate}T${selectedTime.getHours()}:${selectedTime.getMinutes()}:00`
    ).toISOString(); // Combine the date and time

    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) {
        setError('Error retrieving user: ' + userError.message);
        return;
      }

      if (!user) {
        setError('You must be logged in to create a schedule');
        return;
      }

      // Fetch the tutor_id from the tutors table using the user.id
      const { data: tutorData, error: tutorError } = await supabase
        .from('tutors')
        .select('tutor_id')
        .eq('user_id', user.id)
        .single();

      if (tutorError || !tutorData) {
        setError('Tutor ID not found for this user');
        return;
      }

      // Insert the schedule into the schedule table
      const { data, error } = await supabase.from('schedule').insert([
        {
          tutor_id: tutorData.tutor_id, // Use the retrieved tutor_id
          availability_date_time: availabilityDateTime,
        },
      ]);

      if (error) {
        setError('Error creating schedule: ' + error.message);
      } else {
        navigation.goBack(); // Navigate back after creating the schedule
      }
    } catch (err) {
      setError('An error occurred: ' + err.message);
    }
  };

  return (
    <View style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={24} color="#003366"  />
      </TouchableOpacity>

      <Text style={styles.title}>Create a New Schedule</Text>

      {/* Calendar to select a date */}
      <Calendar
        onDayPress={handleDateSelect}
        markedDates={{
          [selectedDate]: { selected: true, selectedColor: 'blue', selectedTextColor: 'white' },
        }}
      />

      {/* Time Picker */}
      <TouchableOpacity
        style={[styles.button, { marginTop: 20 }]}
        onPress={() => setShowTimePicker(true)}
      >
        <Text style={styles.buttonText}>Select Time</Text>
      </TouchableOpacity>
      {showTimePicker && (
        <DateTimePicker
          value={selectedTime}
          mode="time"
          display="default"
          onChange={handleTimeChange}
        />
      )}

      {error && <Text style={styles.error}>{error}</Text>}

      {/* Save Schedule Button */}
      <TouchableOpacity style={[styles.button, { marginTop: 15 }]} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Save Schedule</Text>
      </TouchableOpacity>

      {/* Bottom Navigation Bar */}
      <View style={styles.bottomNav}>
      <TouchableOpacity onPress={() => navigation.navigate('TutorDashboard')}>
  <Ionicons name="home-outline" size={24} color="#003366" />
</TouchableOpacity>
        <TouchableOpacity>
          <Ionicons name="person-outline" size={24} color="#808080" />
        </TouchableOpacity>
        
        <TouchableOpacity onPress={() => navigation.navigate('Schedule')}>
          <Ionicons name="calendar-outline" size={24} color="#003366" />
        </TouchableOpacity>
        <TouchableOpacity>
          <Ionicons name="book-outline" size={24} color="#003366" />
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
    backgroundColor: '#f9f9f9',
    marginTop: 30,
  },
  backButton: {
    marginBottom: 20,
    
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#003366'
  },
  error: {
    color: 'red',
    marginVertical: 10,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#003366', // Dark blue color
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    paddingVertical: 15,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopWidth: 1,
    borderTopColor: '#ccc',

    backButton: {
  marginBottom: 20,
  padding: 10, // Optional, to make the touch area larger
  alignSelf: 'flex-start', // Ensure it aligns to the left
},

title: {
  fontSize: 24,
  fontWeight: 'bold',
  marginBottom: 20,
  textAlign: 'center',
  color: '#003366', // Dark blue color
},
  },
});

export default Schedule;