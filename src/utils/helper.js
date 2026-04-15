export const toSentenceCase = (str) => {
  return str
    .replace(/_/g, ' ')
    .replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
}

export const formatDateDisplay = (date) => {
  const formattedDate = new Date(date).toLocaleDateString('en-CA');
  const [y, m, d] = formattedDate.split('-');
  return `${m}/${d}/${y}`
};


export const addOrRemoveBodyClass = (isRemove = false) => {
  if (isRemove) {
    document.body.classList.remove("user-panel-body");
  } else {
    document.body.classList.add("user-panel-body");
  }
}