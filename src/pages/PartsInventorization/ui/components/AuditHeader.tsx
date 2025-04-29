import React from 'react';
import cls from './AuditHeader.module.scss';
import { useAuth } from '../../../../contexts/AuthContext';

const AuditHeader = () => {
  const { userData } = useAuth();
  const [startTime, setStartTime] = React.useState<string>('');
  const [endTime, setEndTime] = React.useState<string>('');

  return (
    <div className={cls.auditHeader}>
      <div className={cls.fieldGroup}>
        <label className={cls.label}>Начало проверки:</label>
        <input
          type="datetime-local"
          className={cls.input}
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
        />
      </div>
      <div className={cls.fieldGroup}>
        <label className={cls.label}>Окончание проверки:</label>
        <input
          type="datetime-local"
          className={cls.input}
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
        />
      </div>
      <div className={cls.fieldGroup}>
        <label className={cls.label}>Аудитор:</label>
        <input
          type="text"
          className={cls.input}
          value={userData?.displayName || ''}
          disabled
        />
      </div>
    </div>
  );
};

export default AuditHeader; 