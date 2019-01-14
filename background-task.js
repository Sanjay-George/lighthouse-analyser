const lighthouse = require('lighthouse');
const chromeLauncher = require('chrome-launcher');
const fs = require('fs');
const readLine = require('readline');
const mongoClient = require('mongodb').MongoClient;
const lhOpts = {
    outputPath: '/'
, };
const EventEmitter = require('events');
class MyEmitter extends EventEmitter {}
const myEmitter = new MyEmitter();
var urls = [];
var index = 0;
var lastIndex;


function readUrls(){
    urls = fs.readFileSync('urls.txt').toString().split("\n");
    for(i in urls) {
        console.log("index : "  + i  + " vluae : " + urls[i]);
    }
}

myEmitter.on('lighthouse-finish', () => {
    if (index < lastIndex) fetchLighthouseData(urls[index].match(/m\/[a-z]+-bikes\/(.*)\//)[1], Date.now().toString(), "https://www.bikewale.com" + urls[index++])
});

function launchChromeAndRunLighthouse(url, opts) {
    return chromeLauncher.launch().then(chrome => {
        opts.port = chrome.port;
        return lighthouse(url, opts).then(results => chrome.kill().then(() => results.report));
    });
}

function fetchLighthouseData(docKey, timestamp, url) {
    launchChromeAndRunLighthouse(url, lhOpts).then(resultSet => {
        setReleaseData(JSON.parse(resultSet), docKey, timestamp, url);
        myEmitter.emit('lighthouse-finish');
    });
}

function setReleaseData(resultSet, docKey, timestamp, url) {
    var dataJson = {
        "timestamp": timestamp
        , "performance": {
            "score": resultSet.categories.performance.score
            , "submetrics": [
                {
                    "id": "first-contentful-paint"
                    , "value": resultSet.audits["first-contentful-paint"].displayValue
              }
                , {
                    "id": "speed-index"
                    , "value": resultSet.audits["speed-index"].displayValue
              }
                , {
                    "id": "interactive"
                    , "value": resultSet.audits["interactive"].displayValue
              }
                , {
                    "id": "first-cpu-idle"
                    , "value": resultSet.audits["first-cpu-idle"].displayValue
              }
            ]
        }
        , "seo": {
            "score": resultSet.categories.seo.score
        }
    }
    var modelJson = {};
    modelJson[docKey] = {
        "url": url
        , "data": [dataJson]
    };
    mongoClient.connect("mongodb://localhost:27017", (err, client) => {
        var db = client.db("releasedb");
        var findQuery = {};
        findQuery[docKey] = {
            $exists: true
            , $ne: null
        };
        var pushQuery = {};
        pushQuery[docKey + ".data"] = dataJson;
        db.collection("bw_models").updateOne(findQuery, {
            $push: pushQuery
        }, {
            upsert: 1
        }, (err, res) => {
            db.collection("bw_models").find().toArray((err, items) => console.log(JSON.stringify(items)));
            client.close();
        });
    })
}

function insertReleaseDate() {
    mongoClient.connect("mongodb://localhost:27017", (err, client) => {
        var db = client.db("releasedb");
        db.collection("bw_releases").insertOne({
            "timestamp": Date.now().toString()
        }, () => client.close())
    });
}

readUrls();
lastIndex = urls.length;

insertReleaseDate();
fetchLighthouseData(urls[index].match(/m\/[a-z]+-bikes\/(.*)\//)[1], Date.now().toString(), "https://www.bikewale.com" + urls[index++])