export const transformArray = (inputArray: any[]): any[] => {
    let outputArray: any[] = [];

    for (let item of inputArray) {
        let newItem: any = {};
        if (item["machine"]) {
            newItem["аппарат"] = item["machine"];
            newItem["период"] = item["period"];
            newItem["тонер Y"] = item["tonerY"];
            newItem["тонер M"] = item["tonerM"];
            newItem["тонер C"] = item["tonerC"];
            newItem["тонер K"] = item["tonerK"];
        } else if (item["partName"]) {
            newItem["наименование"] = item["partName"];
            newItem["артикул"] = item["partN"];
            newItem["пройденный ресурс"] = item["partLife"];
            newItem["количество"] = item["quantity"];
            newItem["ответственный"] = item["man"];
            newItem["дата"] = item["date"];
            if (item["percent"]) {
                newItem["ресурс в процентах"] = item["percent"];
            }
        }
        outputArray.push(newItem);
    }

    return outputArray;
};