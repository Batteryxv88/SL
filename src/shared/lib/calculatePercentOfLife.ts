
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

export const lifePercent = (partNumber: any, array: any, life: any): number => {
    if (array.length <= 0 || !life) {
        return 0;
    } else {
        // const LifeOfPart = array.filter((item: any) => {
        //     return item.part.partN === partNumber;
        // });

        const LifeOfPart = array.filter((item: any) => {
            if (sameColorParts.includes(partNumber)) {
                return item.part.partN === partNumber.slice(0, -1);
            }
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