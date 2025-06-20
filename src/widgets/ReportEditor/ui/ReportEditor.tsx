import { useEffect, useMemo, useRef } from "react";
import cls from "./ReportEditor.module.scss";
import EditReportPart from "../../../shared/ui/EditReportPart/EditReportPart";
import { useAppDispatch, useAppSelector } from "../../../app/providers/StoreProvider/Store/hooks";
import { fetchParts } from "../../../app/providers/StoreProvider/Store/PartSlice";
import { useQuantityToOrder } from "../../../shared/lib/hooks/useQuantityToOrder";
import { subscribeToQuantityToOrder } from "../../../services/quantityToOrder";

const ReportEditor = () => {
    const dispatch = useAppDispatch();
    const { setOrders, orders } = useQuantityToOrder();
    const subscriptionRef = useRef<(() => void) | null>(null);
    
    // Получаем данные из Parts
    const partsArray = useAppSelector((state) => state.parts.partsArray);

    useEffect(() => {
        // Загружаем данные Parts только один раз
        dispatch(fetchParts());
    }, [dispatch]);

    useEffect(() => {
        // Проверяем, что подписка еще не создана
        if (!subscriptionRef.current) {
            console.log('Creating single quantityToOrder subscription');
            subscriptionRef.current = subscribeToQuantityToOrder((ordersData) => {
                console.log('Orders updated:', ordersData.length, 'items');
                setOrders(ordersData);
            });
        }

        // Cleanup только при размонтировании
        return () => {
            if (subscriptionRef.current) {
                console.log('Cleaning up quantityToOrder subscription');
                subscriptionRef.current();
                subscriptionRef.current = null;
            }
        };
    }, []); // Пустой массив - выполняется только один раз!

    // Мемоизируем объединенные данные
    const reportData = useMemo(() => {
        return partsArray.map((partData: any) => {
            const part = partData.part;
            const partId = partData.id;
            
            // Ищем соответствующую запись в quantityToOrder по partN
            const orderData = orders.find(order => order.PartN === part.partN);
            
            return {
                id: partId,
                name: part.partName,
                number: part.partN,
                qtyStock: part.quantity,
                qtyOrder: orderData?.qty || 0,
                use: orderData?.use || false,
                orderDataId: orderData?.id || null,
                section: part.section || "Other",
            };
        });
    }, [partsArray, orders]);

    // Функция для рендера секции - аналогично Stock
    const renderSection = (section: string) => {
        const filteredData = reportData.filter(
            (item) => item.section === section
        );

        if (filteredData.length === 0) {
            return null;
        }

        return (
            <>
                <h3 className={cls.title}>{section}</h3>
                {filteredData.map((item) => (
                    <EditReportPart
                        key={`${item.id}-${item.number}`}
                        {...item}
                    />
                ))}
            </>
        );
    };

    return (
        <div className={cls.reportEditor}>
            <h2 className={cls.h2}>Редактор отчета для заказа деталей</h2>
            <div className={cls.titleBox}>
                <p className={cls.name}>Наименование</p>
                <p className={cls.number}>Парт номер</p>
                <p className={cls.quantity}>Кол-во на складе</p>
                <div className={cls.editBox}>
                    <p className={cls.edit}>Кол-во для заказа</p>
                    <p className={cls.edit}>Включить в заказ</p>
                    <p className={cls.editMain}>Редактировать</p>
                </div>
            </div>
            {renderSection("External section")}
            {renderSection("Photo conductor section")}
            {renderSection("Charging section")}
            {renderSection("Developing section")}
            {renderSection("Intermediate transfer section")}
            {renderSection("Fusing section")}
            {renderSection("Toner collection section")}
            {renderSection("Paper feed section")}
            {renderSection("Paper exit section")}
            {renderSection("RW-101")}
            {renderSection("Other")}
        </div>
    );
};

export default ReportEditor;