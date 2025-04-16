import cls from './HoldersAndKnifesStockPage.module.scss';
import Holder from '../../../shared/assets/icons/holder.svg';
import Knife from '../../../shared/assets/icons/knife.svg';
import EditIcon from '../../../shared/assets/icons/edit-pen.svg';
import { useHoldersAndKnifes } from '../../../app/providers/StoreProvider/Store/hooks';

const HoldersAndKnifesStockPage = () => {
    const { holdersAndKnifes, isLoading, error } = useHoldersAndKnifes();

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    console.log(holdersAndKnifes);

    return (
        <div className={cls.HoldersAndKnifesStockPage}>
            <h2 className={cls.title}>Склад держателей и ножей</h2>
            <div className={cls.container}>
                <div className={cls.holder}>
                    <Holder className={cls.holder__icon} />
                    <div className={cls.info__container}>
                        <h3 className={cls.holder__title}>Держатели</h3>
                        <div className={cls.map__box}>
                            {holdersAndKnifes.map((item) => (item.type === 'holder') && (
                                <div key={item.id} className={cls.holder__info}>
                                    <p className={cls.holder__sub_title}>{item.sub_type === 'new' ? 'Новый' : 'Старый'}</p>
                                    <div className={cls.holder__qty_box}>
                                        <p className={cls.holder__qty}>{item.qty}</p>
                                        <div className={cls.holder__edit_icon_box}>
                                            <EditIcon className={cls.holder__edit_icon} />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <div className={cls.holder}>
                    <Knife className={cls.holder__icon} />
                    <div className={cls.info__container}>
                        <h3 className={cls.holder__title}>Ножи</h3>
                        <div className={cls.map__box}>
                            {holdersAndKnifes.map((item) => (item.type === 'knife') && (
                                <div key={item.id} className={cls.holder__info}>
                                    <p className={cls.holder__sub_title}>{item.sub_type === 'new' ? 'Новый' : 'Старый'}</p>
                                    <div className={cls.holder__qty_box}>
                                        <p className={cls.holder__qty}>{item.qty}</p>
                                        <div className={cls.holder__edit_icon_box}>
                                            <EditIcon className={cls.holder__edit_icon} />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default HoldersAndKnifesStockPage;   