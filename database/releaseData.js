const _database = "releasedb";
const _collection = "bw_releases";
const mongoClient = require('mongodb').MongoClient;
var startIndex, endIndex;


var fetchReleaseData = (startDate, endDate) => {
    return new Promise((resolve, reject) => {
        mongoClient.connect("mongodb://localhost:27017/", function (err, client) {
            if (err) throw err;
            var db = client.db(_database);
            db.collection(_collection).find().toArray((err, items) => {
                client.close()
                if (err) 
                    reject(err);
                else {
                    let data = [];
                    for (i = 0; i < items.length; i++)       
                        data.push(items[i].timestamp);
//                    console.log("inside promise "  + data + "" + data.length);
                    
                    startIndex = findLowerIndex(data, startDate);
                    endIndex = findUpperIndex(data, endDate);
                    
//                    console.log(startIndex, endIndex);
                    
                    resolve({
                        startIndex, endIndex
                    });
                }
            });
        });
    });
};

function findLowerIndex(stringArray, timestamp) {
    array = stringArray.map(Number);
    let start = 0
        , end = array.length - 1;
    
    // if timestamp is before first release or after last release
    if(timestamp < array[start] || timestamp > array[end])
        return start;
        
    while (start <= end) {        
        let mid = Math.floor((start + end) / 2);
        
        if (array[mid] == timestamp || (array[mid] < timestamp && array[mid + 1] > timestamp)) {
            return mid;
        }
        else if (array[mid] < timestamp) {
            start = mid + 1;
        }
        else {
            end = mid - 1;
        }        
    }
};

function findUpperIndex(stringArray, timestamp) {
    array = stringArray.map(Number);
    let start = 0
        , end = array.length - 1;
    
    if (timestamp < array[start] || timestamp > array[end])
        return end;
    
    while (start <= end) {
        let mid = Math.floor((start + end) / 2);
        
        if (array[mid] == timestamp || (array[mid - 1] < timestamp && array[mid] > timestamp)) {
            return mid;
        }
        else if (array[mid] < timestamp) {
            start = mid + 1;
        }
        else {
            end = mid - 1;
        }
    }
};




module.exports = {
    fetchReleaseData
}