import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
  ScrollView,
  TextInput, // Import TextInput for the search bar
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import supabase from '../src/supabaseClient';
import { MaterialIcons, Ionicons, FontAwesome } from '@expo/vector-icons';

const SubjectTutorsPage = ({ navigation }) => {
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [tutors, setTutors] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [tutorId, setTutorId] = useState(null);
  const [searchQuery, setSearchQuery] = useState(''); // State for search query
  const [enrolledSubjects, setEnrolledSubjects] = useState([]); // State to hold enrolled subjects

  const subjects = [
    { id: 1000, name: 'Software Engineering' },
    { id: 1001, name: 'Mobile Programming' },
    { id: 1002, name: 'Technoprenuership' },
    { id: 1003, name: 'Internet of Things' },
  ];

  const fetchTutorId = async () => {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error || !user) {
        console.error('Error fetching user:', error || 'No user found');
        Alert.alert('Error', 'Unable to identify the logged-in user.');
        return;
      }

      const userId = user.id;
      const { data, error: tutorError } = await supabase
        .from('tutors')
        .select('tutor_id')
        .eq('user_id', userId)
        .single();

      if (tutorError) throw tutorError;

      setTutorId(data?.tutor_id);
      fetchEnrolledSubjects(data?.tutor_id);  // Fetch subjects after getting tutor ID
    } catch (error) {
      console.error('Error fetching tutor ID:', error.message);
      Alert.alert('Error', 'Could not fetch tutor information.');
    }
  };

  const fetchEnrolledSubjects = async (tutorId) => {
    try {
      const { data, error } = await supabase
        .from('tutor_subjects')
        .select('subject_id')
        .eq('tutor_id', tutorId);

      if (error) throw error;

      const enrolledSubjectIds = data.map((entry) => entry.subject_id);
      setEnrolledSubjects(enrolledSubjectIds);  // Store the enrolled subject IDs
    } catch (error) {
      console.error('Error fetching enrolled subjects:', error.message);
    }
  };

  useEffect(() => {
    fetchTutorId();
  }, []);

  const fetchTutors = async (subjectId) => {
    setIsLoading(true);
    setTutors([]);
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

  // Filtered subjects based on search query and enrolled subjects
  const filteredSubjects = subjects.filter(
    (subject) =>
      enrolledSubjects.includes(subject.id) && 
      subject.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="#003366" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}> My Subjects</Text>
      </View>

      {/* Search Bar */}
      <TextInput
        style={styles.searchBar}
        placeholder="Search subjects..."
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      {/* Subject Buttons */}
      <ScrollView style={styles.subjectsContainer}>
        {filteredSubjects.map((subject) => (
          <TouchableOpacity
            key={subject.id}
            style={[
              styles.subjectButton,
              selectedSubject?.id === subject.id && styles.selectedSubjectButton,
            ]}
            onPress={() => setSelectedSubject(subject)}
          >
            <Text style={styles.subjectButtonText}>{subject.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Enrollment Section */}
      {selectedSubject && (
        <View style={styles.enrollmentContainer}>
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
  container: { flex: 1, backgroundColor: '#fff', padding: 20, marginTop: 30 },
  headerContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  headerTitle: { fontSize: 24, fontWeight: 'bold', marginLeft: 10, color: '#003366' },
  searchBar: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 10,
  },
  subjectsContainer: { flex: 1, marginBottom: 20 },
  subjectButton: {
    backgroundColor: '#003366',
    margin: 5,
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderRadius: 10,
  },
  subjectButtonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
  selectedSubjectButton: {
    borderWidth: 2,
    borderColor: '#FFC700',
  },
  enrollmentContainer: {
    position: 'absolute',
    top: 570, // Adjust this value to move the container up or down
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  enrollButton: {
    backgroundColor: '#FFC700',
    padding: 15,
    paddingHorizontal: 100,
    borderRadius: 10,
  },
  enrollButtonText: {
    color: '#000',
    fontSize: 16,
    textAlign: 'center',
  },
  selectedSubjectTitle: {
    marginBottom: 10,
  },
  viewTutorsButton: {
    backgroundColor: '#FFC700',
    marginTop: 40,
    padding: 15,
    paddingHorizontal: 100,
    borderRadius: 10,
  },
  viewTutorsText: { color: '#000', textAlign: 'center', fontSize: 15 },
  tutorsContainer: { marginTop: 20 },
  tutorCard: { padding: 10, backgroundColor: '#f9f9f9', marginBottom: 10 },
  tutorName: { fontSize: 16, fontWeight: 'bold' },
  tutorEmail: { fontSize: 14, color: '#555' },
  bottomNav: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 10, borderTopWidth: 1, borderTopColor: '#f1f1f1' },
});

export default SubjectTutorsPage;
