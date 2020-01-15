var http = require("http");
let fs = require("fs");
var xml2js = require("xml2js");

//create a server object:
http
  .createServer(async function(req, res) {
    let xml_data = fs.readFileSync(__dirname + "/../data.xml", "utf8");

    let results = {};

    var areas = undefined;
    var areasArray = [];
    var defaultForecastIndex = 3;

    // Without parser
    xml2js.parseStringPromise(xml_data).then(function (result) {

        //console.dir(result);

        areas = result.product.forecast[0].area;
        areasArray = convertToArray(areas);

        var locations = filterAreaType(areasArray, 'location');
        //console.dir(locations);
        //console.log('locations.length: ' + locations.length);

        locations.forEach(function (item, index) {
            //console.log('item.$.description: '+item.$.description);
            //console.log('item.forecast-period.text: '+item['forecast-period'][defaultForecastIndex].text[0]._);
            results[item.$.description] = item['forecast-period'][defaultForecastIndex].text[0]._;
        });

        //console.dir(results);

        res.write(JSON.stringify(results));
        res.end();

        console.log('Done');
    }).catch(function (err) {
        // Failed
        console.log('Error parsing xml');
    })

  })
  .listen(8080); //the server object listens on port 8080


function convertToArray(items) {
  var array = [];
  for (var i = 0; i < items.length; i++) {
    array.push(items[i]);
  }
  return array;
}

function filterAreaType(array, typeName) {
  return array.filter(a => a.$.type === typeName);
}

function filterForecastPeriod(array, indexNumber) {
  return array.filter(a => a.index === indexNumber);
}