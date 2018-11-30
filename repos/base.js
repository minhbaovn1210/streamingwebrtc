var mongoose = require('mongoose');
require('dotenv').config();

class BaseRepository {
    constructor() {
        //this.client = mongoose.connect(process.env.DB_CONNECT_STRING, {  useNewUrlParser: true });
        this.collection = null;
    }
    insertOne(data) {
        try {
            const newDocument = new this.collection(data);
            newDocument.save();
            return true;
        } catch(ex) {
            return ex;
        }
    }
    insertMany(dataArray) {
        return this.collection.insertMany(dataArray);
    }
    updateOne(id, data) {
        return this.collection.updateOne({_id: id}, data);
    }
    replaceOne(id, data) {
        return this.collection.replaceOne({_id: id}, data);
    }
    deleteOne(id) {
        return this.collection.deleteOne({_id: id});
    }
    deleteMany(objectJSONCondition) {
        return this.collection.deleteMany(objectJSONCondition);
    }
    findOneById(id) {
        return this.collection.findById(id);
    }
    findMany(objectJSONCondition) {
        return this.collection.find(objectJSONCondition);
    }
}
module.exports = BaseRepository;