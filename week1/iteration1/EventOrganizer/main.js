// Main storage :D 
let eventStorageCollection = [];

// #### Boilerplate testing objects
const deluxParty  = CreateParty('Asenovgrad Delux 2020');
const escapeParty = CreateParty('Plovdiv Escape 2021', false);

const ivan        = CreateClient('Ivan', 'Dimitrov', 'male', 26);
const vanesa      = CreateClient('Vanesa', 'Ivanova', 'male', 26);
const mihaela     = CreateClient('Mihaela', 'Atanasova', 'female', 22);
const qnica       = CreateClient('Qnica', 'Zelenkova', 'female', 19);
const doktora     = CreateClient('Profesor', 'Mutavchiivski', 'female', 17);
// #### Boilerplate testing objects

// ######## ---PARTY--- ########
function CreateParty(eventName, areAdultsAllowed = true) {

    if (!isValidString(eventName)) {
        throw new TypeError('Please enter a valid event name!');
    }

    if (!isValidBool(areAdultsAllowed)) {
        throw new TypeError('Please enter a valid boolean value');
    }

    // Avoid usage of magic numbers!
    const ADULT_AGE = 18;

    const event = {

        eventName,
        areAdultsAllowed,
        id: generateID(),
        clients: [],

        getInfo: function() {
            console.log(`Name: ${this.eventName}, age restriction: ${!this.areAdultsAllowed}, ID: ${this.id}`);
        },

        addClient: function(obj) {

            if (areAdultsAllowed && obj.age < ADULT_AGE) {
                throw new Error('Sorry, you are too young for this party! Come back next year :)');

            } else if (this.clients.find(client => client.id === obj.id)) {
                throw new Error('You cannot add same client to the event!');

            } else {
                this.clients.push(obj);
                console.log(`Client successfully added to this event.`);
            }
        },
        getClients: function() {

            if (this.clients.length > 0) {
                console.log(this.clients
                    .map(client => `${client.fullName}, age: ${client.age}, ID: ${client.id}`));
            } else {
                console.log('There are no clients for this event yet');
            }
        },
        filterClientsByGender: function(sex) {

            if (this.clients.length > 0) {
                console.log(this.clients
                    .filter(client => (client.sex === sex)));
            } else {
                console.log('There are no clients for this event yet');
            }
        },
        deleteClient: function(id) {

            if (this.clients.length > 0) {

                this.clients = this.clients.filter((item) => {
                    return item.id != id;
                });

                console.log(`Client deleted successfully.`);
            } else {
                console.log('There are no clients for this event yet');
            }
        }
    }

    eventStorageCollection.push(event);

    return event;
}

// CreateParty Validators
function isValidString(str) {

    return str !== null     && 
    typeof str === "string" && 
    str.length > 0;
}

function isValidBool(bool) {
    return typeof bool === 'boolean';
}

// ID Generator
function generateID() {

    const hex = function(value) {
        return Math.floor(value).toString(16)
    }

    return hex(Date.now() / 1000) +
      ' '.repeat(16).replace(/./g, () => hex(Math.random() * 16))
}


// ######## ---CLIENT--- ########
function CreateClient(firstName, lastName, sex, age) {

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

// CreateClient Validators
function isNameValid(name) {

    return name !== null     && 
    typeof name === "string" &&
    name.length > 2;
}

function isSexValid(sex) {

    if (sex && typeof sex === "string") {
        sex = sex.toLowerCase();

        if (sex === 'female' ||
            sex === 'male'   ||
            sex === 'prefer not to say') {
                return true;
        } else {
            return false;
        }
    } else {
        return false;
    }
}

function isAgeValidInt(value) {

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

// ClientID Generator
function generateClientID() {

    const length = 8;
    const timestamp = +new Date();
    
    const getRandomInt = function( min, max ) {
       return Math.floor( Math.random() * ( max - min + 1 ) ) + min;
    }
    
    function generate() {

    let ts = timestamp.toString();
    let parts = ts.split( "" ).reverse();
    let id = "";
    
    for(let i = 0; i < length; ++i ) {
        let index = getRandomInt( 0, parts.length - 1 );
        id += parts[index];	 
    }

    return id;
    }

    return generate();
}

// User Interface Functions
function getAllEvents() {

    if (eventStorageCollection.length > 0) {
        for (let i = 0; i < eventStorageCollection.length; i++) {
            let age = '(+18)';
    
            if (eventStorageCollection[i].areAdultsAllowed !== true) {
                age = '(minors allowed)';
            }
    
            console.log(`Party: ${eventStorageCollection[i].eventName}, ${age}`);
        }
    } else {
        console.log('There are no ongoing events right now :((')
    }
}

function getAllEventsByID() {

    if (eventStorageCollection.length > 0) {

        for (let i = 0; i < eventStorageCollection.length; i++) {
            console.log(`${eventStorageCollection[i].eventName}: ${eventStorageCollection[i].id}`);
        }
    } else {
        console.log('There are no ongoing events right now :((')
    }
}

function deleteEventById(eventId) {

    const eventIndex = eventStorageCollection.indexOf(eventId);

    const result = eventStorageCollection.splice(eventIndex, 1);

    if (result) {
        console.log(`Event was completely removed!`);
    } else {
        console.warn('Something went wrong!');
    }
}

function updateEventById(eventId, updatedName, updateAdultFlag) {

    let storageEventIndex = eventStorageCollection
        .findIndex(storageEventIndex => storageEventIndex.id === eventId);

    if (!isValidString(updatedName)) {
        throw new TypeError('Please enter a valid event name!');
    } else {
        eventStorageCollection[storageEventIndex].eventName = updatedName;
    }

    if (!isValidBool(updateAdultFlag)) {
        throw new TypeError('Please enter a valid boolean value');
    } else {
        eventStorageCollection[storageEventIndex].areAdultsAllowed = updateAdultFlag;
    }

    getAllEvents();
}

// Helpers
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

// Разяснения:
// Всеки event има уникално ID, който получава при създаването си
// Всички събития се съхраняват в eventStorageCollection[]
// Листва всички събития
// Изтрива събитие по уникален идентификатор и извежда съобщение за успешна операция
    // (за handle на exception-ите не съм убеден че това е правилния начин)
// Добавяне на клиент към вече съществуващо събитие
// Актуализиране на евент по ID
// Листване на клиенти за дадено събитие
// Премахване на присъстващ клиент от събитие по ID