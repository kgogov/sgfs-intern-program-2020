const secondHand    = document.querySelector('.second-hand');
const minHand       = document.querySelector('.min-hand');
const hourHand      = document.querySelector('.hour-hand');
const rotateDegrees = 90;

const setClock = () =>  {
    const now                   = new Date();

    const seconds               = now.getSeconds();
    const secondsDegrees        = ((seconds / 60) * 360) + rotateDegrees;
    secondHand.style.transform  = `rotate(${secondsDegrees}deg)`;

    const mins                  = now.getMinutes();
    const minsDegrees           = ((mins / 60) * 360) + rotateDegrees;
    minHand.style.transform    = `rotate(${minsDegrees}deg)`;

    const hour                  = now.getHours();
    const hourDegrees           = ((hour / 12) * 360) + rotateDegrees;
    hourHand.style.transform    = `rotate(${hourDegrees}deg)`;


    [secondHand, minHand, hourHand].forEach(el => el.style.transitionDuration = (seconds === 0) ? '0s' : '0.05s');
}


const getClock = () => {
    setInterval(setClock, 1000);
}
