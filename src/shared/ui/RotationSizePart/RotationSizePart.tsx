import cls from './RotationSizePart.module.scss';
import { RectangleIcon, SquareIcon, CircleIcon, OvalIcon, CustomShapeIcon } from '../../assets/icons/shapes';
import EditPenIcon  from '../../assets/icons/edit-pen.svg';

type RotationSizePartProps = {
    id: number;
    height: number;
    width: number;
    rows: number;
    shape: string;
    size_for_column: number;
    mark: string;
    height_without1: number;
    material: string;
    columns: number;
    comment: string;
    number: number;
}

const RotationSizePart = (props: RotationSizePartProps) => {
    const { id, height, width, rows, shape, size_for_column, mark, height_without1, material, columns, comment, number } = props;
    
    const getShapeIcon = () => {
        switch (shape.toLowerCase()) {
            case 'прямоугольник':
                return <RectangleIcon />;
            case 'квадрат':
                return <SquareIcon />;
            case 'круг':
                return <CircleIcon />;
            case 'овал':
                return <OvalIcon />;
            case 'фигурная':
                return <CustomShapeIcon />;
            default:
                return <RectangleIcon />;
        }
    };
    
    return (
        <div className={cls.RotationSizePart}>
            <div className={cls.sizesContainer}>
                <p className={cls.name}>{height}</p>
                <span>×</span>
                <p className={cls.name}>{width}</p>
            </div>
            <p className={cls.name}>{columns}</p>
            <p className={cls.name}>{rows}</p>
            <div className={cls.nameShape}>
                {getShapeIcon()}
            </div>
            <p className={cls.name}>{size_for_column}</p>
            <p className={cls.name}>{mark}</p>
            <p className={cls.heightWithout1mm}>{height_without1}</p>
            <p className={cls.nameMaterial}>{material}</p>
            <p className={cls.nameComment}>{comment}</p>
            <p className={cls.name}>{number}</p>
            <div className={cls.editContainer}>
                <EditPenIcon 
                    className={cls.editPenIcon}
                />
            </div>
        </div>
    );
};

export default RotationSizePart;