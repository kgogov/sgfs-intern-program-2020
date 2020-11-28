const ADULT_AGE = 18;
const MIN_AGE_TO_PARTY = 12;
const MIN_CASH = 10; // bgn
// Main Storage
let partiesCollection = [];

// global togglers
let isPartyCreationAllowed = true;
let isClientCreationAllowed = true;

function getPartiesCollection() {
    return partiesCollection;
}

function getAdultAge() {
    return ADULT_AGE;
}

function getMinAge() {
    return MIN_AGE_TO_PARTY;
}

function getMinCash() {
    return MIN_CASH;
}

function MessagesWrapper() {
    return {
        objCreationEnabled() {
            console.log('%cObject instantiation enabled!',
                'background-color: #00cc00; color: #000');
        },
        objCreationDisabled() {
            console.log('%cObject instantiation disabled!',
                'background-color: #961209;');
        },
        partyReservationEnabled() {
            console.log(`%cReservations are turned on!`,
                'background-color: #00cc00; color: #000');
        },
        partyReservationDisabled() {
            console.log(`%cReservations are turned off!`,
                'background-color: #961209;');
        },
        partyReservationWarning() {
            console.log('%cCannot add clients yet. Please turn on reservation!',
                'background-color: #F76300');
        },
        noActiveParties() {
            console.log('%cThere are no events!',
                'background-color: #F76300');
        },
        invalidClientObject() {
            console.log('%cPlease add valid client object!',
                'background-color: #F76300');
        },
        duplicateClientWarning() {
            console.log('%cYou cannot add same client to the event!',
                'background-color: #F76300');
        },
        underAgedClientWarning() {
            console.log('%cYou cannot sign for this party! Please look for other events!',
                'background-color: #F76300');
        },
        successfullyAddedClient() {
            console.log(`%cClient added successfully!`,
                'background-color: #00cc00; color: #000');
        },
        successfullyRemovedClient() {
            console.log(`%cClient was successfully removed!`,
                'background-color: #00cc00; color: #000');
        },
        unsuccessfullyClientRemoval() {
            console.log('%cClient with such ID was not found!',
                'background-color: #F76300');
        },
        verifyCreationWarning() {
            console.log('%cPlease try again with correct arguments!',
                'background-color: #F76300');
        },
        noClientsWarning() {
            console.log('%cThere are no clients!',
                'background-color: #F76300');
        },
        successfullyRemovedEvent() {
            console.log(`%cParty was successfully deleted!`,
                'background-color: #00cc00; color: #000');
        },
        unsuccessfullyEventRemoval() {
            console.log('%cEvent with such ID was not found!',
                'background-color: #F76300');
        },
        invalidDateFormat() {
            console.log('%cPlease insert date in format: MM-DD-YYYY',
                'background-color: #F76300');
        },
        notEnoughFunds() {
            console.log('%cNot enough funds! Go to work or see another event!',
                'background-color: #F76300');
        }
    }
}

function Party(partyName, date, isSuitableForMinors = true, entranceFee = '') {

    if (!isPartyCreationAllowed) {
        (message.objCreationDisabled()); return;
    }

    verifyPartyCreation(partyName, date, isSuitableForMinors);

    let party = Object.create(Party.prototype);

    party.ID                    = generateEventID()
    party.partyName             = partyName;
    party.isSuitableForMinors   = isSuitableForMinors;
    party.isOpenForReservations = true;
    party.clientsCollection     = [];
    party.date                  = new Date(date);
    party.entranceFee           = entranceFee;
    party.isFree                = entranceFee ? false : true;

    getPartiesCollection().push(party);

    return party;
}

const verifyPartyCreation = function(name, date, flag) {

    if (!(isStringValid(name) &&
            isDateValid(date) &&
            isBoolValid(flag))) {
        message.verifyCreationWarning(); return;
    }
    return true;
};

// Global Togglers
const togglePartyCreation = () => {
    isPartyCreationAllowed = !isPartyCreationAllowed;

    return (isPartyCreationAllowed)    ? 
        message.objCreationEnabled()   :
        message.objCreationDisabled();
};

