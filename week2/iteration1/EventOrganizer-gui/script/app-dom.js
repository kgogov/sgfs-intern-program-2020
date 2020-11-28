// Party DOM Selectors
let partyTableList           = document.getElementById('party-list--layout');
let partyForm                = document.getElementById('party-form');
let partyInputName           = document.querySelector('input[name="input--party-name"]');
let partyInputEntranceFee    = document.querySelector('input[name="input--entranceFee"]');
let partyInputIsUnderAged    = document.querySelector('select[name="select--party-isForUnderAged"]');
let partyInputDate           = document.querySelector('input[name="input--party-date"]');
let partyInputIsOpen         = document.querySelector('select[name="select--party-isOpenForClients"]');
let partyFormSubmit          = document.getElementById('action--submit-party');
let partyUpdateButton        = document.getElementById('action--update-party');

// Client DOM Selectors
let clientTableList          = document.getElementById('client-list--layout');
let clientForm               = document.getElementById('client-form');
let clientInputFirstName     = document.querySelector('input[name="input--client-firstName"]');
let clientInputLastName      = document.querySelector('input[name="input--client-lastName"]');
let clientGenderSelect       = document.querySelector('select[name="select--client-gender"]')
let clientInputAge           = document.querySelector('input[name="input--client-age"]');
let clientInputWallet        = document.querySelector('input[name="input--client-wallet"]');
let clientFormSubmit         = document.getElementById('action--submit-client');
let clientUpdateButton       = document.getElementById('action--update-client');

// State togglers
const partyCreationButton   = document.getElementById('action--toggle-event-creation');
const clientCreationButton   = document.getElementById('action--toggle-client-creation');

const showAlert = function(message, className, position) {

    const div = document.createElement('div');
    div.className = `alert ${className}`;
    div.appendChild(document.createTextNode(message));

    position.insertAdjacentElement('beforebegin', div);
    
    //* Fat operation 
    setTimeout(() => {
        document.querySelector('.alert').remove();
    }, 3000);
}


// DOM Utility
const togglePartyCreation = () => {
    isPartyCreationAllowed = !isPartyCreationAllowed;

    if (isPartyCreationAllowed) {
        enablePartyInputs();
        showAlert('Party creation is enabled!', 'success', partyForm); return;
    }

    disablePartyInputs();
    showAlert('Party creation is disabled!', 'warning', partyForm)
}

const toggleClientCreation = () => {
    isClientCreationAllowed = !isClientCreationAllowed;

    if (isClientCreationAllowed) {
        enableClientInputs();
        showAlert('Client creation is enabled!', 'success', clientForm); return;
    }

    disableClientInputs();
    showAlert('Client creation is disabled!', 'warning', clientForm);
}

const disablePartyInputs = () => {
    partyInputName.disabled         = true;
    partyInputEntranceFee.disabled  = true;
    partyInputDate.disabled         = true;
    partyInputIsUnderAged.disabled  = true;
    partyInputIsOpen.disabled       = true;
}

const enablePartyInputs = () => {
    partyInputName.disabled         = false;
    partyInputEntranceFee.disabled  = false;
    partyInputDate.disabled         = false;
    partyInputIsUnderAged.disabled  = false;
    partyInputIsOpen.disabled       = false;
}

const disableClientInputs = () => {
    clientInputFirstName.disabled = true;
    clientInputLastName.disabled  = true;
    clientGenderSelect.disabled   = true;
    clientInputAge.disabled       = true;
    clientInputWallet.disabled    = true;
}

const enableClientInputs = () => {
    clientInputFirstName.disabled = false;
    clientInputLastName.disabled  = false;
    clientGenderSelect.disabled   = false;
    clientInputAge.disabled       = false;
    clientInputWallet.disabled    = false;
}

// Party DOM Utility
const emptyPartyFormFields = () => {

    partyInputName.value            = '';
    partyInputIsUnderAged.value     = 'true';
    partyInputIsOpen.value          = 'true';
    partyInputDate.value            = '';
    partyInputEntranceFee.value     = '0';
}

// Party DOM Utility
const fillCurrentPartyFormValues = (name, isUnderAged, entrance, date, isOpen) => {

    partyInputName.value            = name;
    partyInputIsUnderAged.value     = isUnderAged;
    partyInputEntranceFee.value     = entrance
    partyInputDate.value            = date;
    partyInputIsOpen.value          = isOpen;
}

