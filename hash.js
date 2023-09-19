const bcrypt = require('bcrypt');
const saltRounds = 10;
const plainText = 'passwords';
const hashedValue = '$2b$10$7IiQnKYGaRVxC9PEWyAFD.uok3S2GFADLW2fvok.QF0tpX7kF6f.u'

bcrypt.compare(plainText, hashedValue, function(err, res) {
    console.log(res);
});