import { useDispatch } from "react-redux";
import cls from "./Sidebar.module.scss";
import { changeFilter } from "../../../app/providers/StoreProvider/Store/FilterPartSlice";

const Sidebar = () => {
    const dispatch = useDispatch<any>();

    return (
        <div className={cls.sidebar}>
            <ul className={cls.ul}>
                <li
                    className={cls.li}
                    onClick={() => dispatch(changeFilter("All"))}
                >
                    All
                </li>
                <li
                    className={cls.li}
                    onClick={() => dispatch(changeFilter("External section"))}
                >
                    External section
                </li>
                <li
                    className={cls.li}
                    onClick={() =>
                        dispatch(changeFilter("Photo conductor section"))
                    }
                >
                    Photo conductor section
                </li>
                <li
                    className={cls.li}
                    onClick={() => dispatch(changeFilter("Charging section"))}
                >
                    Charging section
                </li>
                <li
                    className={cls.li}
                    onClick={() => dispatch(changeFilter("Developing section"))}
                >
                    Developing section
                </li>
                <li
                    className={cls.li}
                    onClick={() =>
                        dispatch(changeFilter("Intermediate transfer section"))
                    }
                >
                    Intermediate transfer section
                </li>
                <li
                    className={cls.li}
                    onClick={() => dispatch(changeFilter("Fusing section"))}
                >
                    Fusing section
                </li>
                <li
                    className={cls.li}
                    onClick={() =>
                        dispatch(changeFilter("Toner collection section"))
                    }
                >
                    Toner collection section
                </li>
                <li
                    className={cls.li}
                    onClick={() => dispatch(changeFilter("Paper feed section"))}
                >
                    Paper feed section
                </li>
                <li
                    className={cls.li}
                    onClick={() => dispatch(changeFilter("Paper exit section"))}
                >
                    Paper exit section
                </li>
            </ul>
        </div>
    );
};

export default Sidebar;