// Party DOM Utility
const showPartyUpdateButton = () => {
    partyUpdateButton.style.display = "inline-block";
    partyFormSubmit.style.display = "none";
}

// Party DOM Utility
const hidePartyUpdateButton = () => {
    partyUpdateButton.style.display = "none";
    partyFormSubmit.style.display = "inline-block";
}


// Client DOM Utility
const emptyClientFormFields = () => {

    clientInputFirstName.value      = '';
    clientInputLastName.value       = '';
    clientGenderSelect.value        = '';
    clientInputAge.value            = '';
    clientInputWallet.value         = '';
}

// Client DOM Utility
const fillCurrentClientFormValues = (fullName, gender, age, wallet) => {

    const clientNames = fullName.split(' ');

    clientInputFirstName.value  = clientNames[0];
    clientInputLastName.value   = clientNames[clientNames.length - 1];
    clientGenderSelect.value    = gender;
    clientInputAge.value        = age;
    clientInputWallet.value     = wallet;
}

// Client DOM Utility
const showClientUpdateButton = () => {
    clientUpdateButton.style.display = "inline-block";
    clientFormSubmit.style.display = "none";
}

// Client DOM Utility
const hideClientUpdateButton = () => {
    clientUpdateButton.style.display = "none";
    clientFormSubmit.style.display = "inline-block";
}



//! ### Party ### 
const renderPartyList = () => {

    const partyCollection = PartyManager.getPartyCollection();

    partyTableList.innerHTML = "";

    partyCollection.forEach((party, index) => {
        const rowTemplate = document.createElement('tr');
        
        rowTemplate.innerHTML = `
            <td>${prefixPartyNames(party)}</td>
            <td>${party.isUnderAged}</td>
            <td>${party.date}</td>
            <td>${party.entranceFee}</td>
            <td>${party.isOpen}</td>
            <td>${party.clientCollection.length}</td>
            <td>
                <span class="icon-user-tie"></span>
                <a 
                    href="#" 
                    class="action--show-client-list"
                    data-position="${index}">
                    Info
                </a>
            </td>
            <td>
                <span class="icon-loop2"></span>
                <a 
                    href="#" 
                    class="action--party-update"
                    data-position="${index}">
                    Update
                </a>
            </td>
            <td>
                <span class="icon-bin"></span>
                <a 
                    href="#" 
                    class="action--party-delete"
                    data-position="${index}">
                    Delete
                </a>
            </td>`;
        
        partyTableList.appendChild(rowTemplate);
    });
};


const addNewParty = () => {

    if (!getPartyCreationState()) {
        showAlert('Party creation is disabled!', 'warning', partyForm); return;
    }

    const partyName             = partyInputName.value;
    const partyIsUnderAged      = partyInputIsUnderAged.value;
    const partyIsOpen           = partyInputIsOpen.value;
    const partyDate             = partyInputDate.value;
    const partyEntrance         = partyInputEntranceFee.value;

    if(!isPartyValid(partyName, partyEntrance, partyDate)) {
        showAlert('Please fill in all fields', 'error', partyForm); return;
    }

    PartyManager.storeParty(createParty(
        {
            name            : partyName,
            isUnderAged     : partyIsUnderAged,
            isOpen          : partyIsOpen,
            date            : partyDate,
            entranceFee     : partyEntrance
        }
    ));

    showAlert('Party added successfully', 'success', partyForm);
    emptyPartyFormFields();
    renderPartyList();
}


const updateParty = event => {

    const partyIndex = event.target.getAttribute('data-update');
    const parties = PartyManager.getPartyCollection();
    const party = PartyManager.getParty(partyIndex);

    const name          = partyInputName.value;
    const isUnderAged   = partyInputIsUnderAged.value;
    const isOpen        = partyInputIsOpen.value;
    const entranceFee   = partyInputEntranceFee.value;
    const date          = partyInputDate.value;

    if(!isPartyValid(partyInputName.value, partyInputEntranceFee.value, partyInputDate.value)) {
        showAlert('Please enter correct fields!', 'error', partyForm); 
        hidePartyUpdateButton(); return;
    }

    party.name          = name;
    party.isUnderAged   = isUnderAged === 'true' ? 'yes' : 'no';
    party.isOpen        = isOpen      === 'true' ? 'yes' : 'no';
    party.date          = date;
    party.entranceFee   = entranceFee;
    party.isFree        = entranceFee === "0" ? 'yes' : 'no';

    // Delete and update at the current index at PartyCollection
    parties.splice(partyIndex, 1, party);

    hidePartyUpdateButton();
    emptyPartyFormFields();
    showAlert('Party updated successfully!', 'success', partyForm);
    renderPartyList();
}




