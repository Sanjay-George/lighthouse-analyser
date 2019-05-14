const _database = "local";
var _collection = "lh_urls";
//const mongoClient = require('mongodb').MongoClient;
const mysql = require('mysql');

const config = {
    host : "localhost",
    user : "root",
    password : "admin123",
    database : "lighthouse"
}; //  import from another file

var con = mysql.createConnection(config);

class PerformanceSchema{
    constructor(url, timestamp, score, firstContentfulPaint, speedIndex, interactive, firstCpuIdle)
    {
        this.url = url;
        this.timestamp = timestamp;
        this.score = score;
        this.firstContentfulPaint = firstContentfulPaint;
        this.speedIndex = speedIndex;
        this.interactive = interactive;
        this.firstCpuIdle = firstCpuIdle;
    }
}

var fetchDataByKey = (url, startTimestamp, endTimestamp) => {      
    
    let sql = "call lighthouse.fetchperformancedata(?)";
    let params = [url];
    
    return new Promise((resolve, reject) => {
        con.query(sql, params, function(err, result){
           if(err)
               reject(err);
            console.log("Performance data fetched : " + result);
            let performancePoint = new PerformanceSchema(url, )
            resolve(result);
        });
    });
    
    
    
    
    
//    _collection = app + "_" + page;
    
//    return new Promise((resolve, reject) => {
//                
//        mongoClient.connect("mongodb://localhost:27017/", function(err, client) {
//            if (err) throw err;
//            var db = client.db(_database);
//            
//            
//            db.collection(_collection).aggregate([
//                {
//                    $project : {
//                        maskingName : "$maskingName",
//                        metricAverage : {
//                            $avg : "$metrics.performance.score"
//                        },
//                        metrics : 1  
//                    }
//                }
//            ])
//
////            db.collection(_collection).findOne({
////                [`${docKey}`] : { $exists : true}
////            }, (err, result) => {             
////                client.close()                 
////                if (err) 
////                    reject(err);
////                else {
////                    var data = []; 
////                    for(var i = startTimestamp; i <= endTimestamp; i++){
////                        data.push(result[docKey].data[i]);
////                    }
////                    resolve(data);
////                }
////
////                         
////            });
//            
//            
//
//
//        });
//        
//        
//        
//    });
    
    
   
}



module.exports = {
    fetchDataByKey
}

