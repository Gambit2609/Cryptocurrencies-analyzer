const cryptocurrencies = [];
const defaultedCryptocurrencies = [];
const cryptoData = [];
const startEndSearchDate = {};
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
const dateFilterCheckbox = document.getElementById("dateFilterCheckbox");
const startDateFilter = document.getElementById("startDateFilter");
const endDateFilter = document.getElementById("endDateFilter");
const bestPerformingCryptoFilterCheckBox = document.getElementById("bestPerformingCryptoFilterCheckBox");
const bestPerFormingCryptoFilter = document.getElementById("bestPerFormingCryptoFilter");
const worstPerformingCryptoFilterCheckBox = document.getElementById("worstPerformingCryptoFilterCheckBox");
const worstPerFormingCryptoFilter = document.getElementById("worstPerFormingCryptoFilter");
const table = document.getElementById("table");

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
    growMoreThenInput.addEventListener("change", disableEnableGrowMoreThenInput);
    growLessThenInput.addEventListener("change", disableEnableGrowLessThenInput);
    shrinkMoreThenInput.addEventListener("change", disableEnableShrinkMoreThenInput);
    shrinkLessThenInput.addEventListener("change", disableEnableShrinkLessThenInput);
}

addListeners();
showHideFilters();


// 1. rozdzielić filtr na best/worst performing crypto
// 2. filtr na best / worst zrobić na zasadzie procentów a nie mnożnika
// 3. dodać opis w inputach best / worst dla informacji użytkownika
// 4. dodać filtr na wartość market cap
// 5. dodać filtr na wolumen
// 6. 


function onCalculatePressed() {
    let cryptoWithHistoricalMaxMin = getMaxMinValueHistorical(cryptoData);
    let tokenFiltered = tokenCheckBox.checked ? getCryptoFilteredByToken(cryptoWithHistoricalMaxMin) : cryptoWithHistoricalMaxMin;
    let timeFiltered = dateFilterCheckbox.checked ? getCryptoFilteredByTime(tokenFiltered) : tokenFiltered;
    let counterFiltered = bestPerformingCryptoFilterCheckBox.checked ? getCryptoFilteredByMultiplier(timeFiltered) : timeFiltered;
    createAndDeleteTable(counterFiltered);
    console.log(counterFiltered);
}

function createAndDeleteTable(cryptoToTable) {
    deleteTable();
    generateTableHead(table, cryptoToTable);
    generateTableRows(cryptoToTable)
}

function deleteTable() {
    let removeTable = table;
    if (removeTable.childElementCount > 0) {
        removeTable.removeChild(removeTable.childNodes[0]);
    } else {
        return;
    }
}

function addTableRows(row, rowName) {
    let th = document.createElement("th");
    let text = document.createTextNode(rowName);
    th.appendChild(text);
    row.appendChild(th);
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
        addTableRows(row, name);
    }
    if (propertyNames.includes("name")) {
        let name = "Crypto name";
        addTableRows(row, name);
    }
    if (propertyNames.includes("minPriceData")) {
        let name = "Lowest price";
        addTableRows(row, name);
    }
    if (propertyNames.includes("maxPriceData")) {
        let name = "Highest price";
        addTableRows(row, name);
    }
    if (propertyNames.includes("percentChange")) {
        let name = "Percent change";
        addTableRows(row, name);
    }
    if (propertyNames.includes("minPriceDataHistorical")) {
        let name = "Historical min. price";
        addTableRows(row, name);
    }
    if (propertyNames.includes("maxPriceDataHistorical")) {
        let name = "Historical max. price";
        addTableRows(row, name);
    }
}

function addCellsToTable(row, data) {
    let cell = row.insertCell();
    let text = document.createTextNode(data);
    cell.appendChild(text);
}

