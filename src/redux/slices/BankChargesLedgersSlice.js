import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import * as api from "../Api";

// For Unauthenticated User
function logouterror(action) {
  if(action?.payload?.message == 'Invalid token.'){
    toast.error("Session Expired. Please login again.");
  }else{
    toast.error(action?.payload?.message);
  }
  localStorage.removeItem("trust-account");
  setTimeout(() => {
    window.location.href = "/login";
  }, 1000);
}





export const getAllBankFirm = createAsyncThunk("user/getAllBankFirm", async (_, { rejectWithValue }) => {
    try {
        const response = await api.allBankFirm();
        // console.log(response,"Response")
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data || error.message);
    }
})


export const getAllBankLedgers = createAsyncThunk("user/getAllBankLedgersData", async (formData, { rejectWithValue }) => {
    try {
        const response = await api.getAllBankLedgersData(formData);
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data || error.message);
    }
})

const bankChargesLedgers = createSlice({
    name: "bankChargesLedgers",
    initialState: {
        allFirmName: [],
        loading: false,
        message: null,
        error: null
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getAllBankFirm.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAllBankFirm.fulfilled, (state, action) => {
                state.allFirmName = action?.payload
                state.loading = false;
                state.message = action.payload.message || "Geting firm name successfully";
                state.error = null;
                // toast.success(action.payload.message || "Client get successfully");
            })
            .addCase(getAllBankFirm.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.errors;
                state.message = action.payload.message || "Something went wrong";
                if (action?.payload?.message == 'Invalid token.' || action?.payload?.data?.hasAccess == false || action?.payload == 'Network Error!') {
                    logouterror(action);
                } else {
                    toast.error(action.payload.message || "Something went wrong");
                }
            })
            .addCase(getAllBankLedgers.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAllBankLedgers.fulfilled, (state, action) => {
                // state.allBankLedger = action?.payload
                // console.log("Action station", action.payload)
                state.loading = false;
                state.message = action.payload.message || "Geting firm name successfully";
                state.error = null;
                // toast.success(action.payload.message || "Client get successfully");
            })
            .addCase(getAllBankLedgers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.errors;
                state.message = action.payload.message || "Something went wrong";
                if (action?.payload?.message == 'Invalid token.' || action?.payload?.data?.hasAccess == false || action?.payload == 'Network Error!') {
                    logouterror(action);
                } else {
                    toast.error(action.payload.message || "Something went wrong");
                }
            })
    }
})


export default bankChargesLedgers.reducer;