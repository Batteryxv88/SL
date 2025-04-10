import cls from "./PaperRollImage.module.scss";


const PaperRollImage = () => {
    return (
        <div className={cls.image}>
            <div className={cls.circle__inner}>
                <div className={cls.circle_sleeve}></div>
            </div>
        </div>
    )
}

export default PaperRollImage;
