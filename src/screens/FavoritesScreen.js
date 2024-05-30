import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image, Dimensions, Modal, Button } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { removeFavorite } from '../redux/favoritesSlice';
import { Icon } from 'react-native-elements';

const FavoritesScreen = ({ navigation }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCharacterId, setSelectedCharacterId] = useState(null);

  const favorites = useSelector((state) => state.favorites.favorites);
  const dispatch = useDispatch();

  const handleRemoveFavorite = (id) => {
    setSelectedCharacterId(id);
    setModalVisible(true);
  };

  const confirmRemoveFavorite = () => {
    if (selectedCharacterId !== null) {
      dispatch(removeFavorite(selectedCharacterId));
      setSelectedCharacterId(null);
      setModalVisible(false);
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => navigation.navigate('CharacterDetails', { id: item.id })} style={styles.characterItem}>
      <Image source={{ uri: item.image }} style={styles.characterImage} />
      <Text style={styles.characterName}>{item.name}</Text>
      <TouchableOpacity onPress={() => handleRemoveFavorite(item.id)} style={styles.trashIcon}>
        <Icon name="trash" type="font-awesome" color="red" size={20} />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const { height } = Dimensions.get('window');

  return (
    <View style={styles.container}>
      {favorites.length === 0 ? (
        <Text style={styles.noFavoritesText}>Visit the characters page to add them to your favorites.</Text>
      ) : (
        <FlatList
          data={favorites}
          renderItem={renderItem}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={styles.characterList}
          style={[styles.characterFlatList, { maxHeight: height * 0.7 }]}
        />
      )}

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Are you sure you want to remove from favorites?</Text>
            <View style={styles.modalButtons}>
              <Button title="Cancel" onPress={() => setModalVisible(false)} />
              <Button title="Yes" onPress={confirmRemoveFavorite} />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center', 
    alignItems: 'center',     
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
  trashIcon: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  characterFlatList: {
    flex: 1,
  },
  noFavoritesText: {
    fontSize: 18,
    color: 'gray',
    textAlign: 'center',  
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
  },
});

export default FavoritesScreen;
