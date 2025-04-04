import { useSelector } from 'react-redux';
import { RootState } from '../../../app/providers/StoreProvider/Store';
import { changePage } from '../../../app/providers/StoreProvider/Store/ChangePageSlice';
import { useAppDispatch } from '../../../app/providers/StoreProvider/Store/hooks';
import cls from './RotationPage.module.scss';
import { useState } from 'react';
import RotationFormTable from '../../../widgets/RotationFormTable/ui/RotationFormTable';
import RotationFormPreview from '../../../widgets/RotationFormPreview/ui/RotationFormPreview';

interface RotationPageProps {
    className?: string;
}

const RotationPage = ({ className }: RotationPageProps) => {

    const dispatch = useAppDispatch();
    dispatch(changePage('rotation'));

    const rotationModule = useSelector((state: RootState) => state.rotationModule.rotationModule);

    return (
        <>
            {rotationModule === 'table' && <RotationFormTable />}
            {rotationModule === 'preview' && <RotationFormPreview />}
        </>
    )
};

export default RotationPage;