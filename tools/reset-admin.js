#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// Usage: node tools/reset-admin.js [algo] [email] [password] [adminsPath]
// algo:
//   pbkdf2              -> pbkdf2:10000:64 (default iters/keylen)
//   pbkdf2:ITER:LEN     -> e.g. pbkdf2:20000:64
//   sha512              -> sha512(salt + password)
//   sha512:ps           -> sha512(password + salt)
const [,, algoArg='pbkdf2', email='admin@example.com', password='dev12345', adminsPath='apps/api/data/admins.json'] = process.argv;

function makeHash(algo, password) {
  const salt = crypto.randomBytes(16).toString('hex');
  let hash;

  if (algo === 'sha512' || algo === 'sha512:sp') {
    // salt + password
    hash = crypto.createHash('sha512').update(salt + password).digest('hex');
    return { salt, hash };
  }
  if (algo === 'sha512:ps') {
    // password + salt
    hash = crypto.createHash('sha512').update(password + salt).digest('hex');
    return { salt, hash };
  }
  // pbkdf2
  const m = /^pbkdf2(?::(\d+))?(?::(\d+))?$/.exec(algo) || [];
  const iters = m[1] ? parseInt(m[1], 10) : 10000;
  const keylen = m[2] ? parseInt(m[2], 10) : 64;
  hash = crypto.pbkdf2Sync(password, salt, iters, keylen, 'sha512').toString('hex');
  return { salt, hash };
}

const file = path.resolve(process.cwd(), adminsPath);
const admins = JSON.parse(fs.readFileSync(file, 'utf8'));

if (!Array.isArray(admins) || admins.length === 0) {
  admins.length = 0;
  admins.push({
    id: 1,
    email,
    full_name: 'Site Owner',
    role: 'owner',
    password_hash: 'placeholder',
    last_login_at: null,
  });
}

const { salt, hash } = makeHash(algoArg, password);
let i = admins.findIndex(u => u.role === 'owner');
if (i === -1) i = admins.findIndex(u => u.id === 1);
if (i === -1) i = 0;

admins[i].email = email;
admins[i].password_hash = `${salt}:${hash}`;

fs.writeFileSync(file, JSON.stringify(admins, null, 2));
console.log(`OK: set admin ${email} with ${algoArg}.`);
