const cryptocurrencies = [];
const defaultedCryptocurrencies = [];
const cryptoData = [];
const startEndSearchDate = {};
const favoriteCrypto = [];
const cryptoSearchInput = document.getElementById("cryptoSearch");
const uploadCryptoButton = document.getElementById("uploadCryptoData");
const startSearchDateInput = document.getElementById("startSearchDate");
const endSearchDateInput = document.getElementById("endSearchDate");
const calculateButton = document.getElementById("calculate");
const sideBar = document.getElementsByClassName("sideBar");
const tokenCheckBox = document.getElementById("token");
const growMoreThenInput = document.getElementById("growMoreThen");
const growLessThenInput = document.getElementById("growLessThen");
const shrinkMoreThenInput = document.getElementById("shrinkMoreThen");
const shrinkLessThenInput = document.getElementById("shrinkLessThen");
const cryptoWorthDolarsCheckBox = document.getElementById("worthDolars");
const cryptoWorthCentsCheckBox = document.getElementById("worthCents");
const dateFilterCheckbox = document.getElementById("dateFilterCheckbox");
const startDateFilter = document.getElementById("startDateFilter");
const endDateFilter = document.getElementById("endDateFilter");
const bestPerformingCryptoFilterCheckBox = document.getElementById("bestPerformingCryptoFilterCheckBox");
const bestPerFormingCryptoFilter = document.getElementById("bestPerFormingCryptoFilter");
const worstPerformingCryptoFilterCheckBox = document.getElementById("worstPerformingCryptoFilterCheckBox");
const worstPerFormingCryptoFilter = document.getElementById("worstPerFormingCryptoFilter");
const table = document.getElementById("table");
const favoritesContainer = document.getElementsByClassName("favoritesContainer");
const favoriteCounter = document.getElementsByClassName("favoriteCounter");
const showFavoritesButton = document.getElementById("showFavoriteButton");
let cryptoToSort = [];
let cryptoToSearch = [];

function addListeners() {
    uploadCryptoButton.addEventListener("change", onCryptoUploaded);
    startSearchDateInput.addEventListener("change", getStartEndDateInUnix);
    endSearchDateInput.addEventListener("change", getStartEndDateInUnix);
    calculateButton.addEventListener("click", onCalculatePressed);
    dateFilterCheckbox.addEventListener("change", showHideFilters);
    bestPerformingCryptoFilterCheckBox.addEventListener("change", hideWorstPerformingFilter);
    worstPerformingCryptoFilterCheckBox.addEventListener("change", hideBestPerformingFilter);
    bestPerformingCryptoFilterCheckBox.addEventListener("change", showHideFilters);
    worstPerformingCryptoFilterCheckBox.addEventListener("change", showHideFilters);
    growMoreThenInput.addEventListener("change", disableEnableGrowLessThenInput);
    growLessThenInput.addEventListener("change", disableEnableGrowMoreThenInput);
    shrinkMoreThenInput.addEventListener("change", disableEnableShrinkLessThenInput);
    shrinkLessThenInput.addEventListener("change", disableEnableShrinkMoreThenInput);
    cryptoWorthDolarsCheckBox.addEventListener("change", disableCryptoWorthCentsCheckBox);
    cryptoWorthCentsCheckBox.addEventListener("change", disableCryptoWorthDolarsCheckBox);
    cryptoSearchInput.addEventListener("keydown", getSearchResults);
    showFavoritesButton.addEventListener("click", showFavoritesInNewWindow)
}

addListeners();
showHideFilters();
// onDownloadAllCryptoButton();
// 1.dodać zjdęcia do listy
// 2. dodać nowe okno dla ulubionych kryptowalut
// 3. dodać opis w inputach best / worst dla informacji użytkownika
// 4. dodać filtr na wartość market cap
// 5. dodać filtr na wolumen
// 6. dodać top trending crypto


