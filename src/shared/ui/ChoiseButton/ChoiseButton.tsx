import { changeTonerMachine } from "../../../app/providers/StoreProvider/Store/ChangeMachineSlice";
import { useAppDispatch, useAppSelector } from "../../../app/providers/StoreProvider/Store/hooks";
import cls from "./ChoiseButton.module.scss";

interface ChoiseButtonProps {
    name: string;
    onClick: () => void;
}

const ChoiseButton = ({ name, onClick }: ChoiseButtonProps) => {

    const dispatch = useAppDispatch();
    const manualState = useAppSelector((state) => state.manuals.manual);

    return (
        <button
            onClick={onClick}
            className={
                manualState === name ? cls.activeButton : cls.button
            }
        >
            {name}
        </button>
    );
};

export default ChoiseButton;
