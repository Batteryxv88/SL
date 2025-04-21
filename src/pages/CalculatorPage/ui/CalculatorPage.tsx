import { useState, useEffect, KeyboardEvent as ReactKeyboardEvent } from 'react';
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

    // Test barcode scanner input: collect scanned code and log once when complete
    useEffect(() => {
        console.log('Barcode listener mounted');
        let buffer = '';
        const handleKey = (e: globalThis.KeyboardEvent) => {
            if (e.key === 'Enter') {
                if (buffer.length > 0) {
                    console.log('Scanned barcode:', buffer);
                    buffer = '';
                }
            } else if (e.key.length === 1) {
                buffer += e.key;
            }
        };
        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);

    }, []);

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

    // Add states and helpers for third calculator (thickness from length)
    const [desiredLength, setDesiredLength] = useState<string>('');
    const [calculatedThickness, setCalculatedThickness] = useState<number | null>(null);
    const [selectedMaterialForCalc, setSelectedMaterialForCalc] = useState<MaterialType | null>(null);
    const [thicknessCalcError, setThicknessCalcError] = useState<string | null>(null);

    // Add lamination calculator mode toggle and reverse calculation states
    const [laminationCalcMode, setLaminationCalcMode] = useState<'length' | 'thickness'>('length');
    const [desiredLaminationLength, setDesiredLaminationLength] = useState<string>('');
    const [calculatedLaminationThickness, setCalculatedLaminationThickness] = useState<number | null>(null);
    const [laminationCalcError, setLaminationCalcError] = useState<string | null>(null);

    // State to toggle between material length and thickness calculation modes
    const [materialCalcMode, setMaterialCalcMode] = useState<'length' | 'thickness'>('length');

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

    const handleKeyPress = (e: ReactKeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleCalculate();
        }
    };

    const handleMaterialKeyPress = (e: ReactKeyboardEvent<HTMLInputElement>) => {
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

    const calculateMaterialThickness = (L: number, t: number) => {
        const d = 96; // fixed value for material calculation
        const inner = Math.sqrt(Math.pow(d, 2) + (4000 * t * L) / Math.PI);
        return (inner - d) / 2;
    };

    const handleThicknessCalculate = () => {
        if (!selectedMaterialForCalc) {
            setThicknessCalcError('Выберите материал');
            return;
        }

        const L = parseFloat(desiredLength);
        if (isNaN(L)) {
            setThicknessCalcError('Введите корректное значение метража');
            return;
        }

        const t = MATERIAL_THICKNESS[selectedMaterialForCalc];
        const calculatedR = calculateMaterialThickness(L, t);
        setCalculatedThickness(calculatedR);
        setThicknessCalcError(null);
    };

    const handleThicknessKeyPress = (e: ReactKeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleThicknessCalculate();
        }
    };

    const handleMaterialForCalcSelect = (material: MaterialType) => {
        setSelectedMaterialForCalc(material);
        setThicknessCalcError(null);
    };

    const calculateLaminationThickness = (L: number, t: number) => {
        const d = 90.3; // fixed value for lamination
        const inner = Math.sqrt(Math.pow(d, 2) + (4000 * t * L) / Math.PI);
        return (inner - d) / 2;
    };

    const handleLaminationThicknessCalculate = () => {
        if (!laminateType) {
            setLaminationCalcError('Выберите тип ламинации');
            return;
        }
        const L = parseFloat(desiredLaminationLength);
        if (isNaN(L)) {
            setLaminationCalcError('Введите корректное значение метража');
            return;
        }
        const t = laminateType === 'matte' ? 0.0275 : 0.03;
        const r = calculateLaminationThickness(L, t);
        setCalculatedLaminationThickness(r);
        setLaminationCalcError(null);
    };

    const handleLaminationKeyPress = (e: ReactKeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleLaminationThicknessCalculate();
        }
    };

    return (
        <div className={cls.CalculatorPage}>
            {/* Combined lamination calculators with mode toggle */}
            <div className={cls.calculator}>
                <h2 className={cls.title}>Расчет ламинации</h2>
                <div className={cls.buttonsWrapper}>
                    <button
                        onClick={() => setLaminationCalcMode('length')}
                        className={`${cls.button} ${laminationCalcMode === 'length' ? cls.active : ''}`}
                    >Метраж по толщине</button>
                    <button
                        onClick={() => setLaminationCalcMode('thickness')}
                        className={`${cls.button} ${laminationCalcMode === 'thickness' ? cls.active : ''}`}
                    >Толщина по метражу</button>
                </div>
                {laminationCalcMode === 'length' ? (
                    <>
                        <div className={cls.inputWrapper}>
                            <input
                                type="number"
                                value={thickness}
                                onChange={(e) => { setThickness(e.target.value); setError(null); }}
                                onKeyPress={handleKeyPress}
                                placeholder="Введите значение толщины слоя ламинации, мм"
                                className={cls.input}
                            />
                        </div>
                        <div className={cls.buttonsWrapper}>
                            <button
                                onClick={() => handleTypeSelect('matte')}
                                className={`${cls.button} ${laminateType === 'matte' ? cls.active : ''}`}
                            >Матовая ламинация</button>
                            <button
                                onClick={() => handleTypeSelect('glossy')}
                                className={`${cls.button} ${laminateType === 'glossy' ? cls.active : ''}`}
                            >Глянцевая ламинация</button>
                        </div>
                        <button onClick={handleCalculate} className={cls.calculateButton}>Рассчитать</button>
                        {error && <div className={cls.error}>{error}</div>}
                        {result !== null && (
                            <div className={cls.result}>
                                <span>Результат:</span>
                                <span>{result.toFixed(2)} м</span>
                            </div>
                        )}
                    </>
                ) : (
                    <>
                        <div className={cls.inputWrapper}>
                            <input
                                type="number"
                                value={desiredLaminationLength}
                                onChange={(e) => { setDesiredLaminationLength(e.target.value); setLaminationCalcError(null); }}
                                onKeyPress={handleLaminationKeyPress}
                                placeholder="Введите значение длинны тиража, м"
                                className={cls.input}
                            />
                        </div>
                        <div className={cls.buttonsWrapper}>
                            <button
                                onClick={() => handleTypeSelect('matte')}
                                className={`${cls.button} ${laminateType === 'matte' ? cls.active : ''}`}
                            >Матовая ламинация</button>
                            <button
                                onClick={() => handleTypeSelect('glossy')}
                                className={`${cls.button} ${laminateType === 'glossy' ? cls.active : ''}`}
                            >Глянцевая ламинация</button>
                        </div>
                        <button onClick={handleLaminationThicknessCalculate} className={cls.calculateButton}>Рассчитать</button>
                        {laminationCalcError && <div className={cls.error}>{laminationCalcError}</div>}
                        {calculatedLaminationThickness !== null && (
                            <div className={cls.result}>
                                <span>Результат:</span>
                                <span>{calculatedLaminationThickness.toFixed(2)} мм</span>
                            </div>
                        )}
                    </>
                )}
            </div>
            {/* Combined material calculators with mode toggle */}
            <div className={cls.calculator}>
                <h2 className={cls.title}>Расчет материала</h2>
                <div className={cls.buttonsWrapper}>
                    <button
                        onClick={() => setMaterialCalcMode('length')}
                        className={`${cls.button} ${materialCalcMode === 'length' ? cls.active : ''}`}
                    >
                        Метраж по толщине
                    </button>
                    <button
                        onClick={() => setMaterialCalcMode('thickness')}
                        className={`${cls.button} ${materialCalcMode === 'thickness' ? cls.active : ''}`}
                    >
                        Толщина по метражу
                    </button>
                </div>
                {materialCalcMode === 'length' ? (
                    <>                    
                        <div className={cls.inputWrapper}>
                            <input
                                type="number"
                                value={materialThickness}
                                onChange={(e) => { setMaterialThickness(e.target.value); setMaterialError(null); }}
                                onKeyPress={handleMaterialKeyPress}
                                placeholder="Введите значение толщины слоя материала, мм"
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
                        <button onClick={handleMaterialCalculate} className={cls.calculateButton}>Рассчитать</button>
                        {materialError && <div className={cls.error}>{materialError}</div>}
                        {materialResult !== null && (
                            <div className={cls.result}>
                                <span>Результат:</span>
                                <span>{materialResult.toFixed(2)} м</span>
                            </div>
                        )}
                    </>
                ) : (
                    <>
                        <div className={cls.inputWrapper}>
                            <input
                                type="number"
                                value={desiredLength}
                                onChange={(e) => { setDesiredLength(e.target.value); setThicknessCalcError(null); }}
                                onKeyPress={handleThicknessKeyPress}
                                placeholder="Введите значение длинны тиража, м"
                                className={cls.input}
                            />
                        </div>
                        <div className={cls.buttonsWrapper}>
                            {Object.keys(MATERIAL_THICKNESS).map((material) => (
                                <button
                                    key={material}
                                    onClick={() => handleMaterialForCalcSelect(material as MaterialType)}
                                    className={`${cls.button} ${selectedMaterialForCalc === material ? cls.active : ''}`}
                                >
                                    {material}
                                </button>
                            ))}
                        </div>
                        <button onClick={handleThicknessCalculate} className={cls.calculateButton}>Рассчитать</button>
                        {thicknessCalcError && <div className={cls.error}>{thicknessCalcError}</div>}
                        {calculatedThickness !== null && (
                            <div className={cls.result}>
                                <span>Результат:</span>
                                <span>{calculatedThickness.toFixed(2)} мм</span>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default CalculatorPage; 