const mongoose = require("mongoose");
const Directory = require("../model/Directory");
const access = require("../model/Access");
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

const retrieveRestrictedByRole = async role => {
    const dirs = [];
    (await retrieve()).forEach(dir => {
        const restrictedDir = restrictByRole(role, dir);
        if (restrictedDir) dirs.push(restrictedDir);
    });
    return dirs;
}

const purge = async () => {
    const res = await Directory.deleteMany({});
    return res.ok === 1;
}

const findOneById = id => Directory.findOne({ _id: id }).lean();

const findManyByIds = ids => Promise.all(util.cleanNull(ids).map(id => findOneById(id)));

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

const restrictByRole0 = (role, parentDir) => {
    const modFunc = dir => {
        if (access.visibilityAccess(role, parentDir.type))
            return dir;
        return null;
    }
    iterateDirModify()

    if (!parentDir || !access.visibilityAccess(role, parentDir.type))
        return null;

    const childrenDirs = [];
    if (parentDir.childrens && parentDir.childrens.length > 0) {
        for (let i = 0; i < parentDir.childrens.length; i++) {
            childrenDir = restrictByRole(role, parentDir.childrens[i]);
            if (childrenDir) childrenDirs.push(childrenDir);
        }
    }

    parentDir.childrens = childrenDirs;
    return parentDir;
}


const restrictByRole = (role, parentDir) => {
    const modFunc = dir => {
        if (access.visibilityAccess(role, dir.type))
            return dir;
        return null;
    }

    return iterateDirModify(parentDir, modFunc);
}

module.exports = {
    retrieveRestrictedByRole,
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
    restrictByRole,
    deleteDirectoryByID,
};

/**
 * 
 * @param {any} dir 
 * @param {(dir:any) => any} modFunc 
 * @returns {any}
 */
const iterateDirModify = (dir, modFunc) => {
    if (dir) dir = modFunc(dir);
    if (!dir) return null;

    const newChildrens = [];
    if (dir.childrens && dir.childrens.length > 0) {
        for (let i = 0; i < dir.childrens.length; i++) {
            const modifiedChild = modFunc(dir.childrens[i]);
            if (modifiedChild)
                newChildrens.push(modifiedChild);
        }
    }

    dir.childrens = newChildrens;
    return dir;
}

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
            const cID = parentDir.childrens[i]._id;
            if (cID) {
                childrenIDs.push(cID);
                childrenDir = childrenDir.concat(spreadDir(parentDir.childrens[i]));
            }
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