//! ### Client ### 
const renderClientList = () => {

    const clientCollection = ClientManager.getMainClientCollection();

    clientTableList.innerHTML = "";

    clientCollection.forEach((client, index) => {
        const rowTemplate = document.createElement('tr');

        rowTemplate.innerHTML = `
            <td>${client.fullName}</td>
            <td>${client.gender}</td>
            <td>${client.age}</td>
            <td>${client.wallet}</td>
            <td>${client.partyCounter}</td>
            <td>${client.isVIP}</td>
            <td>
                <span class="icon-glass2"></span>
                <a 
                    href="#" 
                    class="action--choose-party"
                    data-position="${index}">
                    Join Event
                </a>
            </td>
            <td>
                <span class="icon-loop2"></span>
                <a 
                    href="#" 
                    class="action--client-update"
                    data-position="${index}">
                    Update
                </a>
            </td>
            <td>
                <span class="icon-bin"></span>
                <a 
                    href="#" 
                    class="action--client-delete"
                    data-position="${index}">
                    Delete
                </a>
            </td>`;

        clientTableList.appendChild(rowTemplate);
    });
}


const addNewClient = () => {

    if (!getClientCreationState()) {
        showAlert('Client creation is disabled!', 'warning', clientForm); return;
    }

    const clientFirstName       = clientInputFirstName.value;
    const clientLastName        = clientInputLastName.value;
    const clientGender          = clientGenderSelect.value;
    const clientAge             = clientInputAge.value;
    const clientWallet          = clientInputWallet.value;

    if (!isClientValid(clientFirstName, clientLastName, clientGender, clientAge, clientWallet)) {
        showAlert('Please fill in all fields', 'error', clientForm); return;
    }

    let clientFullName = `${capitalizeFirstLetter(clientFirstName)} ${capitalizeFirstLetter(clientLastName)}`;

    ClientManager.storeClient(createClient({
        fullName : clientFullName,
        gender   : clientGender,
        age      : clientAge,
        wallet   : clientWallet
    }));

    showAlert('Client added successfully', 'success', clientForm);
    emptyClientFormFields();
    renderClientList();
}


const updateClient = event => {

    const clients = ClientManager.getMainClientCollection();
    const clientIndex = event.target.getAttribute('data-update');
    const client = ClientManager.getClient(clientIndex);


    const clientFirstName       = clientInputFirstName.value;
    const clientLastName        = clientInputLastName.value;
    const clientGender          = clientGenderSelect.value;
    const clientAge             = clientInputAge.value;
    const clientWallet          = clientInputWallet.value;

    if (!isClientValid(clientFirstName, clientLastName, clientGender, clientAge, clientWallet)) {
        hideClientUpdateButton(); return;
    };

    const clientFullName = `${capitalizeFirstLetter(clientFirstName)} ${capitalizeFirstLetter(clientLastName)}`;

    client.fullName     = clientFullName;
    client.gender       = clientGender;
    client.age          = clientAge;
    client.wallet       = clientWallet;

    clients.splice(clientIndex, 1, client);

    hideClientUpdateButton();
    emptyClientFormFields();
    showAlert('Client updated successfully!', 'success', clientForm);
    renderClientList();
}



const getFilteredClientCollection = (party, filter) => {
    if (filter === 'noFilter') return party.clientCollection;
    return (filter) ? party.clientCollection.filter(client => client.gender === filter) : party.clientCollection;
}


const getFilteredPartyCollection = (collection, filter) => {
    if (filter === 'forUnderAged')  return collection.filter(party => party.isUnderAged === 'yes');
    if (filter === 'forAdults')     return collection.filter(party => party.isUnderAged === 'no');
    if (filter === 'free')          return collection.filter(party => party.isFree === 'yes');
    if (filter === 'paid')          return collection.filter(party => party.isFree === 'no');
    if (filter === 'open')          return collection.filter(party => party.isOpen === 'yes');
    if (filter === 'closed')        return collection.filter(party => party.isOpen === 'no');

    return collection;
}


