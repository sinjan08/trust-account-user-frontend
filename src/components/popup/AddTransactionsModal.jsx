import { useFormik } from 'formik';
import React from 'react'
import { Button, Form, Modal } from 'react-bootstrap';
import { addLienTransaction, LienTransaction } from '../../redux/slices/lienSlice';
import { useDispatch } from 'react-redux';

const AddTransactionsModal = ({ isOpen, onClose, lien_id, ledger_client_id }) => {
    const dispatch = useDispatch()
    const formik = useFormik({
        initialValues: {
            lien_id: "",
            ledger_client_id: "",
            date: "",
            payee: "",
            transaction_method: "",
            transaction_type: "",
            transaction_number: "",
            purpose: "",
            amount: "",
            notes: "",

        },
        validate: (values) => {
            const errors = {};
            if (!values.payee) errors.payee = "Payee name is required";
            if (!values.transaction_method) errors.transaction_method = "Transaction Method is required";
            if (!values.transaction_type) errors.transaction_type = "Transaction Type is required";
            if (!values.transaction_number) errors.transaction_number = "Transaction Number is required";
            if (!values.amount) errors.amount = "Fee amount is required";
            if (!values.date) errors.date = "Date is required";
            if (!values.purpose) errors.purpose = "purpose is required";
            return errors;
        },
        onSubmit: async (values, { resetForm }) => {
            // console.log("values", values)
            const payload = {
                ...values, lien_id: parseInt(lien_id),
                ledger_client_id: parseInt(ledger_client_id),
            };

            // console.log("Payload", payload)
            const result = await dispatch(addLienTransaction(payload));
            if (result?.payload?.success === true) {
                dispatch(LienTransaction({ lien_id }))
            }
            onClose();
            resetForm();
        },
    });
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
    const labelStyle = {
        position: 'absolute',
        top: '-10px',
        left: '12px',
        background: 'white',
        padding: '0 5px',
        fontSize: '16px',
        color: '#000429',
        zIndex: 1
    }

    const buttonStyle = {
        backgroundColor: '#3182CE',
        border: 'none',
        borderRadius: '8px',
        padding: '12px',
        fontWeight: '600',
        fontSize: '14px',
        width: '100%',
        marginBottom: '12px',
        color: 'white'
    };

    return (
        <Modal show={isOpen} onHide={onClose} centered style={{
            borderRadius: '15px',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            backdropFilter: 'blur(5px)',
            zIndex: '1000000000'
        }}>
            <div
                style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    borderRadius: "10px",
                    maxWidth: "100%",
                }}
            >
                <div className="close-btn"
                    onClick={() => onClose()} // replace with your close handler
                    style={{ color: "#FFFFFF" }}
                >
                    X
                </div>
            </div>
            <Modal.Body style={{ padding: '30px', borderRadius: '20px' }}>
                <div className="text-center mb-4">
                    <h5 style={{ fontWeight: 'bold', color: '#000429' }}>Add Transactions</h5>
                    <p style={{ fontSize: '13px', color: '#6c757d' }}>
                        Lorem Ipsum has been the industry's standard dummy
                    </p>
                </div>

                <Form onSubmit={formik.handleSubmit} style={{ marginRight: '30px', marginLeft: '30px' }}>
                    <Form.Group style={{ marginBottom: '20px', }}>
                        {/* <Form.Select
                            name="ledger_client_id"
                            value={formik.values.ledger_client_id}
                            onChange={formik.handleChange}
                            required
                            style={inputStyle}
                            onFocus={(e) => {
                                e.target.style.border = '1.5px solid #6f95fc';
                                e.target.style.boxShadow = 'none';
                            }}
                            onBlur={formik.handleBlur}
                        >
                            <option value="" disabled style={{ color: '#000429' }}>Client</option>
                            {clients.length > 0 && clients.map((client, index) => (
                                <option key={index} value={client.id}>{client.client_name}</option>
                            ))}
                        </Form.Select>
                        {formik.touched.ledger_client_id && formik.errors.ledger_client_id && (
                            <div className="text-danger">{formik.errors.ledger_client_id}</div>
                        )} */}

                    </Form.Group>

                    <Form.Group style={{ marginBottom: '20px', position: 'relative', }}>
                        <label
                            htmlFor="lien_holder"
                            style={labelStyle}
                        >
                            Payee Name
                        </label>
                        <Form.Control
                            id="payee"
                            type="text"
                            placeholder="Enter payee Name"
                            name="payee"
                            value={formik.values.payee}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            required
                            style={inputStyle}
                            onFocus={(e) => {
                                e.target.style.border = '1.5px solid #6f95fc'; // maintain same border on focus
                                e.target.style.boxShadow = 'none';
                            }}
                        />
                        {formik.touched.payee && formik.errors.payee && (
                            <div className="text-danger">{formik.errors.payee}</div>
                        )}
                    </Form.Group>
                    <Form.Group style={{ marginBottom: '20px', }}>
                        <Form.Select
                            name="transaction_method"
                            value={formik.values.transaction_method}
                            onChange={formik.handleChange}
                            required
                            style={inputStyle}
                            onFocus={(e) => {
                                e.target.style.border = '1.5px solid #6f95fc';
                                e.target.style.boxShadow = 'none';
                            }}
                            onBlur={formik.handleBlur}
                        >
                            <option value="" disabled style={{ color: '#000429' }}>Transaction Method</option>
                            <option value="Check" style={{ color: '#000429' }}>Cheque</option>
                            <option value="electronic_transfer" style={{ color: '#000429' }}>Electronic Transfer</option>

                        </Form.Select>
                        {formik.touched.transaction_method && formik.errors.transaction_method && (
                            <div className="text-danger">{formik.errors.transaction_method}</div>
                        )}

                    </Form.Group>
                    <Form.Group style={{ marginBottom: '20px', }}>
                        <Form.Select
                            name="transaction_type"
                            value={formik.values.transaction_type}
                            onChange={formik.handleChange}
                            required
                            style={inputStyle}
                            onFocus={(e) => {
                                e.target.style.border = '1.5px solid #6f95fc';
                                e.target.style.boxShadow = 'none';
                            }}
                            onBlur={formik.handleBlur}
                        >
                            <option value="" disabled style={{ color: '#000429' }}>Transaction Type</option>
                            <option value="deposit" style={{ color: '#000429' }}>Deposit</option>
                            <option value="disbursement" style={{ color: '#000429' }}>Disbursement</option>

                        </Form.Select>
                        {formik.touched.transaction_type && formik.errors.transaction_type && (
                            <div className="text-danger">{formik.errors.transaction_type}</div>
                        )}

                    </Form.Group>
                    <Form.Group style={{ marginBottom: '20px', position: 'relative', }}>
                        <label
                            htmlFor="transaction_number"
                            style={labelStyle}
                        >
                            Transaction Number / Check Number
                        </label>
                        <Form.Control
                            id="transaction_number"
                            type="text"
                            placeholder="Enter Transaction Number"
                            name="transaction_number"
                            value={formik.values.transaction_number}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            required
                            style={inputStyle}
                            onFocus={(e) => {
                                e.target.style.border = '1.5px solid #6f95fc'; // maintain same border on focus
                                e.target.style.boxShadow = 'none';
                            }}
                        />
                        {formik.touched.transaction_number && formik.errors.transaction_number && (
                            <div className="text-danger">{formik.errors.transaction_number}</div>
                        )}
                    </Form.Group>
                    <Form.Group style={{ marginBottom: '20px', position: 'relative', }}>
                        <label
                            htmlFor="amount"
                            style={labelStyle}
                        >
                            Amount
                        </label>
                        <Form.Control
                            id="amount"
                            type="text"
                            placeholder="Enter Lien amount"
                            name="amount"
                            value={formik.values.amount}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            required
                            style={inputStyle}
                            onFocus={(e) => {
                                e.target.style.border = '1.5px solid #6f95fc'; // maintain same border on focus
                                e.target.style.boxShadow = 'none';
                            }}
                        />
                        {formik.touched.amount && formik.errors.amount && (
                            <div className="text-danger">{formik.errors.amount}</div>
                        )}
                    </Form.Group>
                    <Form.Group style={{ marginBottom: '20px', position: 'relative', }}>
                        <label
                            htmlFor="purpose"
                            style={labelStyle}
                        >
                            Purpose
                        </label>
                        <Form.Control
                            id="purpose"
                            type="text"
                            placeholder="Enter Purpose"
                            name="purpose"
                            value={formik.values.purpose}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            required
                            style={inputStyle}
                            onFocus={(e) => {
                                e.target.style.border = '1.5px solid #6f95fc'; // maintain same border on focus
                                e.target.style.boxShadow = 'none';
                            }}
                        />
                        {formik.touched.purpose && formik.errors.purpose && (
                            <div className="text-danger">{formik.errors.purpose}</div>
                        )}
                    </Form.Group>
                    <Form.Group style={{ marginBottom: '20px', position: 'relative', }}>
                        <label
                            htmlFor="date"
                            style={labelStyle}>
                            Date
                        </label>
                        <Form.Control
                            type="date"
                            name="date"
                            value={formik.values.date}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            style={inputStyle}
                            onFocus={(e) => {
                                e.target.style.border = '1.5px solid #6f95fc'; // maintain same border on focus
                                e.target.style.boxShadow = 'none';
                            }}
                        />
                        {formik.touched.date && formik.errors.date && (
                            <div className="text-danger">{formik.errors.date}</div>
                        )}
                    </Form.Group>
                    <Form.Group style={{ marginBottom: '20px', position: 'relative', }}>
                        <label
                            htmlFor="notes"
                            style={labelStyle}
                        >
                            Notes
                        </label>
                        <Form.Control
                            id="notes"
                            type="text"
                            placeholder="Enter notes"
                            name="notes"
                            value={formik.values.notes}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            required
                            style={inputStyle}
                            onFocus={(e) => {
                                e.target.style.border = '1.5px solid #6f95fc'; // maintain same border on focus
                                e.target.style.boxShadow = 'none';
                            }}
                        />
                        {formik.touched.notes && formik.errors.notes && (
                            <div className="text-danger">{formik.errors.notes}</div>
                        )}
                    </Form.Group>

                    <Button type="submit" style={buttonStyle}>
                        Add
                    </Button>
                    {/* <Button type="button" onClick={handleSaveAndNext} style={buttonStyle}>
                        Save & Create Next Matter
                    </Button> */}
                </Form>
            </Modal.Body>
        </Modal >
    )
}

export default AddTransactionsModal