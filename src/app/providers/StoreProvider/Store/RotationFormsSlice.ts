import { createSlice } from "@reduxjs/toolkit";

const data = [
    {
        id: 1,
        height: 25,
        width: 25,
        columns: 8,
        shape: "квадрат",
        size_for_column: 12,
        mark: "5х5 L R",
        height_without1: 231,
        material: "бумага",
        rows: 8,
        comment: "УАИ СИ, кругление 1, 1/2 шт",
        number: 32661
    },
    {
        id: 2,
        height: 25,
        width: 12,
        columns: 10,
        shape: "прямоугольник",
        size_for_column: 12,
        mark: "5х5 L R",
        height_without1: 275,
        material: "плёнка",
        rows: 4,
        comment: "скругление 2 ЗАКАЗ РТБ",
        number: 98336
    },
    {
        id: 3,
        height: 45,
        width: 16,
        columns: 12,
        shape: "круг",
        size_for_column: 16,
        mark: "5х5 L",
        height_without1: 342,
        material: "плёнка",
        rows: 7,
        comment: "",
        number: 82711
    },
    {
        id: 4,
        height: 210,
        width: 148,
        rows: 2,
        shape: "овал",
        size_for_column: 148,
        mark: "5х5 R",
        height_without1: 427,
        material: "плёнка",
        columns: 2,
        comment: "",
        number: 84367
    }, 
    {
        id: 5,
        height: 210,
        width: 148,
        rows: 2,
        shape: "фигурная",
        size_for_column: 148,
        mark: "5х5 L R",
        height_without1: 427,
        material: "плёнка",
        columns: 2,
        comment: "",
        number: 84367
    }
];

const RotationFormsSlice = createSlice({
    name: 'RotationFormsSlice',
    initialState: {
        rotationForms: data
    },

    reducers: {
        setRotationForms(state, action) {
            state.rotationForms = [...state.rotationForms, action.payload];
        }
    }
})

export default RotationFormsSlice.reducer
export const {setRotationForms} = RotationFormsSlice.actions
