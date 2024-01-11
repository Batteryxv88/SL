export const filteredAndSortedData = (array: any, filter: string) => {
    // Фильтрация данных
    const filteredData = (filter === "All") ? array : array.filter((item: any) => item.part.section === filter);

    // Сортировка данных
    if (filteredData.length === 0) {
        // Если массив пуст, возвращаем его без изменений
        return filteredData;
    }

    return filteredData.slice().sort((a: any, b: any) => {
        const dateA = new Date(a.part.date).getTime();
        const dateB = new Date(b.part.date).getTime();
        return dateB - dateA;
    });
};