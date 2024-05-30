import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { getCharacter } from '../services/api';

const CharacterDetails = ({ route }) => {
  const { id } = route.params;
  const [character, setCharacter] = useState(null);

  useEffect(() => {
    fetchCharacter(id);
  }, [id]);

  const fetchCharacter = async (characterId) => {
    try {
      const response = await getCharacter(characterId);
      setCharacter(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      {character && (
        <View style={styles.card}>
          <View style={styles.details}>
            <Text style={styles.name}>{character.name}</Text>
            <Text style={styles.text}>Status: {character.status}</Text>
            <Text style={styles.text}>Species: {character.species}</Text>
            <Text style={styles.text}>Gender: {character.gender}</Text>
            <Text style={styles.text}>Origin: {character.origin.name}</Text>
            <Text style={styles.text}>Location: {character.location.name}</Text>
          </View>
          <Image source={{ uri: character.image }} style={styles.image} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    flexDirection: 'row',
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  details: {
    flex: 1,
    justifyContent: 'center',
  },
  name: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  text: {
    fontSize: 18,
    marginBottom: 5,
  },
  image: {
    width: 150,
    height: 150,
    borderRadius: 10,
    marginLeft: 20,
  },
});

export default CharacterDetails;
