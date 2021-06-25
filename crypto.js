const cryptocurrencies = [];
const defaultedCryptocurrencies = [];
const cryptoData = [];
const startEndSearchDate = {};
const startEndSearchDateModal = {};
const favoriteCryptoList = [];
const tableList = [];
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
const mainTable = document.getElementById("mainTable");
const favoritesContainer = document.getElementsByClassName("favoritesContainer");
const favoriteCounter = document.getElementsByClassName("favoriteCounter");
const showFavoritesButton = document.getElementById("show-favorite-list");
const bestWorstCryptoIn24HInput = document.getElementById('best-worst-crypto');
const bestWorstCryptoLabel = document.getElementById("best-worst-crypto-label");
const footerSideBar = document.querySelector(".footer-side-bar");
const footerMailImage = document.getElementById("footer-mail-image");
const footerEmail = document.querySelector(".email-background");
const emailSubmitButton = document.getElementById("email-submit-button");
const emailForm = document.getElementById("footer-email-form");
const mailCloseButton = document.getElementById("mail-close-button");
const iconSideBar = document.querySelector(".icon-side-bar");
let calculatedCryptoList = [];
let searchedCrypto = [];
let favoriteListFiltered = [];


function addListeners() {
    uploadCryptoButton.addEventListener("change", onCryptoUploaded);
    startSearchDateInput.addEventListener("change", getStartEndDateInUnix);
    endSearchDateInput.addEventListener("change", getStartEndDateInUnix);
    calculateButton.addEventListener("click", () => { onCalculatePressed(cryptoData, mainTable) });
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
    showFavoritesButton.addEventListener("click", showFavoritesInNewWindow);
    footerSideBar.addEventListener("mouseover", () => mainTable.style.opacity = "0.3");
    footerSideBar.addEventListener("mouseleave", () => mainTable.style.opacity = "1");
    footerMailImage.addEventListener("click", () => footerEmail.style.display = "flex");
    emailForm.addEventListener("submit", () => footerEmail.style.display = "none");
    mailCloseButton.addEventListener("click", () => footerEmail.style.display = "none");
    iconSideBar.addEventListener("mouseover", ()=> sideBar[0].style.transform = "translate(160px)")
    iconSideBar.addEventListener("mouseleave", ()=> sideBar[0].style.transform = "translate(0px)")
    sideBar[0].addEventListener("mouseleave", ()=> sideBar[0].style.transform = "translate(0px)")
    sideBar[0].addEventListener("mouseover", ()=> sideBar[0].style.transform = "translate(160px)")

}

addListeners();
showHideFilters();
// onDownloadAllCryptoButton();





function onCalculatePressed(data, table, modalCalculation) {
    let token = tokenCheckBox;
    let dateFilter = dateFilterCheckbox;
    let bestPerformingCryptoFilter = bestPerformingCryptoFilterCheckBox;
    let worstPerFormingCryptoFilter = worstPerformingCryptoFilterCheckBox;
    let cryptoWorthDolarsFilter = cryptoWorthDolarsCheckBox;
    let cryptoWorthCentsFilter = cryptoWorthCentsCheckBox;
    if (modalCalculation) {
        token = document.getElementById("modalTokenFilter");
        dateFilter = document.getElementById("modalDateFilter");
        bestPerformingCryptoFilter = document.getElementById("modalBestFilter");
        worstPerFormingCryptoFilter = document.getElementById("modalWorstFilter");
        cryptoWorthDolarsFilter = document.getElementById("modalDolarFilter");
        cryptoWorthCentsFilter = document.getElementById("modalCentFilter");


    }
    if (data === cryptoData) {
        calculatedCryptoList = [];
        searchedCrypto = [];
    }

    let cryptoWithHistoricalMaxMin = getMaxMinValueHistorical(data);
    let tokenFiltered = token.checked ? getCryptoFilteredByToken(cryptoWithHistoricalMaxMin) : cryptoWithHistoricalMaxMin;
    let timeFiltered = dateFilter.checked ? getCryptoFilteredByTime(tokenFiltered, modalCalculation) : tokenFiltered;
    let bestPerformingCryptoFiltered = bestPerformingCryptoFilter.checked ? getBestPerformingCrypto(timeFiltered, modalCalculation) : timeFiltered;
    let worstPerformingCryptoFiltered = worstPerFormingCryptoFilter.checked ? getWorstPerformingCrypto(bestPerformingCryptoFiltered, modalCalculation) : bestPerformingCryptoFiltered;
    let cryptoWorthDolarsFiltered = cryptoWorthDolarsFilter.checked ? getCryptoWorthMoreThenDolar(worstPerformingCryptoFiltered) : worstPerformingCryptoFiltered;
    let cryptoWorthCentsFiltered = cryptoWorthCentsFilter.checked ? getCryptoWorthLessThenDolar(cryptoWorthDolarsFiltered) : cryptoWorthDolarsFiltered;
    modalCalculation && askUserForConfirmationAppliedFilters(cryptoWorthCentsFiltered);

    if (data === favoriteCryptoList) {
        favoriteListFiltered = [...cryptoWorthCentsFiltered];
    }else{
        calculatedCryptoList.push(...cryptoWorthCentsFiltered);
    }
    createAndDeleteTable(table, cryptoWorthCentsFiltered);
    addListenersToTable();
    addTableToList(table);
    console.log(cryptoWorthCentsFiltered);
}



function createAndDeleteTable(table, cryptoToTable) {
    deleteTable(table);
    generateTableHead(table, cryptoToTable);
    generateTableRows(table, cryptoToTable);
}

function deleteTable(table) {
    table.childElementCount && table.removeChild(table.childNodes[0])
}

