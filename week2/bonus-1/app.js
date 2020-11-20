// #1 Assignment 
const customForEach = (collection, callback) => {
    for (let i = 0; i < collection.length; i++) {
        callback(collection[i]);
    }
};

// #1 Test
// customForEach([1, 2, 3], function(item) {
//     console.log(item);
// });



// #2 Assignment
const customFilter = (collection, callback, inPlace) => {
    const filteredArr = [];

    if (inPlace) {
        let from = 0
        let to = 0;

        while (from < collection.length) {
            if (callback(collection[from])) {

                collection[to] = collection[from];
                to++;
            }
            from++;
        }
        collection.length = to;
        return;
    }

    for (let i = 0; i < collection.length; i++) {
        const result = callback(collection[i], i, collection);

        if (result) {
            filteredArr.push(collection[i]);
        }
    }

    return filteredArr;
};

// #2 Test
// const numbersByTwo = customFilter([1, 2, 3, 4], num => num % 2 === 0);
// console.log(numbersByTwo);

// #2.1 Test in place
// let arr = [1, 2, 3, 4];
// customFilter(arr, num => num % 3 == 0, true);
// console.log(arr);


// #3 Assignment
const customMap = (collection, callback) => {
    const mapArr = [];

    for (let i = 0; i < collection.length; i++) {
        const result = callback(collection[i], i, collection);
        mapArr.push(result);
    }

    return mapArr;
};

// #3 Test
// const squareNumByTwo = customMap([2, 4, 6], num => num ** 2);
// console.log(squareNumByTwo);



// #4 Assignment
const customFill = (collection, fillValues, length) => {

    if (collection.length > length) {
        return collection;
    }

    let arr = collection;

    for (let i = 0; i < length; i++) {
        let index = getRandomNumber(0, fillValues.length - 1);
        arr.push(fillValues[index]);
    }

    return arr;

    function getRandomNumber(min, max) {
        return Math.floor(min + Math.random() * (max - min));
    }
};


// #4 Test
// console.log(customFill([],['a', 'b', 'c', 1, 10, 8, 7, 10], 5)); 



// #5 Assignment
// Newbie solution
const reverseArr = function(collection) {
    if (collection.length === 2) {
        let reversed = [];

        for (let i = collection.length - 1; i >= 0; i--) {
            reversed.push(reverseCollection(collection[i]));
        }
        return reversed;
    } else {
        return reverseCollection(collection);
    }

    function reverseCollection(collection) {
        let reversed = [];

        for (let i = collection.length - 1; i >= 0; i--) {
            reversed.push(collection[i]);
        }
        return reversed;
    }
};


// #5 BONUS:
// const reverse = array => array.map((item, index) => array[array.length - 1 - index]);

// const reverse = array =>[...array].map(array.pop, array);


// #5 Test
console.log(reverseArr([ [1, 2, 3], ['a', 'b', 'c'] ]));
console.log(reverseArr([1, 2, 3]));