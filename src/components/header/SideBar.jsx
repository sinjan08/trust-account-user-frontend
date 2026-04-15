import { formatDistanceToNow } from 'date-fns';
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "../../../public/css/dashboard.css";
import { useAuth } from "../../contexts/AuthContext";
import { getNotifaction, getUserProfile, markReadNotification } from "../../redux/slices/userSlice";


function handleRedirect() {
  toast.error('Something wrong! please login again');
  localStorage.clear();
  window.location.href = "/login";
}


const Sidebar = ({ menuPermissions }) => {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [openNotification, setOpenNotification] = useState(false);
  const [userData, setUserData] = useState([])
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [userProfile, setUserProfile] = useState([]);
  const { isSidebarOpen, setSidebarOpen } = useAuth();
  const { notification } = useSelector(state => state.user);
  const bellRef = useRef(null);
  const popupRef = useRef(null);

  const dispatch = useDispatch()
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    console.log('working')
    localStorage.removeItem("trust-account");
    localStorage.removeItem('isSubscribed');
    localStorage.removeItem('trust-account-subscription');
    navigate("/login");
  }




  useEffect(() => {
    if (isSubscribed) {
      dispatch(getNotifaction())
    }
  }, [dispatch, isSubscribed])

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('trust-account'));
    setUserData(user);
    // console.log("subscription", user?.subscription)
    const subscription = JSON.parse(localStorage.getItem('trust-account-subscription'));
    const isSubscribedData = localStorage.getItem('isSubscribed');

    console.log("Subscription length:", subscription);

    if (Object.keys(subscription || {}).length || Object.keys(isSubscribedData || {}).length) {
      setIsSubscribed(true);
    } else {
      setIsSubscribed(false);
    }
  }, []);


  useEffect(() => {
    function handleClickOutside(event) {
      if (
        popupRef.current &&
        !popupRef.current.contains(event.target) &&
        bellRef.current &&
        !bellRef.current.contains(event.target)
      ) {
        setOpenNotification(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const markAsReadMsg = (readMark) => {
    const formData = {}
    formData.notification_id = readMark?.id
    console.log("Mark As Read Message", formData)
    dispatch(markReadNotification(formData));
    setTimeout(() => {
      dispatch(getNotifaction())
    }, 1000)
    setOpenNotification(false);
  }



  useEffect(() => {
    if (
      menuPermissions?.filter(({ is_sidebar_menu }) => is_sidebar_menu === '1' || is_sidebar_menu === 1).length === 0
    ) {
      const timeout = setTimeout(() => {
        handleRedirect();
      }, 1000);

      return () => clearTimeout(timeout); // Cleanup
    }
  }, [menuPermissions, handleRedirect]);

  useEffect(() => {
    dispatch(getUserProfile()).then((res) => {
      setUserProfile(res?.payload?.data);
      // console.log("Thunk dispatched result:", res);
    });
  }, [dispatch])

  console.log("userProfile", userProfile)

  return (
    <>
      {/* Sidebar */}
      <div className={`dsbrd-sidebar-wrp  ${isSidebarOpen ? "active" : ""}`}>
        <div className="dsbrd-sidebar">
          <div className="dsbrdside-header">
            <div className="logo">
              <Link to="#" onClick={() => window.location.reload()}>
                <img src="./images/logo-white.svg" alt="Logo" />
              </Link>
            </div>
          </div>
          <div className={`dsbrd-sidebar-body ${isSidebarOpen ? "open" : ""}`}>
            <ul>
              {/* {
                menuPermissions?.filter(({ is_sidebar_menu }) => is_sidebar_menu === '1' || is_sidebar_menu === 1).length > 0 ? (
                  menuPermissions
                    ?.filter(({ is_sidebar_menu }) => is_sidebar_menu === '1' || is_sidebar_menu === 1)
                    .map(({ id, name: label, url: path, icon }) => (
                      <li
                        style={
                          isSubscribed ? {
                            cursor: 'pointer',
                            pointerEvents: 'auto',
                          } : {
                            cursor: 'not-allowed',
                            pointerEvents: 'none',
                          }
                        }
                        key={id}
                        className={location.pathname === path ? "current-menu-item" : ""}
                      >
                        <Link to={path} style={!isSubscribed ? {
                          color: '#504e4e'
                        } : {}}>
                          <img src={`./images/${icon}`} alt="Icon" />
                          {label}
                        </Link>
                      </li>
                    ))
                ) : (setTimeout(() => { handleRedirect() }, 1000))
              } */}
              {menuPermissions?.filter(({ is_sidebar_menu }) => is_sidebar_menu === '1' || is_sidebar_menu === 1).length > 0 ? (
                menuPermissions
                  ?.filter(({ is_sidebar_menu }) => is_sidebar_menu === '1' || is_sidebar_menu === 1)
                  .map(({ id, name: label, url: path, icon }) => (
                    <li
                      key={id}
                      style={
                        isSubscribed
                          ? { cursor: 'pointer', pointerEvents: 'auto' }
                          : { cursor: 'not-allowed', pointerEvents: 'none' }
                      }
                      className={location.pathname === path ? 'current-menu-item' : ''}
                    >
                      <Link to={path} style={!isSubscribed ? { color: '#504e4e' } : {}}>
                        <img src={`./images/${icon}`} alt="Icon" />
                        {label}
                      </Link>
                    </li>
                  ))
              ) : (
                <></> // Empty fragment while redirect is happening
              )}
            </ul>

          </div>
        </div>
      </div >
      {/* Header */}
      < div className={`ds-panel-header ${isSidebarOpen ? "active" : ""}`
      }>
        <div className="ds-panel-header-inr-wrp">
          <div className="sidebar-toggler">
            <button onClick={() => setSidebarOpen(!isSidebarOpen)}>
              <img src="./images/bars.svg" alt="Bars Icon" />
            </button>
          </div>
          <div className="ds-panel-hdr-right">
            {
              isSubscribed && (
                <>
                  <div className="notification" ref={bellRef} onClick={() => setOpenNotification(!openNotification)} style={{
                    backgroundColor: '#fff',
                    borderRight: '0px solid',
                    height: "1px"
                  }}>
                    {
                      <button className="notification-btn" style={{ position: 'relative', display: 'inline-block' }} >
                        {notification?.filter(n => n.is_read === 0).length > 0 && (
                          <span style={{
                            position: 'absolute',
                            top: '-1px',
                            right: '4px',
                            backgroundColor: 'red',
                            color: 'white',
                            borderRadius: '50%',
                            padding: '2px 6px',
                            fontSize: '10px',
                            fontWeight: 'bold',
                            minWidth: '10px',
                            textAlign: 'center',
                            lineHeight: '10px'
                          }}>
                            {notification?.filter(n => n.is_read === 0).length}
                          </span>
                        )
                        }
                        <img src="./images/bell-icon.svg" alt="Bell icon" />
                      </button>
                    }
                  </div>
                  <div style={{
                    width: '2px',
                    height: '50%',
                    backgroundColor: '#ddd',
                    marginTop: '8px',
                    marginRight: '8px'
                  }} />
                </>
              )}
            {openNotification && (
              <div
                className="notifications-card-wrp"
                ref={popupRef}
                style={{
                  position: 'absolute',
                  top: '68%',
                  right: '180px',
                  width: '415px',
                  backgroundColor: '#fff',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
                  zIndex: 1000,
                  marginTop: '8px',
                  padding: '10px',
                  gap: '10px',
                  maxHeight: '300px',
                  overflowY: 'auto',
                  overflowX: 'hidden',
                }}
              >
                {
                  notification?.filter(n => n.is_read === 0).length > 0 && (
                    <p style={{
                      fontSize: '14px',
                      marginBottom: '10px',
                      color: 'red'
                    }}>{notification?.filter(n => n.is_read === 0).length}  new notifications</p>
                  )
                }

                {notification?.length > 0 ? (
                  notification?.map((item, index) => {
                    const timeAgo = formatDistanceToNow(new Date(item?.created_at), { addSuffix: true });
                    return (
                      <div className="notification-card" key={index} style={{ display: 'flex', marginBottom: '12px', alignItems: 'flex-start' }}>
                        <div className="notification-card__icon" style={{ marginRight: '5px' }}>
                          <img src="./images/notification-icon.svg" alt="Notification" width="50px" />
                        </div>
                        <div className="notification-card__body" style={{ flex: 1, marginLeft: '5px' }}>
                          <h4 className="notification-card__title" style={{ fontSize: '14px', fontWeight: 600 }}>{item?.title || ""}</h4>
                          <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            gap: '10px',
                            flexWrap: 'wrap',
                            maxHeight: '40px',
                            overflowY: 'hidden',
                          }}>
                            <p className="notification-card__text" style={{
                              fontSize: '13px',
                              margin: 0,
                              fontWeight: item?.is_read == 1 ? '400' : '700',
                              flex: 1,
                              // lineHeight: '1.4',
                              wordBreak: 'break-word'
                            }} onClick={() => item?.is_read == 0 ? markAsReadMsg(item) : ''}>
                              {item?.message || ""}
                            </p>
                            <div className="notification-card__time" style={{ fontSize: '11px', color: '#888' }}>{timeAgo}</div>
                          </div >
                        </div>
                      </div>
                    );
                  })) : (
                  <div className="notification-card" style={{ display: 'flex', marginBottom: '12px', alignItems: 'flex-start' }}>
                    <div className="notification-card__body" style={{ flex: 1, marginLeft: '5px' }}>
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        gap: '10px',
                        flexWrap: 'wrap',
                        maxHeight: '40px',
                        overflowY: 'hidden',
                      }}>
                        <p style={{ fontSize: '13px', margin: 0, fontWeight: '400', color: '#5c5b5b' }}>
                          You don't have any notifications available!
                        </p>
                      </div >
                    </div>
                  </div>
                )}
              </div>
            )}
            <div className="dspnl-hdr-usr-ctrl" style={{

            }}>
              <div
                className="dspnlhdrusr-drpdn"
                onClick={() => setDropdownOpen(!isDropdownOpen)}
              >
                <p>{userProfile?.name ? userProfile?.name : ""}</p>
                <i className="fa-solid fa-chevron-down"></i>

                <div className="profile-conrol-menu" style={{
                  zIndex: 1000000000000,
                }}>
                  <ul>
                    <li>
                      {isSubscribed && (
                        <Link to="/my-profile">My Profile</Link>
                      )}
                    </li>
                    <li>
                      <Link to="/subscription-plan">My Subscription</Link>
                    </li>
                    <li>
                      <a href="" onClick={handleLogout}>Logout</a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div >
    </>
  );
};

export default Sidebar;