import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import useSortableData from '../../../hooks/useSortableData';
import ReportDownloadDropdown from '../../../components/user/ReportDownloadDropdown';
import AddNotesModal from '../../../components/popup/AddNotesModal';
import { useDispatch, useSelector } from 'react-redux';
import { fetchigAllLien } from '../../../redux/slices/lienSlice';
import { format } from 'date-fns';
import AddMatterModal from '../../../components/popup/AddMatterModal';
import DateRangePickerCustom from '../../../components/popup/DateRangePickerCustom';
import PaginationControl from '../../../components/user/PaginationControl';
import { formatDateDisplay } from '../../../utils/helper';
import { toast } from 'react-toastify';
import { checkUserPermission } from '../../../redux/slices/userSlice';
import { useLocation } from 'react-router-dom';



const LienManagement = () => {
    const { isSidebarOpen } = useAuth();
    const [searchTerm, setSearchTerm] = useState("");
    const [showAddNote, setShowAddNote] = useState(false);
    const dispatch = useDispatch()
    const location = useLocation()
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [liensId, setLiensId] = useState('')
    const [lienNotes, setLienNotes] = useState();
    const [isAddMatterModalOpen, setIsAddMatterModalOpen] = useState()
    const [selectedLiens, setSelectedLiens] = useState([]);
    const { data } = useSelector((state) => state?.lien?.lienData);
    const [filteredData, setFilteredData] = useState(data)

    const liens = data ? data : []
    const handleSearchChange = (e) => setSearchTerm(e.target.value);
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
        if (startDate && endDate) {
            const filtered = data?.filter((item) => {
                const itemDate = new Date(item?.date);
                itemDate.setHours(0, 0, 0, 0);
                return itemDate >= startDate && itemDate <= endDate;
            });
            console.log("Filtered result: ", filtered);
            setFilteredData(filtered);
        }
    }, [startDate, endDate, data]);


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
        setFilteredData(data);
    };


    useEffect(() => {
        dispatch(fetchigAllLien());
        dispatch(checkUserPermission())
    }, [dispatch])
    useEffect(() => {
        let result = data && [...data];

        if (searchTerm) {
            result = result?.filter(item =>
                item?.holder?.toLowerCase()?.includes(searchTerm?.toLowerCase())
            );
        }
        setFilteredData(result);
        setCurrentPage(1);
    }, [data, searchTerm]);



    const { sortedData, sortConfig, handleSort } = useSortableData(filteredData);
    const paginatedData = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        return sortedData?.slice(start, start + itemsPerPage);
    }, [sortedData, currentPage, itemsPerPage]);
    const getSortArrow = (key) =>
        sortConfig.key === key ? (sortConfig.direction === "asc" ? " ↑" : " ↓") : "";

    const totalRecords = liens?.length;
    const perPageOptions = [...Array(Math.ceil(totalRecords / 10))]
        .map((_, i) => (i + 1) * 10)
        .filter((val) => val <= 40);
    const perPageOptions1 = perPageOptions.length > 0 ? perPageOptions : [10];


    const totalPages = Math.ceil(sortedData?.length / itemsPerPage);

    const handleAddNoteId = (itemId, notes) => {
        console.log("notes", notes)
        setLiensId(itemId)
        setLienNotes(notes)
        setShowAddNote(true)
    }


    const handleModalOpen = () => {
        dispatch(checkUserPermission()).then((res) => {
            console.log(" result:", res.payload.data.permissions);
            const matched = res?.payload?.data?.permissions?.find((item) => item.url === location.pathname);
            // console.log("permissionsListlghdfiohofdhkfghk", permissionsList)
            if (!(matched?.has_add_permission === '1' || matched?.has_add_permission === 1)) {
                toast.error('You do not have permission to view this lien.');
                return;
            }
            setIsAddMatterModalOpen(true)
        }).catch((err) => {
            console.log(err)
        });
    }

    const csvRequiredKeys = ['client_name', 'matter', 'description', 'opened_on', 'case_date', 'amount', 'status', 'notes'];

    const pdfData = selectedLiens.length > 0 ? selectedLiens : data;
    const csvData = pdfData?.map((row) => {
        const filtered = {};
        csvRequiredKeys.forEach((key) => {
            if (key == 'case_date' || key == 'opened_on') {
                const date = new Date(row[key]);

                const formattedDate = formatDateDisplay(date);
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

            <div className={`dashboard-body-wrp show ${isSidebarOpen ? "active" : ""}`}>
                {/* <div style={{
                    position: 'relative',
                    overflow: !readPermission ? 'hidden' : '', // ✨ Add this
                    height: !readPermission ? '74vh' : '',
                }}>
                    <div  style={{
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
                                <input type="text" name="search" placeholder="Search by User name" value={searchTerm} onChange={handleSearchChange} />
                                <button type="submit" aria-label="Perform search">
                                    <img src="images/search-icon.svg" alt="Search Icon" loading="lazy" />
                                </button>
                            </div>
                        </form>
                        <div className="dsbdy-frm-btn-grp mt-0 dbllrg-btn">
                            <button className="cmn-btn-2 blue-bg" onClick={handleModalOpen}><img src="images/plus-icon.svg" alt="Icon" />Add Matter</button>
                        </div>
                    </div>
                </div>
                <div className="dashboard-body dsbrd-tbl-body">
                    <form>
                        <div className="ds-bdy-head mb-3">
                            <div className="ds-filter-wrp">
                                <div className="dsfilter-deep">
                                    <div className="dsfilterdp-left ds-filter-input-wrp2">
                                        <DateRangePickerCustom handleApply={handleApply} handleCancel={handleDateCancel} />
                                    </div>
                                    <div className="ds-filter-input-wrp ms-2">
                                        <div className="bank-charges-inr-btn-wrp d-flex justify-content-end rtat">
                                            <ReportDownloadDropdown name={'Export as csv'} data={liens} csvData={csvData} csvRequiredKeys={csvRequiredKeys} reportName={'Lien Report'} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="ds-bdy-content">
                            <div className="ds-bdy-table-wrp table-responsive">
                                <table className="leader-summry-table" style={{ minWidth: 'max-content' }}>
                                    <thead>
                                        <tr>
                                            <th onClick={() => handleSort("serial_no")} style={{ cursor: "pointer" }}>S.No {getSortArrow('serial_no')}</th>
                                            <th onClick={() => handleSort("client_name")} style={{ cursor: "pointer" }}>Client Name {getSortArrow('holder')}</th>
                                            <th onClick={() => handleSort("matter")} style={{ cursor: "pointer" }}>Matter {getSortArrow('holder')}</th>
                                            <th onClick={() => handleSort("description")} style={{ cursor: "pointer" }}>Description {getSortArrow('description')}</th>
                                            <th onClick={() => handleSort("opened_on")} style={{ cursor: "pointer" }}>Open Date {getSortArrow('opened_on')}</th>
                                            <th onClick={() => handleSort("case_date")} style={{ cursor: "pointer" }}>Case Date {getSortArrow('case_date')}</th>
                                            <th onClick={() => handleSort("amount")} style={{ cursor: "pointer" }}>Amount  {getSortArrow('amount')}</th>
                                            <th>Status</th>
                                            <th>Add Notes</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {paginatedData?.length > 0 ? (
                                            paginatedData?.map((lien, index) => (
                                                <tr key={index}>
                                                    <td>
                                                        <input
                                                            type="checkbox"
                                                            style={{ marginRight: '8px' }}
                                                            value={lien?.id}
                                                            onChange={(e) => handleCheckboxChange(e, lien)}
                                                        />
                                                        {lien?.serial_no}

                                                    </td>
                                                    <td style={{ whiteSpace: 'normal', wordBreak: 'break-word' }}><a href={lien?.client_name ? `/lien-transactions?lien_id=${lien?.id}&client_id=${lien?.ledger_client_id}` : "#"}>{lien?.client_name ? lien?.client_name : '-'}</a></td>
                                                    <td>{lien?.matter}</td>
                                                    <td style={{ whiteSpace: 'normal', wordBreak: 'break-word', maxWidth: '200px' }}>{lien?.description ? lien?.description : '-'}</td>
                                                    <td>{formatDateDisplay(lien?.opened_on)}</td>
                                                    <td>{formatDateDisplay(lien?.case_date)}</td>
                                                    <td>{formatCurrency(lien?.amount)}</td>
                                                    <td>{lien?.status}</td>


                                                    <td className="resolve-anchor" >
                                                        <a href="#" onClick={(e) => { e.stopPropagation(); handleAddNoteId(lien?.id, lien?.notes); }}>
                                                            {"Add"}
                                                        </a>
                                                    </td>
                                                </tr>
                                            ))) : (
                                            <tr>
                                                <td colSpan="11" style={{ textAlign: "center" }}>No Records Found</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div className="select-item-count">
                            <select
                                value={itemsPerPage}
                                onChange={(e) => {
                                    setItemsPerPage(Number(e.target.value));
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
                            pageSize={itemsPerPage}
                            totalItems={sortedData?.length}
                            onPageChange={(page) => {
                                if (page >= 1 && page <= totalPages) {
                                    setCurrentPage(page);
                                }
                            }}
                        />
                    </form>
                </div>
                {/* </div> */}

                {/* {!readPermission && (
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
            </div >
            <AddNotesModal
                show={showAddNote}
                handleClose={() => setShowAddNote(false)}
                lienNotes={lienNotes}
                setLienNotes={setLienNotes}
                liensId={liensId}
            />
            <AddMatterModal
                onClose={() => setIsAddMatterModalOpen(false)}
                isOpen={isAddMatterModalOpen}
            />
        </>
    );
};

export default LienManagement;