Party.prototype.getID = function() {
    return this.ID.toString();
};

Party.prototype.getFullEventInfo = function() {

    console.log(
`Event name: ${this.partyName}, 
Date: ${this.date.getMonth() + 1}/${this.date.getDate()}/${this.date.getFullYear()}, 
Is suitable for minors: ${this.isSuitableForMinors ? `Yes` : `No`}, 
Clients: ${this.clientsCollection.length}`
    );
};

Party.prototype.listClients = function(gender = '') {

    if (this.clientsCollection.length === 0) {
        message.noClientsWarning();
        return;
    }

    if (!isGenderValid(gender)) {

        this.clientsCollection.forEach(client => {
            console.log(`Client: ${client.fullName}, Age ${client.age}, Gender: ${client.gender}, ID: ${client.ID}`);
            return;
        });

    } else {
        return this.clientsCollection
            .filter(client => client.gender === gender)
            .forEach(client => console.log(`${client.fullName}`));
    }
};

Party.prototype.toggleReservations = function() {
    this.isOpenForReservations = !this.isOpenForReservations;
    
    return (this.isOpenForReservations)     ?
        message.partyReservationEnabled()   :
        message.partyReservationDisabled();
};

Party.prototype.addClient = function(client) {

    if(!this.isOpenForReservations) {
        message.partyReservationWarning(); return;
    }

    if (!(client instanceof Client)) {
        message.invalidClientObject(); return;
    }

    if (this.clientsCollection.find(entity => entity.ID === client.ID)) {
        message.duplicateClientWarning(); return;
    }

    if (client.age < getAdultAge() && this.isSuitableForMinors === false) {
        message.underAgedClientWarning(); return;
    }

    if (client.wallet < this.entranceFee) {
        message.notEnoughFunds(); return;
    }

    if (client.eventCounter !== 0 && 
        client.eventCounter % 5 === 0) {

            client.isVIP = true;
            client.eventCounter++;

            this.clientsCollection.push(client);
            return;
    
        } else {
            client.isVIP = false;
            client.wallet -= this.entranceFee;
        }

    client.eventCounter++;

    this.clientsCollection.push(client);
    message.successfullyAddedClient();
};

Party.prototype.removeClient = function(ID) {

    if (checkIfIDExists(this.clientsCollection, ID)) {

        this.clientsCollection = this.clientsCollection.filter(client => client.ID !== ID);
        
        message.successfullyRemovedClient();
    } else {
        message.unsuccessfullyClientRemoval();
    }
};


function Client(firstName, lastName, gender, age, wallet) {

    if (!isClientCreationAllowed) {
        return message.objCreationDisabled(); 
    }
    verifyClientCreation(firstName, lastName, gender, age, wallet);

    let client = Object.create(Client.prototype);

    client.ID           = generateClientID();
    client.fullName     = `${capitalizeFirstLetter(firstName)} ${capitalizeFirstLetter(lastName)}`;
    client.gender       = gender;
    client.age          = age;
    client.wallet       = wallet;
    client.eventCounter = 0;
    client.isVIP        = false;
    
    return client;
}

// Global Toggler
const toggleClientCreation = () => {

    isClientCreationAllowed = !isClientCreationAllowed;

    return (isClientCreationAllowed)   ? 
        message.objCreationEnabled()   :
        message.objCreationDisabled();
};

const verifyClientCreation = (firstName, lastName, gender, age, wallet) => {

    if( !(isStringValid(firstName)     &&
            isStringValid(lastName)    &&
            isGenderValid(gender)      &&
            isAgeValid(age)            &&
            isWalletValid(wallet))) {

            return message.verifyCreationWarning();
        }
    return true;
};

Client.prototype.getFullClientInfo = function() {
    console.table(this);
};

Client.prototype.getID = function() {
    return this.ID.toString();
};


