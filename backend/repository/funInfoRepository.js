const FunInfo = require("../model/FunInfo");
const util = require("../util/utils");
const debug = util.log("repository:myInfoRepository");

/** 
 * find FunInfo object in the database
 */
const retrieve = () => FunInfo.find({}).lean();

/** 
 * find FunInfo objects in the database by type
 */
const findByType = type => FunInfo.find({ type: type }).lean();

/** 
 * delete FunInfo object by id
 * @param {import("mongoose").Types.ObjectId} id document _id
 * @return {Promise<boolean>}
 */
const deleteById = async id => {
    const res = await FunInfo.deleteOne({ _id: id });
    return res.ok === 1 && res.deletedCount === 1;
}

/** 
 * change object by _id and update its value
 * @param {Object} data object
 * @return {Promise<boolean>}
 */
const update = async data => {
    const res = await FunInfo.updateOne({ _id: data._id }, data)
        .catch(err => debug("update", err));
    return res.ok === 1 && res.nModified === 1;
}

/** 
 * save new object or update if database is not empty
 */
const save = data => new FunInfo(data).save();

/**
 * @param {number} num 
 */
const constraintType = num => util.constraint(0, 1, num);

module.exports = {
    constraintType,
    deleteById,
    findByType,
    retrieve,
    update,
    save,
};