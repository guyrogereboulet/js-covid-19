const title = document.querySelector(".title");
const countriesSelect = document.getElementById("countries");
const BASE_URL = "https://covid19.mathdro.id/api";

let error = null; 
const errorDiv = document.querySelector(".error");
let info = "";
const infoDiv = document.querySelector(".info");



function getCountries() {
    return new Promise ((resolve, reject) => {
        fetch( `${BASE_URL}/countries`)
        .then(data => data.json())
        .then(countries => {
            console.log("coiuntries", countries);
            resolve(countries);
        })
        .catch (err => {
            reject(err);
            errorDiv.innerText = "Impossible de récuperer la liste de pays";
        })
    });
}

getCountries().then(data => {
    let option;
    Object.entries(data.countries).forEach(country => {
        // console.log("country", country);
        option = document.createElement("option");
        option.text = country[1].name;
        option.value = country[1].iso2;
        countriesSelect.add(option);
    });
});

