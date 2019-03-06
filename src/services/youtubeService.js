import axios from 'axios';
import config from './../constants/config';

export const getSearchResults = async function (keywords) {
  const requestUrl = encodeURI(config.youtubeApiBaseUrl + '/search'
    + '?part=snippet&type=video&maxResults=' + config.youtubeResultsLimit + '&q=' + keywords + '&key=' + config.youtubeApiKey);

  const results = await axios.get(requestUrl);
  return results;
};

export const getVideoDetails = async function (id) {
  const requestUrl = encodeURI(config.youtubeApiBaseUrl + '/videos'
    + '?part=snippet,contentDetails,statistics&id=' + id + '&key=' + config.youtubeApiKey);

  const details = await axios.get(requestUrl);
  return details;
};

export const getVideosList = async function (ids) {
  const requestUrl = encodeURI(config.youtubeApiBaseUrl + '/videos'
    + '?part=snippet&id=' + ids + '&key=' + config.youtubeApiKey);

  const list = await axios.get(requestUrl);
  return list;
};