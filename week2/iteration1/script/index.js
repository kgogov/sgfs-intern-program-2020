//! Tests


//@ 1. select and existing element in the page
const playground = KQ('.playground');
console.log(playground);
console.log(playground[0]);
console.log(playground.eq(0));
console.log(playground.valueOf());


// @ 2. Create a non existing element and append to existing element / add css as an object
const newBox = KQ('<div>');
newBox.text('😎').cssDom({
    'width':            '4rem',
    'height':           '4rem',
    'display':          'flex',
    'justify-content':  'center',
    'align-items':      'center',
    'background-color': '#7380000d',
    'border':           '2px dashed yellow'
}).addClass('box-5');

KQ('.container-box').valueOf().prepend(newBox.valueOf());


// @ 3. Remove a element
KQ('.box-5').remove();


// @ 4. Change attribute (name, data, class, id)
KQ('#attr')
    .attr('name', 'change-me')
    .attr('data', 'position-1')
    .attr('class', 'attr-special')
    .attr('id', 'attr-special');


// @4.1 get and set textContent
// Get
console.log(KQ('#attr-special').text());

// Set
KQ('#attr-special').text('You just changed me!');



// @4.2 get and set html
// Get
console.log(KQ('#attr-special').html());

// Set
console.log(KQ('#attr-special').html('<div>My <code>innerHTML</code> has changed.. 😪</div>'));

// Same as:
// const div = document.querySelector('#attr-special');
// console.log(div);
// div.innerHTML = '<div>I lost my styles... 😥</div>';

// Maybe i can create a function for outerHTML ?



// @4.3 get and set text
console.log(KQ('#attr-special').text());

KQ('#attr-special').text('My <code>innerText</code> has changed! 🤗 That\'s why <code> does not render!');


// @4.4 Add / remove
const newBoxTwo = KQ('<div>')
    .addClass('attr-special')
    .attr('id', 'target-box')
    .text('Nice to see you!')
    .css('color: lightblue; text-shadow: 2px 2px 5px orange');

KQ('#container-playground').valueOf().append(newBoxTwo.valueOf());

//! Problem #1 Chaining does not work properly 😡
// console.log(KQ('.attr-special').eq(1).removeClass('attr-special'));

// Remove
// KQ('#target-box').removeClass('attr-special');



// @5. DOM Traversing

// Parent: ✅
console.log(KQ('#target-box').parent());

// Sibling: ✅
console.log(KQ('#target-box').prev());

// undefined because there is no next sibling
// console.log(KQ('#target-box').next());


// Children: ✅
const playgroundChildren = KQ('.container-box').children();
// console.log('Children test:', playgroundChildren);
// it returns HTMLCollection, за да го минава през KQ() функцията трябва да добавя към проверката за селектор: selector instanceof HTMLCollection

const log = function() {
    console.log('Hello!');
}

// @6. Events
playgroundChildren.on('click', item => alert(`You've clicked on box number: ${item.target.textContent}`));

// On
playgroundChildren.on('click', log);

// Off
playgroundChildren.off('click', log);