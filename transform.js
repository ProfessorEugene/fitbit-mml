const jsparser = require("js2xmlparser");
const fs = require('fs');

fs.readFile("sampl.json", "utf8", (err, data) => {
   if (err) {
     return console.log(err);
   }
   console.log(jsparser.parse("patient", JSON.parse(data)));
});