function generateTableHead(table, crypto) {
    let thead = table.createTHead();
    let row = thead.insertRow();
    let th = document.createElement("th");
    let text = document.createTextNode("");
    th.appendChild(text);
    row.appendChild(th);
    let propertyNames = Object.keys(crypto[0]);

    if (propertyNames.includes("id")) {
        let name = "Symbol";
        let nameWithChanges = name.replaceAll(" ", "").replaceAll(".", "");
        addHeaderCellToRow(table, row, name, nameWithChanges);
    }
    if (propertyNames.includes("name")) {
        let name = "Crypto name";
        let nameWithChanges = name.replaceAll(" ", "").replaceAll(".", "");
        addHeaderCellToRow(table, row, name, nameWithChanges);
    }
    if (propertyNames.includes("percentChange")) {
        let name = "Percent change";
        let nameWithChanges = name.replaceAll(" ", "").replaceAll(".", "");
        addHeaderCellToRow(table, row, name, nameWithChanges);
    }
    if (propertyNames.includes("lowestPriceData")) {
        let name = "Lowest price";
        let nameWithChanges = name.replaceAll(" ", "").replaceAll(".", "");
        addHeaderCellToRow(table, row, name, nameWithChanges);
    }
    if (propertyNames.includes("highestPriceData")) {
        let name = "Highest price";
        let nameWithChanges = name.replaceAll(" ", "").replaceAll(".", "");
        addHeaderCellToRow(table, row, name, nameWithChanges);
    }
    if (propertyNames.includes("minPriceDataHistorical")) {
        let name = "Historical min. price";
        let nameWithChanges = name.replaceAll(" ", "").replaceAll(".", "");
        addHeaderCellToRow(table, row, name, nameWithChanges);
    }
    if (propertyNames.includes("maxPriceDataHistorical")) {
        let name = "Historical max. price";
        let nameWithChanges = name.replaceAll(" ", "").replaceAll(".", "");
        addHeaderCellToRow(table, row, name, nameWithChanges);
    }
    if (propertyNames.includes("averagePrice")) {
        let name = "Average price";
        let nameWithChanges = name.replaceAll(" ", "").replaceAll(".", "");
        addHeaderCellToRow(table, row, name, nameWithChanges);
    }
}

function addCellsToTable(row, data) {
    let cell = row.insertCell();
    let text = document.createTextNode(data);
    cell.appendChild(text);
}

function addHeaderCellToRow(table, row, rowName, filterName) {
    let arrowWrapper = document.createElement("div");
    arrowWrapper.setAttribute("class", "arrow-wrapper");
    let arrowUpUnicode = String.fromCharCode("9650");
    let arrowDownUnicode = String.fromCharCode("9660");
    let th = document.createElement("th");
    let arrowUpButton = document.createElement("button");
    let arrowDownButton = document.createElement("button");
    arrowUpButton.setAttribute("id", `${filterName}FilterArrowUp${table.id}`);
    arrowDownButton.setAttribute("id", `${filterName}FilterArrowDown${table.id}`)
    let arrowUp = document.createTextNode(arrowUpUnicode);
    let arrowDown = document.createTextNode(arrowDownUnicode);
    let text = document.createTextNode(rowName);
    arrowUpButton.appendChild(arrowUp);
    arrowDownButton.appendChild(arrowDown);
    th.appendChild(text);
    th.appendChild(arrowWrapper);
    arrowWrapper.appendChild(arrowUpButton);
    arrowWrapper.appendChild(arrowDownButton);
    row.appendChild(th);
    addEventListenerToSortFilter(arrowUpButton, arrowDownButton)
}

