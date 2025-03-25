import cls from "./ChangeButton.module.scss";
import { changeTonerMachine } from "../../../app/providers/StoreProvider/Store/ChangeMachineSlice";

const action = changeTonerMachine("storage");
type ActionType = typeof action;

type ChangeButtonType = {
    name1: string;
    name2: string;
    dispatch1: () => void;
    dispatch2: () => void;
    selector: string;
};

const ChangeButton = (props: ChangeButtonType) => {
    const { name1, name2, dispatch1, dispatch2, selector } = props;
    //const dispatch = useAppDispatch();
    //console.log(selector)

    return (
        <>
            <div className={cls.machineWrapper}>
                <button
                    onClick={dispatch1}
                    className={
                        selector === name1 ? cls.activeButton : cls.button
                    }
                >
                    {name1}
                </button>
                <button
                    onClick={dispatch2}
                    className={
                        selector === name2 ? cls.activeButton : cls.button
                    }
                >
                    {name2}
                </button>
            </div>
        </>
    );
};

export default ChangeButton;
