const lighthouse = require('lighthouse');
const chromeLauncher = require('chrome-launcher');
const fs = require('fs');
const readLine = require('readline');
const mysql = require('mysql');

const config = {
    host : "localhost",
    user : "root",
    password : "admin123",
    database : "lighthouse"
}; //  import from another file

var con = mysql.createConnection(config);

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
var now = new Date()
var timestamp = `${now.getFullYear()}-${now.getMonth()}-${now.getDate()} ${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;

function readUrls(){
    urls = fs.readFileSync('urls.txt').toString().split("\n");
    for(i in urls) {
        console.log("index : "  + i  + " value : " + urls[i]); // TODO : remove later
    }
}

myEmitter.on('lighthouse-finish', () => {
    if (index < lastIndex) 
        fetchLighthouseData(urls[index++])
    else
        con.end();
});

function launchChromeAndRunLighthouse(url, opts) {
    return chromeLauncher.launch().then(chrome => {
        opts.port = chrome.port;
        return lighthouse(url, opts).then(results => chrome.kill().then(() => results.report));
    });
}

function fetchLighthouseData(url) {
    if(url != "" && typeof url != 'undefined'){
        launchChromeAndRunLighthouse(url, lhOpts).then(resultSet => {
            setReleaseData(JSON.parse(resultSet), url);
            myEmitter.emit('lighthouse-finish');
        });
    }
}

function setReleaseData(resultSet,  url) {
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
    console.log(`performanceJson : ${performanceJson} \ntimestamp : ${timestamp} \nUrl : ${url}`);
    

    let sql = "call lighthouse.insertdata(?,?,?,?,?,?,?)";  // insert urls, and lighthouse data for the urls
    let params = [url, timestamp, resultSet.categories.performance.score, resultSet.audits["first-contentful-paint"].displayValue, resultSet.audits["speed-index"].displayValue, resultSet.audits["interactive"].displayValue, resultSet.audits["first-cpu-idle"].displayValue]
    
    con.query(sql, params, function(err, result){   
       if(err)
           throw err;
        console.log(`Url inserted : ${url}`);
    });   
    
}



readUrls();
lastIndex = urls.length;

fetchLighthouseData(urls[index++])