// #ID Generators (from stackOverFlow)
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

    const generateID = () => {
        let ts = timestamp.toString();
        let parts = ts.split("").reverse();
        let id = "";

        for (let i = 0; i < length; ++i) {
            let index = getRandomInt(0, parts.length - 1);
            id += parts[index];
        }

        return id;
    };
    return generateID();
}

// #Utilities
const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
};

const getPartyInfoReadableFormat = (party) => {
    Object.keys(party).forEach(e => console.log(`key=${e} value=${party[e]}`));
};

const getClientInfoReadableFormat = (client) => {
    Object.keys(client).forEach(e => console.log(`key=${e} value=${client[e]}`));
};

const checkIfIDExists = (collection, id) => {
    return collection.find(item => item.ID == id);
};

const listAllPartiesWIthPrefix = () => {
    if (!(partiesCollection.length > 0)) {
        console.warn('There are no events!'); return;
    }

    getPartiesCollection()
        .filter(party => party.isSuitableForMinors)
            .forEach(party => {
            console.log(`Party suitable for minors: #${party.partyName}`);
        });

    getPartiesCollection()
        .filter(party => !party.isSuitableForMinors)
        .forEach(party => { console.log(`Party suitable for adults: *${party.partyName}`);
    });
};

const listAllParties = () => {

    if (!(getPartiesCollection().length > 0)) {
        message.noActiveParties(); return;
    }

    getPartiesCollection().forEach((party) => {
        console.log(`Event name: ${party.isFree ? '!': '$' }${party.partyName},
Date: ${party.date.getMonth() + 1}/${party.date.getDate()}/${party.date.getFullYear()},
Is suitable for minors: %c${party.isSuitableForMinors ? 'Yes' : 'No'}`,
            'background-color: #fff; font-size: 1rem; color: #000;'
        );
    });
};

const listAllUnderAgedEvents = () => {

    if (!(getPartiesCollection().length > 0)) {
        message.noActiveParties(); return;
    }

    getPartiesCollection()
        .filter(party => party.isSuitableForMinors)
        .forEach(party => console.log(`Suitable parties: ${party.partyName}`));
};

const listEventsWithClients = () => {
    getPartiesCollection()
        .map(party => `Event name: ${party.partyName}, Clients: ${party.clientsCollection.length}`)
        .forEach(str => console.log(str));
};

const getMaxClients = () => {

    let party = getPartiesCollection()
        .filter(party => party.clientsCollection.length > 0);

    if (party.length === 0) {
        message.noClientsWarning(); return;
    }

    let clients = party.map(obj => obj.clientsCollection.length);
    clients = Array.from(party, obj => obj.clientsCollection.length);

    let partyWithMostClients = Math.max(...clients);

    let filteredCollection = party
        .filter(obj => obj.clientsCollection.length === partyWithMostClients)
        .map(obj => obj.partyName);

    console.log(`Event: ${filteredCollection.toString()}, Clients: ${partyWithMostClients}`);
};

const deletePartyByID = (ID) => {

    if (checkIfIDExists(getPartiesCollection(), ID)) {

        partiesCollection = partiesCollection.filter(party => party.ID !== ID);
        message.successfullyRemovedEvent();
    } else {
        message.unsuccessfullyEventRemoval();
    }
};

const updatePartyByID = function(ID, updateName, date, isSuitableForMinors = true) {

    if (checkIfIDExists(getPartiesCollection(), ID)) {

        verifyPartyCreation(updateName, date, isSuitableForMinors);

        let partyIndex = getPartiesCollection()
            .findIndex(party => party.ID === ID);

        console.log('Before update: ', getPartiesCollection()[partyIndex]);

        getPartiesCollection()[partyIndex].partyName = updateName;
        getPartiesCollection()[partyIndex].isSuitableForMinors = isSuitableForMinors;
        getPartiesCollection()[partyIndex].date = new Date(date);

        console.log('After update: ', getPartiesCollection()[partyIndex]);
    } else {
        message.unsuccessfullyEventRemoval();
    }
};


