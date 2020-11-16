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
        // Format Date
        // Value на party.date = 2020-11-16 всичко е наред, може да се reverse-ни стринга
        // let date = getDateFormat(party);

        // Тук мишо преоверява за инпут

        // Друго хубаво упржнение: друг файл script-console

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

        // Различни функции за рендериране
        // Различни функции за манипулация
        // Различни функции за връщане на данни
    });
};

const addNewParty = () => {

    const partyName                = partyNameInput.value;
    const partyisUnderAged         = partyIsUnderAged.value;
    const partyisOpen              = partyIsOpen.value;
    const partyDate                = partyDatePicker.value;
    const partyEntrance            = partyEntranceFee.value;

    //* TODO: валидация в CreateParty и чак тогава подавам резултата към масива

    PartyManager.storeParty(createParty({
        name            : partyName,
        isUnderAged     : partyisUnderAged,
        isOpen          : partyisOpen,
        date            : partyDate,
        entranceFee     : partyEntrance
    }));

    // Трябва да нулирам всички инпути след добавянето на нов row тук

    renderPartyList();
}

const updateData = event => {
    const partyIndex = event.target.getAttribute('data-update');

    const name = partyNameInput.value;
    const isUnderAged = partyIsUnderAged.value;
    const isOpen = partyIsOpen.value;
    const entranceFee = partyEntranceFee.value;

    const parties = PartyManager.getPartyCollection();

    let party = PartyManager.getParty(partyIndex);
    // console.log(party);

    // тука мога да изпозлвам CreateParty
    party = { name, isUnderAged, isOpen, entranceFee };

    // Delete and update at the current index
    parties.splice(partyIndex, 1, party);

    renderPartyList();

}


// Create Add party event listener
partyFormSubmit.addEventListener('click', (event) => {
    
    addNewParty();
    
    event.preventDefault();
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

// Event listener for update
document.getElementById('party-list--layout').addEventListener('click', (e) => {
    if (e.target.className === 'action--party-update') {

        const partyIndex = e.target.getAttribute('data-position');
        const party = PartyManager.getParty(partyIndex);

        // Using some fancy object destructuring
        const { name, isUnderAged, entranceFee, date, isOpen } = party;

        // Fill form values with the current object values

        // Може и в отделна функция да се изнесят: clean code
        partyNameInput.value = name;
        partyIsUnderAged.value = isUnderAged;
        partyIsOpen.value = isOpen;

        //! Проблем с датите ТРЯБВА ДА ГИ ОПРАВЯ!
        // partyDatePicker.value = date;
        // console.log(date);
        partyEntranceFee.value = entranceFee;

        // console.log(party); //* тест

        // Send data to hidden button
        partyUpdateButton.setAttribute('data-update', partyIndex);
        partyUpdateButton.style.display = "inline-block";

        // Disable other button
        // partyFormSubmit;
        partyFormSubmit.style.display = "none";

        //* Трябва да има и валидация!!

    }
});

// Event listener to update
document.getElementById('action--update-party').addEventListener('click', updateData);

renderPartyList(); // initial rendering of the data