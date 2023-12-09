import { useState, useEffect } from "react";


export async function currentDate () {
    const [date, setDate] = useState(1)

     useEffect(() => {
         fetch('http://worldtimeapi.org/api/timezone/Europe/Moscow')
          .then((res) => {
            return res.json();
          })
          .then((date) => setDate(date.datetime))
          .catch((err) => {
            console.log('Ошибка. Запрос не выполнен: ', err);
          });
          
      }, []);

      return date;   
}
