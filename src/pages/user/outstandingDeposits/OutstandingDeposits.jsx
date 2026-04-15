import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PaginationControl from '../../../components/user/PaginationControl';
import ReportDownloadDropdown from '../../../components/user/ReportDownloadDropdown';
import { useAuth } from '../../../contexts/AuthContext';
import { useDateRangeFilter } from '../../../hooks/useDateRangeFilter';
import useSortableData from '../../../hooks/useSortableData';
import { getAlLOutstandingDeposits } from '../../../redux/slices/outstandingSlice';
import { formatDateDisplay } from '../../../utils/helper';
import { format } from 'date-fns';
import DateRangePickerCustom from '../../../components/popup/DateRangePickerCustom';
import { checkUserPermission } from '../../../redux/slices/userSlice';
const OutstandingDeposits = () => {

    const { isSidebarOpen } = useAuth()
    const [selectedMonthYear, setSelectedMonthYear] = useState();
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);    // setting default page
    const [filteredData, setFilteredData] = useState([]);
    const [perPage, setPerPage] = useState(50);   // setting default items per page
    const [monthYearOptions] = useState([]);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [selectedLiens, setSelectedLiens] = useState([]);
    const [readPermission, setReadPermission] = useState(0)
    const [addPermission, setAddPermission] = useState(0)
    const [editPermission, setEditPermission] = useState(0)
    const [deletePermission, setDeletePermission] = useState(0)