function onCalculatePressed() {
    cryptoToSort = [];
    let cryptoWithHistoricalMaxMin = getMaxMinValueHistorical(cryptoData);
    let tokenFiltered = tokenCheckBox.checked ? getCryptoFilteredByToken(cryptoWithHistoricalMaxMin) : cryptoWithHistoricalMaxMin;
    let timeFiltered = dateFilterCheckbox.checked ? getCryptoFilteredByTime(tokenFiltered) : tokenFiltered;
    let bestPerformingCryptoFiltered = bestPerformingCryptoFilterCheckBox.checked ? getBestPerformingCrypto(timeFiltered) : timeFiltered;
    let worstPerformingCryptoFiltered = worstPerformingCryptoFilterCheckBox.checked ? getWorstPerformingCrypto(bestPerformingCryptoFiltered) : bestPerformingCryptoFiltered;
    let cryptoWorthDolarsFiltered = cryptoWorthDolarsCheckBox.checked ? getCryptoWorthMoreThenDolar(worstPerformingCryptoFiltered) : worstPerformingCryptoFiltered;
    let cryptoWorthCentsFiltered = cryptoWorthCentsCheckBox.checked ? getCryptoWorthLessThenDolar(cryptoWorthDolarsFiltered) : cryptoWorthDolarsFiltered;
    cryptoToSort.push(...cryptoWorthCentsFiltered);
    createAndDeleteTable(cryptoWorthCentsFiltered);
    // addFavorites();
    console.log(cryptoWorthCentsFiltered);
}

function createAndDeleteTable(cryptoToTable) {
    deleteTable();
    generateTableHead(table, cryptoToTable);
    generateTableRows(cryptoToTable)
}


function deleteTable() {
    table.childElementCount && table.removeChild(table.childNodes[0])
}

function generateTableHead(table, crypto) {
    let thead = table.createTHead();
    let row = thead.insertRow();
    let th = document.createElement("th");
    let text = document.createTextNode("#");
    th.appendChild(text);
    row.appendChild(th);
    let propertyNames = Object.keys(crypto[0]);

    if (propertyNames.includes("id")) {
        let name = "Crypto ID";
        let nameWithChanges = name.replaceAll(" ", "").replaceAll(".", "");
        addHeaderCellToRow(row, name, nameWithChanges);
    }
    if (propertyNames.includes("name")) {
        let name = "Crypto name";
        let nameWithChanges = name.replaceAll(" ", "").replaceAll(".", "");
        addHeaderCellToRow(row, name, nameWithChanges);
    }
    if (propertyNames.includes("percentChange")) {
        let name = "Percent change";
        let nameWithChanges = name.replaceAll(" ", "").replaceAll(".", "");
        addHeaderCellToRow(row, name, nameWithChanges);
    }
    if (propertyNames.includes("lowestPriceData")) {
        let name = "Lowest price";
        let nameWithChanges = name.replaceAll(" ", "").replaceAll(".", "");
        addHeaderCellToRow(row, name, nameWithChanges);
    }
    if (propertyNames.includes("highestPriceData")) {
        let name = "Highest price";
        let nameWithChanges = name.replaceAll(" ", "").replaceAll(".", "");
        addHeaderCellToRow(row, name, nameWithChanges);
    }
    if (propertyNames.includes("minPriceDataHistorical")) {
        let name = "Historical min. price";
        let nameWithChanges = name.replaceAll(" ", "").replaceAll(".", "");
        addHeaderCellToRow(row, name, nameWithChanges);
    }
    if (propertyNames.includes("maxPriceDataHistorical")) {
        let name = "Historical max. price";
        let nameWithChanges = name.replaceAll(" ", "").replaceAll(".", "");
        addHeaderCellToRow(row, name, nameWithChanges);
    }
}

function addCellsToTable(row, data) {
    let cell = row.insertCell();
    let text = document.createTextNode(data);
    cell.appendChild(text);
}

function addHeaderCellToRow(row, rowName, filterName) {
    let arrowUpUnicode = String.fromCharCode("9650");
    let arrowDownUnicode = String.fromCharCode("9660");
    let th = document.createElement("th");
    let arrowUpButton = document.createElement("button");
    let arrowDownButton = document.createElement("button");
    arrowUpButton.setAttribute("id", `${filterName}FilterArrowUp`);
    arrowDownButton.setAttribute("id", `${filterName}FilterArrowDown`)
    let arrowUp = document.createTextNode(arrowUpUnicode);
    let arrowDown = document.createTextNode(arrowDownUnicode);
    let text = document.createTextNode(rowName);
    arrowUpButton.appendChild(arrowUp);
    arrowDownButton.appendChild(arrowDown);
    th.appendChild(text);
    th.appendChild(arrowUpButton);
    th.appendChild(arrowDownButton);
    row.appendChild(th);
    addEventListenerToSortFilter(arrowUpButton, arrowDownButton)
}

