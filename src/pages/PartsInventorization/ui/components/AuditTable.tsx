import React from 'react';
import cls from './AuditTable.module.scss';

export interface AuditItem {
  id: string;
  partN: string;
  partName: string;
  expectedQty: number;
  actualQty: number;
  units: string;
}

interface AuditTableProps {
  data: AuditItem[];
  onActualChange: (id: string, newActual: number) => void;
  onRestartCount: (id: string) => void;
}

const AuditTable: React.FC<AuditTableProps> = ({ data, onActualChange, onRestartCount }) => {
  return (
    <table className={cls.auditTable}>
      <thead>
        <tr>
          <th>Штрих-код</th>
          <th>Наименование</th>
          <th>Ожидаемое</th>
          <th>Фактическое</th>
          <th>Разница</th>
          <th>Ед. изм.</th>
          <th>Действия</th>
        </tr>
      </thead>
      <tbody>
        {data.map(item => {
          const diff = item.actualQty - item.expectedQty;
          return (
            <tr key={item.id}>
              <td>{item.partN}</td>
              <td>{item.partName}</td>
              <td>{item.expectedQty}</td>
              <td>
                <input
                  type="number"
                  className={cls.input}
                  value={item.actualQty}
                  onChange={e => onActualChange(item.id, Number(e.target.value))}
                />
              </td>
              <td className={diff < 0 ? cls.negative : cls.positive}>{diff}</td>
              <td>{item.units}</td>
              <td>
                <button className={cls.buttonRestart} onClick={() => onRestartCount(item.id)}>
                  Пересчитать
                </button>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default AuditTable; 