const mongoose = require("mongoose");
const Resume = require("../model/Resume");
const util = require("../util/utils");
const debug = util.log("repository:resumeRepository");

const findAll = () => Resume.find({}).lean();
const findById = id => Resume.findById(id).lean();
const findByCategory = category => Resume.find({ category }).lean();
const deleteById = _id => Resume.deleteOne({ _id });
const update = data => Resume.updateOne({ _id: data._id }, data);
const save = data => new Resume(data).save();
// const save = data => {
//     delete data._id;
//     return new Promise((resolve, reject) =>
//         new Resume(data).save((err, res) => {
//             if (err) {
//                 debug("save", err);
//                 resolve(null);
//             } else resolve(res._id);
//         })
//     );
// }

module.exports = {
    save,
    update,
    findAll,
    findById,
    deleteById,
    findByCategory
};