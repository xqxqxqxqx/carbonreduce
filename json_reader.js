const fs = require('fs');

fs.readFile('./epa_carbon_footprint_calculator.json', 'utf8', (err, data) => {

    if (err) {
        console.log('Error reading file from disk: ${err}');
    } else {

        // parse JSON string to JSON object
        const j = JSON.parse(data);
        console.log(j)
    }

});