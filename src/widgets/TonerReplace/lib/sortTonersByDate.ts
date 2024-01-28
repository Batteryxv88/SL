interface Toner {
    color: string;
    counter: string;
    man: string;
    date: string;
  }
  
  interface TonerRecord {
    id: string;
    toner: Toner;
  }

  export const sortTonersByDate = (records: TonerRecord[]): TonerRecord[] => {
    if (!records || records.length === 0) {
      return [];
    }
    
    // Создаем копию массива перед сортировкой
    const recordsCopy = [...records];
  
    return recordsCopy.sort((a, b) => new Date(b.toner.date).getTime() - new Date(a.toner.date).getTime());
  };