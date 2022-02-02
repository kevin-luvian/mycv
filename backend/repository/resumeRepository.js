const Resume = require("../model/Resume");

const findAll = () => Resume.find({}).lean();
const findById = (id) => Resume.findById(id).lean();
const findByCategory = (category) => Resume.find({ category }).lean();
const deleteById = (_id) => Resume.deleteOne({ _id });
const update = (data) => Resume.updateOne({ _id: data._id }, data);
const save = (data) => new Resume(data).save();

module.exports = {
  save,
  update,
  findAll,
  findById,
  deleteById,
  findByCategory,
};
