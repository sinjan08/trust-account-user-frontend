import { useFormik } from "formik";
import { useEffect, useState } from "react";
import {
    Button,
    Form,
    Modal,
} from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";
import { getAllCases, getJournalEntries, insertJournalEntry, updateJournal } from "../../redux/slices/journalSlice";



const labelStyle = {
    fontSize: '14px',
    fontWeight: '500',
    color: '#000429',
    marginBottom: '4px',
    marginRight: "-12px"
};

const inputStyle = {
    // padding: '10px 12px',
    border: '1px solid rgb(84, 84, 87)',
    borderRadius: '14px',
    fontSize: '12px',
    color: '#0b0c2a',
    outline: 'none',
    height: '40px',
    cursor: 'pointer',
    width: '100%',
    backgroundColor: 'white',
    boxShadow: 'none',
    paddingRight: "14px"
};

const buttonStyle = {
    backgroundColor: '#3182CE',
    border: 'none',
    borderRadius: '8px',
    // padding: '12px',
    fontWeight: '600',
    fontSize: '14px',
    width: '30%',
    marginBottom: '5px',
    color: 'white',
    marginTop: 0
};

const checkboxStyle = {
    boxShadow: 'none',
    border: 'none',
    backgroundColor: 'transparent',
}
const closeButton = {
    position: "absolute",
    top: "10px",
    right: "10px",
    backgroundColor: "#000",
    color: "white",
    fontWeight: "500",
    fontSize: "16px",
    height: "25px",
    width: "25px",
    borderRadius: "60%",
    display: "flex",
    alignitemDatas: "center",
    justifyContent: "center",
    cursor: "pointer",
    zIndex: 10,
}
const inputDropdownStyle = {
    border: '1px solid rgb(84, 84, 87)',
    borderRadius: '14px',
    fontSize: '12px',
    color: '#0b0c2a',
    outline: 'none',
    height: '40px',
    cursor: 'pointer',
    width: '100%',
    backgroundColor: 'white',
    boxShadow: 'none',
    paddingRight: "14px"
}


