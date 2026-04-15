import { useCallback, useEffect, useMemo, useState } from "react";
import useSortableData from "../../hooks/useSortableData";
import DateRangePickerCustom from "../popup/DateRangePickerCustom";
import AccountSummaryPopup from "../popup/AccountSummaryPopup";
import DetailTransactionsPopup from "../popup/DetailTransactionsPopup";
import PaginationControl from "./PaginationControl";
import ReportDownloadDropdown from "./ReportDownloadDropdown";
import { format } from "date-fns";

const DynamicTable = ({ data, loading }) => {
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [selectedBank, setSelectedBank] = useState('');
  const [selectedTransaction, setSelectedTransaction] = useState(null)
  const [transactionDetailsPopup, setTransactionDetailsPopup] = useState(false)
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredData, setFilteredData] = useState(data);
  const [perPage, setPerPage] = useState(10);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [selectedLiens, setSelectedLiens] = useState([]);
  const [sortOrder, setSortOrder] = useState('asc'); // or 'desc'
  const [sortKey, setSortKey] = useState(false); // or 'amount' or '

  const handleViewAccountDetails = (item, type) => {
    if (type == 'summary') {
      setSelectedAccount(item);
      setIsPopupOpen(true);
    }
    if (type == 'transactions') {
      setSelectedTransaction(item);
      setTransactionDetailsPopup(true);
    }
  };

  const uniqueBanks = [];
  data?.forEach((item) => {
    if (!uniqueBanks.includes(item.bank_name)) {
      uniqueBanks.push(item.bank_name);
    }
  });
  const { sortedData, sortConfig, handleSort } = useSortableData(filteredData);
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
  // --------------------------------------------------------------------------


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
    let filtered = [...data];
    if (sortKey) {
      filtered = filtered.sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);

        return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
      });
    }
    // Date filter
    if (startDate && endDate) {
      filtered = filtered.filter((item) => {
        const itemDate = new Date(item?.date);
        itemDate.setHours(0, 0, 0, 0);
        return itemDate >= startDate && itemDate <= endDate;
      });
    }

    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (item) =>
          item?.account_description?.toLowerCase()?.includes(term) ||
          item?.account_number?.toLowerCase()?.includes(term) ||
          item?.bank_name?.toLowerCase()?.includes(term) ||
          item?.user_name?.toLowerCase()?.includes(term)
      );
    }
    // Bank name filter
    if (selectedBank) {
      filtered = filtered.filter(
        (item) => item?.bank_name?.toLowerCase() === selectedBank.toLowerCase()
      );
    }
    setFilteredData(filtered);
  }, [data, startDate, endDate, searchTerm, selectedBank, sortOrder]);



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
    setCurrentPage(1);
  }, [filteredData]);


  const csvRequiredKeys = ['date', 'user_name', 'bank_name', 'account_number', 'statement_period', 'ending_balance', 'daily_balance'];

  const pdfData = selectedLiens.length > 0 ? selectedLiens : data;
  const csvData = pdfData?.map((row) => {
    const filtered = {};
    csvRequiredKeys.forEach((key) => {
      if (key === 'date') {
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
      <div className="search-bar-wrp">
        <div className="search-bar">
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
        </div>
      </div>
      <div className="dashboard-body dsbrd-tbl-body">
        <div className="ds-bdy-head mb-3">
          <div className="ds-filter-wrp">
            <div className="ds-filter-input-wrp">
              <DateRangePickerCustom handleApply={handleApply} handleCancel={handleDateCancel} />
              <div className="input-grp" style={{ width: "220px" }}>
                <select
                  value={selectedBank}
                  onChange={(e) => {
                    setSelectedBank(e.target.value);
                    setCurrentPage(1);
                  }}
                >
                  <option value="" defaultValue={'All Banks'}>All Banks</option>
                  {uniqueBanks.map((bank, index) => (
                    <option key={index} value={bank}>{bank}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="dsfilter-rt-btns" style={{ display: "flex" }}>
              <button type="button" className="cmn-btn" onClick={() => { setSortKey(true); setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc')) }} >Sort {sortOrder === 'asc' ? '↑' : '↓'}</button>
              <ReportDownloadDropdown name={'Download Report'} data={sortedData} csvData={csvData} csvRequiredKeys={csvRequiredKeys} reportName={'Bankstatement Report'} />
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
                  <th onClick={() => handleSort("user_name")} style={{ cursor: "pointer" }}>User Name {getSortArrow("user_name")}</th>
                  <th onClick={() => handleSort("bank_name")} style={{ cursor: "pointer" }}>Bank Name {getSortArrow("bank_name")}</th>
                  <th onClick={() => handleSort("account_number", "number")} style={{ cursor: "pointer" }}>
                    Account Number {getSortArrow("account_number")}
                  </th>
                  <th onClick={() => handleSort("statement_period", "date")} style={{ cursor: "pointer" }}>
                    Statement Period {getSortArrow("statement_period")}
                  </th>
                  <th onClick={() => handleSort("ending_balance", "number")} style={{ cursor: "pointer" }}>
                    Ending Balance {getSortArrow("ending_balance")}
                  </th>
                  <th>Account Detail</th>
                  <th>Transactions Detail</th>
                  <th onClick={() => handleSort("daily_balance", "number")} style={{ cursor: "pointer" }}>
                    Daily Balance {getSortArrow("daily_balance")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={11}>Loading...</td>
                  </tr>
                ) : paginatedData?.length === 0 ? (
                  <tr><td colSpan="100%"
                  // className="text-center"
                  >No records found.</td></tr>
                ) : (
                  paginatedData.map((item, index) => {
                    const [y, m, d] = item?.date?.split('-') || [];
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
                        <td>{`${m}/${d}/${y}`}</td>
                        <td>{item?.user_name}</td>
                        <td>{item?.bank_name}</td>
                        <td>
                          {item?.account_number
                            ? item.account_number.slice(0, -4).replace(/./g, 'X') + item.account_number.slice(-4)
                            : ''}
                          {/* {item?.account_number} */}
                        </td>
                        <td>{item?.statement_period?.replace("_", " to ")}</td>
                        <td>{formatCurrency(item?.ending_balance)}</td>
                        <td>
                          <button
                            className="view-button"
                            onClick={(e) => {
                              e.preventDefault();
                              handleViewAccountDetails(item, 'summary');
                            }}
                          >
                            View
                          </button>
                        </td>
                        <td>
                          <button
                            className="view-button"
                            onClick={(e) => {
                              e.preventDefault();
                              handleViewAccountDetails(item, 'transactions');
                            }}
                          >
                            View
                          </button>
                        </td>
                        <td>{formatCurrency(item?.daily_balance)}</td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Par Page Controls */}
          <div className="select-item-count mb-4">
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
            totalItems={data.length}
            onPageChange={(page) => {
              if (page >= 1 && page <= totalPages) {
                setCurrentPage(page);
              }
            }}
          />

        </div>
      </div>
      {/* Modal Component */}
      <AccountSummaryPopup
        isOpen={isPopupOpen}
        onClose={() => setIsPopupOpen(false)}
        accountSummary={selectedAccount}
      />
      <DetailTransactionsPopup
        isOpen={transactionDetailsPopup}
        onClose={() => setTransactionDetailsPopup(false)}
        accountSummary={selectedTransaction}
      />
    </>
  );
};

export default DynamicTable;
