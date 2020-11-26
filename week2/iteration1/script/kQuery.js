// https://github.com/umdjs/umd
!(function (factory) {
    if (typeof exports === 'object' && typeof module !== 'undefined') {
        module.exports = factory();
    } else if (typeof define === 'function' && define.amd) {
        define(factory);
    } else {
        window.KQ = factory();
    }
})(function () {

    let domReadyQueue = []; // First In First Out (FIFO)

    const handleDOMReady = (fn) => {
        return document.readyState === 'complete'
            ? fn.call(document)
            : domReadyQueue.push(fn);
    }

    const onDOMReady = () => {
        document.removeEventListener('DOMContentLoaded', onDOMReady);

        while (domReadyQueue.length) {
            domReadyQueue.shift().call(document);
        }
    }

    
    const createNode = function (html) {
        let div = document.createElement('div');
        div.innerHTML = html;
        return div.firstChild;
    }


    function KQ (selector) {
        this.nodes = [];

        if (!(this instanceof KQ)) {
            return new KQ(selector);
        }

        if (typeof selector === 'function') {
            return handleDOMReady(selector);
        }

        if (selector instanceof HTMLElement || selector instanceof NodeList) {

            this.nodes = selector.length > 1 
                ? [].slice(selector) 
                : [selector];

        } else if (typeof selector === 'string') {

            if(selector[0] === '<' && selector[selector.length - 1] === '>') {
                this.nodes = [createNode(selector)];
            } else {
                this.nodes = [].slice.call(document.querySelectorAll(selector));
            }
        }

        // this.length here refers to the actual KQ instance
        if(this.nodes.length) {
            this.length = this.nodes.length;
            for (let i = 0; i < this.nodes.length; i++) {
                this[i] = this.nodes[i];
            }
        }
    }


    KQ.fn = KQ.prototype;

    KQ.fn.each = function (callback) {
        for (let i = 0; i < this.length; i++) {
            callback.call(this, this[i], i);
        }
        return this;
    }


    // Manipulation
    KQ.fn.html = function (value) {
        if (value === undefined) {
            return this[0] && this[0].innerHTML;
        }

        this.each(element => {
            element.innerHTML = value;
        });

        return this;
    }

    KQ.fn.empty = function() {
        return this.each(function (element) {
            element.innerHTML = '';
        });
    }
    
    KQ.fn.text = function (value) {
        if (value) {
            return this.each(function (element) {
                element.innerText = value;
            });
        }
        return this.length && this[0].innerText;
    }

    KQ.fn.append = function (value) {
        return this.each(function (element) {
            element.innerHTML = element.innerHTML + value;
        })
    }

    KQ.fn.prepend = function (value) {
        return this.each(function (element) {
            element.innerHTML = value + element.innerHTML;
        });
    }

    KQ.fn.remove = function() {
        return this.each(function (element) {
            element.parentNode.removeChild(element);
        });
    }
    



    // Traversing
    KQ.fn.parent = function() {
        return KQ(this.nodes[0].parentNode);
    }

    KQ.fn.prev = function() {
        return KQ(this.nodes[0].previousElementSibling);
    }

    KQ.fn.next = function() {
        return KQ(this.nodes[0].nextElementSibling);
    }



    
    // CSS
    KQ.fn.css = function (value) {
        return this.each(function (element) {
            element.style.cssText += value;
        });
    };

    KQ.fn.cssDom = function(obj) {
        return this.each(function (item) {
            for (let key in obj) {
                item.style[key] = obj[key];
            }
        });
    }

    KQ.fn.addClass = function(classes) {
        return this.each(function(element)  {
            element.classList.add(classes);
        });
    }

    KQ.fn.removeClass = function(className) {
        return this.each(function(element) {
            element.classList.remove(className);
        });
    }

    KQ.fn.toggleClass = function(className) {
        return this.each(function (element) {
            element.classList.toggle(className);
        });
    }

    KQ.fn.show = function () {
        return this.each(function (e) {
            e.style.display = 'block';
        });
    }

    KQ.fn.hide = function () {
        return this.each(function (e) {
            e.style.display = 'none';
        });
    }

    
    // Attribute
    KQ.fn.attr = function(name, value) {
        if (!this[0]) return;

        if (!value) {
            return this[0].getAttribute(name);
        }

        return this.each(element => {
            element.setAttribute(name, value);
        })
    }

    KQ.fn.removeAttr = function(value) {
        return this.each(function (element) {
            element.removeAttribute(value);
        });
    }


    // Add/remove events
    KQ.fn.on = function(name, handler) {
        return this.each(function (e) {
            e.addEventListener(name, handler, false);
        });
    }

    KQ.fn.off = function(name, handler) {
        return this.each(function (e) {
            e.removeEventListener(name, handler);
        });
    }


    // Others Utilities
    KQ.fn.valueOf = function() {
        return this[0];
    }


    // Event listeners
    document.addEventListener("DOMContentLoaded", onDOMReady);


    return function (selector) {
        return new KQ(selector);
    }
});


//* To be tested 
// KQ.fn.insertBefore = function (value) {
//     return this.each(function (element) {
//         element.insertAdjacentHTML("beforeBegin", value);
//     });
// },

// KQ.fn.insertAfter = function (value) {
//     return this.each(function (element) {
//         element.insertAdjacentHTML("afterEnd", value);
//     });
// },

// KQ.fn.insertFirst = function (value) {
//     return this.each(function (element) {
//         element.insertAdjacentHTML("afterBegin", value);
//     });
// },

// KQ.fn.insertLast = function (value) {
//     return this.each(function (element) {
//         element.insertAdjacentHTML("beforeEnd", value);
//     });
// },

// KQ.fn.eq = function (node) {
//     this.nodes = [this.nodes[node]];
//     return this;
// }

//* TODO
/*
    KQ.fn.children = function() {
        return [...this.nodes[0].parentNode.children]; 
    }

    KQ.fn.siblings = function() {
        // console.log(this.nodes[0].parentNode.children);

        this.nodes = 
            [].filter.call(this.nodes[0].parentNode.children, (child) => {
                child !== this.nodes[0];

            // Debug
            // console.log(this[0]);
            // console.log(this.nodes);
        });

        return this;
    }

*/