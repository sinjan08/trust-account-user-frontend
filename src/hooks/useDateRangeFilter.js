// hooks/useDateRangeFilter.js
import { useCallback } from "react";
import { filterByDateRange } from "../utils/dateRangeFilter";

export const useDateRangeFilter = ({ data, dateKey, onFilter }) => {
  const handleApply = useCallback(
    (range) => {
      console.log("data, dateKey, range",data, dateKey, range)
      if (range?.length === 2) {
        const filtered = filterByDateRange(data, dateKey, range);
        console.log("object",filtered)
        onFilter(filtered);
      }
    },
    [data, dateKey]
  );

  const handleCancel = useCallback(() => {
    onFilter(data);
  }, [data, onFilter]);

  return { handleApply, handleCancel };
};
