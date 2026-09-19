import React from 'react';
import { PieChart, FileText, Receipt, Settings, ShieldCheck } from 'lucide-react';
import { useApp } from '../../core/state';
import { useI18n } from '../../core/i18n';
import { NavbarProfileSelector } from './NavbarProfileSelector';
import './Navbar.css';

export function Navbar({
  profiles = [],
  expenses = [],
  onOpenManageModal,
  onOpenAddModal,
}) {
  const { activeTab, setActiveTab, selectedProfileId } = useApp();
  const { t } = useI18n();

  const navItems = [
    { id: 'budget', label: t('common.nav.budget'), icon: <PieChart size={18} /> },
    { id: 'documents', label: t('common.nav.documents'), icon: <FileText size={18} /> },
    { id: 'expenses', label: t('common.nav.expenses'), icon: <Receipt size={18} /> },
    { id: 'settings', label: t('common.nav.settings'), icon: <Settings size={18} /> },
  ];

  return (
    <header className="navbar">
      <div className="navbar-container">
        <div className="navbar-top-row">
          <div className="navbar-brand">
            <div className="brand-icon">
              <ShieldCheck size={22} />
            </div>
            <h1 className="brand-title text-gradient">{t('common.appName')}</h1>
          </div>

          <NavbarProfileSelector
            profiles={profiles}
            selectedProfileId={selectedProfileId}
            expenses={expenses}
            onOpenManageModal={onOpenManageModal}
            onOpenAddModal={onOpenAddModal}
          />
        </div>

        <nav className="navbar-tabs" aria-label="Main Navigation">
          {navItems.map((item) => (
            <button
              key={item.id}
              type="button"
              className={`nav-tab ${activeTab === item.id ? 'active' : ''}`}
              onClick={() => setActiveTab(item.id)}
              title={item.label}
              aria-label={item.label}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
}
