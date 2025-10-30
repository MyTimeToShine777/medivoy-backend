const mongoose = require('mongoose');
const AuditLog = require('./AuditLog');
const Analytics = require('./Analytics');
const Session = require('./Session');

module.exports = {
  AuditLog,
  Analytics,
  Session,
  mongoose,
};
