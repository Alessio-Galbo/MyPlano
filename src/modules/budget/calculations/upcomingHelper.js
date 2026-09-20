export function getUpcomingDeadlines(expenses = [], documents = [], profileId = 'all') {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const thirtyDaysLater = new Date(now);
  thirtyDaysLater.setDate(now.getDate() + 30);
  thirtyDaysLater.setHours(23, 59, 59, 999);

  const filteredExpenses = profileId === 'all'
    ? expenses
    : expenses.filter((e) => e.profileId === profileId);

  const filteredDocs = profileId === 'all'
    ? documents
    : documents.filter((d) => d.profileId === profileId);

  const items = [];

  filteredExpenses.forEach((e) => {
    if (!e.nextDueDate) return;
    const due = new Date(e.nextDueDate);
    due.setHours(0, 0, 0, 0);
    if (due >= now && due <= thirtyDaysLater) {
      const diffDays = Math.ceil((due - now) / (1000 * 60 * 60 * 24));
      items.push({
        id: `exp-${e.id}`,
        itemType: 'expense',
        title: e.title,
        date: e.nextDueDate,
        diffDays,
        amount: e.amount,
        frequency: e.frequency,
        category: e.category,
        profileId: e.profileId,
        raw: e,
      });
    }
  });

  filteredDocs.forEach((d) => {
    if (!d.expiryDate) return;
    const exp = new Date(d.expiryDate);
    exp.setHours(0, 0, 0, 0);
    if (exp >= now && exp <= thirtyDaysLater) {
      const diffDays = Math.ceil((exp - now) / (1000 * 60 * 60 * 24));
      items.push({
        id: `doc-${d.id}`,
        itemType: 'document',
        title: d.title,
        date: d.expiryDate,
        diffDays,
        docType: d.type,
        identifier: d.identifier,
        issuer: d.issuer,
        profileId: d.profileId,
        raw: d,
      });
    }
  });

  return items.sort((a, b) => new Date(a.date) - new Date(b.date));
}
