import { useDispatch, useSelector } from 'react-redux';
import cls from './TonerReplace.module.scss'
import { TonerArray, fetchToners } from '../../../app/providers/StoreProvider/Store/TonerSlice';
import { useEffect } from 'react';
import { AppDispatch } from '../../../app/providers/StoreProvider/Store';
import TonerPart from '../../../shared/ui/tonerPart/TonerPart';

const TonerReplace = () => {

    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
        dispatch(fetchToners());
      }, [dispatch]);

    const data: any = useSelector<any>(
        (state) => state.toners.tonersArray
    );


    return ( <div className={cls.toners}>
        <div className={cls.box}>
                <p className={cls.color}>Цвет</p>
                <p className={cls.counter}>Счетчик</p>
                <p className={cls.man}>Ответственный</p>
                <p className={cls.date}>Дата</p>
            </div>
        {data.map((item: any) => (
                <TonerPart
                    color={item.toner.color}
                    counter={item.toner.counter}
                    man={item.toner.man}
                    date={item.toner.date}
                    key={item.id}
                />
            ))}
    </div> );
}
 
export default TonerReplace;