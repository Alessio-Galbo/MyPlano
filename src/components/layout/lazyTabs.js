import { lazy } from 'react';

// Non-initial tabs are split into their own chunks: the first paint only loads the
// Budget tab. Each chunk (and its heavy modals: history hub, attachments, camera/EXIF)
// is downloaded the first time the tab is opened, then cached by the browser / SW.
const named = (loader, name) => lazy(() => loader().then((m) => ({ default: m[name] })));

export const DocumentList = named(() => import('../../modules/documents/DocumentList'), 'DocumentList');
export const ExpenseList = named(() => import('../../modules/expenses/ExpenseList'), 'ExpenseList');
export const SettingsView = named(() => import('../../modules/settings/SettingsView'), 'SettingsView');
