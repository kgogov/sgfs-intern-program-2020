const secondHand    = KQ('.second-hand');
const minHand       = KQ('.min-hand');
const hourHand      = KQ('.hour-hand');
const circleDegrees = 360;
const rotateDegrees = 90;

const setClock = () =>  {
    const now                   = new Date();

    const seconds               = now.getSeconds();
    const secondsDegrees        = ((seconds / 60) * circleDegrees) + rotateDegrees;
    
    const mins                  = now.getMinutes();
    const minsDegrees           = ((mins / 60) * circleDegrees) + rotateDegrees;
    
    const hour                  = now.getHours();
    const hourDegrees           = ((hour / 12) * circleDegrees) + rotateDegrees;
    
    secondHand.css('transform', `rotate(${secondsDegrees}deg)`);
    minHand.css('transform', `rotate(${minsDegrees}deg)`);
    hourHand.css('transform', `rotate(${hourDegrees}deg)`);

    [secondHand, minHand, hourHand].forEach(el => el.css('transitionDuration', (seconds === 0) ? '0s' : '0.05s'));
}


const getClock = () => {
    setInterval(setClock, 1000);
}
