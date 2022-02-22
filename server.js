var express = require("express");
var app = express();
const fs = require('fs');

app.set("view engine", "ejs");
app.set("views", __dirname + '/views');

//router for the home page
app.get("/", function (request, response) {
    //this doesn't need anything to be rendered so it is provided simple html file
    response.sendFile(__dirname + '/views/index.html');
});

//router for listcountries path
app.get("/listcountries", function (request, response) {
    var title = "List of Countries";
    //instantiate the list of countries from hard coded array
    var hardCodedCountries = [{ "name": "America", "population": 300 }, { "name": "Britain", "population": 53 }, { "name": "Canada", "population": 35 }, { "name": "Democratic Congo", "population": 67 }, { "name": "Ethiopia", "population": 90 }, { "name": "Finland", "population": 5 }, { "name": "Gabon", "population": 2 }];
    response.render("countries", { 'countries': hardCodedCountries, 'title': title });
});

// router to next paper
app.get("/nextpaper", function (request, response) {

    // var publication = {"pubID": "12903878714897780433", "searchTerm": ["%28\"cardiovascular+disease*\"+OR+\"heart+disease*\"+OR+\"heart+failure*\"+OR+\"cardiac+disease*\"+OR+\"cardiac+condition*\"%29+AND+%28\"nudge*\"+AND+\"behavioral+economic*\"%29"], "link": "https://papers.ssrn.com/sol3/papers.cfm?abstract_id=1375616", "title": "When is a <b>Nudge a </b>Shove? The Case for Preference-Neutrality", "authors": "<a href='https://scholar.google.com/citations?user=JjAsJbYAAAAJ&amp;hl=pt-BR&amp;oe=ASCII&amp;oi=sra'>S Wu</a>&#xA0;- The Case for Preference-Neutrality (February 16, 2009)&#xA0;&#x2026;, 2009 - papers.ssrn.com", "articleContent": "&#x2026; &#x201C;Rationality within <b>behavioral</b> <b>economic</b> <b>and</b> psychological tests of rational choice theory  \nrequires only consistency among expressed preferences, with consistency defined by the &#x2026;", "citationsURL": "https://scholar.google.com/scholar?cites=12903878714897780433&as_sdt=2005&sciodt=0,5&hl=pt-BR&oe=ASCII", "citationsAmount": "Citado por 2", "relatedArticles": "https://scholar.google.com/scholar?q=related:0c400lLJE7MJ:scholar.google.com/&scioq=(%22cardiovascular+disease*%22+OR+%22heart+disease*%22+OR+%22heart+failure*%22+OR+%22cardiac+disease*%22+OR+%22cardiac+condition*%22)+AND+(%22nudge*%22+AND+%22behavioral+economic*%22)&hl=pt-BR&oe=ASCII&as_sdt=0,5&as_vis=1"};
    var publication = request.app.get("pub")
    if (!publication) {
        fs.readFile('./pending.json', (err, data) => {
            if (err) throw err;
            let pubs = JSON.parse(data);
            var keys = Object.keys(pubs)
            if (keys.length > 0) {
                publication = pubs[keys[0]];
                response.render("publication", { 'publication': publication });
            }
        });
    } else {
        response.render("publication", { 'publication': publication });
    }

});

// router to save review
app.get("/savereview", function (request, response) {

    var pubID = "15586813726971547729";
    var result = true
    var comments = "This is a test"

    var stream = fs.createWriteStream("log.csv", { flags: 'a' });
    stream.write(pubID+";"+ result + ";"+comments+"\n");
    stream.end();

    fs.readFile('pending.json', (err, data) => {
        if (err) throw err;
        let pubs = JSON.parse(data);
        var keys = Object.keys(pubs)
        delete pubs[keys[0]]
        fs.writeFileSync('pending.json', JSON.stringify(pubs));
        keys = Object.keys(pubs)
        request.app.set('pub', pubs[keys[0]])
        response.redirect("/nextpaper");
    });

});

//  router to generate new version of file
app.get("/summarize", function (request, response) {
    var title = "List of Countries";
    //instantiate the list of countries from hard coded array
    var hardCodedCountries = [{ "name": "America", "population": 300 }, { "name": "Britain", "population": 53 }, { "name": "Canada", "population": 35 }, { "name": "Democratic Congo", "population": 67 }, { "name": "Ethiopia", "population": 90 }, { "name": "Finland", "population": 5 }, { "name": "Gabon", "population": 2 }];
    response.render("countries", { 'countries': hardCodedCountries, 'title': title });
});

app.listen(8080);
console.log("Hit http://localhost:8080");

function getNextPub() {
    console.log("asd");
    return fs.readFileSync('pending.json', (err, data) => {
        if (err) throw err;
        console.log("hue");
        let pubs = JSON.parse(data);
        var keys = pubs.keys
        if (keys.length > 0) {
            return pubs[keys[0]];
        }
    });

}