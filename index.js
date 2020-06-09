const title = document.querySelector(".title");
const countriesSelect = document.getElementById("countries");
const BASE_URL = "https://covid19.mathdro.id/api";

let error = null; 
const errorDiv = document.querySelector(".error");
let info = "";
const infoDiv = document.querySelector(".info");
const countryStatsDiv = document.querySelector(".country-stats");


countriesSelect.addEventListener("change", e => {
    const countryCode = e.target.value;
    console.log(countryCode);
    
    getStatistics(countryCode).then(stats => {
        // errorDiv.innerText = "";
        // const countryStats = `Cas confirmés : ${stats.confirmed.value} - Guéris : ${stats.recovered.value} - Décédés : ${stats.deaths.value}`;
        // console.log("countryStats", countryStats);
        // countryStatsDiv.innerText = countryStats;

        displayStatistics(stats);
    })

    .catch(err => {
        countryStatsDiv.innerHTML = "";
        errorDiv.innerText = err.message;
    });
    

});



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




function getStatistics(countryCode) {
    return new Promise ((resolve, reject) => {
        fetch(`${BASE_URL}/countries/${countryCode}`)
         .then(data => data.json())
         .then(stats => {

            console.log("stats", stats);
            if (stats.error) {
                throw Error(stats.error.message);
            }
            resolve(stats);
            
         })
         .catch (err => {
             reject(err);
             errorDiv.innerText = `impossible de récupérer les statistiques pour ${countryCode}`;
         })
    });
}

function makeTodigits(value) {
    return value > 9 ? value : "0" + value.toString();
}

function displayStatistics(stats) {
    const lastUpdate = new Date(stats.lastUpdate);
    const niceDate = getLastDataUpdateDate(lastUpdate);
    errorDiv.innerText = "";
    const countryStats = `

    <div class = "row">

        <div class= "col-sm-4">
            <div class="card">
                <div class = "card-body">
                <h5 class= "card-title"> Confirmés : ${stats.confirmed.value}</h5>
                </div>
            </div>
        </div>


        <div class= "col-sm-4">
            <div class="card">
                <div class = "card-body">
                <h5 class= "card-title"> Guéris : ${stats.recovered.value}</h5>
                </div>
            </div>
        </div>


        <div class= "col-sm-4">
            <div class="card">
                <div class = "card-body">
                <h5 class= "card-title"> Décédés : ${stats.deaths.value}</h5>
                </div>
            </div>
        </div>


    </div>

    <div class="row">
        <div class="col-sm-12">
        Données on été mis à jour le ${niceDate}
        </div>
    </div>
    


    `;

    countryStatsDiv.innerHTML = countryStats;
}

function getLastDataUpdateDate(lastUpdate) {

    return `${makeTodigits(lastUpdate.getDate())}/${makeTodigits(lastUpdate.getMonth()+1)}/${makeTodigits(lastUpdate.getFullYear())} à ${lastUpdate.getHours()}H${makeTodigits(lastUpdate.getMinutes())}min`;
}