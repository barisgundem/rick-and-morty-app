import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image, Dimensions, SafeAreaView } from 'react-native';
import { SearchBar, Icon } from 'react-native-elements';
import { getAllEpisodes } from '../services/api'; // Updated import
import Pagination from '../components/Pagination';

const { height, width } = Dimensions.get('window');
const ITEMS_PER_PAGE = height < 800 ? 6 : 8;

const MainScreen = ({ navigation }) => {
  const [episodes, setEpisodes] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchEpisodes();
  }, []);

  const fetchEpisodes = async () => {
    try {
      const allEpisodes = await getAllEpisodes(); // Fetch all episodes
      setEpisodes(allEpisodes);
      setCurrentPage(1); // Reset to the first page
    } catch (error) {
      console.error(error);
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const getPaginatedData = () => {
    const filteredEpisodes = episodes.filter(episode =>
      episode.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return filteredEpisodes.slice(startIndex, endIndex);
  };

  const truncateText = (text, length) => {
    return text.length > length ? `${text.substring(0, length)}...` : text;
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.card} 
      onPress={() => navigation.navigate('EpisodeDetails', { id: item.id })}
    >
      <Image source={require('../../assets/rickandmorty.png')} style={styles.image} />
      <Text style={styles.title}>{truncateText(item.name, 21)}</Text>
      <Text style={styles.episode}>{item.episode}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.searchRow}>
          <SearchBar
            placeholder="Search..."
            onChangeText={handleSearch}
            value={searchQuery}
            containerStyle={styles.searchContainer}
            inputContainerStyle={styles.searchInput}
          />
          <Icon
            name="menu"
            type="material"
            color="#000"
            size={32}
            onPress={() => navigation.openDrawer()}
            containerStyle={styles.menuIcon}
          />
        </View>
        <FlatList
          data={getPaginatedData()}
          renderItem={renderItem}
          keyExtractor={item => item.id.toString()}
          numColumns={2}
          columnWrapperStyle={styles.row}
        />
        <Pagination 
          currentPage={currentPage} 
          totalPages={Math.ceil(episodes.length / ITEMS_PER_PAGE)} 
          onPageChange={setCurrentPage} 
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#f0f0f0',
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  searchContainer: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    borderBottomColor: 'transparent',
    borderTopColor: 'transparent',
    padding: 0,
  },
  searchInput: {
    backgroundColor: '#fff',
    borderRadius: 8,
    height: 40,
  },
  menuIcon: {
    marginLeft: 10,
  },
  row: {
    justifyContent: 'space-between',
  },
  card: {
    flex: 1,
    margin: 5,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 8,
    elevation: 3,
    alignItems: 'center',
  },
  image: {
    width: width * 0.2,
    height: width * 0.2,
    marginBottom: 10,
    borderRadius: 16,
  },
  title: {
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  episode: {
    fontSize: 12.5,
    color: '#666',
  },
});

export default MainScreen;
