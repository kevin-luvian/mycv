const Contact = require("../model/Contact");

const findAll = () => Contact.find({}).lean();
const findById = id => Contact.findById(id).lean();
const deleteById = _id => Contact.deleteOne({ _id });
const update = data => Contact.updateOne({ _id: data._id }, data);
const save = data => new Contact(data).save();

module.exports = {
    save,
    update,
    findAll,
    findById,
    deleteById
};