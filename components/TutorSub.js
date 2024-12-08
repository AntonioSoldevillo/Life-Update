import React, { useState, useEffect } from 'react'; 
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
  ScrollView,
} from 'react-native';
import supabase from '../src/supabaseClient'; // Import Supabase client

const SubjectTutorsPage = () => {
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [tutors, setTutors] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [tutorId, setTutorId] = useState(null); // Holds the logged-in tutor's ID

  // Predefined subjects
  const subjects = [
    { id: 1000, name: 'Soft Eng' },
    { id: 1001, name: 'Mob Prog' },
    { id: 1002, name: 'Techno' },
  ];

  // Fetch the logged-in tutor's ID
  const fetchTutorId = async () => {
    try {
      const { data: { user }, error } = await supabase.auth.getUser(); // Fetch the logged-in user

      if (error || !user) {
        console.error('Error fetching user:', error || 'No user found');
        Alert.alert('Error', 'Unable to identify the logged-in user.');
        return;
      }

      const userId = user.id; // Get the user ID

      // Query the `tutors` table for the tutor's ID
      const { data, error: tutorError } = await supabase
        .from('tutors')
        .select('tutor_id')
        .eq('user_id', userId)
        .single();

      if (tutorError) throw tutorError;

      setTutorId(data?.tutor_id); // Store the tutor's ID
    } catch (error) {
      console.error('Error fetching tutor ID:', error.message);
      Alert.alert('Error', 'Could not fetch tutor information.');
    }
  };

  useEffect(() => {
    fetchTutorId(); // Fetch tutor ID on component mount
  }, []);

  // Fetch tutors enrolled in a subject
  const fetchTutors = async (subjectId) => {
    setIsLoading(true);
    setTutors([]); // Clear previous tutors
    setSelectedSubject(subjects.find((subject) => subject.id === subjectId));

    try {
      const { data, error } = await supabase
        .from('tutor_subjects')
        .select(`
          tutors (
            user_id,
            users (
              full_name,
              email
            )
          )
        `)
        .eq('subject_id', subjectId);

      if (error) throw error;

      const formattedTutors = data.map((entry) => ({
        fullName: entry.tutors.users.full_name,
        email: entry.tutors.users.email,
      }));

      setTutors(formattedTutors);
    } catch (error) {
      console.error('Error fetching tutors:', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Enroll the tutor in a subject
  const enrollInSubject = async (subjectId) => {
    if (!tutorId) {
      Alert.alert('Error', 'You must be logged in as a tutor to enroll.');
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await supabase
        .from('tutor_subjects')
        .insert({
          tutor_id: tutorId, // Use the fetched tutor ID
          subject_id: subjectId, // ID of the selected subject
        });

      if (error) {
        console.error('Supabase error:', error); // Log the error
        throw error;
      }

      Alert.alert('Success', `You have enrolled in ${selectedSubject.name}!`);
    } catch (error) {
      console.error('Error enrolling in subject:', error.message);
      Alert.alert('Error', 'Could not enroll in subject. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <Text style={styles.headerTitle}>Subjects</Text>

      {/* Subject Buttons */}
      <View style={styles.subjectsContainer}>
        {subjects.map((subject) => (
          <TouchableOpacity
            key={subject.id}
            style={styles.subjectButton}
            onPress={() => setSelectedSubject(subject)}
          >
            <Text style={styles.subjectButtonText}>{subject.name}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Enrollment Section */}
      {selectedSubject && (
        <View style={styles.enrollmentContainer}>
          <Text style={styles.selectedSubjectTitle}>
            Enroll in {selectedSubject.name}?
          </Text>
          <TouchableOpacity
            style={styles.enrollButton}
            onPress={() => enrollInSubject(selectedSubject.id)}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.enrollButtonText}>Enroll</Text>
            )}
          </TouchableOpacity>

          {/* View Tutors */}
          <TouchableOpacity
            style={styles.viewTutorsButton}
            onPress={() => fetchTutors(selectedSubject.id)}
          >
            <Text style={styles.viewTutorsText}>View Tutors</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Tutors List */}
      {tutors.length > 0 && (
        <ScrollView style={styles.tutorsContainer}>
          <Text style={styles.selectedSubjectTitle}>Tutors Enrolled:</Text>
          {tutors.map((tutor, index) => (
            <View key={index} style={styles.tutorCard}>
              <Text style={styles.tutorName}>{tutor.fullName}</Text>
              <Text style={styles.tutorEmail}>{tutor.email}</Text>
            </View>
          ))}
        </ScrollView>
      )}
      
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 20 },
  headerTitle: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  subjectsContainer: { flexDirection: 'row', marginBottom: 20 },
  subjectButton: { flex: 1, backgroundColor: '#003366', margin: 5, padding: 15 },
  subjectButtonText: { color: '#fff', fontSize: 16, textAlign: 'center' },
  enrollmentContainer: { alignItems: 'center', marginTop: 20 },
  enrollButton: { backgroundColor: '#28a745', padding: 15, marginTop: 10 },
  enrollButtonText: { color: '#fff', fontSize: 16, textAlign: 'center' },
  viewTutorsButton: { backgroundColor: '#003366', marginTop: 10, padding: 15 },
  viewTutorsText: { color: '#fff', textAlign: 'center' },
  tutorsContainer: { marginTop: 20 },
  tutorCard: { padding: 10, backgroundColor: '#f9f9f9', marginBottom: 10 },
  tutorName: { fontSize: 16, fontWeight: 'bold' },
  tutorEmail: { fontSize: 14, color: '#555' },
});

export default SubjectTutorsPage;