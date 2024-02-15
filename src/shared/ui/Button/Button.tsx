import cls from "./Button.module.scss";

type ButtonProps = {
    name: string;
};

const Button = ({ name }: ButtonProps) => {
    return <button className={cls.button}>{name}</button>;
};

export default Button;
