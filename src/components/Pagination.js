import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={[styles.button, currentPage === 1 && styles.disabledButton]} 
        onPress={handlePrevious} 
        disabled={currentPage === 1}
      >
        <Text style={styles.buttonText}>Previous</Text>
      </TouchableOpacity>
      <Text style={styles.pageInfo}>{currentPage} / {totalPages}</Text>
      <TouchableOpacity 
        style={[styles.button, currentPage === totalPages && styles.disabledButton]} 
        onPress={handleNext} 
        disabled={currentPage === totalPages}
      >
        <Text style={styles.buttonText}>Next</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#007BFF',
    borderRadius: 8,
    marginHorizontal: 10,
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  pageInfo: {
    alignSelf: 'center',
    fontSize: 16,
  },
});

export default Pagination;
