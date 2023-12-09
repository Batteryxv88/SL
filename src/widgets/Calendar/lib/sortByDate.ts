export function sortByDate(parts: any) {
    if (parts.length === 0) {
        // Если массив пуст, возвращаем его без изменений
        return parts;
    }

    return parts.slice().sort((a: any, b:any) => {
        const dateA = new Date(a.part.date).getTime();
        const dateB = new Date(b.part.date).getTime();
        return dateB - dateA;
    });
}