import axios from 'axios';
import config from './../constants/config';

export const getSearchesCount = async function () {
  const requestUrl = encodeURI(config.cloundFunctionsBaseUrl + '/searches');

  const searchesCount = await axios.get(requestUrl);
  return searchesCount;
};

export const incrementSearchesCount = async function () {
  const requestUrl = encodeURI(config.cloundFunctionsBaseUrl + '/searches');

  const searchesCount = await axios.post(requestUrl);
  return searchesCount.status == 200;
};