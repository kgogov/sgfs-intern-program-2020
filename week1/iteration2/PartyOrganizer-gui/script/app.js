// Mock data
const PartyManager = {
    partyCollection : [
        {
            name: 'Asenovgrad',
            isUnderAged: 'yes',
            isOpen: 'yes',
            date: new Date(),
            entranceFee: 0,
            isFree: 'yes'
        },
        {
            name: 'Plovdiv',
            isUnderAged: 'no',
            isOpen: 'yes',
            date: new Date(),
            entranceFee: 15,
            isFree: 'no'
        }
    ],

    storeParty(partyObject) {
        PartyManager.partyCollection.push(partyObject);
    },

    getPartyCollection() {
        return PartyManager.partyCollection;
    },

    getParty(partyIndex) {
        return PartyManager.partyCollection[partyIndex];
    }
};

const createParty = (partyObject) => {
    // Тука влизат проверките от инпутите

    return {
        name                : partyObject.name,
        isUnderAged         : partyObject.isUnderAged,
        isOpen              : partyObject.isOpen,
        date                : partyObject.date,
        entranceFee         : partyObject.entranceFee,
        isFree              : partyObject.entranceFee ? false : true,
    };
};


// Helper function
// function getDateFormat(partyDate) {
//     const date = partyDate;

//     const year = date.getFullYear();
//     const month = date.getMonth() + 1;
//     const day = date.getDate();

//     if (day < 10) {
//         day = '0' + day;
//     }
//     if (month < 10) {
//         month = '0' + month;
//     }

//     return `${day}-${month}-${year}`;
// }

function fixDate(input) {

    const date = new Date(input);

    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day   = ('0' + date.getDate()).slice(-2);
    const year  = date.getFullYear();

    return year + '-' + month + '-' + day;
}