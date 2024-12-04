import React from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const SubjectPage = ({ navigation }) => {
  const subjects = [
    { title: 'Introduction To Computing', image: require('../assets/computing.jpg') },
    { title: 'Computer Programming 1&2', image: require('../assets/programming.jpg') },
    { title: 'Data Structures & Algorithm', image: require('../assets/datastructure.png') },
    { title: 'Discrete Mathematics', image: require('../assets/discrete.jpg') },
  ];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        {/* Back button to navigate to the Dashboard */}
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back-outline" size={24} color="#003366" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>I need tutor for</Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search-outline" size={20} color="#808080" style={styles.searchIcon} />
        <TextInput placeholder="Search subjects" style={styles.searchInput} />
      </View>

      {/* Subjects List */}
      <ScrollView style={styles.subjectsContainer}>
        {subjects.map((subject, index) => (
          <TouchableOpacity 
            key={index} 
            style={styles.subjectCard} 
            onPress={() => {
              // Passing subject title to the Tutors page
              navigation.navigate('Tutors', { subjectTitle: subject.title });
            }}
          >
            <Image source={subject.image} style={styles.subjectImage} />
            <Text style={styles.subjectTitle}>{subject.title}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity onPress={() => navigation.navigate('Dashboard')}>
          <Ionicons name="home-outline" size={24} color="#003366" />
        </TouchableOpacity>
        <TouchableOpacity>
          <Ionicons name="person-outline" size={24} color="#808080" />
        </TouchableOpacity>
        <TouchableOpacity>
          <Ionicons name="book-outline" size={24} color="#003366" />
        </TouchableOpacity>
        <TouchableOpacity>
          <Ionicons name="chatbubble-outline" size={24} color="#808080" />
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
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 30,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#003366',
    marginLeft: 10,
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

export default SubjectPage;
