/*jslint
    browser: true
    long: true */
/*global console, XMLHttpRequest */
/*property
    books, forEach, hash, init, log, maxBookId, minBookId, onHashChanged,
    onerror, onload, open, parse, push, response, send, status
*/

const Scriptures = (function () {
    "use strict";

    /*------------------------------------------------------------------------
     *              CONSTANTS
     */

    /*------------------------------------------------------------------------
     *              PRIVATE VARIABLES
     */
    let books;
    let volumes;

    /*------------------------------------------------------------------------
     *              PRIVATE METHOD DECLARATIONS
     */
    let ajax;
    let cacheBooks;
    let init;
    let onHashChanged;

    /*------------------------------------------------------------------------
     *              PRIVATE METHOD DECLARATIONS
     */
    ajax = function (url, successCallback, failureCallback) {
        let request = new XMLHttpRequest();
        request.open("GET", url, true);

        request.onload = function () {
            if (request.status >= 200 && request.status < 400) {
                let data = JSON.parse(request.response);

                if (typeof successCallback === "function") {
                    successCallback(data);
                }
            } else {
                if (typeof failureCallback === "function") {
                    failureCallback(request);
                }
            }
        };

        request.onerror = failureCallback;
        request.send();
    };

    cacheBooks = function (onInitializedCallback) {
        volumes.forEach(function (volume) {
            let volumeBooks = [];
            let bookId = volume.minBookId;

            while (bookId <= volume.maxBookId) {
                volumeBooks.push(books[bookId]);
                bookId += 1;
            }

            volume.books = volumeBooks;
        });

        if (typeof onInitializedCallback === "function") {
            onInitializedCallback();
        }
    };

    init = function (onInitializedCallback) {
        console.log("Started init...");
        let booksLoaded = false;
        let volumesLoaded = false;

        ajax("https://scriptures.byu.edu/mapscrip/model/books.php", function (data) {
            books = data;
            booksLoaded = true;

            if (volumesLoaded) {
                cacheBooks(onInitializedCallback);
            }
        });

        ajax("https://scriptures.byu.edu/mapscrip/model/volumes.php", function (data) {
            volumes = data;
            volumesLoaded = true;

            if (booksLoaded) {
                cacheBooks(onInitializedCallback);
            }
        });
    };

    onHashChanged = function () {
        console.log("The hash is " + location.hash);
    };

    /*------------------------------------------------------------------------
     *              PUBLIC METHODS
     */
    return {
        init,
        onHashChanged
    };
}());
