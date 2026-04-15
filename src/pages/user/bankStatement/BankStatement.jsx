import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";
import DynamicTable from "../../../components/user/DynamicTable";
import { useAuth } from "../../../contexts/AuthContext";
import { createBankStatement, fetchBankStatements } from "../../../redux/slices/bankStatementSlice";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import PDFViewer from 'pdf-viewer-reactjs';
import PDFPreviewModal from "../../../components/popup/PDFPreviewModal";
import { checkUserPermission } from "../../../redux/slices/userSlice";


const BankStatement = () => {
  const navigator = useNavigate()
  const { isSidebarOpen } = useAuth()
  const [showTabel, setShowTable] = useState(false);
  const { bankStatements, loading } = useSelector((state) => state.bankStatement)
  const [statements, setStatements] = useState([]);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [manuPermission, setManuPermission] = useState(null)
  const [readPermission, setReadPermission] = useState(0)
  const [addPermission, setAddPermission] = useState(0)
  const [editPermission, setEditPermission] = useState(0)
  const [deletePermission, setDeletePermission] = useState(0)
  const { permissionMenu } = useSelector((state) => state?.user)
  // localStorage.setItem("menuPermissions", JSON.stringify(permissionMenu));

  // console.log("readPermission", readPermission, "addPermission", addPermission, "editPermission", editPermission, "deletePermission", deletePermission)
  const permissionsList = JSON.parse(localStorage.getItem('menuPermissions') || '[]');

  useEffect(() => {
    const currentPath = window.location.pathname;
    const matched = permissionsList.find((item) => item.url === currentPath);
    // console.log("matched",currentPath,permissionsList)
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



  const dispatch = useDispatch();
  const formik = useFormik({
    initialValues: {
      bank_name: "",
      bank_info: "",
      statement: null
    },

    validationSchema: Yup.object({
      bank_name: Yup.string().required("Bank Name is required"),
      bank_info: Yup.string().nullable(),
      statement: Yup.mixed().required("Please upload a bank statement")
    }),
    onSubmit: async (values) => {
      setUploadProgress(0);
      const simulateProgress = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(simulateProgress);
            return prev;
          }
          return prev + 10;
        });
      }, 200);


      const result = await dispatch(createBankStatement(values));
      if (result?.payload?.success) {
        setUploadProgress(100);
        setTimeout(() => setUploadProgress(0), 1000);
        formik.resetForm();
        setShowTable(true);
        dispatch(fetchBankStatements());
      } else {
        setUploadProgress(0);
      }
    }
  })

  useEffect(() => {
    setManuPermission(JSON.parse(localStorage.getItem('menuPermissions')))
    const fetchData = async () => {
      const result = await dispatch(fetchBankStatements());
      if (result?.payload?.message == 'Invalid token.') {
        localStorage.removeItem("trust-account")
        setTimeout(() => {
          toast.error('You are logged out. Please login again...')
        }, [100])
        navigator('/login')
      }
    }
    fetchData()
  }, [dispatch]);

  useEffect(() => {
    // dispatch(checkUserPermission())
    if (bankStatements && bankStatements.length > 0) {
      setStatements(bankStatements);
    }
  }, [bankStatements]);

  // console.log("manuPermission", readPermission)

  const handlePrintPDF = () => {
    const file = formik.values.statement;

    if (!file) {
      alert("No file selected.");
      return;
    }

    const fileURL = URL.createObjectURL(file);


    const fileType = file.type;

    const imageTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/webp",
    ];

    if (fileType === "application/pdf") {
      const fileURL = URL.createObjectURL(file);
      const printWindow = window.open(fileURL, "_blank");

      printWindow.addEventListener("load", () => {
        printWindow.focus();
        printWindow.print();
      });
    } else if (imageTypes.includes(fileType)) {
      const newTab = window.open();
      // Image preview
      newTab.document.write(`
      <html>
        <head><title>Image Preview</title></head>
        <body style="margin:0; align-items:center; justify-content:center;">
         <img 
             src="${fileURL}" 
             alt="Preview" 
             style="
                display: block;
                margin: auto;
                max-width: 80%;
                max-height: 80vh;
                object-fit: contain;
          />

        </body>
      </html>
    `);
      newTab.document.close();
    } else if (
      fileType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
      fileType === "application/msword"
    ) {
      // Word Document Preview using Microsoft Office Online Viewer
      const blob = new Blob([file], { type: fileType });
      const url = URL.createObjectURL(blob);
      const officeViewerUrl = `https://view.officeapps.live.com/op/view.aspx?src=${encodeURIComponent(
        window.location.origin + url.replace(/^blob:/, '')
      )}`;

      // You need to upload file to your server or make it accessible via public URL for this to work fully
      alert("Previewing local Word files in Microsoft Office Viewer requires a public file URL. For now, it may not work with local blobs.");
      window.open(officeViewerUrl, "_blank");
    } else {
      // Fallback download
      const link = document.createElement("a");
      link.href = fileURL;
      link.download = file.name;
      link.click();
      alert("Preview not supported for this file type. File will be downloaded instead.");
    }
  };

  const handlePermission = () => {
    toast.error('You do not have permission add files!');
  }
  const handlePermissionOnRead = () => {
    if (readPermission === 1 || readPermission == '1') {
      setShowTable(true)
    } else {
      toast.error('You do not have permission to view this page.');
    }

  }


  useEffect(() => {
    if (!readPermission) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [readPermission]);


  return (
    <>
      <div className={`dashboard-body-wrp show ${isSidebarOpen ? " active" : ""}`}>
        {
          showTabel ?
            (
              <DynamicTable data={statements || []} />
            ) : (
              // <div style={{
              //   position: 'relative',
              //   // overflow: !readPermission ? 'hidden' : '', // ✨ Add this
              //   height:  !readPermission ? '76vh' : '',
              // }}>
              <div className="dashboard-body"
              // style={{
              //   // zIndex:200,
              //   // filter: !readPermission ? 'blur(4px)' : 'none',
              //   pointerEvents: !readPermission ? 'none' : 'auto',
              //   // userSelect: !readPermission ? 'none' : 'auto',
              //   opacity: !readPermission ? 0.6 : 1,
              //   // ✨ to avoid forcing viewport height when no access
              //   height: readPermission ? 'auto' : '100vh', // avoid forcing viewport height when no access
              //   // overflow: 'hidden' // ✨ to prevent scroll within this div
              // }}

              >
                <div className="ds-bdy-head">
                  <h1>Bank Statement</h1>
                  <strong>Enter your IOLTA Account Bank Statement</strong>
                  <p>
                    *REQUIRED BY STANDARD (1)(c) IN ACCORDANCE WITH SUBDIVISIONS
                    (d)(3) and (e) OF RULE 1.15.
                  </p>
                </div>
                <form onSubmit={formik.handleSubmit}>
                  {/* Client Information Section */}
                  <div className="ds-client-info-wrp">
                    <h3>Client Information</h3>
                    <div className="ds-client-info-form">
                      <div className="input-grp" >
                        <label htmlFor="bank-info">Bank Location</label>
                        <input name="bank_info" type="text" id="bank-info" placeholder="Enter Bank Location" value={formik.values.bank_info} {...formik.getFieldProps('bank_info')}
                          onClick={() => {
                            if (addPermission == 0) {
                              handlePermission();
                            }
                          }} readOnly={addPermission === 0} />
                        {(addPermission === 1 || addPermission == '1') && (formik.touched && formik.errors.bank_info && <div className="text-danger">{formik.errors.bank_info}</div>)}
                      </div>
                      <div className="input-grp" >
                        <label htmlFor="bank-name">Bank Name</label>
                        <input name="bank_name" type="text" id="bank-name" placeholder="Enter Bank Name" value={formik.values.bank_name} {...formik.getFieldProps('bank_name')} onClick={(e) => {
                          if (addPermission == 0) {
                            handlePermission();
                          }
                        }} readOnly={addPermission === 0} />
                        {(addPermission === 1 || addPermission == '1') && (formik.touched && formik.errors.bank_name && <div className="text-danger">{formik.errors.bank_name}</div>)}
                      </div>
                    </div>
                  </div>
                  <div className="dsbdy-content">
                    <h2 className="dsbdy-content-title">Upload Document</h2>
                    <div className="input-grp">
                      <label>Upload Bank Statement</label>
                      <div
                        className="file-input"
                      >
                        <input
                          type="file"
                          name="statement"
                          onChange={(event) => {
                            formik.setFieldValue("statement", event.currentTarget.files[0]);
                          }}
                          onClick={(e) => {
                            if (addPermission === 0) {
                              e.preventDefault();
                              handlePermission();
                            }
                          }}
                        />

                        <div className="upload-placeholder">
                          <img
                            className="upload-icon"
                            src="/images/upload-img.svg"
                            alt="Icon"
                          />
                          <p>PDFs, Word documents, Excel files, images (JPEG, PNG)</p>
                        </div>
                      </div>
                      {formik.touched.statement && formik.errors.statement && (
                        <div className="text-danger">{formik.errors.statement}</div>
                      )}
                    </div>

                    <div className="addon-info">
                      *All documents and information shall be exportable. + All document
                      uploads shall have the ability for note and name entry.
                    </div>

                    <div className="dsbdy-frm-btn-grp">
                      {uploadProgress > 0 && (
                        <div className="progress my-3" style={{ height: "20px", width: '100%' }}>
                          <div
                            className="progress-bar progress-bar-striped progress-bar-animated"
                            role="progressbar"
                            style={{ width: `${uploadProgress}%`, backgroundColor: '#002159' }}
                            aria-valuenow={uploadProgress}
                            aria-valuemin="0"
                            aria-valuemax="100"
                          >
                            {uploadProgress}%
                          </div>
                        </div>
                      )}
                      <button type="button" disabled={!formik.values.statement || !(formik.values.statement instanceof File)}
                        style={{
                          cursor: !formik.values.statement ? 'not-allowed' : 'pointer',
                          background: !formik.values.statement ? '#474747' : '',
                        }}
                        onClick={() => {
                          const file = formik.values.statement;
                          if (file) {
                            const fileURL = URL.createObjectURL(file);
                            setShowPreviewModal(true);
                          }
                        }}>Preview</button>
                      <button type="submit" className="viewuploaded"
                        // style={{
                        //   !formik.values.statement ? pointerEvents:'none',cursor:'not-allowed':pointerEvents:'',cursor:'pointer'
                        //   pointerEvents: !formik.values.statement ? 'none' : '',
                        //   cursor: !formik.values.statement ? 'not-allowed' : 'pointer',
                        //   background: !formik.values.statement ? '#474747' : '',
                        // }} 
                        style={
                          !formik.values.statement
                            ? {
                              cursor: 'not-allowed',
                              background: '#474747',
                            }
                            : {
                              pointerEvents: 'auto',
                              cursor: 'pointer',
                            }
                        }
                        disabled={!formik.values.statement} >{loading ? 'Uploading...' : 'Save'}</button>
                      <button
                        type="button"
                        style={{
                          cursor: !formik.values.statement ? 'not-allowed' : 'pointer',
                          background: !formik.values.statement ? '#474747' : ''
                        }}
                        disabled={!formik.values.statement || !(formik.values.statement instanceof File)}
                        onClick={handlePrintPDF}
                      >
                        Print
                      </button>
                      <a href="" className="viewuploaded view-doc-cta" onClick={(e) => { e.preventDefault(); handlePermissionOnRead() }}>
                        View Recently Uploaded
                      </a>
                    </div>
                  </div>
                </form>
              </div>
              //   {!readPermission && (
              //     <div
              //       style={{
              //         position: 'absolute',
              //         top: '55px',
              //         left: '0',
              //         height: '100%',
              //         width: '100%',
              //         background: 'rgba(255, 255, 255, 0.3)',
              //         display: 'flex',
              //         alignItems: 'center',
              //         justifyContent: 'center',
              //         fontSize: '1.8rem',
              //         fontWeight: 'bold',
              //         color: '#444',
              //         zIndex: 1,
              //         overflow: 'hidden'
              //       }}
              //     >
              //       <div style={{
              //         fontSize: '1.8rem',
              //         fontWeight: 'bold',
              //         top:'30px',
              //         left:'50%',
              //         color:'red'
              //       }}>
              //       You don't have permission to access this page
              //       </div>
              //     </div>
              //   )}
              // </div >
            )
        }
      </div >
      {showPreviewModal && (
        <PDFPreviewModal
          show={showPreviewModal}
          fileUrl={formik?.values?.statement}
          onClose={() => setShowPreviewModal(false)}
          onSave={() => {
            setShowPreviewModal(false);
            formik.handleSubmit(); // or your custom save logic
          }}
        />


      )}

    </>
  );
};

export default BankStatement;
