import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView, TouchableOpacity } from 'react-native';
import supabase from '../src/supabaseClient'; // Import Supabase client

const SubjectTutorsPage = () => {
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [tutors, setTutors] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch all subjects from the database
  const fetchSubjects = async () => {
    try {
      const { data, error } = await supabase.from('subjects').select('*');
      if (error) throw error;
      setSubjects(data);
    } catch (error) {
      console.error('Error fetching subjects:', error.message);
    }
  };

  // Fetch tutors for the selected subject
  const fetchTutors = async (subjectId) => {
    console.log('Selected Subject ID:', subjectId); // Debugging line
    if (!subjectId) {
      console.error('Invalid subject ID:', subjectId);
      return;
    }

    setSelectedSubject(subjects.find((subject) => subject.subject_id === subjectId)); // Ensure correct subject is set
    setIsLoading(true);
    setTutors([]); // Clear previous tutors

    try {
      // Fetch the tutor_ids for the given subject_id from the tutor_subjects table
      const { data: tutorSubjectData, error } = await supabase
        .from('tutor_subjects')
        .select('tutor_id')
        .eq('subject_id', subjectId); // Match subject_id

      if (error) throw error;

      // Extract tutor_ids from the result
      const tutorIds = tutorSubjectData.map(item => item.tutor_id);

      if (tutorIds.length > 0) {
        // Now fetch the details of the tutors from the tutors table using the tutor_ids
        const { data: tutorDetails, error: tutorError } = await supabase
          .from('tutors')
          .select('user_id')
          .in('tutor_id', tutorIds);

        if (tutorError) throw tutorError;

        // Fetch user details for all the tutors by joining the users table
        const userIds = tutorDetails.map(item => item.user_id);
        if (userIds.length > 0) {
          const { data: userDetails, error: userError } = await supabase
            .from('users')
            .select('full_name, email')
            .in('id', userIds); // Match user_id

          if (userError) throw userError;

          // Map the users' details to the tutors
          const formattedTutors = tutorDetails.map((tutor, index) => ({
            full_name: userDetails[index].full_name,
            email: userDetails[index].email,
          }));

          setTutors(formattedTutors); // Set the fetched tutors
        }
      }
    } catch (error) {
      console.error('Error fetching tutors:', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch subjects on component mount
  useEffect(() => {
    fetchSubjects();
  }, []);

  return (
    <View style={styles.container}>
      {/* Header */}
      <Text style={styles.headerTitle}>Subjects</Text>

      {/* Subject Buttons */}
      <View style={styles.subjectsContainer}>
        {subjects.map((subject) => (
          <TouchableOpacity
            key={subject.subject_id} // Ensure subject_id is unique
            style={styles.subjectButton}
            onPress={() => fetchTutors(subject.subject_id)} // Pass the correct subject_id
          >
            <Text style={styles.subjectButtonText}>{subject.subject_name}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Tutors List */}
      <View style={styles.tutorsContainer}>
        {isLoading ? (
          <ActivityIndicator size="large" color="#003366" />
        ) : selectedSubject && tutors.length > 0 ? (
          <>
            <Text style={styles.selectedSubjectTitle}>
              Tutors for {selectedSubject.subject_name}:
            </Text>
            <ScrollView>
              {tutors.map((tutor, index) => (
                <View key={index} style={styles.tutorCard}>
                  <Text style={styles.tutorName}>{tutor.full_name}</Text>
                  <Text style={styles.tutorEmail}>{tutor.email}</Text>
                </View>
              ))}
            </ScrollView>
          </>
        ) : selectedSubject ? (
          <Text style={styles.noTutorsText}>
            No tutors available for {selectedSubject.subject_name}.
          </Text>
        ) : (
          <Text style={styles.noTutorsText}>
            Select a subject to view its tutors.
          </Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#003366',
    marginBottom: 20,
    textAlign: 'center',
  },
  subjectsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  subjectButton: {
    flexBasis: '45%',
    marginBottom: 10,
    backgroundColor: '#003366',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  subjectButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  tutorsContainer: {
    flex: 1,
  },
  selectedSubjectTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#003366',
    marginBottom: 10,
  },
  tutorCard: {
    padding: 15,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#003366',
    marginBottom: 15,
  },
  tutorName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#003366',
  },
  tutorEmail: {
    fontSize: 14,
    color: '#808080',
  },
  noTutorsText: {
    fontSize: 16,
    color: '#808080',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default SubjectTutorsPage;
