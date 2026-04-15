import { use, useCallback, useEffect, useMemo, useState } from "react";
import { useAuth } from "../../../contexts/AuthContext";
import { useDateRangeFilter } from "../../../hooks/useDateRangeFilter";
import useSortableData from "../../../hooks/useSortableData";
import ReportDownloadDropdown from "../../../components/user/ReportDownloadDropdown";
import { useDispatch, useSelector } from "react-redux";
import { getAllClientName, getClientLedgerSummary } from "../../../redux/slices/clientLeaderSummarySlice";
import { useFormik } from 'formik';
import * as Yup from 'yup';
import PaginationControl from "../../../components/user/PaginationControl";
import { getAllBankFirm } from "../../../redux/slices/BankChargesLedgersSlice";
import { format } from "date-fns";
import DateRangePickerCustom from "../../../components/popup/DateRangePickerCustom";
import { checkUserPermission } from "../../../redux/slices/userSlice";

const ClientLeaderSummary = () => {
  const dispatch = useDispatch()
  // const allClientName = useSelector((state) => state.clientLeader1.clientName);

  const { isSidebarOpen } = useAuth();
  const [ledgerData, setLedgerData] = useState([])

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [selectedLiens, setSelectedLiens] = useState([]);
  const [readPermission, setReadPermission] = useState(0)
  const [addPermission, setAddPermission] = useState(0)
  const [editPermission, setEditPermission] = useState(0)
  const [deletePermission, setDeletePermission] = useState(0)
  // console.log("readPermission", readPermission, "addPermission", addPermission, "editPermission", editPermission, "deletePermission", deletePermission)
  // const { permissionMenu } = useSelector((state) => state?.user)
  // localStorage.setItem("menuPermissions", JSON.stringify(permissionMenu));
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
    if (startDate && endDate) {
      const filtered = ledgerData.filter((item) => {
        const itemDate = new Date(item?.date);
        itemDate.setHours(0, 0, 0, 0);
        return itemDate >= startDate && itemDate <= endDate;
      });
      console.log("Filtered result: ", filtered);
      setFilteredData(filtered);
    }
  }, [startDate, endDate, ledgerData]);


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
    setFilteredData(ledgerData);
  };

  useEffect(() => {
    const fetchData = async () => {
      await dispatch(getAllBankFirm())
      await dispatch(checkUserPermission())
    }
    fetchData()
  }, [dispatch]);

  const formatCurrency = (value) => {
    if (isNaN(value) || value === null) return "$0.00";

    const number = Number(value);
    const formatted = Math.abs(number).toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

    return number < 0 ? `-$${formatted}` : `$${formatted}`;
  };


  const totalBalance = useMemo(() => {
    const total = ledgerData.reduce((acc, curr) => {
      const balance = parseFloat(curr?.ledger_balance);
      return acc + (isNaN(balance) ? 0 : balance);
    }, 0);

    return formatCurrency(total);
  }, [ledgerData]);




  const [filteredData, setFilteredData] = useState([])
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [openDaitles, setOpenDaitles] = useState(false);

  // const allClientName = useSelector((state) => state.bankChargesLedgers.allFirmName.data)
  const fullState = useSelector((state) => state.bankChargesLedgers.allFirmName.data);
  // setIsLoading(fullState)

  const handleSubmit = async (values) => {
    // console.log(values)
    // if (!values.client_name || !values.month || !values.year) {
    //   toast.error('Please fill in all fields')
    //   return;
    // }
    const result = await dispatch(getClientLedgerSummary(values))
    if (result.payload.success) {
      // console.log(result.payload.data)
      setLedgerData(result?.payload?.data)
      setFilteredData(result?.payload?.data);
      setOpenDaitles(true)
      // formik.resetForm();
    }
  };



  // 🔹 Apply Sort
  const { sortedData, sortConfig, handleSort } = useSortableData(filteredData);
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return sortedData.slice(start, start + rowsPerPage);
  }, [sortedData, currentPage, rowsPerPage]);


  const getSortArrow = (key) => sortConfig.key === key ? (sortConfig.direction === "asc" ? " ↑" : " ↓") : "";


  const totalRecords = ledgerData?.length ? ledgerData.length : 0;

  const totalPages = Math.ceil(sortedData?.length / rowsPerPage);
  // const perPageOptions = [...Array(Math.ceil(totalRecords / 10))].map((_, i) => (i + 1) * 10);
  // const perPageOptions1 = perPageOptions.length > 0 ? perPageOptions : [10];



  const perPageOptions = [...Array(Math.ceil(totalRecords / 10))]
    .map((_, i) => (i + 1) * 10)
    .filter((val) => val <= 40);
  const perPageOptions1 = perPageOptions.length > 0 ? perPageOptions : [10];



  const validationSchema = Yup.object({
    client_name: Yup.string().required('Client name is required'),
    month: Yup.number().required('Month is required').typeError('Month is required'),
    year: Yup.number().required('Year is required').typeError('Year is required'),
  });


  const formik = useFormik({
    initialValues: {
      client_name: '',
      month: '',
      year: '',
      case_status: '',
    },
    validationSchema,
    onSubmit: handleSubmit
  });


  // Generate years (current year - 10 to current year + 5)
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 11 }, (_, i) => currentYear - 10 + i);


  // Generate month names
  const months = Array.from({ length: 12 }, (_, i) =>
    new Date(0, i).toLocaleString('default', { month: 'long' })
  );

  const csvRequiredKeys = ["client_name", 'ledger_balance'];

  // Format users and columns
  const pdfData = selectedLiens.length > 0 ? selectedLiens : ledgerData;
  const csvData = pdfData?.map((row) => {
    const filtered = {};
    csvRequiredKeys.forEach((key) => {
      filtered[key] = row[key];
    });
    return filtered;
  });
  const currentMonthYear = new Date().toLocaleString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  const handleCheckboxChange = (e, lien) => {
    if (e.target.checked) {
      setSelectedLiens((prev) => [...prev, lien]);
    } else {
      setSelectedLiens((prev) => prev.filter((item) => item.id !== lien.id));
    }
  };


  return (
    <>
      <div className={`dashboard-body-wrp ${isSidebarOpen ? "show active" : ""}`} >
        {openDaitles ? (
          <>
            <div className="dashboard-body dsbrd-tbl-body">
              <form>
                <div className="back-btn-summary-client">
                  <a
                    href="#"
                    className="back-btn"
                    onClick={() => { setOpenDaitles(false); formik.resetForm() }}
                  >
                    <img src="images/back-icon.svg" alt="Back icon" />
                  </a>
                </div>
                <div className="ds-bdy-head mb-3">
                  <div className="ds-filter-wrp">
                    <div className="dsfilter-rt-btns ds-filter-upr-wrp-new flex-wrap">
                      <div className="dsfilter-wrp-text">
                        <h3>Client Name : {formik.values.client_name}</h3>
                      </div>
                      <div className="dsfilter-wrp-text">
                        <h3>Current Month and Year : {currentMonthYear}</h3>
                      </div>
                    </div>
                    <div className="dsfilter-deep">
                      <div className="dsfilterdp-left ds-filter-input-wrp2">
                        <DateRangePickerCustom handleApply={handleApply} handleCancel={handleDateCancel} />
                      </div>
                      <div className="bank-charges-inr-btn-wrp">
                        <ReportDownloadDropdown name={'Download Report'} data={ledgerData} csvData={csvData} csvRequiredKeys={csvRequiredKeys} reportName={'Client ledger Report'} />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="ds-bdy-content">
                  <div className="ds-bdy-table-wrp">
                    <table className="leader-summry-table">
                      <thead>
                        <tr>
                          <th onClick={() => handleSort('serial_no')} style={{ cursor: "pointer" }}>S.No{getSortArrow('serial_no')}</th>
                          <th onClick={() => handleSort('client_name')} style={{ cursor: "pointer" }}>Payee or Payor {getSortArrow('client_name')}</th>
                          <th onClick={() => handleSort('ledger_balance')} style={{ cursor: "pointer" }}>Balance {getSortArrow('ledger_balance')}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {paginatedData?.length > 0 ? (
                          paginatedData?.map((client, index) => (
                            <tr key={index} >
                              <td>
                                <input
                                  type="checkbox"
                                  style={{ marginRight: '8px' }}
                                  value={client?.id}
                                  onChange={(e) => handleCheckboxChange(e, client)}
                                />

                                {client?.serial_no}</td>
                              <td>{client?.client_name}</td>
                              <td>{client?.ledger_balance > 0 ? formatCurrency(client?.ledger_balance?.toLocaleString()) : formatCurrency(client?.ledger_balance)}</td>
                            </tr>
                          ))) : (
                          <tr>
                            <td colSpan={3}>No data available</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                  <div className="total-amount-wrap">
                    <h4>Total</h4>
                    <h4>{totalBalance}</h4>
                  </div>
                </div>
              </form>
              <div style={{ marginTop: '60px', }}>
                <div className="select-item-count">
                  <select
                    value={rowsPerPage}
                    onChange={(e) => {
                      setRowsPerPage(Number(e.target.value));
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
                  pageSize={rowsPerPage}
                  totalItems={totalRecords}
                  onPageChange={(page) => {
                    if (page >= 1 && page <= totalPages) {
                      setCurrentPage(page);
                    }
                  }}
                />
              </div>
            </div>
          </>
        ) : (
          // <div style={{
          //   position: 'relative',
          //   overflow: !readPermission ? 'hidden' : '', // ✨ Add this
          //   height: !readPermission ? '74vh' : '',
          // }}>
          <div className="dashboard-body"
          //  style={{
          //   filter: !readPermission ? 'blur(4px)' : 'none',
          //   pointerEvents: !readPermission ? 'none' : 'auto',
          //   userSelect: !readPermission ? 'none' : 'auto',
          //   opacity: !readPermission ? 0.6 : 1,
          //   height: readPermission ? 'auto' : '100vh', // avoid forcing viewport height when no access
          //   // overflow: 'hidden' // ✨ to prevent scroll within this div
          // }}
          >
            <div className="ds-bdy-head max">
              <h1>Client Ledger Summary</h1>
            </div>
            <form onSubmit={formik.handleSubmit}>
              <div className="client-leader-form-in">
                <div className="col-lg-12">
                  <div className="row">
                    <div className="col-lg-6">
                      <label>
                        <h3>Client Name</h3>
                        <select
                          name="client_name"
                          value={formik.values.client_name}
                          onChange={formik.handleChange}
                        >
                          <option value="">Select client</option>
                          {fullState?.length > 0 && (
                            fullState.map((item, index) => (
                              <option key={index} value={item?.account_name}>
                                {item?.account_name}
                              </option>
                            )))}
                        </select>
                        {formik.touched.client_name && formik.errors.client_name && (
                          <div className="error">{formik.errors.client_name}</div>
                        )}
                      </label>
                    </div>

                    <div className="col-lg-3 col-md-6">
                      <label>
                        <h3>Month</h3>
                        <select
                          name="month"
                          value={formik.values.month}
                          onChange={formik.handleChange}
                        >
                          <option value="">Select Month</option>
                          {months.map((item, index) => (
                            <option key={index} value={index + 1}>
                              {item}
                            </option>
                          ))}
                        </select>
                        {formik.touched.month && formik.errors.month && (
                          <div className="error">{formik.errors.month}</div>
                        )}
                      </label>
                    </div>

                    <div className="col-lg-3 col-md-6">
                      <label>
                        <h3>Year</h3>
                        <select
                          name="year"
                          value={formik.values.year}
                          onChange={formik.handleChange}
                        >
                          <option value="">Select Year</option>
                          {years.map((item, index) => (
                            <option key={index} value={item}>
                              {item}
                            </option>
                          ))}
                        </select>
                        {formik.touched.year && formik.errors.year && (
                          <div className="error">{formik.errors.year}</div>
                        )}
                      </label>
                    </div>
                    <div className="col-lg-6">
                      <label>
                        <h3>Case Status</h3>
                        <select
                          name="case_status"
                          value={formik.values.case_status}
                          onChange={formik.handleChange}
                        >
                          <option value="">Select Case Status</option>
                          <option value="open">Open</option>
                          <option value="close">Close</option>
                        </select>
                      </label>
                    </div>
                  </div>
                </div>
                <div className="bank-charges-btns">
                  <a href="#" onClick={formik.handleSubmit}
                    style={{
                      cursor: formik.values.client_name && formik.values.month && formik.values.year ? "pointer" : "not-allowed",
                      backgroundColor: formik.values.client_name && formik.values.month && formik.values.year ? '' : '#7da7db',
                      pointerEvents: formik.values.client_name && formik.values.month && formik.values.year ? '' : 'none'
                    }}
                  >
                    Get result
                  </a>
                </div>
              </div>
            </form>
          </div>
          //   {!readPermission && (
          //     <div
          //       style={{
          //         position: 'absolute',
          //         top: '0',
          //         left: '0',
          //         height: '100%',
          //         width: '100%',
          //         background: 'rgba(255, 255, 255, 0.7)',
          //         display: 'flex',
          //         alignItems: 'center',
          //         justifyContent: 'center',
          //         fontSize: '1.8rem',
          //         fontWeight: 'bold',
          //         color: '#444',
          //         zIndex: 10,
          //         overflow: 'hidden'
          //       }}
          //     >
          //       You don't have permission to access this page
          //     </div>
          //   )}
          // </div >
        )}
      </div>
    </>
  );
};

export default ClientLeaderSummary;
