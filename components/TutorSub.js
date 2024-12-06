import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import supabase from '../src/supabaseClient';  // Assuming you have initialized Supabase client

const TutorSub = ({ navigation }) => {
  const [subjectName, setSubjectName] = useState('');
  const [tutorId, setTutorId] = useState(null);  // Set tutorId initially to null

  useEffect(() => {
    // Fetch the logged-in user's tutor ID when the component mounts
    const getTutorId = async () => {
      const user = supabase.auth.user();  // Get the current logged-in user
      if (user) {
        // Assuming you have a 'tutors' table that links user ID with tutor ID
        const { data, error } = await supabase
          .from('tutors')
          .select('tutor_id')
          .eq('user_id', user.id)  // Get tutor data based on user_id from the tutors table
          .single();

        if (error) {
          Alert.alert("Error", "Failed to fetch tutor ID.");
        } else {
          setTutorId(data.tutor_id);  // Set the tutor ID from the response
        }
      }
    };

    getTutorId();
  }, []);

  const subjects = [
    { title: 'Introduction To Computing', image: require('../assets/computing.jpg'), id: 1 },
    { title: 'Computer Programming 1&2', image: require('../assets/programming.jpg'), id: 2 },
    { title: 'Data Structures & Algorithm', image: require('../assets/datastructure.png'), id: 3 },
    { title: 'Discrete Mathematics', image: require('../assets/discrete.jpg'), id: 4 },
  ];

  const handleAddSubject = async () => {
    if (!subjectName) {
      Alert.alert("Error", "Subject name is required.");
      return;
    }
    if (!tutorId) {
      Alert.alert("Error", "Tutor ID is not available.");
      return;
    }

    // Insert the new subject into the database
    try {
      const { data, error } = await supabase
        .from('subjects')
        .insert([ 
          { 
            subject_name: subjectName,
            tutor_id: tutorId,  // Automatically assigns the tutor_id based on the logged-in tutor
          }
        ]);
      if (error) {
        Alert.alert("Error", "Failed to add subject.");
      } else {
        Alert.alert("Success", "Subject added successfully!");
        setSubjectName(''); // Clear the input field after submission
      }
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Something went wrong!");
    }
  };

  const handleDeleteSubject = async (subjectId) => {
    try {
      const { data, error } = await supabase
        .from('subjects')
        .delete()
        .eq('subject_id', subjectId);  // Assuming 'subject_id' is the primary key for subjects table
      if (error) {
        Alert.alert("Error", "Failed to delete subject.");
      } else {
        Alert.alert("Success", "Subject deleted successfully!");
      }
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Something went wrong!");
    }
  };

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search-outline" size={20} color="#808080" style={styles.searchIcon} />
        <TextInput placeholder="Search subjects" style={styles.searchInput} />
      </View>

      {/* Add New Subject */}
      <View style={styles.addSubjectContainer}>
        <TextInput
          placeholder="Enter Subject Name"
          style={styles.addSubjectInput}
          value={subjectName}
          onChangeText={setSubjectName}
        />
      </View>

      {/* Add Subject Button */}
      <TouchableOpacity style={styles.addButton} onPress={handleAddSubject}>
        <Text style={styles.addButtonText}>Add Subject</Text>
      </TouchableOpacity>

      {/* My Subjects Label */}
      <Text style={styles.mySubjectsLabel}>My Subjects</Text>

      {/* Subjects List */}
      <ScrollView style={styles.subjectsContainer}>
        {subjects.map((subject) => (
          <View key={subject.id} style={styles.subjectCard}>
            <Image source={subject.image} style={styles.subjectImage} />
            <Text style={styles.subjectTitle}>{subject.title}</Text>
            <TouchableOpacity onPress={() => handleDeleteSubject(subject.id)} style={styles.deleteIcon}>
              <Ionicons name="trash-outline" size={24} color="red" />
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>

      {/* Bottom Navigation */}
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
         
        <TouchableOpacity>
          <Ionicons name="settings-outline" size={24} color="#808080" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
    marginTop: -5,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f1f1',
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  addSubjectContainer: {
    marginBottom: 20,
  },
  addSubjectInput: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#003366',
    borderRadius: 5,
    fontSize: 16,
  },
  addButton: {
    backgroundColor: '#003366',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 20,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  mySubjectsLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#003366',
    marginBottom: 10,
  },
  subjectsContainer: {
    flex: 1,
  },
  subjectCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#003366',
    padding: 10,
    marginBottom: 15,
    position: 'relative',
  },
  subjectImage: {
    width: 50,
    height: 50,
    borderRadius: 5,
    marginRight: 10,
  },
  subjectTitle: {
    fontSize: 16,
    color: '#003366',
    fontWeight: 'bold',
    flex: 1,
  },
  deleteIcon: {
    position: 'absolute',
    right: 10,
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#f1f1f1',
  },
});

export default TutorSub;
