import cls from "./ChangeButton.module.scss";
import { changeTonerMachine } from "../../../app/providers/StoreProvider/Store/ChangeMachineSlice";

const action = changeTonerMachine("storage");
type ActionType = typeof action;

type ChangeButtonType = {
    name1: string;
    name2: string;
    name3: string;
    name4: string;
    name5: string;
    dispatch1: () => void;
    dispatch2: () => void;
    dispatch3: () => void;
    dispatch4: () => void;
    dispatch5: () => void;
    selector: string;
};

const ChangeButton = (props: ChangeButtonType) => {
    const { name1, name2, name3, name4, name5, dispatch1, dispatch2, dispatch3, dispatch4, dispatch5, selector } = props;
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
                <button
                    onClick={dispatch3}
                    className={
                        selector === name3 ? cls.activeButton : cls.button
                    }
                >
                    {name3}
                </button>
                <button
                    onClick={dispatch4}
                    className={
                        selector === name4 ? cls.activeButton : cls.button
                    }
                >
                    {name4}
                </button>
                <button
                    onClick={dispatch5}
                    className={
                        selector === name5 ? cls.activeButton : cls.button
                    }
                >
                    {name5}
                </button>
            </div>
        </>
    );
};

export default ChangeButton;
