import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import patientService from './patientService';

export const fetchMyRequests = createAsyncThunk('patient/fetchRequests', async (_, thunkAPI) => {
    try { return await patientService.fetchMyRequests(); }
    catch (err) { return thunkAPI.rejectWithValue(err.response?.data?.message || err.message); }
});

export const createRequest = createAsyncThunk('patient/createRequest', async (data, thunkAPI) => {
    try { return await patientService.createRequest(data); }
    catch (err) { return thunkAPI.rejectWithValue(err.response?.data?.message || err.message); }
});

export const cancelRequest = createAsyncThunk('patient/cancelRequest', async (id, thunkAPI) => {
    try { return await patientService.cancelRequest(id); }
    catch (err) { return thunkAPI.rejectWithValue(err.response?.data?.message || err.message); }
});

export const completeRequest = createAsyncThunk('patient/completeRequest', async (id, thunkAPI) => {
    try { return await patientService.completeRequest(id); }
    catch (err) { return thunkAPI.rejectWithValue(err.response?.data?.message || err.message); }
});

export const fetchBloodStock = createAsyncThunk('patient/fetchBloodStock', async (_, thunkAPI) => {
    try { return await patientService.fetchBloodStock(); }
    catch (err) { return thunkAPI.rejectWithValue(err.response?.data?.message || err.message); }
});

const patientSlice = createSlice({
    name: 'patient',
    initialState: {
        requests: [],
        bloodStock: [],
        isLoading: false,
        isError: false,
        isSuccess: false,
        message: '',
    },
    reducers: {
        resetPatient: (state) => { state.isLoading = false; state.isError = false; state.isSuccess = false; state.message = ''; },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchMyRequests.pending, (s) => { s.isLoading = true; })
            .addCase(fetchMyRequests.fulfilled, (s, a) => { s.isLoading = false; s.requests = a.payload; })
            .addCase(fetchMyRequests.rejected, (s, a) => { s.isLoading = false; s.isError = true; s.message = a.payload; })

            .addCase(createRequest.pending, (s) => { s.isLoading = true; })
            .addCase(createRequest.fulfilled, (s, a) => { s.isLoading = false; s.isSuccess = true; s.requests = [a.payload, ...s.requests]; })
            .addCase(createRequest.rejected, (s, a) => { s.isLoading = false; s.isError = true; s.message = a.payload; })

            .addCase(cancelRequest.fulfilled, (s, a) => {
                s.requests = s.requests.map(r => r._id === a.payload.request._id ? a.payload.request : r);
            })

            .addCase(completeRequest.fulfilled, (s, a) => {
                s.requests = s.requests.map(r => r._id === a.payload.request._id ? a.payload.request : r);
            })

            .addCase(fetchBloodStock.fulfilled, (s, a) => { s.bloodStock = a.payload; });
    },
});

export const { resetPatient } = patientSlice.actions;
export default patientSlice.reducer;
