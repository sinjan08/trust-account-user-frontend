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


function handleRedirect(action) {
  const permissionsList = JSON.parse(localStorage.getItem('menuPermissions') || '[]');
  const firstAccessible = permissionsList.find(
    item => item?.has_read_permission === 1 || item?.has_read_permission === '1'
  );
  if (firstAccessible?.url) {
    toast.success(action?.payload?.message || "User Login successfull");
    window.location.href = firstAccessible.url;
  } else {
    toast.error("You don't have permission to access any page!.");
    localStorage.clear();
  }
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
    console.log("response", response)
    return response.data;
  } catch (error) {
    console.log("error", error)
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
// export const updateUser = createAsyncThunk("user/updateUser", async (formData, { rejectWithValue }) => {
//   try {
//     const response = await api.updateUser(formData);
//     return response.data;
//   } catch (error) {
//     return rejectWithValue(error.response?.data || error.message);
//   }
// });

export const updateUserProfile = createAsyncThunk("user/updateUserProfile", async (formData, { rejectWithValue }) => {
  try {
    const response = await api.updateUser(formData);
    console.log("Response", response.data)
    return response.data;
  } catch (error) {
    console.log("object")
    return rejectWithValue(error.response?.data || error.message);
  }
});

// Delete User
export const deleteUser = createAsyncThunk("user/delete", async (userid, { rejectWithValue }) => {
  try {
    const response = await api.deleteUser(userid);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || error.message);
  }
});


// verify Otp
export const verifyOtp = createAsyncThunk("user/verifyOtp", async (userData, { rejectWithValue }) => {
  try {
    const response = await api.verifyOtp(userData);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || error.message);
  }
});

// Reset Password
export const resetPassword = createAsyncThunk("user/resetPassword", async (userData, { rejectWithValue }) => {
  try {
    const response = await api.resetPassword(userData);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || error.message);
  }
});

// get profile by id
export const getUserProfile = createAsyncThunk("user/getUserProfile", async (formData, { rejectWithValue }) => {
  try {
    const response = await api.getProfile(formData);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || error.message);
  }
})


export const getNotifaction = createAsyncThunk("user/getNotifaction", async (_, { rejectWithValue }) => {
  try {
    const response = await api.fetchNotifaction();
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || error.message);
  }
});
export const markReadNotification = createAsyncThunk("admin/markReadNotification", async (notification_id, { rejectWithValue }) => {
  try {
    const response = await api.markAsRead(notification_id);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || error.message);
  }
});


export const checkUserPermission = createAsyncThunk("user/checkUserPermission", async (_, { rejectWithValue }) => {
  try {
    const response = await api.userPermissionCheck();
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || error.message);
  }
});

