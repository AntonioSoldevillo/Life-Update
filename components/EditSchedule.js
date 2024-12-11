// EditSchedule.js
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import supabase from '../src/supabaseClient';

const EditSchedule = ({ route, navigation }) => {
  const { schedule } = route.params; // Get the schedule data passed from TutorSchedule screen
  const [availabilityDateTime, setAvailabilityDateTime] = useState(schedule.availability_date_time);

  // Update the schedule in the database
  const handleSave = async () => {
    try {
      const { error } = await supabase
        .from('schedule')
        .update({ availability_date_time: availabilityDateTime })
        .eq('schedule_id', schedule.schedule_id);

      if (error) throw new Error('Failed to update schedule');

      Alert.alert('Success', 'Schedule updated successfully');
      navigation.goBack(); // Go back to the previous screen after saving
    } catch (err) {
      console.error('Error updating schedule:', err.message);
      Alert.alert('Error', err.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Edit Schedule</Text>

      <Text style={styles.label}>Availability Date and Time</Text>
      <TextInput
        style={styles.input}
        value={availabilityDateTime}
        onChangeText={setAvailabilityDateTime}
        placeholder="YYYY-MM-DD HH:MM:SS"
      />

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Save</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f9f9f9',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 10,
    fontSize: 16,
    marginBottom: 20,
  },
  saveButton: {
    backgroundColor: '#00796b',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default EditSchedule;