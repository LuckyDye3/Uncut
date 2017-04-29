"use strict";

// save a value to Android
// or localstorage on the browser
function setSaveValue(key, value) {
    try {
        Android.setKeyValue(key, value);
    } catch (err) {
        console.error(err);
        if (localStorage) {
            localStorage.setItem(key, value);
        } else {
            console.error("Highscore not saved!");
        }
    }
}

// get the saved value from setSaveValue();
function getSaveValue(key, callback) {
    try {
        var value = Android.getKeyValue(key);
        callback(value);
    } catch (err) {
        if (localStorage) {
            var val = localStorage.getItem(key);
            callback(val);
        } else {
            console.error("No save, or not able to save to storage!");
        }
    }
}

function random(z) {
    return Math.floor(Math.random() * z + 1);
}