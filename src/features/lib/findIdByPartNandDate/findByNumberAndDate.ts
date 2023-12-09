interface Part {
    partN: string;
    section: string;
    partName: string;
    quantity: string;
    date: string;
    man: string;
    serviceLife: string;
  }
  
  interface ArrayItem {
    id: string;
    part: Part;
  }
  
  export function findIdByPartNAndLatestDate(arr: ArrayItem[], partN: string): string | null {
    // Фильтруем массив по номеру partN
    const filteredByPartN = arr.filter(item => item.part.partN === partN);
  
    // Если нет объектов с указанным номером partN, возвращаем null
    if (filteredByPartN.length === 0) {
      return null;
    }
  
    // Сортируем отфильтрованный массив по убыванию даты
    const sortedByDate = filteredByPartN.sort((a, b) => new Date(b.part.date).getTime() - new Date(a.part.date).getTime());
  
    // Получаем id с самой поздней датой
    const idWithLatestDate = sortedByDate[0].id;
  
    return idWithLatestDate;
  }