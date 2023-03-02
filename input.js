class Covered {
    constructor(index, text) {
        this.id = `blocked-item-${index}`;
        this.node = document.createElement('div');
        this.node.id = `term-${index}`;
        this.node.classList.add('term');
        this.titleNode = (document.createElement('p'));
        this.titleNode.innerText = text;
        this.titleNode.classList.add('term-text');
        this.removeButton = document.createElement('button');
        this.removeButton.id = `remove-${index}`;
        this.removeButton.classList.add('remove')
        this.removeButton.innerText = 'X';
        this.removeButton.addEventListener('click', (event) => {
            // this.node.removeChild(document.getElementById(this.node.id));
            (document.getElementById(this.node.id)).style.display = 'none';
            const temp = localStorage.inputsVBSV.split('|||')
            temp.splice(temp.indexOf(this.titleNode.innerText), 1);
            localStorage.setItem('inputsVBSV', temp.join('|||'));
        });
        this.node.appendChild(this.removeButton);
        this.node.appendChild(this.titleNode);
        this.text = text;
        document.getElementById('blocked-domains-list').appendChild(this.node);
    }
}

function toVBSV(array) {
    return array.join('|||');
}

document.addEventListener('DOMContentLoaded', (event) => {
    const circle = document.getElementById("circle");
    const showing = document.getElementById('show-ass');
    const covered = document.getElementById('covered-ass');

    if (localStorage.isCoverUOn === "off" || localStorage.isCoverUOn === undefined) {
        circle.style.marginLeft = '-70px';
        circle.style.background = 'red';
        showing.removeAttribute('hidden');
        covered.setAttribute('hidden', 'true');
    }

    else if (localStorage.isCoverUOn === "on") {
        circle.style.marginLeft = '-40px'
        circle.style.background = 'green';
        covered.removeAttribute('hidden');
        showing.setAttribute('hidden', 'true');
    }



    const toggle = document.getElementById("circle")
    toggle.addEventListener('click', turnOnAndOff)


    const input = document.getElementById('input-text');
    const inputs = (localStorage.inputsVBSV) ? localStorage.inputsVBSV.split('|||') : [];
    for (let i = 0; i < inputs.length; i++) {
        new Covered(i, inputs[i]);
    }

    const submit = document.getElementById('form')
    submit.addEventListener('submit', (event) => {
        if (!inputs.includes(input.value)) {
            inputs.push(input.value);
            const listItem = new Covered(inputs.length, input.value);
            localStorage.setItem('inputsVBSV', toVBSV(inputs));
        }
    });

    const hideDiv = document.getElementById('hide-list');
    hideDiv.addEventListener('click', (event) => {

        const hide = document.getElementById("hide");
        const show = document.getElementById("show");
        const list = document.getElementById('blocked-domains-list')
        if (hide.getAttribute('hidden') === "true") {
            hide.removeAttribute('hidden')
            show.setAttribute('hidden', "true")
            // list.removeAttribute("hidden")
            list.style.display = "flex"
        }
        else if (show.getAttribute('hidden') === "true") {
            hide.setAttribute("hidden", "true")
            show.removeAttribute('hidden')
            // list.setAttribute("hidden", 'true')
            list.style.display = "none"
        }
    });

});

const getTermsFromStorage = function () {
    const terms = (localStorage.inputsVBSV) ? localStorage.inputsVBSV.split('|||') : [];
    console.log(terms);
    return terms;
}

function turnOnAndOff() {
    const circle = document.getElementById("circle");
    const showing = document.getElementById('show-ass');
    const covered = document.getElementById('covered-ass');
    if (localStorage.isCoverUOn === "off" || !localStorage.isCoverUOn) {
        localStorage.setItem("isCoverUOn", "on");
        console.log(localStorage.isCoverUOn);
        circle.style.marginLeft = '-40px'
        circle.style.background = 'green';
        covered.removeAttribute('hidden');
        showing.setAttribute('hidden', 'true');
        saveAndDeleteHistory();
    }
    else if (localStorage.isCoverUOn === "on") {
        localStorage.setItem("isCoverUOn", "off");
        console.log(localStorage.isCoverUOn);
        circle.style.marginLeft = '-70px'
        circle.style.background = 'red';
        covered.setAttribute('hidden', 'true');
        showing.removeAttribute('hidden');
        addBackHistory();
    }
}

const saveAndDeleteHistory = function () {
    const terms = getTermsFromStorage();
    for (const term of terms) {
        const termArray = [];
        chrome.history.search({ text: term, maxResults: 10000 }, function (data) {
            data.forEach(function (page) {
                console.log("found in history", page.url, page.id);
                termArray.push(page.url)
                console.log("deleting from history", page.url)
                chrome.history.deleteUrl({ url: page.url })
                localStorage.setItem(page.id, page.url)
            });
            localStorage.setItem(term, termArray.join('|||'));
            // buildPopupDom(divName, Object.values(urlObj));

        });
        console.log("after deletion from history...local storage", localStorage)
    }
}

function addBackHistory() {
    for (const id in localStorage) {
        if (!isNaN(id)) {
            console.log("adding back", localStorage[id])
            chrome.history.addUrl({ url: localStorage[id] })
            localStorage.removeItem(id)
        }
    }
}


