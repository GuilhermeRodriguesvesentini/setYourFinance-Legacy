//------------- local storage -----------------//

const editables = document.querySelectorAll("[contenteditable]");

// save edits
    editables.forEach(el => {
        el.addEventListener("blur", () => {
        localStorage.setItem("dataStorage-" + el.id, el.innerHTML);
    })
});

    // once on load
    for (var key in localStorage) {
        if (key.includes("dataStorage-")) {
            const id = key.replace("dataStorage-","");
            document.querySelector("#" + id).innerHTML = localStorage.getItem(key);
        }
    }

const storage = document.querySelectorAll('.totalResult');

// save edits
    storage.forEach(el => {
        el.addEventListener("blur", () => {
        localStorage.setItem("resultStorage-" + el.id, el.innerHTML);
    })
});

// once on load
for (var key in localStorage) {
    if (key.includes("resultStorage-")) {
        const id = key.replace("resultStorage-","");
        document.querySelector("#" + id).innerHTML = localStorage.getItem(key);
    }
    document.onchange = storage;
}

//console.log(storage[1].outerText);
//------------- Calculations -----------------//