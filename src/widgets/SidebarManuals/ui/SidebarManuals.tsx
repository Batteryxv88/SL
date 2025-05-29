import cls from "./SidebarManuals.module.scss";
import ChoiseButton from "../../../shared/ui/ChoiseButton/ChoiseButton";
import { useAppDispatch, useAppSelector } from "../../../app/providers/StoreProvider/Store/hooks";
import { changeManual } from "../../../app/providers/StoreProvider/Store/ChangeManual";

const SidebarManuals = () => {

    const dispatch = useAppDispatch();

    const manualState = useAppSelector((state) => state.manuals.manual);
    console.log(manualState);

    return (
        <div className={cls.sidebar}>
            <ChoiseButton name="label_190" onClick={() => dispatch(changeManual("label_190"))} />
            <ChoiseButton name="label_400" onClick={() => dispatch(changeManual("label_400"))} />
        </div>
    );
};

export default SidebarManuals;
