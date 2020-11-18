const PartyManager = {
    // Mock data
    partyCollection : [
        {
            ID: "5fb3e8e9afc1cfd2a349231b",
            clientCollection: [],
            date: "2020-11-19",
            entranceFee: 20,
            isFree: "yes",
            isOpen: "yes",
            isUnderAged: "yes",
            name: "Asenovgrad"
        },
        {
            ID: "5fb3e8e9afc1cfd2a345231a",
            clientCollection: [],
            date: "2020-12-19",
            entranceFee: 20,
            isFree: "yes",
            isOpen: "yes",
            isUnderAged: "yes",
            name: "Plovdiv"
        },
        {
            ID: "5fb3e8e9afc1cfd2a342231a",
            clientCollection: [],
            date: "2020-12-19",
            entranceFee: 20,
            isFree: "yes",
            isOpen: "yes",
            isUnderAged: "yes",
            name: "Sofia"
        },
        {
            ID: "5fb3e8e9afc1cfd2a345251a",
            clientCollection: [],
            date: "2020-12-19",
            entranceFee: 20,
            isFree: "yes",
            isOpen: "no",
            isUnderAged: "yes",
            name: "Primorsko"
        },
        {
            ID: "5fb3e7e9afc1cfd2a345231a",
            clientCollection: [],
            date: "2020-12-19",
            entranceFee: 20,
            isFree: "yes",
            isOpen: "yes",
            isUnderAged: "yes",
            name: "Varna"
        },
        {
            ID: "5fb3e8e9afc1cfd21345231a",
            clientCollection: [],
            date: "2020-12-19",
            entranceFee: 20,
            isFree: "yes",
            isOpen: "yes",
            isUnderAged: "yes",
            name: "Burgas"
        },
        {
            ID: "5fb3e8@9afc1cfd2a345231a",
            clientCollection: [],
            date: "2020-12-19",
            entranceFee: 20,
            isFree: "yes",
            isOpen: "yes",
            isUnderAged: "yes",
            name: "Stara Zagora"
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

const ClientManager = {
    // Mock data
    mainClientCollection : [
        {
            ID: "45325665",
            age: "23",
            fullName: "Konstantin Gogov",
            gender: "male",
            isVIP: false,
            partyCounter: 0,
            wallet: 1000
        },
        {
            ID: "45125265",
            age: "23",
            fullName: "Ivana Ivanova",
            gender: "female",
            isVIP: false,
            partyCounter: 0,
            wallet: 1000
        },
        {
            ID: "45585265",
            age: "23",
            fullName: "Rosica Pencheva",
            gender: "female",
            isVIP: false,
            partyCounter: 0,
            wallet: 1000
        },
        {
            ID: "455250265",
            age: "23",
            fullName: "Panayot Panayotov",
            gender: "prefer not to say",
            isVIP: false,
            partyCounter: 0,
            wallet: 1000
        }
    ],

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


const createParty = (partyObject) => {

    //! Тук сетвам даден стейт спрамо стойността на пропъртито

    return {
        ID                  : generateEventID(),
        name                : partyObject.name,
        isUnderAged         : partyObject.isUnderAged,
        isOpen              : partyObject.isOpen,
        date                : partyObject.date,
        entranceFee         : partyObject.entranceFee,
        isFree              : partyObject.entranceFee === 0 ? 'yes' : 'no',
        clientCollection    : []
    };
};

const createClient = (clientObject) => {

    //! Тук сетвам даден стейт спрамо стойността на клиента

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

// Utility
const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
};

// Utility
const checkIfIDExists = (collection, id) => {
    return collection.find(item => item.ID == id);
};