// Slice
const userSlice = createSlice({
  name: "user",
  initialState: {
    user: [],
    profile: [],
    isUser: null,
    loading: false,
    error: null,
    message: null,
    notification: [],
    permissionMenu: []
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
      // .addCase(login.fulfilled, (state, action) => {
      //   state.loading = false;
      //   state.user = action.payload;
      //   console.log("action.payload", action.payload.subscription.is_subscription_active)
      //   setTimeout(() => {
      //     window.location.href = action.payload.subscription.is_subscription_active == 'active' ? "/bank-statement" :'/subscription-plan'
      //     // window.location.href = "/bank-statement"
      //   }, 1000);
      //   action.payload.role == 'user' || action.payload.role == 'attorney' ?
      //     (localStorage.setItem("trust-account", JSON.stringify(action.payload)), toast.success(action.payload.message || "User Login successfully")) :
      //     toast.error("User Not authrized to access this resource")

      // })


      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        console.log("Action station:-", action.payload);
        state.menuPermissions = action.payload?.menuPermissions || [];
        if (state.menuPermissions.length <= 0) {
          toast.error("User Not authrized to access this resource");
          setTimeout(() => {
            window.location.href = "/login"
          }, 1000);
        } else {
          localStorage.setItem("trust-account", JSON.stringify(action?.payload));
          localStorage.setItem("menuPermissions", JSON.stringify(state?.menuPermissions));
          handleRedirect(action)
          // setTimeout(() => {
          //   handle
          //   window.location.href = action?.payload?.subscription?.is_subscription_active == 'active' ? "/my-profile" : '/subscription-plan'
          //   // window.location.href = "/bank-statement"
          // }, 1000);
        }
        // action.payload.role == 'user' || action.payload.role == 'attorney' ?
        //   (localStorage.setItem("trust-account", JSON.stringify(action.payload)), toast.success(action.payload.message || "User Login successfully")) :
        //   toast.error("User Not authrized to access this resource")
        // setTimeout(() => {
        //   window.location.href = "/bank-statement"
        // }, 1000);
      })


      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action?.payload?.errors || "Error in Login";
        console.log("object", action)
        // toast.error(action.payload.message || "Invalid Credential")
        if (action?.payload?.message == 'Invalid token.' || action?.payload?.data?.hasAccess == false) {
          logouterror(action);
        } else {
          toast.error(action.payload.message || "Something went wrong");
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

      // get profile
      .addCase(getUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action?.payload?.data;
        state.message = "User fetched successfully";
      })
      .addCase(getUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.errors;
        state.profile = [];
        // toast.error(action?.payload?.message || "Profile not found");
        if (action?.payload?.message == 'Invalid token.' || action?.payload?.data?.hasAccess == false) {
          logouterror(action);
        } else {
          toast.error(action.payload.message || "Something went wrong");
        }
      })
      // geting Notifaction
      .addCase(getNotifaction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getNotifaction.fulfilled, (state, action) => {
        state.loading = false;
        state.notification = action?.payload?.data
        // toast.success(action.payload.message || "Geting user profile successfully");
      })
      .addCase(getNotifaction.rejected, (state, action) => {
        state.loading = false;
        console.log(action, "jhfg")
        state.error = action.payload?.errors || "Error in send otp";
        if (action?.payload?.message == 'Invalid token.' || action?.payload?.data?.hasAccess == false) {
          logouterror(action);
        } else {
          toast.error(action.payload.message || "Something went wrong");
        }
        // toast.error(action.payload.message || "Error in send otp");
      })
      // geting Notifaction
      .addCase(markReadNotification.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(markReadNotification.fulfilled, (state, action) => {
        state.loading = false;
        state.notification = action?.payload?.data
        // toast.success(action.payload.message || "Geting user profile successfully");
      })
      .addCase(markReadNotification.rejected, (state, action) => {
        state.loading = false;
        console.log(action, "jhfg")
        state.error = action.payload?.errors || "Error in send otp";
        if (action?.payload?.message == 'Invalid token.' || action?.payload?.data?.hasAccess == false) {
          logouterror(action);
        } else {
          toast.error(action.payload.message || "Something went wrong");
        }
        // toast.error(action.payload.message || "Error in send otp");
      })

      // Edit user
      .addCase(updateUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.message = "User updated successfully";
        toast.success(action.payload.message || "User profile updated successfully");
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to update user";
        if (action?.payload?.message == 'Invalid token.' || action?.payload?.data?.hasAccess == false) {
          logouterror(action);
        } else {
          toast.error(action.payload.message || "Something went wrong");
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
        toast.success(action.payload.message || "User deleted successfully");
        localStorage.removeItem("trust-account");
        localStorage.removeItem("last-allowed-url");
        localStorage.removeItem("menuPermissions");
        localStorage.removeItem("trust-account-subscription");
        localStorage.removeItem("trust-account-subscription-plan");
        setTimeout(() => {
          window.location.href = "/login"
        }, 1000)

      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to delete user";
        toast.error(action.payload.message || "Failed to delete user")
        if (action?.payload?.message == 'Invalid token.' || action?.payload?.data?.hasAccess == false) {
          logouterror(action);
        } else {
          toast.error(action.payload.message || "Something went wrong");
          localStorage.removeItem("trust-account");
          localStorage.removeItem("last-allowed-url");
          localStorage.removeItem("menuPermissions");
          localStorage.removeItem("trust-account-subscription");
          localStorage.removeItem("trust-account-subscription-plan");
          setTimeout(() => {
            window.location.href = "/login"
          }, 1000)
        }
      })
      .addCase(checkUserPermission.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(checkUserPermission.fulfilled, (state, action) => {
        state.loading = false;
        state.permissionMenu = action?.payload?.data?.permissions;
        localStorage.setItem("menuPermissions", JSON.stringify(action?.payload?.data?.permissions));
        // console.log("permissionMenu", action?.payload)
        state.message = "User Deleted successfully";
        // toast.success(action.payload.message || "User deleted successfully")
      })
      .addCase(checkUserPermission.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to delete user";
        toast.error(action.payload.message || "Failed to delete user")
        if (action?.payload?.message == 'Invalid token.' || action?.payload?.data?.hasAccess == false) {
          logouterror(action);
        } else {
          toast.error(action.payload.message || "Something went wrong");
        }
      });
  },
});

export default userSlice.reducer;
