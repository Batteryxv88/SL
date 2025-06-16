import { changeTonerMachine } from "../../../app/providers/StoreProvider/Store/ChangeMachineSlice";
import { useAppDispatch, useAppSelector } from "../../../app/providers/StoreProvider/Store/hooks";
import cls from "./ChoiseButton.module.scss";

interface ChoiseButtonProps {
    name: string;
    onClick: () => void;
    state: string;
}

const ChoiseButton = ({ name, onClick, state }: ChoiseButtonProps) => {


    return (
        <button
            onClick={onClick}
            className={
                state === name ? cls.activeButton : cls.button
            }
        >
            {name}
        </button>
    );
};

export default ChoiseButton;
