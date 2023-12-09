const externalSectionList = ['A50U172200', 'A50U172300', 'A50U172100', 'A50U109900', 'A50U164901',
 'A50UR70A12'];
const developingSectionList = ['A50UR70244', 'A3VX600', 'A3VX700', 'A3VX800', 'A3VX900'];
const photoConductorSectionList = ['A5WH0Y0'];
const chargingSection = 'A50UR70323';
const intermediateTransferSectionList = ['A1DUR71C00','A50UR70K22','A50U500401','A1DU504203','A50U501201',
'A50UR70655','65AA26380','A50U505700','A50U531601','A50U520001','A50UR70B00','A50UR70G01','V218060086']
const fusingSectionList = ['A57V720211', 'A50U756300', 'A7X5720100', 'A7X5740100','A50U724102','A03U729500',
'26NA53712','A50U720501','A1UD723500','A03U809500','A50U733712','A50UR73322','A50UM31F00','A50UM31E00',
'A50UR70F00','A50UR70E22']
const tonerCollectionSectionList = ['A50UR70115']
const paperFeedSectionList = ['A7X5601600']
const paperExitSectionList = ['A7X5895400']

export const partsFilter = (part: string) => {
    if (externalSectionList.includes(part))
        return 'External section';
    else if (developingSectionList.includes(part))
        return 'Developing section';
    else if (photoConductorSectionList.includes(part))
        return 'Photo conductor section';
    else if (chargingSection === part)
        return 'Charging section';
    else if (intermediateTransferSectionList.includes(part))
        return 'Intermediate transfer section';
    else if (tonerCollectionSectionList.includes(part))
        return 'Toner collection section';
    else if (fusingSectionList.includes(part))
        return 'Fusing section';
    else if (paperFeedSectionList.includes(part))
        return 'Paper feed section';
    else if (paperExitSectionList.includes(part))
        return 'Paper exit section';
    else
        return 'Unknown section';
};


