import { Navigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import FullPageLoader from '../components/user/FullPageLoader';
import { useDispatch } from "react-redux";
import { checkUserPermission } from '../redux/slices/userSlice';

function handleRedirect() {
  const permissionsList = JSON.parse(localStorage.getItem('menuPermissions') || '[]');
  const firstAccessible = permissionsList.find(
    item => item?.has_read_permission === 1 || item?.has_read_permission === '1'
  );
  console.log("firstAccessible", permissionsList)
  if (firstAccessible?.url) {
    window.location.href = firstAccessible.url;
  } else {
    localStorage.clear();
    toast.error("You don't have permission to access any pages.!");
    setTimeout(() => {
      window.location.href = "/login";
    }, 500)
  }
}


// const FullPageLoader = () => (
//   <div style={{
//     position: 'fixed',
//     top: 0,
//     left: 0,
//     width: '100vw',
//     height: '100vh',
//     backgroundColor: 'rgba(255, 255, 255, 0.9)',
//     display: 'flex',
//     justifyContent: 'center',
//     alignItems: 'center',
//     zIndex: 9999
//   }}>
//     <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
//       Loading...
//     </div>
//     {/* You can replace this with a spinner or animation */}
//   </div>
// );


const RequireReadPermission = ({ children }) => {
  const dispatch = useDispatch()
  const location = useLocation();
  const [allowed, setAllowed] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const subscriptionPath = location.pathname;
    if (subscriptionPath == '/subscription-plan') {
      <Navigate to="/subscription-plan" replace />;
    }
  }, [location.pathname])

  useEffect(() => {
    dispatch(checkUserPermission())
  }, [location.pathname, dispatch])
  const permissionsList = JSON.parse(localStorage.getItem('menuPermissions') || '[]');
  
  console.log("permissionsList",permissionsList)
  useEffect(() => {
    const matched = permissionsList.find((item) => item.url === location.pathname);
    // console.log("permissionsListlghdfiohofdhkfghk", permissionsList)
    if (matched?.has_read_permission === '1' || matched?.has_read_permission === 1) {
      localStorage.setItem('last-allowed-url', location.pathname);
      setAllowed(true);
    } else {
      const moduleName = matched?.name || 'This module';
      toast.error(`You don't have access to ${moduleName}.`);
      setAllowed(false);
    }
    setLoading(false);
  }, [location.pathname]);

  if (loading) return <FullPageLoader />;


  if (!allowed) {
    const last = localStorage.getItem('last-allowed-url');
    const matched = permissionsList.find((item) => item.url === last);
    if (!(matched?.has_read_permission === '1' || matched?.has_read_permission === 1)) {
      handleRedirect()
    }
    return <Navigate to={last ? last : handleRedirect()} replace />;
  }
  return children;
};

export default RequireReadPermission;