function generateTableRows(crypto) {
    crypto.forEach((obj, i) => {
        let row = table.insertRow();
        row.addEventListener("click", addFavoritesFunc);
        checkForFavorites(obj.id, row)
        let cell = row.insertCell();
        let text = document.createTextNode(i + 1);
        cell.appendChild(text);

        if (obj.id) {
            let rowData = obj.id;
            addCellsToTable(row, rowData)
        }

        if (obj.name) {
            let rowData = obj.name;
            addCellsToTable(row, rowData)
        }

        if (obj.percentChange) {
            let rowData = `${obj.percentChange.toFixed(2)}%`;
            let parsedPercent = parseFloat(rowData);
            let cell = row.insertCell();
            let text = document.createTextNode(rowData);

            if (parsedPercent > 0) {
                cell.style.color = "green";
            } else if (parsedPercent < 0) {
                cell.style.color = "red";
            }
            cell.appendChild(text);
        }

        if (obj.lowestPriceData) {
            let rowData = obj.lowestPriceData.price;
            addCellsToTable(row, rowData)
        }

        if (obj.highestPriceData) {
            let CryptoData = obj.highestPriceData.price;
            addCellsToTable(row, CryptoData)
        }

        if (obj.minPriceDataHistorical) {
            let rowData = obj.minPriceDataHistorical.price;
            addCellsToTable(row, rowData)
        }
        if (obj.maxPriceDataHistorical) {
            let rowData = obj.maxPriceDataHistorical.price;
            addCellsToTable(row, rowData)
        }

    });
}

function checkForFavorites(objId, row) {
    favoriteCrypto.find(x => x === objId) ? row.style.backgroundColor = "green" : row.style.backgroundColor = "";
}

function addEventListenerToSortFilter(sortUp, sortDown) {
    document.getElementById(`${sortUp.id}`).addEventListener("click", findTableColumnToSort);
    document.getElementById(`${sortDown.id}`).addEventListener("click", findTableColumnToSort);
}

function findTableColumnToSort(event) {
    let rowNameToSort = event.target.id.toLowerCase();
    rowNameToSort.includes("id") && rowNameToSort.includes("up") && sortUp("id");
    rowNameToSort.includes("id") && rowNameToSort.includes("down") && sortDown("id");
    rowNameToSort.includes("name") && rowNameToSort.includes("up") && sortUp("name");
    rowNameToSort.includes("name") && rowNameToSort.includes("down") && sortDown("name");
    rowNameToSort.includes("lowest") && rowNameToSort.includes("up") && sortUp("lowestPriceData", "price");
    rowNameToSort.includes("lowest") && rowNameToSort.includes("down") && sortDown("lowestPriceData", "price");
    rowNameToSort.includes("highest") && rowNameToSort.includes("up") && sortUp("highestPriceData", "price");
    rowNameToSort.includes("highest") && rowNameToSort.includes("down") && sortDown("highestPriceData", "price");
    rowNameToSort.includes("min") && rowNameToSort.includes("up") && sortUp("minPriceDataHistorical", "price");
    rowNameToSort.includes("min") && rowNameToSort.includes("down") && sortDown("minPriceDataHistorical", "price");
    rowNameToSort.includes("max") && rowNameToSort.includes("up") && sortUp("maxPriceDataHistorical", "price");
    rowNameToSort.includes("max") && rowNameToSort.includes("down") && sortDown("maxPriceDataHistorical", "price");
    rowNameToSort.includes("percent") && rowNameToSort.includes("up") && sortUp("percentChange");
    rowNameToSort.includes("percent") && rowNameToSort.includes("down") && sortDown("percentChange");
}

function sortUp(cryptoKey, cryptoSecondKey) {
    if (cryptoKey === "id" || cryptoKey === "name") {
        cryptoToSort.sort((a, b) => a[cryptoKey].localeCompare(b[cryptoKey]));
        createAndDeleteTable(cryptoToSort);
    } else if (cryptoKey === "percentChange") {
        cryptoToSort.sort((a, b) => parseFloat(a[cryptoKey]) - parseFloat(b[cryptoKey]));
        createAndDeleteTable(cryptoToSort);
    } else {
        cryptoToSort.sort((a, b) => parseFloat(a[cryptoKey][cryptoSecondKey]) - parseFloat(b[cryptoKey][cryptoSecondKey]));
        createAndDeleteTable(cryptoToSort);
    }
}

