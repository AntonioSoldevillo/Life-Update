import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons'; // Import Ionicons for back arrow
import supabase from '../src/supabaseClient'; // Import Supabase client
import { Rating } from 'react-native-ratings'; // Import rating component

const SubjectTutorsPage = () => {
  const [subjects, setSubjects] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [tutors, setTutors] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation();

  const fetchSubjects = async () => {
    try {
      const { data, error } = await supabase.from('subjects').select('*');
      if (error) throw error;
      setSubjects(data);
    } catch (error) {
      console.error('Error fetching subjects:', error.message);
    }
  };

  const fetchTutors = async (subjectId) => {
    setSelectedSubject(subjects.find((subject) => subject.subject_id === subjectId));
    setIsLoading(true);
    setTutors([]);

    try {
      const { data: tutorSubjectData, error } = await supabase
        .from('tutor_subjects')
        .select('tutor_id')
        .eq('subject_id', subjectId);

      if (error) throw error;

      const tutorIds = tutorSubjectData.map(item => item.tutor_id);

      if (tutorIds.length > 0) {
        const { data: tutorDetails, error: tutorError } = await supabase
          .from('tutors')
          .select('tutor_id, user_id')
          .in('tutor_id', tutorIds);

        if (tutorError) throw tutorError;

        const userIds = tutorDetails.map(item => item.user_id);
        if (userIds.length > 0) {
          const { data: userDetails, error: userError } = await supabase
            .from('users')
            .select('id, full_name, email')
            .in('id', userIds);

          if (userError) throw userError;

          const formattedTutors = tutorDetails.map((tutor) => ({
            tutor_id: tutor.tutor_id,
            full_name: userDetails.find((user) => user.id === tutor.user_id).full_name,
            email: userDetails.find((user) => user.id === tutor.user_id).email,
            rating: 5, // Default rating value (5 stars)
          }));

          setTutors(formattedTutors);
        }
      }
    } catch (error) {
      console.error('Error fetching tutors:', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSubjects();
  }, []);

  const filteredSubjects = subjects.filter(subject =>
    subject.subject_name.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <View style={styles.container}>
      {/* Back Arrow Icon */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={24} color="#003366" />
      </TouchableOpacity>

      {/* Header */}
      <Text style={styles.headerTitle}>IT Subjects</Text>

      {/* Search Bar */}
      <TextInput
        style={styles.searchBar}
        placeholder="Search subjects..."
        value={searchText}
        onChangeText={setSearchText}
      />

      {/* Subject Buttons */}
      <View style={styles.subjectsContainer}>
        {filteredSubjects.map((subject) => (
          <TouchableOpacity
            key={subject.subject_id}
            style={styles.subjectButton}
            onPress={() => fetchTutors(subject.subject_id)}
          >
            <Text style={styles.subjectButtonText}>{subject.subject_name}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Tutors Section */}
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
                  <Rating
                    type="star"
                    ratingCount={5}
                    imageSize={20}
                    startingValue={tutor.rating}
                    readonly
                    style={styles.rating}
                  />
                  <TouchableOpacity
                    style={styles.viewProfileButton}
                    onPress={() => navigation.navigate('TutorProfile', { tutorId: tutor.tutor_id })}
                  >
                    <Text style={styles.viewProfileButtonText}>View Tutor Profile</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.bookButton}
                    onPress={() => navigation.navigate('SchedulePage', { tutorId: tutor.tutor_id })}
                  >
                    <Text style={styles.bookButtonText}>Book Tutor</Text>
                  </TouchableOpacity>
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
       {/* Bottom Navigation */}
       <View style={styles.bottomNav}>
        <TouchableOpacity onPress={() => navigation.navigate('Dashboard')}>
          <Ionicons name="home-outline" size={24} color="#808080" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('TuteeProfile')}>
          <Ionicons name="person-outline" size={24} color="#808080" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Subjects')}>
          <Ionicons name="book-outline" size={24} color="#003366" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Messages')}>
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
    backgroundColor: '#fff',
    padding: 20,
    marginTop: 30,
  },
  backButton: {
    position: 'absolute',
    top: 25,
    left: 20,
    zIndex: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#003366',
    marginBottom: 20,
    textAlign: 'center',
  },
  searchBar: {
    height: 40,
    borderColor: '#003366',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 15,
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
    textAlign: 'center', // Centers the tutor's name
  },
  tutorEmail: {
    fontSize: 14,
    color: '#808080',
      textAlign: 'center'
  },
  rating: {
    marginVertical: 5,
  },
  bookButton: {
    marginTop: 10,
    backgroundColor: '#003366',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  bookButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  viewProfileButton: {
    marginTop: 10,
    backgroundColor: '#003366',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  viewProfileButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  noTutorsText: {
    fontSize: 16,
    color: '#808080',
    textAlign: 'center',
    marginTop: 20,
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

export default SubjectTutorsPage;
