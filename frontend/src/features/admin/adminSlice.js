import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import adminService from './adminService';

export const fetchDashboard = createAsyncThunk('admin/fetchDashboard', async (_, thunkAPI) => {
    try { return await adminService.fetchDashboard(); }
    catch (err) { return thunkAPI.rejectWithValue(err.response?.data?.message || err.message); }
});

export const fetchRequests = createAsyncThunk('admin/fetchRequests', async (_, thunkAPI) => {
    try { return await adminService.fetchRequests(); }
    catch (err) { return thunkAPI.rejectWithValue(err.response?.data?.message || err.message); }
});

export const updateRequestStatus = createAsyncThunk('admin/updateRequest', async (payload, thunkAPI) => {
    try { return await adminService.updateRequestStatus(payload); }
    catch (err) { return thunkAPI.rejectWithValue(err.response?.data?.message || err.message); }
});

export const fetchStock = createAsyncThunk('admin/fetchStock', async (_, thunkAPI) => {
    try { return await adminService.fetchStock(); }
    catch (err) { return thunkAPI.rejectWithValue(err.response?.data?.message || err.message); }
});

export const updateStock = createAsyncThunk('admin/updateStock', async (data, thunkAPI) => {
    try { return await adminService.updateStock(data); }
    catch (err) { return thunkAPI.rejectWithValue(err.response?.data?.message || err.message); }
});

export const fetchUsers = createAsyncThunk('admin/fetchUsers', async (role, thunkAPI) => {
    try { return await adminService.fetchUsers(role); }
    catch (err) { return thunkAPI.rejectWithValue(err.response?.data?.message || err.message); }
});

export const toggleUserStatus = createAsyncThunk('admin/toggleUser', async (id, thunkAPI) => {
    try { return await adminService.toggleUserStatus(id); }
    catch (err) { return thunkAPI.rejectWithValue(err.response?.data?.message || err.message); }
});

export const fetchAuditLogs = createAsyncThunk('admin/fetchAuditLogs', async (page, thunkAPI) => {
    try { return await adminService.fetchAuditLogs(page); }
    catch (err) { return thunkAPI.rejectWithValue(err.response?.data?.message || err.message); }
});

const adminSlice = createSlice({
    name: 'admin',
    initialState: {
        dashboard: null,
        requests: [],
        stock: [],
        users: [],
        auditLogs: { logs: [], total: 0, page: 1, totalPages: 1 },
        isLoading: false,
        isError: false,
        isSuccess: false,
        message: '',
    },
    reducers: {
        resetAdmin: (s) => { s.isLoading = false; s.isError = false; s.isSuccess = false; s.message = ''; },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchDashboard.pending, (s) => { s.isLoading = true; })
            .addCase(fetchDashboard.fulfilled, (s, a) => { s.isLoading = false; s.dashboard = a.payload; })
            .addCase(fetchDashboard.rejected, (s, a) => { s.isLoading = false; s.isError = true; s.message = a.payload; })

            .addCase(fetchRequests.pending, (s) => { s.isLoading = true; })
            .addCase(fetchRequests.fulfilled, (s, a) => { s.isLoading = false; s.requests = a.payload; })
            .addCase(fetchRequests.rejected, (s, a) => { s.isLoading = false; s.isError = true; s.message = a.payload; })

            .addCase(updateRequestStatus.fulfilled, (s, a) => {
                s.requests = s.requests.map(r => r._id === a.payload._id ? a.payload : r);
                s.isSuccess = true;
            })
            .addCase(updateRequestStatus.rejected, (s, a) => { s.isError = true; s.message = a.payload; })

            .addCase(fetchStock.fulfilled, (s, a) => { s.stock = a.payload; })

            .addCase(updateStock.fulfilled, (s, a) => { s.stock = a.payload; s.isSuccess = true; })

            .addCase(fetchUsers.pending, (s) => { s.isLoading = true; })
            .addCase(fetchUsers.fulfilled, (s, a) => { s.isLoading = false; s.users = a.payload; })
            .addCase(fetchUsers.rejected, (s, a) => { s.isLoading = false; s.isError = true; s.message = a.payload; })

            .addCase(toggleUserStatus.fulfilled, (s, a) => {
                s.users = s.users.map(u => u._id === a.payload.user._id ? a.payload.user : u);
            })

            .addCase(fetchAuditLogs.fulfilled, (s, a) => { s.auditLogs = a.payload; });
    },
});

export const { resetAdmin } = adminSlice.actions;
export default adminSlice.reducer;
