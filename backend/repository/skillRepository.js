const Skill = require("../model/Skill");

const findAll = () => Skill.find({}).lean();
const findById = id => Skill.findById(id).lean();
const findByCategory = category => Skill.find({ category }).lean();
const deleteById = _id => Skill.deleteOne({ _id });
const update = data => Skill.updateOne({ _id: data._id }, data);
const save = data => new Skill(data).save();

module.exports = {
    save,
    update,
    findAll,
    findById,
    deleteById,
    findByCategory
};