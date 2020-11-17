// Party DOM Selectors
let partyTableList = document.getElementById('party-list--layout');
let partyForm = document.getElementById('party-form');
let partyNameInput = document.querySelector('input[name="input--party-name"]');
let partyEntranceFee = document.querySelector('input[name="input--entranceFee"]');
let partyIsUnderAged = document.querySelector('select[name="select--party-isForUnderAged"]');
let partyDatePicker = document.querySelector('input[name="input--party-date"]');
let partyIsOpen = document.querySelector('select[name="select--party-isOpenForClients"]');
let partyFormSubmit = document.getElementById('action--submit-party');

let partyUpdateButton = document.getElementById('action--update-party');

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
    if (!partyName || !partyEntrance || !partyDate || partyEntrance < 0) {
        // Show alert
        showAlert('Please fill in all fields', 'error');
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
    showAlert('Party added successfully', 'success');

    //* Нулиране на инпутите след създаване на ново събитие
    partyNameInput.value = '';
    partyIsUnderAged.value = 'yes';
    partyIsOpen.value = 'yes';
    partyDatePicker.value = '';
    partyEntranceFee.value = 0;

    renderPartyList();
}

// ACTION
const updateData = event => {
    const partyIndex = event.target.getAttribute('data-update');

    //* Трябва да има и валидация!!

    if (!partyNameInput.value || 
        !partyEntranceFee.value || 
        partyEntranceFee.value < 0 || 
        !partyDatePicker.value) {
            showAlert('Please enter correct fields!', 'error');

            partyUpdateButton.style.display = "none";
            partyFormSubmit.style.display = "inline-block";

            return;
        }

    // Create new object
    const name = partyNameInput.value;
    const isUnderAged = partyIsUnderAged.value;
    const isOpen = partyIsOpen.value;
    const entranceFee = partyEntranceFee.value;
    const date = partyDatePicker.value;

    const parties = PartyManager.getPartyCollection();

    let party = PartyManager.getParty(partyIndex);

    // тука мога да изпозлвам CreateParty
    party = { name, isUnderAged, isOpen, entranceFee, date };

    // Delete and update at the current index
    parties.splice(partyIndex, 1, party);

    // Show Success
    showAlert('Party updated successfully!', 'success');

    partyUpdateButton.style.display = "none";
    partyFormSubmit.style.display = "inline-block";

    renderPartyList();

}

// Create Add party event listener
partyFormSubmit.addEventListener('click', (event) => {
    
    addNewParty();
    
    event.preventDefault();
});


// Event listener for update filling form data
document.getElementById('party-list--layout').addEventListener('click', (e) => {
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

        showAlert('Please enter the new fields here!', 'warning')

        // Send data to hidden button
        partyUpdateButton.setAttribute('data-update', partyIndex);
        partyUpdateButton.style.display = "inline-block";

        // Disable other button
        partyFormSubmit.style.display = "none";

    }
});

// Event listener for delete
document.getElementById('party-list--layout').addEventListener('click', (e) => {
    if (e.target.className === 'action--party-delete') {

        const partyIndex = e.target.getAttribute('data-position');

        const parties = PartyManager.getPartyCollection();
        // /remove the element at the current index
        parties.splice(partyIndex, 1);

        renderPartyList();
    }
});

// Event listener to update action
document.getElementById('action--update-party').addEventListener('click', updateData);




renderPartyList(); // initial rendering of the data





// Alert
function showAlert(message, className) {
    const div = document.createElement('div');
    div.className = `alert ${className}`;
    // Create text node
    div.appendChild(document.createTextNode(message));
    // Insert into DOM
    partyForm.insertAdjacentElement('beforebegin', div);

    // Disappear after 3 seconds
    setTimeout(() => {
        document.querySelector('.alert').remove();
    }, 3000);
}