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

const emptyClientFormFields = () => {

}

const validateParty = (name, entrance, date) => {
    if (!name     ||
        !date     ||
        !entrance ||
        entrance < 0) {
        return false;
    }
    return true;
}

// ACTION
const addNewParty = () => {

    const partyName             = partyInputName.value;
    const partyIsUnderAged      = partyInputIsUnderAged.value;
    const partyIsOpen           = partyInputIsOpen.value;
    const partyDate             = partyInputDate.value;
    const partyEntrance         = partyInputEntranceFee.value;

    if(!validateParty(partyName, partyEntrance, partyDate)) {
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
    // Receive date from hidden input
    const partyIndex = event.target.getAttribute('data-update');
    // Get all parties
    const parties = PartyManager.getPartyCollection();
    // Get party index from data button input
    const party = PartyManager.getParty(partyIndex);

    // Create new object
    const name          = partyInputName.value;
    const isUnderAged   = partyInputIsUnderAged.value;
    const isOpen        = partyInputIsOpen.value;
    const entranceFee   = partyInputEntranceFee.value;
    const date          = partyInputDate.value;

    if(!validateParty(partyInputName.value, partyInputEntranceFee.value, partyInputDate.value)) {
        showAlert('Please enter correct fields!', 'error');

        partyUpdateButton.style.display = "none";
        partyFormSubmit.style.display = "inline-block";
        return;
    }
    // Update new object
    party.name          = name;
    party.isUnderAged   = isUnderAged;
    party.isOpen        = isOpen;
    party.date          = date;
    party.entranceFee   = entranceFee;
    party.isFree        = entranceFee === 0 ? 'yes' : 'no';

    // Delete and update at the current index at PartyCollection
    parties.splice(partyIndex, 1, party);
    //* Get default styling - може да се изнесат в отделните функция като toggle
    partyUpdateButton.style.display = "none";
    partyFormSubmit.style.display = "inline-block";

    showAlert('Party updated successfully!', 'success', partyForm);
    emptyEventFormFields();
    renderPartyList();
}

// updateParty() button listener
partyFormSubmit.addEventListener('click', event => {
    event.preventDefault();
    
    addNewParty();
});

//! до тук съм с рефакторинга


// Event listener for update filling form data
partyTableList.addEventListener('click', e => {
    if (e.target.className === 'action--party-update') {

        const partyIndex = e.target.getAttribute('data-position');
        const party = PartyManager.getParty(partyIndex);

        // Using some fancy object destructuring
        const { name, isUnderAged, entranceFee, date, isOpen } = party;

        // Fill party form values with the current object values
        // Може и в отделна функция да се изнесят: clean code
        partyInputName.value = name;
        partyInputIsUnderAged.value = isUnderAged;
        partyInputIsOpen.value = isOpen;
        partyInputDate.value = date;
        partyInputEntranceFee.value = entranceFee;

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

        showAlert('Party deleted successfully!', 'success', partyForm);

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
                    Event menu
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

    //* Нулиране
    clientInputFirstName.value = '';
    clientInputLastName.value  = '';
    clientGenderSelect.value   = '';
    clientInputAge.value       = '';
    clientInputWallet.value    = '';

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

// Event listener for delete clients from UI
clientTableList.addEventListener('click', e => {
    if (e.target.className === 'action--client-delete') {

        const clientIndex = e.target.getAttribute('data-position');

        const clients = ClientManager.getMainClientCollection();
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

// Event listener show modal form select event
clientTableList.addEventListener('click', e => {
    if (e.target.className === 'action--choose-party') {
        
        const modal = document.querySelector('.modal-layout');
        modal.classList.add('modal-layout-active');

        const modalExit = document.querySelector('.modal--exit');

        modalExit.addEventListener('click', () => {
            modal.classList.remove('modal-layout-active');
        })

        // Render
        const partyCollection = PartyManager.getPartyCollection();
        const partyTableList = document.getElementById('choose-party-list--layout');
        
        partyTableList.innerHTML = "";

        // Render Party Table List
        partyCollection.forEach((party, index) => {

            const rowTemplate = document.createElement('tr');
            rowTemplate.innerHTML =`
                <td>${party.name}</td>
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

            partyTableList.appendChild(rowTemplate);
        });

        // get client
        const clientIndex = e.target.getAttribute('data-position');
        const client = ClientManager.getClient(clientIndex);

        // Attach event listeners to Join buttons
        const joinButtons = partyTableList.querySelectorAll('.action--party-join');

        joinButtons.forEach((button, index) => {
            button.addEventListener('click', () => {
                // get party
                const party = PartyManager.getParty(index);

                // Check if client exists in that event
                if (checkIfIDExists(party.clientCollection, client.ID)) {

                    showAlert(`You cannot sign twice for same event!`, 'warning', partyTableList.parentElement);

                    return;
                }

                // console.log(party, party.clientCollection);

                // store client
                ClientManager.storeClientToParty(party, client);

                showAlert(`Client added to ${party.name} successfully!`, 'success', partyTableList.parentElement);

                client.partyCounter++;

                renderClientList();
            });
        });
    }
});


// Initial rendering
renderClientList();
renderPartyList();

/*

1. Ако възрастта на клиента
не му позволява да присъства на събитието, известете с помощта на
необходимото съобщение.

1. Ако партито е затворено не можеш да добавящ клиенти!

2. Премахнете присъстващ потребител от събитието.

3. Създайте функционалност който да спира добавянето на събития или
добавянето на клиенти на централно ниво. Когато бъде активирана при
опит да се добави събитие или клиент потребителя получава съобщение
че операцията не може да бъде извършена, защото системата е
затворена.

4. Добавете, свойство цена към всяко събитие което организирате. Цената не е
задължително свойство, всяко събитие което е регистрирано без цена, става
автоматично безплатно.
Всички събития които са платени трябва да визуализират заглавията си със
знака $ пред имената си безплатни събития трябва да визуализират имената си
със знак “!”
Всеки регистриран клиент, в системата трябва да разполага с портфейл.
Портфейла съдържа пари които се намаляват при регистрация за ново събитие.
Ако потребителя няма пари в портфейла си, системата не го регистрира.
Фирмата добавя понятие VIP клиент. VIP е всеки който е добавен като клиент
на поне 5 събития. VIP клиентите не заплащат такса при посещението си на
следващото събитие. При регистрация за шестото си събитие статуса им се
нулира и те отново се превръщат в обикновени клиенти.
Създайте функционалност VIP клиент. VIP е всеки който е добавен като клиент
на поне 5 събития. VIP клиентите не заплащат такса при посещението си
събития

5. Да се създаде графичен потребителски интерфейс, който да визуализира
списък с всички клиенти на дадено парти. Интегрирайте създадената от вас
логика за работа с клиенти, в рамките на графичния интерфейс. Не забравяйте
VIP клиенти-те. Необходимо е да запазите описаната функционална интеракция
между списъка със събития и списъка с клиенти. Това включва добавяне на
клиент към списъка със събития.

*/