const vehicle = require('../models/vehicle');

async function createDefaultVehicles() {
    const vehicleCount = await vehicle.count();
    if (vehicleCount === 0) {

        await vehicle.bulkCreate([
            {
                id: 1,
                plate: "DEF8012",
                fleet: "Delivery Fleet",
                year: 2022,
                model: "Hilux",
                brand: "Toyota",
                motorization: "2.8"
            },
            {
                id: 2,
                plate: "GHI1234",
                fleet: "Delivery Fleet",
                year: 2021,
                model: "Ranger",
                brand: "Ford",
                motorization: "1.3"
            },
            {
                id: 3,
                plate: "JKL5678",
                fleet: "Delivery Fleet",
                year: 2020,
                model: "Amarok",
                brand: "Volkswagen",
                motorization: "3.0"
            },
            {
                id: 4,
                plate: "MNO9101",
                fleet: "Delivery Fleet",
                year: 2023,
                model: "Frontier",
                brand: "Nissan",
                motorization: "1.6"
            }
        ]);

        console.log('Vehicles default criados com sucesso');

    } else {
        console.log('Vehicles default já existem');
    }
}

module.exports = createDefaultVehicles;