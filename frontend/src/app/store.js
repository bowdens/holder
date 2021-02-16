import { configureStore } from '@reduxjs/toolkit';
import bagReducer from '../features/bag/bagSlice';
import srdItemsReducer from '../features/srdItems/srdItemsSlice';
import authReducer from '../features/auth/authSlice';
import toastsReducer from "../features/toasts/toastsSlice";
import editableReducer from "../features/editable/editableSlice";

import apiCaller from './apiCaller';

export default configureStore({
  reducer: {
    bag: bagReducer,
    srdItems: srdItemsReducer,
    auth: authReducer,
    toasts: toastsReducer,
    editable: editableReducer
  },
  middleware: [apiCaller]
});
