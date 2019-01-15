const _database = "releasedb";
var _collection = "";
const mongoClient = require('mongodb').MongoClient;


var fetchDataByKey = (app, page, docKey, startTimestamp, endTimestamp, metric) => {      
    _collection = app + "_" + page;
    
    return new Promise((resolve, reject) => {
                
        mongoClient.connect("mongodb://localhost:27017/", function(err, client) {
            if (err) throw err;
            var db = client.db(_database);
            
            
            db.collection(_collection).aggregate([
                {
                    $project : {
                        maskingName : "$maskingName",
                        metricAverage : {
                            $avg : "$metrics.performance.score"
                        },
                        metrics : 1  
                    }
                }
            ])

//            db.collection(_collection).findOne({
//                [`${docKey}`] : { $exists : true}
//            }, (err, result) => {             
//                client.close()                 
//                if (err) 
//                    reject(err);
//                else {
//                    var data = []; 
//                    for(var i = startTimestamp; i <= endTimestamp; i++){
//                        data.push(result[docKey].data[i]);
//                    }
//                    resolve(data);
//                }
//
//                         
//            });
            
            


        });
        
        
        
    });
    
    
   
}



module.exports = {
    fetchDataByKey
}

