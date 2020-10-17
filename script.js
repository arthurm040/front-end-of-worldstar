let input, data, dataString,button;

document.addEventListener("DOMContentLoaded",() => {
    fillPage();
    input = document.querySelector('#search');
    input.addEventListener("keyup",search);
    dataString = Array.from(document.getElementsByClassName("box"))
    button = document.getElementById("start");
    button.addEventListener("click", startGame)
})

function fillPage() {
    if (document.body.id === "America")
        fillAmerica();
    else {
        if (document.body.id === "Asia")
            filLAsia();
        else {
            if (document.body.id === "Africa")
                fillAfrica();
            else
            {
                if (document.body.id === "Europe")
                    fillEurope();
                else
                    fillOceania()
            }
        }
    }
}

function fillAmerica() {
    if (window.sessionStorage.length === 0)
        window.location.replace("index.html");
    else
        retrieveData("america");
}

function filLAsia() {
    if (window.sessionStorage.length === 0)
        window.location.replace("index.html");
    else
        retrieveData("asia");
}

function fillAfrica() {
    if (window.sessionStorage.length === 0)
       window.location.replace("index.html");
    else
        retrieveData("africa");
}

function fillEurope() {
    if (window.sessionStorage.length === 0)
        window.location.replace("index.html");
    else
        retrieveData("europe");
}

function fillOceania() {
    if (window.sessionStorage.length === 0)
        window.location.replace("index.html");
    else
        retrieveData("oceania");
}

function retrieveData(continent) {
    data = JSON.parse(window.sessionStorage.getItem(continent));
    let fullBody = document.querySelector(".content");
    let pageData = divBuilder(data);
    fullBody.appendChild(pageData);

    let body = document.querySelector("body")
    let footer = document.createElement("footer");
    body.appendChild(footer);

    let anchor = document.createElement("a")
    anchor.href = "about.html";
    anchor.innerText = "About me";
    footer.appendChild(anchor);
}

function divBuilder(data) {
    let div = document.createElement("div");
    div.classList.add("content");
    let countries = Object.keys(data).length;
    let name,src;
    let row = Object.values(data[0]).length;
    let titles = ["Capital","Population","Continent","Independence","TimeZone","Languages",]

    for (let i = 0; i < countries; i++)
    {
        let div2 = document.createElement("div");
        div2.classList.add("box");
        div2.id = "div" + i;
        div.appendChild(div2);
        name = Object.values(data[i])[1];
        let img = document.createElement("img");
        src = "Flag/" + urlify(name) + ".png";
        img.className = "picture";
        img.src = src;
        img.width = 200;
        img.height = 120;
        div2.appendChild(img);
        let h2 = document.createElement("h2");
        div2.appendChild(h2);
        h2.innerText = name;
        let list = document.createElement("ul");
        div2.appendChild(list);
        let t = 0;
        for (let j = 2; j <row; j++)
        {
            let li = document.createElement("li");
            if (j === 5)
                li.innerText =titles[t] + ": " + Object.values(data[i])[j].toString().substr(0,10);
            else
                if (j === 3)
                    li.innerText =titles[t] + ": " + Object.values(data[i])[j].toLocaleString();
                else
                    li.innerText =titles[t] + ": " + Object.values(data[i])[j].toString();
            t++;
            list.appendChild(li);
        }
    }
    return div;
}

function urlify(s) {
    let result = "";
    for (let i = 0; i < s.length; i++) {
        if (s[i] === " ")
            result += "%20";
        else
            result += s[i];
    }
    return result;
}

function search(event) {
    let searched = event.target.value.toLowerCase();
    for (let i = 0; i < document.getElementsByClassName("box").length; i++)
    {
        if (!(dataString[i].textContent.toLowerCase()).includes(searched))
          document.getElementById("div" + i).style.display = "none";
        else
            document.getElementById("div" + i).style.display = "inline";
    }
}

let quizCounter = 1,score  = 0;
let functions = [independenceQ,populationQ,capitalQ,languageQ,flagQ];
let functionLength = functions.length;

async function startGame() {
    button.style.display = "none";
    let aside = document.querySelector("aside");
    document.querySelector(".content").style.width = "0";
    aside.style.width = "100%";
    aside.style.float = "none";
    document.querySelector(".content").style.visibility = "hidden";
    input.removeEventListener("keyup",search);

    displayQuestions(functions[Math.floor(Math.random() * functionLength)]());
}

let quizDisplay;
let questionCount;
let qMap = new Map();

