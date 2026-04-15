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




// fething outstanding deposits
export const getAlLOutstandingDeposits = createAsyncThunk(
  "user/getAllOutstandingDeposits",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.getOutstandingDeposits();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// fething outstanding disbursements
export const getAlLOutstandingDisbursements = createAsyncThunk(
  "user/getAlLOutstandingDisbursements",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.getOutstandingDisbursement();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);


// outstanding slice
const outstandingSilce = createSlice({
  name: "outstanding",
  initialState: {
    outstandingDeposits: [],
    outstandingDisbursements: [],
    loading: false,
    message: null,
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder

      // fetching outstanding deposits
      .addCase(getAlLOutstandingDeposits.pending, (state) => {
        state.loading = true;
        state.error = false;
      })
      .addCase(getAlLOutstandingDeposits.fulfilled, (state, action) => {
        state.outstandingDeposits = action?.payload?.data;
        state.loading = false;
        state.message = null;
        state.error = false;
      })
      .addCase(getAlLOutstandingDeposits.rejected, (state, action) => {
        state.outstandingDeposits = [];
        state.loading = false;
        state.message = null;
        state.error = true;
        if (action?.payload?.message == 'Invalid token.' || action?.payload?.data?.hasAccess == false || action?.payload == 'Network Error') {
          logouterror(action);
        } else {
          toast.error(action.payload.message || "Something went wrong");
        }
      })

      // fetching outstanding disburseents
      .addCase(getAlLOutstandingDisbursements.pending, (state) => {
        state.loading = true;
        state.error = false;
      })
      .addCase(getAlLOutstandingDisbursements.fulfilled, (state, action) => {
        state.outstandingDisbursements = action?.payload?.data;
        state.loading = false;
        state.message = null;
        state.error = false;
      })
      .addCase(getAlLOutstandingDisbursements.rejected, (state, action) => {
        state.outstandingDisbursements = [];
        state.loading = false;
        state.message = null;
        state.error = true;
        if (action?.payload?.message == 'Invalid token.' || action?.payload?.data?.hasAccess == false) {
          logouterror(action);
        } else {
          toast.error(action.payload.message || "Something went wrong");
        }
      })
  }
})

export default outstandingSilce.reducer