// #Validator helper functions
const isWalletValid = (money) => {
    return isInt(money) && money >= getMinCash();
};

const isStringValid = (str) => {
    return str !== null     && 
    typeof str === "string" && 
    str.length > 0;
};

const isBoolValid = (bool) => {
    return typeof bool === 'boolean';
};

const isGenderValid = (sex) => {
    if (sex && typeof sex === "string") {
        sex = sex.toLowerCase();

        if (sex === 'female' ||
            sex === 'male'   ||
            sex === 'prefer not to say') {
                return true;
        }
    }
    return false;
};

const isInt = (value) => {
    if (isNaN(value)) {
        return false;
    }

    let num = parseFloat(value);
        return (num | 0) === num;
};

const isAgeValid = (value) => {
    return (isInt(value) && value >= getMinAge()) ? true : false;
};

const isDateValid = function(date) {
    // Date format RegEx: mm/dd/yyyy
    const pattern = /^(((0[13-9]|1[012])[-/]?(0[1-9]|[12][0-9]|30)|(0[13578]|1[02])[-/]?31|02[-/]?(0[1-9]|1[0-9]|2[0-8]))[-/]?[0-9]{4}|02[-/]?29[-/]?([0-9]{2}(([2468][048]|[02468][48])|[13579][26])|([13579][26]|[02468][048]|0[0-9]|1[0-6])00))$/;

    if (!pattern.test(date)) {
        throw new TypeError(message.invalidDateFormat());
    }
    return true;
};

//! Vital: Do not remove
const message = MessagesWrapper();


//* Test Scenario One
// function TestScenarioOne() {
    // const partyOne      = Party('PartyOne', '12/31/2020', false, '15BGN');
    // const partyTwo      = Party('partyTwo', '12/08/2020');
    // const partyThree    = Party('partyThree', '12/07/2020', false);
    // const partyFour     = Party('partyFour', '12/06/2020');
    // const partyFive     = Party('partyFive', '12/01/2020', true, '5BGN');

//     listAllParties();
// }

// TestScenarioOne()

//* Test Scenario Two
// const partyOne      = Party('PartyOne', '12/31/2020', false, '15BGN');
// const partyTwo      = Party('partyTwo', '12/08/2020');

// listAllParties();

// const deleteTestID     = partyTwo.getID();

// deletePartyByID(deleteTestID);

// listAllParties();


//* Test Scenario Three
// const partyOne      = Party('partyTwo', '12/08/2020', true);

// const updateTestID    = partyOne.getID();

// listAllParties();

// updatePartyByID(updateTestID, 'Testing Name Update', '11/15/2020', false);

// listAllParties();

//* Test Scenario Four
// const partyThree    = Party('partyThree', '12/07/2020', false, '15BGN');
// const partyFour    = Party('partyFour', '12/07/2020');

// listAllParties();

// const konstantin = Client('konstantin', 'gogov', 'male', 18, 11);
// const underAged = Client('Vasil', 'Peshev', 'male', 16, 200);

// partyThree.addClient(underAged);
// partyThree.addClient(konstantin);

//* Test Scenario Five
// const partyFour     = Party('partyFour', '12/07/2020');

// const konstantin    = Client('konstantin', 'gogov', 'male', 18, 11);
// const kremena       = Client('kremena', 'ivanova', 'female', 16, 200);
// const ivana         = Client('ivana', 'angelova', 'female', 18, 11);
// const vasil         = Client('Vasil', 'Peshev', 'male', 16, 200);
// const gender        = Client('Vasil', 'Ivanov', 'prefer not to say', 16, 200);

// partyFour.addClient(konstantin);
// partyFour.addClient(kremena);
// partyFour.addClient(ivana);
// partyFour.addClient(vasil);

// partyFour.listClients();

// partyFour.listClients('female');

// partyFour.listClients('male');


//* Test Scenario Six
// const partyFour     = Party('partyFour', '12/07/2020');

// const konstantin    = Client('konstantin', 'gogov', 'male', 18, 11);

// partyFour.addClient(konstantin);