function generateTableRows(table, crypto) {
    crypto.forEach((obj, i) => {
        let row = table.insertRow();
        row.addEventListener("click", addFavoritesFunc);
        checkForFavorites(obj.name, row)
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

        if (obj.percentChange == 0 || obj.percentChange) {
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
        if (obj.averagePrice) {
            let rowData = obj.averagePrice;
            addCellsToTable(row, rowData)
        }

    });
}

function addListenersToTable() {
    favoritesContainer[0].addEventListener("mouseover", () => mainTable.style.opacity = "0.3");
    favoritesContainer[0].addEventListener("mouseleave", () => mainTable.style.opacity = "1");
}

function checkForFavorites(objName, row) {
    favoriteCryptoList.find(x => x.name === objName) ? row.style.backgroundColor = "lightgreen" : row.style.backgroundColor = "";
}

function addEventListenerToSortFilter(sortUp, sortDown) {
    document.getElementById(sortUp.id).addEventListener("click", findTableColumnToSort);
    document.getElementById(sortDown.id).addEventListener("click", findTableColumnToSort);
}

function findTableColumnToSort(event) {
    let rowNameToSort = event.target.id.toLowerCase();
    rowNameToSort.includes("symbol") && rowNameToSort.includes("up") && sortUp(rowNameToSort, "id");
    rowNameToSort.includes("symbol") && rowNameToSort.includes("down") && sortDown(rowNameToSort, "id");
    rowNameToSort.includes("name") && rowNameToSort.includes("up") && sortUp(rowNameToSort, "name");
    rowNameToSort.includes("name") && rowNameToSort.includes("down") && sortDown(rowNameToSort, "name");
    rowNameToSort.includes("lowest") && rowNameToSort.includes("up") && sortUp(rowNameToSort, "lowestPriceData", "price");
    rowNameToSort.includes("lowest") && rowNameToSort.includes("down") && sortDown(rowNameToSort, "lowestPriceData", "price");
    rowNameToSort.includes("highest") && rowNameToSort.includes("up") && sortUp(rowNameToSort, "highestPriceData", "price");
    rowNameToSort.includes("highest") && rowNameToSort.includes("down") && sortDown(rowNameToSort, "highestPriceData", "price");
    rowNameToSort.includes("min") && rowNameToSort.includes("up") && sortUp(rowNameToSort, "minPriceDataHistorical", "price");
    rowNameToSort.includes("min") && rowNameToSort.includes("down") && sortDown(rowNameToSort, "minPriceDataHistorical", "price");
    rowNameToSort.includes("max") && rowNameToSort.includes("up") && sortUp(rowNameToSort, "maxPriceDataHistorical", "price");
    rowNameToSort.includes("max") && rowNameToSort.includes("down") && sortDown(rowNameToSort, "maxPriceDataHistorical", "price");
    rowNameToSort.includes("percent") && rowNameToSort.includes("up") && sortUp(rowNameToSort, "percentChange");
    rowNameToSort.includes("percent") && rowNameToSort.includes("down") && sortDown(rowNameToSort, "percentChange");
    rowNameToSort.includes("average") && rowNameToSort.includes("up") && sortUp(rowNameToSort, "averagePrice");
    rowNameToSort.includes("average") && rowNameToSort.includes("down") && sortDown(rowNameToSort, "averagePrice");
}

function sortUp(rowName, cryptoKey, cryptoSecondKey) {
    let table = rowName.includes("modal") ? document.getElementById("modalTable") : document.getElementById("mainTable");
    let dataToSort = sortFrom(table);
    if (cryptoKey === "id" || cryptoKey === "name") {
        dataToSort.sort((a, b) => a[cryptoKey].localeCompare(b[cryptoKey]));
        createAndDeleteTable(table, dataToSort);
    } else if (cryptoKey === "percentChange" || cryptoKey === "averagePrice") {
        dataToSort.sort((a, b) => parseFloat(a[cryptoKey]) - parseFloat(b[cryptoKey]));
        createAndDeleteTable(table, dataToSort);
    } else {
        dataToSort.sort((a, b) => parseFloat(a[cryptoKey][cryptoSecondKey]) - parseFloat(b[cryptoKey][cryptoSecondKey]));
        createAndDeleteTable(table, dataToSort);
    }
}

function sortDown(rowName, cryptoKey, cryptoSecondKey) {
    let table = rowName.includes("modal") ? document.getElementById("modalTable") : document.getElementById("mainTable");
    let dataToSort = sortFrom(table);
    if (cryptoKey === "id" || cryptoKey === "name") {
        dataToSort.sort((a, b) => b[cryptoKey].localeCompare(a[cryptoKey]));
        createAndDeleteTable(table, dataToSort);
    } else if (cryptoKey === "percentChange" || cryptoKey === "averagePrice") {
        dataToSort.sort((a, b) => parseFloat(b[cryptoKey]) - parseFloat(a[cryptoKey]));
        createAndDeleteTable(table, dataToSort);
    } else {
        dataToSort.sort((a, b) => parseFloat(b[cryptoKey][cryptoSecondKey]) - parseFloat(a[cryptoKey][cryptoSecondKey]));
        createAndDeleteTable(table, dataToSort);
    }
}

function sortFrom(table) {
    if (table.id === "mainTable") {
        let cryptoToSort = searchedCrypto.length ? searchedCrypto : calculatedCryptoList;

        return cryptoToSort;

    } else {

        let cryptoToSort = favoriteListFiltered.length ? favoriteListFiltered : favoriteCryptoList;

        return cryptoToSort;
    }
}

function validateDateFilter(modalCalculation) {
    let startSearch = startEndSearchDate.start;
    let endSearch = startEndSearchDate.end;
    if (modalCalculation) {
        startSearch = startEndSearchDateModal.start;
        endSearch = startEndSearchDateModal.end;
    }
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

function disableEnableShrinkMoreThenInput(modalShrinkMore, modalShrinkLess) {
    shrinkLessThenInput.value !== "" ? shrinkMoreThenInput.disabled = true : shrinkMoreThenInput.disabled = false;
    try {
        modalShrinkLess.value !== "" ? modalShrinkMore.disabled = true : modalShrinkMore.disabled = false;
    } catch (error) {
    }
}

function disableEnableShrinkLessThenInput(modalShrinkMore, modalShrinkLess) {
    shrinkMoreThenInput.value !== "" ? shrinkLessThenInput.disabled = true : shrinkLessThenInput.disabled = false;
    try {
        modalShrinkMore.value !== "" ? modalShrinkLess.disabled = true : modalShrinkLess.disabled = false;
    } catch (error) {
    }
}

function disableEnableGrowLessThenInput(modalGrowMore, modalGrowLess) {
    growMoreThenInput.value !== "" ? growLessThenInput.disabled = true : growLessThenInput.disabled = false;
    try {
        modalGrowMore.value !== "" ? modalGrowLess.disabled = true : modalGrowLess.disabled = false;
    } catch (error) {
    }
}

function disableEnableGrowMoreThenInput(modalGrowMore, modalGrowLess) {
    growLessThenInput.value !== "" ? growMoreThenInput.disabled = true : growMoreThenInput.disabled = false;
    try {
        modalGrowLess.value !== "" ? modalGrowMore.disabled = true : modalGrowMore.disabled = false;
    } catch (error) {
    }

}

function disableCryptoWorthCentsCheckBox(modalCheckBoxDolar, modalCheckBoxCents) {
    if (cryptoWorthDolarsCheckBox.checked) {
        cryptoWorthCentsCheckBox.checked = false;
    }
    try {
        if (modalCheckBoxDolar.checked) {
            modalCheckBoxCents.checked = false;
        }

    } catch (error) {
    }
};

function disableCryptoWorthDolarsCheckBox(modalCheckBoxDolar, modalCheckBoxCents) {
    if (cryptoWorthCentsCheckBox.checked) {
        cryptoWorthDolarsCheckBox.checked = false;
    }
    try {
        if (modalCheckBoxCents.checked) {
            modalCheckBoxDolar.checked = false;
        }
    } catch (error) {
    }
};

function getCryptoFilteredByToken(data) {

    let filteredByToken = data.filter(obj => !obj.name.toLowerCase().includes("token"));

    return filteredByToken;
}

function hideWorstPerformingFilter(modalBestPerformingCheckbox, modalWorstPerformingCheckbox, modalShrinkMoreInput, modalShrinkLessInput) {
    if (bestPerformingCryptoFilterCheckBox.checked) {
        worstPerformingCryptoFilterCheckBox.checked = false;
        shrinkLessThenInput.value = null;
        shrinkMoreThenInput.value = null;
        disableEnableShrinkMoreThenInput();
        disableEnableShrinkLessThenInput();
    }
    try {
        if (modalBestPerformingCheckbox.checked) {
            modalWorstPerformingCheckbox.checked = false;
            modalShrinkLessInput.value = null;
            modalShrinkMoreInput.value = null;
            disableEnableShrinkMoreThenInput(modalShrinkMoreInput, modalShrinkLessInput);
            disableEnableShrinkLessThenInput(modalShrinkMoreInput, modalShrinkLessInput);
        }
    } catch (error) {
    }
}

function hideBestPerformingFilter(modalBestPerformingCheckbox, modalWorstPerformingCheckbox, modalGrowMoreInput, modalGrowLessInput) {
    if (worstPerformingCryptoFilterCheckBox.checked) {
        bestPerformingCryptoFilterCheckBox.checked = false;
        growLessThenInput.value = null;
        growMoreThenInput.value = null;
        disableEnableGrowLessThenInput();
        disableEnableGrowMoreThenInput();
    }
    try {
        if (modalWorstPerformingCheckbox.checked) {
            modalBestPerformingCheckbox.checked = false;
            modalGrowLessInput.value = null;
            modalGrowMoreInput.value = null;
            disableEnableGrowLessThenInput(modalGrowMoreInput, modalGrowLessInput);
            disableEnableGrowMoreThenInput(modalGrowMoreInput, modalGrowLessInput);
        }
    } catch (error) {
    }
}

function showHideFilters() {
    try {
        const modalStartDateFilter = document.getElementById("modalStartDateFilter");
        const modalEndDateFilter = document.getElementById("modalEndDateFilter");
        const modalBestPerformingCryptoGrowMore = document.getElementById("modalBestPerformingCryptoGrowMore");
        const modalBestPerformingCryptoGrowLess = document.getElementById("modalBestPerformingCryptoGrowLess");
        const modalWorstPerformingCryptoShrinkMore = document.getElementById("modalWorstPerformingCryptoShrinkMore");
        const modalWorstPerformingCryptoShrinkLess = document.getElementById("modalWorstPerformingCryptoShrinkLess");

        document.getElementById("modalDateFilter").checked ? modalStartDateFilter.style.display = "" : modalStartDateFilter.style.display = "none"
        document.getElementById("modalDateFilter").checked ? modalEndDateFilter.style.display = "" : modalEndDateFilter.style.display = "none";
        document.getElementById("modalBestFilter").checked ? modalBestPerformingCryptoGrowMore.style.display = "" : modalBestPerformingCryptoGrowMore.style.display = "none";
        document.getElementById("modalBestFilter").checked ? modalBestPerformingCryptoGrowLess.style.display = "" : modalBestPerformingCryptoGrowLess.style.display = "none";
        document.getElementById("modalWorstFilter").checked ? modalWorstPerformingCryptoShrinkMore.style.display = "" : modalWorstPerformingCryptoShrinkMore.style.display = "none";
        document.getElementById("modalWorstFilter").checked ? modalWorstPerformingCryptoShrinkLess.style.display = "" : modalWorstPerformingCryptoShrinkLess.style.display = "none";
    } catch (error) {
    }
    dateFilterCheckbox.checked ? startDateFilter.style.display = "" : startDateFilter.style.display = "none";
    dateFilterCheckbox.checked ? endDateFilter.style.display = "" : endDateFilter.style.display = "none";
    bestPerformingCryptoFilterCheckBox.checked ? bestPerFormingCryptoFilter.style.display = "" : bestPerFormingCryptoFilter.style.display = "none";
    worstPerformingCryptoFilterCheckBox.checked ? worstPerFormingCryptoFilter.style.display = "" : worstPerFormingCryptoFilter.style.display = "none";

}

function getPercentValue(modalCalculation) {
    let counter = {};
    let grownMoreInput = growMoreThenInput;
    let growLessInput = growLessThenInput;
    let shrinkMoreInput = shrinkMoreThenInput;
    let shrinkLessInput = shrinkLessThenInput;
    if (modalCalculation) {
        grownMoreInput = document.getElementById("modalBestPerformingCryptoGrowMore");
        growLessInput = document.getElementById("modalBestPerformingCryptoGrowLess");
        shrinkMoreInput = document.getElementById("modalWorstPerformingCryptoShrinkMore");
        shrinkLessInput = document.getElementById("modalWorstPerformingCryptoShrinkLess");


    }
    grownMoreInput.value ? counter.growMore = parseFloat(grownMoreInput.value) : counter.growMore = undefined;
    growLessInput.value ? counter.growLess = parseFloat(growLessInput.value) : counter.growLess = undefined;
    shrinkMoreInput.value ? counter.shrinkMore = parseFloat(shrinkMoreInput.value) : counter.shrinkMore = undefined;
    shrinkLessInput.value ? counter.shrinkLess = parseFloat(shrinkLessInput.value) : counter.shrinkLess = undefined;
    if (counter.growLess < 0 || counter.growMore < 0 || counter.shrinkLess < 0 || counter.shrinkMore < 0) {
        alert(`Percent value cannot be negative`);
        throw new Error;
    } else if (counter.growLess == 0 || counter.growMore == 0 || counter.shrinkLess == 0 || counter.shrinkMore == 0) {
        alert(`Percent value cannot has 0 value. Un match filter checkbox in case you don't want to use it`);
        throw new Error;
    } else if (counter.growLess == undefined && counter.growMore == undefined && counter.shrinkMore == undefined && counter.shrinkLess == undefined) {
        alert(`Percent value cannot be empty. Un match filter checkbox in case you don't want to use it`);
        throw new Error;
    } else if (counter.shrinkMore > 100) {
        alert(`Its not possible to shrink more then 100%. Correct "shrink more then" value.`);
        throw new Error;
    }

    return counter;
}

function getMaxMinValueHistorical(data) {
    let cryptoWithHistoricalMinMaxData = data.map(crypto => {
        let cryptoWithHistoricalMaxMin = { ...crypto };
        let minPriceData = cryptoWithHistoricalMaxMin.dailyStats.reduce((acc, val) => {
            if (parseFloat(acc.price) < 0) {

                return acc.price = val.price;
            } else {

                return parseFloat(acc.price) < parseFloat(val.price) ? acc : acc = val;
            }
        });
        cryptoWithHistoricalMaxMin.minPriceDataHistorical = { ...minPriceData };
        let maxPriceData = cryptoWithHistoricalMaxMin.dailyStats.reduce((acc, val) => parseFloat(acc.price) > parseFloat(val.price) ? acc : acc = val);
        cryptoWithHistoricalMaxMin.maxPriceDataHistorical = { ...maxPriceData };
        try {
            cryptoWithHistoricalMaxMin.minPriceDataHistorical.price = parseFloat(cryptoWithHistoricalMaxMin.minPriceDataHistorical.price).toFixed(10);
            cryptoWithHistoricalMaxMin.maxPriceDataHistorical.price = parseFloat(cryptoWithHistoricalMaxMin.maxPriceDataHistorical.price).toFixed(10);
        } catch (error) {
            console.error(error)
            console.log(cryptoWithHistoricalMaxMin)
        }

        return cryptoWithHistoricalMaxMin;
    });

    let dataWithoutDefaultedCrypto = cryptoWithHistoricalMinMaxData.filter(x => x.minPriceDataHistorical.price > 0);

    return dataWithoutDefaultedCrypto;
}

function getPercentChangeValue(data) {
    if (!data.length) {
        return [];
    }
    let historicalOrRangeMinDate = data[0].lowestPriceData ? "lowestPriceData" : "minPriceDataHistorical";
    let historicalOrRangeMaxDate = data[0].highestPriceData ? "highestPriceData" : "maxPriceDataHistorical"
    let cryptoWithPercentChange = data.map(crypto => {
        if (crypto[`${historicalOrRangeMinDate}`].date > crypto[`${historicalOrRangeMaxDate}`].date) {
            let differenceBetweenMaxMin = (crypto[`${historicalOrRangeMinDate}`].price - crypto[`${historicalOrRangeMaxDate}`].price) / crypto[`${historicalOrRangeMaxDate}`].price;
            let changeDifferenceToPercent = -Math.abs(differenceBetweenMaxMin) * 100;

            crypto.percentChange = !Number.isNaN(changeDifferenceToPercent) ? changeDifferenceToPercent : 0

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

function getBestPerformingCrypto(data, modalCalculation) {
    let percentValue = getPercentValue(modalCalculation);
    let dataWithPercentChange = getPercentChangeValue(data);
    let filteredByPercent = getCryptoFilteredByPercent(percentValue, dataWithPercentChange);

    return filteredByPercent;

}

function getWorstPerformingCrypto(data, modalCalculation) {
    let percentValue = getPercentValue(modalCalculation);
    let dataWithPercentChange = getPercentChangeValue(data);
    let filteredByPercent = getCryptoFilteredByPercent(percentValue, dataWithPercentChange);

    return filteredByPercent;

}

function getCryptoFilteredByTime(data, modalCalculation) {
    validateDateFilter(modalCalculation);
    let start = startEndSearchDate.start;
    let end = startEndSearchDate.end;
    if (modalCalculation) {
        start = startEndSearchDateModal.start;
        end = startEndSearchDateModal.end;
    }
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
        let lowestPrice = filteredCrypto.dailyStats.reduce((acc, val) => parseFloat(acc.price) < parseFloat(val.price) ? acc : acc = val);
        filteredCrypto.lowestPriceData = { ...lowestPrice };
        filteredCrypto.lowestPriceData.price = parseFloat(filteredCrypto.lowestPriceData.price).toFixed(10);
        let highestPrice = filteredCrypto.dailyStats.reduce((acc, val) => parseFloat(acc.price) > parseFloat(val.price) ? acc : acc = val);
        filteredCrypto.highestPriceData = { ...highestPrice };
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
        let fixedAverage = averagePrice.toFixed(10);
        obj.averagePrice = fixedAverage;

        return averagePrice > 1;

    })

    return cryptoWorthDolars;
}

function getCryptoWorthLessThenDolar(data) {
    let cryptoWorthCents = data.filter(obj => {
        let sumOfAllCryptoPrices = obj.dailyStats.reduce((sum, val) => sum + parseFloat(val.price), 0);
        let averagePrice = sumOfAllCryptoPrices / obj.dailyStats.length;
        let fixedAverage = averagePrice.toFixed(10);
        obj.averagePrice = fixedAverage;

        return averagePrice < 1;

    })

    return cryptoWorthCents;
}

function getStartEndDateInUnix(event) {
    let startOrEnd = event.target.id;
    let date = event.target.value;
    let unixDate = new Date(date).getTime();

    if (startOrEnd == "startSearchDate") {
        startEndSearchDate.start = unixDate
    }
    if (startOrEnd == "endSearchDate") {
        startEndSearchDate.end = unixDate
    }
    if (startOrEnd == "modalStartDateFilter") {
        startEndSearchDateModal.start = unixDate
    }
    if (startOrEnd == "modalEndDateFilter") {
        startEndSearchDateModal.end = unixDate
    }
}


function addEventListenersToFileReader(reader) {
    reader.addEventListener("loadstart", () => document.body.style.cursor = "wait");
    reader.addEventListener("loadstart", () => document.getElementsByClassName("loader-animation-background")[0].style.display = "flex");
    reader.addEventListener("loadend", () => {
        document.getElementsByClassName("loader-text")[0].style.textShadow = "  0 0 25px #49ff18, 0 0 30px #49FF18, 0 0 35px #49FF18";
        document.getElementsByClassName("loader-text")[0].textContent = "Done!";
        setTimeout(()=>document.getElementsByClassName("welcome-header-background")[0].remove(), 1500);
        document.body.style.cursor = "default";
        showBiggestWinnersAndLoosers(3000);
    }
    );
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
        if (calculatedCryptoList.length === 0){
            alert("Calculate your crypto first");
            throw new Error("Calculate crypto before searching");
        }
        const searchedValue = event.target.value.toLowerCase();
        let filteredCurrencies = calculatedCryptoList.filter(currencyData =>
            currencyData.name.toLowerCase().includes(searchedValue) || currencyData.id.toLowerCase().includes(searchedValue));

        if (filteredCurrencies.length) {
            searchedCrypto = [];
            createAndDeleteTable(mainTable, filteredCurrencies);
            searchedCrypto.push(...filteredCurrencies);
        }
        else {
            alert("0 cryptocurrencies with this symbol or name");
        }
    }
}

function addFavoritesFunc(e) {
    checkFavorites(e);
    changefavoriteCounterValue();
}


function checkFavorites(event) {
    let cryptoToAddOrRemove = event.path[1].cells[2].textContent;
    favoriteCryptoList.find(x => x.name === cryptoToAddOrRemove) ? removeCryptoFromFavorites(event) : addCryptoToFavorites(event);
}

function addCryptoToFavorites(event) {
    let addCrypto = true;
    let cryptoName = event.path[1].cells[2].textContent;
    changeRowColorInTables(cryptoName, addCrypto);
    let cryptoToAdd = cryptoData.find(x => x.name === cryptoName);
    let cryptoToAddWithHistoricalData = getMaxMinValueHistorical([cryptoToAdd])
    favoriteCryptoList.push(...cryptoToAddWithHistoricalData);
    console.log(favoriteCryptoList)

}

function removeCryptoFromFavorites(event) {
    let addCrypto = false;
    let cryptoToRemove = event.path[1].cells[2].textContent;
    changeRowColorInTables(cryptoToRemove, addCrypto);
    let index = favoriteCryptoList.findIndex(x => x.name === cryptoToRemove);
    index > -1 && favoriteCryptoList.splice(index, 1);
    console.log(favoriteCryptoList)
}

function changeRowColorInTables(crypto, addCrypto) {
    tableList.forEach(table => {
        let tableRows = Array.from(table.rows);
        if (tableRows.length < 2) {
            return;
        }
        let rowToChange = tableRows.find(x => x.cells[2].textContent === crypto);
        if (rowToChange) {
            if (addCrypto) {
                rowToChange.style.backgroundColor = "lightgreen";
            } else {
                rowToChange.style.backgroundColor = "";
            }
        }
    });
}


function changefavoriteCounterValue() {
    favoriteCounter[0].textContent = favoriteCryptoList.length;
}

function showFavoritesInNewWindow() {
    if (favoriteCryptoList.length === 0) {
        alert("Add some crypto to favorites");
        throw new Error;
    }
    favoriteListFiltered = [];
    let tableForModal = createModal();
    createAndDeleteTable(tableForModal, favoriteCryptoList);
    addListenersToModal(tableForModal);
}

function createModal() {
    let modalBackdrop = document.createElement("div");
    modalBackdrop.setAttribute("class", "modalBackdrop");
    modalBackdrop.setAttribute("id", "modal");
    let modalCard = document.createElement("div");
    modalCard.setAttribute("class", "modalCard");
    let modalHeader = document.createElement("div");
    modalHeader.setAttribute("class", "modalHeader");
    let modalCloseButton = document.createElement("span");
    modalCloseButton.setAttribute("id", "closeModal");
    let closeText = document.createTextNode("Close");
    modalCloseButton.appendChild(closeText);
    let headerText = document.createTextNode("Favorites list");
    modalHeader.appendChild(headerText);
    let modalHr = document.createElement("hr");
    modalHr.setAttribute("id", "modal-hr");
    let modalContainer = document.createElement("div");
    modalContainer.setAttribute("class", "modal-container");
    let modalTable = document.createElement("table");
    modalTable.setAttribute("id", "modalTable");
    modalContainer.appendChild(modalTable);
    modalHeader.appendChild(modalCloseButton);
    modalCard.appendChild(modalHeader);
    modalCard.appendChild(modalHr);
    modalCard.appendChild(modalContainer);
    modalBackdrop.appendChild(modalCard);
    createModalButtons(modalHeader);
    document.getElementsByTagName("section")[0].appendChild(modalBackdrop);
    modalBackdrop.addEventListener("click", () => {
        document.getElementById("modal").remove();
        removeModalTable()
    });
    modalCard.addEventListener("click", (event) => event.stopPropagation());
    modalCloseButton.addEventListener("click", () => {
        document.getElementById("modal").remove();
        removeModalTable()
    });
    addTableToList(modalTable);

    return modalTable;
}

function createModalButtons(node) {
    let buttonContainer = document.createElement("div");
    buttonContainer.setAttribute("class", "button-container");
    let modalFiltersButton = document.createElement("input");
    let wrapperFiltersButton = document.createElement("div");
    wrapperFiltersButton.setAttribute("class", "wrapper-modal-filters-buttons");
    modalFiltersButton.setAttribute("id", "modal-filters-button");
    modalFiltersButton.setAttribute("type", "image");
    modalFiltersButton.setAttribute("src", "Data/filterModal.png");
    wrapperFiltersButton.appendChild(modalFiltersButton)
    let applyFiltersFromMainTableButton = document.createElement("input");
    let wrapperApplyFiltersButton = document.createElement("div");
    wrapperApplyFiltersButton.setAttribute("class", "wrapper-modal-filters-buttons");
    applyFiltersFromMainTableButton.setAttribute("id", "copy-main-table-filters-button");
    applyFiltersFromMainTableButton.setAttribute("type", "image");
    applyFiltersFromMainTableButton.setAttribute("src", "Data/copyFilterModal.png");
    wrapperApplyFiltersButton.appendChild(applyFiltersFromMainTableButton);
    addInformationTextToButton(wrapperApplyFiltersButton, "applyFiltersFromMainTable", "Copy filters from main table");
    let applyNewFiltersInModalButton = document.createElement("input");
    let wrapperApplyNewFilters = document.createElement("div");
    wrapperApplyNewFilters.setAttribute("class", "wrapper-modal-filters-buttons");
    applyNewFiltersInModalButton.setAttribute("id", "modal-add-filters");
    applyNewFiltersInModalButton.setAttribute("type", "image");
    applyNewFiltersInModalButton.setAttribute("src", "Data/changeFiltersModal.png");
    wrapperApplyNewFilters.appendChild(applyNewFiltersInModalButton);
    addInformationTextToButton(wrapperApplyNewFilters, "applyNewFilters", "Add or change filters");
    let removeAllFiltersModalButton = document.createElement("input");
    let wrapperRemoveAllFilters = document.createElement("div");
    wrapperRemoveAllFilters.setAttribute("class", "wrapper-modal-filters-buttons");
    removeAllFiltersModalButton.setAttribute("id", "modal-delete-filters");
    removeAllFiltersModalButton.setAttribute("type", "image");
    removeAllFiltersModalButton.setAttribute("src", "Data/removeFilterModal.png");
    wrapperRemoveAllFilters.appendChild(removeAllFiltersModalButton);
    addInformationTextToButton(wrapperRemoveAllFilters, "removeAllFilters", "Remove all filters");
    buttonContainer.appendChild(wrapperFiltersButton);
    buttonContainer.appendChild(wrapperApplyFiltersButton);
    buttonContainer.appendChild(wrapperApplyNewFilters);
    buttonContainer.appendChild(wrapperRemoveAllFilters);
    node.appendChild(buttonContainer);
}

function addInformationTextToButton(wrapper, inputName, text){
    let textInput = {[inputName]: null};
    textInput[inputName] = document.createElement("input");
    textInput[inputName].setAttribute("type", "text");
    textInput[inputName].setAttribute("readonly", "true");
    textInput[inputName].setAttribute("value", text);
    textInput[inputName].setAttribute("id", `${inputName}-text`);

    wrapper.appendChild(textInput[inputName]);
    
}

function addListenersToModal(table) {
    let copyMainTableFilterButton = document.getElementById("copy-main-table-filters-button");
    copyMainTableFilterButton.addEventListener("click", () => { onCalculatePressed(favoriteCryptoList, table) });
    let removeFiltersModal = document.getElementById("modal-delete-filters");
    removeFiltersModal.addEventListener("click", () => { createAndDeleteTable(table, favoriteCryptoList) });
    let modalTableHeadButtonContainer = document.querySelector(".button-container");
    let modalContainer = document.querySelector(".modal-container");
    modalTableHeadButtonContainer.addEventListener("mouseover", () => modalContainer.style.opacity = "0.3");
    modalTableHeadButtonContainer.addEventListener("mouseleave", () => modalContainer.style.opacity = "1");
    let modalAddFilters = document.querySelector("#modal-add-filters");
    modalAddFilters.addEventListener("click", addFiltersToModal)
}

function addFiltersToModal() {
    if (document.querySelector(".modal-filter-container")) {
        throw new Error("There is already one modal filter container")
    }
    let modalBackdrop = document.querySelector(".modalBackdrop")
    let containerForModalFilters = document.createElement("div");
    containerForModalFilters.setAttribute("class", "modal-filter-container");
    let modalFiltersButtonAndCheckboxContainer = document.createElement("div");
    modalFiltersButtonAndCheckboxContainer.setAttribute("class", "modal-filter-button-and-checkbox-container");
    let modalInputsContainer = document.createElement("div");
    modalInputsContainer.setAttribute("class", "modal-inputs-container");
    let modalCalculateButton = document.createElement("button");
    modalCalculateButton.setAttribute("type", "button");
    modalCalculateButton.setAttribute("id", "modal-calculate-button");
    let calculateTextNode = document.createTextNode("Calculate");
    modalCalculateButton.appendChild(calculateTextNode);
    modalInputsContainer.appendChild(modalCalculateButton)
    containerForModalFilters.appendChild(modalFiltersButtonAndCheckboxContainer);
    containerForModalFilters.appendChild(modalInputsContainer);
    modalBackdrop.appendChild(containerForModalFilters);
    containerForModalFilters.addEventListener("click", (event) => event.stopPropagation());
    addButtonsToFilterContainer(modalFiltersButtonAndCheckboxContainer);
    addInputsToFilterContainer(modalInputsContainer);
    addEventListenersToModalFilterContainer()
}

function addButtonsToFilterContainer(container) {
    createFilterButton(container, "modalDateFilter", "Data/modalDateFilter.png", "Search by date");
    createFilterButton(container, "modalBestFilter", "Data/modalBestFilter.png", "Search for best performing cryptocurrencies");
    createFilterButton(container, "modalWorstFilter", "Data/modalWorstFilter.png", "Search for worst performing cryptocurrencies");
    createFilterButton(container, "modalDolarFilter", "Data/modalDolarFilter.png", "Crypto worth dolars on average");
    createFilterButton(container, "modalCentFilter", "Data/modalCentFilter.png", "Crypto worth cents on average");
    createFilterButton(container, "modalTokenFilter", "Data/modalTokenFilter.png", "Dont show token cryptocurrencies");
}

function createFilterButton(container, filterName, imgSrc, text) {
    let checkbox = { [filterName]: null }
    let wrapper = document.createElement("div");
    wrapper.setAttribute("class", "modal-button-filters");
    let label = document.createElement("label");
    label.setAttribute("for", filterName);
    label.setAttribute("id", `label${filterName}`);
    let image = document.createElement('img');
    image.setAttribute("src", `${imgSrc}`);
    image.setAttribute("class", "modal-filter-image");
    let informationInput = document.createElement("input");
    informationInput.setAttribute("class", `modal-button-information-input ${filterName}-width`);
    informationInput.setAttribute("type", "text");
    informationInput.setAttribute("readonly", "true");
    informationInput.value = text;
    label.appendChild(image);
    checkbox[filterName] = document.createElement("input");
    checkbox[filterName].setAttribute("id", `${filterName}`);
    checkbox[filterName].setAttribute("type", "checkbox");
    label.appendChild(informationInput);
    wrapper.appendChild(checkbox[filterName]);
    wrapper.appendChild(label);
    container.appendChild(wrapper);
}

function addInputsToFilterContainer(container) {
    createInputs(container, "modalStartDateFilter", "date", "Start search date")
    createInputs(container, "modalEndDateFilter", "date", "End search date")
    createInputs(container, "modalBestPerformingCryptoGrowMore", "number", "Show crypto that grown more then x percent", "Crypto grown more");
    createInputs(container, "modalBestPerformingCryptoGrowLess", "number", "Show crypto that grown less then x percent", "Crypto grow less");
    createInputs(container, "modalWorstPerformingCryptoShrinkMore", "number", "Show crypto that shrink more then x percent", "Crypto shrink more");
    createInputs(container, "modalWorstPerformingCryptoShrinkLess", "number", "Show crypto that shrink less then x percent", "Crypto shrink less");
}

function createInputs(container, inputName, inputType, text, placeholder) {
    let input = { [inputName]: null };
    let wrapper = document.createElement("div");
    wrapper.setAttribute("class", "modal-filter-inputs-wrapper");
    let textInput = document.createElement("input");
    textInput.setAttribute("type", "text");
    textInput.setAttribute("class", `modal-filter-text-input ${inputName}-text-input`);
    textInput.setAttribute("readonly", "true");
    textInput.value = text;
    input[inputName] = document.createElement("input");
    input[inputName].setAttribute("id", `${inputName}`);
    input[inputName].setAttribute("type", `${inputType}`);
    input[inputName].setAttribute("placeholder", placeholder);
    wrapper.appendChild(input[inputName]);
    wrapper.appendChild(textInput);
    container.appendChild(wrapper);
}

function addEventListenersToModalFilterContainer() {
    const modalDateFilterCheckbox = document.getElementById("modalDateFilter");
    const modalBestFilterCheckbox = document.getElementById("modalBestFilter");
    const modalWorstFilterCheckbox = document.getElementById("modalWorstFilter");
    const modalDolarFilter = document.getElementById("modalDolarFilter");
    const modalCentFilter = document.getElementById("modalCentFilter");
    const modalBestPerformingCryptoGrowMoreInput = document.getElementById("modalBestPerformingCryptoGrowMore");
    const modalBestPerformingCryptoGrowLessInput = document.getElementById("modalBestPerformingCryptoGrowLess");
    const modalWorstPerformingCryptoShrinkMoreInput = document.getElementById("modalWorstPerformingCryptoShrinkMore");
    const modalWorstPerformingCryptoShrinkLessInput = document.getElementById("modalWorstPerformingCryptoShrinkLess");
    const modalCalculate = document.getElementById("modal-calculate-button");
    const modalStartDateFilter = document.getElementById("modalStartDateFilter");
    const modalEndDateFilter = document.getElementById("modalEndDateFilter");


    modalDateFilterCheckbox.addEventListener("click", showHideFilters);
    modalBestFilterCheckbox.addEventListener("click", showHideFilters);
    modalWorstFilterCheckbox.addEventListener("click", showHideFilters);
    modalDolarFilter.addEventListener("change", () => disableCryptoWorthCentsCheckBox(modalDolarFilter, modalCentFilter));
    modalCentFilter.addEventListener("change", () => disableCryptoWorthDolarsCheckBox(modalDolarFilter, modalCentFilter));
    modalBestFilterCheckbox.addEventListener("change", () =>
        hideWorstPerformingFilter(modalBestFilterCheckbox, modalWorstFilterCheckbox, modalWorstPerformingCryptoShrinkMoreInput, modalWorstPerformingCryptoShrinkLessInput));
    modalWorstFilterCheckbox.addEventListener("change", () =>
        hideBestPerformingFilter(modalBestFilterCheckbox, modalWorstFilterCheckbox, modalBestPerformingCryptoGrowMoreInput, modalBestPerformingCryptoGrowLessInput));
    modalWorstPerformingCryptoShrinkLessInput.addEventListener("change", () =>
        disableEnableShrinkMoreThenInput(modalWorstPerformingCryptoShrinkMoreInput, modalWorstPerformingCryptoShrinkLessInput));
    modalWorstPerformingCryptoShrinkMoreInput.addEventListener("change", () =>
        disableEnableShrinkLessThenInput(modalWorstPerformingCryptoShrinkMoreInput, modalWorstPerformingCryptoShrinkLessInput));
    modalBestPerformingCryptoGrowLessInput.addEventListener("change", () =>
        disableEnableGrowMoreThenInput(modalBestPerformingCryptoGrowMoreInput, modalBestPerformingCryptoGrowLessInput));
    modalBestPerformingCryptoGrowMoreInput.addEventListener("change", () =>
        disableEnableGrowLessThenInput(modalBestPerformingCryptoGrowMoreInput, modalBestPerformingCryptoGrowLessInput));
    modalBestFilterCheckbox.addEventListener("change", showHideFilters);
    modalWorstFilterCheckbox.addEventListener("change", showHideFilters);
    modalCalculate.addEventListener("click", () => onCalculatePressed(favoriteCryptoList, document.getElementById("modalTable"), true));

    modalStartDateFilter.addEventListener("change", getStartEndDateInUnix);
    modalEndDateFilter.addEventListener("change", getStartEndDateInUnix);

    showHideFilters()

}

function removeModalTable() {
    let index = tableList.findIndex(x => x.id === "modalTable");
    tableList.splice(index, 1)
}


function addTableToList(table) {
    if (tableList.find(x => x.id === table.id)) {
        let index = tableList.findIndex(x => x.id === table.id);
        tableList.splice(index, 1)
    }
    tableList.push(table);
}

function askUserForConfirmationAppliedFilters(cryptoWorthCentsFiltered) {
    if (cryptoWorthCentsFiltered.length !== favoriteCryptoList.length) {
        let cryptoHiddenInFavoritesUseingFilters = favoriteCryptoList.filter(x => !cryptoWorthCentsFiltered.some(y => y.name === x.name));
        let listOfHiddenCryptoNames = cryptoHiddenInFavoritesUseingFilters.map(x => x = x.name).join(",\n");
        let confirmApplyingFilters = confirm(`Applying this filters will hide some crypto from your favorites list: \n${listOfHiddenCryptoNames}`);
        if (!confirmApplyingFilters) {
            throw new Error("Calculation aborted by user")
        }
    }
}


function showBiggestWinnersAndLoosers(timer) {
    let winnersAndLoosers = getBiggestWinnerLooserFromLastDay();
    winnersAndLoosers.counter = 0;
    setInterval(() => { showWinnersAndLoosers(winnersAndLoosers) }, timer)

}

function getBiggestWinnerLooserFromLastDay() {
    let cryptoWith24hPercentChange = cryptoData.map(crypto => {
        let daysCount = crypto.dailyStats.length;
        let yesterday = crypto.dailyStats[daysCount - 1];
        let beforeYesterday = crypto.dailyStats[daysCount - 2];
        try {
            let priceChange24h = ((parseFloat(yesterday.price) - parseFloat(beforeYesterday.price)) / parseFloat(beforeYesterday.price)) * 100;
            let cryptoWithLast24hPriceChange = { id: crypto.name, priceChange24h: priceChange24h };
            return cryptoWithLast24hPriceChange;

        } catch (error) {
            console.log(error + crypto.id);
        }
    })
    let biggestLoosers = cryptoWith24hPercentChange.sort((a, b) => a.priceChange24h - b.priceChange24h).splice(0, 5);
    let biggestWinners = cryptoWith24hPercentChange.sort((a, b) => b.priceChange24h - a.priceChange24h).splice(0, 5);
    let lastDayWinnerLooser = { biggestWinner: biggestWinners, biggestLoosers: biggestLoosers };
    for (let key in lastDayWinnerLooser) {
        lastDayWinnerLooser[key].forEach(x => x.priceChange24h = `${x.priceChange24h.toFixed(2)}%`);
    }
    console.log(lastDayWinnerLooser);

    return lastDayWinnerLooser;
}

function showWinnersAndLoosers(winnersAndLoosers) {
    if (winnersAndLoosers.counter > 9) {
        winnersAndLoosers.counter = 0;
    }
    if (winnersAndLoosers.counter > 4) {
        bestWorstCryptoIn24HInput.value = `${winnersAndLoosers.biggestLoosers[winnersAndLoosers.counter - 5].id}: ${winnersAndLoosers.biggestLoosers[winnersAndLoosers.counter - 5].priceChange24h}`;
        bestWorstCryptoIn24HInput.style.color = "red";
        winnersAndLoosers.counter++;
        bestWorstCryptoLabel.textContent = "LAST DAY TOP LOSERS:";
    } else {
        bestWorstCryptoIn24HInput.value = `${winnersAndLoosers.biggestWinner[winnersAndLoosers.counter].id}: ${winnersAndLoosers.biggestWinner[winnersAndLoosers.counter].priceChange24h}`;
        bestWorstCryptoIn24HInput.style.color = "green";
        winnersAndLoosers.counter++;
        bestWorstCryptoLabel.textContent = "LAST DAY TOP GAINERS:"
    }
}



async function onDownloadAllCryptoButton() {
    let cryptoList = await fetchCryptoCurrenciesList();
    let currenciesData = await fetchCyrptoCurrencies(cryptoList);
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
            let cryptoSymbol = cryptoList[i].symbol;
            let cryptoName = cryptoList[i].name;
            let inquiry = `https://api.coingecko.com/api/v3/coins/${cryptoID}/market_chart?vs_currency=USD&days=max&interval=daily`
            let dailyDataResponse = await fetch(inquiry);
            let dailyData = await dailyDataResponse.json();
            let ignore = ignoreDefaultCrypto(dailyData, 1622502000000);

            if (dailyData.error) {
                console.log(`${cryptoID} - ${cryptoName} data doesnt exists`);
                continue;

            } else if (ignore) {
                defaultedCryptocurrencies.push({ cryptoSymbol: cryptoSymbol, cryptoName: cryptoName });
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
            if (x[1] < 0 || x[1] === 0) {
                console.log(name, "-", "Cena:", x[1])
                return;
            }
            dailyStats.date = x[0];
            dailyStats.price = parseFloat(x[1]);
            dailyStats.volume = parseInt(data.total_volumes[i][1]);
            dailyStats.marketCap = data.market_caps[i][1];
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