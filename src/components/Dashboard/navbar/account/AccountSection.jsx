import React from 'react';
import AccountBasicInfo from './AccountBasicInfo';
import './AccountBasicInfo.css';

export default function AccountSection() {
  return (
    <div style={{ width: '100%', maxWidth: '900px', margin: '0 auto' }}>
      <h1 className="account-section-title">Account</h1>
      <AccountBasicInfo />
    </div>
  );
}
