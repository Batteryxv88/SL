import { useState, KeyboardEvent } from 'react';
import { changePage } from "../../../app/providers/StoreProvider/Store/ChangePageSlice";
import { useAppDispatch } from "../../../app/providers/StoreProvider/Store/hooks";
import cls from './CalculatorPage.module.scss';
//import RotationPage from '../../RotationPage/ui/RotationPage';
type MaterialType = 'FA' | 'FH' | 'PA' | 'PH' | 'Clear' | 'Metall' | 'Verge';

const MATERIAL_THICKNESS: Record<MaterialType, number> = {
    'FA': 0.1182,
    'FH': 0.121,
    'PA': 0.1245,
    'PH': 0.1285,
    'Clear': 0.123,
    'Metall': 0.1096,
    'Verge': 0.1837
};

const CalculatorPage = () => {
    const dispatch = useAppDispatch();
    dispatch(changePage('calculator'));

    // First calculator states
    const [thickness, setThickness] = useState<string>('');
    const [result, setResult] = useState<number | null>(null);
    const [laminateType, setLaminateType] = useState<'matte' | 'glossy' | null>(null);
    const [error, setError] = useState<string | null>(null);

    // Second calculator states
    const [materialThickness, setMaterialThickness] = useState<string>('');
    const [materialResult, setMaterialResult] = useState<number | null>(null);
    const [selectedMaterial, setSelectedMaterial] = useState<MaterialType | null>(null);
    const [materialError, setMaterialError] = useState<string | null>(null);

    const calculateLength = (r: number, t: number) => {
        const d = 90.3; // fixed value
        const D = d + r + r;
        const length = Math.PI * (Math.pow(D, 2) - Math.pow(d, 2)) / (4 * t) / 1000;
        return length;
    };

    const calculateMaterialLength = (r: number, t: number) => {
        const d = 96; // fixed value for material calculation
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

    const handleMaterialCalculate = () => {
        if (!selectedMaterial) {
            setMaterialError('Выберите материал');
            return;
        }

        const r = parseFloat(materialThickness);
        if (isNaN(r)) {
            setMaterialError('Введите корректное значение толщины');
            return;
        }

        const t = MATERIAL_THICKNESS[selectedMaterial];
        const calculatedLength = calculateMaterialLength(r, t);
        setMaterialResult(calculatedLength);
        setMaterialError(null);
    };

    const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleCalculate();
        }
    };

    const handleMaterialKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleMaterialCalculate();
        }
    };

    const handleTypeSelect = (type: 'matte' | 'glossy') => {
        setLaminateType(type);
        setError(null);
    };

    const handleMaterialSelect = (material: MaterialType) => {
        setSelectedMaterial(material);
        setMaterialError(null);
    };

    return (
        <div className={cls.CalculatorPage}>
            <div className={cls.calculator}>
                <h2 className={cls.title}>Расчет метража ламинации</h2>
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

            <div className={cls.calculator}>
                <h2 className={cls.title}>Расчет метража материала</h2>
                <div className={cls.inputWrapper}>
                    <input
                        type="number"
                        value={materialThickness}
                        onChange={(e) => {
                            setMaterialThickness(e.target.value);
                            setMaterialError(null);
                        }}
                        onKeyPress={handleMaterialKeyPress}
                        placeholder="Введите значение, мм"
                        className={cls.input}
                    />
                </div>
                <div className={cls.buttonsWrapper}>
                    {Object.keys(MATERIAL_THICKNESS).map((material) => (
                        <button
                            key={material}
                            onClick={() => handleMaterialSelect(material as MaterialType)}
                            className={`${cls.button} ${selectedMaterial === material ? cls.active : ''}`}
                        >
                            {material}
                        </button>
                    ))}
                </div>
                <button
                    onClick={handleMaterialCalculate}
                    className={cls.calculateButton}
                >
                    Рассчитать
                </button>
                {materialError && <div className={cls.error}>{materialError}</div>}
                {materialResult !== null && (
                    <div className={cls.result}>
                        <span>Результат:</span>
                        <span>{materialResult.toFixed(2)} м</span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CalculatorPage; 