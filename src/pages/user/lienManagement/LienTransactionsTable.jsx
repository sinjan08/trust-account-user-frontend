import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useAuth } from '../../../contexts/AuthContext';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { LienTransaction } from '../../../redux/slices/lienSlice';
import useSortableData from '../../../hooks/useSortableData';
import PaginationControl from '../../../components/user/PaginationControl';
import DateRangePickerCustom from '../../../components/popup/DateRangePickerCustom';
import { format } from 'date-fns';
import AddTransactionsModal from '../../../components/popup/AddTransactionsModal';
import { checkUserPermission } from '../../../redux/slices/userSlice';


const LienTransactionsTable = () => {
    const { isSidebarOpen } = useAuth();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { lienTransactionData, loading } = useSelector((state) => state?.lien)
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [filteredData, setFilteredData] = useState([])
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [selectedLiens, setSelectedLiens] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [addNewTransactionModal, setAddNewTransactionModal] = useState(false)
    const [lien_id, setLien_id] = useState();
    const [client_id, setClient_id] = useState()
    const { permissionMenu } = useSelector((state) => state?.user);
    const location = useLocation()
    localStorage.setItem("menuPermissions", JSON.stringify(permissionMenu));

    useEffect(() => {
        // dispatch(checkUserPermission())
        const urlParams = new URLSearchParams(window.location.search);
        const lienId = urlParams.get("lien_id");
        const clientId = urlParams.get("client_id");

        if (lienId) {
            dispatch(LienTransaction({ lien_id: Number(lienId) }));
        } else {
            console.warn("No lien_id in URL. Redirecting...");
            navigate(-1);
        }


        setLien_id(lienId);
        setClient_id(clientId);
    }, [navigate, dispatch]);

    useEffect(() => {
        if (lienTransactionData) {
            setFilteredData(lienTransactionData)
        }
    }, [])

    const { sortedData, sortConfig, handleSort } = useSortableData(filteredData || []);
    const paginatedData = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        return sortedData?.slice(start, start + itemsPerPage);
    }, [sortedData, currentPage, itemsPerPage]);

    const getSortArrow = (key) =>
        sortConfig.key === key ? (sortConfig.direction === "asc" ? " ↑" : " ↓") : "";

    const totalRecords = lienTransactionData?.length;

    const perPageOptions = [...Array(Math.ceil(totalRecords / 10))]
        .map((_, i) => (i + 1) * 10)
        .filter((val) => val <= 40);
    const perPageOptions1 = perPageOptions.length > 0 ? perPageOptions : [10];


    const totalPages = Math.ceil(sortedData?.length / itemsPerPage);

    useEffect(() => {
        setCurrentPage(1);
    }, [filteredData]);



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
        let filtered = [...lienTransactionData];
        if (startDate && endDate) {
            filtered = filtered.filter((item) => {
                const itemDate = new Date(item?.date);
                itemDate.setHours(0, 0, 0, 0);
                return itemDate >= startDate && itemDate <= endDate;
            });
        }
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            filtered = filtered.filter(
                (item) =>
                    item?.client_name?.toLowerCase()?.includes(term)
            );
        }
        setFilteredData(filtered);
    }, [lienTransactionData, startDate, endDate, searchTerm]);
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
        setFilteredData(lienTransactionData);
    };



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

    const handleAddTransaction = () => {
        dispatch(checkUserPermission()).then((res) => {
            console.log(" result:", res.payload.data.permissions);
            const matched = res?.payload?.data?.permissions?.find((item) => item.url === location.pathname);
            // console.log("permissionsListlghdfiohofdhkfghk", permissionsList)
            if (!(matched?.has_add_permission === '1' || matched?.has_add_permission === 1)) {
                toast.error('You do not have permission to view this lien.');
                return;
            }
            setAddNewTransactionModal(true)
        }).catch((err) => {
            console.log(err)
        });

    }

    return (
        <>
            <div className={`dashboard-body-wrp show ${isSidebarOpen ? "active" : ""}`}>
                <div className="search-bar-wrp">
                    <div className="search-bar">
                        <form>
                            <div className="input-grp search">
                                <input type="text" name="search" placeholder="Search by Client name" value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)} />
                                <button type="submit" aria-label="Perform search">
                                    <img src="images/search-icon.svg" alt="Search Icon" loading="lazy" />
                                </button>
                            </div>
                        </form>
                        <div className="dsbdy-frm-btn-grp mt-0 dbllrg-btn">
                            <button className="cmn-btn-2 blue-bg" onClick={() => handleAddTransaction()}><img src="images/plus-icon.svg" alt="Icon" />Add Transactions </button>
                        </div>
                    </div>
                </div>
                <div className="dashboard-body dsbrd-tbl-body">
                    <form>
                        <div className="ds-bdy-head mb-3">
                            <div className="ds-filter-wrp">
                                <div className="ds-filter-input-wrp">
                                    <DateRangePickerCustom handleApply={handleApply} handleCancel={handleDateCancel} />
                                    <div className="input-grp">

                                    </div>
                                </div>
                                <div className="bank-charges-inr-btn-wrp">
                                </div>
                            </div>
                        </div>

                        <div className="ds-bdy-content">
                            <div className="ds-bdy-table-wrp table-responsive">
                                <table className="leader-summry-table" style={{ minWidth: 'max-content' }}>
                                    <thead>
                                        <tr>
                                            <th onClick={() => handleSort("serial_no")} style={{ cursor: "pointer" }}>S.No {getSortArrow('serial_no')}</th>
                                            <th onClick={() => handleSort("date")} style={{ cursor: "pointer" }}>Date {getSortArrow('date')}</th>
                                            <th onClick={() => handleSort("client_name")} style={{ cursor: "pointer" }}>Client Name {getSortArrow('client_name')}</th>
                                            <th onClick={() => handleSort("matter")} style={{ cursor: "pointer" }}>Matter {getSortArrow('matter')}</th>
                                            <th onClick={() => handleSort("payee")} style={{ cursor: "pointer" }}>Payee {getSortArrow('payee')}</th>
                                            <th onClick={() => handleSort("transaction_method")} style={{ cursor: "pointer" }}>Transaction Method {getSortArrow('transaction_method')}</th>
                                            <th onClick={() => handleSort("transaction_number")} style={{ cursor: "pointer" }}>Transaction Number {getSortArrow('transaction_number')}</th>
                                            <th onClick={() => handleSort("deposit_amount")} style={{ cursor: "pointer" }}>Deposit Amount {getSortArrow('deposit_amount')}</th>
                                            <th onClick={() => handleSort("disbursement_amount")} style={{ cursor: "pointer" }}>Disbursement Amount {getSortArrow('disbursement_amount')}</th>
                                            <th onClick={() => handleSort("lien_balance")} style={{ cursor: "pointer" }}>Lien Amount {getSortArrow('lien_balance')}</th>
                                            <th onClick={() => handleSort("purpose")} style={{ cursor: "pointer" }}>Purpose {getSortArrow('purpose')}</th>
                                            <th >Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {paginatedData?.length > 0 ? (
                                            paginatedData.map((lien, index) => (
                                                <tr key={index}>
                                                    <td>{lien?.serial_no}</td>
                                                    <td>{new Date(lien?.date).toLocaleDateString("en-GB")}</td>
                                                    <td>{lien?.client_name}</td>
                                                    <td>{lien?.matter}</td>
                                                    <td>{lien?.payee}</td>
                                                    <td>{lien?.transaction_method?.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}</td>
                                                    <td>{lien?.transaction_number}</td>
                                                    <td>{formatCurrency(lien?.deposit_amount)}</td>
                                                    <td>{formatCurrency(lien?.disbursement_amount)}</td>
                                                    <td>{formatCurrency(lien?.lien_balance)}</td>
                                                    <td style={{ whiteSpace: 'normal', wordBreak: 'break-word', maxWidth: '200px' }}>{lien?.purpose}</td>
                                                    <td>{lien?.status}</td>
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
                    </form>
                    <div style={{ marginTop: '60px', }}>
                        <div className="select-item-count">
                            <select
                                value={itemsPerPage}
                                onChange={(e) => {
                                    setItemsPerPage(Number(e.target.value));
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
                            pageSize={itemsPerPage}
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
            <AddTransactionsModal
                onClose={() => setAddNewTransactionModal(false)}
                isOpen={addNewTransactionModal}
                lien_id={lien_id}
                ledger_client_id={client_id}
            />
        </>

    )
}

export default LienTransactionsTable
