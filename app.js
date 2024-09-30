'use strict';

const API_URL = 'https://restcountries.com/v3.1/all';
const countryElem = document.querySelector('.countries');
const search = document.querySelector('.search');
const regionFilter = document.getElementById('region-filter');
const countryModal = document.querySelector('.countryModal'); // Select modal
const themeToggle = document.querySelector('.theme-toggle');

let countries = [];

async function getCountry() {
    try {
        const response = await fetch(API_URL);
        countries = await response.json(); // Correctly fetching the countries array
        console.log(countries);
        renderCountries(countries); // Passing the countries array to the render function
    } catch (error) {
        console.log('Error fetching country data:', error);
    }
}

function renderCountries(countries) {
    // Clear the existing content
    countryElem.innerHTML = '';
    
    // Render the new set of countries
    countries.forEach(country => {
        const countryCard = document.createElement('div');
        countryCard.classList.add('country');
        
        // Dynamically populate the country card with the country's data
        countryCard.innerHTML = `
            <div class="country-img">
                <img src="${country.flags.svg}" alt="${country.name.common} flag">
            </div>
            <div class="country-info">
                <h5>${country.name.common}</h5>
                <p><strong>Population:</strong> ${country.population.toLocaleString()}</p>
                <p><strong>Region:</strong> ${country.region}</p>
                <p><strong>Capital:</strong> ${country.capital ? country.capital[0] : 'N/A'}</p>
            </div>
        `;
        
        // Attach click event to view details
        countryCard.addEventListener('click', () => viewDetails(country.cca3));

        // Append the country card to the countries container
        countryElem.appendChild(countryCard);
    });
}

// Call the function to fetch and display countries
getCountry();

search.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const filteredCountries = countries.filter(country =>
        country.name.common.toLowerCase().includes(searchTerm)
    );
    renderCountries(filteredCountries);
});

regionFilter.addEventListener('change', (e) => {
    const selectedRegion = e.target.value;
    const filteredCountries = countries.filter(country => 
        !selectedRegion || country.region === selectedRegion
    );
    renderCountries(filteredCountries);
});


function viewDetails(code) {
    const country = countries.find(c => c.cca3 === code);
    
    if (country) {
        countryModal.innerHTML = `
        <button id="back-button"><i class="fa-solid fa-arrow-left"></i> Back</button>
            <div class="country-detail">
                <div class="country-flag">
                    <img src="${country.flags.svg}" alt="${country.name.common}" id="country-flag">
                </div>
                <div class="country-info-modal">
                    <h2 id="country-name">${country.name.common}</h2>
                    <div class="info">
                        <p><strong>Native Name:</strong> ${country.name.nativeName ? Object.values(country.name.nativeName)[0].common : 'N/A'}</p>
                        <p><strong>Population:</strong>${country.population.toLocaleString()}</p>
                        <p><strong>Region:</strong>${country.region}</p>
                        <p><strong>Sub Region:</strong> ${country.subregion}</p>
                        <p><strong>Capital:</strong> ${country.capital ? country.capital[0] : 'N/A'}</p>
                    </div>
                    <div class="border-countries">
                        <strong>Border Countries:</strong>
                        <div id="border-countries">
                            ${country.borders ? country.borders.map(border => `<button>${border}</button>`).join('') : 'No border countries'}
                        </div>
                    </div>
                </div>
                <div class="extra-info">
                    <p><strong>Top Level Domain:</strong> ${country.tld[0]}</p>
                    <p><strong>Currencies:</strong> ${Object.values(country.currencies).map(c => c.name).join(', ')}</p>
                    <p><strong>Languages:</strong> ${Object.values(country.languages).join(', ')}</p>
                </div>
                
            </div>
        `;
        
        // Make the modal visible and cover the whole page
        countryModal.style.display = 'block';
        countryModal.classList.add('show'); // You can style this class for modal animation
        document.body.style.overflow = 'hidden';

        

        // Add event listener to close the modal
        document.querySelector('#back-button').addEventListener('click', () => {
            countryModal.style.display = 'none';
            document.body.style.overflow = '';
        });
    }
}


themeToggle.addEventListener('click', () => {
    // Toggling dark mode class on body, modal, and header
    document.body.classList.toggle('dark-mode');

    // Ensure you have the correct selectors for the modal and head elements
    const head = document.querySelector('.head'); // or document.getElementById('head')
    const countryModal = document.querySelector('.countryModal')

    if (countryModal) countryModal.classList.toggle('dark-mode');
    if (head) head.classList.toggle('dark-mode');
    themeToggle.style.color = document.body.classList.contains('dark-mode') ? 'white' : 'black';

});
