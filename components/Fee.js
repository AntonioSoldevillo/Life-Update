import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';

const Fee = ({ route, navigation }) => {
  const { bookingDate, tutorName, tuteeEmail, bookingFee } = route.params;
  const [paymentOption, setPaymentOption] = useState('Gcash');

  const handleConfirmPayment = () => {
    // Handle payment confirmation here
    // Example of payment success:
    Alert.alert('Payment Successful', 'Your booking has been confirmed.', [
      { text: 'OK', onPress: () => navigation.goBack() },
    ]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Payment for {tutorName}</Text>
      <Text style={styles.details}>Booking Date: {bookingDate}</Text>
      <Text style={styles.details}>Fee: ₱{bookingFee}</Text>

      {/* Payment options */}
      <Text style={styles.paymentTitle}>Choose Payment Option:</Text>
      <TouchableOpacity
        style={[styles.paymentOptionButton, paymentOption === 'Gcash' && styles.selectedOption]}
        onPress={() => setPaymentOption('Gcash')}
      >
        <Text style={styles.paymentOptionText}>Gcash</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.paymentOptionButton, paymentOption === 'Bank Transfer' && styles.selectedOption]}
        onPress={() => setPaymentOption('Bank Transfer')}
      >
        <Text style={styles.paymentOptionText}>Bank Transfer</Text>
      </TouchableOpacity>

      {/* Confirm Payment Button */}
      <TouchableOpacity style={styles.confirmButton} onPress={handleConfirmPayment}>
        <Text style={styles.buttonText}>Confirm Payment</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  details: {
    fontSize: 16,
    marginTop: 10,
  },
  paymentTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 30,
  },
  paymentOptionButton: {
    padding: 15,
    backgroundColor: '#f8f9fa',
    marginVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  selectedOption: {
    backgroundColor: '#28a745', // Green for selected
  },
  paymentOptionText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  confirmButton: {
    marginTop: 20,
    backgroundColor: '#003366',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default Fee;
