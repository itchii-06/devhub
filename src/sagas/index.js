// @flow

import { AsyncStorage } from 'react-native';
import { takeLatest } from 'redux-saga';
import { fork } from 'redux-saga/effects';

import {
  CLEAR_APP_DATA,
} from '../utils/constants/actions';

import authSagas from './auth';
import subscriptionsSagas from './subscriptions';

function* clearAppData() {
  try {
    yield AsyncStorage.clear();
  } catch (e) {
    console.error(e);
  }
}

export default function* () {
  return yield [
    yield takeLatest(CLEAR_APP_DATA, clearAppData),
    yield fork(authSagas),
    yield fork(subscriptionsSagas),
  ];
}