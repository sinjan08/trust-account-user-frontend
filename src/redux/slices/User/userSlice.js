import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as api from "../../Api";
import { toast } from "react-toastify";

// For Unauthenticated User
function logouterror() {
  toast.error("Token Expired")
  localStorage.removeItem("trust-account");
  setTimeout(() => {
    window.location.href = "/";
  }, 1000);
}

export const userInfo = createAsyncThunk("user/userInfo", async (_, { rejectWithValue }) => {
  try {
    const response = await api.userInfo();
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || error.message);
  }
});

export const signup = createAsyncThunk("user/signup", async (formData, { rejectWithValue }) => {
  try {
    const response = await api.signup(formData);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || error.message);
  }
});

export const login = createAsyncThunk("user/login", async (formData, { rejectWithValue }) => {
  try {
    const response = await api.login(formData);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || error.message);
  }
});

export const forgotPassword = createAsyncThunk("user/forgotPassword", async (formData, { rejectWithValue }) => {
  try {
    const response = await api.forgotPassword(formData);

    console.log(response.data);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || error.message);
  }
});

// Edit User
export const updateUser = createAsyncThunk("user/updateUser", async (formData, { rejectWithValue }) => {
  try {
    const response = await api.updateUser(formData);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || error.message);
  }
});
// Delete User
export const deleteUser = createAsyncThunk("user/delete", async (userData, { rejectWithValue }) => {
  try {
    const response = await api.deleteUser(userData);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || error.message);
  }
});


//verify Otp
export const verifyOtp = createAsyncThunk("user/verifyOtp", async (userData, { rejectWithValue }) => {
  try {
    const response = await api.verifyOtp(userData);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || error.message);
  }
});

//Reset Password
export const resetPassword = createAsyncThunk("user/resetPassword", async (userData, { rejectWithValue }) => {
  try {
    const response = await api.resetPassword(userData);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || error.message);
  }
});
//Reset Password
export const getUserProfile = createAsyncThunk("user/getUserProfile", async (_, { rejectWithValue }) => {
  try {
    const response = await api.getProfile();
    // console.log("Response", response.data)
    return response.data;
  } catch (error) {
    console.log("object")
    return rejectWithValue(error.response?.data || error.message);
  }
});


export const updateUserProfile = createAsyncThunk("user/updateUserProfile", async (formData, { rejectWithValue }) => {
  try {
    const response = await api.updateUser(formData);
    // console.log("Response", response.data)
    return response.data;
  } catch (error) {
    console.log("object")
    return rejectWithValue(error.response?.data || error.message);
  }
});



// Slice

const userSlice = createSlice({
  name: "user",
  initialState: {
    user: [],
    isUser: null,
    loading: false,
    error: null,
    message: null,
    notification: [],
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // User Info
      .addCase(userInfo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(userInfo.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message || "User Fetch successfully";
        state.isUser = action.payload.user;
      })
      .addCase(userInfo.rejected, (state, action) => {
        state.loading = false;
        state.isUser = JSON.parse(localStorage.getItem("trust-account"))
        state.error = action.payload?.errors;
        (state.isUser) && toast.error(action.payload.message || "Session Expired");
        localStorage.removeItem("trust-account");
        setTimeout(() => {
          window.location.href = "/login"
        }, 1000);
      })
      // Create user
      .addCase(signup.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signup.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.message = "User created successfully";
        toast.success(action.payload.message || "User Register successfully")
        setTimeout(() => {
          window.location.href = "/login"
        }, 1000);
      })
      .addCase(signup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.errors || "User creation failed";
        toast.error(action.payload.message || "User creation failed");
      })

      // Login user
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        console.log(action.payload)
        action.payload.role == 'user' || action.payload.role == 'aternie' ?
          (localStorage.setItem("trust-account", JSON.stringify(action.payload)), toast.success(action.payload.message || "User Login successfully")) :
          toast.error("User Not authrized to access this resource")
        setTimeout(() => {
          window.location.href = "/bank-statement"
        }, 1000);
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.errors || "Error in Login";
        toast.error(action.payload.message || "Invalid Credential")
        if (action.payload.message == "Unauthenticated.") {
          logouterror();
        }
      })

      // Forgot user
      .addCase(forgotPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(forgotPassword.fulfilled, (state, action) => {
        state.loading = false;
        toast.success(action.payload.message || "OTP sent successfully")
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.errors || "Error in send otp";
        toast.error(action.payload.message || "Error in send otp");
      })
      // Get User Profile
      .addCase(getUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        toast.success(action.payload.message || "Geting user profile successfully");
      })
      .addCase(getUserProfile.rejected, (state, action) => {
        state.loading = false;
        console.log(action, "jhfg")
        state.error = action.payload?.errors || "Error in send otp";
        toast.error(action.payload.message || "Error in send otp");
      })
      // Get User Profile
      .addCase(updateUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        toast.success(action.payload.message || "User profile updated successfully");
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.loading = false;
        console.log(action, "jhfg")
        state.error = action.payload?.errors || "Error in send otp";
        toast.error(action.payload.message || "Error in send otp");
      })

      // Verify Otp
      .addCase(verifyOtp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyOtp.fulfilled, (state, action) => {
        state.loading = false;
        toast.success(action.payload.message || "OTP verified successfully")
      })
      .addCase(verifyOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.errors || "Error in verify otp";
        toast.error(action.payload.message || "Error in verify otp");
      })
      // Reset Password
      .addCase(resetPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(resetPassword.fulfilled, (state, action) => {
        state.loading = false;
        toast.success(action.payload.message || "Password reset successfully")
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.errors || "Error in Password reset";
        toast.error(action.payload.message || "Error in Password reset");
      })

      // Edit user
      .addCase(updateUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.message = "User updated successfully";
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to update user";
        if (action.payload.message == "Unauthenticated.") {
          logouterror();
        }
      })

      // Delete User
      .addCase(deleteUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.message = "User Deleted successfully";
        toast.success(action.payload.message || "User deleted successfully")
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to delete user";
        toast.error(action.payload.message || "Failed to delete user")
        if (action.payload.message == "Unauthenticated.") {
          logouterror();
        }
      });
  },
});

export default userSlice.reducer;
