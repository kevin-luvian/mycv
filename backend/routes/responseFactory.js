/**
 * wrap response status and payload
 * @param {Response<any, Record<string, any>, number>} res 
 * @param {string} status 
 * @param {string} message 
 * @param {any} data 
 */
const response = (res, status, message, data) =>
    res.status(status).json({ message: message, data: data });

const r200 = (res, message, object) => response(res, "200", message, object);
const r400 = (res, message, object) => response(res, "400", message, object);
const r401 = (res, message, object) => response(res, "401", message, object);
const r404 = (res, message, object) => response(res, "404", message, object);
const r500 = (res, message, object) => response(res, "500", message, object);

module.exports = { r200, r400, r401, r404, r500 };