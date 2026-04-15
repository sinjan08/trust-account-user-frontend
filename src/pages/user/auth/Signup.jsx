import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { signup } from "../../../redux/slices/userSlice";

const Signup = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (JSON.parse(localStorage.getItem("trust-account"))?.token) {
      navigate("/bank-statement");
    }
  }, []);

  const { loading } = useSelector((state) => state.user);

  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    phone: Yup.string()
      .required("Phone number is required")
      .matches(/^[0-9]{10}$/, "Phone number must be exactly 10 digits"),
    password: Yup.string()
      .required("Password is required")
      .min(8, "Password must be at least 8 characters")
      .matches(
        /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
        "Password must contain at least one letter, one number, and one special character"
      ),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords must match")
      .required("Confirm Password is required"),
    agreeToTerms: Yup.boolean()
      .oneOf([true], "You must agree to the terms and conditions")
      .required("You must agree to the agreeToTerms and conditions"),
  });

  const formik = useFormik({
    initialValues: {
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
      agreeToTerms: false,
    },
    validationSchema,
    onSubmit: (values) => {
      dispatch(signup(values));
    },
  });

  const togglePasswordVisibility = () => {
    setPasswordVisible((prev) => !prev);
  };

  const toggleConfirmPasswordVisibility = () => {
    setConfirmPasswordVisible((prev) => !prev);
  };

  return (
    <div className="sign-up-sec">
      <div className="container-fluid">
        <div className="sign-up-inr">
          <div className="row">
            <div className="sign-up-left col-lg-5">
              <div className="sign-up-left-inr">
                <div className="sign-sec-head">
                  <h1>
                    Trust Account <span>Reconciliation</span>
                  </h1>
                </div>
                <div className="sign-img">
                  <img src="images/sign-up-img.png" alt="Image" />
                </div>
                <div className="sign-content-slider-wrp">
                  <div className="sign-content-slider">
                    <div className="sign-content-slider-item">
                      <div className="sign-content-slider-item-inr">
                        <p>
                          Simplifying trust account management by automating
                          monthly reconciliations with bank statements.
                        </p>
                      </div>
                    </div>
                    <div className="sign-content-slider-item">
                      <div className="sign-content-slider-item-inr">
                        <p>
                          Simplifying trust account management by automating
                          monthly reconciliations with bank statements.
                        </p>
                      </div>
                    </div>
                    <div className="sign-content-slider-item">
                      <div className="sign-content-slider-item-inr">
                        <p>
                          Simplifying trust account management by automating
                          monthly reconciliations with bank statements.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="sign-up-right col-lg-7">
              <div className="sign-right-inr-wrp">
                <div className="signup-top-head">
                  <div className="signup-option">
                    Already a Member? <Link to="/login">LOG IN NOW</Link>
                  </div>
                </div>
                <div className="sign-up-right-inr">
                  <div className="signup-form-head">
                    <p>LET'S GET YOU STARTED</p>
                    <h2>Create an Account</h2>
                  </div>
                  <div className="signup-form">
                    <form onSubmit={formik.handleSubmit}>
                      <div className="form-fields">
                        <div className="input-grp">
                          <label>Email</label>
                          <input
                            type="email"
                            name="email"
                            placeholder="Enter your Email"
                            value={formik.values.email}
                            {...formik.getFieldProps("email")}
                          />
                          {formik.touched.email && formik.errors.email ? (
                            <div className="text-danger">{formik.errors.email}</div>
                          ) : null}
                        </div>

                        <div className="input-grp">
                          <label>Phone</label>
                          <input
                            type="tel"
                            name="phone"
                            placeholder="Enter your Phone number"
                            value={formik.values.phone}
                            {...formik.getFieldProps("phone")}
                          />
                          {formik.touched.phone && formik.errors.phone ? (
                            <div className="text-danger">{formik.errors.phone}</div>
                          ) : null}
                        </div>
                        <div className="input-grp pass-match">
                          <label>Password</label>
                          <input
                            type={passwordVisible ? "text" : "password"}
                            name="password"
                            placeholder="Enter your Password"
                            value={formik.values.password}
                            {...formik.getFieldProps("password")}
                          />
                          <button
                            type="button"
                            className="toggle-btn"
                            onClick={togglePasswordVisibility}
                            style={{
                              marginTop: '5px'
                            }}
                          >
                            {
                              passwordVisible ? (<img src="./images/eye-open.png" alt="Icon" />) : (<><img src="./images/eye-open.png" alt="Icon" /> <div
                                style={{
                                 position: 'absolute',
                                    top: '50%',
                                    left: '3px',
                                    width: '70%',
                                    height: '2px',
                                    backgroundColor: '#808080',
                                    transform: 'rotate(-45deg)',
                                    transformOrigin: 'center',
                                    pointerEvents: 'none',
                                }}
                              ></div></>)
                            }
                            {/* <img
                              src="./images/eye-open.png"
                              alt="Toggle Password Visibility"
                            /> */}
                          </button>
                          {formik.touched.password && formik.errors.password ? (
                            <div className="text-danger">
                              {formik.errors.password}
                            </div>
                          ) : null}
                        </div>

                        <div className="input-grp pass-match">
                          <label>Confirm password</label>
                          <input
                            type={confirmPasswordVisible ? "text" : "password"}
                            name="confirmPassword"
                            placeholder="Re-type your Password"
                            value={formik.values.confirmPassword}
                            {...formik.getFieldProps("confirmPassword")}
                          />
                          <button
                            type="button"
                            className="toggle-btn"
                            onClick={toggleConfirmPasswordVisibility}
                            style={{
                              marginTop: '5px'
                            }}
                          >
                            {
                              confirmPasswordVisible ? (<img src="./images/eye-open.png" alt="Icon" />) : (<><img src="./images/eye-open.png" alt="Icon" /> <div
                                style={{
                                 position: 'absolute',
                                    top: '50%',
                                    left: '3px',
                                    width: '70%',
                                    height: '2px',
                                    backgroundColor: '#808080',
                                    transform: 'rotate(-45deg)',
                                    transformOrigin: 'center',
                                    pointerEvents: 'none',
                                }}
                              ></div></>)
                            }
                          </button>
                          {formik.touched.confirmPassword &&
                            formik.errors.confirmPassword ? (
                            <div className="text-danger">
                              {formik.errors.confirmPassword}
                            </div>
                          ) : null}
                        </div>

                        <div className="checkbox">
                          <label>
                            <input
                              type="checkbox"
                              name="agreeToTerms"
                              checked={formik.values.agreeToTerms}
                              {...formik.getFieldProps("agreeToTerms")}
                            />
                            I agree to the <Link to="/terms-conditions" style={{ marginLeft: '5px' }}>Terms & Conditions</Link>
                          </label>
                          {formik.touched.agreeToTerms && formik.errors.agreeToTerms ? (
                            <div className="text-danger">{formik.errors.agreeToTerms}</div>
                          ) : null}
                        </div>
                      </div>

                      <input type="submit" value={loading ? "Loading..." : "GET STARTED"} />
                    </form>
                  </div>
                </div>

                <div className="help-link">
                  <img src="images/i-btn.svg" alt="Help Icon" />
                  <a href="#url">Need help?</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
