import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import * as api from "../Api";



// For Unauthenticated User
// function logouterror(action) {
//     if (action?.payload?.message == 'Invalid token.' || action?.payload?.data?.hasAccess == false) {
//         toast.error("Session Expired. Please login again.");
//     } else {
//         toast.error(action?.payload?.message);
//     }
//     localStorage.removeItem("trust-account");
//     setTimeout(() => {
//         window.location.href = "/login";
//     }, 1000);
// }
function logouterror(action) {
    const message = action?.payload?.message;
    const hasAccess = action?.payload?.data?.hasAccess;

    if (message === 'Invalid token.' || hasAccess === false) {
        toast.error("Session Expired. Please login again.");
    } else {
        toast.error(message || "Something went wrong.");
    }

    localStorage.removeItem("trust-account");

    setTimeout(() => {
        window.location.href = "/login";
    }, 1000);
}



/**
 * Get client Name function
 */
export const getAllClientName = createAsyncThunk("user/getClientName", async (_, { rejectWithValue }) => {
    try {
        const response = await api.getClientName();
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data || error.message);
    }
})
export const getClientLedgerSummary = createAsyncThunk("user/getClientLedgerSummary", async (formData, { rejectWithValue }) => {
    try {
        const response = await api.getLedgerSummary(formData);
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data || error.message);
    }
})






const clientLeader = createSlice({
    name: "clientLeader1",
    initialState: {
        clientName: [],
        ledgerSummary: [],
        loading: false,
        message: null,
        error: null
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getAllClientName.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAllClientName.fulfilled, (state, action) => {
                state.clientName = action?.payload?.data;
                // console.log("Action station", action.payload?.data)
                state.loading = false;
                state.message = action.payload.message || "Client get successfully";
                state.error = null;
                // toast.success(action.payload.message || "Client get successfully");
            })
            .addCase(getAllClientName.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.errors;
                // console.log(action)
                state.message = action.payload.message || "Something went wrong";
                if (action?.payload?.message == 'Invalid token.' || action?.payload?.data?.hasAccess == false || action?.payload == 'Network Error!') {
                    logouterror(action);
                } else {
                    toast.error(action.payload.message || "Something went wrong");
                }
            })
            .addCase(getClientLedgerSummary.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getClientLedgerSummary.fulfilled, (state, action) => {
                state.ledgerSummary = action?.payload;
                // console.log("Action station", action.payload)
                state.loading = false;
                state.message = action.payload.message || "Client Ledger Summary geting successfully";
                state.error = null;
                // toast.success(action.payload.message || "Client Ledger Summary geting successfully");
            })
            .addCase(getClientLedgerSummary.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.errors;
                // console.log(action)
                state.message = action.payload.message || "Something went wrong";

                if (action?.payload?.message == 'Invalid token.' || action?.payload?.data?.hasAccess == false || action?.payload == 'Network Error!') {
                    logouterror(action);
                } else {
                    toast.error(action.payload.message || "Something went wrong");
                }
            })
    }
})


export default clientLeader.reducer;