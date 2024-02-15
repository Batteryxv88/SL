export function formatDatesInArray(dataArray: any) {
    // Проходимся по каждому элементу массива
    for (let i = 0; i < dataArray.length; i++) {
        let item = dataArray[i];

        // Если у элемента есть свойство "date" с датой
        if (item.hasOwnProperty('date')) {
            let dateObject = new Date(item.date);

            // Извлекаем год, месяц и число
            let year = dateObject.getFullYear();
            let month = dateObject.getMonth() + 1; // Месяцы в JavaScript начинаются с 0
            let day = dateObject.getDate();

            // Форматируем дату и заменяем исходное свойство
            item.date = `${year}-${month < 10 ? '0' : ''}${month}-${day < 10 ? '0' : ''}${day}`;
        }
    }

    return dataArray;
}