function displayQuestions(data) {
    let num;
    let key;
    if (quizCounter === 1) {
        quizDisplay = document.createElement("div");
        let aside = document.querySelector("aside");
        quizDisplay.className = "question";
        aside.appendChild(quizDisplay);
    }

    let p = document.createElement("p");
    quizDisplay.append(p);

    if (data.country.substr(0, 4) === "Flag") {
        questionCount = document.createElement("p");
        questionCount.innerText = "Score " + score + " Question " + quizCounter;
        questionCount.style.float = "right";
        questionCount.style.fontSize = "0.5";
        quizDisplay.appendChild(questionCount);
        p.innerText = "Which country's flag is this?";
        let img = document.createElement("img");
        img.src = data.country;
        quizDisplay.appendChild(img);
        key = data.country;
    } else {
        questionCount = document.createElement("p");
        questionCount.id = "counter";
        questionCount.innerText = "Score " + score + " Question " + quizCounter;
        quizDisplay.appendChild(questionCount);
        p.innerText = data.country.toString();
        key = p.innerText;
    }


    for (let i = 0; i < data.options.length; i++) {
        num = i.toString();
        let answer = document.createElement("div");
        quizDisplay.append(answer);
        let radio = document.createElement("input");
        radio.id = num;
        radio.type = "radio";
        radio.name = "question";
        radio.value = data.options[i][0];
        radio.dataset.correct = data.options[i][1];
        answer.appendChild(radio);
        let label = document.createElement("label");
        label.htmlFor = num;
        label.id = "l" + num;
        label.innerText = data.options[i][0];
        answer.appendChild(label);
        document.getElementById(num).addEventListener("click", rightWrong);
    }

    let countdown = document.createElement("p");
    countdown.id = "countdown";
    let second  = 15;
    countdown.innerText = "Timer " + second +" Seconds";
    quizDisplay.appendChild(countdown)

    let timer = setInterval(update, 1000);

    function update(){
        second--;
        countdown.innerText ="Timer 0:" + second.toString();
        if (second === 0)
        {
            clearInterval(timer);
            for (let j = 0; j <data.options.length; j++){
                if (data.options[j][1] === true) {
                    num = j.toString();
                    break;
                }
            }

            if (quizCounter === 10)
            {
                let right = document.getElementById("l" + num);
                right.style.fontSize = "2em";
                right.style.backgroundColor = "#36e33f";
                qMap.set(key, [right.innerText, false]);
                finalQuestion();
            }
            else {
                let right = document.getElementById("l" + num);
                right.style.fontSize = "2em";
                right.style.backgroundColor = "#36e33f";
                qMap.set(key, [right.innerText, false]);
                nextQuestion();
            }
        }
    }

    function rightWrong(event) {
        clearInterval(timer);
        let questionBox = document.querySelector(".question");
        let num;
        for (let i = 0; i < data.options.length; i++)
            document.getElementById(i.toString()).removeEventListener("click", rightWrong);

        if (event.target.dataset.correct === "true")
        {
            score++;
            if (quizCounter !== 10) {
                questionBox.style.backgroundColor = "#36e33f";
                qMap.set(key, [event.target.value.toString(),true]);
                nextQuestion();
            }
            else {
                questionBox.style.backgroundColor = "#36e33f";
                qMap.set(key, [event.target.value.toString(),true]);
                finalQuestion();
            }
        }
        else
        {
            for (let j = 0; j <data.options.length; j++){
                if (data.options[j][1] === true) {
                    num = j.toString();
                    break;
                }
            }

            if (quizCounter === 10) {
                questionCount.innerText = "Good Job " + score + " out of " + quizCounter;
                questionBox.style.backgroundColor = "#e82525";
                let right = document.getElementById("l" + num);
                right.style.fontSize = "2em";
                right.style.backgroundColor = "#36e33f";
                qMap.set(key, [right.innerText,false]);
                finalQuestion();
            }
            else
            {
                questionBox.style.backgroundColor = "#e82525";
                let right = document.getElementById("l" + num);
                right.style.fontSize = "2em";
                qMap.set(key, [right.innerText, false]);
                right.style.backgroundColor = "#36e33f";
                nextQuestion();
            }
        }
    }
}

function nextQuestion(){
    quizCounter++;
        setTimeout(function () {
            quizDisplay.innerHTML = "";
            document.querySelector(".question").style.backgroundColor = "lightgoldenrodyellow";
            displayQuestions(functions[Math.floor(Math.random() * functionLength)]());
        }, 2000);
}
let qResults, button2;
function finalQuestion(){
    console.log(qMap);
    let aside = document.querySelector("aside");
    aside.removeChild(quizDisplay);
    qResults = document.createElement("div");
    qResults.className = "results";
    aside.appendChild(qResults);

    let text;

    if (score < 5)
        text = score + " out of " + quizCounter + " Let's review your question and ace this! Here are the right answers";
    else {
        if (score >= 5 && score <= 8)
            text =score + " out of " + quizCounter + " Good Job! Here are the right answers";
        else
            text = score + " out of " + quizCounter + " That was ELITE!";
    }

    let intro = document.createElement("p");
    intro.innerText = text;
    qResults.appendChild(intro);

    for (let [key,value] of qMap)
    {
        let temp = document.createElement("div");
        if (key.substr(0,4) === "Flag")
        {
            let p = document.createElement("p");
            p.innerText = "Which country's flag is this?";
            temp.appendChild(p);
            let img = document.createElement("img");
            img.src = key;
            temp.appendChild(img);
        }
        else
        {
            let p = document.createElement("p");
            p.innerText = key;
            temp.appendChild(p);
        }

        let p2 = document.createElement("p")
        p2.innerText = value[0];
        if (value[1] === true)
            temp.style.backgroundColor = "#36e33f";
        else
            temp.style.backgroundColor = "#e82525";

        temp.appendChild(p2);
        qResults.appendChild(temp);
    }

    button2 = document.createElement("button");
    button2.innerText = "Reset";
    button2.id = "button2";
    aside.appendChild(button2);
    button2.addEventListener("click", reset);
}