// partyFour.listClients();

// let konstantinID = konstantin.getID();

// partyFour.removeClient(konstantinID);

// partyFour.listClients();

//* Test Scenario Seven
// togglePartyCreation();
// toggleClientCreation();

// const partyFour     = Party('partyFour', '12/07/2020');
// const konstantin    = Client('konstantin', 'gogov', 'male', 18, 100);

// togglePartyCreation();
// toggleClientCreation();

// const partyFive     = Party('partyFive', '12/07/2020');
// const ivan          = Client('ivan', 'gogov', 'male', 18, 100);

// listAllParties();
// ivan.getFullClientInfo();

//* Test Scenario Eight
// const partyOne      = Party('PartyOne', '12/31/2020');
// const partyTwo      = Party('partyTwo', '12/08/2020');

// const konstantin    = Client('konstantin', 'gogov', 'male', 18, 11);
// const kremena       = Client('kremena', 'ivanova', 'female', 16, 200);
// const ivana         = Client('ivana', 'angelova', 'female', 18, 11);
// const vasil         = Client('Vasil', 'Peshev', 'male', 16, 200);
// const gender        = Client('Vasil', 'Ivanov', 'prefer not to say', 16, 200);

// partyOne.addClient(konstantin);
// partyOne.addClient(kremena);

// partyTwo.addClient(ivana);
// partyTwo.addClient(vasil);
// partyTwo.addClient(gender);

// partyOne.listClients();
// partyTwo.listClients();

// listEventsWithClients();

// getMaxClients();

//* Test Scenario Nine 
// const partyOne      = Party('PartyOne', '12/31/2020', false, '15BGN');
// const partyTwo      = Party('UnderAged Party', '12/08/2020');

// listAllParties();

// listAllUnderAgedEvents();

// listAllPartiesWIthPrefix();

//* Test Scenario Ten
// const ivan              = Client('Ivan', 'Peshev', 'male', 22);
// const ivanWithWallet    = Client('Ivan', 'Gogov', 'male', 22, 100);

// ivanWithWallet.getFullClientInfo();

//* Test Scenario Eleven
// const partyOne              = Party('PartyOne', '12/31/2020', false, 5);
// const partyTwo              = Party('partyTwo', '12/08/2020');
// const partyThree            = Party('partyThree', '12/07/2020', false);
// const partyFour             = Party('partyFour', '12/06/2020');
// const partyFive             = Party('partyFive', '12/01/2020', true, 15);
// const partySix              = Party('partySix', '12/01/2020', true, 15);
// const partySeven            = Party('partySeven', '12/01/2020', true, 15);
// const partyEight            = Party('partyEight', '12/01/2020', true, 15);
// const partyNine             = Party('partyNine', '12/01/2020', true, 15);
// const partyTen              = Party('partyTen', '12/01/2020', true, 15);
// const partyEleven           = Party('partyEleven', '12/01/2020', true, 15);
// const partyTwelve           = Party('partyTwelve', '12/01/2020', true, 15);
// const partyThirteen         = Party('partyThirteen', '12/01/2020', true, 15);

// const ivanWithWallet    = Client('Ivan', 'Gogov', 'male', 22, 100);

// ivanWithWallet.getFullClientInfo();

// partyOne.addClient(ivanWithWallet);
// partyTwo.addClient(ivanWithWallet);
// partyThree.addClient(ivanWithWallet);
// partyFour.addClient(ivanWithWallet);
// partyFive.addClient(ivanWithWallet);
// partySix.addClient(ivanWithWallet);
// partySeven.addClient(ivanWithWallet);
// partyEight.addClient(ivanWithWallet);
// partyNine.addClient(ivanWithWallet);
// partyTen.addClient(ivanWithWallet);

// partyEleven.addClient(ivanWithWallet);

// partyTwelve.addClient(ivanWithWallet); // Ta-daa

// partyThirteen.addClient(ivanWithWallet); // Ta-daa

// ivanWithWallet.getFullClientInfo();