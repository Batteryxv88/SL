// interface Toner {
//     color: string;
//     counter: string;
//     man: string;
//     date: string;
//   }
  
//   interface TonerRecord {
//     id: string;
//     toner: Toner;
//   }

//   export const sortTonersByDate = (records: TonerRecord[]): TonerRecord[] => {
//     if (!records || records.length === 0) {
//       return [];
//     }
    
//     // Создаем копию массива перед сортировкой
//     const recordsCopy = [...records];
  
//     return recordsCopy.sort((a, b) => new Date(b.toner.date).getTime() - new Date(a.toner.date).getTime());
//   };

interface Toner {
  color: string;
  counter: string;
  man: string;
  date: string;
  machine: string;
}

interface TonerRecord {
  id: string;
  toner: Toner;
}

export const sortAndFilterToners = (records: TonerRecord[], machine: string): TonerRecord[] => {
  if (!records || records.length === 0) {
    return [];
  }

  // Фильтруем записи по машине
  const filteredRecords = machine
    ? records.filter((record) => record.toner.machine === machine)
    : records;

  // Создаем копию массива перед сортировкой
  const recordsCopy = [...filteredRecords];

  // Сортируем записи по дате в убывающем порядке
  return recordsCopy.sort((a, b) => new Date(b.toner.date).getTime() - new Date(a.toner.date).getTime());
};