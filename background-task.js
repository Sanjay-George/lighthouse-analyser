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
    var performanceJson = {
        timestamp : timestamp,
        score : resultSet.categories.performance.score,
        data : {
            firstContentfulPaint : resultSet.audits["first-contentful-paint"].displayValue, 
            speedIndex :  resultSet.audits["speed-index"].displayValue,
            interactive : resultSet.audits["interactive"].displayValue,
            firstCpuIdle : resultSet.audits["first-cpu-idle"].displayValue
        }
    }
    
    mongoClient.connect("mongodb://localhost:27017", (err, client) => {
        var db = client.db("localdb");
            
        db.collection("bw_models").updateOne({
            maskingName : docKey, 
            url : url
        }, {
            $push : {
                "metrics.performance" : performanceJson,
                "metrics.seo" : null
            }
        }, {
            upsert : 1
        }, (err, items) => {
            client.close();
        });
            
//        findQuery = {
//            $exists: true
//            , $ne: null
//        };
//        var pushQuery = {};
//        pushQuery[docKey + ".data"] = dataJson;
//        db.collection("bw_models").updateOne(findQuery, {
//            $push: pushQuery
//        }, {
//            upsert: 1
//        }, (err, res) => {
//            db.collection("bw_models").find().toArray((err, items) => console.log(JSON.stringify(items)));
//            client.close();
//        });
        
        
    })
}

function insertReleaseDate() {
    mongoClient.connect("mongodb://localhost:27017", (err, client) => {
        var db = client.db("localdb");
        db.collection("bw_releases").insertOne({
            "timestamp": Date.now().toString()
        }, () => client.close())
    });
}

readUrls();
lastIndex = urls.length;

insertReleaseDate();
fetchLighthouseData(urls[index].match(/m\/[a-z]+-bikes\/(.*)\//)[1], Date.now().toString(), "https://www.bikewale.com" + urls[index++])