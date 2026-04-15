import axios from 'axios';

export const baseURL = import.meta.env.VITE_BACKEND_URL

const API = axios.create({
  baseURL: baseURL,  // Use import.meta.env instead of process.env
  headers: {
    'Authorization': `Bearer ${JSON.parse(localStorage.getItem("trust-account"))?.token}`,
  },
});


export const userInfo = () => API.get("/protected");

export const signup = (formData) => API.post("/signup", formData);

export const login = (formData) => API.post("/login", formData);

export const logout = (id) => API.post('/logout', id);

export const forgotPassword = (formData) => API.post('/forgot-password', formData);




// ------------------------------ User Slice APi -----------------------------------------------



export const verifyOtp = (formData) => API.post(`/verify-otp`, formData);

export const loginVerifyOtp = (formData) => API.post(`/verify-otp-login`, formData);

export const resetPassword = (formData) => API.post(`/reset-password`, formData);

export const getUser = (formData) => API.post(`/my-profile-get`, formData);
// export const updateUser = (formData) => API.post(`/my-profile-update`, formData);
export const deleteUser = (userid) => API.delete(`/delete-account`, userid);



// ------------------------------- My Profile APi -----------------------------------------------

export const getProfile = () => API.get(`/get-profile`);

export const updateUser = (formData) => API.put(`/update-profile`, formData);

export const fetchNotifaction = () => API.get(`/user/get-notification`);

export const markAsRead = (formData) => API.put(`/admin/mark-notification-as-read`, formData);


export const userPermissionCheck = () => API.get(`/check-user-permission-update`);

// ------------------------------- Bank Statement APi -----------------------------------------------

// uploading bank statement to fetch transactions
export const uploadBankStatement = (formData) => API.post(`/user/bank-statement/upload`, formData, {
  headers: {
    'Content-Type': 'multipart/form-data',
  }
});

// fetching prviuosly bank statement API
export const getBankStatements = () => API.get(`/user/bank-statement`);

// ------------------------------- Trust Account APi -----------------------------------------------

// upload document API
export const uploadTrustDocument = (formData) => API.post(`/user/client-trust-entry/upload`, formData, {
  headers: {
    'Content-Type': 'multipart/form-data',
  }
});

// fetch client trust document API
export const getTrustDocuments = () => API.get(`/user/client-trust-entry`);

// ------------------------------- Trust account journal API -----------------------------------------------

// fetch all banks API
export const getAllBankList = () => API.get(`/user/get-all-banks`);

// fetching client journal entry
export const getJournals = (formData) => API.post(`/admin/get-journal-entries`, formData);

// add new journal entry API
export const addJournalEntry = (formData) => API.post(`/admin/add-journal-entry`, formData);

// update journal entry
export const updateJournalEntry = (id, formData) => API.put(`/admin/update-journal-entry/${id}`, formData);

// ------------------------------- Individual Client Ledger APi -----------------------------------------------

// fetching client list
export const getClientDropdown = () => API.get(`/user/all-ledger-client`);

export const getClient = () => API.get(`/user/all-clients`);

export const getClientList = () => API.get(`/user/ledger-client-list`);

// fetching client ledger
export const getClientLedger = (formData) => API.post(`/user/individual-ledgers`, formData);


// ------------------------------- Client API -----------------------------------------------

export const createClient = (formData) => API.post(`/user/create-client`, formData);
export const fetchClients = () => API.get(`/user/get-all-clients`);

export const getLedgerClientList = () => API.get(`/admin/get-ledger-clients`);

// ------------------------------- Matter API -----------------------------------------------

export const createMatter = (formData) => API.post(`/user/add-lien`, formData);

export const fetchAllMatterByClientId = (formData) => API.get(`/user/get-matter-by-client/${formData}`);


// ---------------------------------- Outstanding Deposits -----------------------------------------------

// fetching outstanding deposits
export const getOutstandingDeposits = () => API.get(`/user/outstanding-deposits`);

// ---------------------------------- Outstanding Disbursement -----------------------------------------------

// fetching outstanding deposits
export const getOutstandingDisbursement = () => API.get(`/user/outstanding-disbursement`);


// fetch Client leadger summary

export const getClientName = () => API.get(`/user/all-ledger-client`);

export const getLedgerSummary = (formData) => API.post(`/user/client-ledger-summary`, formData);


// fetch reconciliation data
export const getAllFirmName = () => API.get(`/admin/get-firms`);

export const getAllBankName = () => API.get(`/user/get-all-banks`);

export const getAllReconciliationData = (formData) => API.post(`/user/genrate-reconciliation`, formData);

export const saveReasonForDiscard = (formData) => API.post(`/user/save-discard-reason`, formData);

export const confirmReconciliation = (formData) => API.post(`/user/save-reconcile-confirmation`, formData);

export const getReconcilitationReasons = (formData) => API.post(`/user/get-discard-reason`, formData);

export const allBankFirm = () => API.get(`/user/get-bank-ledger-firms`);

export const getAllBankLedgersData = (formData) => API.post(`/user/get-all-bank-ledger`, formData);

export const getAllLien = () => API.get(`/user/get-lien`);

export const addNotes = ({ liensId, formData }) => API.put(`/user/add-lien-notes/${liensId}`, formData);

export const resolveLienStatus = ({ resolveId, formData }) => API.put(`/user/update-lien-status/${resolveId}`, formData);

export const getAllModule = () => API.get(`/user/get-report-modules`);

export const getAllMonthRepots = (formData) => API.post(`/user/get-reports`, formData);

export const LienTransactionById = ({ lien_id }) => API.get(`/user/get-lien-transaction/${lien_id}`);

export const addNewLienTransaction = (formData) => API.post(`/user/add-lien-transaction`, formData);


//Subscription Plan

export const getAllsubscriptionPlan = () => API.get(`/user/get-subscriptions`);

export const addNewPlan = (formData) => API.post(`/user/init-subscription-payment`, formData);

export const isSubscribed = () => API.get(`/user/check-user-subscription`);


// case api

export const getAllCases = () => API.get(`/user/case`);

export const addNewCase = (formData) => API.post(`/user/case/create`, formData);

export const getClientsByCaseId = (case_id) => API.get(`/user/case/clients/${case_id}`);
