const User = require('../models/user');
const bcrypt = require('bcrypt');

async function createDefaultUsers() {
  const userCount = await User.count();
  if (userCount === 0) {
    const hashedAdminPassword = await bcrypt.hash('adminpassword', 10);
    const hashedOperatorPassword = await bcrypt.hash('operatorpassword', 10);

    await User.bulkCreate([
      {
        id: 1,
        name: 'admin',
        email: 'admin@example.com',
        password: hashedAdminPassword,
        role: 'admin'
      },
      {
        id: 2,
        name: 'operator',
        email: 'operator@example.com',
        password: hashedOperatorPassword,
        role: 'operator'
      }
    ]);

    console.log('Users default criados com sucesso');
  } else {
    console.log('Users default já existem');
  }
}

module.exports = createDefaultUsers;