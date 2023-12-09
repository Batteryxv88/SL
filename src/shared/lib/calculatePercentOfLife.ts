export const lifePercent = (partNumber: any, array: any, life: any): number => {
    if (array.length <= 0 || !life) {
        return 0;
    } else {
        const LifeOfPart = array.filter((item: any) => {
            return item.part.partN === partNumber;
        });

        // Проверка на наличие ключа partLife
        if (LifeOfPart[0]?.part?.partLife) {
            const lifePercent = Math.round(
                (life * 100) / LifeOfPart[0].part.partLife
            );
            return lifePercent;
        } else {
            // Обработка ситуации, когда ключ partLife отсутствует
            return 0;
        }
    }
};