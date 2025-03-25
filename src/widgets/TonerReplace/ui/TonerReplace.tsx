import cls from './TonerReplace.module.scss'
import { fetchToners } from '../../../app/providers/StoreProvider/Store/TonerSlice';
import { useEffect } from 'react';
import TonerPart from '../../../shared/ui/tonerPart/TonerPart';
import { sortAndFilterToners } from '../lib/sortTonersByDate';
import { useAppDispatch, useAppSelector } from '../../../app/providers/StoreProvider/Store/hooks';


const TonerReplace = () => {

    const dispatch = useAppDispatch();
    const machineTonerState = useAppSelector((state) => state.machines.tonerMachine);

    useEffect(() => {
        dispatch(fetchToners());
    }, [dispatch]);

    const data = useAppSelector(
        (state) => state.toners.tonersArray
    );

    
    const sortedToners = sortAndFilterToners(data, machineTonerState)
    console.log(sortedToners)


    return ( <div className={cls.toners}>
        <h2 className={cls.h2}>{machineTonerState}</h2>
        <div className={cls.box}>
                <p className={cls.color}>Цвет</p>
                <p className={cls.counter}>Счетчик</p>
                <p className={cls.man}>Ответственный</p>
                <p className={cls.date}>Дата</p>
                <p className={cls.delete}>Удалить</p>
            </div>
        {sortedToners.map((item) => (
                <TonerPart
                    color={item.toner.color}
                    counter={item.toner.counter}
                    man={item.toner.man}
                    date={item.toner.date}
                    id={item.id}
                    key={item.id}
                />
            ))}
    </div> );
}
 
export default TonerReplace;