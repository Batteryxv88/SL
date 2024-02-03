import { changePage } from "../../../app/providers/StoreProvider/Store/ChangePageSlice";
import { useAppDispatch } from "../../../app/providers/StoreProvider/Store/hooks";
import AddToner from "../../../features/ui/AddToner/AddToner";
import { TonerReplace } from "../../../widgets/TonerReplace";

const TonerPage = () => {

const dispatch = useAppDispatch()

dispatch(changePage('toner'))

    return ( <div>
        <AddToner />
        <TonerReplace />
    </div> );
}
 
export default TonerPage;