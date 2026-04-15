import React, { useState } from 'react';
import { DateRangePicker } from 'rsuite';
import 'rsuite/dist/rsuite.min.css';
 
const CustomDateRangePicker = ({ onApply, onCancel }) => {
    const [value, setValue] = useState(null);
 
    const handleApply = (selectedValue) => {
        setValue(selectedValue);
        if (onApply && selectedValue) {
            onApply(selectedValue); 
        } else {
            
            onCancel && onCancel();
        }
    };
 
    return (
        <DateRangePicker
            value={value}
            onChange={handleApply}
            showHeader={false}
            placeholder="Date Range" placement="bottomEnd"
            onClean={() => { 
                setValue(null); 
                onCancel && onCancel(); 
            }}
        />
    );
};
 
export default CustomDateRangePicker;