import { getDatabase, ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"
import {app} from './appConfig'

const database = getDatabase(app)

const timeLogs = ref(database, 'timelog')

let timeList = document.getElementById('time-list');
const inputEl = document.getElementById('input-field');
const btnEl = document.getElementById("add-button");
const totalEl = document.getElementById('total-time');


btnEl.addEventListener('click', () => {
    let inputValue = inputEl.value;

    if(isNaN(inputValue)) {
        console.log('enter only numbers');
        alert('enter a valid input')
    }
    else {
        if(inputValue.length == 0 || inputValue == 0) {
            alert('Enter a non zero value')
        }
        else {
            push(timeLogs, inputValue);
            console.log(`${inputValue} added to database`);
        }
    }
    clearInputField();
})

onValue(timeLogs, function(snapshot) {
    if(snapshot.exists()) {
        let itemsArray = Object.entries(snapshot.val());

        clearTimeList();
        
        for(let i=0; i< itemsArray.length; i++) {
            let currentItem = itemsArray[i];
            appendToTimeList(currentItem)
        }
    } else {
        totalEl.textContent = 0
        timeList.innerHTML = `Add logs to display...`
    }
    let et = 0;
    
    if(snapshot.exists())
        Object.entries(snapshot.val()).forEach(item => et += parseFloat(item[1]))
    totalEl.textContent = et.toFixed(2);
})

function appendToTimeList(item) {
    let itemID = item[0]
    let itemValue = item[1]
    
    let newEl = document.createElement("li")
    
    let date = getTodayDate();
    
    newEl.textContent = `${itemValue} - ${date}`
    
    newEl.addEventListener("click", function() {
        let exactLocationOfItemInDB = ref(database, `timelog/${itemID}`)
        remove(exactLocationOfItemInDB)
    })
    
    timeList.append(newEl)
}

function clearTimeList() {
    timeList.innerHTML = '';
}

function clearInputField() {
    inputEl.value = '';
}

function getTodayDate() {
    let today = new Date();
    let dd = String(today.getDate()).padStart(2, '0');
    let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    let yyyy = today.getFullYear();

    today = mm + '/' + dd + '/' + yyyy;
    return today;
}