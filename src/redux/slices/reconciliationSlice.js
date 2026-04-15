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





export const getAllFirm = createAsyncThunk("user/getAllFirmName", async (_, { rejectWithValue }) => {
    try {
        const response = await api.getAllFirmName();
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data || error.message);
    }
})
export const getAllBank = createAsyncThunk("user/getAllBankName", async (_, { rejectWithValue }) => {
    try {
        const response = await api.getAllBankName();
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data || error.message);
    }
})

export const getAllReconciliation = createAsyncThunk("user/getAllReconciliation", async (formData, { rejectWithValue }) => {
    try {
        const response = await api.getAllReconciliationData(formData);
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data || error.message);
    }
})



export const saveDiscardReason = createAsyncThunk("user/saveDiscardReason", async (formData, { rejectWithValue }) => {
    try {
        const response = await api.saveReasonForDiscard(formData);
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data || error.message);
    }
})



export const saveReconcileConfirmation = createAsyncThunk("user/saveReconcileConfirmation", async (formData, { rejectWithValue }) => {
    try {
        const response = await api.confirmReconciliation(formData);
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data || error.message);
    }
})


export const fetchReconciliationReasons = createAsyncThunk("user/fetchReconciliationReasons", async (formData, { rejectWithValue }) => {
    try {
        const response = await api.getReconcilitationReasons(formData);
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data || error.message);
    }
})








const reconciliation = createSlice({
    name: "reconciliation",
    initialState: {
        allFirmName: [],
        allBankName: [],
        getGenratedReconciliationData: [],
        reconciliationReasons: [],
        loading: false,
        message: null,
        error: null
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getAllFirm.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAllFirm.fulfilled, (state, action) => {
                state.allFirmName = action?.payload
                // console.log("Action station", action.payload)
                state.loading = false;
                state.message = action.payload.message || "Geting firm name successfully";
                state.error = null;
                // toast.success(action.payload.message || "Client get successfully");
            })
            .addCase(getAllFirm.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.errors;
                console.log("Hello here", action)
                state.message = action.payload.message || "Something went wrong";
                if (action?.payload?.message == 'Invalid token.' || action?.payload?.data?.hasAccess == false || action?.payload == 'Network Error') {
                    logouterror(action);
                } else {
                    toast.error(action.payload.message || "Something went wrong");
                }
            })
            .addCase(getAllBank.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAllBank.fulfilled, (state, action) => {
                state.allBankName = action?.payload
                // console.log("Action station", action.payload)
                state.loading = false;
                state.message = action.payload.message || "featching Bank name successfully";
                state.error = null;
                // toast.success(action.payload.message || "Client get successfully");
            })
            .addCase(getAllBank.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.errors;
                console.log("Hello here", action)
                state.message = action.payload.message || "Something went wrong";
                if (action?.payload?.message == 'Invalid token.' || action?.payload?.data?.hasAccess == false || action?.payload == 'Network Error') {
                    logouterror(action);
                } else {
                    toast.error(action.payload.message || "Something went wrong");
                }
            })
            .addCase(getAllReconciliation.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAllReconciliation.fulfilled, (state, action) => {
                state.getGenratedReconciliationData = action?.payload
                // console.log("Action station", action.payload)
                state.loading = false;
                state.message = action.payload.message || "featching Bank name successfully";
                state.error = null;
                // toast.success(action.payload.message || "Client get successfully");
            })
            .addCase(getAllReconciliation.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.errors;
                console.log("Hello here", action)
                state.message = action.payload.message || "Something went wrong";
                if (action?.payload?.message == 'Invalid token.' || action?.payload?.data?.hasAccess == false || action?.payload == 'Network Error') {
                    logouterror(action);
                } else {
                    toast.error(action.payload.message || "Something went wrong");
                }
            })
            .addCase(saveDiscardReason.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(saveDiscardReason.fulfilled, (state, action) => {
                console.log("Action station", action.payload)
                state.loading = false;
                state.message = action.payload.message || "Save Discard Reason successfully";
                state.error = null;
                toast.success(action.payload.message || "Save Discard Reason successfully");
            })
            .addCase(saveDiscardReason.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.errors;
                state.message = action.payload.message || "Something went wrong";
                if (action?.payload?.message == 'Invalid token.' || action?.payload?.data?.hasAccess == false || action?.payload == 'Network Error') {
                    logouterror(action);
                } else {
                    toast.error(action.payload.message || "Something went wrong");
                }
            })
            .addCase(saveReconcileConfirmation.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(saveReconcileConfirmation.fulfilled, (state, action) => {
                console.log("Action station", action.payload)
                state.loading = false;
                state.message = action.payload.message || "Reconcile Confirmation successfully";
                state.error = null;
                toast.success(action.payload.message || "Reconcile Confirmation successfully");
            })
            .addCase(saveReconcileConfirmation.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.errors;
                state.message = action.payload.message || "Something went wrong";
                if (action?.payload?.message == 'Invalid token.' || action?.payload?.data?.hasAccess == false || action?.payload == 'Network Error') {
                    logouterror(action);
                } else {
                    toast.error(action.payload.message || "Something went wrong");
                }
            })
            .addCase(fetchReconciliationReasons.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.reconciliationReasons = [];
            })
            .addCase(fetchReconciliationReasons.fulfilled, (state, action) => {
                console.log("Action station", action.payload)
                state.loading = false;
                state.reconciliationReasons = action?.payload?.data;
                state.message = action.payload.message || "Reconcile Confirmation successfully";
                state.error = null;
                // toast.success(action.payload.message || "Reconcile Confirmation successfully");
            })
            .addCase(fetchReconciliationReasons.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.errors;
                state.reconciliationReasons = [];
                state.message = action.payload.message || "Something went wrong";
                if (action?.payload?.message == 'Invalid token.' || action?.payload?.data?.hasAccess == false || action?.payload == 'Network Error') {
                    logouterror(action);
                } else {
                    toast.error(action.payload.message || "Something went wrong");
                }
            })
    }
})


export default reconciliation.reducer;