import cls from './HoldersAndKnifesStockPage.module.scss';
import Holder from '../../../shared/assets/icons/holder.svg';
import Knife from '../../../shared/assets/icons/knife.svg';
import EditIcon from '../../../shared/assets/icons/edit-pen.svg';
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
                <div className={cls.holder}>
                <h3 className={cls.holder__title}>Держатели</h3>
                    <div className={cls.holder__info_box}>
                        <div className={cls.holder__icon_box}>
                            <Holder className={cls.holder__icon} />
                        </div>
                        {holdersAndKnifes.map((holder) => (holder.title === 'Держатель') && (
                            <div className={cls.holder__info}>
                                <p className={cls.holder__sub_title}>{holder.sub_title}</p>
                                <div className={cls.holder__qty_box}>
                                    <p className={cls.holder__qty}>{holder.qty}</p>
                                    <EditIcon className={cls.holder__edit_icon} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className={cls.holder}>
                    <h3 className={cls.holder__title}>Ножи</h3>
                    <div className={cls.holder__info_box}>
                        <div className={cls.holder__icon_box}>
                            <Knife className={cls.holder__icon} />
                        </div>
                        {holdersAndKnifes.map((knife) => (knife.title === 'Нож') && (
                            <div className={cls.holder__info}>
                                <p className={cls.holder__sub_title}>{knife.sub_title}</p>
                                <div className={cls.holder__qty_box}>
                                    <p className={cls.holder__qty}>{knife.qty}</p>
                                    <EditIcon className={cls.holder__edit_icon} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default HoldersAndKnifesStockPage;   