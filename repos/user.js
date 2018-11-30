const BaseRepository = require('./base');
var mongoose = require('mongoose');
const userSchema = require('../models/user');

class UserRepository extends BaseRepository {
    constructor() {
        super();
        this.collection = mongoose.model('users', userSchema);
    }
}

module.exports = new UserRepository;