//* Test functions

// Test each();

// const ul = KQ('.list');
// ul.each((ele) => {
//     console.log('Each:', ele);
// })

// Test html()

// const paras = KQ('.test-para');
// console.log(paras.html('<span>Inner HTML!</span>'));

// Test text()
// const subHeading = KQ('.sub-heading');
// console.log(subHeading.text());
// subHeading.text('CoMmOn FuNcTiOnS:');

// Test parent()
// const container = KQ('.main-heading').parent();
// console.log(container[0]);

// Test siblings()
// const hey = KQ('#sibling').siblings();






//* Practical Test

// 1. Select an element
const playground = KQ('#playground');


// 2. Create
const para = KQ('<p>Hello! I am new!</p>');

const greet = KQ('<p>')
    .text('Greetings!')
    .css('color: lightblue;')
    .attr('id', 'greetings')
    .addClass('greet-test');

// 3. Append
playground[0].append(para[0]);
playground[0].append(greet[0]);


// 4. Test children()
// console.log(KQ('#sibling').children().css('color: red;'));




// 3. Attach an event
KQ(greet[0]).on('click', () => {
    KQ(greet[0]).toggleClass('greet-test');
});
