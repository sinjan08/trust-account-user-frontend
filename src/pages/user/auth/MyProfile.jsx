import { useFormik } from 'formik';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useAuth } from '../../../contexts/AuthContext';
import { getUserProfile } from '../../../redux/slices/User/userSlice';
import { checkUserPermission, deleteUser, updateUserProfile } from '../../../redux/slices/userSlice';
import { toast } from 'react-toastify';
import * as Yup from 'yup';
import { useLocation } from 'react-router-dom';

const MyProfile = () => {
    const { profile } = useSelector(state => state.user);
    const { isSidebarOpen, isLogedinData, user } = useAuth();
    const [userData, setUserData] = useState(null);
    const [userProfile, setUserProfile] = useState(null);
    const [readPermission, setReadPermission] = useState(0)
    const [addPermission, setAddPermission] = useState(0)
    const [editPermission, setEditPermission] = useState(0)
    const [deletePermission, setDeletePermission] = useState(0);
    const [editProfile, setEditProfile] = useState(false);
    const location = useLocation()
    // console.log("readPermission", readPermission, "addPermission", addPermission, "editPermission", editPermission, "deletePermission", deletePermission)

    const permissionsList = JSON.parse(localStorage.getItem('menuPermissions') || '[]');
    useEffect(() => {
        const currentPath = window.location.pathname;
        const matched = permissionsList.find((item) => item.url === currentPath);

        if (matched) {
            setReadPermission(matched?.has_read_permission || 0);
            setAddPermission(matched?.has_add_permission || 0);
            setEditPermission(matched?.has_edit_permission || 0);
            setDeletePermission(matched?.has_delete_permission || 0);
        } else {
            setReadPermission(0);
            setAddPermission(0);
            setEditPermission(0);
            setDeletePermission(0);
        }
    }, []);


    const dispatch = useDispatch();
    useEffect(() => {
        const loggedInUser = JSON.parse(localStorage.getItem("trust-account"));
        setUserData(loggedInUser?.userData || {});
    }, []);

    const validationSchema = Yup.object().shape({
        name: Yup.string().required('Name is required'),
        email: Yup.string().email('Invalid email').required('Email is required'),
        phone: Yup.string()
            .matches(/^\d{10}$/, 'Phone number must be 10 digits')
            .required('Phone is required')
            .min(10, 'Phone must be at least 10 digits'),
        oldPassword: Yup.string(),
        newPassword: Yup.string().min(6, 'Password must be at least 6 characters'),
        full_name: Yup.string().required('Full name is required'),
        bank_name: Yup.string().required('Bank name is required'),
        account_no: Yup.string()
            .matches(/^\d+$/, 'Account number must be digits only')
            .required('Account number is required'),
        routing_no: Yup.string()
            .matches(/^\d+$/, 'Routing number must be digits only')
            .required('Routing number is required'),
    });

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            userid: userData?.userid || '',
            name: userProfile?.name || '',
            email: userProfile?.email || '',
            phone: userProfile?.phone || '',
            oldPassword: '',
            newPassword: '',
            full_name: userProfile?.full_name || '',
            bank_name: userProfile?.bank_name || '',
            account_no: userProfile?.account_no || '',
            routing_no: userProfile?.routing_no || '',
        },
        validationSchema: editProfile ? validationSchema : null,
        // validationSchema, // ✅ Apply schema here
        onSubmit: (values) => {
            dispatch(checkUserPermission()).then((res) => {
                console.log(" result:", res.payload.data.permissions);
                const matched = res?.payload?.data?.permissions?.find((item) => item.url === location.pathname);
                // console.log("permissionsListlghdfiohofdhkfghk", permissionsList)
                if (!(matched?.has_edit_permission === '1' || matched?.has_edit_permission === 1)) {
                    toast.error('You do not have permission to view this lien.');
                    return;
                }
                formik.dirty ? dispatch(updateUserProfile(values)) : toast.error('plese select something to edit');
            }).catch((err) => {
                console.log(err)
            });
        },
    });

    useEffect(() => {
        dispatch(checkUserPermission())
        dispatch(getUserProfile()).then((res) => {
            setUserProfile(res?.payload?.data);
            // console.log("Thunk dispatched result:", res);
        });
    }, [dispatch]);

    const handleDelete = () => {
        dispatch(checkUserPermission()).then((res) => {
            const matched = res?.payload?.data?.permissions?.find((item) => item.url === location.pathname);
            if (!(matched?.has_delete_permission === '1' || matched?.has_delete_permission === 1)) {
                toast.error('You do not have permission to view this lien.');
                return;
            }
            const userid = userProfile?.user_id || ''
            dispatch(deleteUser(userid))
        }).catch((err) => {
            console.log(err)
        });
    };

    // useEffect(() => { 
    //     setChangeFields(true)
    //  }, [changeFields])

    // console.log("object", changeFields)

    return (
        <div className={`dashboard-body-wrp show ${isSidebarOpen ? " active" : ""}`}>
            <div className="dashboard-body">
                <div className="ds-bdy-head max">
                    <h1>My Profile</h1>
                </div>
                <form onSubmit={formik.handleSubmit}>
                    <div className="my-profile-form-in">
                        <div className="col-lg-12">
                            <div className="first-section">
                                <h4>Personal Detail</h4>
                                <div className="row">
                                    <div className="col-lg-6">
                                        <label>
                                            <h3>Name</h3>
                                            <input
                                                type="text"
                                                name="name"
                                                placeholder="Enter Name"
                                                value={formik.values.name}
                                                onChange={(e) => {
                                                    formik.handleChange(e);
                                                    // setChangeFields(true);
                                                }}
                                                readOnly={editProfile ? false : true}
                                            />
                                        </label>
                                    </div>
                                    <div className="col-lg-6">
                                        <label>
                                            <h3>Email</h3>
                                            <input
                                                type="text"
                                                name="email"
                                                placeholder="Enter Email"
                                                value={formik.values.email}
                                                onChange={(e) => {
                                                    formik.handleChange(e);
                                                    // setChangeFields(true);
                                                }}
                                                readOnly={editProfile ? false : true}
                                            />
                                        </label>
                                    </div>
                                    <div className="col-lg-6">
                                        <label>
                                            <h3>Phone Number</h3>
                                            <input
                                                type="number"
                                                name="phone"
                                                placeholder="Enter Phone Number"
                                                value={formik.values.phone}
                                                onChange={(e) => {
                                                    formik.handleChange(e);
                                                    // setChangeFields(true);
                                                }}
                                                style={{
                                                    // backgroundColor: '#eef4ff',       // Light blue, same as password input
                                                    border: 'none',
                                                    borderRadius: '10px',
                                                    height: '45px',
                                                    padding: '12px 16px',
                                                    width: '100%',
                                                    boxShadow: '0px 1px 4px rgba(0, 0, 0, 0.6)',
                                                    fontSize: '16px',
                                                    outline: 'none',
                                                    fontWeight: '500',
                                                    color: '#444444'
                                                }}
                                                readOnly={editProfile ? false : true}
                                            />
                                        </label>
                                        {formik.touched.phone && formik.errors.phone && (
                                            <div className="error" style={{ color: 'red', fontSize: '12px' }}>
                                                {formik.errors.phone}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="second-section">
                                <h4>Change Password</h4>
                                <div className="row">
                                    <div className="col-lg-6">
                                        <label>
                                            <h3>Old Password</h3>
                                            <input
                                                type="password"
                                                name="oldPassword"
                                                value={formik.values.oldPassword}
                                                onChange={(e) => {
                                                    formik.handleChange(e);
                                                    // setChangeFields(true);
                                                }}
                                                placeholder="Enter Old Password"
                                                style={{
                                                    // backgroundColor: '#eef4ff',       // Light blue, same as password input
                                                    border: 'none',
                                                    borderRadius: '10px',
                                                    height: '45px',
                                                    padding: '12px 16px',
                                                    width: '100%',
                                                    boxShadow: '0px 1px 4px rgba(0, 0, 0, 0.6)',
                                                    fontSize: '16px',
                                                    outline: 'none',
                                                    fontWeight: '500',
                                                    color: '#444444'
                                                }}
                                                readOnly={editProfile ? false : true}
                                            />
                                        </label>
                                    </div>
                                    <div className="col-lg-6">
                                        <label>
                                            <h3>New Password</h3>
                                            <input
                                                type="password"
                                                name="newPassword"
                                                value={formik.values.newPassword}
                                                onChange={(e) => {
                                                    formik.handleChange(e);
                                                    // setChangeFields(true);
                                                }}
                                                placeholder="Enter New Password"
                                                style={{
                                                    // backgroundColor: '#eef4ff',       // Light blue, same as password input
                                                    border: 'none',
                                                    borderRadius: '10px',
                                                    padding: '12px 16px',
                                                    height: "45px",
                                                    width: '100%',
                                                    boxShadow: '0px 1px 4px rgba(0, 0, 0, 0.6)',
                                                    fontSize: '16px',
                                                    outline: 'none',
                                                    fontWeight: '500',
                                                    color: '#444444'
                                                }}
                                                readOnly={editProfile ? false : true}
                                            />
                                        </label>
                                    </div>
                                </div>
                            </div>
                            <div className="third-section">
                                <h4>My Bank Details</h4>
                                <div className="row">
                                    <div className="col-lg-6">
                                        <label>
                                            <h3>Full Name</h3>
                                            <input
                                                type="text"
                                                name="full_name"
                                                placeholder="Enter Full Name"
                                                value={formik.values.full_name}
                                                onChange={(e) => {
                                                    formik.handleChange(e);
                                                    // setChangeFields(true);
                                                }}
                                                readOnly={editProfile ? false : true}
                                            />
                                        </label>
                                    </div>
                                    <div className="col-lg-6">
                                        <label>
                                            <h3>Bank Name</h3>
                                            <input
                                                type="text"
                                                name="bank_name"
                                                placeholder="Enter Bank Name"
                                                value={formik.values.bank_name}
                                                onChange={(e) => {
                                                    formik.handleChange(e);
                                                    // setChangeFields(true);
                                                }}
                                                readOnly={editProfile ? false : true}
                                            />
                                        </label>
                                    </div>
                                    <div className="col-lg-6">
                                        <label>
                                            <h3>Account Number</h3>
                                            <input
                                                type="number"
                                                name="account_no"
                                                placeholder="Enter Account Number"
                                                value={formik.values.account_no}
                                                onChange={(e) => {
                                                    formik.handleChange(e);
                                                    // setChangeFields(true);
                                                }}
                                                style={{
                                                    // backgroundColor: '#eef4ff',       // Light blue, same as password input
                                                    border: 'none',
                                                    borderRadius: '10px',
                                                    height: '45px',
                                                    padding: '12px 16px',
                                                    width: '100%',
                                                    boxShadow: '0px 1px 4px rgba(0, 0, 0, 0.6)',
                                                    fontSize: '16px',
                                                    outline: 'none',
                                                    fontWeight: '500',
                                                    color: '#444444'
                                                }}
                                                readOnly={editProfile ? false : true}
                                            />
                                        </label>
                                    </div>
                                    <div className="col-lg-6">
                                        <label>
                                            <h3>Routing Number</h3>
                                            <input
                                                type="text"
                                                name="routing_no"
                                                placeholder="Enter Routing Number"
                                                value={formik.values.routing_no}
                                                onChange={(e) => {
                                                    formik.handleChange(e);
                                                    // setChangeFields(true);
                                                }}
                                                readOnly={editProfile ? false : true}
                                            />
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="bank-charges-btns" role="button" onClick={() => setEditProfile(true)}>
                            <button
                                type="submit"
                                className="btn btn-primary"
                                style={{
                                    backgroundColor: '#3182CE',
                                    borderRadius: '13px',
                                    fontSize: '16px',
                                    height: '56px',
                                    width: '100%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    textTransform: 'none'
                                }}
                            >
                                {editProfile ? "Save Changes" : "Edit Profile"}
                                {/* {formik.dirty ? "Save Changes" : "Edit Profile"} */}

                            </button>
                        </div>

                    </div>
                </form>
                <div className="delete-acount-wrap" onClick={handleDelete}>
                    <a href="#">Delete Account</a>
                </div>
            </div>
        </div>
    );
};

export default MyProfile;