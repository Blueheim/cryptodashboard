import { scaleOrdinal } from 'd3-scale';

import {
  SET_HOVER,
  SET_SCREEN,
  SET_BRUSH,
  SET_CRITERIA,
  SET_CURRENCY,
  SET_COIN,
  REQUEST_HISTORY_PENDING,
  REQUEST_HISTORY_SUCCESS,
  REQUEST_HISTORY_FAILED,
  REQUEST_INFOS_PENDING,
  REQUEST_INFOS_SUCCESS,
  REQUEST_INFOS_FAILED,
} from './constants';

// const initialStateSearch = {
//   searchField: '',
// };

// export const searchKanjis = (state = initialStateSearch, action = {}) => {
//   switch (action.type) {
//     case CHANGE_SEARCH_FIELD:
//       return { ...state, searchField: action.payload };
//     default:
//       return state;
//   }
// };

const initialStateData = {
  history: null,
  infos: null,
  isPendingHistory: true,
  isPendingInfos: true,
  filteredData: [],
  colorScale: scaleOrdinal().range(['#203D69', '#FF784F', '#FFBA08', '#7BD389', '#0090C1']),
  criteria: 'close',
  currency: 'USD',
  coin: 'BTC',
  error: null,
};

const initialStateScreen = {
  width: 1000,
  height: 500,
};

export const screen = (state = initialStateScreen, action = {}) => {
  switch (action.type) {
    case SET_SCREEN:
      return { ...state, ...action.payload };
    default:
      return state;
  }
};

const initialStateHover = {
  hover: 'none',
};

export const hover = (state = initialStateHover, action = {}) => {
  switch (action.type) {
    case SET_HOVER:
      return { ...state, hover: action.payload };
    default:
      return state;
  }
};

const initialStateBrush = {
  brushExtent: [0, 40],
};

export const brush = (state = initialStateBrush, action = {}) => {
  switch (action.type) {
    case SET_BRUSH:
      return { ...state, brushExtent: action.payload };
    default:
      return state;
  }
};

export const data = (state = initialStateData, action = {}) => {
  switch (action.type) {
    case REQUEST_HISTORY_PENDING:
      return { ...state, isPendingHistory: true };
    case REQUEST_HISTORY_SUCCESS:
      return { ...state, history: action.payload, isPendingHistory: false };
    case REQUEST_HISTORY_FAILED:
      return { ...state, error: action.payload, isPendingHistory: false };
    case REQUEST_INFOS_PENDING:
      return { ...state, isPendingInfos: true };
    case REQUEST_INFOS_SUCCESS:
      return { ...state, infos: action.payload, isPendingInfos: false };
    case REQUEST_INFOS_FAILED:
      return { ...state, error: action.payload, isPendingInfos: false };
    case SET_CRITERIA:
      return { ...state, criteria: action.payload };
    case SET_CURRENCY:
      return { ...state, currency: action.payload };
    case SET_COIN:
      return { ...state, coin: action.payload };
    default:
      return state;
  }
};