function generateTableRows(crypto) {
    crypto.forEach((obj, i) => {
        let row = table.insertRow();
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
            let rowData = obj.percentChange;
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
        if (obj.minPriceData) {
            let rowData = obj.minPriceData.price;
            addCellsToTable(row, rowData)
        }
        if (obj.maxPriceData) {
            let CryptoData = obj.maxPriceData.price;
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
    if (shrinkMoreThenInput.valueAsNumber === 0) {
        shrinkLessThenInput.disabled = false;
    } else if (Number.isNaN(shrinkMoreThenInput.valueAsNumber)) {
        shrinkLessThenInput.disabled = false;
    } else if (shrinkMoreThenInput.valueAsNumber !== 0 || shrinkMoreThenInput.valueAsNumber !== NaN) {
        shrinkLessThenInput.disabled = true;
    }
}

function disableEnableShrinkLessThenInput() {
    if (shrinkLessThenInput.valueAsNumber === 0) {
        shrinkMoreThenInput.disabled = false;
    } else if (Number.isNaN(shrinkLessThenInput.valueAsNumber)) {
        shrinkMoreThenInput.disabled = false;
    } else if (shrinkLessThenInput.valueAsNumber !== 0 || shrinkLessThenInput.valueAsNumber !== NaN) {
        shrinkMoreThenInput.disabled = true;
    }
}

function disableEnableGrowMoreThenInput() {
    if (growMoreThenInput.valueAsNumber === 0) {
        growLessThenInput.disabled = false;
    } else if (Number.isNaN(growMoreThenInput.valueAsNumber)) {
        growLessThenInput.disabled = false;
    } else if (growMoreThenInput.valueAsNumber !== 0 || growMoreThenInput.valueAsNumber !== NaN) {
        growLessThenInput.disabled = true;
    }
}

function disableEnableGrowLessThenInput() {
    if (growLessThenInput.valueAsNumber === 0) {
        growMoreThenInput.disabled = false;
    } else if (Number.isNaN(growLessThenInput.valueAsNumber)) {
        growMoreThenInput.disabled = false;
    } else if (growLessThenInput.valueAsNumber !== 0 || growLessThenInput.valueAsNumber !== NaN) {
        growMoreThenInput.disabled = true;
    }
}

function getCryptoFilteredByToken(data) {
    let filteredByToken = data.filter(obj => !obj.name.toLowerCase().includes("token"));

    return filteredByToken;
}

function hideWorstPerformingFilter() {
    if (bestPerformingCryptoFilterCheckBox.checked) {
        worstPerformingCryptoFilterCheckBox.checked = false;
    }
}

function hideBestPerformingFilter () {
    if (worstPerformingCryptoFilterCheckBox.checked) {
        bestPerformingCryptoFilterCheckBox.checked = false;
    }
}

function showHideFilters() {
    dateFilterCheckbox.checked ? startDateFilter.style.display = "" : startDateFilter.style.display = "none";
    dateFilterCheckbox.checked ? endDateFilter.style.display = "" : endDateFilter.style.display = "none";
    bestPerformingCryptoFilterCheckBox.checked ? bestPerFormingCryptoFilter.style.display = "" : bestPerFormingCryptoFilter.style.display = "none";
    worstPerformingCryptoFilterCheckBox.checked ? worstPerFormingCryptoFilter.style.display = "" : worstPerFormingCryptoFilter.style.display = "none";
}

function getCounterValue() {
    let counter = {};
    growMoreThenInput.value.length == 0 || growMoreThenInput.value == 0 ? counter.Up = undefined : counter.Up = parseInt(growMoreThenInput.value);
    growLessThenInput.value.length == 0 || growLessThenInput.value == 0 ? counter.Down = undefined : counter.Down = parseInt(growLessThenInput.value);
    if (counter.Up < 0 || counter.Down < 0) {
        alert(`Value on "grow less/more" cannot be negative`);
        throw new Error;
    }else if (counter.Up == undefined && counter.Down == undefined) {
        alert(`Value on "grow less/more" cannot be empty or has 0 value. Un match filter checkbox in case you don't want to use it`);
        throw new Error;
    }

    return counter;

}

function getMaxMinValueHistorical(data) {
    let historicalMinMaxData = data.map(crypto => {
        let cryptoWithHistoricalMaxMin = {...crypto};
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
    let historicalOrRangeMinDate = data[0].minPriceData ? "minPriceData" : "minPriceDataHistorical";
    let historicalOrRangeMaxDate = data[0].minPriceData ? "maxPriceData" : "maxPriceDataHistorical"
    let cryptoWithPercentChange = data.map(crypto => {
        if (crypto[`${historicalOrRangeMinDate}`].date > crypto[`${historicalOrRangeMaxDate}`].date) {
            let differenceBetweenMaxMin = (crypto[`${historicalOrRangeMinDate}`].price - crypto[`${historicalOrRangeMaxDate}`].price) / crypto[`${historicalOrRangeMaxDate}`].price;
            let changeDifferenceToPercent = -Math.abs(differenceBetweenMaxMin) * 100;
            crypto.percentChange = `${changeDifferenceToPercent.toFixed(2)}%`;
            return crypto;
        } else {
            let differenceBetweenMaxMin = (crypto[`${historicalOrRangeMaxDate}`].price - crypto[`${historicalOrRangeMinDate}`].price) / crypto[`${historicalOrRangeMinDate}`].price;
            let changeDifferenceToPercent = Math.abs(differenceBetweenMaxMin) * 100;


            crypto.percentChange = `${changeDifferenceToPercent.toFixed(2)}%`;
            return crypto;
        }
    });
    return cryptoWithPercentChange;
}


function getCryptoFilteredByMultiplier(data) {
    let counter = getCounterValue();
    let dataWithPercentChange = getPercentChangeValue(data);
    let filteredByCounter = [];
    if (dataWithPercentChange[0].minPriceData && dataWithPercentChange[0].maxPriceData) {
        if (counter.Up) {
            let filtered = dataWithPercentChange.filter(obj => obj.maxPriceData.price > (obj.minPriceData.price * counter.Up) && parseFloat(obj.percentChange) > 0);
            filteredByCounter.push(...filtered);
        } else {
            let filtered = dataWithPercentChange.filter(obj => obj.maxPriceData.price < (obj.minPriceData.price * counter.Down) && parseFloat(obj.percentChange) > 0);
            filteredByCounter.push(...filtered);
        }

        return filteredByCounter;

    } else {
        if (counter.Up) {
            let filtered = dataWithPercentChange.filter(obj => obj.maxPriceDataHistorical.price > (obj.minPriceDataHistorical.price * counter.Up) && parseFloat(obj.percentChange) > 0);
            filteredByCounter.push(...filtered);
        } else {
            let filtered = dataWithPercentChange.filter(obj => obj.maxPriceDataHistorical.price < (obj.minPriceDataHistorical.price * counter.Down) && parseFloat(obj.percentChange) > 0);
            filteredByCounter.push(...filtered);
        }
        return filteredByCounter;
    }

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
        filteredCrypto.minPriceData = filteredCrypto.dailyStats.reduce((acc, val) => acc.price < val.price ? acc : acc = val);
        filteredCrypto.minPriceData.price = parseFloat(filteredCrypto.minPriceData.price).toFixed(10);
        filteredCrypto.maxPriceData = filteredCrypto.dailyStats.reduce((acc, val) => acc.price > val.price ? acc : acc = val);
        filteredCrypto.maxPriceData.price = parseFloat(filteredCrypto.maxPriceData.price).toFixed(10);
        searchResults.push(filteredCrypto);
    });

    let percentChange = getPercentChangeValue(searchResults);

    return percentChange;
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

function onStartReaderLoad() {
    document.body.style.cursor = "wait";
}

function onLoadFinish() {
    document.body.style.cursor = "default"
}

function addEventListenersToFileReader(reader) {
    reader.addEventListener("loadstart", onStartReaderLoad);
    reader.addEventListener("loadend", onLoadFinish);
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
            await delayFetch(500);
            let cryptoID = cryptoList[i].id;
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

            let currencyData = convertCurrencyDataToNewFormat(dailyData, cryptoName, cryptoID);
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

function convertCurrencyDataToNewFormat(data, name, id) {
    let cryptoObj = {
        id: id,
        name: name,
        dailyStats: []
    }

    data.prices.forEach((x, i) => {
        let dailyStats = {};
        dailyStats.date = x[0];
        dailyStats.price = x[1]
        dailyStats.volume = parseInt(data.total_volumes[i][1]);
        dailyStats.marketCap = data.market_caps[i][1].toFixed(8);
        cryptoObj.dailyStats.push(dailyStats);
    })

    return cryptoObj;
}

function saveCryptoData(objData) {
    let strData = JSON.stringify(objData)
    let dataToSave = new Blob([strData], { type: "text/plain" });
    let saveingDataName = "Dane miesięczne kryptowalut";
    saveAs(dataToSave, saveingDataName)
}