export const addToReport = (type, title, headers, data) => {
  const reportData = {
    type,
    title,
    timestamp: new Date().toISOString(),
    headers,
    data
  };
  const existing = JSON.parse(localStorage.getItem('adminReportData') || '[]');
  existing.push(reportData);
  localStorage.setItem('adminReportData', JSON.stringify(existing));
  alert(`${title} added to report!`);
};
