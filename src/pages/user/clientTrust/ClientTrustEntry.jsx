import { useFormik } from "formik";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from 'yup';
import PaginationControl from "../../../components/user/PaginationControl";
import { useAuth } from "../../../contexts/AuthContext";
import { useDateRangeFilter } from "../../../hooks/useDateRangeFilter";
import useSortableData from "../../../hooks/useSortableData";
import { baseURL } from "../../../redux/Api";
import { uploadTrustAccountDocs, viewRecentUploads } from "../../../redux/slices/trustAccountSlice";
import DateRangePickerCustom from "../../../components/popup/DateRangePickerCustom";
import PDFPreviewModal from "../../../components/popup/PDFPreviewModal";
import { format } from "date-fns";
import { toast } from "react-toastify";
import { checkUserPermission } from "../../../redux/slices/userSlice";


const ClientTrustEntry = () => {
    const { isSidebarOpen } = useAuth();
    const [isOpenTabel, setIsOpenTab] = useState(false);
    const [selectedMonthYear, setSelectedMonthYear] = useState("");
    const [currentPage, setCurrentPage] = useState(1);    // setting default page
    const [filteredData, setFilteredData] = useState([]);
    const [perPage, setPerPage] = useState(50);   // setting default items per page
    const [data, setData] = useState([]);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [showPreviewModal, setShowPreviewModal] = useState(false);
    const [previewURL, setPreviewURL] = useState(null);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [readPermission, setReadPermission] = useState(0)
    const [addPermission, setAddPermission] = useState(0)
    const [editPermission, setEditPermission] = useState(0)
    const [deletePermission, setDeletePermission] = useState(0)
    // console.log("readPermission", readPermission, "addPermission", addPermission, "editPermission", editPermission, "deletePermission", deletePermission)
    //   const { permissionMenu } = useSelector((state) => state?.user)
    //   localStorage.setItem("menuPermissions", JSON.stringify(permissionMenu));
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

    const dispatch = useDispatch();
    const { trustDocs, loading } = useSelector((state) => state.trustAccount);
    const formik = useFormik({
        initialValues: {
            bank_name: "",
            bank_info: "",
            document: null
        },
        validationSchema: Yup.object({
            bank_name: Yup.string().required("Bank Name is required"),
            bank_info: Yup.string().nullable(),
            document: Yup.mixed().required("Please upload a document")
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
            const result = await dispatch(uploadTrustAccountDocs(values));

            if (result?.payload?.success) {
                setUploadProgress(100);
                setTimeout(() => setUploadProgress(0), 1000);
                formik.resetForm();
                dispatch(viewRecentUploads());
                setIsOpenTab(true);
            } else {
                setUploadProgress(0);
            }
        }
    })
    const handleDateSearch = (dateRange) => {
        const [start, end] = dateRange.map((date) => {
            const normalizedDate = new Date(date);
            normalizedDate.setHours(0, 0, 0, 0);
            return normalizedDate;
        });
        setStartDate(start);
        setEndDate(end);
    };

    useEffect(() => {
        dispatch(viewRecentUploads());
        // dispatch(checkUserPermission())
    }, [dispatch]);
    useEffect(() => {
        if (trustDocs && trustDocs.length > 0) {
            setData(trustDocs);
        }
    }, [trustDocs]);

    useEffect(() => {
        setFilteredData(data);
    }, [data]);
    const handleBackButton = () => {
        setFilteredData(trustDocs)
    }
    useEffect(() => {
        let filtered = [...trustDocs];

        if (selectedMonthYear) {
            filtered = filterByMonthYear(filtered, selectedMonthYear);
            // console.log("filtered",filtered)
        }

        if (startDate && endDate) {
            filtered = filtered.filter((item) => {
                const itemDate = new Date(item?.date);
                itemDate.setHours(0, 0, 0, 0);
                return itemDate >= startDate && itemDate <= endDate;
            });
        }

        setFilteredData(filtered);
    }, [trustDocs, selectedMonthYear, startDate, endDate]);
    // console.log("FilteredData",filteredData)
    const handleApply = useCallback(
        (range) => {
            if (range?.length === 2) {
                const formattedDates = range.map((date) => format(date, "yyyy-MM-dd")); // Format as yyyy-MM-dd
                handleDateSearch(formattedDates);
            }
        },
        [handleDateSearch]
    );
    const handleDateCancel = () => {
        setFilteredData(data);
    };

    const { sortedData, sortConfig, handleSort } = useSortableData(filteredData);
    const getSortArrow = (key) =>
        sortConfig?.key === key
            ? sortConfig?.direction === "asc"
                ? " ↑"
                : " ↓"
            : "";

    const totalRecords = sortedData?.length;

    const perPageOptions = [...Array(Math.ceil(totalRecords / 10))]
        .map((_, i) => (i + 1) * 10)
        .filter((val) => val <= 40);
    const perPageOptions1 = perPageOptions.length > 0 ? perPageOptions : [10];

    const paginatedData = useMemo(() => {
        const start = (currentPage - 1) * perPage;
        return sortedData?.slice(start, start + perPage);
    }, [sortedData, currentPage, perPage]);
    const totalPages = Math.ceil(sortedData?.length / perPage);
    useEffect(() => {
        setCurrentPage(1);
    }, [filteredData]);


    const uniqueMonthYears = [
        ...new Set(
            trustDocs?.map(item => {
                const d = new Date(item.date);
                return `${d.toLocaleString('default', { month: 'long' })} ${d.getFullYear()}`;
            })
        ),
    ];

    const filterByMonthYear = (data, monthYear) => {
        const [selectedMonth, selectedYear] = monthYear.split(' ');
        return data.filter((item) => {
            const date = new Date(item.date);
            const itemMonth = date.toLocaleString('default', { month: 'long' });
            const itemYear = date.getFullYear().toString();

            return itemMonth === selectedMonth && itemYear === selectedYear;
        });
    };
    // const handlePrintPDF = (fileURL, fileName = '') => {
    //     const extension = fileName?.split('.').pop()?.toLowerCase()
    //     if (!extension || !fileURL) return;
    //     if (['pdf', 'jpg', 'jpeg', 'png'].includes(extension)) {
    //         const printWindow = window.open(fileURL, "_blank");
    //         console.log("object", printWindow)
    //         printWindow.addEventListener("load", () => {
    //             printWindow.focus();
    //             printWindow.print();
    //         });
    //     } else {
    //         const link = document.createElement("a");
    //         console.log("link", link)
    //         link.href = fileURL;
    //         link.download = fileName || 'document';
    //         document.body.appendChild(link);
    //         link.click();
    //         document.body.removeChild(link);
    //     }
    // };


    const handleDownloadFile = async (fileURL, fileName = 'document') => {
        try {
            const response = await fetch(fileURL, {
                method: 'GET',
                headers: {
                    // Add authorization if needed
                    // 'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) throw new Error('Network response was not ok');

            const blob = await response.blob();
            const blobURL = window.URL.createObjectURL(blob);

            const link = document.createElement('a');
            link.href = blobURL;
            link.download = fileName;
            document.body.appendChild(link);
            link.click();

            // Clean up
            link.remove();
            window.URL.revokeObjectURL(blobURL);
        } catch (error) {
            console.error('Download failed:', error);
            alert('Failed to download file.');
        }
    };



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

    const handlePermission = () => {
        toast.error('You do not have permission to add documents.');
    }
    const handlePermissionOnRead = () => {
        if (readPermission === 1) {
            setIsOpenTab(true);
        } else {
            toast.error('You do not have permission to add documents.');
        }

    }


    return (
        <>
            <div className={`dashboard-body-wrp show ${isSidebarOpen ? "active" : ""}`}>
                {
                    isOpenTabel === true ? (
                        <>
                            <div className="back-btn" onClick={() => { handleBackButton(), setIsOpenTab(false) }} style={{ cursor: "pointer" }}>
                                <img src="images/back-icon.svg" alt="Back icon" />
                            </div>
                            <div className="dashboard-body dsbrd-tbl-body">
                                <form>
                                    <div className="ds-bdy-head mb-3">
                                        <div className="ds-filter-wrp">
                                            <div className="ds-filter-input-wrp">
                                                <p className="inr-panel-title" style={{
                                                    fontSize: "24px",
                                                    marginRight: "5rem",
                                                }}>Previously Uploaded Documents</p>
                                                <DateRangePickerCustom handleApply={handleApply} handleCancel={handleDateCancel} />
                                                <div className="input-grp">
                                                    <select value={selectedMonthYear} onChange={(e) => { setSelectedMonthYear(e.target.value); setCurrentPage(1); }}>
                                                        <option value="">All Months</option>
                                                        {uniqueMonthYears?.map((option) => (
                                                            <option key={option} value={option}>{option}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="ds-bdy-content">
                                        <div className="ds-bdy-table-wrp">
                                            <table>
                                                <thead>
                                                    <tr>
                                                        <th className="" onClick={() => handleSort("serial_no")} style={{ cursor: "pointer" }}>S.No {getSortArrow("serial_no")}</th>
                                                        <th className="date-col" onClick={() => handleSort("date")} style={{ cursor: "pointer" }}>Date {getSortArrow("date")}</th>
                                                        <th className="bank-info-col" onClick={() => handleSort("bank_info")} style={{ cursor: "pointer" }}>Bank Info {getSortArrow("bank_info")}</th>
                                                        <th className="bank-name-col" onClick={() => handleSort("bank_name")} style={{ cursor: "pointer" }}>Bank Name {getSortArrow("bank_name")}</th>
                                                        <th className="upload-doc-col">Upload Documents</th>
                                                        <th className="download-doc-col">Download</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {loading ? (
                                                        <tr>
                                                            <td colSpan="100%">Loading...</td>
                                                        </tr>
                                                    ) : paginatedData && paginatedData.length > 0 ? (
                                                        paginatedData.map((row) => {
                                                            const [y, m, d] = row?.date?.split('-') || [];
                                                            return (
                                                                <tr key={row?.id}>
                                                                    <td>{row?.serial_no}</td>
                                                                    <td>{m && d && y ? `${m}/${d}/${y}` : ""}</td>
                                                                    <td className="text-truncate">{row?.bank_info}</td>
                                                                    <td className="text-truncate">{row?.bank_name}</td>
                                                                    <td className="text-truncate">
                                                                        {row?.documents?.map((doc) => doc.split(".")[0]).join(", ")}
                                                                    </td>
                                                                    <td style={{ color: 'blue' }}>
                                                                        {/* <button
                                                                            className="download-btn"
                                                                            onClick={(e) => { e.preventDefault(); handlePrintPDF(`${baseURL.replace('/api', '/')}${row?.document_path?.replace(/\\/g, '/')}`, row?.document_path?.replace(/\\/g, '/')) }}
                                                                        >
                                                                            Download
                                                                        </button> */}
                                                                        <button
                                                                            className="download-btn"
                                                                            style={{
                                                                                border:'none'
                                                                            }}
                                                                            onClick={(e) => {
                                                                                e.preventDefault();
                                                                                const fileURL = `${baseURL.replace('/api', '/')}${row?.document_path?.replace(/\\/g, '/')}`;
                                                                                const fileName = row?.document_path?.split('/').pop();
                                                                                handleDownloadFile(fileURL, fileName);
                                                                            }}
                                                                        >
                                                                            Download
                                                                        </button>

                                                                    </td>
                                                                </tr>
                                                            );
                                                        })
                                                    ) : (
                                                        <tr>
                                                            <td colSpan="100%" style={{ textAlign: "center" }}>
                                                                No Records Found
                                                            </td>
                                                        </tr>
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>

                                    <div className="select-item-count">
                                        <select
                                            value={perPage}
                                            onChange={(e) => {
                                                setPerPage(Number(e.target.value));
                                                setCurrentPage(1);
                                            }}
                                        >
                                            {perPageOptions1.map((option) => (
                                                <option key={option} value={option}>
                                                    {option} per page
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <PaginationControl
                                        currentPage={currentPage}
                                        totalPages={totalPages}
                                        pageSize={perPage}
                                        totalItems={data.length}
                                        onPageChange={(page) => {
                                            if (page >= 1 && page <= totalPages) {
                                                setCurrentPage(page);
                                            }
                                        }}
                                    />
                                </form>
                            </div>
                        </>
                    ) : (
                        // <div style={{
                        //     position: 'relative',
                        //     overflow: !readPermission ? 'hidden' : '', // ✨ Add this
                        //     height: !readPermission ? '74vh' : '',
                        // }}>
                        <div className="dashboard-body"
                        // style={{
                        //     filter: !readPermission ? 'blur(4px)' : 'none',
                        //     pointerEvents: !readPermission ? 'none' : 'auto',
                        //     userSelect: !readPermission ? 'none' : 'auto',
                        //     opacity: !readPermission ? 0.6 : 1,
                        //     height: readPermission ? 'auto' : '100vh', // avoid forcing viewport height when no access
                        //     // overflow: 'hidden' // ✨ to prevent scroll within this div
                        // }} 
                        >

                            <div className="ds-bdy-head max">
                                <h1>Client Trust Entry</h1>
                                <strong>Enter your documents for monthly reconciliation and accounts management</strong>
                            </div>
                            <form onSubmit={formik.handleSubmit}>
                                <div className="ds-client-info-wrp">
                                    <h3>Client Information</h3>
                                    <div className="ds-client-info-form">
                                        <div className="input-grp" >
                                            <label htmlFor="bank-info">Bank Location</label>
                                            <input
                                                // disabled={!addPermission}
                                                type="text"
                                                name="bank_info"
                                                id="bank-info"
                                                placeholder="Enter Bank Information"
                                                value={formik.values.bank_info}
                                                {...formik.getFieldProps("bank_info")}
                                                onClick={() => {
                                                    if (addPermission == 0) {
                                                        handlePermission();
                                                    }
                                                }} readOnly={addPermission === 0}
                                            />
                                            {(addPermission === 1 || addPermission == '1') && (formik.touched.bank_info && formik.errors.bank_info && (
                                                <div className="text-danger">{formik.errors.bank_info}</div>
                                            ))}
                                        </div>
                                        <div className="input-grp" >
                                            <label htmlFor="bank-name">Bank Name</label>
                                            <input
                                                type="text"
                                                name="bank_name"
                                                id="bank-name"
                                                placeholder="Enter Bank Name"
                                                value={formik.values.bank_name}
                                                {...formik.getFieldProps("bank_name")}
                                                onClick={() => {
                                                    if (addPermission == 0) {
                                                        handlePermission();
                                                    }
                                                }} readOnly={addPermission === 0}
                                            />
                                            {(addPermission === 1 || addPermission == '1') && (formik.touched.bank_name && formik.errors.bank_name && (
                                                <div className="text-danger">{formik.errors.bank_name}</div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <div className="dsbdy-content">
                                    <h2 className="dsbdy-content-title">Upload Document</h2>
                                    <div className="input-grp" >
                                        <label htmlFor="file-upload" >Upload Disclosures + Other Client(s) Documents</label>
                                        <div className="file-input" onClick={(e) => {
                                            if (addPermission === 0) {
                                                e.preventDefault();
                                                handlePermission();
                                            }
                                        }}>
                                            <input
                                                type="file"
                                                id="file-upload"
                                                name="document"
                                                accept=".pdf, .doc, .docx, .xls, .xlsx, .jpg, .png"
                                                onChange={(event) => {
                                                    formik.setFieldValue("document", event.currentTarget.files[0]);
                                                }}
                                            // disabled={!addPermission}
                                            />
                                            <div className="upload-placeholder">
                                                <img className="upload-icon" src="images/upload-img.svg" alt="Upload Icon" />
                                                <p>PDFs, Word documents, Excel files, images (JPEG, PNG)</p>
                                            </div>
                                        </div>
                                        {formik.touched.document && formik.errors.document && (
                                            <div className="text-danger">{formik.errors.document}</div>
                                        )}
                                    </div>
                                    <div className="addon-info">
                                        *All documents and information shall be exportable. + All document uploads shall have the ability for note and name entry.
                                    </div>
                                    <div className="dsbdy-frm-btn-grp" >
                                        {
                                            uploadProgress > 0 && (
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
                                            )
                                        }
                                        <button
                                            type="button"
                                            disabled={!Boolean(formik.values.document)}
                                            style={{
                                                cursor: !formik.values.document ? 'not-allowed' : 'pointer',
                                                background: !formik.values.document ? '#474747' : ''
                                            }}
                                            onClick={() => {
                                                const file = formik.values.document;
                                                if (file) {
                                                    const fileURL = URL.createObjectURL(file);
                                                    const extension = file.name.split('.').pop().toLowerCase();

                                                    if (['pdf', 'jpg', 'jpeg', 'png'].includes(extension)) {
                                                        setPreviewURL(fileURL);
                                                        setShowPreviewModal(true);
                                                    } else {
                                                        const link = document.createElement("a");
                                                        link.href = fileURL;
                                                        link.download = file.name;
                                                        document.body.appendChild(link);
                                                        link.click();
                                                        document.body.removeChild(link);
                                                    }
                                                }
                                            }}
                                        >
                                            Preview
                                        </button>

                                        <button type="submit" className="viewuploaded" style={{
                                            cursor: !formik.values.document ? 'not-allowed' : 'pointer',
                                            background: !formik.values.document ? '#474747' : ''
                                        }}
                                            disabled={!formik.values.document}
                                        >Save</button>
                                        <button
                                            type="button"
                                            disabled={!formik.values.document}
                                            onClick={() => handlePrintPDF(URL.createObjectURL(formik.values.document))}
                                            style={{
                                                cursor: !formik.values.document ? 'not-allowed' : 'pointer',
                                                background: !formik.values.document ? '#474747' : ''
                                            }}
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

                        //     {!readPermission && (
                        //         <div
                        //             style={{
                        //                 position: 'absolute',
                        //                 top: '0',
                        //                 left: '0',
                        //                 height: '100%',
                        //                 width: '100%',
                        //                 background: 'rgba(255, 255, 255, 0.7)',
                        //                 display: 'flex',
                        //                 alignItems: 'center',
                        //                 justifyContent: 'center',
                        //                 fontSize: '1.8rem',
                        //                 fontWeight: 'bold',
                        //                 color: '#444',
                        //                 zIndex: 10,
                        //                 overflow: 'hidden'
                        //             }}
                        //         >
                        //             You don't have permission to access this page
                        //         </div>
                        //     )}
                        // </div >
                    )
                }

            </div >
            {showPreviewModal && (
                <PDFPreviewModal
                    show={showPreviewModal}
                    fileUrl={formik?.values.document}
                    onClose={() => setShowPreviewModal(false)}
                    onSave={() => {
                        setShowPreviewModal(false);
                        formik.handleSubmit();
                    }}
                />


            )}
        </>
    );
};

export default ClientTrustEntry;
