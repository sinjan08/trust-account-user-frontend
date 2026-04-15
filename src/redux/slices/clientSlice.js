import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import * as api from "../Api";


// For Unauthenticated User
function logouterror(action) {
    if (action?.payload?.message == 'Invalid token.') {
        toast.error("Session Expired. Please login again.");
    } else {
        toast.error(action?.payload?.message);
    }
    localStorage.removeItem("trust-account");
    setTimeout(() => {
        window.location.href = "/login";
    }, 1000);
}



/**
 * Create client function
 */
export const addNewClient = createAsyncThunk("user/addNewClient", async (formData, { rejectWithValue }) => {
    try {
        const response = await api.createClient(formData);
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data || error.message);
    }
})


/**
 * Fetch Clients
 */
export const getAllClients = createAsyncThunk("user/getAllClients", async () => {
    try {
        const response = await api.fetchClients();
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data || error.message);
    }
})
/**
 * Fetch Matter by Clients Id
 */
export const getMatterByClientId = createAsyncThunk("user/get-matter-by-client", async (formData, { rejectWithValue }) => {
    try {
        const response = await api.fetchAllMatterByClientId(formData);
        console.log("Here", response)
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data || error.message);
    }
})


const clientSlice = createSlice({
    name: "client",
    initialState: {
        data: [],
        matters: [],
        loading: false,
        message: null,
        error: null
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(addNewClient.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addNewClient.fulfilled, (state, action) => {
                state.loading = false;
                state.message = action.payload.message || "Client created successfully";
                state.error = null;
                toast.success(action.payload.message || "Client created successfully");
            })
            .addCase(addNewClient.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.errors;
                state.message = action.payload.message || "Something went wrong";
                if (action?.payload?.message == 'Invalid token.' || action?.payload?.data?.hasAccess == false || action?.payload == 'Network Error!') {
                    logouterror(action);
                } else {
                    toast.error(action.payload.message || "Something went wrong");
                }
            })
            .addCase(getAllClients.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAllClients.fulfilled, (state, action) => {
                state.data = action.payload.data;
                state.loading = false;
                state.message = null;
                state.error = null;
            })
            .addCase(getAllClients.rejected, (state, action) => {
                state.data = [];
                state.loading = false;
                state.message = null;
                state.error = action.error?.message;
                if (action?.payload?.message == 'Invalid token.' || action?.payload?.data?.hasAccess == false || action?.payload == 'Network Error!') {
                    logouterror(action);
                } else {
                    toast.error(action.payload.message || "Something went wrong");
                }
            })
            .addCase(getMatterByClientId.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getMatterByClientId.fulfilled, (state, action) => {
                state.matters = action.payload.data;
                state.loading = false;
                state.message = null;
                state.error = null;
            })
            .addCase(getMatterByClientId.rejected, (state, action) => {
                state.data = [];
                state.loading = false;
                state.message = null;
                state.error = action.error?.message;
                if (action?.payload?.message == 'Invalid token.' || action?.payload?.data?.hasAccess == false || action?.payload == 'Network Error!') {
                    logouterror(action);
                } else {
                    toast.error(action.payload.message || "Something went wrong");
                }
            })
    }
})


export default clientSlice.reducer