import cls from "./PartsInventorization.module.scss";
import AuditHeader from "./components/AuditHeader";
import ScanInput from "./components/ScanInput";
import AuditTable from "./components/AuditTable";
import AuditFooter from "./components/AuditFooter";
import AuditLog, { AuditLogEntry } from "./components/AuditLog";
import React, { useState } from 'react';
import { useParts } from '../../../app/providers/StoreProvider/Store/hooks';
import { AuditItem } from './components/AuditTable';

const PartsInventorization = () => {
    const { partsArray } = useParts();
    const [items, setItems] = useState<AuditItem[]>([]);
    const [logEntries, setLogEntries] = useState<AuditLogEntry[]>([]);

    // helper to add an audit log entry
    const addLog = (message: string) => {
      const timestamp = new Date().toLocaleString();
      setLogEntries(prev => [...prev, { timestamp, message }]);
    };

    // При сканировании или ручном вводе добавляем в список
    const handlePartAdd = (partN: string) => {
      if (items.some(i => i.partN === partN)) return;
      const found = partsArray.find(el => el.part.partN === partN);
      if (found) {
        setItems(prev => [
          ...prev,
          {
            id: found.id!,
            partN: found.part.partN,
            partName: found.part.partName,
            expectedQty: found.part.quantity,
            actualQty: 0,
            units: 'шт.',
          },
        ]);
        addLog(`Добавлена позиция: ${partN}`);
      } else {
        alert('Позиция не найдена в базе. Пожалуйста, введите корректный номер.');
      }
    };

    const handleActualChange = (id: string, newActual: number) => {
      setItems(prev => prev.map(i => i.id === id ? { ...i, actualQty: newActual } : i));
      addLog(`Изменено фактическое количество у ${id} на ${newActual}`);
    };

    const handleRestartCount = (id: string) => {
      setItems(prev => prev.map(i => i.id === id ? { ...i, actualQty: 0 } : i));
      addLog(`Пересчёт сброшен для ${id}`);
    };

    const handleSave = () => {
      console.log('Сохраняю результаты аудита', items);
      addLog('Результаты аудита сохранены');
      // TODO: отправить на сервер
    };

    const handleFinish = () => {
      console.log('Завершаю аудит', items);
      addLog('Аудит завершён');
      // TODO: финализировать сессию
    };

    const handleExport = (format: 'CSV' | 'PDF') => {
      addLog(`Экспорт формата: ${format}`);
      if (format === 'CSV') {
        const header = ['Штрих-код','Наименование','Ожидаемое','Фактическое','Разница','Ед. изм.'];
        const rows = items.map(i => [i.partN,i.partName,String(i.expectedQty),String(i.actualQty),String(i.actualQty - i.expectedQty),i.units]);
        const csv = [header, ...rows].map(r => r.join(',')).join('\n');
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a'); a.href = url; a.download = 'audit.csv'; a.click();
      } else if (format === 'PDF') {
        window.print();
      }
    };

    return (
      <div className={cls.partsInventorization}>
        {/* Метаданные аудита */}
        <AuditHeader />

        {/* Поле сканирования или ручного ввода */}
        <ScanInput onPartScan={handlePartAdd} onManualEntry={handlePartAdd} />

        {/* Таблица позиций */}
        <AuditTable
          data={items}
          onActualChange={handleActualChange}
          onRestartCount={handleRestartCount}
        />

        {/* Журнал аудита */}
        <AuditLog entries={logEntries} />

        {/* Управление сессией и экспорт */}
        <AuditFooter
          scannedCount={items.length}
          totalCount={partsArray.length}
          onSave={handleSave}
          onFinish={handleFinish}
          exportOptions={['CSV','PDF']}
          onExport={handleExport}
        />
      </div>
    );
};

export default PartsInventorization;
