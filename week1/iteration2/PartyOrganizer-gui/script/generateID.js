function generateEventID() {
    const hex = (value) => {
        return Math.floor(value).toString(16);
    };

    return hex(Date.now() / 1000) +
    ' '.repeat(16).replace(/./g, () => hex(Math.random() * 16));
}

function generateClientID() {

    const length = 8;
    const timestamp = +new Date();

    const getRandomInt = (min, max) => {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    };

    const generateClientID = () => {
        let ts = timestamp.toString();
        let parts = ts.split("").reverse();
        let id = "";

        for (let i = 0; i < length; ++i) {
            let index = getRandomInt(0, parts.length - 1);
            id += parts[index];
        }

        return id;
    };

    return generateClientID();
}