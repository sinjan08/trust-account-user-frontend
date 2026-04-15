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



export const getAllBanks = createAsyncThunk("journal/getAllBanks", async (_, { rejectWithValue }) => {
  try {
    const response = await api.getAllBankList();
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || error.message);
  }
})


const masterSlice = createSlice({
  name: "master",
  initialState: {
    banks: [],
    loading: false,
    message: null,
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllBanks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllBanks.fulfilled, (state, action) => {
        state.banks = action.payload.data;
        state.loading = false;
        state.message = null;
        state.error = null;
      })
      .addCase(getAllBanks.rejected, (state, action) => {
        state.banks = [];
        state.loading = false;
        state.message = null;
        state.error = action.payload?.errors;
        if (action?.payload?.message == 'Invalid token.' || action?.payload?.data?.hasAccess == false || action?.payload == 'Network Error!') {
          logouterror(action);
        } else {
          toast.error(action.payload.message || "Something went wrong");
        }
      });
  }
});


export default masterSlice.reducer;