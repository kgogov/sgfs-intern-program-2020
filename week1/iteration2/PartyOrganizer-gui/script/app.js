// Configuration

let isPartyCreationAllowed = true;
let isClientCreationAllowed = true;


function getPartyCreationState() {
    return isPartyCreationAllowed;
}

function getClientCreationState() {
    return isClientCreationAllowed;
}

const PartyManager = {
    // Mock data
    partyCollection : [
        {
            ID: "5fb62ba802fbf8c69a856933",
            clientCollection: [],
            date: "2020-11-20",
            entranceFee: "10",
            isFree: "no",
            isOpen: "yes",
            isUnderAged: "no",
            name: "Plovdiv",
        },
        {
            ID: "5fb62ba802fbf8c59a856933",
            clientCollection: [],
            date: "2020-11-20",
            entranceFee: "0",
            isFree: "yes",
            isOpen: "no",
            isUnderAged: "yes",
            name: "Asenovgrad",
        },
        {
            ID: "5fb62ba802fbf8c49a856933",
            clientCollection: [],
            date: "2020-11-20",
            entranceFee: "10",
            isFree: "no",
            isOpen: "yes",
            isUnderAged: "no",
            name: "Sofia",
        },
        {
            ID: "5fb62ba802fbf8c39a856933",
            clientCollection: [],
            date: "2020-11-20",
            entranceFee: "10",
            isFree: "no",
            isOpen: "yes",
            isUnderAged: "yes",
            name: "Burgas",
        },
        {
            ID: "5fb62ba802fbf8c29a856933",
            clientCollection: [],
            date: "2020-11-20",
            entranceFee: "0",
            isFree: "yes",
            isOpen: "yes",
            isUnderAged: "yes",
            name: "Primorsko",
        },
        {
            ID: "5fb62ba802fbf8c19a856933",
            clientCollection: [],
            date: "2020-11-20",
            entranceFee: "25",
            isFree: "no",
            isOpen: "no",
            isUnderAged: "no",
            name: "Varna",
        },
        {
            ID: "5fb62ba802fbf8c09a856933",
            clientCollection: [],
            date: "2020-11-20",
            entranceFee: "5",
            isFree: "no",
            isOpen: "yes",
            isUnderAged: "no",
            name: "Stara Zagora",
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
            ID: "24207427",
            age: "22",
            fullName: "Konstantin Gogov",
            gender: "male",
            isVIP: false,
            partyCounter: 0,
            wallet: "100"
        },
        {
            ID: "24205427",
            age: "17",
            fullName: "Kristina Ivanova",
            gender: "female",
            isVIP: false,
            partyCounter: 0,
            wallet: "50"
        },
        {
            ID: "24206427",
            age: "24",
            fullName: "Petur Panayotov",
            gender: "prefer not to say",
            isVIP: false,
            partyCounter: 0,
            wallet: "50"
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

    return {
        ID                  : generateEventID(),
        name                : partyObject.name,
        isUnderAged         : partyObject.isUnderAged === 'true' ? 'yes' : 'no',
        isOpen              : partyObject.isOpen,
        date                : partyObject.date,
        entranceFee         : partyObject.entranceFee,
        isFree              : partyObject.entranceFee === '0' ? 'yes' : 'no',
        clientCollection    : []
    };
};

const createClient = (clientObject) => {

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