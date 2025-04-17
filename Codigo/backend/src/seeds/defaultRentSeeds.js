const rents = require('../models/rent');

async function createDefaultRents() {
    const rentCount = await rents.count();
    if (rentCount === 0) {
        await rents.bulkCreate([
            {
              "startDate": "2023-09-01",
              "endDate": "2023-09-10",
              "coverage": "Total",
              "value": 1200.00,
              "status": false,
              "vehicleId": 1,
              "customerId": 1,
              "companyId": null
            },
            {
              "startDate": "2023-10-05",
              "endDate": "2023-10-15",
              "coverage": "Parcial",
              "value": 800.00,
              "status": true,
              "vehicleId": 4,
              "customerId": null,
              "companyId": 3
            },
            {
              "startDate": "2023-11-01",
              "endDate": "2023-11-10",
              "coverage": "Total",
              "value": 1500.00,
              "status": false,
              "vehicleId": 3,
              "customerId": 3,
              "companyId": null
            },
            {
              "startDate": "2023-12-10",
              "endDate": "2023-12-20",
              "coverage": "Parcial",
              "value": 950.00,
              "status": true,
              "vehicleId": 2,
              "customerId": 1,
              "companyId": null
            }
          ]
          
        )

        console.log('Default rent created');
    } else {
        console.log('Default rent already created');
    }
}

module.exports = createDefaultRents;