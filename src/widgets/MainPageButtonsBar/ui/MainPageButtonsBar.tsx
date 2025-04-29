import cls from './MainPageButtonsBar.module.scss';
import AddPart from '../../../features/ui/AddPart/AddPart';
const MainPageButtonsBar = () => {
    return (
        <div className={cls.MainPageButtonsBar}>
            <AddPart />
            <button className={cls.button}>Аудит</button>
        </div>
    );
};

export default MainPageButtonsBar;
