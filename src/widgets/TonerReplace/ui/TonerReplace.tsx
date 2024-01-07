import { useDispatch, useSelector } from 'react-redux';
import cls from './TonerReplace.module.scss'
import { TonerArray, fetchToners } from '../../../app/providers/StoreProvider/Store/TonerSlice';
import { useEffect } from 'react';
import { AppDispatch } from '../../../app/providers/StoreProvider/Store';

const TonerReplace = () => {

    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
        dispatch(fetchToners());
      }, [dispatch]);

    const data: any = useSelector<any>(
        (state) => state.toners.tonersArray
    );

    console.log(data)

    return ( <></> );
}
 
export default TonerReplace;