function sortDown(cryptoKey, cryptoSecondKey) {
    if (cryptoKey === "id" || cryptoKey === "name") {
        cryptoToSort.sort((a, b) => b[cryptoKey].localeCompare(a[cryptoKey]));
        createAndDeleteTable(cryptoToSort);
    } else if (cryptoKey === "percentChange") {
        cryptoToSort.sort((a, b) => parseFloat(b[cryptoKey]) - parseFloat(a[cryptoKey]));
        createAndDeleteTable(cryptoToSort);
    } else {
        cryptoToSort.sort((a, b) => parseFloat(b[cryptoKey][cryptoSecondKey]) - parseFloat(a[cryptoKey][cryptoSecondKey]));
        createAndDeleteTable(cryptoToSort);
    }
}


function validateDateFilter() {
    let startSearch = startEndSearchDate.start;
    let endSearch = startEndSearchDate.end;
    if (startSearch === undefined && endSearch === undefined) {
        alert("Both start and end search date must be filled");
        throw new Error;
    } else if (startSearch === undefined) {
        alert("Start search date must be filled");
        throw new Error;
    } else if (endSearch === undefined) {
        alert("End search date must be filled");
        throw new Error;
    } else if (startSearch > endSearch) {
        alert("Start search date cannot be older then end search date")
        throw new Error;
    }

}

function disableEnableShrinkMoreThenInput() {
    shrinkLessThenInput.value !== "" ? shrinkMoreThenInput.disabled = true : shrinkMoreThenInput.disabled = false;
}

function disableEnableShrinkLessThenInput() {
    shrinkMoreThenInput.value !== "" ? shrinkLessThenInput.disabled = true : shrinkLessThenInput.disabled = false;
}

function disableEnableGrowLessThenInput() {
    growMoreThenInput.value !== "" ? growLessThenInput.disabled = true : growLessThenInput.disabled = false;
}

function disableEnableGrowMoreThenInput() {
    growLessThenInput.value !== "" ? growMoreThenInput.disabled = true : growMoreThenInput.disabled = false;

}

function disableCryptoWorthCentsCheckBox() {
    if (cryptoWorthDolarsCheckBox.checked) {
        cryptoWorthCentsCheckBox.checked = false;
    }
};

function disableCryptoWorthDolarsCheckBox() {
    if (cryptoWorthCentsCheckBox.checked) {
        cryptoWorthDolarsCheckBox.checked = false;
    }
};

function getCryptoFilteredByToken(data) {
    let filteredByToken = data.filter(obj => !obj.name.toLowerCase().includes("token"));

    return filteredByToken;
}

function hideWorstPerformingFilter() {
    if (bestPerformingCryptoFilterCheckBox.checked) {
        worstPerformingCryptoFilterCheckBox.checked = false;
        shrinkLessThenInput.value = null;
        shrinkMoreThenInput.value = null;
        disableEnableShrinkMoreThenInput();
        disableEnableShrinkLessThenInput();
    }
}

function hideBestPerformingFilter() {
    if (worstPerformingCryptoFilterCheckBox.checked) {
        bestPerformingCryptoFilterCheckBox.checked = false;
        growLessThenInput.value = null;
        growMoreThenInput.value = null;
        disableEnableGrowLessThenInput();
        disableEnableGrowMoreThenInput();
    }
}

function showHideFilters() {
    dateFilterCheckbox.checked ? startDateFilter.style.display = "" : startDateFilter.style.display = "none";
    dateFilterCheckbox.checked ? endDateFilter.style.display = "" : endDateFilter.style.display = "none";
    bestPerformingCryptoFilterCheckBox.checked ? bestPerFormingCryptoFilter.style.display = "" : bestPerFormingCryptoFilter.style.display = "none";
    worstPerformingCryptoFilterCheckBox.checked ? worstPerFormingCryptoFilter.style.display = "" : worstPerFormingCryptoFilter.style.display = "none";

}

