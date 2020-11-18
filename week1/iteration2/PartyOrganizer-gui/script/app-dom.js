let isPartyCreationAllowed = true;
let isClientCreationAllowed = true;

//* Въпрос: да правя ли function wrapper за всички тези input-и
//* Идея: custom side slider menu with different options and modal forms for sorting etc.
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


function getPartyCreationState() {
    return isPartyCreationAllowed;
}

function getClientCreationState() {
    return isClientCreationAllowed;
}


// Configuration
const togglePartyCreation = () => {
    isPartyCreationAllowed = !isPartyCreationAllowed;

    return (isPartyCreationAllowed)                                   ? 
        showAlert('Party creation is enabled!', 'success', partyForm) :
        showAlert('Party creation is disabled!', 'warning', partyForm)
}

const toggleClientCreation = () => {
    isClientCreationAllowed = !isClientCreationAllowed;

    return (isClientCreationAllowed)                                     ?
        showAlert('Client creation is enabled!', 'success', clientForm)  :
        showAlert('Client creation is disabled!', 'warning', clientForm) 
}

// Event listeners for creation togglers state
partyCreationButton.addEventListener('click', togglePartyCreation);
clientCreationButton.addEventListener('click', toggleClientCreation);


function showAlert(message, className, position) {

    const div = document.createElement('div');
    div.className = `alert ${className}`;
    // Create text node
    div.appendChild(document.createTextNode(message));
    // Insert into DOM
    position.insertAdjacentElement('beforebegin', div);

    // Disappear after 3 seconds
    setTimeout(() => {
        document.querySelector('.alert').remove();
    }, 3000);
}

const prefixPartyNames = (party) => {
    let name = party.name;
    return (party.entranceFee == 0)    ? 
        name = `! ${name}`             : 
        name = `$ ${name}`;
}

