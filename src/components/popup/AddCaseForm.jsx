import { useFormik } from "formik";
import {
  Button,
  Form,
  Modal
} from "react-bootstrap";
import { useDispatch } from "react-redux";
import * as Yup from "yup";
import { addNewCase, getAllCases } from "../../redux/slices/journalSlice";


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

const AddCaseForm = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();

  const formik = useFormik({
    initialValues: {
      name: "",
      open_date: "",
      close_date: "",
      description: "",
      case_date: "",
      notes: "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Case name is required"),
      open_date: Yup.date().required("Open Date is required"),

      description: Yup.string()
        .nullable()
        .notRequired(),

      case_date: Yup.string()
        .nullable()
        .notRequired(),

      notes: Yup.string()
        .nullable()
        .notRequired(),
    }),
    onSubmit: async (values) => {
      console.log("Form Values:", values);

      // submitting the for to save new case
      dispatch(addNewCase(values));
      formik.resetForm();
      dispatch(getAllCases());
      // Close the modal after submission
      onClose();
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
          <h5 style={{ fontWeight: 'bold', color: '#000429' }}>Add Case</h5>
          <p style={{ fontSize: '13px', color: '#6c757d' }}>
            Lorem Ipsum has been the industry's standard dummy
          </p>
        </div>

        <Form onSubmit={formik.handleSubmit} style={{ marginRight: '30px', marginLeft: '30px' }}>
          <Form.Group style={{ marginBottom: '20px', position: 'relative', }}>
            <label
              htmlFor="matter"
              style={labelStyle}
            >
              Case Name
            </label>
            <Form.Control
              id="name"
              type="text"
              placeholder="Enter Case Name"
              name="name"
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              style={inputStyle}
              onFocus={(e) => {
                e.target.style.border = '1.5px solid #6f95fc'; // maintain same border on focus
                e.target.style.boxShadow = 'none';
              }}

            />
            {formik.touched.name && formik.errors.name && (
              <div className="text-danger">{formik.errors.name}</div>
            )}
          </Form.Group>

          <Form.Group style={{ marginBottom: '20px', position: 'relative', }}>
            <label
              htmlFor="open_date"
              style={labelStyle}>
              Open Date
            </label>
            <Form.Control
              type="date"
              name="open_date"
              value={formik.values.open_date}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              style={inputStyle}
              onFocus={(e) => {
                e.target.style.border = '1.5px solid #6f95fc'; // maintain same border on focus
                e.target.style.boxShadow = 'none';
              }}
            />
            {formik.touched.open_date && formik.errors.open_date && (
              <div className="text-danger">{formik.errors.open_date}</div>
            )}
          </Form.Group>

          <Form.Group style={{ marginBottom: '20px', position: 'relative', }}>
            <label
              htmlFor="close_date"
              style={labelStyle}>
              Close Date
            </label>
            <Form.Control
              type="date"
              name="close_date"
              value={formik.values.close_date}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              style={inputStyle}
              onFocus={(e) => {
                e.target.style.border = '1.5px solid #6f95fc'; // maintain same border on focus
                e.target.style.boxShadow = 'none';
              }}
              disabled={true}
            />
            {formik.touched.close_date && formik.errors.close_date && (
              <div className="text-danger">{formik.errors.close_date}</div>
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
            {formik.touched.description && formik.errors.description && (
              <div className="text-danger">{formik.errors.description}</div>
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
        </Form>
      </Modal.Body>
    </Modal>
  );
}

export default AddCaseForm