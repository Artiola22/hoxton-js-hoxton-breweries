// Write your code here
const baseUrl = "https://api.openbrewerydb.org/breweries"
const selectStateForm = document.querySelector("#select-state-form")
const filterSectionEl = document.querySelector(".filters-section")
const filterByCityform = document.querySelector("#filter-by-city-form")
const titleEl = document.querySelector(".title")
const searchBarEl = document.querySelector(".search-bar")
const breweryListWrapper = document.querySelector(".brewery-list-wrapper")
const breweryList = document.querySelector(".breweries-list")
const filterByType = document.querySelector("#filter-by-type")
console.log(filterByType)

const state = {
    breweries: [],
    selectedState: null,
    breweryTypes: ["micro", "regional", "brewpub"],
    selectedBreweryType: "",
    selectedCities: []
}

function getBreweriesToDisplay() {
    let breweriesToDisplay = state.breweries
    breweriesToDisplay = breweriesToDisplay.filter(brewery =>
        state.breweryTypes.includes(brewery.brewery_type)
    )
    if (state.selectedBreweryType !== "") {
        breweriesToDisplay = breweriesToDisplay.filter(brewery => brewery.brewery_type === state.selectedBreweryType)
    }
    if (state.selectedCities.length > 0) {
        breweriesToDisplay = breweriesToDisplay.filter(brewery => state.selectedCities.includes(brewery.city))
    }
    breweriesToDisplay = breweriesToDisplay.slice(0, 10)
    return breweriesToDisplay
}


function getCitiesFromBreweries(breweries) {
    let cities = []

    for (const brewery of breweries) {
        if (!cities.includes(brewery.city)) {
            cities.push(brewery.city)
        }
    }
    cities.sort()
    return cities
}

// SERVER FUNCTION
function fetchBreweries() {
    return fetch(baseUrl).then(resp => resp.json())
}

function fetchBreweriesByState(state) {
    return fetch(`${baseUrl}?by_state=${state}&per_page=50`).then(resp => resp.json())
}
// RENDER FUNCTION
function renderFilterSection() {
    if (state.breweries.length !== 0) {
        filterSectionEl.style.display = "block"
    } else {
        filterSectionEl.style.display = "none"
    }



    filterByCityform.innerHTML = ""

    const cities = getCitiesFromBreweries(state.breweries)

    for (const city of cities) {
        const inputEl = document.createElement("input")
        inputEl.setAttribute("type", "checkbox")
        inputEl.setAttribute("class", "city-checkbox")
        inputEl.setAttribute("name", city)
        inputEl.setAttribute("value", city)
        inputEl.setAttribute("id", city)

        if (state.selectedCities.includes(city)) inputEl.checked = true

        const labelEl = document.createElement("label")
        labelEl.setAttribute("for", city)
        labelEl.textContent = city

        inputEl.addEventListener("change", function () {
            // update state.selectedCities
            const cityCheckboxes = document.querySelectorAll(".city-checkbox")
            let selectedCities = []
            for (const checkbox of cityCheckboxes) {
                if (checkbox.checked) selectedCities.push(checkbox.value)
            }
            state.selectedCities = selectedCities

            // render
            render()
        })
        filterByCityform.append(inputEl, labelEl)
    }
}

function renderBreweryItem(brewery) {

    const liEl = document.createElement("li")

    const breweryTitle = document.createElement("h2")
    breweryTitle.textContent = brewery.name

    const typeEl = document.createElement("div")
    typeEl.setAttribute("class", "type")
    typeEl.textContent = brewery.brewery_type

    const addressEl = document.createElement("section")
    addressEl.setAttribute("class", "address")

    const addressTitle = document.createElement("h3")
    addressTitle.textContent = "Address:"

    const addressFirstLine = document.createElement("p")
    addressFirstLine.textContent = brewery.street

    const addressSecondLine = document.createElement("p")
    const addressSecondLineStrong = document.createElement("strong")
    addressSecondLineStrong.textContent = `${brewery.city}, ${brewery.postal_code}`

    addressEl.append(addressTitle, addressFirstLine, addressSecondLine)
    addressSecondLine.append(addressSecondLineStrong)

    const phoneEl = document.createElement("section")
    phoneEl.setAttribute("class", "phone")
    const phonetitle = document.createElement("h3")
    phonetitle.textContent = "Phone:"
    const phoneNumberEl = document.createElement("p")
    phoneNumberEl.textContent = brewery.phone

    phoneEl.append(phonetitle, phoneNumberEl)

    const linkEl = document.createElement("section")
    linkEl.setAttribute("class", "link")
    const aEl = document.createElement("a")
    aEl.setAttribute("href", brewery.website_url)
    aEl.setAttribute("target", "_blank")
    aEl.textContent = "Vizit Website"

    linkEl.append(aEl)

    liEl.append(breweryTitle, typeEl, addressEl, phoneEl, linkEl)
    breweryList.append(liEl)
}

function renderBreweryList() {
    if (state.breweries.length > 0) {
        titleEl.style.display = "block"
        searchBarEl.style.display = "block"
        breweryListWrapper.style.display = "block"
    } else {
        titleEl.style.display = "none"
        searchBarEl.style.display = "none"
        breweryListWrapper.style.display = "none"
    }
    breweryList.innerHTML = ""

    const breweriesToDisplay = getBreweriesToDisplay()

    for (const brewery of getBreweriesToDisplay) {
        renderBreweryItem(brewery)
    }
}

function render() {

    renderFilterSection()
    renderBreweryList()
}

function listenToSelectStateForm() {
    selectStateForm.addEventListener("submit", function (event) {
        event.preventDefault()
        state.selectedState = selectStateForm['select-state'].value

        fetchBreweriesByState(state.selectedState)
            .then(function (breweries) {
                state.breweries = breweries
                render()
            })
    })
}

function listenToFilterByType() {
    filterByType.addEventListener("change", function () {
        state.selectedBreweryType = filterByType.value
    })
}

function init() {
    render()
    listenToSelectStateForm()
    listenToFilterByType()
}
init()