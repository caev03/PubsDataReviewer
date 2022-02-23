var express = require("express");
var app = express();
const fs = require('fs');
var bodyParser = require('body-parser');

app.set("view engine", "ejs");
app.set("views", __dirname + '/views');

app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());

// router to next paper
app.get("/", function (request, response) {

    var publication = request.app.get("pub")
    if (!publication) {
        fs.readFile('./pending.json', (err, data) => {
            if (err) throw err;
            let pubs = JSON.parse(data);
            var keys = Object.keys(pubs)
            if (keys.length > 0) {
                publication = pubs[keys[0]];
                response.render("publication", { 'publication': publication });
            } else {
                request.app.set('pub', undefined)
                response.render("finished");
            }
        });
    } else {
        response.render("publication", { 'publication': publication });
    }

});

// router to save review
app.post("/savereview", function (request, response) {

    console.log(request.body)

    var pubID = request.body.pubID
    var result = request.body.result
    var comments = request.body.comments


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
        console.log(keys.length);
        if(keys.length==0){
            request.app.set('pub', undefined)
            response.render("finished");
        } else {
            request.app.set('pub', pubs[keys[0]])
            response.redirect("/");
        }
    });

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