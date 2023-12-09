import cls from './Part.module.scss'

export type PartProps = {
    name: string;
    number: string;
    qty: number;
}

const Part = (props: PartProps) => {

const { name, number, qty } = props

    return ( <div className={cls.part}>
        <p className={cls.name}>{name}</p>
        <p className={cls.number}>{number}</p>
        <p className={cls.qty}>{qty}</p>
    </div> );
}
 
export default Part;