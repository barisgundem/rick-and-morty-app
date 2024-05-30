import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image, Dimensions } from 'react-native';
import { getAllCharacters } from '../services/api';
import { SearchBar, Icon } from 'react-native-elements';
import { useDispatch, useSelector } from 'react-redux';
import { addFavorite, removeFavorite } from '../redux/favoritesSlice';
import Toast from 'react-native-toast-message';

const AllCharactersScreen = ({ navigation }) => {
  const [characters, setCharacters] = useState([]);
  const [search, setSearch] = useState('');
  const [filteredCharacters, setFilteredCharacters] = useState([]);
  const dispatch = useDispatch();
  const favorites = useSelector((state) => state.favorites.favorites);

  useEffect(() => {
    fetchCharacters();
  }, []);

  const fetchCharacters = async () => {
    try {
      const charactersData = await getAllCharacters();
      setCharacters(charactersData);
      setFilteredCharacters(charactersData); // Initialize with all characters
    } catch (error) {
      console.error(error);
    }
  };

  const updateSearch = (searchText) => {
    setSearch(searchText);
    if (searchText) {
      const filteredData = characters.filter((character) =>
        character.name.toLowerCase().includes(searchText.toLowerCase())
      );
      setFilteredCharacters(filteredData);
    } else {
      setFilteredCharacters(characters);
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

  const { height } = Dimensions.get('window');

  return (
    <View style={styles.container}>
      <SearchBar
        placeholder="Search Characters..."
        onChangeText={updateSearch}
        value={search}
        lightTheme
        round
        containerStyle={styles.searchContainer}
        inputContainerStyle={styles.searchInputContainer}
      />
      <FlatList
        data={filteredCharacters}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
        numColumns={2}
        contentContainerStyle={styles.characterList}
        style={[styles.characterFlatList, { maxHeight: height * 0.7 }]}
      />
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
  searchContainer: {
    backgroundColor: 'transparent',
    borderBottomColor: 'transparent',
    borderTopColor: 'transparent',
  },
  searchInputContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
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
    flex: 1,
  },
});

export default AllCharactersScreen;
