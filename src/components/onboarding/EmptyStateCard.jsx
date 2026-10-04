import React from 'react';
import { Plus } from 'lucide-react';
import { Button } from '../ui';
import './OnboardingCards.css';

// Empty list with an optional call to action ("add the first …").
export function EmptyStateCard({ title, message, actionLabel, onAction }) {
  return (
    <div className="onboarding-card empty-state-card">
      {title && <h3 className="onboarding-card-title">{title}</h3>}
      <p className="onboarding-card-desc">{message}</p>
      {actionLabel && onAction && (
        <Button icon={<Plus size={16} />} onClick={onAction} className="onboarding-card-btn">
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
