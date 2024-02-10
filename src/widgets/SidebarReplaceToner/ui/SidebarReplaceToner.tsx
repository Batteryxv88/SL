import { useAppDispatch, useAppSelector } from "../../../app/providers/StoreProvider/Store/hooks";
import cls from './SidebarReplaceToner.module.scss'
import { changeMachine, changeTonerMachine } from "../../../app/providers/StoreProvider/Store/ChangeMachineSlice";

const SidebarReplaceToner = () => {

    const dispatch = useAppDispatch();
    const machineState = useAppSelector((state) => state.machines.tonerMachine);
    

    return (
        <>
            <div className={cls.machineWrapper}>
                <button
                    onClick={() => dispatch(changeTonerMachine("C71cf"))}
                    className={
                        machineState === "C71cf" ? cls.activeButton : cls.button
                    }
                >
                    C71cf
                </button>
                <button
                    onClick={() => dispatch(changeTonerMachine("Label 190"))}
                    className={
                        machineState === "Label 190"
                            ? cls.activeButton
                            : cls.button
                    }
                >
                    Label_190
                </button>
            </div>
        </>
    );
};

export default SidebarReplaceToner;
