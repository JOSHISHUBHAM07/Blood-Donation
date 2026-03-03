import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import donorService from './donorService';

export const fetchAssignedRequests = createAsyncThunk('donor/fetchAssigned', async (_, thunkAPI) => {
    try { return await donorService.fetchAssignedRequests(); }
    catch (err) { return thunkAPI.rejectWithValue(err.response?.data?.message || err.message); }
});

export const fetchDonationHistory = createAsyncThunk('donor/fetchHistory', async (_, thunkAPI) => {
    try { return await donorService.fetchDonationHistory(); }
    catch (err) { return thunkAPI.rejectWithValue(err.response?.data?.message || err.message); }
});

export const scheduleDonation = createAsyncThunk('donor/schedule', async (data, thunkAPI) => {
    try { return await donorService.scheduleDonation(data); }
    catch (err) { return thunkAPI.rejectWithValue(err.response?.data?.message || err.message); }
});

export const completeDonation = createAsyncThunk('donor/complete', async (id, thunkAPI) => {
    try { return await donorService.completeDonation(id); }
    catch (err) { return thunkAPI.rejectWithValue(err.response?.data?.message || err.message); }
});

export const updateAvailability = createAsyncThunk('donor/availability', async (isAvailable, thunkAPI) => {
    try { return await donorService.updateAvailability(isAvailable); }
    catch (err) { return thunkAPI.rejectWithValue(err.response?.data?.message || err.message); }
});

const donorSlice = createSlice({
    name: 'donor',
    initialState: {
        assignedRequests: [],
        donations: [],
        isLoading: false,
        isError: false,
        isSuccess: false,
        message: '',
    },
    reducers: {
        resetDonor: (s) => { s.isLoading = false; s.isError = false; s.isSuccess = false; s.message = ''; },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchAssignedRequests.pending, (s) => { s.isLoading = true; })
            .addCase(fetchAssignedRequests.fulfilled, (s, a) => { s.isLoading = false; s.assignedRequests = a.payload; })
            .addCase(fetchAssignedRequests.rejected, (s, a) => { s.isLoading = false; s.isError = true; s.message = a.payload; })

            .addCase(fetchDonationHistory.pending, (s) => { s.isLoading = true; })
            .addCase(fetchDonationHistory.fulfilled, (s, a) => { s.isLoading = false; s.donations = a.payload; })
            .addCase(fetchDonationHistory.rejected, (s, a) => { s.isLoading = false; s.isError = true; s.message = a.payload; })

            .addCase(scheduleDonation.pending, (s) => { s.isLoading = true; })
            .addCase(scheduleDonation.fulfilled, (s, a) => { s.isLoading = false; s.isSuccess = true; s.donations = [a.payload, ...s.donations]; })
            .addCase(scheduleDonation.rejected, (s, a) => { s.isLoading = false; s.isError = true; s.message = a.payload; })

            .addCase(completeDonation.fulfilled, (s, a) => {
                s.donations = s.donations.map(d => d._id === a.payload.donation._id ? a.payload.donation : d);
            })

            .addCase(updateAvailability.fulfilled, (s) => { s.isSuccess = true; });
    },
});

export const { resetDonor } = donorSlice.actions;
export default donorSlice.reducer;
