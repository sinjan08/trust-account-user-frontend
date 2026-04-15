// import { useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { Navigate } from "react-router-dom";
// import { useAuth } from "../contexts/AuthContext";
// import { userInfo } from "../redux/slices/userSlice";

// const PrivateRoute = ({ element, allowedRoles, ...rest }) => {
//   const { user, setUser } = useAuth();

//   const { loading, isUser } = useSelector((state) => state.user);
//   const dispatch = useDispatch();

//   useEffect(() => {
//     if (!isUser) {
//       dispatch(userInfo());
//     } else {
//       setUser(isUser)
//     }
//   }, [isUser])

//   if (loading) {
//     return <div>Loading...</div>;
//   }

//   // If user is not logged in or doesn't have the required role, redirect to login

//   if (!user || !allowedRoles.includes(user.role)) {
//     return <Navigate to="/login" />;
//   }

//   return element;
// };

// export default PrivateRoute;

// import { Navigate, useLocation } from "react-router-dom";
// // import LoadingSpinner from "../components/common/LoadingSpinner";
// import { useAuth } from "../contexts/AuthContext";

// const PrivateRoute = ({ children, allowedRoles }) => {
//   const { user, isLogedinData } = useAuth();
//   const location = useLocation();

//   // If auth data is still loading
//   if (isLogedinData === undefined) {
//     return <div>Loading...</div>;
//   }

//   // If user is not logged in
//   if (!user) {
//     return <Navigate to="/login" state={{ from: location }} replace />;
//   }

//   // If user doesn't have required role
//   if (!allowedRoles.includes(user.role)) {
//     return <Navigate to="/" replace />;
//   }

//   // If all checks pass, render the children
//   return children;
// };

// export default PrivateRoute;


import { Navigate, useLocation } from "react-router-dom";
// import LoadingSpinner from "../components/common/LoadingSpinner";
import { useAuth } from "../contexts/AuthContext";

const PrivateRoute = ({ children, allowedRoles = [] }) => {
  const { user, isLogedinData } = useAuth();
  const location = useLocation();

  if (isLogedinData === undefined) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    // return <Navigate to="/" replace />;
  }

  return children;
};

export default PrivateRoute;