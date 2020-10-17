let api = 'https://2fqvxfgk62.execute-api.us-east-1.amazonaws.com/dev/country_data';

function getData() {
    if (window.sessionStorage.length === 0) {
        fetch(api).then(response => response.json()).then(function (data) {
            window.sessionStorage.setItem("america", JSON.stringify(data.body[0]));
            window.sessionStorage.setItem("asia", JSON.stringify(data.body[1]));
            window.sessionStorage.setItem("africa", JSON.stringify(data.body[2]));
            window.sessionStorage.setItem("europe", JSON.stringify(data.body[3]));
            window.sessionStorage.setItem("oceania", JSON.stringify(data.body[4]));
        })
    }
}
getData();