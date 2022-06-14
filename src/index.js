import './css/styles.css';
import { fetchCountries } from './fetchCountries';
import Notiflix, { Notify } from 'notiflix';
import debounce from 'lodash.debounce';



const DEBOUNCE_DELAY = 300;


const refs = {
    input: document.querySelector('#search-box'),
    countryInfo: document.querySelector('.country-info'),
    countryList: document.querySelector('.country-list'),
};

refs.input.addEventListener("input", debounce(searchCountry, DEBOUNCE_DELAY));

function searchCountry(event) {
    const form = event.target.value.trim();

    clearMarkup();

    fetchCountries(form)
        .then(validationCountryCard)
        .catch(fetchError)
}

function validationCountryCard(countries) {
    clearMarkup();

    if (countries.length > 10) {
        Notify.info('Too many matches found. Please enter a more specific name.');
    } else if (countries.length > 1) {
        marcupCountriesList(countries);
    } else {
        markupCountryInfo(countries);
    }
}

function marcupCountriesList(countries) {
    refs.countryList.innerHTML = countries
        .map(({ name: { official }, flags: { svg } }) =>
            `<li" data-item="${official}">
          <img src="${svg}" alt="${official}" width=40>
          <p><b>${official}</b></p>
        </li>`)
        .join('');
}

function markupCountryInfo(countries) {
    const markup = countries
        .map(({ name: { official }, flags: { svg }, capital, population, languages }) => {
            return `<div>
    <div>
            <img src="${svg}" alt="Flag ${official}" width=40>
        <h2>${official}</h2>
    </div>
        <ul>
            <li>
                <span><b>Capital: </b></span>${capital}
            </li>
            <li>
                <span><b>Population: </b></span>${population}
            </li>
            <li>
                <span><b>Languages: </b></span>${Object.values(languages)}
            </li>
        </ul>
    </div>`;
        })
        .join("");

    refs.countryInfo.innerHTML = markup;
}

function fetchError() {
   Notify.failure('Oops, there is no country with that name');
    return
}

function clearMarkup() {
  refs.countryList.innerHTML = '';
  refs.countryInfo.innerHTML = '';
}