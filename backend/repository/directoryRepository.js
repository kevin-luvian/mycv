const mongoose = require("../bin/mongoose");
const Directory = require("../model/Directory");
const access = require("../model/Access");
const util = require("../util/utils");
const debug = util.log("repository:myInfoRepository");

const findAll = () => Directory.find({}).lean();

const findRoots = () => Directory.find({ root: true }).lean();

const retrieve = async () => {
    const dirs = await Directory.find({}).lean();
    const roots = getRoots(dirs);
    return roots.map(dir => fillChildrenRecursive(dir, dirs));
}

const purge = async () => {
    const res = await Directory.deleteMany({});
    return res.ok === 1;
}

const findOneById = id => Directory.findOne({ _id: id }).lean();

const findManyByIds = ids => Promise.all(util.cleanNull(ids).map(id => findOneById(id)));

const findFullById = async id => {
    const dir = await findOneById(id);
    if (dir !== null)
        dir.childrens = await Promise.all(dir.childrens.map(id => findFullById(id)));
    return dir;
}

/**
 * delete multiple directory documents using array of id
 * @param {string[]} arrIDs 
 * @returns {Promise<boolean>}
 */
const deleteManyByIds = async arrIDs => {
    const res = await Directory.deleteMany({ _id: { $in: arrIDs } });
    return res.ok === 1;
}

const updateOne = async dir => {
    const res = await Directory.updateOne({ _id: dir._id }, dir);
    return res.ok === 1;
}

/**
 * save one dir and return id or null
 * @param {any} dir 
 * @returns {Promise<number|null>}
 */
const saveOne = dir => {
    delete dir._id;
    dir.type = access.containsValue(access.visibilityType, dir.type);
    return new Promise((resolve, reject) =>
        new Directory(dir).save((err, dir) => {
            if (err) {
                debug("saveOne", err);
                resolve(null);
            } else resolve(dir._id);
        })
    );
}

const deleteDirectoryByID = async id => {
    const allID = await findChildrensID(id);
    await deleteManyByIds(allID);
}

const findChildrensID = async id => {
    try {
        const dir = await findOneById(id);
        const childrensID = [id];
        for (let i = 0; i < dir.childrens.length; i++) {
            childrensID.concat(findChildrensID(dir.childrens[i]));
        }
        return childrensID;
    } catch (err) {
        return [id];
    }
}

const save = async rootDir => {
    try {
        const rootID = await saveChildrensRecursive(rootDir);
        return await updateOne({ _id: rootID, root: true });
    } catch (err) {
        debug("Save", err);
        return false;
    }
}

module.exports = {
    findRoots,
    retrieve,
    findAll,
    purge,
    save,
    saveOne,
    updateOne,
    findOneById,
    findFullById,
    findManyByIds,
    deleteDirectoryByID,
};

/**
 * filter array with root: true
 * @param {any[]} arr 
 */
const getRoots = arr => arr.filter(dir => dir.root);

/**
 * find dir by id from array of directories
 * @param {string} id 
 * @param {mongoose.LeanDocument<mongoose.Document<any, {}>>[]} dirs
 */
const findDirByID = (id, dirs) => dirs.find(dir => dir._id.equals(id));

/**
 * recursively fill children directories
 * @param {any} parentDir 
 * @param {any[]} dirs
 */
const fillChildrenRecursive = (parentDir, dirs) => {
    if (!parentDir) return parentDir;
    const childrensDir = [];
    const childIDs = parentDir.childrens;
    childIDs.forEach((id, index) => {
        const childDir = findDirByID(id, dirs);
        childrensDir.push(fillChildrenRecursive(childDir, dirs));
    });
    parentDir.childrens = childrensDir;
    return parentDir;
}