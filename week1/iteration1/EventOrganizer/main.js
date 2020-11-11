// Main storage for Parties
const EVENT_STORAGE_COLLECTION = [];

// Helpers
const isValidString = function(str) {

    return str !== null     && 
    typeof str === "string" && 
    str.length > 0;
}

const isNameValid = function(name) {

    return name !== null     && 
    typeof name === "string" &&
    name.length > 2;
}

const isValidBool = function(bool) {
    return typeof bool === 'boolean';
}

const isSexValid = function(sex) {

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

const isAgeValidInt = function(value) {

    function isInt(value) {

        if (isNaN(value)) {
            return false;
        }

        let num = parseFloat(value);
            return (num | 0) === num;
    }

    const MIN_AGE_TO_PARTY = 16;

    if (isInt(value) && value >= MIN_AGE_TO_PARTY) {
        return true;
    } else {
        return false;
    }
}

const capitalizeFirstLetter = function(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

// Utilities
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

const generateEventID = function() {

    const hex = function(value) {
        return Math.floor(value).toString(16)
    }

    return hex(Date.now() / 1000) +
      ' '.repeat(16).replace(/./g, () => hex(Math.random() * 16))
}

// Global Interface Functions
const getAllEvents = function() {

    if (EVENT_STORAGE_COLLECTION.length > 0) {
        let age = '(+18)';

        for (let i = 0; i < EVENT_STORAGE_COLLECTION.length; i++) {

            if (EVENT_STORAGE_COLLECTION[i].areAdultsAllowed !== true) {
                age = '(minors allowed)';
            }
    
            console.log(`Party: ${EVENT_STORAGE_COLLECTION[i].eventName}, ${age}`);
        }
    } else {
        console.log('There are no ongoing events right now :((');
    }
}

const getAllEventsByID = function() {

    if (EVENT_STORAGE_COLLECTION.length > 0) {

        for (let i = 0; i < EVENT_STORAGE_COLLECTION.length; i++) {
            console.log(`${EVENT_STORAGE_COLLECTION[i].eventName}: ${EVENT_STORAGE_COLLECTION[i].id}`);
        }
    } else {
        console.log('There are no ongoing events right now :((')
    }
}

const deleteEventById = function(eventId) {

    if (!isValidString(eventId)) {
        throw new TypeError('Please enter a valid id!');
    }

    const storageEventIndex = EVENT_STORAGE_COLLECTION
        .findIndex(storageEventIndex => storageEventIndex.id === eventId);

    if (storageEventIndex !== -1) {

        EVENT_STORAGE_COLLECTION.splice(storageEventIndex, 1);
        console.log('Event was deleted!');
    } else {
        console.warn('Event was not deleted! Check input please!');
    }
}

const updateEventById = function(eventId, updatedName, updatedAdultFlag) {

    const storageEventIndex = EVENT_STORAGE_COLLECTION
        .findIndex(storageEventIndex => storageEventIndex.id === eventId);

    if (!isValidString(updatedName)) {
        throw new TypeError('Please enter a valid event name!');
    } else {
        EVENT_STORAGE_COLLECTION[storageEventIndex].eventName = updatedName;
    }

    if (!isValidBool(updatedAdultFlag)) {
        throw new TypeError('Please enter a valid boolean value');
    } else {
        EVENT_STORAGE_COLLECTION[storageEventIndex].areAdultsAllowed = updatedAdultFlag;
    }

    getAllEvents();
}

// Ужасен начин за създаване на състояние
let isEventCreationAllowed = true;
let isClientCreationAllowed = true;

const toggleEventCreation = function() {
    
    if (!isEventCreationAllowed) {
        isEventCreationAllowed = true;
        console.log('Event creation: enabled!');

    } else {
        isEventCreationAllowed = false;
        console.warn('Event creation: disabled!');
    }
}

const toggleClientCreation = function() {

    if (!isClientCreationAllowed) {
        isClientCreationAllowed = true;
        console.log('Event creation: enabled!');

    } else {
        isClientCreationAllowed = false;
        console.warn('Client creation: disabled!');
    }
}

// Function constructors
const CreateParty = function(eventName, areAdultsAllowed = true) {

    if (!isEventCreationAllowed) {
        return console.warn('Event creation is disabled!');
    }

    if (!isValidString(eventName)) {
        throw new TypeError('Please enter a valid event name!');
    }

    if (!isValidBool(areAdultsAllowed)) {
        throw new TypeError('Please enter a valid boolean value');
    }
    // Creating a closure with the allowClientsToggle()
    // Така, мога да огранича добавянето на клиенти за текущо събитие
    let areClientsAllowed = true;

    const ADULT_AGE = 18;

    const event = {

        eventName,
        areAdultsAllowed,
        id: generateEventID(),
        clientCollection: [],

        getEventInfo: function() {
            console.log(`Name: ${this.eventName}, age restriction: ${!this.areAdultsAllowed}, ID: ${this.id}`);
        },

        addClient: function(obj) {

            if (!areClientsAllowed) {
                return console.log('You cannot add clients to this event yet!');
            }

            if (areAdultsAllowed && obj.age < ADULT_AGE) {
                throw new Error('Sorry, you are too young for this party! Come back next year :)');

            } else if (this.clientCollection.find(client => client.id === obj.id)) {
                throw new Error('You cannot add same client to the event!');

            } else {
                this.clientCollection.push(obj);

                console.log(`Client successfully added to this event.`);
            }
        },
        getClientsInfo: function() {

            if (this.clientCollection.length > 0) {

                console.log(this.clientCollection
                    .map(client => `${client.fullName}, age: ${client.age}, ID: ${client.id}`));
            } else {
                console.log('There are no clients for this event yet');
            }
        },
        filterClientsByGender: function(sex) {

            if (this.clientCollection.length > 0) {
                // Тук функцията връща обекти в масив
                console.log(this.clientCollection
                    .filter(client => (client.sex === sex)));
            } else {
                console.log('There are no clients for this event yet');
            }
        },
        deleteClient: function(id) {

            if (this.clientCollection.length > 0) {

                this.clientCollection = this.clientCollection.filter((item) => {
                    return item.id != id;
                });

                console.log(`Client deleted successfully.`);
            } else {
                console.log('There are no clients for this event yet');
            }
        },
        allowClientsToggle: function() {
            areClientsAllowed = false;
        }
    }

    EVENT_STORAGE_COLLECTION.push(event);

    return event;
}

const CreateClient = function(firstName, lastName, sex, age) {

    if (!isClientCreationAllowed) {
        return console.warn('Client creation is disabled!');
    }

    if (!isNameValid(firstName)) {
        throw new TypeError('Please enter a valid first name!');
    }

    if (!isNameValid(lastName)) {
        throw new TypeError('Please enter a valid last name!');
    }

    if (!isSexValid(sex)) {
        throw new TypeError('Please enter a valid gender!');
    }

    if (!isAgeValidInt(age)) {
        throw new TypeError('Please enter a valid age!');
    }

    const client = {
        fullName: `${capitalizeFirstLetter(firstName)} ${capitalizeFirstLetter(lastName)}`,
        sex: `${sex}`,
        age: age,
        id: generateClientID(),
        getClientInfo: function() {
            console.log(`Client: ${this.fullName}, Age: ${this.age}, Gender: ${this.sex}`);
        },
        getClientID: function() {
            console.log(`Client: ${this.fullName}, ID: ${this.id}`);
        }
    }
    return client;
}

// #### Boilerplate testing objects

// const deluxParty  = CreateParty('Asenovgrad Delux 2020');
// const escapeParty = CreateParty('Plovdiv Escape 2021', false);

// const ivan        = CreateClient('Ivan', 'Dimitrov', 'male', 26);
// const vanesa      = CreateClient('Vanesa', 'Ivanova', 'female', 26);
// const mihaela     = CreateClient('Mihaela', 'Atanasova', 'female', 22);
// const qnica       = CreateClient('Qnica', 'Zelenkova', 'female', 19);
// const doktora     = CreateClient('Profesor', 'Mutavchiivski', 'male', 17);


// deluxParty.addClient(ivan);
// deluxParty.addClient(vanesa);
// deluxParty.addClient(mihaela);

// deluxParty.getEventInfo();
// deluxParty.filterClientsByGender('female');
// deluxParty.getClientsInfo();