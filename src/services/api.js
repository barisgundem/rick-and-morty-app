import axios from 'axios';

const BASE_URL = 'https://rickandmortyapi.com/api';

export const getEpisodes = (page = 1) => {
  return axios.get(`${BASE_URL}/episode?page=${page}`);
};

export const getAllEpisodes = async () => {
  let episodes = [];
  let page = 1;
  let response;

  do {
    response = await axios.get(`${BASE_URL}/episode?page=${page}`);
    episodes = [...episodes, ...response.data.results];
    page++;
  } while (response.data.info.next);

  return episodes;
};

export const getEpisode = (id) => {
  return axios.get(`${BASE_URL}/episode/${id}`);
};

export const getCharacter = (id) => {
  return axios.get(`${BASE_URL}/character/${id}`);
};

export const getEpisodesBySeason = (season) => {
  const seasonEndpoints = {
    1: '1,2,3,4,5,6,7,8,9,10,11',
    2: '12,13,14,15,16,17,18,19,20,21',
    3: '22,23,24,25,26,27,28,29,30,31',
    4: '32,33,34,35,36,37,38,39,40,41',
    5: '42,43,44,45,46,47,48,49,50,51',
  };

  const ids = seasonEndpoints[season];
  return axios.get(`${BASE_URL}/episode/${ids}`);
};

export const getAllCharacters = async () => {
  let characters = [];
  let page = 1;
  let response;

  do {
    response = await axios.get(`${BASE_URL}/character?page=${page}`);
    characters = [...characters, ...response.data.results];
    page++;
  } while (response.data.info.next);

  return characters;
};
