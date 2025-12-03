import React from 'react';
import AccountBasicInfo from './AccountBasicInfo';
import './AccountBasicInfo.css';

export default function AccountSection() {
  return (
    <div className="account-section-container">
      <h1 className="account-section-title">Account</h1>
      <AccountBasicInfo />
    </div>
  );
}
