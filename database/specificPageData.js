const _database = "releasedb";
var _collection = "";
const mongoClient = require('mongodb').MongoClient;


var fetchDataByKey = (app, page, docKey, start, end, metric) => {      
    _collection = app + "_" + page;
    
    return new Promise((resolve, reject) => {
                
        mongoClient.connect("mongodb://localhost:27017/", function(err, client) {
            if (err) throw err;
            var db = client.db(_database);

            db.collection(_collection).findOne({
                [`${docKey}`] : { $exists : true}
            }, (err, result) => {             
                client.close()                 
                if (err) 
                    reject(err);
                else {
                    var data = []; 
                    for(var i = start; i <= end; i++){
                        data.push(result[docKey].data[i]);
                    }
                    resolve(data);
                }

                         
            });


        });
        
        
        
    });
    
    
   
}



module.exports = {
    fetchDataByKey
}

