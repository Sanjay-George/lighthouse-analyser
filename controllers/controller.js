//const releaseData = require("../database/releaseData");
const urlRepo = require("../database/urlRepository");

//const apps = {
//    bikewale : "bw",
//    carwale : "cw"
//}
//const pages = {
//    make: "makes"
//    , model: "models"
//    , pic: "priceincities"
//, }


module.exports = {
    homepage(req, res) {
        res.render('home.ejs', {});
    }, 
    collectionController(req, res){
        
    },
    urlController(req, res){
        let data = {};
        // TOOD : remove unnecessary params
//        data.maskingName = req.params.maskingName;
        data.metric = "performance";
        data.startDate = parseInt(req.query.start);
        data.endDate = parseInt(req.query.end);
        data.urlId = req.params.urlid;
//        data.app = apps.bikewale;
//        data.page = pages.model;
        data.metrics = [];
        data.graphPoints = [];
        
//        console.log("Controller - Input data : "  + JSON.stringify(data));
        
        urlRepo.fetchDataByKey(data.urlId, data.startDate, data.endDate)
            .then(result => {
//                console.log("Controller - result frm DB : " + JSON.stringify(result));
                data.metrics = result;
                
                result.forEach(row => {
                    let graphPoint = [row.timestamp , row.score];
                    data.graphPoints.push(graphPoint);
                })
                data.graphPoints = JSON.stringify(data.graphPoints);
            
                res.render("urlData.ejs", data)
            }); 
        
    }
//    bikewaleModels(req, res) {
//            var data = {};
//            data.metric = req.query.metric;
//            data.startDate = req.query.startDate;
//            data.endDate = req.query.endDate;
//            data.app = apps.bikewale;
//            data.page = pages.model;
//            res.render('bikewale.ejs', data);
//        }
//        , bikewaleModelByName(req, res) {
//            var data = {};
//            data.maskingName = req.params.maskingName;
//            data.metric = req.query.metric;
//            data.startDate = req.query.startDate;
//            data.endDate = req.query.endDate;
//            data.app = apps.bikewale;
//            data.page = pages.model;
//            data.metrics = {};
//            data.graphPoints = [];
//            
//            releaseData.fetchReleaseData(data.startDate, data.endDate).then(result => {
//                console.log("FROM DB  : " + JSON.stringify(result));
//                
//                specificPageData.fetchDataByKey(data.app, data.page, data.maskingName, result.startTimestamp, result.endTimestamp, data.metric).then(result => {
//                    // result is in array of objects format
//                    // TODD : CALC WEIGHTED AVERAGE FOR EACH METRIC AND SET IT TO METRICS (VIEW IN TABLE)
//                    data.metrics = result[0];                    
//                    
//                    for(var i = 0; i < result.length; i++){
//                        if(result[i] != null){
//                            var point = [];
//                            point.push(new Date(parseInt(result[i].timestamp)).getTime());
//                            point.push(result[i].performance.score);
//
//                            data.graphPoints.push(point);
//                        }
//                        
//                    }
//                    data.graphPoints = JSON.stringify(data.graphPoints);
//                    
//                    
//                    console.log(JSON.stringify(data));
//                    res.render('bikewale.ejs', data);
//
//                });
//                
//                
//            })
//        }
//        , carwale(req, res) {
//            res.render('carwale.ejs', {});
//        }
}