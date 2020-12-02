const notifyContainer = document.querySelector('.notify');
const notifyType      = document.querySelector('#notifyType');

const showAlert = (className) => {
    notifyContainer.classList.toggle('active');
    notifyType.classList.toggle(className);

    setTimeout(() => {
        notifyContainer.classList.toggle('active');
        notifyType.classList.toggle(className);
    }, 2000);
}