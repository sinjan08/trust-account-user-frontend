import { Navigate } from "react-router-dom";


const RequireSubscriptionProctation = ({ children }) => {
  const isSubscribedData = JSON.parse(localStorage.getItem('trust-account-subscription'));
  const isSubscribed = JSON.parse(localStorage.getItem('isSubscribed'))
  // console.log("isSubscribedData", Object.keys(isSubscribedData), Object.keys(isSubscribed))

  if (Object.keys(isSubscribed || {}).length > 0 || Object.keys(isSubscribedData || {}).length > 0) {
    // console.log("hello")
    return children;
  }
  return <Navigate to="/subscription-plan" replace />;
};

export default RequireSubscriptionProctation;  