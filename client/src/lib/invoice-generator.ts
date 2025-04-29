import { format } from 'date-fns';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

// Add type declaration for jsPDF autotable
declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

// Interface for order and order item
interface OrderItem {
  id: number;
  orderId: number;
  productId: number;
  quantity: number;
  price: number;
  productName: string;
  productImage?: string;
}

interface Order {
  id: number;
  userId: number;
  status: string;
  totalAmount: number;
  paymentMethod: string;
  createdAt: string;
  updatedAt: string;
  shippingAddress: string;
  city: string;
  state: string;
  pincode: string;
  phoneNumber: string;
  trackingId?: string;
  items: OrderItem[];
}

export const createPDF = async (order: Order): Promise<void> => {
  try {
    // Check if order data is valid
    if (!order || !order.id || !order.items || !Array.isArray(order.items)) {
      console.error('Invalid order data for PDF generation:', order);
      throw new Error('Invalid order data');
    }

    // Create a new PDF document
    const doc = new jsPDF();

    // Set fonts and colors
    const titleColor = [33, 33, 33]; // Dark gray for title
    const subtitleColor = [100, 100, 100]; // Medium gray for subtitle
    const accentColor = [0, 102, 204]; // Blue for accents
    
    // Format dates - handle potential date parsing errors
    let dateCreated, dateGenerated;
    try {
      dateCreated = format(new Date(order.createdAt), 'dd MMM yyyy');
      dateGenerated = format(new Date(), 'dd MMM yyyy');
    } catch (err) {
      console.error('Error formatting dates:', err);
      dateCreated = 'N/A';
      dateGenerated = format(new Date(), 'dd MMM yyyy');
    }
    
    // Company details
    doc.setFontSize(24);
    doc.setTextColor(titleColor[0], titleColor[1], titleColor[2]);
    doc.text('BLINKEACH', 14, 20);
    
    doc.setFontSize(10);
    doc.setTextColor(subtitleColor[0], subtitleColor[1], subtitleColor[2]);
    doc.text('India\'s favorite shopping destination', 14, 26);
    
    // Invoice title and details
    doc.setFontSize(18);
    doc.setTextColor(accentColor[0], accentColor[1], accentColor[2]);
    doc.text('INVOICE', 14, 40);
    
    doc.setFontSize(10);
    doc.setTextColor(titleColor[0], titleColor[1], titleColor[2]);
    doc.text(`Invoice #: BLK-${order.id}-${format(new Date(), 'yyyyMMdd')}`, 14, 48);
    doc.text(`Order #: ${order.id}`, 14, 54);
    doc.text(`Date Created: ${dateCreated}`, 14, 60);
    doc.text(`Date Generated: ${dateGenerated}`, 14, 66);
    doc.text(`Payment Method: ${order.paymentMethod === 'cod' ? 'Cash on Delivery' : order.paymentMethod}`, 14, 72);
    
    // Shipping details with null/undefined checks
    doc.setFontSize(12);
    doc.setTextColor(accentColor[0], accentColor[1], accentColor[2]);
    doc.text('Shipped To:', 120, 48);
    
    doc.setFontSize(10);
    doc.setTextColor(titleColor[0], titleColor[1], titleColor[2]);
    doc.text(order.shippingAddress || 'N/A', 120, 54);
    doc.text(`${order.city || 'N/A'}, ${order.state || 'N/A'} - ${order.pincode || 'N/A'}`, 120, 60);
    doc.text(`Phone: ${order.phoneNumber || 'N/A'}`, 120, 66);
    
    // Tracking ID if available
    if (order.trackingId) {
      doc.text(`Tracking ID: ${order.trackingId}`, 120, 72);
    }
    
    // Add status badge with default
    const status = order.status || 'pending';
    const statusColor = getStatusColor(status);
    doc.setFillColor(statusColor[0], statusColor[1], statusColor[2]);
    doc.rect(13, 80, 20, 8, 'F');
    doc.setFontSize(8);
    doc.setTextColor(255, 255, 255);
    doc.text(status.toUpperCase(), 15, 85);
    
    // Add horizontal line
    doc.setDrawColor(220, 220, 220);
    doc.line(14, 95, 196, 95);
    
    // Prepare table data
    const tableColumn = ["Item", "Qty", "Unit Price", "Total"];
    const tableRows: any[] = [];
    
    // Add items to table rows with error handling
    if (order.items && Array.isArray(order.items)) {
      order.items.forEach(item => {
        try {
          // Convert prices from paise to rupees (divide by 100)
          const itemPrice = (typeof item.price === 'number' ? item.price : 0) / 100;
          const itemQuantity = typeof item.quantity === 'number' ? item.quantity : 1;
          
          const itemRow = [
            item.productName || 'Unknown Product',
            itemQuantity,
            `₹${itemPrice.toFixed(2)}`,
            `₹${(itemPrice * itemQuantity).toFixed(2)}`
          ];
          tableRows.push(itemRow);
        } catch (err) {
          console.error('Error processing item for invoice:', err, item);
        }
      });
    }
    
    // Add item totals
    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 100,
      theme: 'striped',
      styles: { fontSize: 9 },
      headStyles: { 
        fillColor: [51, 51, 51],
        textColor: [255, 255, 255]
      },
      columns: [
        { header: 'Item', dataKey: 'item' },
        { header: 'Qty', dataKey: 'qty' },
        { header: 'Unit Price', dataKey: 'unit' },
        { header: 'Total', dataKey: 'total' }
      ],
      columnStyles: {
        0: { cellWidth: 'auto' },
        1: { cellWidth: 20, halign: 'right' },
        2: { cellWidth: 30, halign: 'right' },
        3: { cellWidth: 30, halign: 'right' }
      },
      margin: { left: 14, right: 14 }
    });
    
    // Get the Y position after the table
    const finalY = (doc as any).lastAutoTable?.finalY || 150;
    
    // Convert total amount (divide by 100 since it's stored in paise)
    const totalAmount = typeof order.totalAmount === 'number' ? order.totalAmount : 0;
    const convertedTotal = totalAmount / 100;
    
    // Add summary table
    doc.autoTable({
      body: [
        ['Subtotal', `₹${convertedTotal.toFixed(2)}`],
        ['Shipping', 'Free'],
        ['Total', `₹${convertedTotal.toFixed(2)}`]
      ],
      startY: finalY + 10,
      theme: 'plain',
      styles: { fontSize: 9 },
      columnStyles: {
        0: { cellWidth: 150, fontStyle: 'bold' },
        1: { cellWidth: 30, halign: 'right', fontStyle: 'bold' }
      },
      margin: { left: 14, right: 14 }
    });
    
    // Add footer
    const footerY = doc.internal.pageSize.height - 20;
    doc.setFontSize(8);
    doc.setTextColor(subtitleColor[0], subtitleColor[1], subtitleColor[2]);
    doc.text('Thank you for shopping with Blinkeach!', 14, footerY);
    doc.text('For any queries, please contact our customer support at support@blinkeach.com', 14, footerY + 5);
    
    // Save the PDF with a try-catch to ensure it doesn't fail silently
    try {
      doc.save(`Blinkeach_Invoice_Order_${order.id}.pdf`);
      console.log('Invoice generated successfully for order:', order.id);
    } catch (saveError) {
      console.error('Error saving PDF:', saveError);
      throw new Error('Failed to save PDF');
    }
  } catch (error) {
    console.error('Error generating invoice PDF:', error);
    throw error; // Re-throw to be handled by the caller
  }
};

// Helper function to get color based on status
function getStatusColor(status: string): number[] {
  switch(status.toLowerCase()) {
    case 'pending':
      return [255, 152, 0]; // Orange
    case 'processing':
      return [33, 150, 243]; // Blue
    case 'shipped':
      return [103, 58, 183]; // Purple
    case 'delivered':
      return [76, 175, 80]; // Green
    case 'cancelled':
      return [244, 67, 54]; // Red
    default:
      return [158, 158, 158]; // Gray
  }
}