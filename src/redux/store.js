"use client"
import { configureStore } from "@reduxjs/toolkit";
import bankStatementSlice from "./slices/bankStatementSlice";
import clientSlice from "./slices/clientSlice";
import journalSlice from "./slices/journalSlice";
import ledgerSlice from "./slices/ledgerSlice";
import masterSlice from "./slices/masterSlice";
import matterSlice from "./slices/matterSlice";
import outstandingSilce from "./slices/outstandingSlice";
import trustAccountSlice from "./slices/trustAccountSlice";
import userSlice from "./slices/userSlice";
import clientLeaderSummarySlice from "./slices/clientLeaderSummarySlice";
import reconciliationSlice from "./slices/reconciliationSlice";
import bankChargesLedgersSlice from "./slices/BankChargesLedgersSlice";
import lienSlice from "./slices/lienSlice";
import schedulerReportSlice from "./slices/schedulerReportsSlice";
import subscriptionPlanSlice from "./slices/subscriptionPlanSlice";

const store = configureStore({
    reducer: {
        user: userSlice,
        trustAccount: trustAccountSlice,
        ledger: ledgerSlice,
        matter: matterSlice,
        client: clientSlice,
        journal: journalSlice,
        master: masterSlice,
        bankStatement: bankStatementSlice,
        outstanding: outstandingSilce,
        clientLeader1: clientLeaderSummarySlice,
        reconciliation: reconciliationSlice,
        bankChargesLedgers: bankChargesLedgersSlice,
        lien: lienSlice,
        schedulerReports: schedulerReportSlice,
        subscriptionPlan: subscriptionPlanSlice
    },
    devTools: true
})

export default store;