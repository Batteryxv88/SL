import { useState, useEffect, useRef } from "react";
import cls from "./AddRotationForm.module.scss";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { addForm } from "../../../app/providers/StoreProvider/Store/RotationFormsSlice";

interface AddRotationFormProps {
    isOpen: boolean;
    onClose: () => void;
}

const Modal = ({ isOpen, onClose, children }: { isOpen: boolean; onClose: () => void; children: React.ReactNode }) => {
    const modalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div className={cls.modalOverlay}>
            <div className={cls.modalContent} ref={modalRef}>
                <h2 className={cls.modalTitle}>Добавить форму</h2>
                <button className={cls.closeButton} onClick={onClose}>×</button>
                {children}
            </div>
        </div>
    );
};

const AddRotationForm = ({ isOpen, onClose }: AddRotationFormProps) => {
    const dispatch = useDispatch<any>();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showValidationError, setShowValidationError] = useState(false);

    type FormValues = {
        height: number | string;
        width: number | string;
        rows: number | string;
        shape: string;
        size_for_column: number | string;
        mark: string;
        height_without1: number | string;
        material: string;
        columns: number | string;
        comment: string;
        number: number | string;
    };

    const {
        register,
        formState: { errors, isValid },
        handleSubmit,
        reset,
    } = useForm<FormValues>({
        mode: "onChange",
        defaultValues: {
            height: "",
            width: "",
            rows: "",
            shape: "",
            size_for_column: "",
            mark: "",
            height_without1: "",
            material: "",
            columns: "",
            comment: "",
            number: ""
        }
    });

    const handleCloseModal = () => {
        reset();
        setShowValidationError(false);
        onClose();
    };

    const onError = () => {
        setShowValidationError(true);
    };

    const handleAddForm = async (data: FormValues) => {
        if (isSubmitting) return;
        
        try {
            setIsSubmitting(true);
            setShowValidationError(false);
            
            const formData = {
                height: Number(data.height),
                width: Number(data.width),
                rows: Number(data.rows),
                shape: data.shape,
                size_for_column: Number(data.size_for_column),
                mark: data.mark,
                height_without1: Number(data.height_without1),
                material: data.material,
                columns: Number(data.columns),
                comment: data.comment,
                number: Number(data.number),
                createdAt: new Date().toISOString()
            };

            await dispatch(addForm(formData));
            reset();
            onClose();
        } catch (error) {
            console.error('Error adding form:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={handleCloseModal}>
            <form
                className={cls.addForm}
                onSubmit={handleSubmit(handleAddForm, onError)}
            >
                <div className={cls.box}>
                    <label>Высота</label>
                    <input
                        type="number"
                        placeholder="Высота (мм)"
                        {...register("height", {
                            required: true,
                            min: 1
                        })}
                        className={`${cls.input} ${errors.height ? cls.error : ""}`}
                    />
                </div>
                <div className={cls.box}>
                    <label>Ширина</label>
                    <input
                        type="number"
                        placeholder="Ширина (мм)"
                        {...register("width", {
                            required: true,
                            min: 1
                        })}
                        className={`${cls.input} ${errors.width ? cls.error : ""}`}
                    />
                </div>
                <div className={cls.box}>
                    <label>Ручьи</label>
                    <input
                        type="number"
                        placeholder="Количество ручьев"
                        {...register("columns", {
                            required: true,
                            min: 1
                        })}
                        className={`${cls.input} ${errors.columns ? cls.error : ""}`}
                    />
                </div>
                <div className={cls.box}>
                    <label>Ряды</label>
                    <input
                        type="number"
                        placeholder="Количество рядов"
                        {...register("rows", {
                            required: true,
                            min: 1
                        })}
                        className={`${cls.input} ${errors.rows ? cls.error : ""}`}
                    />
                </div>
                <div className={cls.box}>
                    <label>Форма</label>
                    <select
                        {...register("shape", {
                            required: true
                        })}
                        className={`${cls.input} ${errors.shape ? cls.error : ""}`}
                    >
                        <option value="" disabled className={cls.placeholder}>Форма этикетки</option>
                        <option value="квадрат">Квадрат</option>
                        <option value="прямоугольник">Прямоугольник</option>
                        <option value="круг">Круг</option>
                        <option value="овал">Овал</option>
                        <option value="фигурная">Фигурная</option>
                    </select>
                </div>
                <div className={cls.box}>
                    <label>Размер к ручью</label>
                    <input
                        type="number"
                        placeholder="Размер к ручью (мм)"
                        {...register("size_for_column", {
                            required: true,
                            min: 1
                        })}
                        className={`${cls.input} ${errors.size_for_column ? cls.error : ""}`}
                    />
                </div>
                <div className={cls.box}>
                    <label>Метка</label>
                    <select
                        {...register("mark", {
                            required: true
                        })}
                        className={`${cls.input} ${errors.mark ? cls.error : ""}`}
                    >
                        <option value="" disabled className={cls.placeholder}>Размер, расположение</option>
                        <option value="5х5 L R">5х5 L R</option>
                        <option value="5х5 L">5х5 L</option>
                        <option value="5х5 R">5х5 R</option>
                    </select>
                </div>
                <div className={cls.box}>
                    <label>Высота без 1мм</label>
                    <input
                        type="number"
                        placeholder="Высота без 1мм (мм)"
                        {...register("height_without1", {
                            required: true,
                            min: 1
                        })}
                        className={`${cls.input} ${errors.height_without1 ? cls.error : ""}`}
                    />
                </div>
                <div className={cls.box}>
                    <label>Материал</label>
                    <select
                        {...register("material", {
                            required: true
                        })}
                        className={`${cls.input} ${errors.material ? cls.error : ""}`}
                    >
                        <option value="" disabled className={cls.placeholder}>Тип носителя</option>
                        <option value="бумага">Бумага</option>
                        <option value="плёнка">Плёнка</option>
                    </select>
                </div>
                <div className={cls.box}>
                    <label>Номер заказа</label>
                    <input
                        type="number"
                        placeholder="Номер заказа"
                        {...register("number", {
                            required: true,
                            min: 1
                        })}
                        className={`${cls.input} ${errors.number ? cls.error : ""}`}
                    />
                </div>
                <div className={`${cls.box} ${cls.commentBox}`}>
                    <label>Комментарий</label>
                    <textarea
                        {...register("comment")}
                        className={`${cls.input} ${cls.commentInput}`}
                        placeholder="Введите комментарий..."
                    />
                </div>
                
                {showValidationError && Object.keys(errors).length > 0 && (
                    <div className={cls.formErrorContainer}>
                        <div className={cls.formError}>
                            Пожалуйста, заполните все обязательные поля
                        </div>
                    </div>
                )}
                
                <button 
                    type="submit" 
                    className={cls.submitButton}
                    disabled={isSubmitting}
                >
                    {isSubmitting ? 'Добавление...' : 'Добавить'}
                </button>
            </form>
        </Modal>
    );
};

export default AddRotationForm; 