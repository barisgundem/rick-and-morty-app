import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import { Provider, useDispatch } from 'react-redux';
import { TouchableOpacity } from 'react-native';
import { Icon } from 'react-native-elements';
import store from './src/redux/store';
import MainScreen from './src/screens/MainScreen';
import EpisodeDetails from './src/screens/EpisodeDetails';
import CharacterDetails from './src/screens/CharacterDetails';
import AllCharactersScreen from './src/screens/AllCharactersScreen';
import FavoritesScreen from './src/screens/FavoritesScreen';
import CustomDrawerContent from './src/components/CustomDrawerContent';
import { setFavorites } from './src/redux/favoritesSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

const MainStack = () => (
  <Stack.Navigator initialRouteName="Main">
    <Stack.Screen name="Main" component={MainScreen} options={{ headerShown: false }} />
    <Stack.Screen name="EpisodeDetails" component={EpisodeDetails} options={{ title: 'Episode Details' }} />
    <Stack.Screen name="CharacterDetails" component={CharacterDetails} options={{ title: 'Character Details' }} />
  </Stack.Navigator>
);

const CharactersStack = ({ navigation }) => (
  <Stack.Navigator initialRouteName="AllCharacters">
    <Stack.Screen 
      name="AllCharacters" 
      component={AllCharactersScreen} 
      options={{ 
        title: 'Characters',
        headerLeft: () => (
          <TouchableOpacity onPress={() => navigation.navigate('Main')}>
            <Icon name="arrow-left" type="font-awesome" size={24} style={{ marginLeft: 15 }} />
          </TouchableOpacity>
        )
      }} 
    />
    <Stack.Screen name="CharacterDetails" component={CharacterDetails} options={{ title: 'Character Details' }} />
  </Stack.Navigator>
);

const FavoritesStack = ({ navigation }) => (
  <Stack.Navigator initialRouteName="Favorites">
    <Stack.Screen name="Favorites"
     component={FavoritesScreen}
      options={{ title: 'Favorites',
      headerLeft: () => (
          <TouchableOpacity onPress={() => navigation.navigate('Main')}>
            <Icon name="arrow-left" type="font-awesome" size={24} style={{ marginLeft: 15 }} />
          </TouchableOpacity>
        ) }} />
  </Stack.Navigator>
);

const App = () => {
  useEffect(() => {
    const loadFavorites = async () => {
      const storedFavorites = await AsyncStorage.getItem('favorites');
      if (storedFavorites) {
        dispatch(setFavorites(JSON.parse(storedFavorites)));
      }
    };
    loadFavorites();
  }, []);

  return (
    <Provider store={store}>
      <NavigationContainer>
        <Drawer.Navigator drawerContent={props => <CustomDrawerContent {...props} />}>
          <Drawer.Screen 
            name="Episodes" 
            component={MainStack} 
            options={{
              drawerIcon: ({ color, size }) => (
                <Icon name="tv" type="font-awesome" color={color} size={size} />
              ),
              headerShown: false, 
            }}
          />
          <Drawer.Screen 
            name="Characters" 
            component={CharactersStack} 
            options={{
              drawerIcon: ({ color, size }) => (
                <Icon name="users" type="font-awesome" color={color} size={size} />
              ),
              headerShown: false, 
            }}
          />
          <Drawer.Screen 
            name="Favorites" 
            component={FavoritesStack} 
            options={{
              drawerIcon: ({ color, size }) => (
                <Icon name="star" type="font-awesome" color={color} size={size} />
              ),
              headerShown: false, 
            }}
          />
        </Drawer.Navigator>
      </NavigationContainer>
    </Provider>
  );
};

export default App;
