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
export const fetchigAllLien = createAsyncThunk("user/fetchigAllLien", async (_, { rejectWithValue }) => {
    try {
        const response = await api.getAllLien();
        // console.log("object", response)
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data || error.message);
    }
})


export const addNotesOnLien = createAsyncThunk("user/addNotesOnLien", async ({ liensId, formData }, { rejectWithValue }) => {
    try {
        console.log(liensId)
        const response = await api.addNotes({ liensId, formData });
        // console.log("object", response)
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data || error.message);
    }
})
export const resolveLien = createAsyncThunk("user/resolveLien", async ({ resolveId, formData }, { rejectWithValue }) => {
    try {
        console.log(formData, "resolve_status ")
        const response = await api.resolveLienStatus({ resolveId, formData });
        console.log("object", response)
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data || error.message);
    }
})

export const LienTransaction = createAsyncThunk("user/LienTransaction", async ({ lien_id }, { rejectWithValue }) => {
    try {
        console.log(lien_id, "resolve_status ")
        const response = await api.LienTransactionById({ lien_id });
        console.log("object", response)
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data || error.message);
    }
})

export const addLienTransaction = createAsyncThunk("user/addLienTransaction", async (formData, { rejectWithValue }) => {
    try {
        console.log(formData, "resolve_status ")
        const response = await api.addNewLienTransaction(formData);
        console.log("object", response)
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data || error.message);
    }
})

const lienSlice = createSlice({
    name: "lien",
    initialState: {
        lienData: [],
        loading: false,
        message: null,
        error: null,
        lienTransactionData: []
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchigAllLien.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchigAllLien.fulfilled, (state, action) => {
                state.loading = false;
                state.lienData = action.payload;
                // state.message = action.payload.message || "Matter created successfully";
                state.error = null;
                // toast.success(action.payload.message || "Matter created successfully");
            })
            .addCase(fetchigAllLien.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.errors;
                state.message = action.payload.message || "Something went wrong";
                if (action?.payload?.message == 'Invalid token.' || action?.payload?.data?.hasAccess == false || action?.payload == 'Network Error!') {
                    logouterror(action);
                } else {
                    toast.error(action.payload.message || "Something went wrong");
                }
            })
            .addCase(addNotesOnLien.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addNotesOnLien.fulfilled, (state, action) => {
                state.loading = false;
                state.message = action.payload.message || "Note Added successfully";
                state.error = null;
                // toast.success(action.payload.message || "Matter created successfully");
            })
            .addCase(addNotesOnLien.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.errors;
                console.log("Action payload", action)
                state.message = action.payload.message || "Something went wrong";
                if (action?.payload?.message == 'Invalid token.' || action?.payload?.data?.hasAccess == false || action?.payload == 'Network Error!') {
                    logouterror(action);
                } else {
                    toast.error(action.payload.message || "Something went wrong");
                }
            })
            .addCase(resolveLien.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(resolveLien.fulfilled, (state, action) => {
                state.loading = false;
                state.message = action.payload.message || "Note Added successfully";
                state.error = null;
                // toast.success(action.payload.message || "Matter created successfully");
            })
            .addCase(resolveLien.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.errors;
                console.log("Action payload", action)
                state.message = action.payload.message || "Something went wrong";
                if (action?.payload?.message == 'Invalid token.' || action?.payload?.data?.hasAccess == false || action?.payload == 'Network Error!') {
                    logouterror(action);
                } else {
                    toast.error(action.payload.message || "Something went wrong");
                }
            })
            .addCase(LienTransaction.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(LienTransaction.fulfilled, (state, action) => {
                state.loading = false;
                state.lienTransactionData = action.payload.data
                console.log("Action Station", action.payload.data)
                state.message = action.payload.message || "Getting transaction data successfully";
                state.error = null;
                // toast.success(action.payload.message || "Matter created successfully");
            })
            .addCase(LienTransaction.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.errors;
                console.log("Action payload", action)
                state.message = action.payload.message || "Something went wrong";
                if (action?.payload?.message == 'Invalid token.' || action?.payload?.data?.hasAccess == false || action?.payload == 'Network Error!') {
                    logouterror(action);
                } else {
                    toast.error(action.payload.message || "Something went wrong");
                }
            })
            .addCase(addLienTransaction.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addLienTransaction.fulfilled, (state, action) => {
                state.loading = false;
                state.message = action.payload.message || "Add New transaction successfully";
                state.error = null;
                toast.success(action.payload.message || "Matter created successfully");
            })
            .addCase(addLienTransaction.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.errors;
                console.log("Action payload", action)
                state.message = action.payload.message || "Something went wrong";
                if (action?.payload?.message == 'Invalid token.' ||action?.payload?.data?.hasAccess == false || action?.payload == 'Network Error!') {
                    logouterror(action);
                } else {
                    toast.error(action.payload.message || "Something went wrong");
                }
            })
    },
})

export default lienSlice.reducer