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
 * To get clients for dropdown with search filter
 */
export const getClients = createAsyncThunk("user/getClients", async (_, { rejectWithValue }) => {
    try {
        const response = await api.getClientDropdown();
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data || error.message);
    }
})
export const getClientsForMat = createAsyncThunk("user/getClientsData", async (_, { rejectWithValue }) => {
    try {
        const response = await api.getClient();
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data || error.message);
    }
})






/**
 * To get client ledger
 */
export const getClientLedger = createAsyncThunk("user/getClientLedger", async (formData, { rejectWithValue }) => {
    try {
        const response = await api.getClientLedger(formData);
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data || error.message);
    }
})

export const getLedgerClientDropdown = createAsyncThunk("user/getLedgerClientDropdown", async (_, { rejectWithValue }) => {
    try {
        const response = await api.getLedgerClientList();
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data || error.message);
    }
})


export const getClientsByCaseId = createAsyncThunk("user/getClientsByCaseId", async (case_id, { rejectWithValue }) => {
    try {
        const response = await api.getClientsByCaseId(case_id);
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data || error.message);
    }
})

export const getLedgerClientList = createAsyncThunk("user/getLedgerClientList", async (_, { rejectWithValue }) => {
    try {
        const response = await api.getClientList();
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data || error.message);
    }
})


// ledger slice
const ledgerSlice = createSlice({
    name: 'ledger',
    initialState: {
        clients: [],
        ledgers: [],
        ledgerClients: [],
        clientInfo: {},
        caseInfo: {},
        loading: false,
        message: null,
        error: null
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getClientLedger.pending, (state) => {
                state.loading = true;
                state.error = false;
            })
            .addCase(getClientLedger.fulfilled, (state, action) => {
                state.ledgers = action?.payload?.data?.addedSerialNoLedgers || [];
                state.caseInfo = action?.payload?.data?.caseInfo || {};
                state.loading = false;
                state.message = null;
                state.error = false;
            })
            .addCase(getClientLedger.rejected, (state, action) => {
                state.ledgers = [];
                state.caseInfo = {};
                state.loading = false;
                state.message = null;
                state.error = true;
                if (action?.payload?.message == 'Invalid token.' || action?.payload?.data?.hasAccess == false || action?.payload == 'Network Error!') {
                    logouterror(action);
                } else {
                    toast.error(action.payload.message || "Something went wrong");
                }
            })

            // fetching clients for ledgers
            .addCase(getClients.pending, (state) => {
                state.loading = true;
                state.error = false;
            })
            .addCase(getClients.fulfilled, (state, action) => {
                state.clients = action?.payload?.data;
                state.loading = false;
                state.message = null;
                state.error = false;
            })
            .addCase(getClients.rejected, (state, action) => {
                state.clients = [];
                state.loading = false;
                state.message = null;
                state.error = true;
                if (action?.payload?.message == 'Invalid token.' || action?.payload?.data?.hasAccess == false || action?.payload == 'Network Error!') {
                    logouterror(action);
                } else {
                    toast.error(action.payload.message || "Something went wrong");
                }
            })
            // fetching clients for ledgers
            .addCase(getClientsForMat.pending, (state) => {
                state.loading = true;
                state.error = false;
            })
            .addCase(getClientsForMat.fulfilled, (state, action) => {
                state.clients = action?.payload?.data;
                // console.log("Action", action)
                state.loading = false;
                state.message = null;
                state.error = false;
            })
            .addCase(getClientsForMat.rejected, (state, action) => {
                state.clients = [];
                state.loading = false;
                state.message = null;
                state.error = true;
                if (action?.payload?.message == 'Invalid token.' || action?.payload?.data?.hasAccess == false || action?.payload == 'Network Error!') {
                    logouterror(action);
                } else {
                    toast.error(action.payload.message || "Something went wrong");
                }
            })

            // fetching ledger clients by case id
            .addCase(getClientsByCaseId.pending, (state) => {
                state.loading = true;
                state.error = false;
            })
            .addCase(getClientsByCaseId.fulfilled, (state, action) => {
                state.ledgerClients = action?.payload?.data;
                state.loading = false;
                state.message = null;
                state.error = false;
            })
            .addCase(getClientsByCaseId.rejected, (state, action) => {
                state.ledgerClients = [];
                state.loading = false;
                state.message = null;
                state.error = true;
                if (action?.payload?.message == 'Invalid token.' || action?.payload?.data?.hasAccess == false || action?.payload == 'Network Error!') {
                    logouterror(action);
                } else {
                    toast.error(action.payload.message || "Something went wrong");
                }
            })

            // fetching all legder clients
            .addCase(getLedgerClientList.pending, (state) => {
                state.loading = true;
                state.error = false;
            })
            .addCase(getLedgerClientList.fulfilled, (state, action) => {
                state.ledgerClients = action?.payload?.data;
                state.loading = false;
                state.message = null;
                state.error = false;
            })
            .addCase(getLedgerClientList.rejected, (state, action) => {
                state.ledgerClients = [];
                state.loading = false;
                state.message = null;
                state.error = true;
                if (action?.payload?.message == 'Invalid token.' || action?.payload?.data?.hasAccess == false || action?.payload == 'Network Error!') {
                    logouterror(action);
                } else {
                    toast.error(action.payload.message || "Something went wrong");
                }
            })
    }
})

export default ledgerSlice.reducer