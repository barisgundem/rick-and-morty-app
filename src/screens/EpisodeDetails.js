import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image } from 'react-native';
import axios from 'axios';
import { Icon } from 'react-native-elements';
import { useDispatch, useSelector } from 'react-redux';
import { addFavorite, removeFavorite } from '../redux/favoritesSlice';
import Toast from 'react-native-toast-message';
import { getEpisode } from '../services/api';

const EpisodeDetails = ({ route, navigation }) => {
  const { id } = route.params;
  const [episode, setEpisode] = useState(null);
  const [characters, setCharacters] = useState([]);
  const dispatch = useDispatch();
  const favorites = useSelector((state) => state.favorites.favorites);

  useEffect(() => {
    fetchEpisode(id);
  }, [id]);

  const fetchEpisode = async (episodeId) => {
    try {
      const response = await getEpisode(episodeId);
      setEpisode(response.data);
      fetchCharacters(response.data.characters);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchCharacters = async (characterUrls) => {
    try {
      const charactersData = await Promise.all(characterUrls.map(url => axios.get(url)));
      setCharacters(charactersData.map(res => res.data));
    } catch (error) {
      console.error(error);
    }
  };

  const handleFavoriteToggle = (character) => {
    if (favorites.some((fav) => fav.id === character.id)) {
      dispatch(removeFavorite(character.id));
    } else {
      if (favorites.length < 10) {
        dispatch(addFavorite(character));
      } else {
        Toast.show({
          type: 'error',
          text1: 'Favori karakter ekleme sayısını aştınız. Başka bir karakteri favorilerden çıkarmalısınız.',
        });
      }
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => navigation.navigate('CharacterDetails', { id: item.id })} style={styles.characterItem}>
      <Image source={{ uri: item.image }} style={styles.characterImage} />
      <Text style={styles.characterName}>{item.name}</Text>
      <TouchableOpacity onPress={() => handleFavoriteToggle(item)} style={styles.starIcon}>
        <Icon
          name="star"
          type="font-awesome"
          color={favorites.some((fav) => fav.id === item.id) ? 'gold' : 'gray'}
          size={15}
        />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {episode && (
        <>
          <View style={styles.header}>
            <View style={styles.infoContainer}>
              <Text style={styles.title}>{episode.name}</Text>
              <Text style={styles.detail}>Air Date: {episode.air_date}</Text>
              <Text style={styles.detail}>Season: {episode.episode.split('E')[0].replace('S', '')}</Text>
              <Text style={styles.detail}>Episode: {episode.episode.split('E')[1]}</Text>
            </View>
            <Image source={require('../../assets/rickandmorty.png')} style={styles.image} />
          </View>
          <Text style={styles.characterHeader}>Characters:</Text>
          <FlatList
            data={characters}
            renderItem={renderItem}
            keyExtractor={item => item.id.toString()}
            numColumns={2}
            contentContainerStyle={styles.characterList}
            style={styles.characterFlatList}
          />
        </>
      )}
      <Toast ref={(ref) => Toast.setRef(ref)} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#f0f0f0',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  infoContainer: {
    flex: 1,
    marginRight: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  detail: {
    fontSize: 16,
    marginBottom: 5,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 25,
  },
  characterHeader: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  characterList: {
    flexDirection: 'column',
  },
  characterItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 10,
    margin: 5,
    position: 'relative',
  },
  characterImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  characterName: {
    fontSize: 16,
    flexShrink: 1,
  },
  starIcon: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  characterFlatList: {
    maxHeight: 400,
  },
});

export default EpisodeDetails;
