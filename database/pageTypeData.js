const _database = "releasedb";
const _collection = "bw_models";
const mongoClient = require('mongodb').MongoClient;


var fetchModelByKey = (app, page, docKey, start, end, metric) => {  

    if(app == 'bikewale' && page == 'model' && metric == 'performance'){     

        mongoClient.connect("mongodb://localhost:27017/", function(err, client) {
            if (err) throw err;
            var db = client.db(_database);

            db.collection(_collection).find({
                [`${docKey}`] : { $exists : true}
            }, function(err, result) {
              if (err) throw err;

              for(var i = start; i <= end; i++){
                console.log(result[docKey].data[i]);    
              }              
            });

            client.close();

        });
    }   
}



module.exports = {
    fetchModelByName
}

