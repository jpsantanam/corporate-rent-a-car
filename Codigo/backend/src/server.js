const express = require('express');
const cors = require('cors');
const app = express();

const PORT = 3000;

const customersRouter = require('./routes/customers');
const companiesRouter = require('./routes/companies');
const usersRouter = require('./routes/users');
const maintenanceRouter = require('./routes/maintenances');
const vehiclesRouter = require('./routes/vehicles');
const partnersRouter = require('./routes/partners');
const representativesRouter = require('./routes/representatives');
const rentRouter = require('./routes/rents');
const contractRouter = require('./routes/contracts');
const finesRouter = require('./routes/fines');
const logsRouter = require('./routes/logs');
const createDefaultUsers = require('./seeds/defaultUserSeeds');
const createDefaultVehicles = require('./seeds/defaultVehiclesSeeds');
const createDefaultCompanies = require('./seeds/defaultCompanySeeds');
const createDefaultCustomers = require('./seeds/defaultCustomerSeeds');
const createDefaultMaintenances = require('./seeds/defaultMaintenanceSeeds');
const createDefaultRents = require('./seeds/defaultRentSeeds');
const createDefaultFines = require('./seeds/defaultFineSeeds');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/users', usersRouter);
app.use('/companies', companiesRouter);
app.use('/customers', customersRouter);
app.use('/maintenances', maintenanceRouter);
app.use('/vehicles', vehiclesRouter);
app.use('/partners', partnersRouter);
app.use('/representatives', representativesRouter);
app.use('/rents', rentRouter);
app.use('/contracts', contractRouter);
app.use('/fines', finesRouter);
app.use('/logs', logsRouter);


const syncDatabase = async () => {
    const database = require('./database/db');

    try {
        await database.sync();
        await createDefaultUsers();
        await createDefaultVehicles();
        await createDefaultCompanies();
        await createDefaultCustomers();
        await createDefaultMaintenances();
        await createDefaultRents();
        await createDefaultFines();

        console.log('Database successfully sync.');
    } catch (err) {
        console.log(err);
    }
}

function onStart() {
    syncDatabase();
    console.log(`Server running on port ${PORT}`);
}


app.listen(PORT, onStart);

module.exports = app;