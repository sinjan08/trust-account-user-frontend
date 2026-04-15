// import { Route, Routes, useLocation } from "react-router-dom";
// import Sidebar from "../components/header/SideBar";
// import NotFoundPage from "../pages/NotFoundPage";
// import AllClients from "../pages/user/allClients/AllClients";
// import MyProfile from "../pages/user/auth/MyProfile";
// import BankChargesLedgers from "../pages/user/bankChargesLedgers/BankChargesLedgers";
// import BankStatement from "../pages/user/bankStatement/BankStatement";
// import ClientLeaderSummary from "../pages/user/clientLeaderSummary/ClientLeaderSummary";
// import ClientTrustEntry from "../pages/user/clientTrust/ClientTrustEntry";
// import IndividualClientLedger from "../pages/user/individualClientLedger/IndividualClientLedger";
// import LienManagement from "../pages/user/lienManagement/LienManagement";
// import OutstandingDeposits from "../pages/user/outstandingDeposits/OutstandingDeposits";
// import OutstandingDisbursements from "../pages/user/outstandingDeposits/OutstandingDisbursement";
// import Reconciliation from "../pages/user/reconciliation/Reconciliation";
// import SubscriptionPlan from "../pages/user/subscriptionPlan/SubscriptionPlan";
// import TrustAccountJournal from "../pages/user/trustAccountJournal/TrustAccountJournal";
// import PrivateRoute from "./PrivateRoute";
// import SchedulerReports from "../pages/user/schedulerReports/SchedulerReports";
// import LienTransactionsTable from "../pages/user/lienManagement/LienTransactionsTable";

// const RoleBasedRoutes = () => {
//   const location = useLocation();

//   return (
//     <>
//       <Sidebar />
//       <Routes location={location} key={location.pathname}>
//         <Route
//           path="/bank-statement"
//           element={
//             <PrivateRoute allowedRoles={["admin", "user"]}>
//               <BankStatement />
//             </PrivateRoute>
//           }
//         />

//         <Route
//           path="/my-profile"
//           element={
//             <PrivateRoute allowedRoles={["admin", "user"]}>
//               <MyProfile />
//             </PrivateRoute>
//           }
//         />

//         {/* <Route
//           path="/subscription-plan"
//           element={
//             <PrivateRoute allowedRoles={["admin", "user"]}>
//               <SubscriptionPlan />
//             </PrivateRoute>
//           }
//         /> */}

//         <Route
//           path="/client-trust-entry"
//           element={
//             <PrivateRoute allowedRoles={["admin", "user"]}>
//               <ClientTrustEntry />
//             </PrivateRoute>
//           }
//         />

//         <Route
//           path="/individual-ledger"
//           element={
//             <PrivateRoute allowedRoles={["admin", "user"]}>
//               <IndividualClientLedger />
//             </PrivateRoute>
//           }
//         />

//         <Route
//           path="/bank-charges-ledgers"
//           element={
//             <PrivateRoute allowedRoles={["admin", "user"]}>
//               <BankChargesLedgers />
//             </PrivateRoute>
//           }
//         />

//         <Route
//           path="/outstanding-deposits"
//           element={
//             <PrivateRoute allowedRoles={["admin", "user"]}>
//               <OutstandingDeposits />
//             </PrivateRoute>
//           }
//         />

//         <Route
//           path="/outstanding-disbursement"
//           element={
//             <PrivateRoute allowedRoles={["admin", "user"]}>
//               <OutstandingDisbursements />
//             </PrivateRoute>
//           }
//         />

//         <Route
//           path="/reconciliation"
//           element={
//             <PrivateRoute allowedRoles={["admin", "user"]}>
//               <Reconciliation />
//             </PrivateRoute>
//           }
//         />

//         <Route
//           path="/client-leader-summary"
//           element={
//             <PrivateRoute allowedRoles={["admin", "user"]}>
//               <ClientLeaderSummary />
//             </PrivateRoute>
//           }
//         />

//         <Route
//           path="/lien-management"
//           element={
//             <PrivateRoute allowedRoles={["admin", "user"]}>
//               <LienManagement />
//             </PrivateRoute>
//           }
//         />
//         <Route
//           path="/lien-transactions"
//           element={
//             <PrivateRoute allowedRoles={["admin", "user"]}>
//               <LienTransactionsTable />
//             </PrivateRoute>
//           }
//         />

//         <Route
//           path="/trust-account-journal"
//           element={
//             <PrivateRoute allowedRoles={["admin", "user"]}>
//               <TrustAccountJournal />
//             </PrivateRoute>
//           }
//         />

//         <Route
//           path="/all-clients"
//           element={
//             <PrivateRoute allowedRoles={["admin", "user"]}>
//               <AllClients />
//             </PrivateRoute>
//           }
//         />

//         <Route path="/scheduler-for-reports" element={<SchedulerReports />} />

//         <Route path="*" element={<NotFoundPage />} />
//       </Routes>
//     </>
//   );
// };

// export default RoleBasedRoutes;


import { useEffect, useState } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import Sidebar from "../components/header/SideBar";
import { menuComponentsMap } from "../utils/componentsMap";
import NotFoundPage from './../pages/NotFoundPage';
import PrivateRoute from "./PrivateRoute";
import RequireSubscriptionProctation from "./RequireSubscriptionProctation";
import SubscriptionPlan from "../pages/user/subscriptionPlan/SubscriptionPlan";
import RequireReadPermission from "./RequireReadPermission";

const RoleBasedRoutes = () => {
  const [menuPermissions, setMenuPermissions] = useState([]);
  const location = useLocation();

  useEffect(() => {
    const storedMenus = JSON.parse(localStorage.getItem('menuPermissions')) || [];
    setMenuPermissions(storedMenus);
  }, []);

  return (
    <>
      <Sidebar menuPermissions={menuPermissions} />

      <Routes location={location} key={location.pathname}>
        {menuPermissions.map(({ id, url: path, component }) => {
          const Component = menuComponentsMap[component];
          if (!Component) {
            return <Route key={id} path={path} element={<NotFoundPage />} />;
          }
          return (
            <>
              <Route
                key={id}
                path={path}
                element={
                  <RequireSubscriptionProctation>
                    <RequireReadPermission>
                      <PrivateRoute>
                        <Component />
                      </PrivateRoute>
                    </RequireReadPermission>
                  </RequireSubscriptionProctation>
                }
              />
              <Route path="/subscription-plan" element={<SubscriptionPlan />} />
            </>

          );
        })}
        <Route path="*" element={<NotFoundPage />} />
      </Routes >
    </>
  );
};

export default RoleBasedRoutes;