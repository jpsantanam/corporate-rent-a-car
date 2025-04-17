const maintenance = require('../models/maintenance');

async function createDefaultMaintenances() {
    const maintenanceCount = await maintenance.count();
    if (maintenanceCount === 0) {
        await maintenance.bulkCreate([
            {
                "mechanics": "Roberto Lima",
                "reviewDate": "2023-08-20",
                "nextReviewDate": "2024-02-20",
                "kilometers": 35000,
                "observation": "Revisão geral do sistema de ar-condicionado",
                "type": "preventiva",
                "situation": "finalizada",
                "vehicleId": 1
            },
            {
                "mechanics": "Ana Paula Santos",
                "reviewDate": "2023-09-15",
                "nextReviewDate": "2024-03-15",
                "kilometers": 42000,
                "observation": "Troca de óleo e verificação dos freios",
                "type": "preventiva",
                "situation": "finalizada",
                "vehicleId": 2
            },
            {
                "mechanics": "Carlos Eduardo",
                "reviewDate": "2023-10-05",
                "nextReviewDate": "2024-04-05",
                "kilometers": 47000,
                "observation": "Ajuste do alinhamento e balanceamento das rodas",
                "type": "preventiva",
                "situation": "finalizada",
                "vehicleId": 3
            }
        ]
        )

        console.log('Default maintenance created');
    } else {
        console.log('Default maintenance already created');
    }
}

module.exports = createDefaultMaintenances;