import React from 'react';
import { Plus } from 'lucide-react';
import { Button } from '../../components/ui';
import { useI18n } from '../../core/i18n';

export function DocumentListHeader({ onCreate }) {
  const { t } = useI18n();

  return (
    <div className="section-header doc-section-header">
      <div>
        <h2>{t('documents.title')}</h2>
        <p className="text-subtle">{t('documents.subtitle')}</p>
      </div>
      <Button icon={<Plus size={16} />} onClick={onCreate} className="doc-add-btn">
        <span className="doc-add-text">{t('documents.addDocument')}</span>
      </Button>
    </div>
  );
}
