export function generateIcsCalendar(documents, expenses) {
  const events = [];

  // Add documents expiring that have alert enabled
  documents.forEach((doc) => {
    if (!doc.enableAlert || !doc.expiryDate) return;
    const dateFormatted = doc.expiryDate.replace(/-/g, '');
    events.push([
      'BEGIN:VEVENT',
      `UID:doc-${doc.id}@myplano.app`,
      `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z`,
      `DTSTART;VALUE=DATE:${dateFormatted}`,
      `SUMMARY:Scadenza Documento: ${doc.title}`,
      `DESCRIPTION:Identificativo: ${doc.identifier || '-'} | Ente: ${doc.issuer || '-'}`,
      'BEGIN:VALARM',
      'TRIGGER:-P30D',
      'ACTION:DISPLAY',
      `DESCRIPTION:Promemoria: ${doc.title} scade tra 30 giorni`,
      'END:VALARM',
      'END:VEVENT',
    ].join('\r\n'));
  });

  // Add expenses that have includeInCalendar enabled
  expenses.forEach((exp) => {
    if (!exp.includeInCalendar || !exp.nextDueDate) return;
    const dateFormatted = exp.nextDueDate.replace(/-/g, '');
    events.push([
      'BEGIN:VEVENT',
      `UID:exp-${exp.id}@myplano.app`,
      `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z`,
      `DTSTART;VALUE=DATE:${dateFormatted}`,
      `SUMMARY:Scadenza Pagamento: ${exp.title} (€ ${exp.amount})`,
      `DESCRIPTION:Importo: € ${exp.amount} | Frequenza: ${exp.frequency}`,
      'BEGIN:VALARM',
      'TRIGGER:-P7D',
      'ACTION:DISPLAY',
      `DESCRIPTION:Promemoria pagamento: ${exp.title}`,
      'END:VALARM',
      'END:VEVENT',
    ].join('\r\n'));
  });

  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//MyPlano//IT',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    ...events,
    'END:VCALENDAR',
  ].join('\r\n');

  return icsContent;
}

export function downloadFile(content, fileName, contentType) {
  const blob = new Blob([content], { type: contentType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
