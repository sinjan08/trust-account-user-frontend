import { useFormik } from "formik";
import {
    Button,
    Form,
    Modal
} from "react-bootstrap";
import { useDispatch } from "react-redux";
import * as Yup from "yup";
import { addNewClient, getAllClients } from "../../redux/slices/clientSlice";
import { getClientsForMat } from "../../redux/slices/ledgerSlice";

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

const buttonStyle = {
    backgroundColor: '#3182CE',
    border: 'none',
    borderRadius: '8px',
    padding: '12px',
    fontWeight: '600',
    fontSize: '14px',
    width: '100%',
    marginBottom: '12px',
    color: 'white',
};

const AddClientModal = ({ isOpen, onClose }) => {


    const handleFocus = (e) => {
        e.target.style.border = '1.5px solid #6f95fc';
        e.target.style.boxShadow = 'none';
    };

    const handleBlur = (e) => {
        e.target.style.border = '1.5px solid #000';
        e.target.style.boxShadow = 'none';
    };

    const dispatch = useDispatch();

    const formik = useFormik({
        initialValues: {
            client_name: "",
            fee_type: "",
            case_summary: ""
        },
        validationSchema: Yup.object({
            client_name: Yup.string().required("Account Name is required"),
            fee_type: Yup.string().required("Fee Type is required"),
            case_summary: Yup.string().nullable(),
        }),
        onSubmit: async (values) => {
            const res = await dispatch(addNewClient(values));
            if (res.payload.success) {
                dispatch(getAllClients());
                dispatch(getClientsForMat())
                onClose();
            }
        },
    });

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
                    zIndex: '1000000000'
                }}
            >
                <div className="close-btn"
                    onClick={() => onClose()} // replace with your close handler
                    style={{ color: 'white' }}
                >
                    X
                </div>
            </div>
            <Modal.Body className="p-4">
                <div className="text-center mb-3">
                    <h5 style={{ color: '#2d2f54', fontSize: '28px' }}>Add Client</h5>
                    <p className="text-muted small">
                        Lorem Ipsum has been the industry's standard dummy
                    </p>
                </div>

                <Form onSubmit={formik.handleSubmit} style={{
                    margin: '40px'
                }}>
                    <Form.Group className="mb-3" style={{ marginBottom: '20px', position: 'relative' }}>
                        <label style={labelStyle}>
                            Client Name
                        </label>
                        <Form.Control
                            type="text"
                            name="client_name"
                            placeholder="Enter Client Name"
                            value={formik.values.client_name}
                            style={inputStyle}
                            onFocus={handleFocus}
                            onBlur={handleBlur}
                            {...formik.getFieldProps('client_name')}
                        />
                        {formik.touched.client_name && formik.errors.client_name && (
                            <div className="text-danger">{formik.errors.client_name}</div>
                        )}
                    </Form.Group>

                    <Form.Group className="mb-3" style={{ marginBottom: '20px', position: 'relative' }}>
                        <label style={labelStyle}>
                            Fee Type
                        </label>
                        <Form.Control
                            type="text"
                            name="fee_type"
                            placeholder="Enter Fee Type"
                            value={formik.values.fee_type}
                            style={inputStyle}
                            onFocus={handleFocus}
                            onBlur={handleBlur}
                            {...formik.getFieldProps('fee_type')}
                        />
                        {formik.touched.fee_type && formik.errors.fee_type && (
                            <div className="text-danger">{formik.errors.fee_type}</div>
                        )}
                    </Form.Group>

                    <Form.Group className="mb-4" style={{ marginBottom: '20px', position: 'relative' }}>
                        <label style={labelStyle}>
                            Case Summary
                        </label>
                        <Form.Control
                            type="text"
                            name="case_summary"
                            placeholder="Enter Case Summary"
                            value={formik.values.case_summary}
                            style={inputStyle}
                            onFocus={handleFocus}
                            onBlur={handleBlur}
                            {...formik.getFieldProps('case_summary')}
                        />
                        {formik.touched.case_summary && formik.errors.case_summary && (
                            <div className="text-danger">{formik.errors.case_summary}</div>
                        )}
                    </Form.Group>

                    <div className="d-grid">
                        <Button type="submit" style={buttonStyle}>
                            Add
                        </Button>
                    </div>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default AddClientModal;