const EntryDetailForm = ({ isOpen, onClose, editData, isEdit, client }) => {
    const dispatch = useDispatch();
    const { cases } = useSelector((state) => state.journal);
    // const { data, matters } = useSelector((state) => state.client);
    const [selectedClient, setSelectedClient] = useState(client?.clientId);
    const [selectedClientId, setSelectedClientId] = useState('');
    const [caseDropdown, setCaseDropdown] = useState([]);

    useEffect(() => {
        setSelectedClient(client?.clientId);
    }, [client]);

    useEffect(() => {
        dispatch(getAllCases());
    }, [dispatch]);

    useEffect(() => {
        if (cases) {
            setCaseDropdown(cases);
        }
    }, [cases]);

    const formik = useFormik({
        initialValues: {
            client_id: selectedClient,
            date: "",
            payee_name: "",
            transaction_method: "",
            cheque_number: "",
            purpose: "",
            transaction_type: "",
            amount: "",
            client_name: "",
            notes: "",
            reconciled_to_ledger: "",
            reconciled_to_bank_statement: "",
            matter_id: '',
            case_id: '',
        },
        validationSchema: Yup.object({
            date: Yup.string().required("Transaction date is required"),
            payee_name: Yup.string().required("Payee or Payor name is required"),
            transaction_method: Yup.string().required("Transaction method is required"),
            cheque_number: Yup.string()
                // .required("Check Number can not be blank")
                .matches(/^[a-zA-Z0-9]+$/, "Only alphanumeric characters are allowed"),
            purpose: Yup.string().required("Purpose is required"),
            transaction_type: Yup.string().required("Transaction type is required"),
            amount: Yup.number()
                .typeError("Must be a number")
                .required("Amount is required"),
            client_name: Yup.string().required("Client name is required"),
            notes: Yup.string().nullable(),
            reconciled_to_ledger: Yup.string().oneOf(["true", "false"]).nullable().notRequired(),
            reconciled_to_bank_statement: Yup.string().oneOf(["true", "false"]).nullable().notRequired(),
            case_id: Yup.string().required("Case is required"),
        }),
        onSubmit: async (values) => {

            const action = isEdit
                ? updateJournal({ id: editData?.id, formData: values })
                : insertJournalEntry(values);
            const res = await dispatch(action);
            if (res?.payload?.success) {
                formik.resetForm({
                    values: {
                        ...formik.initialValues,
                        client_id: selectedClient,
                    },
                });
                onClose();
            }

            await dispatch(getJournalEntries({
                bank_name: client.bank_name,
                account_number: client.account_number,
                account_name: client.account_name,
            }));
        },
        enableReinitialize: true,
    });


    useEffect(() => {
        if (isEdit && editData) {
            const journalData = {
                date: editData?.date,
                payee_name: editData?.payee_name,
                transaction_method: editData?.transaction_method,
                cheque_number: editData?.cheque_number,
                purpose: editData?.purpose,
                transaction_type: parseFloat(editData?.deposit_amount) != 0 ? "deposit" : "disbursement",
                amount: parseFloat(editData?.deposit_amount) != 0 ? editData?.deposit_amount : editData?.disbursement_amount,
                client_name: editData?.client_name,
                notes: editData?.notes,
                reconciled_to_ledger: editData?.reconciled_to_ledger ? 'true' : 'false',
                reconciled_to_bank_statement: editData?.reconciled_to_bank_statement ? 'true' : 'false',
                case_id: editData?.case_id || '',
            }
            formik.setValues({ ...formik.initialValues, ...journalData });
        } else {
            formik.resetForm({
                values: {
                    ...formik.initialValues,
                    client_id: selectedClient,
                },
            });
        }
    }, [editData]);

    return (
        <Modal show={isOpen} onHide={onClose} size="lg" centered
            style={{
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                backdropFilter: 'blur(5px)',
                zIndex: '1000000000'
            }}>
            <div
                style={{
                    borderRadius: "40px",
                    backgroundColor: "white",
                    overflow: "hidden",
                }}
            >

                <div style={{
                    position: "relative",
                    // marginBottom: "15px"
                    // padding:'10px'
                }}>

                    <div
                        onClick={onClose}
                        style={closeButton}
                    >
                        ×
                    </div>
                    <h5
                        id="modal-title"
                        style={{
                            textAlign: "center",
                            fontWeight: "500",
                            color: "#000429",
                            marginTop: 0,
                            paddingTop: "20px",
                            fontSize: '28px'
                        }}
                    >
                        {(editData && Object.keys(editData).length > 0) ? "Update Journal Entry" : "Add Journal Entry"}
                    </h5>
                </div>
                <Modal.Body style={{
                    padding: '50px 36px',
                    maxHeight: '90vh',
                    overflowY: 'auto',
                    scrollbarWidth: 'thin',
                    scrollbarColor: '#ccc #f1f1f1'
                }}>
                    <Form onSubmit={formik.handleSubmit}>
                        <div className="form-group">
                            <div className="pop-form-inr-wrp">
                                {/* First row */}
                                <div className="row">
                                    <div className="col-lg-4 col-md-6">
                                        <div className="form-grp-inr">
                                            <Form.Label style={labelStyle}>Select date</Form.Label>
                                            <Form.Control
                                                type="date"
                                                name="date"
                                                value={formik.values.date}
                                                style={inputStyle}
                                                {...formik.getFieldProps('date')}
                                            />
                                            {formik.touched.date && formik.errors.date && (
                                                <div style={{ fontSize: "small", color: 'red' }}>{formik.errors.date}</div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="col-lg-4 col-md-6">
                                        <div className="form-grp-inr">
                                            <Form.Label style={labelStyle}>Enter Payor or Payee</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="payee_name"
                                                value={formik.values.payee_name}
                                                placeholder="Enter Payor or Payee"
                                                style={inputStyle}
                                                {...formik.getFieldProps('payee_name')}
                                            />
                                            {formik.touched.payee_name && formik.errors.payee_name && (
                                                <div style={{ fontSize: "small", color: 'red' }}>{formik.errors.payee_name}</div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="col-lg-4 col-md-6">
                                        <div className="form-grp-inr">
                                            <Form.Label style={labelStyle}>Select Transaction Method</Form.Label>
                                            <Form.Select
                                                name="transaction_method"
                                                value={formik.values.transaction_method}
                                                style={inputDropdownStyle}
                                                {...formik.getFieldProps('transaction_method')}
                                            >
                                                <option value="" disabled>Select Transaction Method</option>
                                                <option value="check">Check</option>
                                                <option value="electronic_transfer">Electronic Transfer</option>

                                            </Form.Select>
                                            {formik.touched.transaction_method && formik.errors.transaction_method && (
                                                <div style={{ fontSize: "small", color: 'red' }}>{formik.errors.transaction_method}</div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="col-lg-4 col-md-6">
                                        <div className="form-grp-inr">
                                            <Form.Label style={labelStyle}>Enter Check Number/ Transaction Id.</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="cheque_number"
                                                value={formik?.values?.cheque_number ?? ''}
                                                placeholder="Enter Check Or Transaction Id"
                                                style={inputStyle}
                                                {...formik.getFieldProps('cheque_number')}
                                            />
                                            {formik?.touched?.cheque_number && formik?.errors?.cheque_number && (
                                                <div style={{ fontSize: "small", color: 'red' }}>{formik?.errors?.cheque_number}</div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="col-lg-4 col-md-6">
                                        <div className="form-grp-inr">
                                            <Form.Label style={labelStyle}>Enter Purpose</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="purpose"
                                                value={formik?.values?.purpose}
                                                placeholder="Enter Purpose"
                                                style={inputStyle}
                                                {...formik.getFieldProps('purpose')}
                                            />
                                            {formik?.touched?.purpose && formik?.errors?.purpose && (
                                                <div style={{ fontSize: "small", color: 'red' }}>{formik?.errors?.purpose}</div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="col-lg-4 col-md-6">
                                        <div className="form-grp-inr">
                                            <Form.Label style={labelStyle}>Select Transaction Type</Form.Label>
                                            <Form.Select
                                                name="transaction_type  "
                                                value={formik?.values?.transaction_type}
                                                style={inputDropdownStyle}
                                                {...formik.getFieldProps('transaction_type')}
                                            >
                                                <option value="" disabled>Select Transaction Type</option>
                                                <option value="deposit" >Deposit</option>
                                                <option value="disbursement">Disbursement</option>
                                            </Form.Select>
                                            {formik?.touched?.transaction_type && formik?.errors?.transaction_type && (
                                                <div style={{ fontSize: "small", color: 'red' }}>{formik?.errors?.transaction_type}</div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="col-lg-4 col-md-6">
                                        <div className="form-grp-inr">
                                            <Form.Label style={labelStyle}>Enter Amount</Form.Label>
                                            <Form.Control
                                                type="number"
                                                name="amount"
                                                value={formik?.values?.amount}
                                                placeholder="Enter Amount"
                                                style={inputStyle}
                                                {...formik.getFieldProps('amount')}
                                            />
                                            {formik?.touched?.amount && formik?.errors?.amount && (
                                                <div style={{ fontSize: "small", color: 'red' }}>{formik?.errors?.amount}</div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="col-lg-4 col-md-6">
                                        <div className="form-grp-inr">
                                            <Form.Label style={labelStyle}>Enter Client Name</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="client_name"
                                                value={formik?.values?.client_name}
                                                placeholder="Enter Client Name"
                                                style={inputStyle}
                                                {...formik.getFieldProps('client_name')}
                                            />
                                            {formik?.touched?.client_name && formik?.errors?.client_name && (
                                                <div style={{ fontSize: "small", color: 'red' }}>{formik?.errors?.client_name}</div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="col-lg-4 col-md-6">
                                        <div className="form-grp-inr">
                                            <Form.Label style={labelStyle}>Select Client Matter</Form.Label>
                                            <Form.Select
                                                name="matter_id"
                                                value={formik?.values?.matter_id}
                                                style={inputDropdownStyle}
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                            >
                                                <option value="">Select a client</option>
                                                {/* {matters.map((matter, index) => (
                                                    <option key={index} value={matter.id}>
                                                        {matter.matter}
                                                    </option>
                                                ))} */}
                                            </Form.Select>
                                        </div>
                                    </div>
                                    <div className="col-lg-4 col-md-6">
                                        <div className="form-grp-inr">
                                            <Form.Label style={labelStyle}>Case</Form.Label>
                                            <Form.Select
                                                name="case_id"
                                                value={formik?.values?.case_id}
                                                style={inputDropdownStyle}
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                            >
                                                <option value="">Select a case</option>
                                                {caseDropdown.map((row, index) => (
                                                    <option key={index} value={row.id}>
                                                        {row.name}
                                                    </option>
                                                ))}
                                            </Form.Select>
                                            {formik?.touched?.case_id && formik?.errors?.case_id && (
                                                <div style={{ fontSize: "small", color: 'red' }}>{formik?.errors?.case_id}</div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="col-lg-4 col-md-6">
                                        <div className="form-grp-inr">
                                            <Form.Label style={labelStyle}>Enter Notes (Optional)</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="notes"
                                                value={formik?.values?.notes || ""}
                                                placeholder="Enter Notes"
                                                style={inputStyle}
                                                {...formik.getFieldProps('notes')}
                                            />
                                            {formik?.touched?.notes && formik?.errors?.notes && (
                                                <div style={{ fontSize: "small", color: 'red' }}>{formik?.errors?.notes}</div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                {editData && Object.keys(editData).length > 0 && (
                                    <div className="row mb-2">
                                        <div className="col-md-6 d-flex align-items-center">
                                            <p style={{ marginBottom: 0, marginRight: '10px', minWidth: '90px', fontSize: '12px', fontWeight: '500', color: '#000429' }}>
                                                Reconciled to Ledger?
                                            </p>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                                                <Form.Label style={labelStyle}>Yes</Form.Label>
                                                <input
                                                    type="checkbox"
                                                    name="reconciled_to_ledger"
                                                    value="true"
                                                    checked={formik.values.reconciled_to_ledger === "true"}
                                                    onChange={() => formik.setFieldValue("reconciled_to_ledger", formik.values.reconciled_to_ledger === "true" ? "" : "true")}
                                                    style={checkboxStyle}
                                                />
                                                <Form.Label style={labelStyle}>No</Form.Label>
                                                <input
                                                    type="checkbox"
                                                    name="reconciled_to_ledger"
                                                    value="false"
                                                    checked={formik.values.reconciled_to_ledger === "false"}
                                                    onChange={() => formik.setFieldValue("reconciled_to_ledger", formik.values.reconciled_to_ledger === "false" ? "" : "false")}
                                                    style={checkboxStyle}
                                                />
                                            </div>
                                        </div>

                                        <div className="col-md-6 d-flex align-items-center">
                                            <p style={{ marginBottom: 0, marginRight: '10px', minWidth: '160px', fontSize: '12px', fontWeight: '500', color: '#000429' }}>
                                                Reconciled to Bank Statement?
                                            </p>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                                                <Form.Label style={labelStyle}>Yes</Form.Label>
                                                <input
                                                    type="checkbox"
                                                    name="reconciled_to_bank_statement"
                                                    value="true"
                                                    checked={formik.values.reconciled_to_bank_statement === "true"}
                                                    onChange={() => formik.setFieldValue("reconciled_to_bank_statement", formik.values.reconciled_to_bank_statement === "true" ? "" : "true")}
                                                    style={checkboxStyle}
                                                />
                                                <Form.Label style={labelStyle}>No</Form.Label>
                                                <input
                                                    type="checkbox"
                                                    name="reconciled_to_bank_statement"
                                                    value="false"
                                                    checked={formik.values.reconciled_to_bank_statement === "false"}
                                                    onChange={() => formik.setFieldValue("reconciled_to_bank_statement", formik.values.reconciled_to_bank_statement === "false" ? "" : "false")}
                                                    style={checkboxStyle}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}
                                <div className="dsbdy-frm-btn-grp w-100 text-center">
                                    <Button type="submit" className="form-btn">
                                        {(editData && Object.keys(editData).length > 0) ? "Update Journal Entry" : "Add Journal Entry"}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </Form>
                </Modal.Body>
            </div>
        </Modal >
    );
};

export default EntryDetailForm;
