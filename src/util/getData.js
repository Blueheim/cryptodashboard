import { from } from 'rxjs';
import httpObservable from 'simplehttpobservable';
import { REQUEST_HISTORY, REQUEST_INFOS } from '../store/constants';
import infos from '../data/history/metadata/info_final.json';
import history from '../data/history/daily/daily_data.json';

const mocks = {
  [REQUEST_HISTORY]: history,
  [REQUEST_INFOS]: infos,
};

const endpoints = {
  [REQUEST_HISTORY]: `${process.env.REACT_APP_API_URL}/api/cryptostat/daily-history`,
  [REQUEST_INFOS]: `${process.env.REACT_APP_API_URL}/api/cryptostat/top-by-market`,
};

const getEndpoint = endpointName => {
  return endpoints[endpointName];
};

const getMock = mockName => {
  return mocks[mockName];
};

const getData = (name, params = null) => {
  if (process.env.REACT_APP_MOCK) {
    const data = getMock(name) || [];
    return from([data]);
  } else {
    return httpObservable(getEndpoint(name), params);
  }
};

export default getData;