function getPercentValue() {
    let counter = {};
    growMoreThenInput.value ? counter.growMore = parseFloat(growMoreThenInput.value) : counter.growMore = undefined;
    growLessThenInput.value ? counter.growLess = parseFloat(growLessThenInput.value) : counter.growLess = undefined;
    shrinkMoreThenInput.value ? counter.shrinkMore = parseFloat(shrinkMoreThenInput.value) : counter.shrinkMore = undefined;
    shrinkLessThenInput.value ? counter.shrinkLess = parseFloat(shrinkLessThenInput.value) : counter.shrinkLess = undefined;
    if (counter.growLess < 0 || counter.growMore < 0 || counter.shrinkLess < 0 || counter.shrinkMore < 0) {
        alert(`Percent value cannot be negative`);
        throw new Error;
    } else if (counter.growLess == 0 || counter.growMore == 0 || counter.shrinkLess == 0 || counter.shrinkMore == 0) {
        alert(`Percent value cannot has 0 value. Un match filter checkbox in case you don't want to use it`);
        throw new Error;
    } else if (counter.growLess == undefined && counter.growMore == undefined && counter.shrinkMore == undefined && counter.shrinkLess == undefined) {
        alert(`Percent value cannot be empty. Un match filter checkbox in case you don't want to use it`);
        throw new Error;
    } else if (counter.shrinkMore >= 100) {
        alert(`Its not possible to shrink more then 100%. Correct "shrink more then" value.`);
        throw new Error;
    }

    return counter;
}

function getMaxMinValueHistorical(data) {
    let historicalMinMaxData = data.map(crypto => {
        let cryptoWithHistoricalMaxMin = { ...crypto };
        cryptoWithHistoricalMaxMin.minPriceDataHistorical = cryptoWithHistoricalMaxMin.dailyStats.reduce((acc, val) => parseFloat(acc.price) < parseFloat(val.price) ? acc : acc = val);
        cryptoWithHistoricalMaxMin.maxPriceDataHistorical = cryptoWithHistoricalMaxMin.dailyStats.reduce((acc, val) => parseFloat(acc.price) > parseFloat(val.price) ? acc : acc = val);
        try {
            cryptoWithHistoricalMaxMin.minPriceDataHistorical.price = parseFloat(cryptoWithHistoricalMaxMin.minPriceDataHistorical.price).toFixed(10);
            cryptoWithHistoricalMaxMin.maxPriceDataHistorical.price = parseFloat(cryptoWithHistoricalMaxMin.maxPriceDataHistorical.price).toFixed(10);
        } catch (error) {
            console.error(error)
            console.log(cryptoWithHistoricalMaxMin)
        }
        return cryptoWithHistoricalMaxMin;
    });

    return historicalMinMaxData;
}

function getPercentChangeValue(data) {
    let historicalOrRangeMinDate = data[0].lowestPriceData ? "lowestPriceData" : "minPriceDataHistorical";
    let historicalOrRangeMaxDate = data[0].highestPriceData ? "highestPriceData" : "maxPriceDataHistorical"
    let cryptoWithPercentChange = data.map(crypto => {
        if (crypto[`${historicalOrRangeMinDate}`].date > crypto[`${historicalOrRangeMaxDate}`].date) {
            let differenceBetweenMaxMin = (crypto[`${historicalOrRangeMinDate}`].price - crypto[`${historicalOrRangeMaxDate}`].price) / crypto[`${historicalOrRangeMaxDate}`].price;
            let changeDifferenceToPercent = -Math.abs(differenceBetweenMaxMin) * 100;
            crypto.percentChange = changeDifferenceToPercent;

            return crypto;

        } else {
            let differenceBetweenMaxMin = (crypto[`${historicalOrRangeMaxDate}`].price - crypto[`${historicalOrRangeMinDate}`].price) / crypto[`${historicalOrRangeMinDate}`].price;
            let changeDifferenceToPercent = Math.abs(differenceBetweenMaxMin) * 100;


            crypto.percentChange = changeDifferenceToPercent;

            return crypto;
        }
    });

    return cryptoWithPercentChange;
}

function getCryptoFilteredByPercent(percent, crypto) {
    if (percent.growMore) {
        let filtered = crypto.filter(obj => obj.percentChange > 0 && obj.percentChange > percent.growMore);

        return filtered;
    };
    if (percent.growLess) {
        let filtered = crypto.filter(obj => obj.percentChange > 0 && obj.percentChange < percent.growLess);

        return filtered;
    };
    if (percent.shrinkMore) {
        let filtered = crypto.filter(obj => obj.percentChange < 0 && obj.percentChange < -Math.abs(percent.shrinkMore));

        return filtered;
    };
    if (percent.shrinkLess) {
        let filtered = crypto.filter(obj => obj.percentChange < 0 && obj.percentChange > -Math.abs(percent.shrinkLess));

        return filtered;
    }
}

