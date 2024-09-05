import { combineReducers, configureStore } from '@reduxjs/toolkit';
import authSlice from './authSlice.js'; // Import your slices
import postSlice from "./postSlice.js" // Import your slices
import socketSlice from "./socketSlice.js" // Import your slices
import chatSlice from "./chatSlice.js" // Import your slices
import RTNSlice from "./RTNSlice.js" // Import your slices
import {
  persistReducer, FLUSH,REHYDRATE, PAUSE, PERSIST,PURGE,REGISTER} from 'redux-persist'
import storage from 'redux-persist/lib/storage'

const persistConfig = {
  key: 'root',
  version: 1,
  storage,
}
const rootReducer = combineReducers({
  auth: authSlice,
  post: postSlice,
  socketio:socketSlice,
  chat:chatSlice,
  realTimeNotification:RTNSlice
})

const persistedReducer = persistReducer(persistConfig, rootReducer)


const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export default store;
