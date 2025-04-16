import { useEffect, useState } from 'react';
import cls from './LoadingPlug.module.scss';

const LoadingPlug = () => {
    const [isVisible, setIsVisible] = useState(false);
    
    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(true);
        }, 1000);
        
        return () => clearTimeout(timer);
    }, []);
    
    return (
        <div className={`${cls.loadingContainer} ${isVisible ? cls.visible : ''}`}>
            <div className={cls.loadingSpinner} />
            <h2 className={cls.loadingText}>Загрузка...</h2>
        </div>
    )
}

export default LoadingPlug;