function reset(){
    qMap.clear();
    quizCounter = 1;
    score = 0;
    button.style.display = "inline";
    let aside = document.querySelector("aside");
    document.querySelector(".content").style.width = "100%";
    aside.style.width = "0";
    quizDisplay.style.border = "none";
    aside.removeChild(qResults);
    aside.removeChild(button2);
    document.querySelector(".content").style.visibility = "visible";
    input.addEventListener("keyup",search);
}

function independenceQ() {
    let question = createQuestion(5);
    question.options = shuffle(question.options);
    let temp = question.country;
    question.country = "When did " + temp + " become independent?";
    return question;
}

function populationQ() {
    let question = createQuestion(3);
    question.options = shuffle(question.options);
    let temp = question.country;
    question.country = "What is the population of " + temp + "?";
    return question;
}

function languageQ() {
    let q = createQuestion(7);
    q.options = shuffle(noDuplicate(q.options));
    let temp = q.country;
    q.country = "What is(are) the official language(s) of " + temp + "?";
    return q;
}

function capitalQ() {
    let question = createQuestion(2);
    question.options = shuffle(question.options);
    let temp = question.country;
    question.country = "What is the capital of " + temp + "?";
    return question
}

function createQuestion(item) {
    let pick = Math.floor(Math.random() * data.length)
    let limit = Object.keys(data[0]).length;
    let falseValues = randomNumber(limit);
    let question;

    if (item === 5){
        question = {
            country: Object.values(data[pick])[1],
            options:
               [
                   [Object.values(data[pick])[item].substr(0,10),true],
                   [Object.values(data[falseValues[0]])[item].substr(0,10),false],
                   [Object.values(data[falseValues[1]])[item].substr(0,10),false],
                   [Object.values(data[falseValues[2]])[item].substr(0,10), false]
               ]
        }
    }
    else {
        if (item === 3)
        {
            question = {
                country: Object.values(data[pick])[1],
                options: [
                    [Object.values(data[pick])[item].toLocaleString(), true],
                    [Object.values(data[falseValues[0]])[item].toLocaleString(), false],
                    [Object.values(data[falseValues[1]])[item].toLocaleString(), false],
                    [Object.values(data[falseValues[2]])[item].toLocaleString(), false]
                ]
            }
        }
        else {
            question = {
                country: Object.values(data[pick])[1],
                options: [
                    [Object.values(data[pick])[item], true],
                    [Object.values(data[falseValues[0]])[item], false],
                    [Object.values(data[falseValues[1]])[item], false],
                    [Object.values(data[falseValues[2]])[item], false]
                ]
            }
        }
    }
    return question;
}

function flagQ(){
    let pick = Math.floor(Math.random() * data.length)
    let falseValues = randomNumber(data.length);
    let question;

    question = {
        country: "Flag/" + Object.values(data[pick])[1] + ".png",
        options:
            [
                [Object.values(data[pick])[1],true],
                [Object.values(data[falseValues[0]])[1],false],
                [Object.values(data[falseValues[1]])[1],false],
                [Object.values(data[falseValues[2]])[1],false]
            ]
    }

    question.options = shuffle(noDuplicate(question.options));
    return question;
}

function noDuplicate(q){
    let value = [], temp = [];
    value [0] = q[0][0].toString().trim();
    temp [0] = q[0];
    let j = 1;

    for (let i = 1; i < q.length; i++)
    {
        if (!value.includes(q[i][0].toString().trim()))
        {
            temp[j] = q[i];
            value[j] = q[i][0].toString().trim()
            j++;
        }
    }
    return temp;
}

function shuffle(array){ //Fisher–Yates shuffle
    let n = array.length - 1;
    let r, temp;
    while (n > 0)
    {
        r = Math.floor(Math.random() * (n+ 1));
        temp = array[n];
        array[n] = array[r];
        array[r] = temp;
        n--;
    }
    return array;
}

function randomNumber(limit) {
    let result = [];
    let i = 0; let value;
    while(i < 3) {
        value = Math.floor(Math.random() * limit);
        if (!result.includes(value)) {
            result[i] = value;
            i++;
        }
    }
    return result;
}