//       const { permissionMenu } = useSelector((state) => state?.user)
//   localStorage.setItem("menuPermissions", JSON.stringify(permissionMenu));
    // console.log("readPermission", readPermission, "addPermission", addPermission, "editPermission", editPermission, "deletePermission", deletePermission)


    const permissionsList = JSON.parse(localStorage.getItem('menuPermissions') || '[]');
    useEffect(() => {
        const currentPath = window.location.pathname;

        const matched = permissionsList.find((item) => item.url === currentPath);

        if (matched) {
            setReadPermission(matched.has_read_permission || 0);
            setAddPermission(matched.has_add_permission || 0);
            setEditPermission(matched.has_edit_permission || 0);
            setDeletePermission(matched.has_delete_permission || 0);
        } else {
            setReadPermission(0);
            setAddPermission(0);
            setEditPermission(0);
            setDeletePermission(0);
        }
    }, [permissionsList]);




    // declaring and initializing state variables
    const dispatch = useDispatch();
    const { outstandingDeposits, loading } = useSelector(state => state.outstanding);
    // calling hooks to handle date range filter

    const handleDateSearch = (dateRange) => {
        const [start, end] = dateRange.map((date) => {
            const normalizedDate = new Date(date);
            normalizedDate.setHours(0, 0, 0, 0);
            return normalizedDate;
        });
        setStartDate(start);
        setEndDate(end);
    };

    // fetching client list
    useEffect(() => {
        dispatch(getAlLOutstandingDeposits());
        //  dispatch(checkUserPermission())
    }, [dispatch]);


    const uniqueMonthYears = [
        ...new Set(
            outstandingDeposits?.map(item => {
                const d = new Date(item.date);
                return `${d.toLocaleString('default', { month: 'long' })} ${d.getFullYear()}`;
            })
        ),
    ];



    useEffect(() => {
        let result = [...outstandingDeposits];

        if (startDate && endDate) {
            result = result.filter((item) => {
                const itemDate = new Date(item?.date);
                itemDate.setHours(0, 0, 0, 0);
                return itemDate >= startDate && itemDate <= endDate;
            });
        }
        if (selectedMonthYear) {
            const [monthName, year] = selectedMonthYear.split(" ");
            const monthIndex = new Date(`${monthName} 1, ${year}`).getMonth() + 1;
            const selected = `${year}-${monthIndex.toString().padStart(2, "0")}`;

            result = result.filter((item) => {
                const itemDate = new Date(item.date);
                const itemMonthYear = `${itemDate.getFullYear()}-${(itemDate.getMonth() + 1).toString().padStart(2, '0')}`;
                return itemMonthYear === selected;
            });
        }
        if (searchTerm) {
            const searchLower = searchTerm.toLowerCase();
            result = result.filter((item) =>
                item?.payee_name?.toLowerCase().includes(searchLower) ||
                // item?.cheque_number?.toLowerCase().includes(searchLower) ||
                // item?.purpose?.toLowerCase().includes(searchLower) ||
                // item?.deposit_amount?.toLowerCase().includes(searchLower) ||
                // item?.disbursement_amount?.toLowerCase().includes(searchLower) ||
                // item?.running_balance?.toLowerCase().includes(searchLower) ||
                // item?.notes?.toLowerCase().includes(searchLower) ||
                item?.client_name?.toLowerCase().includes(searchLower)
            );
        }

        setFilteredData(result);
    }, [outstandingDeposits, startDate, endDate, selectedMonthYear, searchTerm]);

    const { sortedData, sortConfig, handleSort } = useSortableData(filteredData || []);
    const getSortArrow = (key) =>
        sortConfig?.key === key
            ? sortConfig?.direction === "asc"
                ? " ↑"
                : " ↓"
            : "";
    const totalRecords = sortedData?.length;
    // const perPageOptions = [...Array(Math.ceil(totalRecords / 10))].map((_, i) => (i + 1) * 10);
    // const perPageOptions1 = perPageOptions.length > 0 ? perPageOptions : [10];



    const perPageOptions = [...Array(Math.ceil(totalRecords / 10))]
        .map((_, i) => (i + 1) * 10)
        .filter((val) => val <= 40);
    const perPageOptions1 = perPageOptions.length > 0 ? perPageOptions : [10];

    const paginatedData = useMemo(() => {
        const start = (currentPage - 1) * perPage;
        return sortedData?.slice(start, start + perPage);
    }, [sortedData, currentPage, perPage]);

    const totalPages = Math.ceil(sortedData?.length / perPage);





    const handleApply = useCallback(
        (range) => {
            if (range?.length === 2) {
                const formattedDates = range.map((date) => format(date, "yyyy-MM-dd")); // Format as yyyy-MM-dd
                console.log("Range", formattedDates)
                handleDateSearch(formattedDates);
            }
        },
        [handleDateSearch]
    );

    const handleDateCancel = () => {
        setFilteredData(outstandingDeposits);
    };



    useEffect(() => {
        setCurrentPage(1);
    }, [filteredData]);

    const csvRequiredKeys = ['date', 'client_name', 'payee_name', 'cheque_number', 'deposit_amount'];
    const pdfData = selectedLiens.length > 0 ? selectedLiens : outstandingDeposits;
    const csvData = pdfData?.map((row) => {
        const filtered = {};
        csvRequiredKeys.forEach((key) => {
            if (key === 'date') {
                const date = new Date(row[key]);
                const formattedDate = date.toLocaleDateString('en-CA'); // 'YYYY-MM-DD'
                filtered[key] = formattedDate;
            } else if (key === 'reconcile_to_journal') {
                if (row[key] === '1') {
                    filtered[key] = 'Yes';
                } else {
                    filtered[key] = 'No';
                }
            } else {
                filtered[key] = row[key];
            }
        });
        return filtered;
    });

    const handleCheckboxChange = (e, lien) => {
        if (e.target.checked) {
            setSelectedLiens((prev) => [...prev, lien]);
        } else {
            setSelectedLiens((prev) => prev.filter((item) => item.id !== lien.id));
        }
    };


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

            <div className={`dashboard-body-wrp show ${isSidebarOpen ? "active" : ""}`}>
                {/* <div style={{
                    position: 'relative',
                    overflow: !readPermission ? 'hidden' : '', // ✨ Add this
                    height: !readPermission ? '74vh' : '',
                }}>
                    <div style={{
                        filter: !readPermission ? 'blur(4px)' : 'none',
                        pointerEvents: !readPermission ? 'none' : 'auto',
                        userSelect: !readPermission ? 'none' : 'auto',
                        opacity: !readPermission ? 0.6 : 1,
                        height: readPermission ? 'auto' : '100vh', // avoid forcing viewport height when no access
                        // overflow: 'hidden' // ✨ to prevent scroll within this div
                    }}> */}
                        <div className="search-bar-wrp">
                            <div className="search-bar">
                                <form>
                                    <div className="input-grp search">
                                        <input
                                            type="text"
                                            name="search"
                                            placeholder="Search by User name"
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                        />
                                        <button type="button" aria-label="Perform search">
                                            <img src="images/search-icon.svg" alt="Search Icon" loading="lazy" />
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                        <div className="dashboard-body dsbrd-tbl-body">
                            <form>
                                <div className="ds-bdy-head mb-3">
                                    <div className="ds-filter-wrp">

                                        <div className="ds-filter-input-wrp">
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
                                        <div className="bank-charges-inr-btn-wrp">
                                            <ReportDownloadDropdown name={'Download Report'} data={outstandingDeposits} csvData={csvData} csvRequiredKeys={csvRequiredKeys} reportName={'Oustanding Deposits Report'} />
                                        </div>
                                    </div>
                                </div>

                                {/* Table Content */}
                                <div className="ds-bdy-content">
                                    <div className="ds-bdy-table-wrp">
                                        <div className="table-container">
                                            <table>
                                                <thead>
                                                    <tr>
                                                        <th className="small-col" onClick={() => handleSort("serial_no")} style={{ cursor: "pointer" }}>S.No {getSortArrow("serial_no")}</th>
                                                        <th className="date-col" onClick={() => handleSort("date")} style={{ cursor: "pointer" }}>Date  {getSortArrow("date")}</th>
                                                        <th className="check-number-col" onClick={() => handleSort("cheque_number")} style={{ cursor: "pointer" }}>Check Number {getSortArrow("cheque_number")}</th>
                                                        <th className="payer-col" onClick={() => handleSort("payee_name")} style={{ cursor: "pointer" }}>Payer {getSortArrow("payee_name")}</th>
                                                        <th className="related-to-client-col" onClick={() => handleSort("client_name")} style={{ cursor: "pointer" }}>Related to Client {getSortArrow("client_name")}</th>
                                                        <th className="amount-col" onClick={() => handleSort("deposit_amount")} style={{ cursor: "pointer" }}>Amount {getSortArrow("deposit_amount")}</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {loading ?
                                                        (<tr><td colSpan="100%" style={{ textAlign: "center" }}>Loading...</td></tr>)
                                                        : paginatedData?.length > 0 ? (
                                                            paginatedData?.map((row, index) => (
                                                                <tr key={index}>
                                                                    <td>
                                                                        <input
                                                                            type="checkbox"
                                                                            style={{ marginRight: '8px' }}
                                                                            value={row?.id}
                                                                            onChange={(e) => handleCheckboxChange(e, row)}
                                                                        />
                                                                        {row?.serial_no}</td>
                                                                    <td>{formatDateDisplay(row?.date)}</td>
                                                                    <td className="text-truncate">{row?.cheque_number} </td>
                                                                    <td className="text-truncate">{row?.payee_name}</td>
                                                                    <td className="text-truncate">{row?.client_name}</td>
                                                                    <td className="text-truncate">{formatCurrency(row?.deposit_amount)}</td>
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
                                    pageSize={perPage} // or your actual page size
                                    totalItems={outstandingDeposits.length} // or however you calculate total items
                                    onPageChange={(page) => {
                                        if (page >= 1 && page <= totalPages) {
                                            setCurrentPage(page);
                                        }
                                    }}
                                />
                            </form>
                        </div>
                    {/* </div>
                    {!readPermission && (
                        <div
                            style={{
                                position: 'absolute',
                                top: '0',
                                left: '0',
                                height: '100%',
                                width: '100%',
                                background: 'rgba(255, 255, 255, 0.7)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '1.8rem',
                                fontWeight: 'bold',
                                color: '#444',
                                zIndex: 10,
                                overflow: 'hidden'
                            }}
                        >
                            You don't have permission to access this page
                        </div>
                    )}
                </div > */}

            </div>
        </>
    )
}

export default OutstandingDeposits
