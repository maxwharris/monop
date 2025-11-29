const bcrypt = require('bcryptjs');

const passwords = ['password1', 'password2', 'password3', 'password4', 'password5'];

console.log('Generating password hashes for 5 players...\n');

passwords.forEach((pwd, idx) => {
  const hash = bcrypt.hashSync(pwd, 10);
  console.log(`Player ${idx + 1} (${pwd}):`);
  console.log(`  ${hash}\n`);
});

console.log('\nCopy these hashes into backend/schema.sql');
