const controller = require('../controllers/controller');


module.exports = (app) => {
    
    app.get('/bikewale', controller.bikewaleModels);
    app.get('/bikewale/model', controller.bikewaleModels);
    app.get('/bikewale/model/:maskingName', controller.bikewaleModelByName);
    app.get('/carwale', controller.carwale);
    
    app.get('/', controller.homepage );

}