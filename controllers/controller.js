const urlRepo = require("../database/urlRepository");

module.exports = {
    homepage(req, res) {
        res.render('home.ejs', {});
    }, 
    collectionController(req, res){
        
    },
    urlController(req, res){
        let data = {};
        data.metric = "performance";
        if(req.query.start == undefined || req.query.end == undefined)
            oneWeekAgo = calculateDefaultTimestamp()
        data.startDate = req.query.start != undefined ? parseInt(req.query.start) : oneWeekAgo;
        data.endDate = req.query.end != undefined ? parseInt(req.query.end) : Date.now();
        data.urlId = req.params.urlid;
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

}

function calculateDefaultTimestamp()
{
    var oneWeek = new Date();
    oneWeek.setDate(oneWeek.getDate() - 30);
    return oneWeek.getTime();
}