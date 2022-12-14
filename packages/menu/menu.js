;(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    global.menu = factory();
}(this, (function () {

    var slideLeft = function(element, direction, done) {
        if (direction == true) {
            element.classList.add('slide-left-in');
            setTimeout(function() {
                element.classList.remove('slide-left-in');
                if (typeof(done) == 'function') {
                    done();
                }
            }, 400);
        } else {
            element.classList.add('slide-left-out');
            setTimeout(function() {
                element.classList.remove('slide-left-out');
                if (typeof(done) == 'function') {
                    done();
                }
            }, 400);
        }
    }

    var findElement = function(element, condition) {
        var foundElement = false;

        function path (element) {
            if (element && ! foundElement) {
                if (typeof(condition) == 'function') {
                    foundElement = condition(element)
                } else if (typeof(condition) == 'string') {
                    if (element.classList && element.classList.contains(condition)) {
                        foundElement = element;
                    }
                }
            }

            if (element.parentNode && ! foundElement) {
                path(element.parentNode);
            }
        }

        path(element);

        return foundElement;
    }

    var getWindowWidth = function() {
        var w = window,
        d = document,
        e = d.documentElement,
        g = d.getElementsByTagName('body')[0],
        x = w.innerWidth || e.clientWidth || g.clientWidth;
        return x;
    }

    return (function(el, options) {
        var obj = {};

        obj.show = function() {
            el.style.display = 'block';
            slideLeft(el, 1);
        }

        obj.hide = function() {
            slideLeft(el, 0, function() {
                el.style.display = '';
            });
        }

        obj.load = function() {
            if (localStorage) {
                var menu = el.querySelectorAll('nav');
                var selected = null;
                for (var i = 0; i < menu.length; i++) {
                    if (menu[i].getAttribute('data-id')) {
                        var state = localStorage.getItem('jmenu-' + menu[i].getAttribute('data-id'));
                        if (state === '1') {
                            menu[i].classList.add('selected');
                        } else if (state === '0') {
                            menu[i].classList.remove('selected');
                        }
                    }
                }
                var href = window.location.pathname;
                if (href) {
                    var menu = document.querySelector('.jmenu a[href="'+ href +'"]');
                    if (menu) {
                        menu.classList.add('selected');
                    }
                }
            }
        }

        obj.select = function(o, e) {
            if (o.tagName == 'NAV') {
                var m = el.querySelectorAll('nav');
                for (var i = 0; i < m.length; i++) {
                    m[i].style.display = 'none';
                }
                o.style.display = '';
                o.classList.add('selected');
            } else {
                var m = el.querySelectorAll('nav a');
                for (var i = 0; i < m.length; i++) {
                    m[i].classList.remove('selected');
                }
                o.classList.add('selected');

                // Better navigation
                if (options && options.collapse == true) {
                    if (o.classList.contains('show')) {
                        m = el.querySelectorAll('nav');
                        for (var i = 0; i < m.length; i++) {
                            m[i].style.display = '';
                        }
                        o.style.display = 'none';
                    } else {
                        m = el.querySelectorAll('nav');
                        for (var i = 0; i < m.length; i++) {
                            m[i].style.display = 'none';
                        }

                        m = el.querySelector('.show');
                        if (m) {
                            m.style.display = 'block';
                        }

                        m = jSuites.findElement(o.parentNode, 'selected');
                        if (m) {
                            m.style.display = '';
                        }
                    }
                }
            }

            if (options && typeof(options.onclick) == 'function') {
                options.onclick(obj, e);
            }

            // Close menu if is oped
            if (getWindowWidth() < 800) {
                obj.hide();
            }
        }

        var action = function(e) {
            if (e.target.tagName == 'H2') {
                if (e.target.parentNode.classList.contains('selected')) {
                    e.target.parentNode.classList.remove('selected');
                    localStorage.setItem('jmenu-' + e.target.parentNode.getAttribute('data-id'), 0);
                } else {
                    e.target.parentNode.classList.add('selected');
                    localStorage.setItem('jmenu-' + e.target.parentNode.getAttribute('data-id'), 1);
                }
            } else if (e.target.tagName == 'A') {
                // Mark link as selected
                obj.select(e.target, e);
            }
        }

        el.addEventListener('click', action);

        // Add close action
        var i = document.createElement('i');
        i.className = 'material-icons small-screen-only close';
        i.innerText = 'close';
        i.onclick = function() {
            obj.hide();
        }
        el.appendChild(i);

        // Add menu class
        el.classList.add('jmenu');

        // Load state
        obj.load();

        if (options && typeof(options.onload) == 'function') {
            options.onload(el);
        }

        // Keep reference
        el.menu = obj;

        return obj;
    });

})));