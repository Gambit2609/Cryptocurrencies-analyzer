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
const counterUpInput = document.getElementById("counterUp");
const counterDownInput = document.getElementById("counterDown");
const dateFilterCheckbox = document.getElementById("dateFilterCheckbox");
const startDateFilter = document.getElementById("startDateFilter");
const endDateFilter = document.getElementById("endDateFilter");
const counterFilterCheckbox = document.getElementById("counterFilterCheckBox");
const counterFilter = document.getElementById("counterFilter");
const table = document.getElementById("table");

function addListeners() {
    uploadCryptoButton.addEventListener("change", onCryptoUploaded);
    startSearchDateInput.addEventListener("change", getStartEndDateInUnix);
    endSearchDateInput.addEventListener("change", getStartEndDateInUnix);
    calculateButton.addEventListener("click", onCalculatePressed);
    dateFilterCheckbox.addEventListener("change", showHideFilters);
    counterFilterCheckbox.addEventListener("change", showHideFilters);
    counterUpInput.addEventListener("change", disableEnableCounterUpInput);
    counterDownInput.addEventListener("change", disableEnableCounterDownInput);
}

addListeners();
showHideFilters();


function onCalculatePressed() {
    let cryptoWithHistoricalMaxMin = getMaxMinValueHistorical(cryptoData);
    let tokenFiltered = tokenCheckBox.checked ? getCryptoFilteredByToken(cryptoWithHistoricalMaxMin) : cryptoWithHistoricalMaxMin;
    let timeFiltered = dateFilterCheckbox.checked ? getCryptoFilteredByTime(tokenFiltered) : tokenFiltered;
    let counterFiltered = counterFilterCheckbox.checked ? getCryptoFilteredByMultiplier(timeFiltered) : timeFiltered;
    createAndDeleteTable(counterFiltered);// dodać sprawdzanie po procencie i dodać dodatkowy filtr z procentem negatywnym (o ile procent spadło dane krypto)
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
        if (obj.minPriceData) {
            let rowData = obj.minPriceData.price;
            addCellsToTable(row, rowData)
        }
        if (obj.maxPriceData) {
            let CryptoData = obj.maxPriceData.price;
            addCellsToTable(row, CryptoData)
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

function disableEnableCounterUpInput() {
    if (counterUpInput.valueAsNumber === 0) {
        counterDownInput.disabled = false;
    } else if (Number.isNaN(counterUpInput.valueAsNumber)) {
        counterDownInput.disabled = false;
    } else if (counterUpInput.valueAsNumber !== 0 || counterUpInput.valueAsNumber !== NaN) {
        counterDownInput.disabled = true;
    }
}

function disableEnableCounterDownInput() {
    if (counterDownInput.valueAsNumber === 0) {
        counterUpInput.disabled = false;
    } else if (Number.isNaN(counterDownInput.valueAsNumber)) {
        counterUpInput.disabled = false;
    } else if (counterDownInput.valueAsNumber !== 0 || counterDownInput.valueAsNumber !== NaN) {
        counterUpInput.disabled = true;
    }
}

function getCryptoFilteredByToken(data) {
    let filteredByToken = data.filter(obj => !obj.name.toLowerCase().includes("token"));

    return filteredByToken;
}

function showHideFilters() {
    dateFilterCheckbox.checked ? startDateFilter.style.display = "" : startDateFilter.style.display = "none";
    dateFilterCheckbox.checked ? endDateFilter.style.display = "" : endDateFilter.style.display = "none";
    counterFilterCheckbox.checked ? counterFilter.style.display = "" : counterFilter.style.display = "none";
}

function getCounterValue() {
    let counter = {};
    counterUpInput.value.length == 0 || counterUpInput.value == 0 ? counter.Up = undefined : counter.Up = parseInt(counterUpInput.value);
    counterDownInput.value.length == 0 || counterDownInput.value == 0 ? counter.Down = undefined : counter.Down = parseInt(counterDownInput.value);
    if (counter.Up < 0 || counter.Down < 0) {
        alert(`Value on "grow less/more" cannot be negative`);
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
    let dataWithPercentChange = getPercentChangeValue(data)
    // let maxMinValueWithTimeFilter = data.map(crypto => {
    //     let cryptoFiltered = { ...crypto };
    //     cryptoFiltered.minPriceData = crypto.dailyStats.reduce((acc, val) => acc.price < val.price ? acc : acc = val);
    //     cryptoFiltered.minPriceData.price = parseFloat(cryptoFiltered.minPriceData.price).toFixed(10);
    //     cryptoFiltered.maxPriceData = crypto.dailyStats.reduce((acc, val) => acc.price > val.price ? acc : acc = val);
    //     cryptoFiltered.maxPriceData.price = parseFloat(cryptoFiltered.maxPriceData.price).toFixed(10);

    //     return cryptoFiltered;

    // });
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
        filteredCrypto.minPriceDataHistorical = crypto.minPriceDataHistorical;
        filteredCrypto.maxPriceDataHistorical = crypto.maxPriceDataHistorical;
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
            await delayFetch(1000);
            let cryptoID = cryptoList[i].id;
            let cryptoName = cryptoList[i].name;
            let inquiry = `https://api.coingecko.com/api/v3/coins/${cryptoID}/market_chart?vs_currency=USD&days=max&interval=daily`
            let dailyDataResponse = await fetch(inquiry);
            let dailyData = await dailyDataResponse.json();
            let ignore = ignoreDefaultCrypto(dailyData, 1619740800000);

            if (dailyData.error) {
                console.log(`${cryptoID} - ${cryptoName} data doesnt exists`)
                continue;

            } else if (ignore) {
                defaultedCryptocurrencies.push({ cryptoID: cryptoID, cryptoName: cryptoName })
                continue;
            }

            let currencyData = convertCurrencyDataToNewFormat(dailyData, cryptoName, cryptoID);
            fetchedData.push(currencyData);
            console.log("krypto dodane:", fetchedData.length, "krypto smieci:", defaultedCryptocurrencies.length)
        } catch (error) {
            console.error(error);

        }
    }

    return fetchedData;
}

function ignoreDefaultCrypto(data, time) {
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
    let cryptoListReponse = await fetch("http://127.0.0.1:8080/Dane krypto/pełnaListaKrypto.json");
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