function getBestPerformingCrypto(data) {
    let percentValue = getPercentValue();
    let dataWithPercentChange = getPercentChangeValue(data);
    let filteredByPercent = getCryptoFilteredByPercent(percentValue, dataWithPercentChange);

    return filteredByPercent;

}

function getWorstPerformingCrypto(data) {
    let percentValue = getPercentValue();
    let dataWithPercentChange = getPercentChangeValue(data);
    let filteredByPercent = getCryptoFilteredByPercent(percentValue, dataWithPercentChange);

    return filteredByPercent;

}

function getCryptoFilteredByTime(data) {
    validateDateFilter();
    let start = startEndSearchDate.start;
    let end = startEndSearchDate.end;
    let searchResults = [];
    data.forEach(crypto => {
        let filteredCrypto = {};
        filteredCrypto.id = crypto.id;
        filteredCrypto.name = crypto.name;
        filteredCrypto.dailyStats = [];
        let startEndFilteredData = crypto.dailyStats.filter(x => x.date >= start && x.date <= end);

        if (startEndFilteredData.length === 0) {
            return;
        }

        filteredCrypto.dailyStats.push(...startEndFilteredData);
        filteredCrypto.lowestPriceData = filteredCrypto.dailyStats.reduce((acc, val) => parseFloat(acc.price) < parseFloat(val.price) ? acc : acc = val);
        filteredCrypto.lowestPriceData.price = parseFloat(filteredCrypto.lowestPriceData.price).toFixed(10);
        filteredCrypto.highestPriceData = filteredCrypto.dailyStats.reduce((acc, val) => parseFloat(acc.price) > parseFloat(val.price) ? acc : acc = val);
        filteredCrypto.highestPriceData.price = parseFloat(filteredCrypto.highestPriceData.price).toFixed(10);
        searchResults.push(filteredCrypto);
    });

    let percentChange = getPercentChangeValue(searchResults);

    return percentChange;

}

function getCryptoWorthMoreThenDolar(data) {
    let cryptoWorthDolars = data.filter(obj => {
        let sumOfAllCryptoPrices = obj.dailyStats.reduce((sum, val) => sum + parseFloat(val.price), 0);
        let averagePrice = sumOfAllCryptoPrices / obj.dailyStats.length;

        return averagePrice > 1;

    })

    return cryptoWorthDolars;
}

function getCryptoWorthLessThenDolar(data) {
    let cryptoWorthCents = data.filter(obj => {
        let sumOfAllCryptoPrices = obj.dailyStats.reduce((sum, val) => sum + parseFloat(val.price), 0);
        let averagePrice = sumOfAllCryptoPrices / obj.dailyStats.length;

        return averagePrice < 1;

    })

    return cryptoWorthCents;
}

function getStartEndDateInUnix(event) {
    let startOrEnd = event.target.id
    let date = event.target.value;
    let unixDate = new Date(date).getTime();

    if (startOrEnd == "startSearchDate") {
        startEndSearchDate.start = unixDate
    } else {
        startEndSearchDate.end = unixDate
    }
}

function addEventListenersToFileReader(reader) {
    reader.addEventListener("loadstart", ()=> document.body.style.cursor = "wait");
    reader.addEventListener("loadend", ()=> document.body.style.cursor = "default");
}


function onCryptoUploaded(e) {
    let file = e.target.files[0];
    let reader = new FileReader();
    addEventListenersToFileReader(reader);
    reader.onload = function () {
        let dataToParse = reader.result;
        let parsedData = JSON.parse(dataToParse);
        cryptoData.push(...parsedData);
    }
    reader.readAsText(file);
}

function getSearchResults(event) {
    if (event.key === "Enter") {
        const searchedValue = event.target.value.toLowerCase();
        let filteredCurrencies = cryptoToSort.filter(currencyData =>
            currencyData.name.toLowerCase().includes(searchedValue) || currencyData.id.toLowerCase().includes(searchedValue));

        if (filteredCurrencies.length) {
            createAndDeleteTable(filteredCurrencies)
        }
        else {
            alert("0 cryptocurrencies with this id or name");
        }
    }
}

function addFavoritesFunc(e) {
    changeRowColor(e);
    changefavoriteCounterValue();
}


function changeRowColor(event) {
    event.path[1].style.backgroundColor === "" ? addCryptoToFavorites(event) : removeCryptoFromFavorites(event);
}

