Hacktivate repository

Problem statement - Post release analytics tool


Functionalities provided - Lighthouse performance metrics for important pages across Carwale and Bikewale for Releases of past 2 quarters

Backend - Node.js, Express.js - (as we wanted to utilize Node's lighthouse module)
MongoDb - (wanted to avoid large number of tables and cache maintainence that would be associated with MySql, so wanted to explore NoSql alternatives)

Used node module for lighthouse to fetch data for current release across different urls - https://github.com/GoogleChrome/lighthouse/blob/master/docs/readme.md#using-programmatically

Followed Document based DB structure

Data for an individual url is stored as a json object, having an array containing metrics datapoints for different releases

Structure of document -
"key": { 
  {
    "data": [
    {
      "timestamp": timestamp,
        "performance": {
          "score": score,
          "submetrics": [
            {
              "id": "first-contentful-paint",
              "value": displayValue
            },
            {
              "id": "speed-index",
              "value": displayValue
            },
            {
              "id": "interactive",
              "value": displayValue
            },
            {
              "id": "first-cpu-idle",
              "value": displayValue
            }
          ]
        },
        "seo": {
          "score": score
        }
      }
    ]
}

Scalability scope - Can be scaled across Carwale using current schema, for different pages the key format needs to be changed while rest of the schema structure can remain same
