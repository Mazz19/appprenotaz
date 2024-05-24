const fs = require('fs-extra');
const bcrypt = require('bcrypt');

const saltRounds = 10;
const adminsFile = './data/admins.json';

const addAdmin = async () => {
  const admins = await fs.readJson(adminsFile, { throws: false }) || [];
  const hashedPassword = await bcrypt.hash('adminpassword', saltRounds);
  const admin = { id: admins.length + 1, username: 'admin', password: hashedPassword };
  admins.push(admin);
  await fs.writeJson(adminsFile, admins);
  console.log('Admin aggiunto');
};

addAdmin();