// First Modal Form
const renderModalClientList = (currentParty, layoutList, filter) => {
    
    let filteredClients = getFilteredClientCollection(currentParty, filter);

    layoutList.innerHTML = "";
    
    filteredClients.forEach(client => {
        const rowTemplate = document.createElement('tr');

        rowTemplate.innerHTML = `
            <td>${client.fullName}</td>
            <td>${client.gender}</td>
            <td>${client.age}</td>
            <td>${client.isVIP}</td>
        `;

        layoutList.appendChild(rowTemplate);
    }
)};



// Second Modal Form
const renderModalParties = (collection, layout, client, filter) => {

    let filteredParties = getFilteredPartyCollection(collection, filter);

    layout.innerHTML = '';

    filteredParties.forEach((party, index) => {
        const rowTemplate = document.createElement('tr');

        rowTemplate.innerHTML =`
            <td>${prefixPartyNames(party)}</td>
            <td>${party.isUnderAged}</td>
            <td>${party.date}</td>
            <td>${party.entranceFee}</td>
            <td>${party.isOpen}</td>
            <td>
                <span class="icon-plus"></span>
                <a 
                    href="#" 
                    class="action--party-join"
                    data-position="${index}">
                    Join
                </a>
            </td>
            <td>
                <span class="icon-minus"></span>
                <a 
                    href="#" 
                    class="action--party-leave"
                    data-position="${index}">
                    Leave
                </a>
            </td>`;

        layout.appendChild(rowTemplate);
    });

    // After rendering
    const joinButtons = layout.querySelectorAll('.action--party-join');
    const leaveButtons = layout.querySelectorAll('.action--party-leave');

    joinButtons.forEach((button, index) => {
        button.addEventListener('click', () => {

            const party = PartyManager.getParty(index);
            const isClientUnderAged = client.age < 18 && party.isUnderAged === 'no';
            const isClientVIP       = client.partyCounter !== 0 && client.partyCounter % 5 === 0;

            if (party.isOpen === 'no') {
                return showAlert(`This event is closed. You cannot sign right now!`, 'warning', layout.parentElement); 
            }

            if (isClientUnderAged) {
                return showAlert(`You're too young for this event! You cannot sign!`, 'warning', layout.parentElement);
            }

            if (checkIfIDExists(party.clientCollection, client.ID)) {
                return showAlert(`You cannot sign twice for same event!`, 'warning', layout.parentElement);
            }

            if (isClientVIP) {
                
                client.isVIP = true;
                client.partyCounter++;
                ClientManager.storeClientToParty(party, client);

                showAlert(`Client will not pay for ${party.name}. VIP privileges!`, 'vip-gold', layout.parentElement);
                renderClientList();
                return;
            }

            if (+client.wallet < +party.entranceFee) {
                return showAlert(`Not enough money!`, 'warning', layout.parentElement);
            }

            client.isVIP = false;
            client.partyCounter++;
            client.wallet -= party.entranceFee;

            ClientManager.storeClientToParty(party, client);

            showAlert(`Client added successfully for ${party.name} event!`, 'success', layout.parentElement);
            renderClientList();
            renderPartyList();
        });
    });


    leaveButtons.forEach((button, index) => {
        button.addEventListener('click', () => {

            let party = PartyManager.getParty(index);
            let clientID = client.ID;

            if (checkIfIDExists(party.clientCollection, clientID)) {

                party.clientCollection = party.clientCollection
                    .filter(client => client.ID !== clientID);

                client.partyCounter--;
                
                showAlert('You have successfully leaved this event!', 'warning', layout.parentElement);

                renderPartyList();
                renderClientList();
                return;
            }

            return showAlert('Client not found!', 'error', layout.parentElement);
        });
    });
};


//! EVENT LISTENERS

// Toggler Creation
partyCreationButton.addEventListener('click', togglePartyCreation);
clientCreationButton.addEventListener('click', toggleClientCreation);


