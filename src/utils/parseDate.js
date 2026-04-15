// Sample helper to parse DD/MM/YYYY into Date object
const parseDate = (dateStr) => {
    const [day, month, year] = dateStr.split("/");
    return new Date(year, month - 1, day);
}
