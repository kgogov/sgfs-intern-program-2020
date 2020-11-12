// Storage
let PARTIES_COLLECTION = [];

const listAllParties = () => {
    if (PARTIES_COLLECTION.length > 0) {

        PARTIES_COLLECTION.forEach((party) => {
            console.log(
                `Event name: ${party.partyName};` +
                ` Is suitable for minors: %c${party.isSuitableForMinors}`,
                'background-color: #fff; font-size: 1rem; color: #000;'
            );
        });
    } else {
        console.warn('There are no events!');
    }
}

const checkIfIDExists = function(collection, id) {
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

const updatePartyByID = (ID, updateName, isSuitableForMinors = false) => {
    if (checkIfIDExists(PARTIES_COLLECTION, ID)) {

        verifyPartyCreation(updateName, isSuitableForMinors);

        let partyIndex = PARTIES_COLLECTION
            .findIndex(party => party.ID == ID);

        console.log('Before update: ', PARTIES_COLLECTION[partyIndex]);

        PARTIES_COLLECTION[partyIndex].partyName = updateName;
        PARTIES_COLLECTION[partyIndex].isSuitableForMinors = isSuitableForMinors;

        console.log('After update: ', PARTIES_COLLECTION[partyIndex]);

    } else {
        console.warn('Event with such ID was not found!');
    }
}


// Validator helper functions
const isNameValid = function(str) {

    return str !== null     && 
    typeof str === "string" && 
    str.length > 0;
}

const isBoolValid = function(bool) {
    return typeof bool === 'boolean';
}

const isGenderValid = function(sex) {

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

const isInt = function(value) {

    if (isNaN(value)) {
        return false;
    }

    let num = parseFloat(value);
        return (num | 0) === num;
}

const isAgeValid = function(value) {

    const MIN_AGE_TO_PARTY = 16;

    return (isInt(value) && value >= MIN_AGE_TO_PARTY) ? true : false;
}

const verifyPartyCreation = function(name, boolean) {

    if (!(isNameValid(name) && isBoolValid(boolean))) {
        throw new TypeError('Please enter correct fields!');
    }

    return true;
}

const generateEventID = function() {

    const hex = function(value) {
        return Math.floor(value).toString(16)
    }

    return hex(Date.now() / 1000) +
      ' '.repeat(16).replace(/./g, () => hex(Math.random() * 16))
}

function Party(partyName, isSuitableForMinors = false) {

    verifyPartyCreation(partyName, isSuitableForMinors);

    let party = Object.create(Party.prototype);

    party.ID                    = generateEventID()
    party.partyName             = partyName;
    party.isSuitableForMinors   = isSuitableForMinors;
    party.isOpenForReservations = true;
    party.clientsCollection     = [];

    PARTIES_COLLECTION.push(party);

    return party;
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

Party.prototype.getFullEventInfo = function() {
    console.table(this);
}

Party.prototype.addClient = function(client) {
    if (!(client instanceof Client)) {
        throw new Error('Please add valid client object!');
    }

    const ADULT_AGE = 18;

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

Party.prototype.listClients = function(gender = '') {

    if (!isGenderValid(gender)) {

        this.clientsCollection.forEach(client => {
            console.log(`Client: ${client.fullName}, ` +
                        `Age ${client.age}, `         +
                        `Gender: ${client.gender}`);
        })

    } else {
        let filteredArr = this.clientsCollection
            .filter(client => client.gender === gender);

        return filteredArr
            .forEach(client => console.log(`${client.fullName}`));
        
    }
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

const verifyClientCreation = function(firstName, lastName, gender, age) {

    if( !(isNameValid(firstName) &&
        isNameValid(lastName)    &&
        isGenderValid(gender)    &&
        isAgeValid(age))) {

            throw new TypeError('Please enter correct values!');
        }

    return true;
}

const generateClientID = function() {

    const length = 8;
    const timestamp = +new Date();
    
    const getRandomInt = function( min, max ) {
       return Math.floor( Math.random() * ( max - min + 1 ) ) + min;
    }
    
    const generateID = function() {

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

const capitalizeFirstLetter = function(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

Client.prototype.getFullClientInfo = function() {
    console.table(this);
}

function Client(firstName, lastName, gender, age) {

    verifyClientCreation(firstName, lastName, gender, age);

    let client = Object.create(Client.prototype);

    client.ID       = generateClientID();
    client.fullName = `${capitalizeFirstLetter(firstName)} ${capitalizeFirstLetter(lastName)}`;
    client.gender   = gender;
    client.age      = age;
    
    return client;

}

const escapeParty = Party('Hells Angels New Year Party');
escapeParty.getFullEventInfo();

const konstantin = Client('konstantin', 'gogov', 'male', 18);
konstantin.getFullClientInfo();

const kremena = Client('Kremena', 'Ivanova', 'female', 19);

escapeParty.addClient(konstantin);
escapeParty.addClient(kremena);

listAllParties();