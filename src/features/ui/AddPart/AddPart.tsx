import { useState, useEffect, useRef } from "react";
import cls from "./AddPart.module.scss";
import { addPartToFirestore } from "../../../app/providers/StoreProvider/Store/PartSlice";
import { useAppDispatch } from "../../../app/providers/StoreProvider/Store/hooks";
import { useForm } from "react-hook-form";

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
                <h2 className={cls.modalTitle}>Добавление детали</h2>
                <button className={cls.closeButton} onClick={onClose}>×</button>
                {children}
            </div>
        </div>
    );
};

const AddPart = () => {
    const dispatch = useAppDispatch();
    const [isModalOpen, setIsModalOpen] = useState(false);

    type FormValues = {
        partN: string;
        partName: string;
        quantity: number;
        partLife: number;
        section: string;
    };

    const {
        register,
        formState: { errors },
        handleSubmit,
        reset,
    } = useForm<FormValues>({
        mode: "onChange",
        defaultValues: {
            partN: "",
            partName: "",
            quantity: 0,
            partLife: 0,
            section: ""
        }
    });

    const handleAddPart = (data: FormValues) => {
        dispatch(addPartToFirestore(data));
        reset();
        setIsModalOpen(false);
    };

    const handleCloseModal = () => {
        reset();
        setIsModalOpen(false);
    };

    return (
        <>
            <button 
                className={cls.openModalButton} 
                onClick={() => setIsModalOpen(true)}
            >
                Добавить деталь
            </button>

            <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
                <form
                    className={cls.addPart}
                    onSubmit={handleSubmit(handleAddPart)}
                >
                    <div className={cls.box}>
                        <label className={cls.label}>Артикул</label>
                        <input
                            {...register("partN", {
                                required: "Обязательное поле",
                                minLength: {
                                    value: 5,
                                    message: "Минимум 5 символов",
                                },
                            })}
                            className={cls.input}
                        />
                    </div>
                    <div className={cls.box}>
                        <label className={cls.label}>Наименование</label>
                        <input
                            {...register("partName", {
                                required: "Обязательное поле",
                                minLength: {
                                    value: 3,
                                    message: "Минимум 3 символа",
                                },
                            })}
                            className={cls.input}
                        />
                    </div>
                    <div className={cls.box}>
                        <label className={cls.label}>Срок службы</label>
                        <input
                            {...register("partLife", {
                                required: "Обязательное поле",
                                min: {
                                    value: 0,
                                    message: "Значение должно быть положительным",
                                },
                            })}
                            className={cls.input}
                            type="number"
                        />
                    </div>
                    <div className={cls.box}>
                        <label className={cls.label}>Секция</label>
                        <input
                            {...register("section", {
                                required: "Обязательное поле",
                                minLength: {
                                    value: 2,
                                    message: "Минимум 2 символа",
                                },
                            })}
                            className={cls.input}
                        />
                    </div>
                    <div className={cls.box}>
                        <label className={cls.label}>Кол-во</label>
                        <input
                            {...register("quantity", {
                                required: "Обязательное поле",
                                min: {
                                    value: 0,
                                    message: "Значение должно быть положительным",
                                },
                            })}
                            className={cls.inputQty}
                            type="number"
                        />
                    </div>
                    <button className={cls.button} type="submit">
                        Добавить
                    </button>
                </form>
                <div className={cls.errorContainer}>
                    <div className={`${cls.errMessage} ${Object.keys(errors).length > 0 ? cls.visible : ''}`}>
                        {(errors?.partN && <p>{errors?.partN.message}</p>) ||
                            (errors?.partName && <p>{errors?.partName.message}</p>) ||
                            (errors?.partLife && <p>{errors?.partLife.message}</p>) ||
                            (errors?.section && <p>{errors?.section.message}</p>) ||
                            (errors?.quantity && <p>{errors?.quantity.message}</p>)}
                    </div>
                </div>
            </Modal>
        </>
    );
};

export default AddPart;
