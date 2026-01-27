import Papa from 'papaparse';
import jsPDF from 'jspdf';
import { Order } from '../data/mockData';

export function exportToCSV(data: any[], filename: string) {
  const csv = Papa.unparse(data);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `${filename}.csv`;
  link.click();
}

export function exportOrdersToPDF(orders: Order[]) {
  const doc = new jsPDF();

  doc.setFontSize(18);
  doc.text('Orders Report', 14, 22);

  doc.setFontSize(11);
  doc.setTextColor(100);

  let y = 40;
  orders.forEach((order, index) => {
    if (y > 270) {
      doc.addPage();
      y = 20;
    }

    doc.text(`${order.id} - ${order.customer}`, 14, y);
    doc.text(`$${order.total.toFixed(2)}`, 150, y);
    y += 10;
  });

  doc.save('orders-report.pdf');
}
