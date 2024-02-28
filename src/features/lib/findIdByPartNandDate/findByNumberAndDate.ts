interface Part {
    partN: string;
    section: string;
    partName: string;
    quantity: string;
    date: string;
    man: string;
    serviceLife: string;
    machine: string;
  }
  
  interface ArrayItem {
    id: string;
    part: Part;
  }

  const sameColorParts = [
    "A5WH0Y0C",
    "A5WH0Y0M",
    "A5WH0Y0Y",
    "A5WH0Y0K",
    "A50UR70323C",
    "A50UR70323M",
    "A50UR70323Y",
    "A50UR70323K",
    "A50UR70244C",
    "A50UR70244M",
    "A50UR70244Y",
    "A50UR70244K",
];
  
  // export function findIdByPartNAndLatestDate(arr: ArrayItem[], partN: string, machine: string): string | null {
  //   // Фильтруем массив по номеру partN
  //   // const filteredByPartN = arr.filter(item => item.part.partN === partN);
  //   const filteredByPartN = arr.filter((item: any) => {
  //     if (sameColorParts.includes(partN)) {
  //         return item.part.partN === partN.slice(0, -1) && item.part.machine === machine;
  //     }
  //     return item.part.partN === partN;
  // });
  
  //   // Если нет объектов с указанным номером partN, возвращаем null
  //   if (filteredByPartN.length === 0) {
  //     return null;
  //   }
  
  //   // Сортируем отфильтрованный массив по убыванию даты
  //   const sortedByDate = filteredByPartN.sort((a, b) => new Date(b.part.date).getTime() - new Date(a.part.date).getTime());
  
  //   // Получаем id с самой поздней датой
  //   const idWithLatestDate = sortedByDate[0].id;
  
  //   return idWithLatestDate;
  // }
  ////////////////////////////////////////////////////////////////


  // export function findIdByPartNAndLatestDate(arr: ArrayItem[], partN: string, machine: string): string | null {
  //   // Фильтруем массив по номеру partN и машине
  //   const filteredByPartNAndMachine = arr.filter((item) => {
  //     if (sameColorParts.includes(partN)) {
  //       return item.part.partN === partN.slice(0, -1) && item.part.machine === machine;
  //     }
  //     return item.part.partN === partN && item.part.machine === machine;
  //   });

  //   console.log("function" + filteredByPartNAndMachine)
  
  //   // Если нет объектов с указанным номером partN и машиной, возвращаем null
  //   if (filteredByPartNAndMachine.length === 0) {
  //     return null;
  //   }
  
  //   // Сортируем отфильтрованный массив по убыванию даты
  //   const sortedByDate = filteredByPartNAndMachine.sort(
  //     (a, b) => new Date(b.part.date).getTime() - new Date(a.part.date).getTime()
  //   );
  
  //   // Получаем id с самой поздней датой
  //   const idWithLatestDate = sortedByDate[0].id;
  
  //   return idWithLatestDate;
  // }



  ////////////////////////////////////////////////////////

  // Функция для форматирования номера
// function formatPartN(partN: string): string {
//   return sameColorParts.includes(partN) ? partN.slice(0, -1) : partN;
// }


/////////////////////////////////////////////////////////////////////////////////////////////
// export function findIdByPartNAndLatestDate(arr: ArrayItem[], partN: string, machine: string): string | null {
//   // Создаем регулярное выражение для сравнения номера
//   const regex = sameColorParts.includes(partN) ? new RegExp(`^${partN.slice(0, -1)}.*$`) : new RegExp(`^${partN}$`);

//   // Фильтруем массив по номеру partN и машине
//   const filteredByPartNAndMachine = arr.filter((item) => {
//       return regex.test(item.part.partN) && item.part.machine === machine;
//   });

//   // Если нет объектов с указанным номером partN и машиной, возвращаем null
//   if (filteredByPartNAndMachine.length === 0) {
//       return null;
//   }

//   // Сортируем отфильтрованный массив по убыванию даты
//   const sortedByDate = filteredByPartNAndMachine.sort(
//       (a, b) => new Date(b.part.date).getTime() - new Date(a.part.date).getTime()
//   );

//   // Получаем id с самой поздней датой
//   const idWithLatestDate = sortedByDate[0].id;

//   return idWithLatestDate;
// }


// export function findIdByPartNAndLatestDate(arr: ArrayItem[], partN: string, machine: string): string | null {
//   // Определяем, является ли номер детали из массива sameColorParts
//   const isSameColorPart = sameColorParts.includes(partN);

//   // Фильтруем массив по номеру partN и машине
//   const filteredByPartNAndMachine = arr.filter((item) => {
//       if (isSameColorPart) {
//           return item.part.partN.startsWith(partN.slice(0, -1)) && item.part.machine === machine;
//       }
//       return item.part.partN === partN && item.part.machine === machine;
//   });

//   // Если нет объектов с указанным номером partN и машиной, возвращаем null
//   if (filteredByPartNAndMachine.length === 0) {
//       return null;
//   }

//   // Сортируем отфильтрованный массив по убыванию даты
//   const sortedByDate = filteredByPartNAndMachine.sort(
//       (a, b) => new Date(b.part.date).getTime() - new Date(a.part.date).getTime()
//   );

//   // Получаем id с самой поздней датой
//   const idWithLatestDate = sortedByDate[0].id;

//   return idWithLatestDate;


export function findIdByPartNAndLatestDate(arr: ArrayItem[], partN: string, machine: string): string | null {
  // Определяем, является ли номер детали из массива sameColorParts
  const isSameColorPart = sameColorParts.includes(partN);

  // Фильтруем массив по номеру partN и машине
  const filteredByPartNAndMachine = arr.filter((item) => {
    if (isSameColorPart) {
      return item.part.partN.startsWith(partN) && item.part.machine === machine;
    }
    return item.part.partN === partN && item.part.machine === machine;
  });

  // Если нет объектов с указанным номером partN и машиной, возвращаем null
  if (filteredByPartNAndMachine.length === 0) {
    return null;
  }

  // Сортируем отфильтрованный массив по убыванию даты
  const sortedByDate = filteredByPartNAndMachine.sort(
    (a, b) => new Date(b.part.date).getTime() - new Date(a.part.date).getTime()
  );

  // Получаем id с самой поздней датой
  const idWithLatestDate = sortedByDate[0].id;

  return idWithLatestDate;
}