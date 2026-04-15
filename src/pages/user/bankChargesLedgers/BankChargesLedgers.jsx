import { useCallback, useEffect, useMemo, useState } from "react";
import { useAuth } from "../../../contexts/AuthContext";
import EntryDetailForm from "../../../components/popup/EntryDetailForm";
import useSortableData from "../../../hooks/useSortableData";
import PaginationControls from "../../../components/user/PaginationControls";
import ReportDownloadDropdown from "../../../components/user/ReportDownloadDropdown";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from 'yup';
import { getAllBankFirm, getAllBankLedgers } from "../../../redux/slices/BankChargesLedgersSlice";
import { useFormik } from "formik";
import { format } from "date-fns";
import DateRangePickerCustom from "../../../components/popup/DateRangePickerCustom";
import PaginationControl from "../../../components/user/PaginationControl";
import { formatDateDisplay } from "../../../utils/helper";
import { checkUserPermission } from "../../../redux/slices/userSlice";



const BankChargesLedgers = () => {
  const dispatch = useDispatch();
  const firm = useSelector((state) => state.bankChargesLedgers.allFirmName.data)
  const { isSidebarOpen } = useAuth();
  const [search, setSearch] = useState("");
  const [caseSelection, setCaseSelection] = useState("");
  const [monthYear, setMonthYear] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [bankLedgerData, setBankLedgerData] = useState([])
  const [firmInfo, setFirmInfo] = useState({})
  const [filteredData, setFilteredData] = useState(bankLedgerData);
  const [isTableOpen, setIsTableOpen] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedLiens, setSelectedLiens] = useState([]);

  const [readPermission, setReadPermission] = useState(0)
  const [addPermission, setAddPermission] = useState(0)
  const [editPermission, setEditPermission] = useState(0)
  const [deletePermission, setDeletePermission] = useState(0)
  //   const { permissionMenu } = useSelector((state) => state?.user)
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



  const currentMonthYear = new Date().toLocaleString('en-US', {
    month: 'long',
    year: 'numeric',
  });

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
  useEffect(() => {
    let result = [...bankLedgerData];

    // Date range filter
    if (startDate && endDate) {
      result = result.filter((item) => {
        const itemDate = new Date(item?.date);
        itemDate.setHours(0, 0, 0, 0);
        return itemDate >= startDate && itemDate <= endDate;
      });
    }

    if (search) {
      const searchLower = search.toLowerCase();
      result = result.filter(item =>
        item?.payee_name?.toLowerCase().includes(searchLower)
      );
    }

    if (caseSelection) {
      if (caseSelection === 'open') {
        result = result.filter(item => item.account_open_date !== null && item.account_close_date === null);
      } else if (caseSelection === 'close') {
        result = result.filter(item => item.account_close_date !== null);
      }
    }

    if (monthYear) {
      const targetMonthYear = new Date(monthYear).toISOString().slice(0, 7);
      result = result.filter((item) => {
        const date = new Date(item?.date);
        const itemMonthYear = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
        return itemMonthYear === targetMonthYear;
      });
    }

    setFilteredData(result);
    setCurrentPage(1);
  }, [bankLedgerData, startDate, endDate, search, caseSelection, monthYear]);



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
    setFilteredData(bankLedgerData);
  };

  useEffect(() => {
    dispatch(getAllBankFirm());
    dispatch(checkUserPermission())
  }, [dispatch])

  const { sortedData, sortConfig, handleSort } = useSortableData(filteredData);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return sortedData.slice(start, start + rowsPerPage);
  }, [sortedData, currentPage, rowsPerPage]);

  const getSortArrow = (key) =>
    sortConfig.key === key ? (sortConfig.direction === "asc" ? " ↑" : " ↓") : "";

  const totalRecords = bankLedgerData?.length ? bankLedgerData.length : 0;
  const totalPages = Math.ceil(sortedData?.length / rowsPerPage);
  // const perPageOptions = [...Array(Math.ceil(totalRecords / 10))].map((_, i) => (i + 1) * 10);
  // const perPageOptions1 = perPageOptions.length > 0 ? perPageOptions : [10];


  const perPageOptions = [...Array(Math.ceil(totalRecords / 10))]
    .map((_, i) => (i + 1) * 10)
    .filter((val) => val <= 40);
  const perPageOptions1 = perPageOptions.length > 0 ? perPageOptions : [10];


  const handleSearch = (pageNumber) => {
    setCurrentPage(pageNumber);
  };


  const validationSchema = Yup.object({
    client_id: Yup.number().required('Firm name is required'),
  })

  const handleSubmit = async (values) => {
    const result = await dispatch(getAllBankLedgers(values));
    if (result?.payload?.success) {
      // console.log(result?.payload?.data?.bankLedgers)
      setBankLedgerData(result?.payload?.data?.bankLedgers);
      setFirmInfo(result?.payload?.data?.firmData);
      setIsTableOpen(true);
    }
  }
  const formik = useFormik({
    initialValues: {
      client_id: '',
      purpose: '',
    },
    validationSchema,
    onSubmit: handleSubmit
  });

  const csvRequiredKeys = ['date', 'payee_name', 'cheque_number', 'purpose', 'deposit_amount', 'disbursement_amount', 'bank_ledger_balance', 'notes', 'reconciled_to_ledger'];

  const pdfData = selectedLiens.length > 0 ? selectedLiens : bankLedgerData;
  const csvData = pdfData?.length > 0 && pdfData?.map((row) => {
    const filtered = {};
    csvRequiredKeys?.forEach((key) => {
      if (key === 'date') {
        const date = new Date(row[key]);
        const formattedDate = date.toLocaleDateString('en-CA'); // 'YYYY-MM-DD'
        filtered[key] = formattedDate;
      }
      else if (key === 'reconciled_to_ledger') {
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
      <div className={`dashboard-body-wrp ${isSidebarOpen ? "show active" : ""}`}>
        {isTableOpen ? (
          <>
            <div className="search-bar-wrp">
              <div className="search-bar">
                <form onSubmit={handleSearch}>
                  <div className="input-grp search">
                    <input
                      type="text"
                      name="search"
                      placeholder="Search by client name"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                    <button type="submit" aria-label="Perform search">
                      <img
                        src="images/search-icon.svg"
                        alt="Search Icon"
                        loading="lazy"
                      />
                    </button>
                  </div>
                </form>
                <div className="dsbdy-frm-btn-grp mt-0">
                </div>
              </div>
            </div>
            <div className="dashboard-body dsbrd-tbl-body">
              <form>
                <div className="ds-bdy-head mb-3">
                  <div className="ds-filter-wrp">
                    <div className="dsfilter-rt-btns ds-filter-upr-wrp-new">
                      <div className="dsfilter-wrp-text">
                        <h3>Firm Name : {firmInfo?.firm_name}</h3>
                        <p>Purpose : {firmInfo?.purpose}</p>
                      </div>
                      <div className="dsfilter-wrp-text">
                        <h3>Current Month and Year : {currentMonthYear}</h3>
                        <p>Case open date : {firmInfo?.case_open_date}</p>
                        <p>Case close date :{firmInfo?.case_close_date}</p>
                      </div>
                    </div>
                    <span
                      className="required-text"
                      style={{
                        color: "black",
                      }}
                    >
                      *REQUIRED BY STANDARD (1)(b) IN ACCORDANCE WITH
                      SUBDIVISIONS (d)(3) and (e) OF RULE 1.15.
                    </span>
                    <div className="dsfilter-deep">
                      <div className="dsfilterdp-left ds-filter-input-wrp 2">
                        <DateRangePickerCustom handleApply={handleApply} handleCancel={handleDateCancel} />
                        <div className="input-grp">
                          <select
                            value={caseSelection}
                            onChange={(e) => setCaseSelection(e.target.value)}
                          >
                            <option value="">All Cases</option>
                            <option value="open">
                              Open
                            </option>
                            <option value="close">
                              Close
                            </option>
                          </select>
                        </div>
                        <div className="input-grp">
                          <select
                            value={monthYear}
                            onChange={(e) => setMonthYear(e.target.value)}
                          >
                            <option value="">All Months</option>
                            {[
                              ...new Set(
                                bankLedgerData
                                  .map((item) => {
                                    const date = new Date(item?.date);
                                    if (isNaN(date)) return null;
                                    const year = date.getFullYear();
                                    const month = String(date.getMonth() + 1).padStart(2, '0');
                                    return `${year}-${month}`;
                                  })
                                  .filter(Boolean)
                              ),
                            ]
                              .sort((a, b) => new Date(a + "-01") - new Date(b + "-01")) // optional: sort by date
                              .map((m) => {
                                const formatted = new Date(`${m}-01`).toLocaleDateString("en-US", {
                                  year: "numeric",
                                  month: "long",
                                });
                                return (
                                  <option key={m} value={m}>
                                    {formatted}
                                  </option>
                                );
                              })}
                          </select>
                        </div>
                      </div>
                      <div className="bank-charges-inr-btn-wrp">
                        <ReportDownloadDropdown name={'Download Report'} data={paginatedData} csvData={csvData} csvRequiredKeys={csvRequiredKeys} reportName={"Bank Charges Report"} />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="ds-bdy-content">
                  <div className="ds-bdy-table-wrp">
                    <table>
                      <thead>
                        <tr>
                          <th onClick={() => handleSort("serial_no")} style={{ cursor: "pointer" }}>S.No {getSortArrow("serial_no")}</th>
                          <th onClick={() => handleSort("date")} style={{ cursor: "pointer" }}>Date {getSortArrow("date")}</th>
                          <th onClick={() => handleSort("payee_name")} style={{ cursor: "pointer" }}>
                            Payor or Payee {getSortArrow("payee_name")}
                          </th>
                          <th onClick={() => handleSort("transaction_method")} style={{ cursor: "pointer" }}>Transaction Method {getSortArrow("transaction_method")} </th>
                          <th onClick={() => handleSort("cheque_number")} style={{ cursor: "pointer" }}>
                            Check Number {getSortArrow("cheque_number")}
                          </th>
                          <th onClick={() => handleSort("purpose")} style={{ cursor: "pointer" }}>Purpose {getSortArrow("purpose")}</th>
                          <th onClick={() => handleSort("deposit_amount")} style={{ cursor: "pointer" }}>
                            Deposit Amount {getSortArrow("deposit_amount")}
                          </th>
                          <th onClick={() => handleSort("disbursement_amount")} style={{ cursor: "pointer" }}>
                            Disbursement Amount {getSortArrow("disbursement_amount")}
                          </th>
                          <th onClick={() => handleSort("bank_ledger_balance")} style={{ cursor: "pointer" }}>
                            Running Balance {getSortArrow("bank_ledger_balance")}
                          </th>
                          <th>Notes</th>
                          <th>Reconciled</th>
                        </tr>
                      </thead>
                      <tbody>
                        {paginatedData?.length > 0 ? (
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
                              <td>{formatDateDisplay(item?.date)}</td>
                              <td>{item?.payee_name}</td>
                              <td>{item?.transaction_method?.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}</td>
                              <td>{item?.cheque_number}</td>
                              <td>{item?.purpose}</td>
                              <td>{formatCurrency(item?.deposit_amount)}</td>
                              <td>{formatCurrency(item?.disbursement_amount)}</td>
                              <td>{formatCurrency(item?.bank_ledger_balance)}</td>
                              <td>{item?.notes}</td>
                              <td>
                                {
                                  item?.reconciled_to_ledger === 1 ? (
                                    <div className="status-icon">
                                      <img
                                        src="images/check-green.png"
                                        alt="Checked"
                                      />
                                    </div>
                                  ) : (
                                    <div className="status-icon">
                                      <img
                                        src="images/times-icon-red.svg"
                                        alt="Not Checked"
                                      />
                                    </div>
                                  )
                                }
                                <div className="status-icon-wrp">
                                </div>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="11" >
                              No data available
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
                <div></div>
              </form>
              <div className="select-item-count">
                <select
                  value={rowsPerPage}
                  onChange={(e) => {
                    setRowsPerPage(Number(e.target.value));
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
              {/* <PaginationControl
                data={sortedData}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                pageSize={rowsPerPage}
                totalPages={totalPages}
              /> */}
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
          </>
        ) : (
          // <div style={{
          //   position: 'relative',
          //   overflow: !readPermission ? 'hidden' : '', // ✨ Add this
          //   height: !readPermission ? '74vh' : '',
          // }}>
          <div className="dashboard-body"
          // style={{
          //   filter: !readPermission ? 'blur(4px)' : 'none',
          //   pointerEvents: !readPermission ? 'none' : 'auto',
          //   userSelect: !readPermission ? 'none' : 'auto',
          //   opacity: !readPermission ? 0.6 : 1,
          //   height: readPermission ? 'auto' : '100vh', // avoid forcing viewport height when no access
          //   // overflow: 'hidden' // ✨ to prevent scroll within this div
          // }}

          >
            <div className="ds-bdy-head max">
              <h1>Bank Charges Ledgers</h1>
              <strong>
                Search and Access Detailed Accounting Records for Your Clients
              </strong>
            </div>

            <div className="bank-charges-form-in">

              <label>
                <h3>Firm Name</h3>
                <select name="client_id"
                  value={formik.values.client_id}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}>
                  <option value="">Select Firm</option>
                  {firm && firm.length > 0 &&
                    firm.map((firm, index) => (
                      <option key={index} value={firm.clientId}>
                        {firm.account_name}
                      </option>
                    ))
                  }

                </select>
                {formik.touched.client_id && formik.errors.client_id && (
                  <div className="error">{formik.errors.client_id}</div>
                )}
              </label>
              <label>
                <h3>Purpose</h3>
                <input
                  type="text"
                  name="purpose"
                  placeholder="Enter Purpose"
                  value={formik.values.purpose}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.purpose && formik.errors.purpose && (
                  <div className="error">{formik.errors.purpose}</div>
                )}
              </label>
              <div
                className="bank-charges-btns coursir-ponter" style={{ cursor: "pointer" }}
                onClick={formik.handleSubmit}
              >
                <a className="cmn-btn-2">
                  <img src="./images/get-ledger-icon.svg" alt="" />
                  Get Ledger
                </a>
              </div>

            </div>

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

      <div className="popup-wrp add-entry table-content pop-form">
        <div className="pop-overlay"></div>
        <div className="pop-up-inr-wrp">
          <div className="sign-popup">
            <div className="close-btn">
              <i className="fa-solid fa-times"></i>
            </div>
            <div className="sign-pop-head">
              <h2>Entry Detail</h2>
            </div>
            <div className="pop-bdy-content">
              <form>
                <div className="pop-form-inr-wrp">
                  <div className="input-grp datefield-wrp">
                    <label>Select date</label>
                    <input type="text" placeholder="Date range" className="date" />
                  </div>
                  <div className="input-grp">
                    <label>Enter Payor or Payee</label>
                    <input type="text" placeholder="lorem ipsum" />
                  </div>
                  <div className="input-grp">
                    <label>Select Transaction Method</label>
                    <select>
                      <option value="" >lorem ipsum</option>
                      <option value="check">Check</option>
                      <option value="electronic-transfer">Electronic Transfer</option>
                    </select>
                  </div>
                  <div className="input-grp">
                    <label>Enter Check Number</label>
                    <input type="text" placeholder="554455451545151" />
                  </div>
                  <div className="input-grp">
                    <label>Enter Purpose</label>
                    <input type="text" placeholder="lorem ipsum" />
                  </div>
                  <div className="input-grp">
                    <label>Select Transaction Type</label>
                    <select>
                      <option value="" >lorem ipsum</option>
                      <option value="">Deposit Amount</option>
                      <option value="">Disbursement Amount</option>
                    </select>
                  </div>
                  <div className="input-grp">
                    <label>Enter Amount</label>
                    <input type="text" placeholder="55433" />
                  </div>
                  <div className="input-grp">
                    <label>Enter Client Name</label>
                    <input type="text" placeholder="lorem ipsum" />
                  </div>
                  <div className="input-grp">
                    <label>Enter Notes ( Optional )</label>
                    <input type="text" placeholder="lorem ipsum" />
                  </div>
                </div>

                <div className="checks-wrp">
                  <div className="check-wrp">
                    <p>Reconciled to Ledger?</p>
                    <div className="radio-container">

                      <input type="radio" id="reconciled-yes" name="reconciled" value="yes" />
                      <label htmlFor="reconciled-yes">Yes</label>


                      <input type="radio" id="reconciled-no" name="reconciled" value="no" />
                      <label htmlFor="reconciled-no">No</label>
                    </div>
                  </div>

                  <div className="check-wrp">
                    <p>Reconciled to Bank Statement?</p>
                    <div className="radio-container">

                      <input type="radio" id="bank-statement-yes" name="bank-statement" value="yes" />
                      <label htmlFor="bank-statement-yes">Yes</label>


                      <input type="radio" id="bank-statement-no" name="bank-statement" value="no" />
                      <label htmlFor="bank-statement-no">No</label>
                    </div>
                  </div>
                </div>

                <div className="dsbdy-frm-btn-grp w-100 mt-0">
                  <button className="cmn-btn-2 blue-bg">Add Entry</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      <EntryDetailForm
        onClose={() => setIsPopupOpen(false)}
        isOpen={isPopupOpen}
      />
    </>
  );
};

export default BankChargesLedgers;
