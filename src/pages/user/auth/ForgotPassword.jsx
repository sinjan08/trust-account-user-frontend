// Importing necessary packages
import { useFormik } from "formik"; // For form handling and validation
import { useEffect, useRef, useState } from "react"; // React hooks for state, refs, and side-effects
import { Button, Form, InputGroup, Modal } from "react-bootstrap"; // Bootstrap components
import { useDispatch } from "react-redux"; // Redux dispatch for actions
import * as Yup from "yup"; // For form validation schemas
import { forgotPassword, resetPassword, verifyOtp } from "../../../redux/slices/userSlice"; // Redux slice actions

// Styling for input fields
const inputStyle = {
  borderRadius: '10px',
  padding: '12px 14px',
  fontSize: '14px',
  border: '1.5px solid #000',
  width: '100%',
  color: 'black',
  backgroundColor: 'white',
  outline: 'none',
  boxShadow: 'none',
};

// Styling for labels
const labelStyle = {
  position: 'absolute',
  top: '40px',
  left: '28px',
  background: 'white',
  padding: '0 5px',
  fontSize: '16px',
  color: '#000429',
  zIndex: 1
}

// Main component
const ForgotPassword = ({ show, handleClose }) => {
  const dispatch = useDispatch(); // Redux dispatch for triggering actions

  // Local state
  const [timer, setTimer] = useState(300); // OTP timer in seconds
  const [resendEnabled, setResendEnabled] = useState(false); // Flag for enabling resend button
  const [step, setStep] = useState(1); // Step tracker: 1 -> Email, 2 -> OTP, 3 -> Reset Password
  const [proccessing, setProcessing] = useState(false); // Loading indicator
  const [disableButton, setDisableButton] = useState(false); // Button disable flag
  const [email, setEmail] = useState(""); // Store email across steps
  const [passwordVisible, setPasswordVisible] = useState(false); // Toggle new password visibility
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false); // Toggle confirm password visibility

  // Functions to toggle password visibility
  const togglePasswordVisibility = () => setPasswordVisible(!passwordVisible);
  const toggleConfirmPasswordVisibility = () => setConfirmPasswordVisible(!confirmPasswordVisible);

  // -----------------------------------------------------------
  // STEP 1 -> Send Forgot Password Email
  // -----------------------------------------------------------
  const sendEmailformik = useFormik({
    initialValues: { email: "" },
    validationSchema: Yup.object({
      email: Yup.string().email("Invalid email address").required("Email is required")
    }),
    onSubmit: async (values) => {
      setProcessing(true); // Start loading
      setDisableButton(true); // Disable submit button

      const response = await dispatch(forgotPassword(values)); // Dispatch forgotPassword action

      setProcessing(false); // Stop loading
      setDisableButton(false); // Enable button

      if (response?.payload?.success) {
        setEmail(values.email); // Save email for next steps
        setStep(2); // Move to OTP step
        sendEmailformik.resetForm();
      } else {
        setStep(1); // Stay on current step on failure
      }
    }
  });

  // OTP input refs for focusing next/prev input
  const otpRefs = Array(4).fill(null).map(() => useRef(null));

  // -----------------------------------------------------------
  // STEP 2 -> Verify OTP
  // -----------------------------------------------------------
  const verifyOtpFormik = useFormik({
    initialValues: { otp1: "", otp2: "", otp3: "", otp4: "" },
    validationSchema: Yup.object({
      otp1: Yup.string().required("OTP is required"),
      otp2: Yup.string().required("OTP is required"),
      otp3: Yup.string().required("OTP is required"),
      otp4: Yup.string().required("OTP is required"),
    }),
    onSubmit: async (values) => {
      setProcessing(true);
      setDisableButton(true);

      const otp = `${values.otp1}${values.otp2}${values.otp3}${values.otp4}`; // Concatenate OTP

      const response = await dispatch(verifyOtp({ email, otp }));

      setProcessing(false);
      setDisableButton(false);

      if (response?.payload?.success) {
        verifyOtpFormik.resetForm();
        setStep(3); // Move to reset password
      } else {
        setStep(2); // Stay on OTP step on failure
      }
    }
  });

  // Countdown timer for resend OTP
  useEffect(() => {
    if (timer <= 0) {
      setResendEnabled(true);
      return;
    }

    const interval = setInterval(() => setTimer(prev => prev - 1), 1000);
    return () => clearInterval(interval);
  }, [timer]);

  // Handle resend OTP click
  const handleResendOtp = (e) => {
    e.preventDefault();
    if (!resendEnabled) return;

    setProcessing(true);
    setDisableButton(true);

    dispatch(forgotPassword({ email })); // Resend OTP

    setProcessing(false);
    setDisableButton(false);

    setTimer(300); // Reset timer
    setResendEnabled(false);
  };

  // Format timer in mm:ss
  const formatTime = (seconds) => {
    const min = String(Math.floor(seconds / 60)).padStart(2, "0");
    const sec = String(seconds % 60).padStart(2, "0");
    return `${min}:${sec}`;
  };

  // Handle OTP input change
  const handleOtpChange = (e, index) => {
    const value = e.target.value;
    if (!/^\d?$/.test(value)) return; // Only allow single digit

    verifyOtpFormik.setFieldValue(`otp${index + 1}`, value);

    // Auto-focus next input
    if (value && index < otpRefs.length - 1) {
      otpRefs[index + 1]?.current?.focus();
    }
  };

  // Handle OTP backspace and navigation
  const handleOtpKeyDown = (e, index) => {
    if (e.key === "Backspace" && !verifyOtpFormik.values[`otp${index + 1}`] && index > 0) {
      otpRefs[index - 1]?.current?.focus(); // Focus previous input
    }
  };

  // -----------------------------------------------------------
  // STEP 3 -> Reset Password
  // -----------------------------------------------------------
  const resetPasswordFormik = useFormik({
    initialValues: { newPassword: "", confirmPassword: "" },
    validationSchema: Yup.object({
      newPassword: Yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
      confirmPassword: Yup.string().oneOf([Yup.ref('newPassword'), null], 'Passwords must match').required('Confirm Password is required'),
    }),
    onSubmit: async (values) => {
      setProcessing(true);
      setDisableButton(true);

      const response = await dispatch(resetPassword({ email, newPassword: values.newPassword, confirmPassword: values.confirmPassword }));

      setProcessing(false);
      setDisableButton(false);

      if (response?.payload?.success) {
        handleClose(); // Close modal
        setStep(1); // Reset step
        setEmail(""); // Clear email
        resetPasswordFormik.resetForm();
        setTimer(300); // Reset timer
      } else {
        setStep(1); // Go back to email step on failure
      }
    }
  });

  // -----------------------------------------------------------
  // JSX Rendering
  // -----------------------------------------------------------
  return (
    <Modal
      centered
      size="md"
      show={show}
      style={{ zIndex: '100000000000000000000000' }} // High z-index to stay on top
      onHide={() => { setStep(1); handleClose(); }} // Reset on close
      dialogClassName="custom-forgot-modal"
    >
      <div style={{ display: "flex", justifyContent: "flex-end", borderRadius: "10px", maxWidth: "100%" }}>
        <div className="close-btn" onClick={() => { setStep(1); handleClose() }}>X</div>
      </div>

      <Modal.Header className="border-0 pb-0">
        <Modal.Title className="w-100 text-center fw-bold fs-2 text-dark mb-4">
          {step === 1 ? "Forgot Password" : step === 2 ? "Verification Code" : "Reset Password"}
        </Modal.Title>
      </Modal.Header>

      <Modal.Body className="text-center pt-2">
        {/* STEP 1 -> Email Input */}
        {step === 1 && (
          <>
            <p className="text-muted mb-4">Enter the Email/Phone number associated with your account.</p>
            <Form onSubmit={sendEmailformik.handleSubmit}>
              <Form.Group>
                <Form.Label style={labelStyle}>Email/Phone</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Enter your Email/Phone"
                  style={inputStyle}
                  value={sendEmailformik.values.email}
                  {...sendEmailformik.getFieldProps("email")}
                />
                {sendEmailformik.touched.email && sendEmailformik.errors.email && (
                  <div className="text-danger">{sendEmailformik.errors.email}</div>
                )}
              </Form.Group>
              <Button disabled={disableButton} type="submit" className="mt-4 w-40">
                {proccessing ? "Sending OTP..." : "Submit"}
              </Button>
            </Form>
          </>
        )}

        {/* STEP 2 -> OTP Verification */}
        {step === 2 && (
          <Form onSubmit={verifyOtpFormik.handleSubmit}>
            <p className="text-muted mb-3">Enter the 4-digit verification code sent to your email.</p>
            <div className="d-flex justify-content-between items-center gap-4 mb-3 otp-input-group">
              {[0, 1, 2, 3].map((i) => (
                <Form.Control
                  key={i}
                  ref={otpRefs[i]}
                  type="text"
                  name={`otp${i + 1}`}
                  maxLength="1"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  value={verifyOtpFormik.values[`otp${i + 1}`]}
                  onChange={(e) => handleOtpChange(e, i)}
                  onKeyDown={(e) => handleOtpKeyDown(e, i)}
                  className="otp-input"
                  style={{
                    border: '1px solid #787777',
                    color: '#000',
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: '10px',
                    borderRadius: '10px',
                    textAlign: 'center',
                    fontWeight: '400',
                  }}
                />
              ))}
            </div>
            <div style={{ textAlign: "right", marginTop: "20px" }}>
              <button
                className="bg-transparent border-none"
                onClick={handleResendOtp}
                disabled={!resendEnabled}
                style={{ fontSize: "13px", fontFamily: "poppins", marginRight: "60px", cursor: resendEnabled ? "pointer" : "not-allowed", color: resendEnabled ? "#007bff" : "#999" }}
              >
                Resend OTP
              </button>
            </div>
            <div className="text-center mt-2">
              {!resendEnabled && <div style={{ fontSize: "16px", fontFamily: "poppins", color: "#555" }}>Resend verification code in {formatTime(timer)} secs</div>}
            </div>
            <Button disabled={disableButton} type="submit" className="mt-4 w-40">{proccessing ? "Verifying OTP..." : "Submit"}</Button>
          </Form>
        )}

        {/* STEP 3 -> Reset Password */}
        {step === 3 && (
          <Form onSubmit={resetPasswordFormik.handleSubmit}>
            <Form.Group>
              <Form.Label className="float-start">Create Password</Form.Label>
              <InputGroup>
                <Form.Control
                  type={passwordVisible ? "text" : "password"}
                  name="password"
                  value={resetPasswordFormik.values.newPassword}
                  placeholder="Create a new password"
                  {...resetPasswordFormik.getFieldProps("newPassword")}
                  style={{ border: '1px solid rgb(151, 149, 149)', color: 'black' }}
                />
                <Button variant="outline-secondary" onClick={togglePasswordVisibility} type="button">
                  {passwordVisible ? (
                    <img src="./images/eye-open.png" alt="Icon" />
                  ) : (
                    <>
                      <img src="./images/eye-open.png" alt="Icon" />
                      <div style={{
                        position: 'absolute',
                        top: '52%',
                        left: '10px',
                        width: '50%',
                        height: '2px',
                        backgroundColor: '#808080',
                        transform: 'rotate(-45deg)',
                        transformOrigin: 'center',
                        pointerEvents: 'none',
                      }}></div>
                    </>
                  )}
                </Button>
              </InputGroup>
              {resetPasswordFormik.touched.newPassword && resetPasswordFormik.errors.newPassword && (
                <div className="text-danger">{resetPasswordFormik.errors.newPassword}</div>
              )}
            </Form.Group>

            <Form.Group className="mt-3">
              <Form.Label className="float-start">Confirm Password</Form.Label>
              <InputGroup>
                <Form.Control
                  type={confirmPasswordVisible ? "text" : "password"}
                  name="confirmPassword"
                  value={resetPasswordFormik.values.confirmPassword}
                  placeholder="Confirm your password"
                  {...resetPasswordFormik.getFieldProps("confirmPassword")}
                  style={{ border: '1px solid rgb(151, 149, 149)', color: 'black' }}
                />
                <Button variant="outline-secondary" onClick={toggleConfirmPasswordVisibility} type="button">
                  {confirmPasswordVisible ? (
                    <img src="./images/eye-open.png" alt="Icon" />
                  ) : (
                    <>
                      <img src="./images/eye-open.png" alt="Icon" />
                      <div style={{
                        position: 'absolute',
                        top: '52%',
                        left: '10px',
                        width: '50%',
                        height: '2px',
                        backgroundColor: '#808080',
                        transform: 'rotate(-45deg)',
                        transformOrigin: 'center',
                        pointerEvents: 'none',
                      }}></div>
                    </>
                  )}
                </Button>
              </InputGroup>
              {resetPasswordFormik.touched.confirmPassword && resetPasswordFormik.errors.confirmPassword && (
                <div className="text-danger">{resetPasswordFormik.errors.confirmPassword}</div>
              )}
            </Form.Group>

            <Button disabled={disableButton} type="submit" className="mt-4 w-40">{proccessing ? "Changing Password..." : "Submit"}</Button>
          </Form>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default ForgotPassword; // Exporting component
