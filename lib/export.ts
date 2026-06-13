import { Venture, VentureEvent, FounderTask } from './useStore';

// CSV Export
export const exportVenturesAsCSV = (ventures: Venture[]) => {
  const headers = [
    'ID',
    'Name',
    'Industry',
    'Status',
    'Started Date',
    'Description',
    'Health Score',
    'Runway Months',
    'Collaborators',
  ];

  const rows = ventures.map((v) => [
    v.id,
    v.name,
    v.industry,
    v.status,
    v.startedDate,
    v.description,
    v.healthScore || '',
    v.runwayMonths || '',
    (v.collaborators || []).join('; '),
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map((row) =>
      row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(',')
    ),
  ].join('\n');

  downloadFile(csvContent, 'ventures.csv', 'text/csv');
};

export const exportEventsAsCSV = (events: VentureEvent[]) => {
  const headers = ['ID', 'Venture ID', 'Type', 'Title', 'Date', 'Mood', 'Impact', 'Lesson Learned'];

  const rows = events.map((e) => [
    e.id,
    e.ventureId,
    e.type,
    e.title,
    e.eventDate,
    e.mood || '',
    e.impact || '',
    e.lessonLearned || '',
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map((row) =>
      row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(',')
    ),
  ].join('\n');

  downloadFile(csvContent, 'events.csv', 'text/csv');
};

// JSON Export
export const exportAsJSON = (data: {
  ventures: Venture[];
  events: VentureEvent[];
  tasks: FounderTask[];
}) => {
  const jsonContent = JSON.stringify(data, null, 2);
  downloadFile(jsonContent, 'yourpreneur-backup.json', 'application/json');
};

// PDF Export (requires external library like jsPDF)
export const exportVenturesAsPDF = async (ventures: Venture[]) => {
  try {
    // This would require jsPDF library
    const { jsPDF } = await import('jspdf');
    const doc = new jsPDF();

    let yPosition = 10;
    const pageHeight = doc.internal.pageSize.height;
    const lineHeight = 7;

    doc.setFontSize(16);
    doc.text('Venture Portfolio Report', 10, yPosition);
    yPosition += 15;

    ventures.forEach((venture, index) => {
      if (yPosition > pageHeight - 20) {
        doc.addPage();
        yPosition = 10;
      }

      doc.setFontSize(12);
      doc.text(`${index + 1}. ${venture.name}`, 10, yPosition);
      yPosition += lineHeight;

      doc.setFontSize(10);
      doc.text(`Industry: ${venture.industry}`, 15, yPosition);
      yPosition += lineHeight;

      doc.text(`Status: ${venture.status}`, 15, yPosition);
      yPosition += lineHeight;

      doc.text(`Started: ${venture.startedDate}`, 15, yPosition);
      yPosition += lineHeight;

      if (venture.description) {
        doc.text(`Description: ${venture.description}`, 15, yPosition);
        yPosition += lineHeight;
      }

      if (venture.healthScore) {
        doc.text(`Health Score: ${venture.healthScore}/100`, 15, yPosition);
        yPosition += lineHeight;
      }

      yPosition += 5;
    });

    doc.save('ventures-report.pdf');
  } catch (error) {
    console.error('PDF export failed:', error);
    throw new Error('Failed to export as PDF. Please install jsPDF.');
  }
};

// Helper function to download files
const downloadFile = (content: string, filename: string, mimeType: string) => {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

// Import from JSON
export const importFromJSON = (file: File): Promise<{
  ventures: Venture[];
  events: VentureEvent[];
  tasks: FounderTask[];
}> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        resolve(data);
      } catch (error) {
        reject(new Error('Invalid JSON file'));
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
};
