import { ErrorMessage, Field, Form, Formik } from "formik";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { login } from "../../../redux/slices/userSlice";
import ForgotPassword from "./ForgotPassword";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.user);
  const location = useLocation();
  console.log("location", location);
  useEffect(() => {
    if (JSON.parse(localStorage.getItem("trust-account"))?.token) {
      navigate("/bank-statement");
    }
  }, []);

  const [showPassword, setShowPassword] = useState(false);
  const [showForgetModal, setShowForgetModal] = useState(false);

  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    password: Yup.string()
      .required("Password is required")
      .min(8, "Password must be at least 8 characters")
      .matches(
        /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
        "Password must contain at least one letter, one number, and one special character"
      ),
  });

  const handleSubmit = async (values) => {
    const result = await dispatch(login(values))
    console.log("login result", result?.payload)
    localStorage.setItem("trust-account-subscription-plan", result?.payload?.subscription?.plan_id)
    localStorage.setItem("trust-account-subscription", JSON.stringify(result?.payload?.subscription))
    // console.log("login result",result.payload.subscription.plan_id)
    // console.log("login result",result.payload.subscription.is_subscription_active)
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
                    Don't have an account? <Link to="/signup">SIGN UP NOW</Link>
                  </div>
                </div>
                <div className="sign-up-right-inr">
                  <div className="signup-form-head">
                    <h2>Sign In</h2>
                  </div>
                  <div className="signup-form">
                    <Formik
                      initialValues={{
                        email: "",
                        password: "",
                      }}
                      validationSchema={validationSchema}
                      onSubmit={handleSubmit}
                    >
                      <Form>
                        <div className="form-fields">
                          <div className="input-grp">
                            <label>Email</label>
                            <Field
                              type="email"
                              name="email"
                              placeholder="Enter your Email"
                              autoComplete="off"
                            />
                            <ErrorMessage
                              name="email"
                              component="div"
                              className="error"
                            />
                          </div>
                          <div className="input-grp">
                            <label>Password</label>
                            <Field
                              type={showPassword ? "text" : "password"}
                              name="password"
                              placeholder="Enter your Password"
                              autoComplete="new-password"
                            />
                            <ErrorMessage
                              name="password"
                              component="div"
                              className="error"
                            />
                            <button type="button" className="toggle-btn" onClick={() => setShowPassword(!showPassword)} style={{
                              marginTop: '5px'
                            }}>
                              {
                                showPassword ? (<img src="./images/eye-open.png" alt="Icon" />) : (<><img src="./images/eye-open.png" alt="Icon" /> <div
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
                          </div>
                          <a style={{ cursor: "pointer" }} className="forgot-pass cursor-pointer" onClick={() => setShowForgetModal(true)}>
                            Forgot password ?
                          </a>
                        </div>
                        <input type="submit" value={loading ? "Logging..." : "GET STARTED"} />
                      </Form>
                    </Formik>
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
      <ForgotPassword show={showForgetModal} handleClose={() => setShowForgetModal(false)} />
    </div>
  );
};

export default Login;
