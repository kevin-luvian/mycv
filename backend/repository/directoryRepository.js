const mongoose = require("mongoose");
const Directory = require("../model/Directory");
const Visibility = require("../model/Visiblity");
const util = require("../util/utils");
const debug = util.log("repository:myInfoRepository");

/** 
 * find FunInfo object in the database
 */
const findRoots = () => Directory.find({ root: true }).lean();

/** 
 * find FunInfo objects in the database by type
 */
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

const updateOne = async dir => {
    const res = await Directory.updateOne({ _id: dir._id }, dir);
    return res.ok === 1 && res.nModified === 1;
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
    retrieve,
    purge,
    save,
    saveOne,
};

/**
 * @param {any} parentDir 
 * @returns {Promise<string>} id
 */
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
    if (util.stringToMongooseId(parentDir._id)) {
        updateOne(parentDir);
        return parentDir._id;
    } else {
        return await saveOne(parentDir);
    }
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