function addCryptoToFavorites(event) {
    event.path[1].style.backgroundColor = "green";
    let cryptoToAdd = event.path[1].cells[1].textContent;
    favoriteCrypto.push(cryptoToAdd);
    console.log(favoriteCrypto)

}

function removeCryptoFromFavorites(event) {
    event.path[1].style.backgroundColor = ""
    let cryptoToRemove = event.path[1].cells[1].textContent;
    let index = favoriteCrypto.indexOf(cryptoToRemove);
    index > -1 && favoriteCrypto.splice(index, 1);
    console.log(favoriteCrypto)
}

function changefavoriteCounterValue() {
    favoriteCounter[0].textContent = favoriteCrypto.length;
}

function showFavoritesInNewWindow() {
    createModal();
}

function createModal() {
    let modalBackdrop = document.createElement("div");
    modalBackdrop.setAttribute("class", "modalBackdrop");
    modalBackdrop.setAttribute("id", "modal");
    let modalCard = document.createElement("div");
    modalCard.setAttribute("class", "modalCard");
    modalBackdrop.appendChild(modalCard);
    document.getElementsByTagName("section")[0].appendChild(modalBackdrop);
    modalBackdrop.addEventListener("click", () => document.getElementById("modal").remove());
}


async function onDownloadAllCryptoButton() {
    let cryptoList = await fetchCryptoCurrenciesList();
    let currenciesData = await fetchCyrptoCurrencies(cryptoList)
    currenciesData.forEach(x => cryptoData.push(x));
    saveCryptoData(cryptoData);
}

function delayFetch(time) {

    return new Promise((resolve) => setTimeout(resolve, time));
}

async function fetchCyrptoCurrencies(cryptoList) {

    let fetchedData = [];

    for (let i = 0; i < cryptoList.length; i++) {
        try {
            await delayFetch(700);
            let cryptoID = cryptoList[i].id;
            let cryptoSymbol = cryptoList[i].symbol /// do sprawdzenia czy działa poprawnie
            let cryptoName = cryptoList[i].name;
            let inquiry = `https://api.coingecko.com/api/v3/coins/${cryptoID}/market_chart?vs_currency=USD&days=max&interval=daily`
            let dailyDataResponse = await fetch(inquiry);
            let dailyData = await dailyDataResponse.json();
            let ignore = ignoreDefaultCrypto(dailyData, 1620770400000);

            if (dailyData.error) {
                console.log(`${cryptoID} - ${cryptoName} data doesnt exists`);
                continue;

            } else if (ignore) {
                defaultedCryptocurrencies.push({ cryptoID: cryptoID, cryptoName: cryptoName });
                continue;
            }

            let currencyData = convertCurrencyDataToNewFormat(dailyData, cryptoName, cryptoSymbol);
            fetchedData.push(currencyData);
            console.log("krypto dodane:", fetchedData.length, "krypto smieci:", defaultedCryptocurrencies.length);
        } catch (error) {
            console.error(error);

        }
    }

    return fetchedData;
}

function ignoreDefaultCrypto(data, time) {
    if (data.prices == undefined) {
        let defaultCrypto = true;

        return defaultCrypto;
    }

    let defaultCrypto = data.prices.find(x => x[0] > time);

    if (defaultCrypto == undefined) {
        return true;

    } else if (defaultCrypto[1] > 0) {
        return false;

    } else {
        return true;
    }

}

async function fetchCryptoCurrenciesList() {
    let cryptoListReponse = await fetch("http://127.0.0.1:8080/Data/cryptoList.json");
    let cryptoList = await cryptoListReponse.json();

    return cryptoList;
}

function convertCurrencyDataToNewFormat(data, name, symbol) {
    let cryptoObj = {
        id: symbol,
        name: name,
        dailyStats: []
    }

    data.prices.forEach((x, i) => {
        let dailyStats = {};

        try {
            dailyStats.date = x[0];
            dailyStats.price = x[1]
            dailyStats.volume = parseInt(data.total_volumes[i][1]);
            dailyStats.marketCap = data.market_caps[i][1].toFixed(8);
            cryptoObj.dailyStats.push(dailyStats);
        } catch (error) {
            console.error(error);
        }
    })

    return cryptoObj;
}

function saveCryptoData(objData) {
    let strData = JSON.stringify(objData)
    let dataToSave = new Blob([strData], { type: "text/plain" });
    let saveingDataName = "Dane miesięczne kryptowalut";
    saveAs(dataToSave, saveingDataName)
}