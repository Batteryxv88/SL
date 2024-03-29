import cls from "./SidebarReplacePart.module.scss";
import { useAppDispatch, useAppSelector } from "../../../app/providers/StoreProvider/Store/hooks";
import { changeFilter } from "../../../app/providers/StoreProvider/Store/FilterPartSlice";
import { changeMachine } from "../../../app/providers/StoreProvider/Store/ChangeMachineSlice";

const SidebarReplacePart = () => {
    const dispatch = useAppDispatch();
    const machineState = useAppSelector((state) => state.machines.machine);
    const filterState = useAppSelector((state) => state.filteredParts.filter.section)

    return (
        <div>
            <div className={cls.machineWrapper}>
                <button onClick={() => dispatch(changeMachine("C71cf"))} className={machineState === "C71cf"? cls.activeButton: cls.button}>C71cf</button>
                <button onClick={() => dispatch(changeMachine("Label 190"))} className={machineState === "Label 190"? cls.activeButton: cls.button}>Label_190</button>
            </div>

            <ul className={cls.ul}>
                <li
                    className={filterState === 'All'? cls.liActive: cls.li}
                    onClick={() => dispatch(changeFilter("All"))}
                >
                    All
                </li>
                <li
                    className={filterState === 'External section'? cls.liActive: cls.li}
                    onClick={() => dispatch(changeFilter("External section"))}
                >
                    External section
                </li>
                <li
                    className={filterState === 'Photo conductor section'? cls.liActive: cls.li}
                    onClick={() =>
                        dispatch(changeFilter("Photo conductor section"))
                    }
                >
                    Photo conductor section
                </li>
                <li
                    className={filterState === 'Charging section'? cls.liActive: cls.li}
                    onClick={() => dispatch(changeFilter("Charging section"))}
                >
                    Charging section
                </li>
                <li
                    className={filterState === 'Developing section'? cls.liActive: cls.li}
                    onClick={() => dispatch(changeFilter("Developing section"))}
                >
                    Developing section
                </li>
                <li
                    className={filterState === 'Intermediate transfer section'? cls.liActive: cls.li}
                    onClick={() =>
                        dispatch(changeFilter("Intermediate transfer section"))
                    }
                >
                    Intermediate transfer section
                </li>
                <li
                    className={filterState === 'Fusing section'? cls.liActive: cls.li}
                    onClick={() => dispatch(changeFilter("Fusing section"))}
                >
                    Fusing section
                </li>
                <li
                    className={filterState === 'Toner collection section'? cls.liActive: cls.li}
                    onClick={() =>
                        dispatch(changeFilter("Toner collection section"))
                    }
                >
                    Toner collection section
                </li>
                <li
                    className={filterState === 'Paper feed section'? cls.liActive: cls.li}
                    onClick={() => dispatch(changeFilter("Paper feed section"))}
                >
                    Paper feed section
                </li>
                <li
                    className={filterState === 'Paper exit section'? cls.liActive: cls.li}
                    onClick={() => dispatch(changeFilter("Paper exit section"))}
                >
                    Paper exit section
                </li>
            </ul>
        </div>
    );
};

export default SidebarReplacePart;