//! ### Event ####
const renderPartyList = () => {
    // Get current parties
    const partyCollection = PartyManager.getPartyCollection();
    // Empty the table list of any existing data
    partyTableList.innerHTML = "";
    // Rendering the current DOM
    partyCollection.forEach((party, index) => {

        //* Performance upgrade: 
        //* имплементация на StringBuilder: масив --> .push() --> .join() || toString()
        // Според типа на бутона можем да извикаме функция за Update или Delete
        // Друго хубаво упрaжнение: друг файл script-console

        // Различни функции за рендериране
        // Различни функции за манипулация
        // Различни функции за връщане на данни

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


// Utility
const emptyEventFormFields = () => {

    partyInputName.value            = '';
    partyInputIsUnderAged.value     = 'yes';
    partyInputIsOpen.value          = 'yes';
    partyInputDate.value            = '';
    partyInputEntranceFee.value     = 0;
}

const isPartyValid = (name, entrance, date) => {

    if (!name     ||
        !date     ||
        !entrance ||
        entrance < 0) {
        return false;
    }
    return true;
}

const showPartyUpdateButton = () => {
    partyUpdateButton.style.display = "inline-block";
    partyFormSubmit.style.display = "none";
}

const hidePartyUpdateButton = () => {
    partyUpdateButton.style.display = "none";
    partyFormSubmit.style.display = "inline-block";
}

// ACTION
const addNewParty = () => {

    if (!getPartyCreationState()) {
        showAlert('Party creation is disabled!', 'warning', partyForm); return;
    }

    let partyName               = partyInputName.value;
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
    emptyEventFormFields();
    renderPartyList();
}

// ACTION
const updateParty = event => {
    // Receive date from hidden input (returns the value of a specified attribute)
    const partyIndex = event.target.getAttribute('data-update');
    // Get all parties
    const parties = PartyManager.getPartyCollection();
    // Get party index === 'data-update'
    const party = PartyManager.getParty(partyIndex);

    // Get input from form fields
    const name          = partyInputName.value;
    const isUnderAged   = partyInputIsUnderAged.value;
    const isOpen        = partyInputIsOpen.value;
    const entranceFee   = partyInputEntranceFee.value;
    const date          = partyInputDate.value;

    if(!isPartyValid(partyInputName.value, partyInputEntranceFee.value, partyInputDate.value)) {
        showAlert('Please enter correct fields!', 'error', partyForm); 
        hidePartyUpdateButton(); return;
    }

    // Update new object (така не връщам нов обект, и не променям state)
    party.name          = name;
    party.isUnderAged   = isUnderAged;
    party.isOpen        = isOpen;
    party.date          = date;
    party.entranceFee   = entranceFee;
    party.isFree        = entranceFee === 0 ? 'yes' : 'no';

    // Delete and update at the current index at PartyCollection
    parties.splice(partyIndex, 1, party);

    hidePartyUpdateButton();
    showAlert('Party updated successfully!', 'success', partyForm);
    emptyEventFormFields();
    renderPartyList();
}

// updateParty() button listener
partyFormSubmit.addEventListener('click', event => {
    event.preventDefault();
    addNewParty();
});


const fillCurrentPartyFormValues = (name, isUnderAged, entrance, date, isOpen) => {

    partyInputName.value            = name;
    partyInputIsUnderAged.value     = isUnderAged;
    partyInputEntranceFee.value     = entrance
    partyInputDate.value            = date;
    partyInputIsOpen.value          = isOpen;
}


// Event listener for update filling form data
partyTableList.addEventListener('click', e => {

    if (e.target.className === 'action--party-update') {
        // Get data from clicked index row
        const partyIndex = e.target.getAttribute('data-position');
        const party = PartyManager.getParty(partyIndex);
        // Send data to hidden button
        partyUpdateButton.setAttribute('data-update', partyIndex);
        // Using some fancy object destructuring
        const { name, isUnderAged, entranceFee, date, isOpen } = party;

        fillCurrentPartyFormValues(name, isUnderAged, entranceFee, date, isOpen);
        showAlert('Please enter the new fields here!', 'warning', partyForm);

        showPartyUpdateButton();
    }
});

// Event listener for delete
document.getElementById('party-list--layout').addEventListener('click', e => {

    if (e.target.className === 'action--party-delete') {
        // Get data from clicked index row
        const partyIndex = e.target.getAttribute('data-position');
        const parties = PartyManager.getPartyCollection();
        // /remove the element at the current index
        parties.splice(partyIndex, 1);

        showAlert('Party deleted successfully!', 'success', partyForm);
        renderPartyList();
    }
});

// Event listener to update action
document.getElementById('action--update-party').addEventListener('click', updateParty);


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

//* идея: да проверя всички имена с RegEx
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

const emptyClientFormFields = () => {

    clientInputFirstName.value      = '';
    clientInputLastName.value       = '';
    clientGenderSelect.value        = '';
    clientInputAge.value            = '';
    clientInputWallet.value         = '';
}

const showClientUpdateButton = () => {
    clientUpdateButton.style.display = "inline-block";
    clientFormSubmit.style.display = "none";
}

const hideClientUpdateButton = () => {
    clientUpdateButton.style.display = "none";
    clientFormSubmit.style.display = "inline-block";
}

// ACTION
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

// ACTION
const updateClient = event => {

    const clients = ClientManager.getMainClientCollection();
    const clientIndex = event.target.getAttribute('data-update');
    const client = ClientManager.getClient(clientIndex);

    // get values
    const clientFirstName       = clientInputFirstName.value;
    const clientLastName        = clientInputLastName.value;
    const clientGender          = clientGenderSelect.value;
    const clientAge             = clientInputAge.value;
    const clientWallet          = clientInputWallet.value;

    if (!isClientValid(clientFirstName, clientLastName, clientGender, clientAge, clientWallet)) {
        hideClientUpdateButton(); return;
    };

    const clientFullName = `${capitalizeFirstLetter(clientFirstName)} ${capitalizeFirstLetter(clientLastName)}`;
    // Update client
    client.fullName     = clientFullName;
    client.gender       = clientGender;
    client.age          = clientAge;
    client.wallet       = clientWallet;

    // Delete and update at the current index at PartyCollection
    clients.splice(clientIndex, 1, client);

    showAlert('Client updated successfully!', 'success', clientForm);
    emptyClientFormFields();
    hideClientUpdateButton();
    renderClientList();
}

// Event listener update clients (filling form data)
clientTableList.addEventListener('click', e => {
    if (e.target.className === 'action--client-update') {
        // Send data to hidden button
        const clientIndex = e.target.getAttribute('data-position');
        const client = ClientManager.getClient(clientIndex);
        clientUpdateButton.setAttribute('data-update', clientIndex);

        // Using some fancy object destructuring
        const { fullName, gender, age, wallet } = client;

        const clientNames = fullName.split(' ');
        //! Възможност за бъг с тия имена --- така ако клиента въведе повече имена винаги ще взеима първото и последното
        clientInputFirstName.value  = clientNames[0];
        clientInputLastName.value   = clientNames[clientNames.length - 1];
        clientGenderSelect.value    = gender;
        clientInputAge.value        = age;
        clientInputWallet.value     = wallet;

        showAlert('Please enter the new fields here!', 'warning', clientForm)
        showClientUpdateButton();
    }
});


// Event listener for delete clients from UI
clientTableList.addEventListener('click', e => {
    if (e.target.className === 'action--client-delete') {

        const clients = ClientManager.getMainClientCollection();
        const clientIndex = e.target.getAttribute('data-position');
        // /remove the element at the current index
        clients.splice(clientIndex, 1);

        showAlert('Client deleted successfully!', 'success', clientForm);
        renderClientList();
    }
});


// Event listener to update action
document.getElementById('action--update-client').addEventListener('click', updateClient);


// Event listener to add new clients to UI
clientFormSubmit.addEventListener('click', event => {
    event.preventDefault();
    
    addNewClient();
});


const renderModalParties = (collection, layout, filter) => {

    let filteredParties = [];
    layout.innerHTML = '';

    if (!filter || filter === 'noFilter') {
        filteredParties = collection;
    } else {
        filteredParties = collection
            .filter(party => party.isUnderAged === filter);
    }

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
};

// Event listener show modal form select event
clientTableList.addEventListener('click', e => {
    if (e.target.className === 'action--choose-party') {
        
        const modal = document.querySelector('.modal-join-event-layout');
        modal.classList.add('modal-join-event-layout-active');

        const modalExit = document.querySelector('.modal-join-event--exit');

        modalExit.addEventListener('click', () => {
            modal.classList.remove('modal-join-event-layout-active');
        });

        const partyCollection = PartyManager.getPartyCollection();
        const partyModalTableList = document.getElementById('modal-choose-party-list--layout');

        const dropdown = document.getElementById('party-info-sort-by');

        // get client
        const clientIndex = e.target.getAttribute('data-position');
        const client = ClientManager.getClient(clientIndex);

        dropdown.addEventListener("change", () => {
            partyModalTableList.innerHTML = "";
            renderModalParties(partyCollection, partyModalTableList, dropdown.value);
        });

        renderModalParties(partyCollection, partyModalTableList);

        // Attach event listeners to Join buttons
        //! BUG: не им закача нови event listeneri при филтрация 
        const joinButtons = partyModalTableList.querySelectorAll('.action--party-join');

        joinButtons.forEach((button, index) => {
            button.addEventListener('click', () => {
                // get party
                const party = PartyManager.getParty(index);

                if (party.isOpen === 'no') {
                    showAlert(`This event is closed. You cannot sign right now!`, 'warning', partyModalTableList.parentElement); 
                    return;
                }

                if (client.age < 18 && party.isUnderAged === 'no') {
                    showAlert(`You're too young for this event! You cannot sign!`, 'warning', partyModalTableList.parentElement);
                    return;
                }

                // Check if client exists in that event
                if (checkIfIDExists(party.clientCollection, client.ID)) {
                    showAlert(`You cannot sign twice for same event!`, 'warning', partyModalTableList.parentElement);
                    return;
                }

                if (client.partyCounter !== 0 && client.partyCounter % 5 === 0) {
                    
                    client.isVIP = true;
                    client.partyCounter++;
                    ClientManager.storeClientToParty(party, client);

                    showAlert(`Client will not pay for ${party.name}. VIP privileges!`, 'vip-gold', partyModalTableList.parentElement);
                    renderClientList();
                    return;
                }

                client.isVIP = false;
                client.partyCounter++;
                client.wallet -= party.entranceFee;

                ClientManager.storeClientToParty(party, client);

                showAlert(`Client added successfully for ${party.name} event!`, 'success', partyModalTableList.parentElement);
                renderClientList();
                renderPartyList();
            });
        });

        const leaveButtons = partyModalTableList.querySelectorAll('.action--party-leave');

        leaveButtons.forEach((button, index) => {
            button.addEventListener('click', () => {

                let party = PartyManager.getParty(index);
                let clientID = client.ID;

                if (checkIfIDExists(party.clientCollection, clientID)) {

                    party.clientCollection = party.clientCollection
                        .filter(client => client.ID !== clientID);

                    client.partyCounter--;
                    
                    showAlert('You have successfully leaved this event!', 'warning', partyModalTableList.parentElement);

                    renderClientList();
                } else {
                    showAlert('Client not found!', 'error', partyModalTableList.parentElement); return;
                }
            });
        });
    } /* IF ENDS HERE! */
});


const renderModalClientList = (currentParty, layoutList, filter) => {

    layoutList.innerHTML = "";

    let filteredClients = [];

    if (!filter || filter === 'noFilter') {
        filteredClients = currentParty.clientCollection;
    } else {
        filteredClients = currentParty.clientCollection
            .filter(client => client.gender === filter);
    }
    
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

// Modal for event visualizer
partyTableList.addEventListener('click', e => {
    if (e.target.className === 'action--show-client-list') {

        const clientTableList = document.getElementById('modal-client-info-list--layout');
        const modalExit = document.querySelector('.modal-client-info--exit');

        const partyIndex = e.target.getAttribute('data-position');
        const currentParty = PartyManager.getParty(partyIndex);

        const modal = document.querySelector('.modal-client-info--layout');
        modal.classList.add('modal-client-info--layout-active');

        const dropdown = document.querySelector('.client-info-sort-by');

        modalExit.addEventListener('click', () => {
            modal.classList.remove('modal-client-info--layout-active');
        });

        if (currentParty.clientCollection.length === 0) {
            showAlert('There are no clients at this event!', 'warning', clientTableList.parentElement);
        }

        dropdown.addEventListener("change", () => {
            clientTableList.innerHTML = "";
            renderModalClientList(currentParty, clientTableList, dropdown.value);
        });

        renderModalClientList(currentParty, clientTableList);

    } /* if ends  ere*/
});


// Initial rendering
renderClientList();
renderPartyList();