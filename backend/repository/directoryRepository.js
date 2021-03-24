const mongoose = require("mongoose");
const Directory = require("../model/Directory");
const Visibility = require("../model/Visiblity");
const util = require("../util/utils");
const debug = util.log("repository:myInfoRepository");

const findAll = () => Directory.find({}).lean();

const findRoots = () => Directory.find({ root: true }).lean();

const findByType = type => Directory.find({ type }).lean();

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

const findFullById = async id => {
    const mID = util.stringToMongooseId(id);
    if (!mID) return null;
    const parentDir = await findOneById(mID);
    if (!parentDir) return null;
    const childrenDirs = [];
    if (parentDir.childrens && parentDir.childrens.length > 0) {
        for (let i = 0; i < parentDir.childrens.length; i++) {
            childrenDirs.push(await findFullById(parentDir.childrens[i]));
        }
    }
    // debug("findFullById", "child dirs", childrenDirs);
    parentDir.childrens = childrenDirs;
    return parentDir;
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

const deleteOne = async dir => {
    const res = await Directory.deleteOne({ _id: dir._id });
    return res.ok === 1 && res.deletedCount === 1;
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
    dir.type = Visibility.sanitizeTypeNum(dir.type);
    return new Promise((resolve, reject) =>
        new Directory(dir).save((err, dir) => {
            if (err) {
                debug("saveOne", err);
                resolve(null);
            } else resolve(dir._id);
        })
    );
}

/**
 * @param {any} parentDir 
 * @returns {Promise<string>} id
 */
const saveOrUpdateOne = async dir => {
    if (util.stringToMongooseId(dir._id)) {
        await updateOne(dir);
        return dir._id;
    }
    return await saveOne(dir);
}

const deleteRootByID = async rootID => {
    const rootDir = await findFullById(rootID);
    const dirIDs = spreadDirID(rootDir);
    return deleteManyByIds(dirIDs);
}

const update = async rootDir => {
    const prevDir = await findFullById(rootDir._id);
    deleteMissingDir(rootDir, prevDir);
    await saveOrUpdateChildrensRecursive(rootDir);
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
    deleteRootByID,
    findRoots,
    retrieve,
    findAll,
    purge,
    save,
    update,
    saveOne,
    findOneById,
    findFullById,
};

const deleteMissingDir = (rootDir, prevRootDir) => {
    const ids = spreadDirID(rootDir);
    const prevIds = spreadDirID(prevRootDir);
    const missingIds = prevIds.filter(id => !ids.includes(id));
    return deleteManyByIds(missingIds);
}

/**
 * @param {any} parentDir 
 * @returns {string[]}
 */
const spreadDirID = parentDir => spreadDir(parentDir).map(dir => dir._id + '');

/**
 * @param {any} parentDir 
 * @returns {any[]}
 */
const spreadDir = parentDir => {
    if (!parentDir) return [];
    const childrenIDs = [];
    let childrenDir = [];
    if (parentDir.childrens && parentDir.childrens.length > 0) {
        for (let i = 0; i < parentDir.childrens.length; i++) {
            childrenIDs.push(parentDir.childrens[i]._id);
            childrenDir = childrenDir.concat(spreadDir(parentDir.childrens[i]));
        }
    }
    return [{ ...parentDir, childrens: childrenIDs }].concat(childrenDir);
}

const saveOrUpdateChildrensRecursive = async parentDir => {
    const childrenIDs = [];
    if (parentDir.childrens && parentDir.childrens.length > 0) {
        for (let i = 0; i < parentDir.childrens.length; i++) {
            childrenIDs.push(await saveOrUpdateChildrensRecursive(parentDir.childrens[i]));
        }
    }

    parentDir.childrens = childrenIDs;
    delete parentDir.root;

    return await saveOrUpdateOne(parentDir);
}

const saveChildrensRecursive = async parentDir => {
    const childrenIDs = [];
    if (parentDir.childrens && parentDir.childrens.length > 0) {
        for (let i = 0; i < parentDir.childrens.length; i++) {
            childrenIDs.push(await saveChildrensRecursive(parentDir.childrens[i]));
        }
    }

    // modify dir to save
    parentDir.childrens = childrenIDs;
    delete parentDir.root;

    // return clause
    return await saveOne(parentDir);
}

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