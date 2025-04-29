import React from 'react';
import cls from './AuditLog.module.scss';

export interface AuditLogEntry {
  timestamp: string;
  message: string;
}

interface AuditLogProps {
  entries: AuditLogEntry[];
}

const AuditLog: React.FC<AuditLogProps> = ({ entries }) => {
  return (
    <div className={cls.auditLog}>
      <h4 className={cls.title}>Журнал аудита</h4>
      <ul className={cls.list}>
        {entries.map((entry, idx) => (
          <li key={idx} className={cls.item} title={entry.message}>
            <span className={cls.time}>{entry.timestamp}</span>
            <span className={cls.msg}>{entry.message}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AuditLog; 