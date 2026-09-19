import React, { useState, useEffect } from 'react';
import { FolderCheck, FolderPlus, XCircle } from 'lucide-react';
import { Button } from '../../components/ui';
import { useI18n } from '../../core/i18n';
import {
  getConnectedDirectoryName,
  selectArchiveDirectory,
  disconnectArchiveDirectory,
} from '../../core/storage/archiveService';

export function SettingsArchiveCard() {
  const { t } = useI18n();
  const [dirName, setDirName] = useState(null);

  useEffect(() => {
    getConnectedDirectoryName().then(setDirName);
  }, []);

  const handleSelect = async () => {
    const name = await selectArchiveDirectory();
    if (name) setDirName(name);
  };

  const handleDisconnect = async () => {
    await disconnectArchiveDirectory();
    setDirName(null);
  };

  return (
    <div className="settings-card">
      <div className="settings-card-header">
        <FolderCheck size={20} className="text-muted" />
        <h3 className="settings-card-title">{t('common.archive.title')}</h3>
      </div>
      <p className="settings-guide-text">{t('common.archive.desc')}</p>

      <div className="settings-row">
        <div className="settings-row-info">
          <span className="settings-row-label">
            {dirName ? t('common.archive.connected') : t('common.archive.notConnected')}
          </span>
          <span className="settings-row-desc">
            {dirName ? `${t('common.archive.folder')}: ${dirName}` : t('common.archive.fallbackNotice')}
          </span>
        </div>
        <div className="settings-row-actions">
          {dirName ? (
            <Button variant="danger" size="sm" icon={<XCircle size={14} />} onClick={handleDisconnect}>
              {t('common.archive.disconnect')}
            </Button>
          ) : (
            <Button variant="secondary" size="sm" icon={<FolderPlus size={14} />} onClick={handleSelect}>
              {t('common.archive.selectFolder')}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
