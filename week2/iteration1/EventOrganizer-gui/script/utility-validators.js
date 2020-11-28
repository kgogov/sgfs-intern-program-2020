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