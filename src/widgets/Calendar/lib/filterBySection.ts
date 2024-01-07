export const filteredDataBySection = (array: any, filter: string) => {
    if (filter === "All") {
        return array;
    } else {
        const filteredData = array.filter(
            (item: any) => item.part.section === filter
        );
        return filteredData;
    }
};