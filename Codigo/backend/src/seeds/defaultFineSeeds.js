const fine = require('../models/fine');
const rent = require('../models/rent');

async function createDefaultFines() {
    const fineCount = await fine.count();
    if (fineCount === 0) {

        await fine.bulkCreate([
            {
              "value": 150.00,
              "status": true,
              "code": "A12345",
              "dateFine": "2023-12-15",
              "observation": "Excesso de velocidade",
              "location": "Avenida Paulista, São Paulo",
              "type": "Grave",
              "vehicleId": 2,
              "rentId": 4
            },
            {
              "value": 80.00,
              "status": false,
              "code": "B67890",
              "dateFine": "2023-11-05",
              "observation": "Estacionamento irregular",
              "location": "Rua Consolação, São Paulo",
              "type": "Media",
              "vehicleId": 3,
              "rentId": 3
            },
            {
              "value": 200.00,
              "status": true,
              "code": "C23456",
              "dateFine": "2023-09-05",
              "observation": "Avanço de sinal vermelho",
              "location": "Av. Faria Lima, São Paulo",
              "type": "Gravissima",
              "vehicleId": 2,
              "rentId": 1
            },
            {
              "value": 100.00,
              "status": false,
              "code": "D78901",
              "dateFine": "2023-10-10",
              "observation": "Falta de cinto de segurança",
              "location": "Marginal Tietê, São Paulo",
              "type": "Grave",
              "vehicleId": 3,
              "rentId": 2
            }
          ],
          { include: [rent] }
          )
          console.log('Default fines created');
    } else {
        console.log('Default fines already created');
    }
}

module.exports = createDefaultFines;