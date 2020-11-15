const list = document.getElementById('party-list');
const container = document.querySelector('.container');
const form = document.querySelector('#party-form');

function getPartyList() {
    return list;
}

function getPageContainer() {
    return container;
}

function getPartyForm() {
    return form;
}


// Party Constructor
function Party(name, date, isForUnderAged = true, entranceFee = 0) {

    this.ID                 = generatePartyID();
    this.name               = name;
    this.date               = date;
    this.isForUnderAged     = isForUnderAged;
    this.entranceFee        = entranceFee;
    this.isFree             = entranceFee ? false : true;
}

// UI Constructor
function UI() {}

UI.prototype.addPartyToList = function(party) {

    const row = document.createElement('tr');

    // Create new table row
    row.innerHTML = `
        <td>${party.ID}</td>
        <td>${party.name}</td>
        <td>${party.date}</td>
        <td>${party.isForUnderAged}</td>
        <td>${party.entranceFee}</td>
        <td>
            <span class="icon-cog"></span>
            <a href="#" class="update">Update</a>
        </td>
        <td>
            <span class="icon-bin"></span>
            <a href="#" class="delete">Delete</a>
        </td>`

    list.appendChild(row);
}

// Show Alert
UI.prototype.showAlert = function(message, className) {

    const div       = document.createElement('div');
    div.className   = `alert ${className}`;
    div.appendChild(document.createTextNode(message));

    // Insert Alert Before Form
    getPageContainer().insertBefore(div, form);

    setTimeout(function() {
        document.querySelector('.alert').remove();
    }, 2500);
}

// Delete party
UI.prototype.deleteParty = function(target) {
    if (target.className === 'delete') {
        target.parentElement.parentElement.remove();
    }
}

UI.prototype.clearFields = function() {
    // Reset Form Fields
    document.getElementById('name').value           = '';
    document.getElementById('date').value           = '';
    document.getElementById('isForUnderAged').value = '';
    document.getElementById('entranceFee').value    = '';
}

class Store {
    static getParties() {
        let parties;

        if(localStorage.getItem('parties') === null) {
            parties = [];
        } else {
            parties = JSON.parse(localStorage.getItem('parties'));
        }

        return parties;
    }

    static displayParties() {
        const parties = Store.getParties();

        parties.forEach(function(party) {
            const ui = new UI();

            // Add party to UI
            ui.addPartyToList(party);
        });
    }

    static addParty(party) {
        const parties = Store.getParties();

        parties.push(party);

        localStorage.setItem('parties', JSON.stringify(parties));
    }

    static removeParty(ID) {
        const parties = Store.getParties();

        parties.forEach(function(party, index) {
            if(party.ID === ID) {
                parties.splice(index, 1);
            }
        });

        localStorage.setItem('parties', JSON.stringify(parties));
    }
}

// DOM Load Event
document.addEventListener('DOMContentLoaded', Store.displayParties);

// Event listener for add party
document.getElementById('party-form').addEventListener('submit', function(e) {

    const name           = document.getElementById('name').value;
    const date           = document.getElementById('date').value;
    const isForUnderAged = document.getElementById('isForUnderAged').value;
    const entranceFee    = document.getElementById('entranceFee').value;

    const party = new Party(name, date, isForUnderAged, entranceFee);
    const ui = new UI();

    // Some validation
    if (!isStringValid(name) ||
        !date                || 
        !isInt(entranceFee)) {
            ui.showAlert('Please fill in all fields', 'error');

    } else {
        // Add to UI
        ui.addPartyToList(party);
        // Add to localStorage
        Store.addParty(party);

        ui.showAlert('Party added!', 'success');
        ui.clearFields();
    }

    e.preventDefault();
});

// Event listener for delete
document.getElementById('party-list').addEventListener('click', function(e) {

    const ui = new UI();

    if (e.target.className === 'delete') {

        // DOM MAGIC (DO NOT ASK :D) THIS IS JUST A PROTOTYPE!
        const ID = e.target
            .parentElement
            .previousElementSibling
            .previousElementSibling
            .previousElementSibling
            .previousElementSibling
            .previousElementSibling
            .previousElementSibling
                .textContent;

        // Remove from LocalStorage
        Store.removeParty(ID);

        ui.deleteParty(e.target);
        ui.showAlert('Party removed!', 'success');
    }

    e.preventDefault();
});


// Helpers
function generatePartyID() {
    const hex = (value) => {
        return Math.floor(value).toString(16);
    };

    return hex(Date.now() / 1000) +
        ' '.repeat(16).replace(/./g, () => hex(Math.random() * 16));
}

const isInt = (value) => {
    if (isNaN(value)) {
        return false;
    }

    let num = parseFloat(value);
        return (num | 0) === num;
};

const isStringValid = (str) => {
    return str !== null     && 
    typeof str === "string" && 
    str.length > 0;
};