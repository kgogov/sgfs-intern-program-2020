// #Configuration
let PARTIES_COLLECTION = [];

// noob solution
let isPartyCreationAllowed = true;
let isClientCreationAllowed = true;

function Party(partyName, date, isSuitableForMinors = true, entranceFee = '') {

    if (!isPartyCreationAllowed) {
        console.warn('Object instantiation disabled!'); return;
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

    PARTIES_COLLECTION.push(party);

    return party;
}

const togglePartyCreation = () => {

    if (isPartyCreationAllowed) {
        isPartyCreationAllowed = false;

        console.warn('Object instantiation disabled!');
    } else {
        isPartyCreationAllowed = true;

        console.log('%cObject instantiation enabled!', 
            'background-color: green');
    }
}

Party.prototype.toggleReservations = function() {
    
    if (!this.isOpenForReservations) {
        this.isOpenForReservations = true;

        console.log(`%cReservations are turned on!`,
            'background-color: green;');
    } else {
        this.isOpenForReservations = false;

        console.log(`%cReservations are turned off!`,
            'background-color: #961209;');
    }
}

Party.prototype.getID = function() {
    console.log(this.ID);
}

Party.prototype.getFullEventInfo = function() {

    console.log(
    `Event name: ${this.partyName}, `                                    +
    `Date: ${this.date.getMonth() + 1}/`                                 + 
     `${this.date.getDate()}/`                                           + 
     `${this.date.getFullYear()}, `                                      + 
    `Is suitable for minors: ${this.isSuitableForMinors ? `Yes` : `No`}` +
    `, Clients: ${this.clientsCollection.length}`
    );
}

Party.prototype.listClients = function(gender = '') {

    if (!isGenderValid(gender)) {

        this.clientsCollection.forEach(client => {
            console.log(`Client: ${client.fullName}, `   +
                        `Age ${client.age}, `            +
                        `Gender: ${client.gender}, `     +
                        `ID: ${client.ID}`);
        });
    } else {
        let filteredArr = this.clientsCollection
            .filter(client => client.gender === gender);

        return filteredArr
            .forEach(client => console.log(`${client.fullName}`));
    }
}

Party.prototype.addClient = function(client) {

    if(!this.isOpenForReservations) {
        return console.warn('Cannot add clients yet. Please turn on with toggleReservations()');
    }

    if (!(client instanceof Client)) {
        throw new Error('Please add valid client object!');
    }

    if (this.clientsCollection.find(entity => entity.ID === client.ID)) {
        throw new Error('You cannot add same client to the event!');
    }

    const ADULT_AGE = 18;

    // Really interesting function i have made :D
    const checkIfClientIsEligible = (client) => {

        if (client.age < ADULT_AGE && this.isSuitableForMinors === false) {
            console.warn('You cannot sign for this party! Please look for other events!');
        } else {
            this.clientsCollection.push(client);

            console.log(`%cClient added successfully!`,
                'background-color: green;')
        }
    }
    checkIfClientIsEligible(client);
}

Party.prototype.removeClient = function(ID) {

    if (checkIfIDExists(this.clientsCollection, ID)) {

        this.clientsCollection = this.clientsCollection
            .filter(client => client.ID !== ID);
        
        console.log(`%cClient was successfully deleted!`, 'background-color: green');
    } else {
        console.warn('Client with such ID was not found!');
    }
}

function Client(firstName, lastName, gender, age, wallet) {

    if (!isClientCreationAllowed) {
        console.warn('Object instantiation disabled!');
        return;
    }
    verifyClientCreation(firstName, lastName, gender, age, wallet);

    let client = Object.create(Client.prototype);

    client.ID       = generateClientID();
    client.fullName = `${capitalizeFirstLetter(firstName)} ${capitalizeFirstLetter(lastName)}`;
    client.gender   = gender;
    client.age      = age;
    client.wallet   = wallet;
    
    return client;
}

const toggleClientCreation = () => {
    
    if (isClientCreationAllowed) {
        isClientCreationAllowed = false;

        console.warn('Object instantiation disabled!');
    } else {
        isClientCreationAllowed = true;

        console.log('%cObject instantiation enabled!', 
            'background-color: green');
    }
}

Client.prototype.getFullClientInfo = function() {
    console.table(this);
}

// #Helpers
const verifyPartyCreation = function(name, date, boolean) {

    if ( !(isNameValid(name) &&
           isDateValid(date) &&
           isBoolValid(boolean))) {
        throw new TypeError('Please enter correct arguments!');
    }

    return true;
}

const verifyClientCreation = (firstName, lastName, gender, age, wallet) => {

    if( !(isNameValid(firstName) &&
        isNameValid(lastName)    &&
        isGenderValid(gender)    &&
        isAgeValid(age)          &&
        isWalletValid(wallet))) {
            throw new TypeError('Please enter correct values!');
        }

    return true;
}

// #ID Generators
const generateEventID = () => {
    const hex = (value) => {
        return Math.floor(value).toString(16)
    }

    return hex(Date.now() / 1000) +
      ' '.repeat(16).replace(/./g, () => hex(Math.random() * 16))
}

const generateClientID = function() {

    const length = 8;
    const timestamp = +new Date();
    
    const getRandomInt = ( min, max ) => {
       return Math.floor( Math.random() * ( max - min + 1 ) ) + min;
    }
    
    const generateID = () => {
        let ts = timestamp.toString();
        let parts = ts.split( "" ).reverse();
        let id = "";
        
        for(let i = 0; i < length; ++i ) {
            let index = getRandomInt( 0, parts.length - 1 );
            id += parts[index];	 
        }

        return id;
    }
    return generateID();
}

// #Utilities
const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

const getPartyInfoReadableFormat = (party) => {
    for (const prop in party) {

        if (party.hasOwnProperty(prop)) {
            console.log(`party.${prop} = ${party[prop]}`);
        }
    }
}

// It could be refactored
const listAllPartiesWIthPrefix = () => {
    if (!(PARTIES_COLLECTION.length > 0)) {
        console.warn('There are no events!'); return;
    }

    let arrForUnderAged = PARTIES_COLLECTION
        .filter(party => {
            if (party.isSuitableForMinors) {
                return true;
            } else {
                return false;
            }
        }).forEach(party => {
            console.log(`Party suitable for minors: #${party.partyName}`);
        });

    let arrForAdults = PARTIES_COLLECTION
        .filter(party => {
            if (!party.isSuitableForMinors) {
                return true;
            } else {
                return false;
            }
        }).forEach(party => {
            console.log(`Party suitable for adults: *${party.partyName}`);
        });
}

const listAllParties = () => {
    if (!(PARTIES_COLLECTION.length > 0)) {
        console.warn('There are no events!'); return;
    }

    PARTIES_COLLECTION.forEach((party) => {
        console.log(
            `Event name: ${party.isFree ? '!': '$' }${party.partyName}; `           +
            `Date: ${party.date.getMonth() + 1}/`                                   + 
            `${party.date.getDate()}/`                                              + 
            `${party.date.getFullYear()}, `                                         +
            `Is suitable for minors: %c${party.isSuitableForMinors ? 'Yes' : 'No'}`,
            'background-color: #fff; font-size: 1rem; color: #000;'
        );
    });
} 

const listAllUnderAgedEvents = () => {
    if (!(PARTIES_COLLECTION.length > 0)) {
        console.warn('There are no events!'); return;
    }

    let filtered = PARTIES_COLLECTION
        .filter(party => party.isSuitableForMinors);

    filtered.forEach(party => {
        console.log(`Suitable parties: ${party.partyName}`);
    });
}

const listEventsWithClients = () => {
    return PARTIES_COLLECTION
        .map(party => 
            `Event name: ${party.partyName}, Clients: ${party.clientsCollection.length}`)
            .forEach(str => console.log(str));
}

const getClientInfoReadableFormat = (client) => {
    for (const prop in client) {

        if (client.hasOwnProperty(prop)) {
            console.log(`client.${prop} = ${client[prop]}`);
        }
    }
}

const getMaxClients = () => {

    let partyCollection = PARTIES_COLLECTION
        .filter(party => party.clientsCollection.length > 0);

    if (partyCollection.length === 0) {
        console.warn('There are no clients at any party right now!');
        return;
    }

    let clients = partyCollection.map(obj => obj.clientsCollection.length);

    clients = Array.from(partyCollection, obj => obj.clientsCollection.length);

    let partyWithMostClients = Math.max(...clients);

    let filteredCollection = partyCollection
        .filter(obj => obj.clientsCollection.length === partyWithMostClients)
        .map(obj => obj.partyName);

    console.log(`Event: ${filteredCollection.toString()}, Clients: ${partyWithMostClients}`);
}

const checkIfIDExists = (collection, id) => {
    return collection.find((item) => item.ID == id);
}

const deletePartyByID = (ID) => {
    if (checkIfIDExists(PARTIES_COLLECTION, ID)) {

        PARTIES_COLLECTION = PARTIES_COLLECTION
            .filter(party => party.ID !== ID);
        
        console.log(`%cParty was successfully deleted!`, 'background-color: green');
    } else {
        console.warn('Event with such ID was not found!');
    }
}

const updatePartyByID = (ID, updateName, date, isSuitableForMinors = true) => {
    if (checkIfIDExists(PARTIES_COLLECTION, ID)) {

        verifyPartyCreation(updateName, date, isSuitableForMinors);

        let partyIndex = PARTIES_COLLECTION
            .findIndex(party => party.ID == ID);

        console.log('Before update: ', PARTIES_COLLECTION[partyIndex]);

        PARTIES_COLLECTION[partyIndex].partyName = updateName;
        PARTIES_COLLECTION[partyIndex].isSuitableForMinors = isSuitableForMinors;
        PARTIES_COLLECTION[partyIndex].date = new Date(date);

        console.log('After update: ', PARTIES_COLLECTION[partyIndex]);

    } else {
        console.warn('Event with such ID was not found!');
    }
}


// #Validator helper functions
const isWalletValid = (money) => {
    const MIN_CASH = 10; // bgn

    return isInt(money) && money >= MIN_CASH;
}

const isNameValid = (str) => {
    return str !== null     && 
    typeof str === "string" && 
    str.length > 0;
}

const isBoolValid = (bool) => {
    return typeof bool === 'boolean';
}

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
}

