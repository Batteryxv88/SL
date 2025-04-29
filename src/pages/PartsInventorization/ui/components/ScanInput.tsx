import React, { useState } from 'react';
import cls from './ScanInput.module.scss';

interface ScanInputProps {
  onPartScan?: (partN: string) => void;
  onManualEntry?: (partN: string) => void;
}

const ScanInput: React.FC<ScanInputProps> = ({ onPartScan, onManualEntry }) => {
  const [value, setValue] = useState<string>('');

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && value.trim()) {
      if (onPartScan) {
        onPartScan(value.trim());
      }
      setValue('');
    }
  };

  const handleManualClick = () => {
    if (onManualEntry && value.trim()) {
      onManualEntry(value.trim());
      setValue('');
    }
  };

  return (
    <div className={cls.scanInput}>
      <input
        type="text"
        className={cls.input}
        placeholder="Сканируйте штрих-код или введите вручную"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyPress={handleKeyPress}
        autoFocus
      />
      <button className={cls.button} onClick={handleManualClick}>
        Ввести вручную
      </button>
    </div>
  );
};

export default ScanInput; 