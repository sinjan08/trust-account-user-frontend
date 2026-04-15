import { useMemo, useState } from "react";

const parseDate = (dateStr) => {
  if (!dateStr) return null;

  let date = new Date(dateStr);
  if (!isNaN(date.getTime())) return date;

  const ddmmyyyyMatch = dateStr.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (ddmmyyyyMatch) {
    const [_, day, month, year] = ddmmyyyyMatch;
    return new Date(year, month - 1, day);
  }

  const yyyymmddMatch = dateStr.match(/^(\d{4})[-\/](\d{2})[-\/](\d{2})$/);
  if (yyyymmddMatch) {
    const [_, year, month, day] = yyyymmddMatch;
    return new Date(year, month - 1, day);
  }
  return null;
};

const useSortableData = (data, initialConfig = { key: null, direction: "asc" }) => {
  const [sortConfig, setSortConfig] = useState(initialConfig);

  const sortedData = useMemo(() => {
    if (!sortConfig?.key) return data;

    const sorted = [...data].sort((a, b) => {
      let aValue = a[sortConfig?.key];
      let bValue = b[sortConfig?.key];

      if (sortConfig?.key === "date") {
        aValue = parseDate(aValue);
        bValue = parseDate(bValue);
      } else if (!isNaN(aValue) && !isNaN(bValue)) {
        aValue = parseFloat(aValue);
        bValue = parseFloat(bValue);
      } else {
        aValue = String(aValue).toLowerCase();
        bValue = String(bValue).toLowerCase();
      }

      if (aValue < bValue) return sortConfig?.direction === "asc" ? -1 : 1;
      if (aValue > bValue) return sortConfig?.direction === "asc" ? 1 : -1;
      return 0;
    });

    return sorted;
  }, [data, sortConfig]);
  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig?.key === key && sortConfig?.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  return { sortedData, sortConfig, handleSort };
};

export default useSortableData;