const isInt = (value) => {
    if (isNaN(value)) {
        return false;
    }

    let num = parseFloat(value);
        return (num | 0) === num;
}

const isAgeValid = (value) => {

    const MIN_AGE_TO_PARTY = 12;

    return (isInt(value) && value >= MIN_AGE_TO_PARTY) ? true : false;
}

const isDateValid = function(date) {
    // mm/dd/yyyy
    const pattern = /^(((0[13-9]|1[012])[-/]?(0[1-9]|[12][0-9]|30)|(0[13578]|1[02])[-/]?31|02[-/]?(0[1-9]|1[0-9]|2[0-8]))[-/]?[0-9]{4}|02[-/]?29[-/]?([0-9]{2}(([2468][048]|[02468][48])|[13579][26])|([13579][26]|[02468][048]|0[0-9]|1[0-6])00))$/;

    if (!pattern.test(date)) {
        throw new TypeError('Please insert date in format: DD-MM-YYYY');
    }
    return true;
}

// #Testing entities
const escapeParty = Party('Hells Angels New Year Party', '12/31/2020');
const testParty = Party('Wrong name', '12/08/2020', false, '10BGN');

listAllParties();

const konstantin = Client('konstantin', 'gogov', 'male', 18, 11);
const underAged4 = Client('Vasil', 'Peshev', 'male', 18, 200);
const kremena = Client('Kremena', 'Ivanova', 'female', 19, 200);
const kremena2 = Client('Kremena', 'Ivanova', 'female', 19, 200);
const kremena3 = Client('Kremena', 'Ivanova', 'female', 19, 200);

// escapeParty.addClient(konstantin);
// escapeParty.addClient(kremena);

// testParty.addClient(underAged4);
// testParty.addClient(kremena2);
// testParty.addClient(kremena3);