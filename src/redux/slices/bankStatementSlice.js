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





// upload bank statement
export const createBankStatement = createAsyncThunk("user/createBankStatement", async (formData, { rejectWithValue }) => {
  try {
    const response = await api.uploadBankStatement(formData);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || error.message);
  }
})


// fetching all bank statements upoaded by the logged in user
export const fetchBankStatements = createAsyncThunk("user/fetchBankStatements", async (_, { rejectWithValue }) => {
  try {
    const response = await api.getBankStatements();
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || error.message);
  }
})


const bankSlice = createSlice({
  name: "bankStatement",
  initialState: {
    bankStatements: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // uploading bank statement
      .addCase(createBankStatement.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createBankStatement.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        toast.success(action?.payload?.message || "Bank statement uploaded successfully");
      })
      .addCase(createBankStatement.rejected, (state, action) => {
        state.loading = false;
        state.error = action?.payload;
        if (action?.payload?.message == 'Invalid token.' || action?.payload?.data?.hasAccess == false || action?.payload == 'Network Error!') {
          logouterror(action);
        } else {
          toast.error(action.payload.message || "Something went wrong");
        }
      })

      // fetching all bank statements
      .addCase(fetchBankStatements.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBankStatements.fulfilled, (state, action) => {
        state.bankStatements = action?.payload?.data;
        state.loading = false;
        state.error = null;
      })
      .addCase(fetchBankStatements.rejected, (state, action) => {
        state.loading = false;
        state.error = action?.payload;
        state.bankStatements = [];
        if (action?.payload?.message == 'Invalid token.' || action?.payload?.data?.hasAccess == false || action?.payload == 'Network Error!') {
          logouterror(action);
        } else {
          toast.error(action.payload.message || "Something went wrong");
        }
      })
  },
});

export default bankSlice.reducer;