// Mock data
const PartyManager = {
    partyCollection : [],

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
    // Тук може да се валидира partyObject

    return {
        ID                  : generateEventID(),
        name                : partyObject.name,
        isUnderAged         : partyObject.isUnderAged,
        isOpen              : partyObject.isOpen,
        date                : partyObject.date,
        entranceFee         : partyObject.entranceFee,
        isFree              : partyObject.entranceFee ? false : true,
    };
};


// Helpers
function generateEventID() {
    const hex = (value) => {
        return Math.floor(value).toString(16);
    };

    return hex(Date.now() / 1000) +
    ' '.repeat(16).replace(/./g, () => hex(Math.random() * 16));
}