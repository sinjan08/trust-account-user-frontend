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



export const getingAllPlans = createAsyncThunk("user/getingAllPlans", async (_, { rejectWithValue }) => {
    try {
        const response = await api.getAllsubscriptionPlan();
        // console.log("response",response)
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data || error.message);
    }
})

export const subscribePlan = createAsyncThunk("user/subscribePlan", async (formData, { rejectWithValue }) => {
    try {
        const response = await api.addNewPlan(formData);
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data || error.message);
    }
})
export const newSubscription = createAsyncThunk("user/newSubscription", async (_, { rejectWithValue }) => {
    try {
        const response = await api.isSubscribed();
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data || error.message);
    }
})


const subscriptionPlanSlice = createSlice({
    name: "subscriptionPlan",
    initialState: {
        loading: false,
        message: null,
        error: null,
        allPlans: [],
        subscriptionData: []
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getingAllPlans.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getingAllPlans.fulfilled, (state, action) => {
                state.loading = false;
                state.allPlans = action.payload.data;
                // console.log("Action Station", action)
                state.message = action.payload.message || "Module found successfully";
                state.error = null;
                // toast.success(action.payload.message || "Module found successfully");
            })
            .addCase(getingAllPlans.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.errors;
                state.message = action.payload.message || "Something went wrong";
                if (action?.payload?.message == 'Invalid token.' || action?.payload?.data?.hasAccess == false || action?.payload == 'Network Error') {
                    logouterror(action);
                } else {
                    toast.error(action.payload.message || "Something went wrong");
                }
            })
            .addCase(subscribePlan.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(subscribePlan.fulfilled, (state, action) => {
                state.loading = false;
                // console.log("Action Station", action)
                state.message = action.payload.message || "Plan added successfully";
                state.error = null;
                toast.success(action.payload.message || "Plan added successfully");
            })
            .addCase(subscribePlan.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.errors;
                state.message = action.payload.message || "Something went wrong";
                if (action?.payload?.message == 'Invalid token.' || action?.payload?.data?.hasAccess == false || action?.payload == 'Network Error') {
                    logouterror(action);
                } else {
                    toast.error(action.payload.message || "Something went wrong");
                }
            })
            .addCase(newSubscription.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(newSubscription.fulfilled, (state, action) => {
                state.loading = false;
                console.log("Action Station", action)
                state.subscriptionData = action?.payload?.data;
                state.message = action.payload.message || "Plan added successfully";
                state.error = null;
                // toast.success(action.payload.message || "Plan added successfully");
            })
            .addCase(newSubscription.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.errors;
                state.message = action.payload.message || "Something went wrong";
                if (action?.payload?.message == 'Invalid token.' || action?.payload?.data?.hasAccess == false || action?.payload == 'Network Error') {
                    logouterror(action);
                } else {
                    toast.error(action.payload.message || "Something went wrong");
                }
            })
    }
})



export default subscriptionPlanSlice.reducer