import { useFormik } from "formik";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from 'yup';
import { exportToPDF } from "../../../components/user/GenerateReconciliationsCertificatPdf";
import { useAuth } from "../../../contexts/AuthContext";
import { fetchReconciliationReasons, getAllBank, getAllFirm, getAllReconciliation, saveDiscardReason, saveReconcileConfirmation } from "../../../redux/slices/reconciliationSlice";

const Reconciliation = () => {
  const { isSidebarOpen } = useAuth();
  const [isReconciliationOpen, setIsReconciliationOpen] = useState(false);
  const [genratedReconciliation, setGenratedReconciliation] = useState({});
  const [reasonInput, setReasonInput] = useState('');
  const [reasonBtn, setReasonBtb] = useState(false)
  const [reason, setReason] = useState('');
  const [allowCertificat, setAllowCertificat] = useState(false);
  const [strictsCertification, setStrictsCertification] = useState(true)
  const [bankSignePrivew, setBankSignePrivew] = useState('');
  const [attorneySignePrivew, setAttorneySignePrivew] = useState('');
  const { reconciliationReasons } = useSelector((state) => state?.reconciliation);
  const [readPermission, setReadPermission] = useState(0)
  const [addPermission, setAddPermission] = useState(0)
  const [editPermission, setEditPermission] = useState(0)
  const [deletePermission, setDeletePermission] = useState(0)
  const [reconcileReasons, setReconcileReasons] = useState([])
  //   const { permissionMenu } = useSelector((state) => state?.user)
  // localStorage.setItem("menuPermissions", JSON.stringify(permissionMenu));
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
  }, [permissionsList]);




  const today = new Date();
  const [bankFormData, setBankFormData] = useState({
    preparerName: "",
    position: "",
    signatureFile: null,
    date: `${String(today.getMonth() + 1).padStart(2, '0')}/${String(today.getDate()).padStart(2, '0')}/${today.getFullYear()}`
  });

  const [attorneyFormData, setAttorneyFormData] = useState({
    attorneyName: "",
    barNumber: "",
    signatureFile: null,
    date: `${String(today.getMonth() + 1).padStart(2, '0')}/${String(today.getDate()).padStart(2, '0')}/${today.getFullYear()}`
  });


  const [isJournalBalanceQ1Reconciled, setIsJournalBalanceQ1Reconciled] = useState(false);
  const [isLedgerAQ1Reconciled, setIsLedgerAQ1Reconciled] = useState(false);
  const [isLedgerAQ2Reconciled, setIsLedgerAQ2Reconciled] = useState(false);
  const [isLedgerBQ1Reconciled, setIsLedgerBQ1Reconciled] = useState(false);
  const [isBankStatementQ1Reconciled, setIsBankStatementQ1Reconciled] = useState(false);

  const [allYes, setAllYes] = useState({
    journal_balance_q1: false,
    ledger_a_q1: false,
    ledger_a_q2: false,
    ledger_b_q1: false,
    bank_statement_q1: false
  });


  useEffect(() => {
    if (reconciliationReasons) {
      setReconcileReasons(reconciliationReasons)
      reconciliationReasons?.is_journal_balance_q1_reconciled ? setIsJournalBalanceQ1Reconciled(true) : setIsJournalBalanceQ1Reconciled(false)
      reconciliationReasons?.is_ledger_a_q1_reconciled ? setIsLedgerAQ1Reconciled(true) : setIsLedgerAQ1Reconciled(false)
      reconciliationReasons?.is_ledger_a_q2_reconciled ? setIsLedgerAQ2Reconciled(true) : setIsLedgerAQ2Reconciled(false)
      reconciliationReasons?.is_ledger_b_q1_reconciled ? setIsLedgerBQ1Reconciled(true) : setIsLedgerBQ1Reconciled(false)
      reconciliationReasons?.is_bank_statement_q1_reconciled ? setIsBankStatementQ1Reconciled(true) : setIsBankStatementQ1Reconciled(false)
    }
  }, [reconciliationReasons])

  // console.log("genratedReconciliation", genratedReconciliation)

  const dispatch = useDispatch()
  const { data } = useSelector((state) => state.reconciliation.allFirmName)
  const allBank = useSelector((state) => state.reconciliation.allBankName.data);
  const formRef = useRef();

  useEffect(() => {
    if (isReconciliationOpen) {
      dispatch(fetchReconciliationReasons({
        firm_name: formik?.values?.firm_name,
        bank_name: formik?.values?.bank_name,
        account_name: formik?.values?.account_name,
        account_number: formik?.values?.account_number,
        start_date: formik?.values?.account_open_date,
        end_date: formik?.values?.account_close_date,
      }));
    }
  }, [isReconciliationOpen, dispatch])


  useEffect(() => {
    dispatch(getAllFirm())
    dispatch(getAllBank())
    //  dispatch(checkUserPermission())
  }, [dispatch])

  useEffect(() => {
    const allYesValuesTrue = Object.values(allYes).every(val => val === true);

    const attorneyFieldsFilled = Object.values(attorneyFormData).every(val => val !== null && val !== "");
    const bankFieldsFilled = Object.values(bankFormData).every(val => val !== null && val !== "");

    if (allYesValuesTrue && attorneyFieldsFilled && bankFieldsFilled) {
      setAllowCertificat(true);
    }
  }, [allYes, attorneyFormData, bankFormData]);


  const formik = useFormik({
    initialValues: {
      firm_name: '',
      bank_name: '',
      account_name: '',
      account_number: '',
      account_open_date: '',
      account_close_date: '',
    },
    validationSchema: Yup.object({
      firm_name: Yup.string().required('Firm Name is required'),
      bank_name: Yup.string().required('Bank Name is required'),
      account_name: Yup.string().required('Account Name is required'),
      account_number: Yup.number().required('Account Number is required'),
      account_open_date: Yup.string().required('Open Date is required'),
    }),
    onSubmit: async (values) => {
      // console.log('Submitted values:', values);
      const results = await dispatch(getAllReconciliation(values));
      if (results?.payload?.success) {
        setGenratedReconciliation(results?.payload?.data)
        setIsReconciliationOpen((prev) => !prev);
      }
    },
  });



  const handleAllYesOption = (key) => {
    let updatedState = {
      is_journal_balance_q1_reconciled: isJournalBalanceQ1Reconciled,
      is_ledger_a_q1_reconciled: isLedgerAQ1Reconciled,
      is_ledger_a_q2_reconciled: isLedgerAQ2Reconciled,
      is_ledger_b_q1_reconciled: isLedgerBQ1Reconciled,
      is_bank_statement_q1_reconciled: isBankStatementQ1Reconciled
    };

    switch (key) {
      case 'journal_balance_q1':
        updatedState.is_journal_balance_q1_reconciled = true;
        setIsJournalBalanceQ1Reconciled(true);
        break;
      case 'ledger_a_q1':
        updatedState.is_ledger_a_q1_reconciled = true;
        setIsLedgerAQ1Reconciled(true);
        break;
      case 'ledger_a_q2':
        updatedState.is_ledger_a_q2_reconciled = true;
        setIsLedgerAQ2Reconciled(true);
        break;
      case 'ledger_b_q1':
        updatedState.is_ledger_b_q1_reconciled = true;
        setIsLedgerBQ1Reconciled(true);
        break;
      case 'bank_statement_q1':
        updatedState.is_bank_statement_q1_reconciled = true;
        setIsBankStatementQ1Reconciled(true);
        break;
      default:
        return;
    }

    console.log("Updated State:", updatedState);

    dispatch(saveReconcileConfirmation({
      firm_name: formik?.values?.firm_name,
      bank_name: formik?.values?.bank_name,
      account_name: formik?.values?.account_name,
      account_number: formik?.values?.account_number,
      start_date: formik?.values?.account_open_date,
      end_date: formik?.values?.account_close_date,
      key,
      ...updatedState
    }));
  };



  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAttorneyFormData((prev) => ({
        ...prev,
        signatureFile: file,
      }));

      const reader = new FileReader();
      reader.onloadend = () => {
        setAttorneySignePrivew(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };



  const handleJournalBtnRes = (id) => {
    console.log("Id", id)
    setReasonInput(id)
    setReasonBtb((pre) => !pre)
  }


  const csvRequiredKeys = ['adjusted_bank_statement_balance', 'bank_charges_ledger_balance', 'bank_statement_ending_balance', "journal_balance",
    'total_individual_ledger_balance', 'total_ledger_balance', 'total_outstanding_deposits', 'total_outstanding_disbursment'
  ];

  // Format users and columns
  const csvData = Array.isArray(genratedReconciliation)
    ? genratedReconciliation.map((row) => {
      const filtered = {};
      csvRequiredKeys.forEach((key) => {
        if (key === 'date') {
          const date = new Date(row[key]);
          const formattedDate = date.toLocaleDateString('en-CA'); // 'YYYY-MM-DD'
          filtered[key] = formattedDate;
        } else {
          filtered[key] = row[key];
        }
      });
      return filtered;
    })
    : [];




  const handleReasonDataSubmit = async (key, val) => {
    const formData = new FormData();
    // Add conditional values for each question key
    const reportKeys = {
      journal_balance_q1: '',
      ledger_a_q1: '',
      ledger_a_q2: '',
      ledger_b_q1: '',
      bank_statement_q1: ''
    };

    // Set value for matching key
    Object.keys(reportKeys).forEach(k => {
      formData.append(k, k === key ? val : '');
    });

    // Add the rest of the fixed metadata fields
    formData.append('firm_name', formik?.values?.firm_name || "");
    formData.append('bank_name', formik?.values?.bank_name || "");
    formData.append('account_name', formik?.values?.account_name || "");
    formData.append('account_number', formik?.values?.account_number || "");
    formData.append('start_date', formik?.values?.account_open_date || "");
    formData.append('end_date', formik?.values?.account_close_date || "");
    // ✅ Debug log
    // for (let pair of formData.entries()) {
    //   console.log(pair[0] + ': ' + pair[1]);
    // }
    const res = await dispatch(saveDiscardReason(formData));
    console.log("res", res)
    if (res?.payload?.success || res?.payload?.includes("success")) {
      // ✅ Only update state if API success
      setAllYes(prev => ({
        ...prev,
        [key]: false
      }));
      setStrictsCertification(false)
      setAllowCertificat(false)
    }
  };

  const handleReasonSubmit = (key, resKey) => {
    handleReasonDataSubmit(resKey, reason);
    handleJournalBtnRes(key, reason);
    setReason("");
  };




  const handleBankSignature = (file) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setBankSignePrivew(reader.result);
    };
    reader.readAsDataURL(file);
  };



  const handleGenerateCertificat = () => {
    exportToPDF(genratedReconciliation, attorneyFormData, bankFormData, attorneySignePrivew, bankSignePrivew)
  }


  const formatCurrency = (value) => {
    if (isNaN(value) || value === null) return "$0.00";

    const number = Number(value);
    const formatted = Math.abs(number).toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

    return number < 0 ? `-$${formatted}` : `$${formatted}`;
  };


  return (
    <>
      <div className={`dashboard-body-wrp  ${isSidebarOpen ? " show active" : ""} reconciliation-pg`}>
        {isReconciliationOpen !== true ? (
          // <div style={{
          //   position: 'relative',
          //   overflow: !readPermission ? 'hidden' : '', // ✨ Add this
          //   height: !readPermission ? '74vh' : '',
          // }}>
          <div className="dashboard-body"
          // style={{
          //   filter: !readPermission ? 'blur(4px)' : 'none',
          //   pointerEvents: !readPermission ? 'none' : 'auto',
          //   userSelect: !readPermission ? 'none' : 'auto',
          //   opacity: !readPermission ? 0.6 : 1,
          //   height: readPermission ? 'auto' : '100vh', // avoid forcing viewport height when no access
          //   // overflow: 'hidden' // ✨ to prevent scroll within this div
          // }}

          >
            <div className="ds-bdy-head max">
              <h1>
                Monthly Trust Account Reconciliation and Review Certification
              </h1>
              <p>
                *REQUIRED BY STANDARD (1)(d) IN ACCORDANCE WITH SUBDIVISIONS
                (d)(3) and (e) OF RULE 1.15
              </p>
            </div>
            <div className="dsbdy-content">
              <form onSubmit={formik.handleSubmit}>
                <div className="account-journal-form row">
                  <div className="input-grp w-50">
                    <label htmlFor="firm_name">Firm Name</label>
                    <select
                      name="firm_name"
                      value={formik.values.firm_name}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    >
                      <option value="">Select firm</option>
                      {
                        data?.map((item, index) => (
                          <option
                            key={index}
                            value={item.firm_name}
                          >
                            {item.firm_name}
                          </option>
                        ))
                      }
                    </select>

                    {formik.touched.firm_name && formik.errors.firm_name && (
                      <div className="error">{formik.errors.firm_name}</div>
                    )}
                  </div>
                  <div className="input-grp w-50">
                    <label htmlFor="bank_name">Bank Name</label>
                    <select
                      name="bank_name"
                      value={formik.values.bank_name}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    >
                      <option value="">Select bank</option>
                      {
                        allBank?.map((item) =>
                          <option key={item.serial_no} value={item.bank_name}>
                            {item.bank_name}
                          </option>
                        )
                      }
                    </select>
                    {formik.touched.bank_name && formik.errors.bank_name && (
                      <div className="error">{formik.errors.bank_name}</div>
                    )}
                  </div>
                  <div className="input-grp w-50">
                    <label htmlFor="account_name">Account Name</label>
                    <input
                      type="text"
                      name="account_name"
                      placeholder="Enter Account Name"
                      value={formik.values.account_name}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                    {formik.touched.account_name && formik.errors.account_name && (
                      <div className="error">{formik.errors.account_name}</div>
                    )}
                  </div>

                  <div className="input-grp w-50">
                    <label htmlFor="account_number">Account Number</label>
                    <input
                      type="text"
                      name="account_number"
                      placeholder="Enter Account Number"
                      value={formik.values.account_number}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                    {formik.touched.account_number && formik.errors.account_number && (
                      <div className="error">{formik.errors.account_number}</div>
                    )}
                  </div>

                  <div className="multifiled-wrp">
                    <div className="input-grp">
                      <label htmlFor="account_open_date">Account Open Date</label>
                      <input style={{ paddingRight: "14px" }}
                        type="date"
                        name="account_open_date"
                        value={formik.values.account_open_date}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      />
                      {formik.touched.account_open_date && formik.errors.account_open_date && (
                        <div className="error">{formik.errors.account_open_date}</div>
                      )}
                    </div>

                    <div className="input-grp">
                      <label htmlFor="account_close_date">Account Close Date</label>
                      <input style={{ paddingRight: "14px" }}
                        type="date"
                        name="account_close_date"
                        value={formik.values.account_close_date}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      />
                    </div>
                  </div>
                </div>
                <div className="dsbdy-frm-btn-grp">
                  <button type="submit" className="cmn-btn-2 blue-bg">
                    Get result
                  </button>
                </div>
              </form>
            </div>
          </div>
          //   {!readPermission && (
          //     <div
          //       style={{
          //         position: 'absolute',
          //         top: '0',
          //         left: '0',
          //         height: '100%',
          //         width: '100%',
          //         background: 'rgba(255, 255, 255, 0.7)',
          //         display: 'flex',
          //         alignItems: 'center',
          //         justifyContent: 'center',
          //         fontSize: '1.8rem',
          //         fontWeight: 'bold',
          //         color: '#444',
          //         zIndex: 10,
          //         overflow: 'hidden'
          //       }}
          //     >
          //       You don't have permission to access this page
          //     </div>
          //   )}
          // </div >

        ) : (
          <div className="dashboard-body dsbrd-tbl-body">
            <form>
              <div className="back-btn-firm-records">
                <a href="#" onClick={() => {
                  setIsReconciliationOpen((prev) => !prev);
                  formik.resetForm()
                }}>
                  <img src="images/back-icon.svg" alt="Back icon" />
                </a>
                <div className="bank-charges-inr-btn-wrp">
                  {/* <a
                    href="./images/download-icon.svg"
                    download="./images/download-icon.svg"
                    className="cmn-btn"
                  >
                    <img src="./images/download-icon.svg" alt="" />
                    Download in pdf
                  </a> */}
                  <button className="cmn-btn"
                    onClick={(e) => { e.preventDefault(), handleGenerateCertificat() }}
                    disabled={!(strictsCertification && allowCertificat)}
                    style={{
                      backgroundColor: !(strictsCertification && allowCertificat) ? '#ccc' : '#3182CE',
                      cursor: !(strictsCertification && allowCertificat) ? 'not-allowed' : 'pointer',
                    }}
                  >Generate Certificat</button>
                  {/* <ReportDownloadDropdown name={'Download Report'} data={genratedReconciliation} csvData={csvData} csvRequiredKeys={csvRequiredKeys} reportName={'Reconciliation Report'} /> */}
                </div>
              </div>
              <div className="firm-records-heading">
                <h1>FIRM RECORDS - ACCOUNT BALANCES</h1>
              </div>

              {/* <!-- QUESTION SECTION WRAP --> */}
              <div className="question-ans-main-wrap">
                {/* <!-- QUIZ SEC --> */}
                <div className="quiz-sec">
                  <div className="question-head-wrap">
                    <h4>
                      <span className="counterquiz">1.</span> TRUST ACCOUNT JOURNAL
                      BALANCE
                    </h4>
                  </div>
                  <div className="answer-para-wrap">
                    <p>
                      Does each entry contain the information required by
                      Standard (1)(b), adopted pursuant to rule
                      <br /> 1.15(e)? (client name, date, amount, payor/payee,
                      current balance)
                    </p>
                  </div>
                  {!isJournalBalanceQ1Reconciled && (
                    <div className="yes-and-no-wrap">
                      <button type="button" onClick={() => handleJournalBtnRes('1')}>No</button>
                      <button type="button" onClick={() => handleAllYesOption('journal_balance_q1')}>Yes</button>
                    </div>
                  )}
                  {
                    reasonInput === '1' && reasonBtn && (
                      <div className="amount-sec">
                        <label style={{
                          fontSize: '15px',
                          color: 'black',
                          backgroundColor: 'white',
                        }}>
                          Reason
                        </label>
                        <form >
                          <input
                            type="text"
                            name="reason"
                            value={reason}
                            placeholder="Enter the reason"
                            onChange={(e) => setReason(e.target.value)}
                            style={{
                              border: '1px solid black',
                              width: "30%",
                              height: "35px",
                              color: "black",
                              paddingLeft: "10px",
                              borderRadius: "10px"
                            }}
                          />
                          <button
                            onClick={() => handleReasonSubmit('1', 'journal_balance_q1')}
                            type="button"
                            className="discard-button-submit"
                            style={{
                              marginLeft: "10px",
                              backgroundColor: "#000429",
                              color: "#fff",
                              borderRadius: "8px",
                              padding: "9px 16px",
                              fontWeight: "600",
                              textAlign: "center",
                              cursor: "pointer",
                              border: "none",
                              fontSize: "16px"
                            }}
                          >
                            Submit
                          </button>
                        </form>
                      </div>
                    )
                  }

                </div>
                {/* <!-- QUIZ SEC -->
                            <!-- AMOUNT SEC --> */}
                <div className="amount-sec">
                  <div className="amount-sec-wrap">
                    <span>{formatCurrency(genratedReconciliation?.journal_balance)}</span>
                  </div>
                </div>
                {/* <!-- AMOUNT SEC --> */}
              </div>
              <div className="question-ans-main-wrap">
                {/* <!-- QUIZ SEC --> */}
                <div className="quiz-sec">
                  <div className="question-head-wrap">
                    <h4 className="pb-2">
                      <span className="counterquiz">2.</span> TOTAL OF ALL
                      INDIVIDUAL LEDGER BALANCES
                    </h4>
                    <h5>
                      <span className="counterquiz">A.</span> Total Individual
                      Client Ledger Balances, including all undisbursed funds
                      pursuant to rule 1.15(c)(2)
                    </h5>
                  </div>
                  <div className="answer-para-wrap">
                    <p>
                      Do all of the client ledgers have a positive or zero
                      balance?
                      <br />
                      If no, attach an explanation, including any corrective
                      action taken.
                    </p>
                  </div>
                  {!isLedgerAQ1Reconciled && (
                    <div className="yes-and-no-wrap">
                      <button type="button" onClick={() => handleJournalBtnRes('2')}>No</button>
                      <button type="button" onClick={() => handleAllYesOption('ledger_a_q1')}>Yes</button>
                    </div>
                  )}

                  {
                    reasonInput == '2' && reasonBtn == true && (
                      <div className="amount-sec">
                        <label style={{

                          fontSize: '15px',
                          color: 'black',
                          backgroundColor: 'white',
                        }}>Reason</label>
                        <div>
                          <form >
                            <input
                              type="text"
                              name="reason"
                              value={reason}
                              placeholder="Enter the reason"
                              onChange={(e) => setReason(e.target.value)}
                              style={{
                                border: '1px solid black',
                                width: "30%",
                                height: "35px",
                                color: "black",
                                paddingLeft: "10px",
                                borderRadius: "10px"
                              }}
                            />
                            <button
                              onClick={() => handleReasonSubmit('2', 'ledger_a_q1')}
                              type="button"
                              className="discard-button-submit"
                              style={{
                                marginLeft: "10px",
                                backgroundColor: "#000429",
                                color: "#fff",
                                borderRadius: "8px",
                                padding: "9px 16px",
                                fontWeight: "600",
                                textAlign: "center",
                                cursor: "pointer",
                                border: "none",
                                fontSize: "16px"
                              }}
                            >
                              Submit
                            </button>
                          </form>
                        </div>
                      </div>
                    )

                  }
                  <div className="answer-para-wrap">
                    <p>
                      Does each entry contain the information required by
                      Standard (1)(b), adopted pursuant to rule
                      <br /> 1.15(e)? (date, amount, payor/payee, purpose,
                      current balance)
                      <br /> If no, attach an explanation, including any
                      corrective action taken.
                    </p>
                  </div>
                  {!isLedgerAQ2Reconciled && (
                    <div className="yes-and-no-wrap">
                      <button type="button" onClick={() => handleJournalBtnRes('3')}>No</button>
                      <button type="button" onClick={() => handleAllYesOption('ledger_a_q2')}>Yes</button>
                    </div>
                  )}
                  {
                    reasonInput == '3' && reasonBtn == true && (
                      <div className="amount-sec">
                        <label style={{

                          fontSize: '15px',
                          color: 'black',
                          backgroundColor: 'white',
                        }}>Reason</label>
                        <div>

                          <form >
                            <input
                              type="text"
                              name="reason"
                              value={reason}
                              placeholder="Enter the reason"
                              onChange={(e) => setReason(e.target.value)}
                              style={{
                                border: '1px solid black',
                                width: "30%",
                                height: "35px",
                                color: "black",
                                paddingLeft: "10px",
                                borderRadius: "10px"
                              }}
                            />
                            <button
                              onClick={() => handleReasonSubmit('3', 'ledger_a_q2')}
                              type="button"
                              className="discard-button-submit"
                              style={{
                                marginLeft: "10px",
                                backgroundColor: "#000429",
                                color: "#fff",
                                borderRadius: "8px",
                                padding: "9px 16px",
                                fontWeight: "600",
                                textAlign: "center",
                                cursor: "pointer",
                                border: "none",
                                fontSize: "16px"
                              }}
                            >
                              Submit
                            </button>
                          </form>


                        </div>
                      </div>
                    )

                  }
                </div>
                {/* <!-- QUIZ SEC -->
                            <!-- AMOUNT SEC --> */}
                <div className="amount-sec">
                  <div className="amount-sec-wrap">
                    <span>{formatCurrency(genratedReconciliation?.total_individual_ledger_balance)}</span>
                  </div>
                </div>
                {/* <!-- AMOUNT SEC -->
                            <!-- QUIZ SEC --> */}
                <div className="quiz-sec mt-3">
                  <div className="question-head-wrap">
                    <h5>
                      <span className="counterquiz">B.</span> Total Bank Charges
                      Balance in Trust Account
                    </h5>
                  </div>
                  <div className="answer-para-wrap">
                    <p>
                      In compliance with rule 1.15(c)(1), are the firm funds in
                      the account no more than reasonably
                      <br /> sufficient to pay bank charges?
                      <br /> If no, attach an explanation, including any
                      corrective action taken.
                    </p>
                  </div>
                  {!isLedgerBQ1Reconciled && (
                    <div className="yes-and-no-wrap">
                      <button type="button" onClick={() => handleJournalBtnRes('4')}>No</button>
                      <button type="button" onClick={() => handleAllYesOption('ledger_b_q1')}>Yes</button>
                    </div>
                  )}
                  {
                    reasonInput == '4' && reasonBtn == true && (
                      <div className="amount-sec">
                        <label style={{

                          fontSize: '15px',
                          color: 'black',
                          backgroundColor: 'white',
                        }}>Reason</label>
                        <div>

                          <form >
                            <input
                              type="text"
                              name="reason"
                              value={reason}
                              placeholder="Enter the reason"
                              onChange={(e) => setReason(e.target.value)}
                              style={{
                                border: '1px solid black',
                                width: "30%",
                                height: "35px",
                                color: "black",
                                paddingLeft: "10px",
                                borderRadius: "10px"
                              }}
                            />
                            <button
                              onClick={() => handleReasonSubmit('4', 'ledger_b_q1')}
                              type="button"
                              className="discard-button-submit"
                              style={{
                                marginLeft: "10px",
                                backgroundColor: "#000429",
                                color: "#fff",
                                borderRadius: "8px",
                                padding: "9px 16px",
                                fontWeight: "600",
                                textAlign: "center",
                                cursor: "pointer",
                                border: "none",
                                fontSize: "16px"
                              }}
                            >
                              Submit
                            </button>
                          </form>

                        </div>
                      </div>
                    )

                  }
                </div>
                {/* <!-- QUIZ SEC -->
                            <!-- AMOUNT SEC --> */}
                <div className="amount-sec">
                  <div className="amount-sec-wrap">
                    <span>{formatCurrency(genratedReconciliation?.bank_charges_ledger_balance)}</span>
                  </div>
                </div>
                {/* <!-- AMOUNT SEC --> */}
              </div>
              {/* <!-- QUESTION SECTION WRAP -->

                        <!-- QUESTION SECTION WRAP --> */}
              <div className="question-ans-main-wrap">
                {/* <!-- QUIZ SEC --> */}
                <div className="quiz-sec">
                  <div className="question-head-wrap">
                    <h4 className="pb-2">
                      TOTAL 2. INDIVIDUAL LEDGERS (A+B) (automatically
                      calculated)
                    </h4>
                  </div>
                </div>
                {/* <!-- QUIZ SEC -->
                            <!-- AMOUNT SEC --> */}
                <div className="amount-sec">
                  <div className="amount-sec-wrap">
                    <span>{formatCurrency(genratedReconciliation?.total_ledger_balance)}</span>
                  </div>
                </div>
                {/* <!-- AMOUNT SEC --> */}
              </div>
              {/* <!-- QUESTION SECTION WRAP --> */}

              <div className="firm-records-heading">
                <h1>BANK RECORDS - ACCOUNT BALANCES</h1>
              </div>

              {/* <!-- QUESTION SECTION WRAP --> */}
              <div className="question-ans-main-wrap">
                {/* <!-- QUIZ SEC --> */}
                <div className="quiz-sec">
                  <div className="question-head-wrap">
                    <h4>
                      <span className="counterquiz">3.</span> ADJUSTED BANK
                      STATEMENT BALANCE
                    </h4>
                  </div>
                </div>
                {/* <!-- QUIZ SEC --> */}
              </div>
              {/* <!-- QUESTION SECTION WRAP -->

                        <!-- QUESTION SECTION WRAP --> */}
              <div className="question-ans-main-wrap">
                {/* <!-- QUIZ SEC --> */}
                <div className="quiz-sec">
                  <div className="question-head-wrap">
                    <h5>
                      <span className="counterquiz">A.</span> Bank Statement Ending
                      Balance
                    </h5>
                  </div>
                </div>
                {/* <!-- QUIZ SEC -->
                            <!-- AMOUNT SEC --> */}
                <div className="amount-sec">
                  <div className="amount-sec-wrap">
                    <span>{formatCurrency(genratedReconciliation?.bank_statement_ending_balance)}</span>
                  </div>
                </div>
                {/* <!-- AMOUNT SEC --> */}
              </div>
              {/* <!-- QUESTION SECTION WRAP -->

                        <!-- QUESTION SECTION WRAP --> */}
              <div className="question-ans-main-wrap">
                {/* <!-- QUIZ SEC --> */}
                <div className="quiz-sec">
                  <div className="question-head-wrap">
                    <h5>
                      <span className="counterquiz">B.</span> Add Outstanding
                      Deposits (total deposits made to the account through the
                      end of bank statement period, but not reflected on bank
                      statement)
                    </h5>
                  </div>
                </div>
                {/* <!-- QUIZ SEC -->
                            <!-- AMOUNT SEC --> */}
                <div className="amount-sec">
                  <div className="amount-sec-wrap">
                    <span>{formatCurrency(genratedReconciliation?.total_outstanding_deposits)}</span>
                  </div>
                </div>
                {/* <!-- AMOUNT SEC --> */}
              </div>
              {/* <!-- QUESTION SECTION WRAP -->

                        <!-- QUESTION SECTION WRAP --> */}
              <div className="question-ans-main-wrap">
                {/* <!-- QUIZ SEC --> */}
                <div className="quiz-sec">
                  <div className="question-head-wrap">
                    <h5>
                      <span className="counterquiz">C.</span> Less Outstanding
                      Disbursements (checks and other disbursements made through
                      the end of the bank statement period, but not reflected in
                      bank statement)
                    </h5>
                  </div>
                </div>
                {/* <!-- QUIZ SEC -->
                            <!-- AMOUNT SEC --> */}
                <div className="amount-sec">
                  <div className="amount-sec-wrap">
                    <span>{formatCurrency(genratedReconciliation?.total_outstanding_disbursment)}</span>
                  </div>
                </div>
                {/* <!-- AMOUNT SEC --> */}
              </div>
              {/* <!-- QUESTION SECTION WRAP -->
              <!-- QUESTION SECTION WRAP --> */}
              <div className="question-ans-main-wrap">
                {/* <!-- QUIZ SEC --> */}
                <div className="quiz-sec">
                  <div className="question-head-wrap">
                    <h4>
                      TOTAL 3. (A+B-C) ADJUSTED BANK STATEMENT BALANCE
                      (automatically calculated)
                    </h4>
                  </div>
                  <div className="answer-para-wrap">
                    <p>
                      If no, your account is not reconciled. Identify the
                      error(s) and re-reconcile the account.
                    </p>
                  </div>
                  {!isBankStatementQ1Reconciled && (
                    <div className="yes-and-no-wrap">
                      <button type="button" onClick={() => handleJournalBtnRes('5')}>No</button>
                      <button type="button" onClick={() => handleAllYesOption('bank_statement_q1')}>Yes</button>
                    </div>
                  )}
                  {
                    reasonInput == '5' && reasonBtn == true && (
                      <div className="amount-sec">
                        <label style={{
                          fontSize: '15px',
                          color: 'black',
                          backgroundColor: 'white',
                        }}>Reason</label>
                        <div>

                          <form >
                            <input
                              type="text"
                              name="reason"
                              value={reason}
                              placeholder="Enter the reason"
                              onChange={(e) => setReason(e.target.value)}
                              style={{
                                border: '1px solid black',
                                width: "30%",
                                height: "35px",
                                color: "black",
                                paddingLeft: "10px",
                                borderRadius: "10px"
                              }}
                            />
                            <button
                              onClick={() => handleReasonSubmit('5', 'bank_statement_q1')}
                              type="button"
                              className="discard-button-submit"
                              style={{
                                marginLeft: "10px",
                                backgroundColor: "#000429",
                                color: "#fff",
                                borderRadius: "8px",
                                padding: "9px 16px",
                                fontWeight: "600",
                                textAlign: "center",
                                cursor: "pointer",
                                border: "none",
                                fontSize: "16px"
                              }}
                            >
                              Submit
                            </button>
                          </form>

                        </div>
                      </div>
                    )}
                </div>

                {/* <!-- QUIZ SEC -->
                <!-- AMOUNT SEC --> */}
                <div className="amount-sec">
                  <div className="amount-sec-wrap">
                    <span>{formatCurrency(genratedReconciliation?.adjusted_bank_statement_balance)}</span>
                  </div>
                </div>
                {/* <!-- AMOUNT SEC --> */}
              </div>
              {/* <!-- QUESTION SECTION WRAP --> */}
              <div className="firm-records-heading">
                <h1>BANK RECORDS - ACCOUNT BALANCES</h1>
                <div className="preparer-inr" ref={formRef}>
                  <div className="preparer-docs">
                    <div className="input-grp input-grp-custom">
                      <input
                        type="text"
                        placeholder="Preparer Name"
                        value={bankFormData.preparerName}
                        onChange={(e) => setBankFormData({ ...bankFormData, preparerName: e.target.value })}
                      />
                      <label>Preparer Name</label>
                    </div>
                    <div className="input-grp input-grp-custom">
                      <input
                        type="text"
                        placeholder="Position"
                        value={bankFormData.position}
                        onChange={(e) => setBankFormData({ ...bankFormData, position: e.target.value })}
                      />
                      <label>Position</label>
                    </div>
                    <div className="input-grp input-grp-custom">
                      <div className="input-grp-inr">
                        <span className="upload">Upload</span>
                        <input
                          type="file"
                          onChange={(e) => { handleBankSignature(e.target.files[0]), setBankFormData({ ...bankFormData, signatureFile: e.target.files[0] }) }}
                        />
                      </div>
                      <label>Signature</label>
                    </div>
                    <div className="input-grp input-grp-custom">
                      <div className="input-grp-inr">
                        <input
                          type="text"
                          className="date"
                          value={bankFormData.date}
                          readOnly
                        />
                      </div>
                      <label>Date</label>
                    </div>
                  </div>
                </div>
              </div>
              <div className="firm-records-heading mt-5">
                <h2>ATTORNEY CERTIFICATION</h2>
                <p className="firmhdng-txt">
                  I certify that I personally reviewed the above trust account
                  reconciliation report and all supporting documents listed
                  above, and understand this reconciliation is not deemed
                  complete until all discrepancies are resolved and balances
                  agree. I acknowledge that I have a nondelegable duty and bear
                  responsibility to ensure all funds are properly held,
                  regardless of who prepared the reconciliation.
                </p>
                <div className="preparer-inr" ref={formRef} >
                  <div className="preparer-docs">
                    <div className="input-grp input-grp-custom">
                      <input
                        type="text"
                        placeholder="Attorney Name"
                        value={attorneyFormData.attorneyName}
                        onChange={(e) => setAttorneyFormData({ ...attorneyFormData, attorneyName: e.target.value })}
                      />
                      <label>Attorney Name</label>
                    </div>
                    <div className="input-grp input-grp-custom">
                      <input
                        type="text"
                        placeholder="1313"
                        value={attorneyFormData.barNumber}
                        onChange={(e) => setAttorneyFormData({ ...attorneyFormData, barNumber: e.target.value })}
                      />
                      <label>Bar Number</label>
                    </div>
                    <div className="input-grp input-grp-custom">
                      <div className="input-grp-inr">
                        <span className="upload">Upload</span>
                        <input type="file" onChange={handleFileChange} />
                      </div>
                      <label>Signature</label>
                    </div>
                    <div className="input-grp input-grp-custom">
                      <div className="input-grp-inr">
                        <input
                          type="text"
                          className="date"
                          value={attorneyFormData.date}
                          readOnly
                        />
                      </div>
                      <label>Date</label>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>
        )}
      </div>
    </>
  );
};

export default Reconciliation;
