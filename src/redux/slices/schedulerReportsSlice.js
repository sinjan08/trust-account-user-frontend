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
 * geting all modules 
 */
export const getAllModulesForReports = createAsyncThunk("user/getAllModulesForReports", async (_, { rejectWithValue }) => {
    try {
        const response = await api.getAllModule();
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data || error.message);
    }
})
export const getAllMonthsData = createAsyncThunk("user/getAllMonthsData", async (formData, { rejectWithValue }) => {
    try {
        const response = await api.getAllMonthRepots(formData);
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data || error.message);
    }
})



const schedulerReportsSlice = createSlice({
    name: "schedulerReports",
    initialState: {
        data: {},
        loading: false,
        message: null,
        error: null,
        reportsData: [],
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getAllModulesForReports.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAllModulesForReports.fulfilled, (state, action) => {
                state.loading = false;
                // console.log("Action station", action.payload)
                state.data = action.payload.data || {};
                state.message = action.payload.message || "Module found successfully";
                state.error = null;
                // toast.success(action.payload.message || "Module found successfully");
            })
            .addCase(getAllModulesForReports.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.errors;
                state.message = action.payload.message || "Something went wrong";
                if (action?.payload?.message == 'Invalid token.' || action?.payload?.data?.hasAccess == false || action?.payload == 'Network Error') {
                    logouterror(action);
                } else {
                    toast.error(action.payload.message || "Something went wrong");
                }
            })
            .addCase(getAllMonthsData.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAllMonthsData.fulfilled, (state, action) => {
                state.loading = false;
                state.reportsData = action.payload.data || [];
                state.message = action.payload.message || "Module found successfully";
                state.error = null;
                // toast.success(action.payload.message || "Module found successfully");
            })
            .addCase(getAllMonthsData.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.errors;
                state.reportsData = []
                state.message = action.payload.message || "Something went wrong";
                if (action?.payload?.message == 'Invalid token.' || action?.payload?.data?.hasAccess == false || action?.payload == 'Network Error') {
                    logouterror(action);
                } else {
                    toast.error(action.payload.message || "Something went wrong");
                }
            })
    },
})

export default schedulerReportsSlice.reducer