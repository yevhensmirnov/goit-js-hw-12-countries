import fetchCountry from './js/fetchCountries.js';
import list from './templation/listCountry.hbs';
import renderCountry from './templation/renderCountry.hbs';
import * as PNotifyMobile from '../node_modules/@pnotify/mobile/dist/PNotifyMobile.js';
import { defaultModules } from '../node_modules/@pnotify/core/dist/PNotify.js';
import { alert } from '@pnotify/core';
import * as Confirm from "@pnotify/confirm";
import "@pnotify/confirm/dist/PNotifyConfirm.css";
import "@pnotify/core/dist/PNotify.css";
import "@pnotify/core/dist/BrightTheme.css";

defaultModules.set(PNotifyMobile, {});

const debounce = require('lodash.debounce');

const $render = document.querySelector('.countries__render'),
    $input = document.querySelector('.countries__searcher'),
    $list = document.querySelector('.countries__list');


$input.addEventListener('input', debounce(handleInput, 500));

function updateView(currencies) {
    $render.insertAdjacentHTML('beforeend', renderCountry(currencies));
}

function updateList(currencies) {
    $list.innerHTML = '';
    $list.insertAdjacentHTML('beforeend', list(currencies));
}

function handleInput() {
    $render.innerHTML = '';
    $list.innerHTML = '';
    fetchCountry($input.value).then(renderResult).catch(error);
}

function renderResult(array) {
    if (array.length === 1) {
        updateView(array);
    } else if (array.length > 10) {
        alert({
            text: 'Too many matches found. Please enter a more specific query!',
            width: '400px',
            animateSpeed: 'fast',
            delay: 2000,
            modules: new Map([
                [
                    Confirm,
                    {
                        confirm: true,
                        buttons: [
                            {
                                text: "Ok",
                                primary: true,
                                click: notice => {
                                    notice.close();
                                }
                            }
                        ]
                    }
                ]
            ])
        });
        return;
    }
    else {
        updateList(array);
    }
}

function error() {
    alert('Enter country name!');
}