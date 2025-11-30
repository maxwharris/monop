const bcrypt = require('bcryptjs');

const users = [
  { username: 'max', password: 'max' },
  { username: 'jack', password: 'jack' },
  { username: 'youngeun', password: 'youngeun' },
  { username: 'seabass', password: 'seabass' },
  { username: 'jason', password: 'jason' },
  { username: 'raymond', password: 'raymond' }
];

console.log('Generating password hashes for 6 players...\n');

users.forEach((user, idx) => {
  const hash = bcrypt.hashSync(user.password, 10);
  console.log(`${user.username} (password: ${user.password}):`);
  console.log(`  ${hash}\n`);
});

console.log('\nCopy these hashes into backend/schema.sql');
