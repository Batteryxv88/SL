import { useState, KeyboardEvent } from 'react';
import { changePage } from "../../../app/providers/StoreProvider/Store/ChangePageSlice";
import { useAppDispatch } from "../../../app/providers/StoreProvider/Store/hooks";
import cls from './LaminatePage.module.scss';

const LaminatePage = () => {
    const dispatch = useAppDispatch();
    dispatch(changePage('laminate'));

    const [thickness, setThickness] = useState<string>('');
    const [result, setResult] = useState<number | null>(null);
    const [laminateType, setLaminateType] = useState<'matte' | 'glossy' | null>(null);
    const [error, setError] = useState<string | null>(null);

    const calculateLength = (r: number, t: number) => {
        const d = 90.3; // fixed value
        const D = d + r + r;
        const length = Math.PI * (Math.pow(D, 2) - Math.pow(d, 2)) / (4 * t) / 1000;
        return length;
    };

    const handleCalculate = () => {
        if (!laminateType) {
            setError('Выберите тип ламинации');
            return;
        }

        const r = parseFloat(thickness);
        if (isNaN(r)) {
            setError('Введите корректное значение толщины');
            return;
        }

        const t = laminateType === 'matte' ? 0.0275 : 0.03;
        const calculatedLength = calculateLength(r, t);
        setResult(calculatedLength);
        setError(null);
    };

    const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleCalculate();
        }
    };

    const handleTypeSelect = (type: 'matte' | 'glossy') => {
        setLaminateType(type);
        setError(null);
    };

    return (
        <div className={cls.LaminatePage}>
            <div className={cls.calculator}>
                <h2 className={cls.title}>Калькулятор метража ламинации</h2>
                <div className={cls.inputWrapper}>
                    <input
                        type="number"
                        value={thickness}
                        onChange={(e) => {
                            setThickness(e.target.value);
                            setError(null);
                        }}
                        onKeyPress={handleKeyPress}
                        placeholder="Введите значение, мм"
                        className={cls.input}
                    />
                </div>
                <div className={cls.buttonsWrapper}>
                    <button
                        onClick={() => handleTypeSelect('matte')}
                        className={`${cls.button} ${laminateType === 'matte' ? cls.active : ''}`}
                    >
                        Матовая ламинация
                    </button>
                    <button
                        onClick={() => handleTypeSelect('glossy')}
                        className={`${cls.button} ${laminateType === 'glossy' ? cls.active : ''}`}
                    >
                        Глянцевая ламинация
                    </button>
                </div>
                <button
                    onClick={handleCalculate}
                    className={cls.calculateButton}
                >
                    Рассчитать
                </button>
                {error && <div className={cls.error}>{error}</div>}
                {result !== null && (
                    <div className={cls.result}>
                        <span>Результат:</span>
                        <span>{result.toFixed(2)} м</span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default LaminatePage; 