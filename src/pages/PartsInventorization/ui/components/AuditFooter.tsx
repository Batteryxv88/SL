import React from 'react';
import cls from './AuditFooter.module.scss';

interface AuditFooterProps {
  scannedCount: number;
  totalCount: number;
  onSave: () => void;
  onFinish: () => void;
  exportOptions?: ('CSV' | 'PDF')[];
  onExport: (format: 'CSV' | 'PDF') => void;
}

const AuditFooter: React.FC<AuditFooterProps> = ({
  scannedCount,
  totalCount,
  onSave,
  onFinish,
  exportOptions = ['CSV', 'PDF'],
  onExport,
}) => {
  const progressPercent = totalCount > 0 ? (scannedCount / totalCount) * 100 : 0;

  return (
    <div className={cls.auditFooter}>
      <div className={cls.progress}>
        <span className={cls.label}>{`Прогресс: ${scannedCount} из ${totalCount}`}</span>
        <div className={cls.progressBar}>
          <div
            className={cls.progressFill}
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>
      <div className={cls.buttons}>
        <button className={cls.saveButton} onClick={onSave}>
          Сохранить
        </button>
        <button className={cls.finishButton} onClick={onFinish}>
          Завершить
        </button>
        {exportOptions.map(opt => (
          <button
            key={opt}
            className={cls.exportButton}
            onClick={() => onExport(opt)}
          >
            Экспорт {opt}
          </button>
        ))}
      </div>
    </div>
  );
};

export default AuditFooter; 