import AllClients from "../pages/user/allClients/AllClients";
import BankChargesLedgers from "../pages/user/bankChargesLedgers/BankChargesLedgers";
import BankStatement from "../pages/user/bankStatement/BankStatement";
import ClientLeaderSummary from "../pages/user/clientLeaderSummary/ClientLeaderSummary";
import ClientTrustEntry from "../pages/user/clientTrust/ClientTrustEntry";
import IndividualClientLedger from "../pages/user/individualClientLedger/IndividualClientLedger";
import LienManagement from "../pages/user/lienManagement/LienManagement";
import OutstandingDeposits from "../pages/user/outstandingDeposits/OutstandingDeposits";
import OutstandingDisbursements from "../pages/user/outstandingDeposits/OutstandingDisbursement";
import Reconciliation from "../pages/user/reconciliation/Reconciliation";
import SchedulerReports from "../pages/user/schedulerReports/SchedulerReports";
import TrustAccountJournal from "../pages/user/trustAccountJournal/TrustAccountJournal";
import MyProfile from './../pages/user/auth/MyProfile';
import LienTransactionsTable from './../pages/user/lienManagement/LienTransactionsTable';
import SubscriptionPlan from './../pages/user/subscriptionPlan/SubscriptionPlan';
 
export const menuComponentsMap = {
  BankStatement,
  ClientTrustEntry,
  IndividualClientLedger,
  BankChargesLedgers,
  OutstandingDeposits,
  OutstandingDisbursements,
  Reconciliation,
  ClientLeaderSummary,
  LienManagement,
  LienTransactionsTable,
  TrustAccountJournal,
  AllClients,
  SchedulerReports,
  SubscriptionPlan,
  MyProfile,
};