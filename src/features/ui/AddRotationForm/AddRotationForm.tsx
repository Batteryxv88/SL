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

    type FormValues = {
        height: number;
        width: number;
        rows: number;
        shape: string;
        size_for_column: number;
        mark: string;
        height_without1: number;
        material: string;
        columns: number;
        comment: string;
        number: number;
    };

    const {
        register,
        formState: { errors },
        handleSubmit,
        reset,
    } = useForm<FormValues>({
        mode: "onChange",
        defaultValues: {
            height: 0,
            width: 0,
            rows: 0,
            shape: "квадрат",
            size_for_column: 0,
            mark: "5х5 L R",
            height_without1: 0,
            material: "бумага",
            columns: 0,
            comment: "",
            number: 0
        }
    });

    const handleCloseModal = () => {
        reset();
        onClose();
    };

    const handleAddForm = async (data: FormValues) => {
        try {
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
            // Здесь можно добавить обработку ошибок, например, показать уведомление
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={handleCloseModal}>
            <form
                className={cls.addForm}
                onSubmit={handleSubmit(handleAddForm)}
            >
                <div className={cls.box}>
                    <label>Высота</label>
                    <input
                        type="number"
                        {...register("height", {
                            required: "Обязательное поле",
                        })}
                        className={cls.input}
                    />
                </div>
                <div className={cls.box}>
                    <label>Ширина</label>
                    <input
                        type="number"
                        {...register("width", {
                            required: "Обязательное поле",
                        })}
                        className={cls.input}
                    />
                </div>
                <div className={cls.box}>
                    <label>Ручьи</label>
                    <input
                        type="number"
                        {...register("columns", {
                            required: "Обязательное поле",
                        })}
                        className={cls.input}
                    />
                </div>
                <div className={cls.box}>
                    <label>Ряды</label>
                    <input
                        type="number"
                        {...register("rows", {
                            required: "Обязательное поле",
                        })}
                        className={cls.input}
                    />
                </div>
                <div className={cls.box}>
                    <label>Форма</label>
                    <select
                        {...register("shape", {
                            required: "Обязательное поле",
                        })}
                        className={cls.input}
                    >
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
                        {...register("size_for_column", {
                            required: "Обязательное поле",
                        })}
                        className={cls.input}
                    />
                </div>
                <div className={cls.box}>
                    <label>Метка</label>
                    <select
                        {...register("mark", {
                            required: "Обязательное поле",
                        })}
                        className={cls.input}
                    >
                        <option value="5х5 L R">5х5 L R</option>
                        <option value="5х5 L">5х5 L</option>
                        <option value="5х5 R">5х5 R</option>
                    </select>
                </div>
                <div className={cls.box}>
                    <label>Высота без 1мм</label>
                    <input
                        type="number"
                        {...register("height_without1", {
                            required: "Обязательное поле",
                        })}
                        className={cls.input}
                    />
                </div>
                <div className={cls.box}>
                    <label>Материал</label>
                    <select
                        {...register("material", {
                            required: "Обязательное поле",
                        })}
                        className={cls.input}
                    >
                        <option value="бумага">Бумага</option>
                        <option value="плёнка">Плёнка</option>
                    </select>
                </div>
                
                <div className={cls.box}>
                    <label>Комментарий</label>
                    <input
                        type="text"
                        {...register("comment")}
                        className={cls.input}
                    />
                </div>
                <div className={cls.box}>
                    <label>Номер заказа</label>
                    <input
                        type="number"
                        {...register("number", {
                            required: "Обязательное поле",
                        })}
                        className={cls.input}
                    />
                </div>
                <button type="submit" className={cls.submitButton}>
                    Добавить
                </button>
            </form>
        </Modal>
    );
};

export default AddRotationForm; 