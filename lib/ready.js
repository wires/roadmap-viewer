// this monkey patched a ready function onto document
// https://gist.github.com/tjbenton/4186f003329c623e53f5d4a31744b054

// adopted to not do the monkey patch

function browserReady() {
    let doc = document
    let win = window
    let add = 'addEventListener'
    let remove = 'removeEventListener'
    let loaded = 'DOMContentLoaded'
    let load = 'load'

    return new Promise(function (resolve) {
        if (doc.readyState === 'complete') {
            resolve();
        } else {
            function onReady() {
                resolve();
                doc[remove](loaded, onReady, true);
                win[remove](load, onReady, true);
            }
            doc[add](loaded, onReady, true);
            win[add](load, onReady, true);
        }
    })
}
