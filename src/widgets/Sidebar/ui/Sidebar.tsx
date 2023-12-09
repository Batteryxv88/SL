import cls from "./Sidebar.module.scss";

const Sidebar = () => {
    return (
        <div className={cls.sidebar}>
            <ul className={cls.ul}>
                <li className={cls.li}>All</li>
                <li className={cls.li}>External section</li>
                <li className={cls.li}>Photo conductor section</li>
                <li className={cls.li}>Charging section</li>
                <li className={cls.li}>Developing section</li>
                <li className={cls.li}>Intermediate transfer section</li>
                <li className={cls.li}>Fusing section</li>
                <li className={cls.li}>Toner collection section</li>
                <li className={cls.li}>Paper feed section</li>
                <li className={cls.li}>Paper exit section</li>
            </ul>
        </div>
    );
};

export default Sidebar;
