import { useEffect, useMemo, useState } from 'react';
import { Dropdown } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import AddClientModal from '../../../components/popup/AddClientModal';
import PaginationControls from '../../../components/user/PaginationControls';
import ReportDownloadDropdown from '../../../components/user/ReportDownloadDropdown';
import { useAuth } from '../../../contexts/AuthContext';
import useSortableData from '../../../hooks/useSortableData';
import { getAllClients } from '../../../redux/slices/clientSlice';
import { checkUserPermission } from '../../../redux/slices/userSlice';

const AllClients = () => {


    const { isSidebarOpen } = useAuth()
    const [isAddMatterModalOpen, setIsAddMatterModalOpen] = useState()
    const [isAddClientModalOpen, setIsAddClientModalOpen] = useState()
    const dispatch = useDispatch();

    const { data } = useSelector((state) => state.client);
    const uniqueClients = [...new Set(data?.map(item => item.client_name))];
    const [searchTerm, setSearchTerm] = useState("");
    const [perPage, setPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedCase, setSelectedCase] = useState("");
    const [selectedClient, setSelectedClient] = useState();
    const [clients, setClients] = useState(data || []);
    const [filteredData, setFilteredData] = useState(data || []);
    const [selectedLiens, setSelectedLiens] = useState([]);

    const [readPermission, setReadPermission] = useState(0)
    const [addPermission, setAddPermission] = useState(0)
    const [editPermission, setEditPermission] = useState(0)
    const [deletePermission, setDeletePermission] = useState(0);
    // const { permissionMenu } = useSelector((state) => state?.user)
    // localStorage.setItem("menuPermissions", JSON.stringify(permissionMenu));

    // console.log("readPermission", readPermission, "addPermission", addPermission, "editPermission", editPermission, "deletePermission", deletePermission)

    useEffect(() => {
        const permissionsList = JSON.parse(localStorage.getItem('menuPermissions') || '[]');
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
    }, []);





    useEffect(() => {
        dispatch(getAllClients());
        dispatch(checkUserPermission())
    }, [dispatch]);

    useEffect(() => {
        if (data?.length > 0) {
            setClients(data);
        }
    }, [data]);

    const [caseStatus, setCaseStatus] = useState("all");
    const [filterLedgerBal, setFilterLedgerBal] = useState('all')

    useEffect(() => {
        let filtered = [...clients];

        if (selectedClient) {
            filtered = filtered.filter(item =>
                item?.client_name?.toLowerCase().includes(selectedClient?.toLowerCase())
            );
        }

        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            filtered = filtered.filter(item =>
                item?.client_name?.toLowerCase().includes(term)
            );
        }

        if (caseStatus === 'open') {
            filtered = filtered.filter(item => item.case_open !== null && item.case_close === null);

        } else if (caseStatus === 'close') {
            filtered = filtered.filter(item => item.case_close !== null);

        }
        if (filterLedgerBal === '0') {
            // No ledger_balance available
            filtered = filtered.filter(item =>
                item.ledger_balance === null ||
                item.ledger_balance === undefined ||
                item.ledger_balance === '' ||
                item.ledger_balance === 0
            );
        } else if (filterLedgerBal === '1') {
            // ledger_balance is available
            filtered = filtered.filter(item =>
                item.ledger_balance !== null &&
                item.ledger_balance !== undefined &&
                item.ledger_balance !== '' &&
                item.ledger_balance !== 0
            );
        }
        setFilteredData(filtered);
        setCurrentPage(1);
    }, [clients, searchTerm, selectedClient, caseStatus, filterLedgerBal]);

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

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1);
    };
    const handleCaseChange = (value) => {
        // console.log("object", value)
        setCaseStatus(value);
    };


    // console.log(paginatedData)
    const csvRequiredKeys = ['client_name', 'fee_type', 'ledger_balance', 'case_summary', 'created_at'];


    const pdfData = selectedLiens.length > 0 ? selectedLiens : data;
    const csvData = pdfData?.length > 0 && pdfData?.map((row) => {
        const filtered = {};
        csvRequiredKeys?.forEach((key) => {
            if (key === 'created_at') {
                const date = new Date(row[key]);
                const formattedDate = date.toLocaleDateString('en-CA'); // 'YYYY-MM-DD'
                filtered[key] = formattedDate;
            } else {
                filtered[key] = row[key];
            }
        });
        return filtered;
    });



    const csvDataMaster = data?.length > 0 && data?.map((row) => {
        const filtered = {};
        csvRequiredKeys?.forEach((key) => {
            if (key === 'created_at') {
                const date = new Date(row[key]);
                const formattedDate = date.toLocaleDateString('en-CA'); // 'YYYY-MM-DD'
                filtered[key] = formattedDate;
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
            <div className={`dashboard-body-wrp ${isSidebarOpen ? 'active' : ''}`}>
                <div className="search-bar-wrp" style={{ width: '100%' }}>

                    <div className="search-bar">
                        <form>
                            <div className="input-grp search">
                                <input
                                    type="text"
                                    name="search"
                                    placeholder="Search by client name"
                                    value={searchTerm}
                                    onChange={handleSearchChange}
                                />
                                <button type="submit" aria-label="Perform search">
                                    <img src="images/search-icon.svg" alt="Search Icon" loading="lazy" />
                                </button>
                            </div>
                        </form>

                        <div className="dsbdy-frm-btn-grp mt-0 dbllrg-btn">
                        </div>
                    </div>
                </div>

                <div className="dashboard-body dsbrd-tbl-body">
                    <form>
                        <div className="ds-bdy-head mb-3">
                            <div className="ds-filter-wrp">
                                <div className="dsfilter-rt-btns ds-filter-upr-wrp-new">
                                    <div className="dsfilter-wrp-text">
                                        <h3>Clients summary</h3>
                                        <p>Total Clients : {data?.length}</p>
                                    </div>
                                    <div className="dsfilter-inr-btn-wrp dbllrg-btn">
                                        <Dropdown style={{ display: 'inline-block', marginLeft: '10px' }}>
                                            <Dropdown.Toggle
                                                variant=""
                                                id="dropdown-basic"
                                                className="no-caret"
                                                style={{
                                                    border: "none",
                                                    boxShadow: "none",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",   // ✅ this will center text
                                                    gap: "6px",
                                                    color: "#fff",
                                                    padding: "8px 16px",
                                                    height: "52px",
                                                    backgroundColor: "#3182CE",
                                                    minWidth: "160px",
                                                    textAlign: "center",        // ✅ extra safeguard for centering
                                                }}
                                            >
                                                {filterLedgerBal === '0'
                                                    ? "No Balance"
                                                    : filterLedgerBal === '1'
                                                        ? "Balance"
                                                        : filterLedgerBal === 'all'
                                                            ? "Ledger Balance"
                                                            : ""}
                                            </Dropdown.Toggle>
                                            <Dropdown.Menu
                                                style={{
                                                    backgroundColor: '#fff',
                                                    borderRadius: '8px',
                                                    padding: '8px 0',
                                                    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.5)',
                                                    minWidth: '180px'
                                                }}
                                            >
                                                <Dropdown.Item
                                                    style={{
                                                        padding: '10px 16px',
                                                        fontSize: '14px',
                                                        color: '#0B0C2A',
                                                        cursor: 'pointer',
                                                        transition: 'background-color 0.2s ease'
                                                    }}
                                                    onMouseEnter={(e) => e.target.style.backgroundColor = '#969595'}
                                                    onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                                                    onClick={() => { setCurrentPage(1); setFilterLedgerBal('all') }}
                                                >
                                                    All
                                                </Dropdown.Item>
                                                <Dropdown.Item

                                                    style={{
                                                        padding: '10px 16px',
                                                        fontSize: '14px',
                                                        color: '#0B0C2A',
                                                        cursor: 'pointer',
                                                        transition: 'background-color 0.2s ease'
                                                    }}
                                                    onMouseEnter={(e) => e.target.style.backgroundColor = '#969595'}
                                                    onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                                                    onClick={() => { setCurrentPage(1); setFilterLedgerBal('1') }}
                                                >
                                                    Balance
                                                </Dropdown.Item>
                                                <Dropdown.Item

                                                    style={{
                                                        padding: '10px 16px',
                                                        fontSize: '14px',
                                                        color: '#0B0C2A',
                                                        cursor: 'pointer',
                                                        transition: 'background-color 0.2s ease'
                                                    }}
                                                    onMouseEnter={(e) => e.target.style.backgroundColor = '#969595'}
                                                    onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                                                    onClick={() => { setCurrentPage(1); setFilterLedgerBal('0') }}
                                                >
                                                    No Balance
                                                </Dropdown.Item>
                                            </Dropdown.Menu>
                                        </Dropdown>
                                        <ReportDownloadDropdown name={'Download Report'} reportName={'All Clients Report'} data={paginatedData} csvData={csvData} csvRequiredKeys={csvRequiredKeys} />
                                        {/* <ReportDownloadDropdown name={'Master Download'} reportName={'All Clients Report'} data={data} csvData={csvDataMaster} csvRequiredKeys={csvRequiredKeys} /> */}
                                    </div>
                                </div>

                                <div className="dsfilter-deep">
                                    <div className="dsfilterdp-left ds-filter-input-wrp">
                                        <div className="input-grp">
                                            <select defaultValue={selectedCase} onChange={(e) => handleCaseChange(e.target.value)}>
                                                <option value="all">All Cases</option>
                                                <option value="open">Open</option>
                                                <option value="close">Close</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="ds-filter-input-wrp">
                                        <div className="input-grp">
                                            <select value={selectedClient} onChange={(e) => { setCurrentPage(1); setSelectedClient(e.target.value) }}>
                                                <option value="">All Clients</option>
                                                {uniqueClients.map((client, i) => (
                                                    <option key={i} value={client}>{client}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="ds-bdy-content">
                            <div className="ds-bdy-table-wrp">
                                <table>
                                    <thead>
                                        <tr >
                                            <th onClick={() => handleSort("serial_no")} style={{ cursor: "pointer" }}>S.No{getSortArrow('serial_no')}</th>
                                            <th onClick={() => handleSort("created_at")} style={{ cursor: "pointer" }}>Date {getSortArrow('created_at')}</th>
                                            <th onClick={() => handleSort("client_name")} style={{ cursor: "pointer" }}>Client Name  {getSortArrow('client_name')}</th>
                                            <th onClick={() => handleSort("fee_type")} style={{ cursor: "pointer" }}>Fee Type {getSortArrow('fee_type')}</th>
                                            <th>Case Summary</th>
                                            <th onClick={() => handleSort("ledger_balance")} style={{ cursor: "pointer" }}>Ledger Balance {getSortArrow('ledger_balance')}</th>
                                            <th>Ledger</th>
                                            <th>Flag</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {paginatedData?.length > 0 ? (
                                            paginatedData.map((item, index) => {
                                                return (
                                                    <tr key={index}>
                                                        <td>
                                                            <input
                                                                type="checkbox"
                                                                style={{ marginRight: '8px' }}
                                                                value={item?.id}
                                                                onChange={(e) => handleCheckboxChange(e, item)}
                                                            />
                                                            {item?.serial_no}</td>
                                                        <td>{item?.created_at ? (new Date(item?.created_at).toLocaleDateString('en-US', {
                                                            year: 'numeric',
                                                            month: 'long',
                                                            day: 'numeric'
                                                        })) : "-"}</td>
                                                        <td>{item?.client_name}</td>
                                                        <td>{item?.fee_type ? item?.fee_type : "-"}</td>
                                                        <td>{item?.case_summary ? item?.case_summary : "-"}</td>
                                                        <td>{`${item?.ledger_balance ? (item?.ledger_balance ? formatCurrency(parseFloat(item?.ledger_balance).toFixed(2)) : "") : "-"}`}</td>
                                                        <td>
                                                            <a href={item?.ledger_balance ? `/individual-ledger?client_id=${item?.id}` : "#"}>{item?.ledger_balance ? "View" : '-'}</a>
                                                        </td>
                                                        <td><img src={item?.lien_count > 0 ? '/images/flag-red.png' : '/images/flag-gray.png'} alt="Flag" className="w-5 h-5 mx-auto" /></td>
                                                        {/* <td><img src={`images/flag-red.png `} alt="Flag" className="w-5 h-5 mx-auto" /></td> */}
                                                    </tr>
                                                )
                                            })) : (
                                            <tr>
                                                <td colSpan="8">No Data Found</td>
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
                        <PaginationControls
                            currentPage={currentPage}
                            totalPages={totalPages}
                            pageSize={perPage}
                            totalItems={sortedData.length}
                            onPageChange={setCurrentPage}
                        />
                    </form>
                </div>


            </div>
            <AddClientModal
                onClose={() => setIsAddClientModalOpen(false)}
                isOpen={isAddClientModalOpen}
            />
        </>
    );
};

export default AllClients;
