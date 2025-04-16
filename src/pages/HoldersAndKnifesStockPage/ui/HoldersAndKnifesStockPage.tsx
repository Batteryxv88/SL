import cls from './HoldersAndKnifesStockPage.module.scss';
import Holder from '../../../shared/assets/icons/holder.svg';
import Knife from '../../../shared/assets/icons/knife.svg';

const HoldersAndKnifesStockPage = () => {

    const holdersAndKnifes = [
        {
            id: 1,
            title: 'Держатель',
            sub_title: 'Новый',
            qty: 10
        },
        {
            id: 2,
            title: 'Держатель',
            sub_title: 'Старый',
            qty: 20
        },
        {
            id: 3,
            title: 'Нож',
            sub_title: 'Новый',
            qty: 30
        },
        {
            id: 4,
            title: 'Нож',
            sub_title: 'Старый',
            qty: 40
        }
    ]

    return (
        <div className={cls.HoldersAndKnifesStockPage}>
            <h2 className={cls.title}>Склад держателей и ножей</h2>
            <div className={cls.container}>
                {holdersAndKnifes.map((holder) => ( holder.title === 'Держатель' && (
                    <div className={cls.holder} key={holder.id}>
                        <div className={cls.holder__icon}>
                            <Holder className={cls.holder__icon} />
                        </div>
                        <div className={cls.holder__info}>
                            <h3 className={cls.holder__title}>Держатели</h3>
                            <p className={cls.holder__sub_title}>{holder.sub_title}</p>
                            <p className={cls.holder__qty}>{holder.qty}</p>
                        </div>
                    </div>
                )))}
                {holdersAndKnifes.map((knife) => ( knife.title === 'Нож' && (
                    <div className={cls.holder} key={knife.id}>
                        <div className={cls.holder__icon}>
                            <Knife className={cls.holder__icon} />
                        </div>
                        <div className={cls.holder__info}>
                            <h3 className={cls.holder__title}>Ножи</h3>
                            <p className={cls.holder__sub_title}>{knife.sub_title}</p>
                            <p className={cls.holder__qty}>{knife.qty}</p>
                        </div>
                    </div>
                )))}
            </div>
        </div>
    )
}

export default HoldersAndKnifesStockPage;   