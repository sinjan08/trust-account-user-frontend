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
 * Upload trust account document
 */
export const uploadTrustAccountDocs = createAsyncThunk("user/uploadTrustAccountDocs", async (formData, { rejectWithValue }) => {
    try {
        const response = await api.uploadTrustDocument(formData);
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data || error.message);
    }
})


/**
 * View recent uploads
 */
export const viewRecentUploads = createAsyncThunk("user/viewRecentUploads", async (_, { rejectWithValue }) => {
    try {
        const response = await api.getTrustDocuments();
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data || error.message);
    }
})


// trust account slicer
const trustAccountSlice = createSlice({
    name: "trustAccount",
    initialState: {
        trustDocs: [],
        loading: false,
        error: null,
        message: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            // uploading trust document
            .addCase(uploadTrustAccountDocs.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(uploadTrustAccountDocs.fulfilled, (state, action) => {
                state.loading = false;
                state.message = action?.payload?.message || "Document uploaded successfully";
                state.error = false;
                toast.success(action?.payload?.message || "Document uploaded successfully");
            })
            .addCase(uploadTrustAccountDocs.rejected, (state, action) => {
                state.loading = false;
                state.error = true;
                state.message = action?.payload?.message || "Something went wrong";
                if (action?.payload?.message == 'Invalid token.' || action?.payload?.data?.hasAccess == false || action?.payload == 'Network Error') {
                    logouterror(action);
                } else {
                    toast.error(action.payload.message || "Something went wrong");
                }
            })

            // fetching previously uploaded documents
            .addCase(viewRecentUploads.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(viewRecentUploads.fulfilled, (state, action) => {
                state.trustDocs = action?.payload?.data;
                state.loading = false;
                state.message = null;
                state.error = false;
            })
            .addCase(viewRecentUploads.rejected, (state, action) => {
                state.trustDocs = [];
                state.loading = false;
                state.error = true;
                state.message = action?.payload?.message || "Something went wrong";
                if (action?.payload?.message == 'Invalid token.' || action?.payload?.data?.hasAccess == false || action?.payload == 'Network Error') {
                    logouterror(action);
                } else {
                    toast.error(action.payload.message || "Something went wrong");
                }
            })
    },
})

export default trustAccountSlice.reducer;
