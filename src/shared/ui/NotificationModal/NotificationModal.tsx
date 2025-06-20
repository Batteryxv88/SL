import { useEffect, useRef } from 'react';
import cls from './NotificationModal.module.scss';

interface NotificationModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    message: string;
    type?: 'info' | 'warning' | 'error' | 'success';
    autoClose?: boolean;
    autoCloseDelay?: number;
}

const NotificationModal = ({ 
    isOpen, 
    onClose, 
    title, 
    message, 
    type = 'info',
    autoClose = false,
    autoCloseDelay = 5000
}: NotificationModalProps) => {
    const modalRef = useRef<HTMLDivElement>(null);
    const autoCloseTimerRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
                onClose();
            }
        };

        const handleEscapeKey = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
            document.addEventListener('keydown', handleEscapeKey);
            
            // Автоматическое закрытие для успешных уведомлений
            if (autoClose || type === 'success') {
                autoCloseTimerRef.current = setTimeout(() => {
                    onClose();
                }, autoCloseDelay);
            }
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleEscapeKey);
            
            // Очищаем таймер при размонтировании
            if (autoCloseTimerRef.current) {
                clearTimeout(autoCloseTimerRef.current);
                autoCloseTimerRef.current = null;
            }
        };
    }, [isOpen, onClose, autoClose, autoCloseDelay, type]);

    // Очищаем таймер при закрытии модального окна
    useEffect(() => {
        if (!isOpen && autoCloseTimerRef.current) {
            clearTimeout(autoCloseTimerRef.current);
            autoCloseTimerRef.current = null;
        }
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className={cls.modalOverlay}>
            <div className={`${cls.modalContent} ${cls[type]}`} ref={modalRef}>
                <div className={cls.header}>
                    <h3 className={cls.title}>{title}</h3>
                    <button className={cls.closeButton} onClick={onClose}>×</button>
                </div>
                <div className={cls.body}>
                    <p className={cls.message}>{message}</p>
                </div>
                <div className={cls.footer}>
                    <button className={cls.okButton} onClick={onClose}>
                        Понятно
                    </button>
                </div>
            </div>
        </div>
    );
};

export default NotificationModal;