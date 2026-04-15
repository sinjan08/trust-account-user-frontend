import { isValid } from 'date-fns';

export const normalizeDate = (date) => {
    if (!date) return null;
    let parsedDate;

    if (typeof date === 'string') {
        parsedDate = new Date(date);
    } else if (date instanceof Date) {
        parsedDate = date;
    } else {
        return null;
    }

    if (!isValid(parsedDate)) return null;

    // Normalize to start of day for accurate comparison
    parsedDate.setHours(0, 0, 0, 0);

    return parsedDate;
};


// In your filter function
export const filterByDateRange = (data, key, [start, end]) => {
    if (!start || !end) return data;
    const startDate = normalizeDate(start);
    const endDate = normalizeDate(end);

    if (!startDate || !endDate) return data;

    // console.log("Data",data)
    const filteredData = data.filter((item) => {
        const itemDate = normalizeDate(item?.[key]);
        if (!itemDate) return false;

        return itemDate >= startDate && itemDate <= endDate;
    });
    console.log("filteredData",filteredData)
    return filteredData;
};
