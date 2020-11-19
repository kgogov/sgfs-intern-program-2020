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
            isOpen: "yes",
            isUnderAged: "yes",
            name: "Asenovgrad",
        },
        {
            ID: "5fb62ba802fbf8c49a856933",
            clientCollection: [],
            date: "2020-11-20",
            entranceFee: "10",
            isFree: "no",
            isOpen: "no",
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
            isUnderAged: "no",
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
        isUnderAged         : partyObject.isUnderAged,
        isOpen              : partyObject.isOpen,
        date                : partyObject.date,
        entranceFee         : partyObject.entranceFee,
        isFree              : partyObject.entranceFee == '0' ? 'yes' : 'no',
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

// Utility
const isPartyValid = (name, entrance, date) => {

    if (!name     ||
        !date     ||
        !entrance ||
        entrance < 0) {
        return false;
    }
    return true;
}


// Utility
//* идея: да проверя всички имена с RegEx
const isClientValid = (fName, lName, gender, age, wallet) => {

    if (!fName      ||
        !lName      ||
        !gender     ||
        !age        || 
        age < 16    ||
        !wallet     ||
        wallet < 0) {
            return false;
    }
    return true;
}

const prefixPartyNames = (party) => {
    let name = party.name;
    return (party.entranceFee === '0') ? 
        name = `❗ ${name}`             : 
        name = `💲 ${name}`;
}



// Notes:
//* Въпрос: да правя ли function wrapper за всички тези input-и
//* Идея: custom side slider menu with different options and modal forms for sorting etc.
// Друго хубаво упрaжнение: друг файл script-console
// Performance upgrade: implement StringBulder with array with .push() and the join() || toString()