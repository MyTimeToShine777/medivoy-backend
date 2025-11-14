import jwt from 'jsonwebtoken';

const token = process.argv[2];
if (!token) {
    console.error('Usage: node decode-jwt.js <token>');
    process.exit(1);
}

try {
    const decoded = jwt.decode(token);
    console.log('JWT Payload:');
    console.log(JSON.stringify(decoded, null, 2));
} catch (error) {
    console.error('Error decoding token:', error.message);
}