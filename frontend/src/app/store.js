import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import patientReducer from '../features/patient/patientSlice';
import donorReducer from '../features/donor/donorSlice';
import adminReducer from '../features/admin/adminSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        patient: patientReducer,
        donor: donorReducer,
        admin: adminReducer,
    },
});
