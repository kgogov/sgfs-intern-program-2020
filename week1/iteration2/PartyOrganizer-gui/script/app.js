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

//* Update не работи както трябва защото не минава през CreateParty
//* Да помисля върху горния коментар 
const createParty = (partyObject) => {
    // Тук може да се валидира partyObject
    // Тук е логиката по това как се създава едно парти

    //! Тук мога да сетвам даден стейт

    return {
        ID                  : generateEventID(),
        name                : partyObject.name,
        isUnderAged         : partyObject.isUnderAged,
        isOpen              : partyObject.isOpen,
        date                : partyObject.date,
        entranceFee         : partyObject.entranceFee,
        isFree              : partyObject.entranceFee == '0' ? true : false,
        clientCollection    : []
    };
};


const ClientManager = {
    mainClientCollection : [],

    storeClient(clientObject) {
        ClientManager.mainClientCollection.push(clientObject);
    },

    storeClientToParty(partyObject, clientObject) {
        partyObject.clientCollection.push(clientObject);
    },

    getMainClientCollection() {
        return ClientManager.mainClientCollection;
    },

    getClient(clientIndex) {
        return ClientManager.mainClientCollection[clientIndex];
    }
}


const createClient = (clientObject) => {
    // Валидация
    return {
        ID              : generateClientID(),
        fullName        : clientObject.fullName,
        gender          : clientObject.gender,
        age             : clientObject.age,
        wallet          : clientObject.wallet,
        partyCounter    : 0,
        isVIP           : false
    }
}


// #Utilities
const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
};

// ID Generators
function generateEventID() {
    const hex = (value) => {
        return Math.floor(value).toString(16);
    };

    return hex(Date.now() / 1000) +
    ' '.repeat(16).replace(/./g, () => hex(Math.random() * 16));
}

function generateClientID() {

    const length = 8;
    const timestamp = +new Date();

    const getRandomInt = (min, max) => {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    };

    const generateClientID = () => {
        let ts = timestamp.toString();
        let parts = ts.split("").reverse();
        let id = "";

        for (let i = 0; i < length; ++i) {
            let index = getRandomInt(0, parts.length - 1);
            id += parts[index];
        }

        return id;
    };

    return generateClientID();
}