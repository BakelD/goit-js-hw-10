import { fetchCountries } from './fetchCountries';
import './css/styles.css';
import Notiflix from 'notiflix';

import debounce from 'lodash.debounce';

const inputEl = document.querySelector('#search-box');
const listEl = document.querySelector('.country-list');
const infoEl = document.querySelector('.country-info');

const DEBOUNCE_DELAY = 300;

const onSearch = e => {
  const name = e.target.value.trim();

  if (!name.length) {
    return;
  }

  fetchCountries(name)
    .then(data => {
      const responseLength = data.length;

      if (responseLength > 10) {
        clear();
        Notiflix.Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
        return;
      }

      if (responseLength >= 2 && responseLength <= 10) {
        clear();
        listEl.insertAdjacentHTML('beforeend', renderList(data));
        return;
      }

      if (responseLength === 1) {
        clear();
        infoEl.insertAdjacentHTML('beforeend', renderCountry(data[0]));
      }
    })
    .catch(err => {
      clear();
      Notiflix.Notify.failure('Oops, there is no country with that name');
    });
};

function renderList(data) {
  return data
    .map(({ name: { official }, flags: { svg } }) => {
      return `<li class="country">
        <img class="country__image" src="${svg}" alt="${official}" width="40" height="20">
        <p class="country__name">${official}</p>
      </li>`;
    })
    .join('');
}

function renderCountry(data) {
  const {
    name: { official },
    flags: { svg },
    capital: [city],
    population,
    languages,
  } = data;

  const allLanguages = Object.values(languages);

  return `<div class="country__info">
            <img class="country__image" src="${svg}" alt="${official}" width="40" height="20">
            <p class="country__title">${official}</p>
         </div>
        <p class="country__data"><span>Capital:</span> ${city}</p>
        <p class="country__data"><span>Population:</span> ${population}</p>
        <p class="country__data"><span>Languages:</span> ${allLanguages}</p>`;
}

function clear() {
  listEl.innerHTML = '';
  infoEl.innerHTML = '';
}

inputEl.addEventListener('input', debounce(onSearch, DEBOUNCE_DELAY));
