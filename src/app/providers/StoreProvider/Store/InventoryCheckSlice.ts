import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { collection, addDoc, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '../../../../services/firebase';
import { getAuth } from 'firebase/auth';

export interface InventoryCheckRecord {
    date: string;
    userName: string;
    userId: string;
}

export interface InventoryCheckState {
    lastCheckDate: string | null;
    showReminder: boolean;
    showModal: boolean;
    reminderPostponed: boolean;
    streak: number;
}

const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
};

const getLocalStorageCheck = () => {
    const storedDate = localStorage.getItem('lastInventoryCheck');
    if (!storedDate) return null;
    
    const storedDateObj = new Date(storedDate);
    const today = new Date();
    return storedDateObj.toDateString() === today.toDateString() ? storedDate : null;
};

const initialState: InventoryCheckState = {
    lastCheckDate: getLocalStorageCheck(),
    showReminder: !getLocalStorageCheck(),
    showModal: !getLocalStorageCheck(),
    reminderPostponed: false,
    streak: 0
};

export const fetchLastInventoryCheck = createAsyncThunk(
    'inventoryCheck/fetchLastCheck',
    async () => {
        // Сначала проверяем LocalStorage
        const localStorageCheck = getLocalStorageCheck();
        if (localStorageCheck) {
            return localStorageCheck;
        }

        // Если в LocalStorage нет, проверяем Firestore
        const auth = getAuth();
        const userId = auth.currentUser?.uid;
        if (!userId) throw new Error('User not authenticated');

        const historyRef = collection(db, 'inventoryCheck');
        const q = query(historyRef, orderBy('date', 'desc'), limit(1));
        const querySnapshot = await getDocs(q);
        
        if (!querySnapshot.empty) {
            const lastCheck = querySnapshot.docs[0].data() as InventoryCheckRecord;
            const lastCheckDate = new Date(lastCheck.date);
            const today = new Date();
            
            // Проверяем, что последняя проверка была сегодня
            if (lastCheckDate.toDateString() === today.toDateString()) {
                // Сохраняем в LocalStorage
                localStorage.setItem('lastInventoryCheck', lastCheck.date);
                return lastCheck.date;
            }
        }
        return null;
    }
);

export const updateInventoryCheck = createAsyncThunk(
    'inventoryCheck/updateCheck',
    async (date: string) => {
        const auth = getAuth();
        const user = auth.currentUser;
        if (!user) throw new Error('User not authenticated');

        // Сохраняем в LocalStorage
        localStorage.setItem('lastInventoryCheck', date);

        // Создаем новую запись в Firestore
        const historyRef = collection(db, 'inventoryCheck');
        await addDoc(historyRef, {
            date,
            userName: user.displayName || 'Unknown',
            userId: user.uid
        });

        return date;
    }
);

const inventoryCheckSlice = createSlice({
    name: 'inventoryCheck',
    initialState,
    reducers: {
        setShowReminder: (state, action) => {
            state.showReminder = action.payload;
        },
        setShowModal: (state, action) => {
            state.showModal = action.payload;
        },
        setReminderPostponed: (state, action) => {
            state.reminderPostponed = action.payload;
        },
        incrementStreak: (state) => {
            state.streak += 1;
        },
        resetStreak: (state) => {
            state.streak = 0;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchLastInventoryCheck.fulfilled, (state, action) => {
                if (action.payload) {
                    state.lastCheckDate = action.payload;
                    state.showReminder = false;
                    state.showModal = false;
                } else {
                    state.showReminder = true;
                    state.showModal = true;
                }
            })
            .addCase(updateInventoryCheck.fulfilled, (state, action) => {
                state.lastCheckDate = action.payload;
                state.showReminder = false;
                state.showModal = false;
                state.reminderPostponed = false;
            });
    }
});

export const {
    setShowReminder,
    setShowModal,
    setReminderPostponed,
    incrementStreak,
    resetStreak
} = inventoryCheckSlice.actions;

export default inventoryCheckSlice.reducer; 