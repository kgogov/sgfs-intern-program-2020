// Всеки event има уникално ID, който получава при създаването си
// Всички събития се съхраняват в eventStorage[]
// Листва всички събития
// Изтрива събитие по уникален идентификатор и извежда съобщение за успешна операция
    // (за handle на exception-ите не съм убеден че това е правилния начин)
// Добавяне на клиент към вече съществуващо събитие
// Актуализиране на евент по ID
// Листване на клиенти за дадено събитие
// Премахване на присъстващ клиент от събитие


let eventStorage = [];

// #### Boilerplate testing objects
const deluxParty = CreateParty('Asenovgrad Delux 2020');
const escapeParty = CreateParty('Plovdiv Escape 2021', false);

const ivan = CreateClient('Ivan', 'Dimitrov', 'male', 26);
const vanesa = CreateClient('Vanesa', 'Ivanova', 'male', 26);
const mihaela = CreateClient('Mihaela', 'Atanasova', 'female', 22);
const qnica = CreateClient('Qnica', 'Zelenkova', 'female', 19);
const doktora = CreateClient('Profesor', 'Mutavchiivski', 'female', 17);
// #### Boilerplate testing objects

// ######## ---PARTY--- ########
function CreateParty(eventName, areAdultsAllowed = true) {

    if (!isValidString(eventName)) {
        throw new TypeError('Please enter a valid event name!');
    }

    if (!isValidBool(areAdultsAllowed)) {
        throw new TypeError('Please enter a valid boolean value');
    }

    const event = {
        eventName: eventName,
        areAdultsAllowed: areAdultsAllowed,
        id: generateID(),
        getInfo: function() {
            console.log(`Name: ${this.eventName}, age restriction: ${!this.areAdultsAllowed}, ID: ${this.id}`);
        },
        clients: [],
        // !BUG: Два пъти може да адне един и същи клиент
        addClient: function(obj) {
            if (areAdultsAllowed && obj.age < 18) {
                throw new Error('Sorry, you are too young for this party! Come back next year :)');
            } else {
                this.clients.push(obj);
                console.log(`Client successfully added to this event.`);
            }
        },
        getClients: function() {
            if (this.clients.length > 0) {
                console.log(this.clients.map(client => `${client.fullName}, age: ${client.age}`));
            } else {
                console.log('There are no clients for this event yet')
            }
        },
        filterClientsByGender: function(sex) {
            if (this.clients.length > 0) {
                console.log(this.clients.filter(client => (client.sex === sex)));
            } else {
                console.log('There are no clients for this event yet')
            }
        },
        deleteClient: function(name) {
            if (this.clients.length > 0) {
                this.clients = this.clients.filter((client) => client.name !== client);
            } else {
                console.log('There are no clients for this event yet')
            }
        }
    }

    eventStorage.push(event);

    return event;
}

// CreateParty Validators
function isValidString(str) {
    return str !== null && 
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
        age: age
    }

    return client;
}

// CreateClient Validators
function isNameValid(name) {
    return name !== null && 
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

// User Interface Functions
function getAllEvents() {
    if (eventStorage.length > 0) {
        for (let i = 0; i < eventStorage.length; i++) {
            let age = '(+18)';
    
            if (eventStorage[i].areAdultsAllowed !== true) {
                age = '(minors allowed)';
            }
    
            console.log(`Party: ${eventStorage[i].eventName}, ${age}`);
        }
    } else {
        console.log('There are no ongoing events right now :((')
    }
}

function getAllEventsByID() {
    if (eventStorage.length > 0) {
        for (let i = 0; i < eventStorage.length; i++) {
            console.log(`${eventStorage[i].eventName}: ${eventStorage[i].id}`);
        }
    } else {
        console.log('There are no ongoing events right now :((')
    }
}

function deleteEventById(eventId) {
    const eventIndex = eventStorage.indexOf(eventId);
    const result = eventStorage.splice(eventIndex, 1);

    if (result) {
        console.log(`Event was completely removed!`);
    } else {
        console.warn('Something went wrong!');
    }
}

function updateEventById(eventId, updatedName, updateAdultFlag) {
    let storageEventIndex = eventStorage.findIndex(storageEventIndex => storageEventIndex.id === eventId);

    if (!isValidString(updatedName)) {
        throw new TypeError('Please enter a valid event name!');
    } else {
        eventStorage[storageEventIndex].eventName = updatedName;
    }

    if (!isValidBool(updateAdultFlag)) {
        throw new TypeError('Please enter a valid boolean value');
    } else {
        eventStorage[storageEventIndex].areAdultsAllowed = updateAdultFlag;
    }

    getAllEvents();
}

// Helpers
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}