// ==========================================
// GLOBAL VARIABLES
// ==========================================

let casesChart;
let deathsChart;
let countryChart;


// ==========================================
// FORMAT NUMBERS
// ==========================================

function formatNumber(number) {
    return new Intl.NumberFormat().format(number);
}


// ==========================================
// LOAD GLOBAL DATA
// ==========================================

async function loadGlobalData() {

    try {

        const response = await fetch("/api/global");

        const data = await response.json();

        document.getElementById("total-cases").textContent =
            formatNumber(data.confirmed);

        document.getElementById("total-deaths").textContent =
            formatNumber(data.deaths);

        document.getElementById("total-recovered").textContent =
            formatNumber(data.recovered);

        document.getElementById("total-active").textContent =
            formatNumber(data.active);

        document.getElementById("data-date").textContent =
            data.date;

    } catch (error) {

        console.error("Error loading global data:", error);

    }
}


// ==========================================
// LOAD TIMELINE DATA
// ==========================================

async function loadTimelineData() {

    try {

        const response = await fetch("/api/timeline");

        const data = await response.json();

        const dates = data.map(item => item.Date);

        const confirmed = data.map(item => item.Confirmed);

        const deaths = data.map(item => item.Deaths);


        // ----------------------------------
        // CASES CHART
        // ----------------------------------

        const casesCanvas =
            document.getElementById("cases-chart");

        casesChart = new Chart(casesCanvas, {

            type: "line",

            data: {

                labels: dates,

                datasets: [

                    {
                        label: "Confirmed Cases",

                        data: confirmed,

                        borderWidth: 2,

                        pointRadius: 0,

                        tension: 0.2
                    }

                ]
            },

            options: {

                responsive: true,

                maintainAspectRatio: false,

                interaction: {
                    mode: "index",
                    intersect: false
                },

                plugins: {

                    legend: {
                        display: true
                    }
                },

                scales: {

                    x: {

                        ticks: {
                            maxTicksLimit: 10
                        }

                    },

                    y: {

                        beginAtZero: true,

                        ticks: {

                            callback: function(value) {

                                return formatNumber(value);

                            }

                        }

                    }

                }

            }

        });


        // ----------------------------------
        // DEATHS CHART
        // ----------------------------------

        const deathsCanvas =
            document.getElementById("deaths-chart");

        deathsChart = new Chart(deathsCanvas, {

            type: "line",

            data: {

                labels: dates,

                datasets: [

                    {
                        label: "Deaths",

                        data: deaths,

                        borderWidth: 2,

                        pointRadius: 0,

                        tension: 0.2
                    }

                ]
            },

            options: {

                responsive: true,

                maintainAspectRatio: false,

                interaction: {
                    mode: "index",
                    intersect: false
                },

                plugins: {

                    legend: {
                        display: true
                    }

                },

                scales: {

                    x: {

                        ticks: {
                            maxTicksLimit: 10
                        }

                    },

                    y: {

                        beginAtZero: true,

                        ticks: {

                            callback: function(value) {

                                return formatNumber(value);

                            }

                        }

                    }

                }

            }

        });

    } catch (error) {

        console.error("Error loading timeline:", error);

    }
}


// ==========================================
// LOAD COUNTRIES
// ==========================================

async function loadCountries() {

    try {

        const response = await fetch("/api/countries");

        const data = await response.json();


        // ----------------------------------
        // COUNTRY DROPDOWN
        // ----------------------------------

        const select =
            document.getElementById("country-select");


        // Clear existing options

        select.innerHTML =
            '<option value="">Select a country</option>';


        data.forEach(country => {

            const option =
                document.createElement("option");

            option.value =
                country["Country/Region"];

            option.textContent =
                country["Country/Region"];

            select.appendChild(option);

        });


        // ----------------------------------
        // COUNTRY TABLE
        // ----------------------------------

        const table =
            document.getElementById("country-table");


        table.innerHTML = "";


        data.sort(function(a, b) {

            return b.Confirmed - a.Confirmed;

        });


        data.forEach(country => {

            const row =
                document.createElement("tr");


            row.innerHTML = `

                <td>
                    ${country["Country/Region"]}
                </td>

                <td>
                    ${formatNumber(country.Confirmed)}
                </td>

                <td>
                    ${formatNumber(country.Deaths)}
                </td>

                <td>
                    ${formatNumber(country.Recovered)}
                </td>

                <td>
                    ${formatNumber(country.Active)}
                </td>

            `;


            table.appendChild(row);

        });

    } catch (error) {

        console.error("Error loading countries:", error);

    }
}


// ==========================================
// LOAD COUNTRY HISTORY
// ==========================================

async function loadCountryHistory(country) {

    if (!country) {

        return;

    }


    try {

        const response =
            await fetch(
                `/api/country/${encodeURIComponent(country)}`
            );


        const data =
            await response.json();


        const dates =
            data.map(item => item.Date);


        const confirmed =
            data.map(item => item.Confirmed);


        const deaths =
            data.map(item => item.Deaths);


        const recovered =
            data.map(item => item.Recovered);


        const active =
            data.map(item => item.Active);


        // ----------------------------------
        // UPDATE TITLE
        // ----------------------------------

        document.getElementById("country-title").textContent =
            `${country} COVID-19 History`;


        // ----------------------------------
        // DESTROY OLD CHART
        // ----------------------------------

        if (countryChart) {

            countryChart.destroy();

        }


        // ----------------------------------
        // CREATE COUNTRY CHART
        // ----------------------------------

        const canvas =
            document.getElementById("country-chart");


        countryChart = new Chart(canvas, {

            type: "line",

            data: {

                labels: dates,

                datasets: [

                    {
                        label: "Confirmed",

                        data: confirmed,

                        borderWidth: 2,

                        pointRadius: 0,

                        tension: 0.2
                    },

                    {
                        label: "Deaths",

                        data: deaths,

                        borderWidth: 2,

                        pointRadius: 0,

                        tension: 0.2
                    },

                    {
                        label: "Recovered",

                        data: recovered,

                        borderWidth: 2,

                        pointRadius: 0,

                        tension: 0.2
                    },

                    {
                        label: "Active",

                        data: active,

                        borderWidth: 2,

                        pointRadius: 0,

                        tension: 0.2
                    }

                ]

            },

            options: {

                responsive: true,

                maintainAspectRatio: false,

                interaction: {

                    mode: "index",

                    intersect: false

                },

                plugins: {

                    legend: {

                        display: true

                    }

                },

                scales: {

                    x: {

                        ticks: {

                            maxTicksLimit: 10

                        }

                    },

                    y: {

                        beginAtZero: true,

                        ticks: {

                            callback: function(value) {

                                return formatNumber(value);

                            }

                        }

                    }

                }

            }

        });


    } catch (error) {

        console.error(
            "Error loading country history:",
            error
        );

    }

}


// ==========================================
// COUNTRY BUTTON
// ==========================================

document
    .getElementById("country-button")
    .addEventListener("click", function() {

        const country =
            document.getElementById("country-select").value;


        if (country === "") {

            alert("Please select a country.");

            return;

        }


        loadCountryHistory(country);

    });


// ==========================================
// INITIALIZE DASHBOARD
// ==========================================

async function initializeDashboard() {

    await loadGlobalData();

    await loadTimelineData();

    await loadCountries();

}


// ==========================================
// START
// ==========================================

initializeDashboard();