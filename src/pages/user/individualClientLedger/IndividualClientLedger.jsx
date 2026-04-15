import { format } from 'date-fns'
import { useFormik } from 'formik'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import * as Yup from 'yup'
import DateRangePickerCustom from '../../../components/popup/DateRangePickerCustom'
import PaginationControl from '../../../components/user/PaginationControl'
import ReportDownloadDropdown from '../../../components/user/ReportDownloadDropdown'
import { useAuth } from '../../../contexts/AuthContext'
import useSortableData from '../../../hooks/useSortableData'
import { getAllCases } from '../../../redux/slices/journalSlice'
import { getClientLedger, getClientsByCaseId, getLedgerClientList } from '../../../redux/slices/ledgerSlice'
import { formatDateDisplay } from '../../../utils/helper'


const IndividualClientLedger = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const query_client_name = urlParams.get("client_name");

    const dispatch = useDispatch();
    const { caseInfo, ledgers, ledgerClients, loading } = useSelector(state => state?.ledger);
    const { cases } = useSelector(state => state?.journal);

    const [clients, setClients] = useState([]);
    const [caseDropdownData, setCaseDropdownData] = useState([]);
    const [selectedCase, setSelectedCase] = useState(null);

    const { isSidebarOpen } = useAuth()
    const [isTableOpen, setIsTableOpen] = useState(false);
    const [searchClientOpen, setSearchClientOpen] = useState(false)
    const [searchCaseOpen, setSearchCaseOpen] = useState(false)
    const [selectedClient, setSelectedClient] = useState(null);
    const [clientSearchQuery, setClientSearchQuery] = useState("");
    const [caseSearchQuery, setCaseSearchQuery] = useState("");
    const [filteredClients, setFilteredClients] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [filteredData, setFilteredData] = useState([]);
    const [perPage, setPerPage] = useState(10);
    const [selectedLiens, setSelectedLiens] = useState([]);
    const [caseData, setCaseData] = useState(null);
    const [readPermission, setReadPermission] = useState(0)
    const [addPermission, setAddPermission] = useState(0)
    const [editPermission, setEditPermission] = useState(0)
    const [deletePermission, setDeletePermission] = useState(0)

    const permissionsList = JSON.parse(localStorage.getItem('menuPermissions') || '[]');

    useEffect(() => {
        if (caseInfo) { setCaseData(caseInfo); }
    }, [caseInfo]);

    useEffect(() => {
        if (query_client_name) {
            setSelectedClient(query_client_name);
        }
    }, [query_client_name]);

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

    useEffect(() => {
        if (ledgerClients) {
            setClients(ledgerClients);
            setFilteredClients(ledgerClients);
        }
    }, [ledgerClients]);


    const clientName = urlParams.get("client_id");
    const caseId = urlParams.get("case_id");

    const paramsClientName = clientName ? clientName?.trim() : "";
    const paramsCaseId = caseId ? caseId?.trim() : "";
    useEffect(() => {
        const handleParamLedger = async () => {
            if (paramsClientName) {
                const result = await dispatch(getClientLedger({ case_id: paramsCaseId, client_id: paramsClientName }));
                // console.log(result)
                if (result?.payload?.success) {
                    formik.resetForm();
                    setIsTableOpen(true);
                }
            }
        }
        handleParamLedger();
    }, [dispatch, paramsClientName, paramsCaseId]);

    useEffect(() => {
        dispatch(getAllCases());
        dispatch(getLedgerClientList());
    }, [dispatch]);

    useEffect(() => { if (cases) setCaseDropdownData(cases) }, [cases]);




    const handleSelectClient = (client) => {
        console.log("client", client?.client_name)
        setSelectedClient(client?.client_name);
        setSearchClientOpen(false);
    }

    const handleSelectCase = (c) => {
        setSelectedCase(c?.name);
        setSearchCaseOpen(false);
        dispatch(getClientsByCaseId(c?.id));
    }

    // ✅ Filter cases when typing in Case search
    useEffect(() => {
        if (caseSearchQuery !== "") {
            const filtered = cases?.filter(c =>
                c?.name?.toLowerCase()?.includes(caseSearchQuery?.toLowerCase())
            );
            setCaseDropdownData(filtered);
        } else {
            setCaseDropdownData(cases);
        }
    }, [caseSearchQuery, cases]);


    useEffect(() => {
        if (clientSearchQuery !== "") {
            const filteredClients = clients?.filter(client => client?.client_name?.toLowerCase()?.includes(clientSearchQuery?.toLowerCase()));
            setFilteredClients(filteredClients);
        } else {
            setFilteredClients(clients);
        }
    }, [clientSearchQuery, clients]);

    const formik = useFormik({
        initialValues: {
            case_id: "",
            client_id: ""
        },
        validationSchema: Yup.object({
            case_id: Yup.string().nullable(),
            client_id: Yup.string().nullable(),
        }),
        onSubmit: async (values) => {
            const result = await dispatch(getClientLedger({ case_id: values.case_id, client_id: values.client_id }));
            if (result?.payload?.success) {
                formik.resetForm();
                setIsTableOpen(true);
            }
        }
    })
    useEffect(() => {
        setFilteredData(ledgers);
    }, [ledgers]);
    const { sortedData, sortConfig, handleSort } = useSortableData(filteredData || []);
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

    const perPageOptions1 = perPageOptions?.length > 0 ? perPageOptions : [10];


    const paginatedData = useMemo(() => {
        const start = (currentPage - 1) * perPage;
        return sortedData?.slice(start, start + perPage);
    }, [sortedData, currentPage, perPage]);

    const totalPages = Math.ceil(sortedData?.length / perPage);

    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);

    const handleDateSearch = (dateRange) => {
        const [start, end] = dateRange.map((date) => {
            const normalizedDate = new Date(date);
            normalizedDate?.setHours(0, 0, 0, 0);
            return normalizedDate;
        });
        setStartDate(start);
        setEndDate(end);
    };

    useEffect(() => {
        if (startDate && endDate) {
            const filtered = ledgers?.filter((item) => {
                const itemDate = new Date(item?.date);
                itemDate.setHours(0, 0, 0, 0);
                return itemDate >= startDate && itemDate <= endDate;
            });
            setFilteredData(filtered);
        }
    }, [startDate, endDate, ledgers]);


    const handleApply = useCallback(
        (range) => {
            if (range?.length === 2) {
                const formattedDates = range?.map((date) => format(date, "yyyy-MM-dd"));
                handleDateSearch(formattedDates);
            }
        },
        [handleDateSearch]
    );

    const handleDateCancel = () => {
        setFilteredData(ledgers);
    };


    useEffect(() => {
        setCurrentPage(1);
    }, [filteredData]);

    const csvRequiredKeys = ['date', 'payee_name', 'transaction_method', 'cheque_number', 'purpose', 'deposit_amount', 'disbursement_amount', 'case_ledger_balance', 'client_name', 'notes', 'reconcile_to_journal'];

    const pdfData = selectedLiens?.length > 0 ? selectedLiens : ledgers;
    const csvData = pdfData?.map((row) => {
        const filtered = {};
        csvRequiredKeys.forEach((key) => {
            if (key === 'date') {
                const date = new Date(row[key]);
                const formattedDate = date?.toLocaleDateString('en-CA'); // 'YYYY-MM-DD'
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
            setSelectedLiens((prev) => prev.filter((item) => item?.id !== lien?.id));
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
        <div className={`dashboard-body-wrp ${isSidebarOpen ? "show active" : ""}`}>
            {
                isTableOpen ? (
                    <div className="dashboard-body dsbrd-tbl-body">
                        <div className='ds-bdy-head'>
                            <strong>Individual Client Ledger Entries</strong>
                        </div>
                        <div className="dsbrd-client-info-wrp" style={{
                            color: '#000'
                        }}>

                            <div className="dsbrd-client-info-left" >
                                <strong style={{ color: '#000' }}>Case Name  :  <span className="mtr-name">{caseData?.name || ""}</span></strong>
                                <p>Case Open on :  <span className="date">{caseData?.open_date ? (new Date(caseData?.open_date).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })) : ""}</span></p>
                            </div>
                            <div className="dsbrd-client-info-right">
                                <strong style={{ color: '#000' }}>Current Month and Year : <span className="currmnth-yr">{new Date().toLocaleString('default', { month: 'long' })}  {new Date().getFullYear()}</span> </strong>
                                {selectedClient && (
                                    <strong style={{ color: '#000' }}>Client Name : <span className="client-name">{selectedClient || ""}</span></strong>
                                )}
                                <p>Case Close on :  <span className="close-date">{caseData?.close_date ? (new Date(caseData?.close_date).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })) : ""} </span></p>
                            </div>
                        </div>
                        <form>
                            <div className="ds-bdy-head mb-3">
                                <div className="ds-filter-wrp">
                                    <p>*REQUIRED BY STANDARD (1)(a) IN ACCORDANCE WITH SUBDIVISIONS (d)(3) and (e) OF RULE 1.15.</p>
                                    <div className="ds-filter-input-wrp">
                                        <DateRangePickerCustom handleApply={handleApply} handleCancel={handleDateCancel} />
                                    </div>
                                    <div className="dsfilter-rt-btns">
                                        <ReportDownloadDropdown name={'Download Report'} data={ledgers} csvData={csvData} csvRequiredKeys={csvRequiredKeys} reportName={'Individual Client Report'} />
                                    </div>
                                </div>
                            </div>
                            <div className="ds-bdy-content">
                                <div className="ds-bdy-table-wrp">
                                    <table>
                                        <thead>
                                            <tr>
                                                {[
                                                    { key: "serial_no", label: "S.No" },
                                                    { key: "date", label: "Date" },
                                                    { key: "payee_name", label: "Payor or Payee" },
                                                    { key: "transaction_method", label: "Transaction Method" },
                                                    { key: "cheque_number", label: "Check Number" },
                                                    { key: "purpose", label: "Purpose" },
                                                    { key: "deposit_amount", label: "Deposit Amount" },
                                                    { key: "disbursement_amount", label: "Disbursement Amount" },
                                                    { key: selectedClient ? "ledger_balance" : "case_ledger_balance", label: "Running Balance" },
                                                    { key: "notes", label: "Notes" },
                                                    { key: "reconcile_to_journal", label: "Reconciled?" },
                                                ].map(({ key, label }) => (
                                                    <th
                                                        key={key}
                                                        onClick={label !== "Reconciled?" ? () => handleSort(key) : undefined}
                                                        style={label !== "Reconciled?" ? { cursor: "pointer" } : {}}
                                                    >
                                                        {label} {label !== "Reconciled?" && getSortArrow(key)}
                                                    </th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {loading ?
                                                (
                                                    <tr>
                                                        <td colSpan="100%">Loading...</td>
                                                    </tr>
                                                ) :
                                                paginatedData?.length > 0 ? (
                                                    paginatedData?.map((transaction) => {

                                                        return (
                                                            <tr key={transaction?.id}>
                                                                <td>
                                                                    <input
                                                                        type="checkbox"
                                                                        style={{ marginRight: '8px' }}
                                                                        value={transaction?.id}
                                                                        onChange={(e) => handleCheckboxChange(e, transaction)}
                                                                    />
                                                                    {transaction?.serial_no}</td>
                                                                <td > {formatDateDisplay(transaction?.date)}</td>
                                                                <td style={{ whiteSpace: 'normal', wordBreak: 'break-word', maxWidth: '200px' }}> {transaction?.payee_name}</td>
                                                                <td style={{ whiteSpace: 'normal', wordBreak: 'break-word', maxWidth: '200px' }}> {transaction?.transaction_method?.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}</td>
                                                                <td style={{ whiteSpace: 'normal', wordBreak: 'break-word', maxWidth: '200px' }}> {transaction?.cheque_number}</td>
                                                                <td style={{ whiteSpace: 'normal', wordBreak: 'break-word', maxWidth: '200px' }}> {transaction?.purpose}</td>
                                                                <td> {formatCurrency(parseFloat(transaction?.deposit_amount).toFixed(2))}</td>
                                                                <td> {formatCurrency(parseFloat(transaction?.disbursement_amount).toFixed(2))}</td>
                                                                <td> {selectedClient ? formatCurrency(parseFloat(transaction?.ledger_balance).toFixed(2)) : formatCurrency(parseFloat(transaction?.case_ledger_balance).toFixed(2))}</td>
                                                                <td style={{ whiteSpace: 'normal', wordBreak: 'break-word', maxWidth: '200px' }}> {transaction?.notes}</td>
                                                                <td>
                                                                    <div className="status-icon-wrp">
                                                                        <div className="status-icon">
                                                                            <img
                                                                                src={!transaction?.reconcile_to_journal ? "images/times-icon-red.svg" : "images/check-green.png"}
                                                                                alt="Checked"
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        );
                                                    })) : (
                                                    <tr>
                                                        <td colSpan="100%">No transactions found</td>
                                                    </tr>
                                                )}
                                        </tbody>
                                    </table>
                                </div>
                                <div className="select-item-count">
                                    <select
                                        value={perPage}
                                        onChange={(e) => {
                                            setPerPage(Number(e.target.value));
                                            setCurrentPage(1);
                                        }}
                                    >
                                        {perPageOptions1?.map((option) => (
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
                                    totalItems={ledgers?.length}
                                    onPageChange={(page) => {
                                        if (page >= 1 && page <= totalPages) {
                                            setCurrentPage(page);
                                        }
                                    }}
                                />
                            </div>
                        </form>

                    </div>
                ) : (
                    <form onSubmit={formik.handleSubmit}>
                        <div className="dashboard-body"
                        >
                            <div className="ds-bdy-head max">
                                <h1>Individual Client Ledger</h1>
                                <strong>Search and Access Detailed Accounting Records for Your Clients</strong>
                            </div>
                            <div className="dsbdy-content max">
                                <h2 className="dsbdy-content-title" >Select Case</h2>
                                <div className="search-ledger-wrp" >
                                    <div className="search-ledger-head" onClick={() => {
                                        setSearchCaseOpen(!searchCaseOpen);
                                        setSearchClientOpen(false);
                                    }} style={{ cursor: "pointer" }}>
                                        <input type="text" readOnly placeholder={`${selectedCase || 'Select Case'}`} id="search-client" style={{ cursor: "pointer" }} />
                                    </div>
                                    {searchCaseOpen && (
                                        <div className={`search-ledger-body ${searchCaseOpen ? "slide-in" : "slide-out"}`}>
                                            <div className="search-ledger input-grp search">
                                                <label htmlFor="caseSearch" className="visually-hidden">Search case</label>
                                                <input
                                                    type="text"
                                                    id="caseSearch"
                                                    name="search"
                                                    placeholder="Search by Case name"
                                                    autoComplete="off"
                                                    onChange={(e) => setCaseSearchQuery(e.target.value)}
                                                />
                                                <button type="submit" aria-label="Perform search">
                                                    <img src="images/search-icon.svg" alt="Search Icon" loading="lazy" />
                                                </button>
                                            </div>

                                            <div className="client-list" role="listbox" aria-label="Select a client">
                                                <ul>
                                                    {loading ? (
                                                        <li>Loading...</li>
                                                    ) : caseDropdownData?.length > 0 ? (
                                                        caseDropdownData?.map((c, index) => (
                                                            <li
                                                                key={c?.id || index}
                                                                role="option"
                                                                tabIndex={index === 0 ? "0" : "-1"}
                                                                aria-selected={formik?.values?.client_id === c?.id}
                                                                onClick={() => {
                                                                    formik.setFieldValue("case_id", c?.id);
                                                                    handleSelectCase(c);
                                                                    setSearchCaseOpen(false);
                                                                }}
                                                                data-id={c?.name}
                                                            >
                                                                {c?.name}
                                                            </li>
                                                        ))
                                                    ) : (
                                                        <li
                                                            role="option"
                                                            tabIndex="-1"
                                                            aria-selected="false"
                                                            className="no-result"
                                                        >
                                                            No case found
                                                        </li>
                                                    )}
                                                </ul>
                                            </div>
                                            <input
                                                type="hidden"
                                                name="case_name"
                                                value={formik?.values?.name}
                                                onChange={formik.handleChange}
                                            />

                                            {formik.touched?.case_name && formik.errors?.case_name && (
                                                <div className="text-danger">{formik.errors?.case_name}</div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="dsbdy-content max">
                                <h2 className="dsbdy-content-title">Select Client</h2>
                                <div className="search-ledger-wrp">
                                    <div
                                        className="search-ledger-head"
                                        onClick={() => {
                                            setSearchClientOpen(!searchClientOpen);
                                            // Close case dropdown if open
                                            setSearchCaseOpen(false);
                                        }}
                                        style={{ cursor: "pointer" }}
                                    >
                                        <input
                                            type="text"
                                            readOnly
                                            placeholder={`${selectedClient || 'Select Client'}`}
                                            id="search-client"
                                            style={{ cursor: "pointer" }}
                                        />
                                    </div>

                                    {searchClientOpen && (
                                        <div className="search-ledger-body slide-in">
                                            <div className="search-ledger input-grp search">
                                                <label htmlFor="clientSearch" className="visually-hidden">Search clients</label>
                                                <input
                                                    type="text"
                                                    id="clientSearch"
                                                    name="search"
                                                    placeholder="Search by Client name"
                                                    autoComplete="off"
                                                    onChange={(e) => setClientSearchQuery(e.target.value)}
                                                />
                                                <button type="button" aria-label="Perform search">
                                                    <img src="images/search-icon.svg" alt="Search Icon" loading="lazy" />
                                                </button>
                                            </div>

                                            <div className="client-list" role="listbox" aria-label="Select a client">
                                                <ul>
                                                    {loading ? (
                                                        <li>Loading...</li>
                                                    ) : filteredClients?.length > 0 ? (
                                                        filteredClients.map((client, index) => (
                                                            <li
                                                                key={client?.ledger_client_id || index}
                                                                role="option"
                                                                tabIndex={index === 0 ? "0" : "-1"}
                                                                aria-selected={formik?.values?.client_id === client?.ledger_client_id}
                                                                onClick={() => {
                                                                    formik.setFieldValue("client_id", client?.ledger_client_id);
                                                                    handleSelectClient(client);
                                                                }}
                                                                data-id={client?.client_name}
                                                                style={{ cursor: "pointer" }}
                                                            >
                                                                {client?.client_name}
                                                            </li>
                                                        ))
                                                    ) : (
                                                        <li
                                                            role="option"
                                                            tabIndex="-1"
                                                            aria-selected="false"
                                                            className="no-result"
                                                        >
                                                            No clients found
                                                        </li>
                                                    )}
                                                </ul>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="get-ledger">
                                <button type="submit" aria-label="Perform search" disabled={selectedClient === null && !selectedCase} style={{
                                    backgroundColor: selectedClient !== null || selectedCase ? '' : '#84c1fa',
                                    cursor: selectedClient !== null || selectedCase ? 'pointer' : 'not-allowed'
                                }}>
                                    <img src="images/ledger-icon.svg" alt="Search Icon" loading="lazy" />Get Ledger
                                </button>
                            </div>
                        </div>
                    </form>
                )
            }
        </div >
    )
}

export default IndividualClientLedger