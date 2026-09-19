import React, { useRef } from 'react';
import { Camera, UploadCloud } from 'lucide-react';

export function ExpenseAttachmentUploadBox({ onFilesSelected, t }) {
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);

  const handleInputChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      onFilesSelected(files);
    }
    e.target.value = '';
  };

  return (
    <div className="att-upload-section">
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*,.pdf"
        className="receipt-hidden-input"
        onChange={handleInputChange}
      />
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="receipt-hidden-input"
        onChange={handleInputChange}
      />

      <div className="att-upload-grid">
        <div
          className="att-col-upload-box"
          onClick={() => fileInputRef.current?.click()}
          title={t('expenses.databaseHub.uploadFile')}
          role="button"
          tabIndex={0}
        >
          <UploadCloud size={22} className="att-col-upload-icon" />
          <span className="att-col-upload-text">{t('expenses.databaseHub.uploadFile')}</span>
          <span className="att-col-upload-hint">PDF, JPG, PNG</span>
        </div>

        <div
          className="att-col-upload-box camera"
          onClick={() => cameraInputRef.current?.click()}
          title={t('expenses.databaseHub.takePhoto')}
          role="button"
          tabIndex={0}
        >
          <Camera size={22} className="att-col-upload-icon camera-icon" />
          <span className="att-col-upload-text">{t('expenses.databaseHub.takePhoto')}</span>
          <span className="att-col-upload-hint">{t('expenses.databaseHub.cameraHint')}</span>
        </div>
      </div>
    </div>
  );
}
