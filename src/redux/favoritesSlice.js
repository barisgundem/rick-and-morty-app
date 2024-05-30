import { createSlice } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

const initialState = {
  favorites: [],
};

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    setFavorites(state, action) {
      state.favorites = action.payload;
    },
    addFavorite(state, action) {
      if (state.favorites.length < 10) {
        state.favorites.push(action.payload);
        AsyncStorage.setItem('favorites', JSON.stringify(state.favorites));
      }
    },
    removeFavorite(state, action) {
      state.favorites = state.favorites.filter(fav => fav.id !== action.payload);
      AsyncStorage.setItem('favorites', JSON.stringify(state.favorites));
    },
  },
});

export const { setFavorites, addFavorite, removeFavorite } = favoritesSlice.actions;
export default favoritesSlice.reducer;
