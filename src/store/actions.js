import { BehaviorSubject } from 'rxjs';
import getData from '../util/getData';

import {
  SET_SCREEN,
  SET_HOVER,
  SET_BRUSH,
  SET_CRITERIA,
  SET_CURRENCY,
  SET_COIN,
  REQUEST_HISTORY,
  REQUEST_HISTORY_PENDING,
  REQUEST_HISTORY_SUCCESS,
  REQUEST_HISTORY_FAILED,
  REQUEST_INFOS,
  REQUEST_INFOS_PENDING,
  REQUEST_INFOS_SUCCESS,
  REQUEST_INFOS_FAILED,
} from './constants';

// export const requestData = () => dispatch => {
//   dispatch({
//     type: REQUEST_DATA,
//   });
//   getData('GET_ALL').subscribe(
//     data => dispatch({ type: REQUEST_KANJIS_SUCCESS, payload: data }),
//     err => dispatch({ type: REQUEST_KANJIS_FAILED, payload: err })
//   );
// };

export const setScreen = ({ width, height }) => ({
  type: SET_SCREEN,
  payload: { width, height },
});

export const setHover = hover => ({
  type: SET_HOVER,
  payload: hover,
});

export const setBrush = brush => ({
  type: SET_BRUSH,
  payload: brush,
});

export const setCriteria = criteria => ({
  type: SET_CRITERIA,
  payload: criteria,
});

export const setCurrency = currency => ({
  type: SET_CURRENCY,
  payload: currency,
});

export const setCoin = coin => ({
  type: SET_COIN,
  payload: coin,
});

export const requestHistory = params => dispatch => {
  dispatch({
    type: REQUEST_HISTORY_PENDING,
  });

  getData(REQUEST_HISTORY, params).subscribe(
    data => dispatch({ type: REQUEST_HISTORY_SUCCESS, payload: data }),
    err => dispatch({ type: REQUEST_HISTORY_FAILED, payload: err })
  );
};

const subject = new BehaviorSubject(null);
export const infos$ = subject.asObservable();

export const requestInfos = () => dispatch => {
  dispatch({
    type: REQUEST_INFOS_PENDING,
  });

  getData(REQUEST_INFOS).subscribe(
    data => {
      dispatch({ type: REQUEST_INFOS_SUCCESS, payload: data });
      subject.next(data);
    },
    err => dispatch({ type: REQUEST_INFOS_FAILED, payload: err })
  );
};
