import { changePage } from "../../../app/providers/StoreProvider/Store/ChangePageSlice";
import { useAppDispatch, useAppSelector } from "../../../app/providers/StoreProvider/Store/hooks";
import AddReplacedPart from "../../../features/ui/AddReplacedPart/AddReplacedPart";
import Calendar from "../../../widgets/Calendar/Calendar";

const SchedulePage = () => {
    const dispatch = useAppDispatch();
    
    dispatch(changePage("schedule")); 

    return (
        <div>
            <AddReplacedPart />
            <Calendar />
        </div>
    );
};

export default SchedulePage;
