import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { getCategoryById } from '../constants/categories';
import { getCurrencyByCode } from '../constants/currencies';
import { format } from 'date-fns';

export function exportToCSV(expenses, currencyCode = 'INR') {
  const currency = getCurrencyByCode(currencyCode);
  const headers = ['Date', 'Category', 'Amount (' + currency.code + ')', 'Source', 'Notes'];

  const rows = expenses.map(e => [
    e.date,
    getCategoryById(e.category).label,
    e.amount.toFixed(2),
    e.source,
    e.notes || '',
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  downloadBlob(blob, `expenses_${format(new Date(), 'yyyy-MM-dd')}.csv`);
}

export function exportToPDF(expenses, metrics, currencyCode = 'INR') {
  const currency = getCurrencyByCode(currencyCode);
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();

  // Title
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('Smart Expense Tracker', pageWidth / 2, 20, { align: 'center' });

  // Subtitle
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100);
  doc.text(`Report generated on ${format(new Date(), 'dd MMM yyyy, hh:mm a')}`, pageWidth / 2, 28, { align: 'center' });

  // Summary section
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0);
  doc.text('Summary', 14, 42);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  const summaryData = [
    ['Total Spending', `${currency.symbol}${metrics.total.toLocaleString(currency.locale, { maximumFractionDigits: 2 })}`],
    ['This Month', `${currency.symbol}${metrics.month.toLocaleString(currency.locale, { maximumFractionDigits: 2 })}`],
    ['This Week', `${currency.symbol}${metrics.week.toLocaleString(currency.locale, { maximumFractionDigits: 2 })}`],
    ['Daily Average', `${currency.symbol}${metrics.dailyAverage.toLocaleString(currency.locale, { maximumFractionDigits: 2 })}`],
    ['Yearly Projection', `${currency.symbol}${metrics.yearlyProjection.toLocaleString(currency.locale, { maximumFractionDigits: 2 })}`],
    ['Total Entries', String(expenses.length)],
  ];

  doc.autoTable({
    startY: 46,
    head: [['Metric', 'Value']],
    body: summaryData,
    theme: 'striped',
    headStyles: { fillColor: [56, 189, 248] },
    margin: { left: 14, right: 14 },
  });

  // Category breakdown
  if (metrics.categoryBreakdown.length > 0) {
    const catY = doc.lastAutoTable.finalY + 12;
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Category Breakdown', 14, catY);

    const catData = metrics.categoryBreakdown.map(c => [
      getCategoryById(c.category).label,
      `${currency.symbol}${c.amount.toLocaleString(currency.locale, { maximumFractionDigits: 2 })}`,
      `${((c.amount / metrics.total) * 100).toFixed(1)}%`,
    ]);

    doc.autoTable({
      startY: catY + 4,
      head: [['Category', 'Amount', '% of Total']],
      body: catData,
      theme: 'striped',
      headStyles: { fillColor: [129, 140, 248] },
      margin: { left: 14, right: 14 },
    });
  }

  // Expense list
  const expY = doc.lastAutoTable.finalY + 12;
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('All Expenses', 14, expY);

  const tableData = expenses.map(e => [
    e.date,
    getCategoryById(e.category).label,
    `${currency.symbol}${e.amount.toLocaleString(currency.locale, { maximumFractionDigits: 2 })}`,
    e.source,
    e.notes || '-',
  ]);

  doc.autoTable({
    startY: expY + 4,
    head: [['Date', 'Category', 'Amount', 'Source', 'Notes']],
    body: tableData,
    theme: 'striped',
    headStyles: { fillColor: [52, 211, 153] },
    margin: { left: 14, right: 14 },
    styles: { fontSize: 8 },
  });

  doc.save(`expenses_${format(new Date(), 'yyyy-MM-dd')}.pdf`);
}

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
