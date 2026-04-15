const Image_Url = import.meta.env.VITE_REPORT_DOWNLOAD_URL
import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PaginationControl from '../../../components/user/PaginationControl';
import SchedulerReportDropDown from '../../../components/user/SchedulerReportDropDown';
import { useAuth } from '../../../contexts/AuthContext';
import { getClients } from '../../../redux/slices/ledgerSlice';
import { getAllModulesForReports, getAllMonthsData } from '../../../redux/slices/schedulerReportsSlice';

const SchedulerReports = () => {
    const { isSidebarOpen } = useAuth();
    const dispatch = useDispatch()
    const [selectedReport, setSelectedReport] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [perPage, setPerPage] = useState(10);
    const { data } = useSelector((state) => state.schedulerReports);
    const { reportsData, loading } = useSelector((state) => state.schedulerReports);
    const [downloadReport, setDownloadReport] = useState('')
    const { clients } = useSelector(state => state.ledger);
    const [ledger_client_id, setLedger_client_id] = useState(null);
    const [sortKey, setSortKey] = useState(null);
    const [sortOrder, setSortOrder] = useState("asc");
    const [filteredData, setFilteredData] = useState(downloadReport)
    const { permissionMenu } = useSelector((state) => state?.user)
    localStorage.setItem("menuPermissions", JSON.stringify(permissionMenu));

    useEffect(() => {
        dispatch(getAllModulesForReports());
        // dispatch(checkUserPermission())
    }, [dispatch]);

    useEffect(() => {
        setDownloadReport(reportsData)
        setFilteredData(reportsData)
    }, [reportsData])

    useEffect(() => {
        let formData = {}
        formData.key = selectedReport || "BANK_STATEMENT"
        if (ledger_client_id) {
            const fetchData = async () => {
                formData.ledger_client_id = ledger_client_id
                let resut = await dispatch(getAllMonthsData(formData))
                if (resut?.payload?.success) {
                    setLedger_client_id(null)
                }
            }
            fetchData()
        } else {
            dispatch(getAllMonthsData(formData))
        }
    }, [dispatch, selectedReport, setLedger_client_id])
    const handleSort = (field) => {
        let sorted = [...downloadReport];
        sorted.sort((a, b) => {
            let aValue, bValue;
            if (field === "month_year") {
                aValue = new Date(a.year, a.month - 1);
                bValue = new Date(b.year, b.month - 1);
            } else if (field === "serial_no") {
                aValue = parseInt(a.serial_no, 10);
                bValue = parseInt(b.serial_no, 10);
            } else {
                aValue = a[field];
                bValue = b[field];
            }
            if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
            if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
            return 0;
        });
        setFilteredData(sorted);
        setSortKey(field);
        setSortOrder(prev => (prev === "asc" ? "desc" : "asc"));
    };

    const getSortArrow = (key) => {
        if (sortKey !== key) return "";
        return sortOrder === "asc" ? "↑" : "↓";
    };

    const totalRecords = filteredData?.length ? filteredData.length : 0;
    const totalPages = Math.ceil(filteredData?.length / perPage);

    const perPageOptions = [...Array(Math.ceil(totalRecords / 10))]
        .map((_, i) => (i + 1) * 10)
        .filter((val) => val <= 40);
    const perPageOptions1 = perPageOptions.length > 0 ? perPageOptions : [10];

    const paginatedData = useMemo(() => {
        const start = (currentPage - 1) * perPage;
        return filteredData.slice(start, start + perPage);
    }, [filteredData, currentPage, perPage]);

    useEffect(() => {
        dispatch(getClients());
    }, [dispatch]);


    return (
        <div className={`dashboard-body-wrp show ${isSidebarOpen ? "active" : ""}`}>
            <div className="search-bar-wrp">
                <div className="search-bar">
                    <form>
                        {/* <div className="input-grp search">
                            <input type="text" name="search" placeholder="Search by User name" />
                            <button type="submit" aria-label="Perform search">
                                <img src="images/search-icon.svg" alt="Search Icon" loading="lazy" />
                            </button>
                        </div> */}
                    </form>
                    <div className="dsbdy-frm-btn-grp mt-0 dbllrg-btn">
                        <SchedulerReportDropDown
                            setSelectedReport={setSelectedReport}
                            selectedReport={selectedReport}
                            allModule={data}
                            clients={clients}
                            setLedger_client_id={setLedger_client_id}

                        />
                    </div>
                </div>
            </div>
            <div className="dashboard-body dsbrd-tbl-body">
                <form>
                    <div className="ds-bdy-head mb-3">
                        <div className="ds-filter-wrp">

                            <div className="ds-filter-input-wrp">
                                <div className="input-grp">
                                </div>
                            </div>
                            <div className="bank-charges-inr-btn-wrp">
                            </div>
                        </div>
                    </div>
                    {/* Table Content */}
                    <div className="ds-bdy-content">
                        <div className="ds-bdy-table-wrp">
                            <div className="table-container">
                                <table className="leader-summry-table">
                                    <thead>
                                        <tr>
                                            <th className="serial_no-col" onClick={() => handleSort("serial_no")} style={{ cursor: "pointer" }}>
                                                S.No {getSortArrow("serial_no")}
                                            </th>
                                            <th className="month_year-col" onClick={() => handleSort("month_year")} style={{ cursor: "pointer" }}>
                                                Month / Year {getSortArrow("month_year")}
                                            </th>
                                            <th className="download-col">Download Report</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {loading ? (
                                            <tr>
                                                <td colSpan="100%" style={{ textAlign: "center" }}>Loading...</td>
                                            </tr>
                                        ) : paginatedData?.length > 0 ? (
                                            paginatedData.map((row, index) => (
                                                <tr key={index}>
                                                    <td>
                                                        {/* <input
                                                            type="checkbox"
                                                            style={{ marginRight: '8px' }}
                                                            value={row?.id}
                                                            onChange={(e) => handleCheckboxChange(e, row)}
                                                        /> */}
                                                        {row?.serial_no}
                                                    </td>
                                                    <td>{new Date(`${row?.year}-${row?.month}-01`).toLocaleDateString("en-US", {
                                                        year: "numeric",
                                                        month: "long",
                                                    })}</td>
                                                    <td>
                                                        <a
                                                            href={`${Image_Url}${row?.doc_path}`} // Full file URL
                                                            download={`Report-${row?.month}-${row?.year}.csv`} // Desired download filename
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                        >
                                                            <img src="/images/export-csv-icon.png" alt="export-csv icon" width={40} />
                                                        </a>

                                                        <a
                                                            href={`${Image_Url}${row?.pdf_path}`} // Full file URL
                                                            download={`Report-${row?.month}-${row?.year}.csv`} // Desired download filename
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                        >
                                                            <img src="/images/export-pdf-icon.png" alt="export-pdf icon" width={42} />
                                                        </a>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="100%" style={{ textAlign: "center" }}>No Records Found</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </form>
                {/* Items Per Page Dropdown */}
                <div style={{ marginTop: '60px', }}>
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
                    {/* Pagination Controls */}
                    <PaginationControl
                        currentPage={currentPage}
                        totalPages={totalPages}
                        pageSize={perPage}
                        totalItems={totalRecords}
                        onPageChange={(page) => {
                            if (page >= 1 && page <= totalPages) {
                                setCurrentPage(page);
                            }
                        }}
                    />
                </div>
            </div>
        </div>
    )
}

export default SchedulerReports
