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
 * Fetch all banks
 */
export const getAllBanks = createAsyncThunk("journal/getAllBanks", async (_, { rejectWithValue }) => {
    try {
        const response = await api.getAllBankList();
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data || error.message);
    }
})


/**
 * To insert journal entry
 */
export const insertJournalEntry = createAsyncThunk("journal/insertJournalEntry", async (formData, { rejectWithValue }) => {
    try {
        const response = await api.addJournalEntry(formData);
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data || error.message);
    }
});


/**
 * Update jounranl
 */
export const updateJournal = createAsyncThunk("journal/updateJournal", async ({ id, formData }, { rejectWithValue }) => {
    try {
        const response = await api.updateJournalEntry(id, formData);
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data || error.message);
    }
})


/**
 * To get journal entries
 */
export const getJournalEntries = createAsyncThunk("journal/getJournalEntries", async (formData, { rejectWithValue }) => {
    try {
        const response = await api.getJournals(formData);
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data || error.message);
    }
})

export const getAllCases = createAsyncThunk("journal/getAllCases", async (_, { rejectWithValue }) => {
    try {
        const response = await api.getAllCases();
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data || error.message);
    }
})


export const addNewCase = createAsyncThunk("journal/addNewCase", async (formData, { rejectWithValue }) => {
    try {
        const response = await api.addNewCase(formData);
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data || error.message);
    }
})


const journalSlice = createSlice({
    name: "journal",
    initialState: {
        journals: [],
        client: null,
        banks: [],
        cases: [],
        loading: false,
        message: null,
        error: null
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            // fetching banks list
            .addCase(getAllBanks.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAllBanks.fulfilled, (state, action) => {
                state.banks = action?.payload?.data;
                state.loading = false;
                state.message = null;
                state.error = false;
            })
            .addCase(getAllBanks.rejected, (state, action) => {
                state.banks = [];
                state.loading = false;
                state.message = null;
                state.error = true;
                if (action?.payload?.message == 'Invalid token.' || action?.payload?.data?.hasAccess == false || action?.payload == 'Network Error!') {
                    logouterror(action);
                } else {
                    toast.error(action.payload.message || "Something went wrong");
                }
            })



            // fetching journals
            .addCase(getJournalEntries.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getJournalEntries.fulfilled, (state, action) => {
                state.journals = action?.payload?.data?.journals || [];
                state.client = action.payload.data.client || null;
                state.loading = false;
                state.message = null;
                state.error = false;
            })

            .addCase(getJournalEntries.rejected, (state, action) => {
                state.journalData = [];
                state.client = null;
                state.loading = false;
                state.message = null;
                state.error = true;
                if (action?.payload?.message == 'Invalid token.' || action?.payload?.data?.hasAccess == false || action?.payload == 'Network Error!') {
                    logouterror(action);
                } else {
                    toast.error(action.payload.message || "Something went wrong");
                }
            })



            // inserting journal
            .addCase(insertJournalEntry.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(insertJournalEntry.fulfilled, (state, action) => {
                state.loading = false;
                state.message = action?.payload?.message || "Journal entry saved successfully";
                state.error = false;
                toast.success(action?.payload?.message || "Journal entry saved successfully");
            })
            .addCase(insertJournalEntry.rejected, (state, action) => {
                state.loading = false;
                state.error = true;
                state.message = action?.payload?.message || "Something went wrong";
                if (action?.payload?.message == 'Invalid token.' || action?.payload?.data?.hasAccess == false || action?.payload == 'Network Error!') {
                    logouterror(action);
                } else {
                    toast.error(action.payload.message || "Something went wrong");
                }
            })

            // update journal entry
            .addCase(updateJournal.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateJournal.fulfilled, (state, action) => {
                state.loading = false;
                state.message = action?.payload?.message || "Journal entry updated successfully";
                state.error = false;
                toast.success(action?.payload?.message || "Journal entry updated successfully");
            })
            .addCase(updateJournal.rejected, (state, action) => {
                state.loading = false;
                state.error = true;
                state.message = action?.payload?.message || "Something went wrong";
                if (action?.payload?.message == 'Invalid token.' || action?.payload?.data?.hasAccess == false || action?.payload == 'Network Error!') {
                    logouterror(action);
                } else {
                    toast.error(action.payload.message || "Something went wrong");
                }
            })

            // fetching cases
            .addCase(getAllCases.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAllCases.fulfilled, (state, action) => {
                state.cases = action?.payload?.data;
                state.loading = false;
                state.message = null;
                state.error = false;
            })
            .addCase(getAllCases.rejected, (state, action) => {
                state.cases = [];
                state.loading = false;
                state.message = null;
                state.error = true;
                if (action?.payload?.message == 'Invalid token.' || action?.payload?.data?.hasAccess == false || action?.payload == 'Network Error!') {
                    logouterror(action);
                } else {
                    toast.error(action.payload.message || "Something went wrong");
                }
            })

            // adding new case
            .addCase(addNewCase.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addNewCase.fulfilled, (state, action) => {
                state.loading = false;
                state.message = action?.payload?.message || "Case added successfully";
                state.error = false;
                toast.success(action?.payload?.message || "Case added successfully");
            })
            .addCase(addNewCase.rejected, (state, action) => {
                state.loading = false;
                state.error = true;
                state.message = action?.payload?.message || "Something went wrong";
                if (action?.payload?.message == 'Invalid token.' || action?.payload?.data?.hasAccess == false || action?.payload == 'Network Error!') {
                    logouterror(action);
                } else {
                    toast.error(action.payload.message || "Something went wrong");
                }
            })
    }
});


export default journalSlice.reducer;