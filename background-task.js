const lighthouse = require('lighthouse');
const chromeLauncher = require('chrome-launcher');
const fs = require('fs');
const readLine = require('readline');
const mysql = require('mysql');

const con = mysql.createConnection({
    host : "localhost",
    user : "root",
    password : "admin123",
    database : "lighthouse"
});

//const mongoClient = require('mongodb').MongoClient;
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
        console.log("index : "  + i  + " vluae : " + urls[i]); // TODO : remove later
    }
}

// take full urls (not specific to bikewale)
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
    
    con.connect(function(err){
        if(err)
            throw err;
    })
//    mongoClient.connect("mongodb://localhost:27017", (err, client) => {
//        var db = client.db("local");
//            
//        db.collection("lh_urls").updateOne({
//            maskingName : docKey, 
//            url : url
//        }, {
//            $push : {
//                "metrics.performance" : performanceJson,
//                "metrics.seo" : null
//            }
//        }, {
//            upsert : 1
//        }, (err, items) => {
//            client.close();
//        });
            
        
        
    })
}

function insertReleaseDate() {
    mongoClient.connect("mongodb://localhost:27017", (err, client) => {
        var db = client.db("local");
        db.collection("lh_releases").insertOne({
            "timestamp": Date.now().toString()
        }, () => client.close())
    });
}

readUrls();
lastIndex = urls.length;

insertReleaseDate();
fetchLighthouseData(urls[index].match(/m\/[a-z]+-bikes\/(.*)\//)[1], Date.now().toString(), "https://www.bikewale.com" + urls[index++])