//* Modal - SHOW CLIENTS - Info
partyTableList.addEventListener('click', e => {
    if (e.target.className === 'action--show-client-list') {

        const partyIndex = e.target.getAttribute('data-position');
        const currentParty = PartyManager.getParty(partyIndex);

        const clientTableList = document.getElementById('modal-client-info-list--layout');
        const modalExit = document.querySelector('.modal-client-info--exit');

        const modal = document.querySelector('.modal-client-info--layout');
        modal.classList.add('modal-client-info--layout-active');

        const dropdown = document.querySelector('.client-info-sort-by');

        if (currentParty.clientCollection.length === 0) {
            showAlert('There are no clients at this event!', 'warning', clientTableList.parentElement);
        }

        dropdown.addEventListener("change", () => {
            clientTableList.innerHTML = "";
            renderModalClientList(currentParty, clientTableList, dropdown.value);
        });

        modalExit.addEventListener('click', () => {
            modal.classList.remove('modal-client-info--layout-active');
        });

        // Initial rendering without filter
        renderModalClientList(currentParty, clientTableList);
    }
});



//* Modal - SHOW PARTIES - Join Event
clientTableList.addEventListener('click', e => {
    if (e.target.className === 'action--choose-party') {

        const partyCollection = PartyManager.getPartyCollection();
        const partyModalTableList = document.getElementById('modal-choose-party-list--layout');

        const clientIndex = e.target.getAttribute('data-position');
        const client = ClientManager.getClient(clientIndex);
        
        const modal = document.querySelector('.modal-join-event-layout');
        modal.classList.add('modal-join-event-layout-active');

        const dropdown = document.getElementById('party-info-sort-by');

        const modalExit = document.querySelector('.modal-join-event--exit');

        modalExit.addEventListener('click', () => {
            modal.classList.remove('modal-join-event-layout-active');
        });

        dropdown.addEventListener("change", () => {
            partyModalTableList.innerHTML = "";
            renderModalParties(partyCollection, partyModalTableList, client, dropdown.value);
        });

        // Initial rendering without filter
        renderModalParties(partyCollection, partyModalTableList, client);
    }
});


// Event listener to add new parties to UI
partyFormSubmit.addEventListener('click', event => {
    event.preventDefault();
    addNewParty();
});


// Event listener to add new clients to UI
clientFormSubmit.addEventListener('click', event => {
    event.preventDefault();
    addNewClient();
});


// PARTY: filling form data
partyTableList.addEventListener('click', e => {

    if (e.target.className !== 'action--party-update') {
        return;
    }

    const partyIndex = e.target.getAttribute('data-position');
    const party = PartyManager.getParty(partyIndex);

    partyUpdateButton.setAttribute('data-update', partyIndex);

    const { name, isUnderAged, entranceFee, date, isOpen } = party;

    fillCurrentPartyFormValues(name, isUnderAged, entranceFee, date, isOpen);
    showAlert('Please enter the new fields here!', 'warning', partyForm);
    showPartyUpdateButton();
});

// CLIENT: filling form data
clientTableList.addEventListener('click', e => {
    if (e.target.className !== 'action--client-update') {
        return;
    }

    const clientIndex = e.target.getAttribute('data-position');
    const client = ClientManager.getClient(clientIndex);

    clientUpdateButton.setAttribute('data-update', clientIndex);

    const { fullName, gender, age, wallet } = client;

    fillCurrentClientFormValues(fullName, gender, age, wallet);
    showAlert('Please enter the new fields here!', 'warning', clientForm)
    showClientUpdateButton();
});

// DELETE parties FROM DOM
partyTableList.addEventListener('click', e => {

    if (e.target.className !== 'action--party-delete') {
        return;
    }

    const partyIndex = e.target.getAttribute('data-position');
    const parties = PartyManager.getPartyCollection();

    parties.splice(partyIndex, 1);

    showAlert('Party deleted successfully!', 'success', partyForm);
    renderPartyList();
});

// DELETE clients FROM DOM
clientTableList.addEventListener('click', e => {

    if (e.target.className !== 'action--client-delete') {
        return;
    }

    const clients = ClientManager.getMainClientCollection();
    const clientIndex = e.target.getAttribute('data-position');

    clients.splice(clientIndex, 1);

    showAlert('Client deleted successfully!', 'success', clientForm);
    renderClientList();
});

// UPDATE parties
document.getElementById('action--update-party').addEventListener('click', updateParty);

// UPDATE clients
document.getElementById('action--update-client').addEventListener('click', updateClient);

// Initial rendering
renderClientList();
renderPartyList();