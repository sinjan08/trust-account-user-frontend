import { parse } from 'date-fns';
import { useEffect, useRef, useState } from "react";


const DateRangePickerCustom = ({ handleApply, handleCancel }) => {
  const inputRef = useRef(null);
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [step, setStep] = useState(0); // 0 = selecting fromDate, 1 = selecting toDate
  const [inputValue, setInputValue] = useState("");
  
  useEffect(() => {
    const $ = window.$;

    if ($ && $.fn && $.fn.datepicker && inputRef.current) {
      const $input = $(inputRef.current);

      $input.datepicker("destroy");

      $input.datepicker({
        dateFormat: "mm-dd-yy",
        defaultDate: null,
        numberOfMonths: 2,
        onSelect: function (dateText) {
          if (step === 0) {
            setFromDate(dateText);
            setToDate(null);
            setStep(1);

            setInputValue(dateText); 
            setTimeout(() => {
              $input.datepicker("show");
            }, 1);
          } else {
            if (!fromDate) {
              setFromDate(dateText);
              setStep(1);
              setToDate(null);
              setTimeout(() => $input.datepicker("show"), 1);
              return;
            }

            setToDate(dateText);
            setStep(0);

            const formattedRange = `${fromDate} to ${dateText}`;
            setInputValue(formattedRange);

            const from = parse(fromDate, 'MM-dd-yyyy', new Date());
            const to = parse(dateText, 'MM-dd-yyyy', new Date());

            if (handleApply) handleApply([from, to]);
          }
        },
        onClose: function () {
          if (step === 1 && !toDate) {
            
            setFromDate(null);
            setToDate(null);
            setStep(0);
            if (handleCancel) handleCancel();
          }
        }
      });
    }

    return () => {
      if (window.$ && inputRef.current) {
        $(inputRef.current).datepicker("destroy");
      }
    };
  }, [step, fromDate, handleApply, handleCancel]);


  return (
    <div className="ds-filter-input-wrp">
      <div className="input-grp datefield-wrp">
        <input
          type="text"
          id="txtDateRange"
          name="txtDateRange"
          className="inputField shortInputField dateRangeField"
          placeholder="Date range"
          ref={inputRef}
          readOnly
          value={inputValue}
          data-from-field="txtDateFrom" data-to-field="txtDateTo"
        />
        <input type="hidden" id="txtDateFrom" />
        <input type="hidden" id="txtDateTo" />
      </div>
    </div>
  );
};

export default DateRangePickerCustom;
