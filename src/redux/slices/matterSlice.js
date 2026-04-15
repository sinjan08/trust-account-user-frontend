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
 * creating new matter
 */
export const addNewMatter = createAsyncThunk("user/addNewMatter", async (formData, { rejectWithValue }) => {
  try {
    const response = await api.createMatter(formData);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || error.message);
  }
})



const matterSlice = createSlice({
  name: "matter",
  initialState: {
    data: [],
    loading: false,
    message: null,
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addNewMatter.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addNewMatter.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message || "Matter created successfully";
        state.error = null;
        toast.success(action.payload.message || "Matter created successfully");
      })
      .addCase(addNewMatter.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.errors;
        state.message = action.payload.message || "Something went wrong";
        if (action?.payload?.message == 'Invalid token.' || action?.payload?.data?.hasAccess == false || action?.payload == 'Network Error!') {
          logouterror(action);
        } else {
          toast.error(action.payload.message || "Something went wrong");
        }
      })
  },
})

export default matterSlice.reducer