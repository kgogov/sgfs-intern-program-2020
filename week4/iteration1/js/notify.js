const notifyContainer = KQ('.notify');
const notifyType      = KQ('#notifyType');

const showAlert = (className) => {
    notifyContainer.toggleClass('active');
    notifyType.toggleClass(className);

    setTimeout(() => {
        notifyContainer.toggleClass('active');
        notifyType.toggleClass(className);
    }, 2000);
}