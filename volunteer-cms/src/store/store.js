import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './cartSlice';
import navigationReducer from './navigationSlice';
import fileReducer from './fileSlice';
import adminReducer from './adminSlice';
import activityReducer from './activitySlice';
import userReducer from './userSlice';  
import categoryReducer from './categorySlice';
import activityDashboardReducer from './activityDashboardSlice';

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    navigation: navigationReducer,
    file: fileReducer,
    admin: adminReducer,
    activities: activityReducer,
    users: userReducer,  
    categories: categoryReducer,
    activityDashboard: activityDashboardReducer,
  },
});