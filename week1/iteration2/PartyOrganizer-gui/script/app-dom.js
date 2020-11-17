// Party DOM Selectors
let partyTableList      = document.getElementById('party-list--layout');
let partyForm           = document.getElementById('party-form');
let partyNameInput      = document.querySelector('input[name="input--party-name"]');
let partyEntranceFee    = document.querySelector('input[name="input--entranceFee"]');
let partyIsUnderAged    = document.querySelector('select[name="select--party-isForUnderAged"]');
let partyDatePicker     = document.querySelector('input[name="input--party-date"]');
let partyIsOpen         = document.querySelector('select[name="select--party-isOpenForClients"]');
let partyFormSubmit     = document.getElementById('action--submit-party');
let partyUpdateButton   = document.getElementById('action--update-party');


// PARTY PART!
const renderPartyList = () => {

    const partyCollection = PartyManager.getPartyCollection();

    // Empty the table list of any existing data
    partyTableList.innerHTML = "";
    // Rendering the current DOM
    partyCollection.forEach((party, index) => {

        // Тук мищо прави масив като StringBuilder и след това го join-ва
        const rowTemplate = document.createElement('tr');
        rowTemplate.innerHTML = `
            <td>${party.name}</td>
            <td>${party.isUnderAged}</td>
            <td>${party.date}</td>
            <td>${party.entranceFee}</td>
            <td>${party.isOpen}</td>
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

        // Според типа на бутона можем да извикаме функция за Update или Delete
        // Друго хубаво упржнение: друг файл script-console

        // Различни функции за рендериране
        // Различни функции за манипулация
        // Различни функции за връщане на данни
    });
};

// ACTION
const addNewParty = () => {

    const partyName                = partyNameInput.value;
    const partyisUnderAged         = partyIsUnderAged.value;
    const partyisOpen              = partyIsOpen.value;
    const partyDate                = partyDatePicker.value;
    const partyEntrance            = partyEntranceFee.value;

    //* Задължително валидация!

    //! Тук мога да правя валидация!

    if (!partyName || !partyEntrance || !partyDate || partyEntrance < 0) {
        // Show alert
        showAlert('Please fill in all fields', 'error', partyForm);
        return;
    }

    PartyManager.storeParty(createParty({
        name            : partyName,
        isUnderAged     : partyisUnderAged,
        isOpen          : partyisOpen,
        date            : partyDate,
        entranceFee     : partyEntrance
    }));

    // Show green alert
    showAlert('Party added successfully', 'success', partyForm);

    //* Нулиране на инпутите след създаване на ново събитие
    partyNameInput.value = '';
    partyIsUnderAged.value = 'yes';
    partyIsOpen.value = 'yes';
    partyDatePicker.value = '';
    partyEntranceFee.value = 0;

    renderPartyList();
}

// ACTION
const updateParty = event => {
    const partyIndex = event.target.getAttribute('data-update');

    //* Трябва да има и валидация!!

    if (!partyNameInput.value || 
        !partyEntranceFee.value || 
        partyEntranceFee.value < 0 || 
        !partyDatePicker.value) {
            showAlert('Please enter correct fields!', 'error');

            // Тук отново трябва да се върнат полетата на default стойностите

            partyUpdateButton.style.display = "none";
            partyFormSubmit.style.display = "inline-block";

            return;
        }

    // Get global data
    const parties = PartyManager.getPartyCollection();
    const party = PartyManager.getParty(partyIndex);

    // Create new object
    const name = partyNameInput.value;
    const isUnderAged = partyIsUnderAged.value;
    const isOpen = partyIsOpen.value;
    const entranceFee = partyEntranceFee.value;
    const date = partyDatePicker.value;
    
    // Update new object
    party.name = name;
    party.isUnderAged = isUnderAged;
    party.isOpen = isOpen;
    party.date = date;
    party.entranceFee = entranceFee;
    party.isFree = entranceFee ? false : true;

    // Delete and update at the current index at PartyCollection
    parties.splice(partyIndex, 1, party);

    // Show Success
    showAlert('Party updated successfully!', 'success', partyForm);

    partyUpdateButton.style.display = "none";
    partyFormSubmit.style.display = "inline-block";

    renderPartyList();

}

// Create Add party event listener
partyFormSubmit.addEventListener('click', event => {
    event.preventDefault();
    
    addNewParty();
});


// Event listener for update filling form data
partyTableList.addEventListener('click', e => {
    if (e.target.className === 'action--party-update') {

        const partyIndex = e.target.getAttribute('data-position');
        const party = PartyManager.getParty(partyIndex);

        // Using some fancy object destructuring
        const { name, isUnderAged, entranceFee, date, isOpen } = party;

        // Fill party form values with the current object values
        // Може и в отделна функция да се изнесят: clean code
        partyNameInput.value = name;
        partyIsUnderAged.value = isUnderAged;
        partyIsOpen.value = isOpen;
        partyDatePicker.value = date;
        partyEntranceFee.value = entranceFee;

        showAlert('Please enter the new fields here!', 'warning', partyForm)

        // Send data to hidden button
        partyUpdateButton.setAttribute('data-update', partyIndex);
        partyUpdateButton.style.display = "inline-block";

        // Disable other button
        partyFormSubmit.style.display = "none";

    }
});

// Event listener for delete
document.getElementById('party-list--layout').addEventListener('click', e => {
    if (e.target.className === 'action--party-delete') {

        const partyIndex = e.target.getAttribute('data-position');

        const parties = PartyManager.getPartyCollection();
        // /remove the element at the current index
        parties.splice(partyIndex, 1);

        renderPartyList();
    }
});

// Event listener to update action
document.getElementById('action--update-party').addEventListener('click', updateParty);


// renderPartyList(); // initial rendering of the data


// Alert
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


// CLIENT PART!
let clientTableList      = document.getElementById('client-list--layout');
let clientForm           = document.getElementById('client-form');
let clientInputFirstName = document.querySelector('input[name="input--client-firstName"]');
let clientInputLastName  = document.querySelector('input[name="input--client-lastName"]');
let clientGenderSelect   = document.querySelector('select[name="select--client-gender"]')
let clientInputAge       = document.querySelector('input[name="input--client-age"]');
let clientInputWallet    = document.querySelector('input[name="input--client-wallet"]');
let clientFormSubmit     = document.getElementById('action--submit-client');
let clientUpdateButton   = document.getElementById('action--update-client');


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

// ACTION
const addNewClient = () => {

    const clientFirstName       = clientInputFirstName.value;
    const clientLastName        = clientInputLastName.value;
    const clientGender          = clientGenderSelect.value;
    const clientAge             = clientInputAge.value;
    const clientWallet          = clientInputWallet.value;

    if ( 
        !clientFirstName             ||
        !clientLastName              ||
        !clientGender                ||
        !clientAge || clientAge < 16 ||
        !clientWallet || clientWallet < 0) {
            showAlert('Please fill in all fields', 'error', clientForm);
            return;
        }

    let clientFullName = `${capitalizeFirstLetter(clientFirstName)} ${capitalizeFirstLetter(clientLastName)}`;

    ClientManager.storeClient(createClient({
        fullName : clientFullName,
        gender   : clientGender,
        age      : clientAge,
        wallet   : clientWallet
    }));

    showAlert('Client added successfully', 'success', clientForm);

    clientInputFirstName.value = '';
    clientInputLastName.value  = '';
    clientGenderSelect.value   = '';
    clientInputAge.value       = '';
    clientInputWallet.value    = '';

    renderClientList();
}

// ACTION
const updateClient = event => {
    const clientIndex = event.target.getAttribute('data-update');

    // Get global data
    const clients = ClientManager.getMainClientCollection();
    const client = ClientManager.getClient(clientIndex);

    // Create new object
    const clientFirstName       = clientInputFirstName.value;
    const clientLastName        = clientInputLastName.value;
    const clientGender          = clientGenderSelect.value;
    const clientAge             = clientInputAge.value;
    const clientWallet          = clientInputWallet.value;

    //* Трябва да има и валидация!!

    if ( 
        !clientFirstName             ||
        !clientLastName              ||
        !clientGender                ||
        !clientAge || clientAge < 16 ||
        !clientWallet || clientWallet < 0) {
            showAlert('Please fill in all fields', 'error', clientForm);

            clientUpdateButton.style.display = "none";
            clientFormSubmit.style.display = "inline-block";
            return;
        }

    const clientFullName        = `${capitalizeFirstLetter(clientFirstName)} ${capitalizeFirstLetter(clientLastName)}`;
    
    // Update new object
    client.fullName = clientFullName;
    client.gender = clientGender;
    client.age = clientAge;
    client.wallet = clientWallet;

    // Delete and update at the current index at PartyCollection
    clients.splice(clientIndex, 1, client);

    // Show Success
    showAlert('Client updated successfully!', 'success', clientForm);

    clientUpdateButton.style.display = "none";
    clientFormSubmit.style.display = "inline-block";

    renderClientList();
}

// Event listener update clients (filling form data)
clientTableList.addEventListener('click', e => {
    if (e.target.className === 'action--client-update') {

        const clientIndex = e.target.getAttribute('data-position');
        const client = ClientManager.getClient(clientIndex);

        // Using some fancy object destructuring
        const { fullName, gender, age, wallet } = client;

        const clientNames = fullName.split(' ');

        // Fill party form values with the current object values
        // Може и в отделна функция да се изнесят: clean code

        // Възможност за бъггг с тия имена
        clientInputFirstName.value = clientNames[0];
        clientInputLastName.value = clientNames[1];

        clientGenderSelect.value = gender;
        clientInputAge.value = age;
        clientInputWallet.value = wallet;

        showAlert('Please enter the new fields here!', 'warning', clientForm)

        // Send data to hidden button
        clientUpdateButton.setAttribute('data-update', clientIndex);
        clientUpdateButton.style.display = "inline-block";

        // Disable other button
        clientFormSubmit.style.display = "none";
    }
});


// Event listener to update action
document.getElementById('action--update-client').addEventListener('click', updateClient);


// Event listener to add new clients to UI
clientFormSubmit.addEventListener('click', event => {
    event.preventDefault();
    
    addNewClient();
    
});

// Event listener for delete clients from UI
clientTableList.addEventListener('click', e => {
    if (e.target.className === 'action--client-delete') {

        const clientIndex = e.target.getAttribute('data-position');

        const clients = ClientManager.getMainClientCollection();
        // /remove the element at the current index
        clients.splice(clientIndex, 1);

        renderClientList();
    }
});

// renderClientList(); // initial rendering