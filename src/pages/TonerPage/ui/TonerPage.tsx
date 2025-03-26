import { changePage } from "../../../app/providers/StoreProvider/Store/ChangePageSlice";
import { useAppDispatch } from "../../../app/providers/StoreProvider/Store/hooks";
import AddToner from "../../../features/ui/AddToner/AddToner";
import { TonerReplace } from "../../../widgets/TonerReplace";
import cls from "./TonerPage.module.scss";

const TonerPage = () => {

const dispatch = useAppDispatch()

dispatch(changePage('toner'))

    return ( <div className={cls.TonerPage}>
        <AddToner />
        <TonerReplace />
    </div> );
}
 
export default TonerPage;