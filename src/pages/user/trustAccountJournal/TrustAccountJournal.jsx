import { useFormik } from 'formik';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { BsPencil } from 'react-icons/bs';
import { useDispatch, useSelector } from 'react-redux';
import * as Yup from 'yup';
import EntryDetailForm from '../../../components/popup/EntryDetailForm';
import PaginationControl from '../../../components/user/PaginationControl';
import ReportDownloadDropdown from '../../../components/user/ReportDownloadDropdown';
import { useAuth } from '../../../contexts/AuthContext';
// import { useDateRangeFilter } from '../../../hooks/useDateRangeFilter';
import { format } from 'date-fns';
import { toast } from 'react-toastify';
import AddCaseForm from '../../../components/popup/AddCaseForm';
import DateRangePickerCustom from '../../../components/popup/DateRangePickerCustom';
import useSortableData from '../../../hooks/useSortableData';
import { getAllBanks, getJournalEntries } from '../../../redux/slices/journalSlice';
import { checkUserPermission } from '../../../redux/slices/userSlice';
import { formatDateDisplay } from '../../../utils/helper';


const TrustAccountJournal = () => {
    const { isSidebarOpen } = useAuth()
    const [isTableOpen, setTableOpen] = useState(false)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isAddCaseModalOpen, setIsAddCaseModalOpen] = useState(false)
    const [item, setItem] = useState({})
    const [isEdit, setIsEdit] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const { journals, client, banks, loading } = useSelector((state) => state.journal);
    const [filteredData, setFilteredData] = useState([]);
    const [perPage, setPerPage] = useState(10);
    const [bankDropdown, setBankDropdown] = useState([]);
    const [selectedLiens, setSelectedLiens] = useState([]);
    const [accountClose, setAccountClose] = useState(false)
    const dispatch = useDispatch();
    const [readPermission, setReadPermission] = useState(0)
    const [addPermission, setAddPermission] = useState(0)
    const [editPermission, setEditPermission] = useState(0)
    const [deletePermission, setDeletePermission] = useState(0)
    // const { permissionMenu } = useSelector((state) => state?.user)
    // localStorage.setItem("menuPermissions", JSON.stringify(permissionMenu));
    // console.log("readPermission", readPermission, "addPermission", addPermission, "editPermission", editPermission, "deletePermission", deletePermission)

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

    useEffect(() => {
        dispatch(getAllBanks())
        // dispatch(checkUserPermission())
    }, [dispatch]);

    useEffect(() => {
        if (banks && banks.length > 0)
            setBankDropdown(banks)
    }, [banks]);

    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);

    const handleDateSearch = (dateRange) => {
        const [start, end] = dateRange.map((date) => {
            const normalizedDate = new Date(date);
            normalizedDate.setHours(0, 0, 0, 0);
            return normalizedDate;
        });
        setStartDate(start);
        setEndDate(end);
    };
    const handleApply = useCallback(
        (range) => {
            if (range?.length === 2) {
                const formattedDates = range.map((date) => format(date, "yyyy-MM-dd")); // Format as yyyy-MM-dd
                // console.log("Range", formattedDates)
                handleDateSearch(formattedDates);
            }
        },
        [handleDateSearch]
    );

    const handleDateCancel = () => {
        setFilteredData(journals);
    };

    const formik = useFormik({
        initialValues: {
            bank_name: "",
            account_number: "",
            account_name: ""
        },
        validationSchema: Yup.object({
            bank_name: Yup.string().required("Bank Name is required"),
            account_number: Yup.string().required("Account Number is required"),
            account_name: Yup.string().required("Account Name is required")
        }),
        onSubmit: async (values) => {
            const result = await dispatch(getJournalEntries(values));

            if (result?.payload?.success) {
                formik.resetForm();
                setFilteredData(result?.payload?.data?.journals || []);
                setTableOpen(true);
            }
        }
    })

    useEffect(() => {
        let filtered = [...journals];
        if (startDate && endDate) {
            filtered = filtered.filter((item) => {
                const itemDate = new Date(item?.date);
                itemDate.setHours(0, 0, 0, 0);
                return itemDate >= startDate && itemDate <= endDate;
            });
        }

        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            filtered = filtered.filter((item) =>
                item?.payee_name?.toLowerCase()?.includes(term) ||
                item?.client_name?.toLowerCase()?.includes(term)
            );
        }

        setFilteredData(filtered);
    }, [searchTerm, startDate, endDate, journals]);

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
    const perPageOptions1 = perPageOptions.length > 0 ? perPageOptions : [10];


    const paginatedData = useMemo(() => {
        const start = (currentPage - 1) * perPage;
        return sortedData?.slice(start, start + perPage);
    }, [sortedData, currentPage, perPage]);

    const totalPages = Math.ceil(sortedData?.length / perPage);



    useEffect(() => {
        setCurrentPage(1);
    }, [filteredData]);

    const csvRequiredKeys = ['date', 'payee_name', 'transaction_method', 'cheque_number', 'purpose', 'deposit_amount', 'disbursement_amount', 'running_balance', 'client_name', 'notes', 'reconciled_to_ledger', 'reconciled_to_bank_statement'];

    // Format users and columns
    const pdfData = selectedLiens.length > 0 ? selectedLiens : journals;
    const csvData = pdfData?.map((row) => {
        const filtered = {};
        csvRequiredKeys.forEach((key) => {
            if (key == 'date') {
                const date = new Date(row[key]);
                const formattedDate = date.toLocaleDateString('en-CA'); // 'YYYY-MM-DD'
                filtered[key] = formattedDate;
            } else if (key == 'reconciled_to_ledger') {
                if (row[key] == 1) {
                    filtered[key] = 'Yes';
                } else {
                    filtered[key] = 'No';
                }
            } else if (key == 'reconciled_to_bank_statement') {
                if (row[key] == 1) {
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

    const handleUpdate = (item) => {
        dispatch(checkUserPermission()).then((res) => {
            const matched = res?.payload?.data?.permissions?.find((item) => item.url === location.pathname);
            if (!(matched?.has_add_permission === '1' || matched?.has_add_permission === 1)) {
                toast.error('You do not have permission to view this lien.');
                return;
            }
            setItem(item)
            setIsModalOpen(true);
        }).catch((err) => {
            console.log(err)
        });
    }

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
        // setCurrentPage(1); // reset to page 1 on search
    };

    const handleCheckboxChange = (e, lien) => {
        if (e.target.checked) {
            setSelectedLiens((prev) => [...prev, lien]);
        } else {
            setSelectedLiens((prev) => prev.filter((item) => item.id !== lien.id));
        }
    };


    const handleOpenAddNewEntry = (client) => {
        if (client?.account_close_date) {
            setIsModalOpen(false);
            setIsEdit(true);
        } else if (!(client?.account_close_date)) {
            dispatch(checkUserPermission()).then((res) => {
                const matched = res?.payload?.data?.permissions?.find((item) => item.url === location.pathname);
                if (!(matched?.has_add_permission === '1' || matched?.has_add_permission === 1)) {
                    toast.error('You do not have permission to view this lien.');
                    return;
                }
                setIsModalOpen(true);
                setIsEdit(false);
            }).catch((err) => {
                console.log(err)
            });
        }
    }

    const handleOpenAddCaseEntry = () => {
        setIsAddCaseModalOpen(true);
    }

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
            <div className={`dashboard-body-wrp show ${isSidebarOpen ? 'active' : ''}`} style={isTableOpen ? { display: "none" } : {}}>

                <div className="dashboard-body">
                    <div className="ds-bdy-head">
                        <h1>Trust Account Journal</h1>
                        <strong>Search and Access Detailed Accounting Records for Your Clients</strong>
                    </div>
                    <div className="dsbdy-content">
                        <form onSubmit={formik.handleSubmit}>
                            <div className="account-journal-form row">
                                <div className="input-grp w-50">
                                    <label htmlFor="bankName">Bank Name</label>
                                    <select
                                        id="bankName"
                                        name="bank_name"
                                        value={formik.values.bank_name}
                                        {...formik.getFieldProps("bank_name")}
                                    >
                                        <option value="" disabled>
                                            Bank Name
                                        </option>
                                        {bankDropdown.map((bank, index) => (
                                            <option key={index} value={bank.bank_name}>
                                                {bank.bank_name}
                                            </option>
                                        ))}
                                    </select>
                                    {formik.touched.bank_name && formik.errors.bank_name && (
                                        <div className="error text-danger">{formik.errors.bank_name}</div>
                                    )}
                                </div>
                                <div className="input-grp w-50">
                                    <label htmlFor="AccountNumber">Account Number</label>
                                    <input
                                        type="text"
                                        id="AccountNumber"
                                        name="account_number"
                                        value={formik.values.account_number}
                                        placeholder="Enter Account Number"
                                        {...formik.getFieldProps("account_number")}
                                    />
                                    {formik.touched.account_number && formik.errors.account_number && (
                                        <div className="error text-danger">{formik.errors.account_number}</div>
                                    )}
                                </div>
                                <div className="input-grp w-50">
                                    <label htmlFor="AccountName">Account Name</label>
                                    <input
                                        type="text"
                                        id="AccountName"
                                        name="account_name"
                                        value={formik.values.account_name}
                                        placeholder="Enter Account Name"
                                        {...formik.getFieldProps("account_name")}
                                    />
                                    {formik.touched.account_name && formik.errors.account_name && (
                                        <div className="error text-danger">{formik.errors.account_name}</div>
                                    )}
                                </div>
                            </div>

                            <div className="dsbdy-frm-btn-grp" style={{
                                display: 'flex', justifyContent: 'center',


                            }}>
                                <button
                                    type="submit"
                                    className="viewuploaded blue-bg cmn-btn-2"
                                    disabled={!(formik.values.bank_name && formik.values.account_name && formik.values.account_number)}
                                    style={{
                                        backgroundColor: formik.values.bank_name && formik.values.account_number && formik.values.account_name ? '' : '#84c1fa',
                                        cursor: formik.values.bank_name && formik.values.account_number && formik.values.account_name ? 'pointer' : 'not-allowed'
                                    }}
                                >
                                    Get Journal
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <div className={`dashboard-body-wrp hide ${isSidebarOpen ? 'active' : ''}`} style={isTableOpen ? {} : { display: "none" }}>
                <div className="search-bar-wrp">
                    <div className="search-bar">
                        <form>
                            <div className="input-grp search">
                                <input type="text" name="search" placeholder="Search by client name" value={searchTerm} onChange={handleSearchChange} />
                                <button type="submit" aria-label="Perform search">
                                    <img src="images/search-icon.svg" alt="Search Icon" loading="lazy" />
                                </button>
                            </div>
                        </form>
                        <div className="dsbdy-frm-btn-grp mt-0">
                            <button className="cmn-btn-2 blue-bg" onClick={() => { handleOpenAddCaseEntry() }}>
                                Add Case
                            </button>
                            <button className="cmn-btn-2 blue-bg" onClick={() => { handleOpenAddNewEntry(client) }}>
                                Add Journal Entry
                            </button>
                        </div>
                    </div>
                </div>

                <div className="dashboard-body dsbrd-tbl-body">
                    <div className='ds-bdy-head'>
                        <strong>Trust Account Journal Entries</strong>
                    </div>
                    <div className="dsbrd-client-info-wrp align-items-start" style={{ color: "#000" }}>
                        <div className="dsbrd-client-info-left">
                            <strong style={{ color: '#000' }}>
                                Account Name : <span className="client-name">{client?.account_name}</span>
                            </strong>
                            <strong style={{ color: '#000' }}>
                                Firm Name : <span className="farm-name">{client?.firm_name} </span>
                            </strong>
                            <p>
                                Bank : <span className="bank-name">{client?.bank_name}</span>
                            </p>
                            <p>
                                Account Open Date : <span className="date">{client?.account_open_date ? formatDateDisplay(client?.account_open_date) : ''}</span>
                            </p>
                        </div>
                        <div className="dsbrd-client-info-right">
                            <strong style={{ color: '#000' }}>
                                Current Month and Year : <span className="currmnth-yr">{new Date().toLocaleString('default', { month: 'long' })}  {new Date().getFullYear()}</span>
                            </strong>
                            <strong style={{ color: '#000' }}>
                                Account : <span className="account-no">
                                    {client?.account_number
                                        ? client.account_number.slice(0, -4).replace(/./g, 'X') + client.account_number.slice(-4)
                                        : ''}
                                </span>
                            </strong >
                            <p>
                                Account Close Date : <span className="close-date">{client?.account_close_date ? formatDateDisplay(client?.account_close_date) : ''}</span>
                            </p>
                        </div>
                    </div>
                    <form>
                        <div className="ds-bdy-head mb-3">
                            <div className="ds-filter-wrp">
                                <p>
                                    *REQUIRED BY STANDARD (1)(b) IN ACCORDANCE WITH SUBDIVISIONS (d)(3)
                                    and (e) OF RULE 1.15.
                                </p>
                                <div className="ds-filter-input-wrp">
                                    <DateRangePickerCustom handleApply={handleApply} handleCancel={handleDateCancel} />
                                </div>
                                <div className="dsfilter-rt-btns">
                                    <ReportDownloadDropdown name={'Download Report'} data={journals} csvData={csvData} csvRequiredKeys={csvRequiredKeys} reportName={'Journals Report'} />
                                </div>
                            </div>
                        </div>
                        <div className="ds-bdy-content">
                            <div className="ds-bdy-table-wrp tbl-large">
                                <table>
                                    <thead>
                                        <tr>
                                            <th onClick={() => handleSort("serial_no")} style={{ cursor: "pointer" }}>S.No {getSortArrow('serial_no')}</th>
                                            <th onClick={() => handleSort("date")} style={{ cursor: "pointer" }}>Date {getSortArrow('date')}</th>
                                            <th onClick={() => handleSort("payee_name")} style={{ cursor: "pointer" }}>Payee or Payor {getSortArrow('payee_name')}</th>
                                            <th onClick={() => handleSort("transaction_method")} style={{ cursor: "pointer" }}>Method {getSortArrow('transaction_method')}</th>
                                            <th onClick={() => handleSort("cheque_number")} style={{ cursor: "pointer" }}>Check Number {getSortArrow('cheque_number')}</th>
                                            <th onClick={() => handleSort("purpose")} style={{ cursor: "pointer" }}>Purpose {getSortArrow('purpose')}</th>
                                            <th onClick={() => handleSort("deposit_amount")} style={{ cursor: "pointer" }}>Deposit {getSortArrow('deposit_amount')}</th>
                                            <th onClick={() => handleSort("disbursement_amount")} style={{ cursor: "pointer" }}>Disbursement {getSortArrow('disbursement_amount')}</th>
                                            <th onClick={() => handleSort("running_balance")} style={{ cursor: "pointer" }}>Balance {getSortArrow('running_balance')}</th>
                                            <th onClick={() => handleSort("client_name")} style={{ cursor: "pointer" }}>Client {getSortArrow('client_name')}</th>
                                            <th onClick={() => handleSort("case_name")} style={{ cursor: "pointer" }}>Case {getSortArrow('case_name')}</th>
                                            <th onClick={() => handleSort("notes")} style={{ cursor: "pointer" }}>Notes {getSortArrow('notes')}</th>
                                            <th>Reconciled to Ledgers</th>
                                            <th>Reconciled to Bank Statement?</th>
                                            <th>Update</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {loading
                                            ? (<tr><td colSpan="100%">Loading...</td></tr>)
                                            :
                                            paginatedData.length !== 0 ? (
                                                paginatedData?.map((item, index) => (
                                                    <tr key={index}>
                                                        <td>
                                                            <input
                                                                type="checkbox"
                                                                style={{ marginRight: '8px' }}
                                                                value={item?.id}
                                                                onChange={(e) => handleCheckboxChange(e, item)}
                                                            />
                                                            {item?.serial_no}</td>
                                                        <td style={{ whiteSpace: 'normal', wordBreak: 'break-word', maxWidth: '200px' }}>{formatDateDisplay(item?.date)}</td>
                                                        <td style={{ whiteSpace: 'normal', wordBreak: 'break-word' }}>{item?.payee_name}</td>
                                                        <td style={{ whiteSpace: 'normal', wordBreak: 'break-word' }}>{item?.transaction_method?.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}</td>
                                                        <td style={{ whiteSpace: 'normal', wordBreak: 'break-word' }}>{item?.cheque_number}</td>
                                                        <td style={{ whiteSpace: 'normal', wordBreak: 'break-word', maxWidth: '150px' }} >{item?.purpose}</td>
                                                        <td style={{ whiteSpace: 'normal', wordBreak: 'break-word' }}>{formatCurrency(item?.deposit_amount)}</td>
                                                        <td style={{ whiteSpace: 'normal', wordBreak: 'break-word' }}>{formatCurrency(item?.disbursement_amount)}</td>
                                                        <td style={{ whiteSpace: 'normal', wordBreak: 'break-word', maxWidth: '250px' }}>{formatCurrency(item?.running_balance)}</td>
                                                        {/* <td style={{ whiteSpace: 'normal', wordBreak: 'break-word' }}>{item?.client_name}</td> */}
                                                        <td style={{ whiteSpace: 'normal', wordBreak: 'break-word' }}><a href={item?.client_name ? `/individual-ledger?client_name=${item?.client_name}&client_id=${item?.ledger_client_id}&case_id=${item?.case_id}` : "#"}>{item?.client_name ? item?.client_name : '-'}</a></td>
                                                        <td style={{ whiteSpace: 'normal', wordBreak: 'break-word', maxWidth: '150px' }}>{item?.case_name}</td>
                                                        <td style={{ whiteSpace: 'normal', wordBreak: 'break-word', maxWidth: '150px' }}>{item?.notes}</td>
                                                        <td style={{ whiteSpace: 'normal', wordBreak: 'break-word' }} >
                                                            <div className="status-icon-wrp">
                                                                {
                                                                    item?.reconciled_to_ledger == "0" ?
                                                                        <img src="images/times-icon-red.svg" alt="cross" /> :
                                                                        <img src="images/check-green.png" alt="check" />
                                                                }
                                                            </div>
                                                        </td>
                                                        <td>
                                                            <div className="status-icon-wrp">
                                                                {
                                                                    item?.reconciled_to_bank_statement == "0" ?
                                                                        <img src="images/times-icon-red.svg" alt="cross" /> :
                                                                        <img src="images/check-green.png" alt="check" />
                                                                }
                                                            </div>
                                                        </td>
                                                        <td>
                                                            <button href="#" className="btn btn-sm" onClick={(e) => {
                                                                e.preventDefault()
                                                                handleUpdate(item);
                                                                // setIsModalOpen(true);
                                                                setIsEdit(true);
                                                            }}>
                                                                <BsPencil className="me-1" />
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))) : (
                                                <tr>
                                                    <td colSpan="14" style={{ alignItems: 'center' }}>No data found</td>
                                                </tr>
                                            )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        {/* Items Per Page Dropdown */}
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
                            totalItems={journals.length}
                            onPageChange={(page) => {
                                if (page >= 1 && page <= totalPages) {
                                    setCurrentPage(page);
                                }
                            }}
                        />
                    </form>
                </div>
            </div >
            <EntryDetailForm
                onClose={() => { setIsModalOpen(false), setItem(null) }}
                isOpen={isModalOpen}
                editData={item}
                isEdit={isEdit}
                client={client}
            />
            <AddCaseForm
                onClose={() => { setIsAddCaseModalOpen(false) }}
                isOpen={isAddCaseModalOpen}
            />
        </>
    )
}

export default TrustAccountJournal
