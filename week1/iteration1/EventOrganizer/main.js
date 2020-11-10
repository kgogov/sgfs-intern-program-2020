// 1. Когато се създаде нова инстанция на този клас да се пушва в масив
// 2. Листва всички събития и цялата информация за тях
// 3. Изтрива събитие по ID и извежда съобщение
// 4. Създава ново събитие
// 5. Ъпдейтва събитие по ID
// 6. Добавяне на клиент към събитие
// 7. Листва висчки клиенти за дадено събитие (възможност за филтър по пол)
// 8. Премахване на клиент от дадено събитие

let eventStorage = [];

// ######## ---PARTY--- ########
function CreateParty(eventName, areAdultsAllowed = true) {

    if (!CreateParty.prototype.isValidString(eventName)) {
        throw new TypeError('Please enter a valid event name!');
    }

    if (!CreateParty.prototype.isValidBool(areAdultsAllowed)) {
        throw new TypeError('Please enter a valid boolean value');
    }

    const event = {
        eventName: `${eventName}`,
        areAdultsAllowed: areAdultsAllowed,
        id: `${CreateParty.prototype.generateID()}`,
        clients: []
    }

    eventStorage.push(event)

    return event;
}

// CreateParty Validators
CreateParty.prototype.isValidString = function(str) {
    return str !== null && 
    typeof str === "string" && 
    str.length > 0;
}

CreateParty.prototype.isValidBool = function(bool) {
    return typeof bool === 'boolean';
}

// ID Generator
CreateParty.prototype.generateID = function() {
    const hex = function(value) {
        return Math.floor(value).toString(16)
    }

    return hex(Date.now() / 1000) +
      ' '.repeat(16).replace(/./g, () => hex(Math.random() * 16))
}


// ######## ---CLIENT--- ########
function CreateClient(firstName, lastName, sex, age) {

    if (!CreateClient.prototype.isNameValid(firstName)) {
        throw new TypeError('Please enter a valid first name!');
    }

    if (!CreateClient.prototype.isNameValid(lastName)) {
        throw new TypeError('Please enter a valid last name!');
    }

    if (!CreateClient.prototype.isSexValid(sex)) {
        throw new TypeError('Please enter a valid gender!');
    }

    if (!CreateClient.prototype.isAgeValidInt(age)) {
        throw new TypeError('Please enter a valid age!')
    }

    const client = {
        // TODO: Capitalize the first letter!
        fullName: `${firstName} ${lastName}`,
        sex: `${sex}`,
        age: age
    }

    return client;
}

// CreateClient Validators
CreateClient.prototype.isNameValid = function(name) {
    return name !== null && 
    typeof name === "string" && 
    name.length > 2;
}

CreateClient.prototype.isSexValid = function(sex) {
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

CreateClient.prototype.isAgeValidInt = function(value) {

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