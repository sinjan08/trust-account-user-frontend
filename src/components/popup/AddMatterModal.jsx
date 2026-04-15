import { useEffect, useState } from "react";
import {
    Button,
    Col,
    Form,
    Modal,
    Row
} from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { getClientsForMat } from "../../redux/slices/ledgerSlice";
import { addNewMatter } from "../../redux/slices/matterSlice";
import { useFormik } from "formik";
import { fetchigAllLien } from "../../redux/slices/lienSlice";

const AddMatterModal = ({ isOpen, onClose }) => {
    const dispatch = useDispatch();
    const { clients } = useSelector((state) => state.ledger);

    useEffect(() => {
        dispatch(getClientsForMat());
    }, [dispatch]);

    const formik = useFormik({
        initialValues: {
            ledger_client_id: "",
            matter: "",
            opened_on: "",
            description: "",
            case_date: "",
            amount: "",
            notes: "",

        },
        validate: (values) => {
            const errors = {};
            if (!values.ledger_client_id) errors.ledger_client_id = "Client is required";
            if (!values.matter) errors.matter = "Matter name is required";
            if (!values.opened_on) errors.opened_on = "Open date is required";
            if (!values.amount) errors.amount = "Fee amount is required";
            if (!values.case_date) errors.case_date = "Case date is required";
            return errors;
        },
        onSubmit: async (values, { resetForm }) => {
            const payload = {
                ...values,
                ledger_client_id: parseInt(values.ledger_client_id),
            };
            console.log("object payload",payload)
            const result = await dispatch(addNewMatter(payload));
            if (result?.payload?.success === true) {
                dispatch(fetchigAllLien())
            }
            onClose();
            resetForm();
        },
    });



    const handleSaveAndNext = () => {
        const payload = {
            ...formik.values,
            ledger_client_id: parseInt(formik.values.ledger_client_id),
        };
        
        dispatch(addNewMatter(payload));
        formik.resetForm();
    };

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
                    <h5 style={{ fontWeight: 'bold', color: '#000429' }}>Add Matter</h5>
                    <p style={{ fontSize: '13px', color: '#6c757d' }}>
                        Lorem Ipsum has been the industry's standard dummy
                    </p>
                </div>

                <Form onSubmit={formik.handleSubmit} style={{ marginRight: '30px', marginLeft: '30px' }}>

                    <Form.Group style={{ marginBottom: '20px', }}>
                        <Form.Select
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
                        )}

                    </Form.Group>

                    <Form.Group style={{ marginBottom: '20px', position: 'relative', }}>
                        <label
                            htmlFor="matter"
                            style={labelStyle}
                        >
                            Matter Name
                        </label>
                        <Form.Control
                            id="matter"
                            type="text"
                            placeholder="Enter Matter Name"
                            name="matter"
                            value={formik.values.matter}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            required
                            style={inputStyle}
                            onFocus={(e) => {
                                e.target.style.border = '1.5px solid #6f95fc'; // maintain same border on focus
                                e.target.style.boxShadow = 'none';
                            }}
                        
                        />
                        {formik.touched.matter && formik.errors.matter && (
                            <div className="text-danger">{formik.errors.matter}</div>
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
                            htmlFor="opened_on"
                            style={labelStyle}>
                            Open Date
                        </label>
                        <Form.Control
                            type="date"
                            name="opened_on"
                            value={formik.values.opened_on}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            style={inputStyle}
                            onFocus={(e) => {
                                e.target.style.border = '1.5px solid #6f95fc'; // maintain same border on focus
                                e.target.style.boxShadow = 'none';
                            }}
                        // onBlur={(e) => {
                        //     e.target.style.border = '1.5px solid #000'; // reset on blur just in case
                        //     e.target.style.boxShadow = 'none';
                        // }}
                        />
                        {formik.touched.opened_on && formik.errors.opened_on && (
                            <div className="text-danger">{formik.errors.opened_on}</div>
                        )}
                    </Form.Group>

                    <Form.Group style={{ marginBottom: '20px', position: 'relative', }}>
                        <label
                            htmlFor="description"
                            style={labelStyle}>
                            Description
                        </label>
                        <Form.Control
                            as="textarea"
                            rows={2}
                            name="description"
                            placeholder="Enter description"
                            value={formik.values.description}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            style={{ ...inputStyle, resize: 'none' }}
                            onFocus={(e) => {
                                e.target.style.border = '1.5px solid #6f95fc'; // maintain same border on focus
                                e.target.style.boxShadow = 'none';
                            }}
                        />
                    </Form.Group>

                    <Form.Group style={{ marginBottom: '20px', position: 'relative', }}>
                        <label
                            htmlFor="status"
                            style={labelStyle}>
                            Case Date
                        </label>
                        <Form.Control
                            type="date"
                            name="case_date"
                            value={formik.values.case_date}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            style={inputStyle}
                            onFocus={(e) => {
                                e.target.style.border = '1.5px solid #6f95fc'; // maintain same border on focus
                                e.target.style.boxShadow = 'none';
                            }}
                        
                        />
                        {formik.touched.case_date && formik.errors.case_date && (
                            <div className="text-danger">{formik.errors.case_date}</div>
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
                    <Button type="button" onClick={handleSaveAndNext} style={buttonStyle}>
                        Save & Create Next Matter
                    </Button>
                </Form>
            </Modal.Body>
        </Modal >
    );
};

export default AddMatterModal;