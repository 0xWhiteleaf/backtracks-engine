import { getGlobal as _getGlobal, setGlobal as _setGlobal } from 'reactn';
import config from './../constants/config';

const LOCAL_STORAGE_KEY = config.localStorageKey;

const defaultState = {
    isLogged: false,
    user: null
};

const parseState = (str) => {
    try {
        const state = JSON.parse(str || '');
        if (typeof state.isLogged !== 'boolean') throw new Error();
        if (typeof state.user.id !== 'string') throw new Error();
        if (typeof state.user.phoneNumber !== 'string') throw new Error();
        return state;
    } catch (e) {
        return null;
    }
};
const stateFromStorage = parseState(localStorage.getItem(LOCAL_STORAGE_KEY));
const initialState = stateFromStorage || defaultState;

export const initGlobal = function () {
    setGlobal(initialState, (stateFromStorage == null));
};

export const setGlobal = function (state, writeToLocalStorage = true) {
    _setGlobal(state);

    if (writeToLocalStorage)
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(_getGlobal()));
};