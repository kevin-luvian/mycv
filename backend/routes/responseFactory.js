/** 
 * wrap string to standardize response { message: m }
 * 
 * @param {string} m - message body
 * @return {Object} message as dictionary
 */
const message = m => { return { message: m }; }

/** 
 * wrap response status as 400
 * 
 * @param {Response<any, Record<string, any>, number>} res - response object
 * @param {string} m - message to return
 * @return {Response<any, Record<string, any>, number>} modified response
 */
const r400 = (res, m) => { return res.status("400").json(message(m)); }

/** 
 * wrap response status as 401
 * 
 * @param {Response<any, Record<string, any>, number>} res - response object
 * @param {string} m - message to return
 * @return {Response<any, Record<string, any>, number>} modified response
 */
const r401 = (res, m) => { return res.status("401").json(message(m)); }

/** 
 * wrap response status as 404, Not Found
 * 
 * @param {Response<any, Record<string, any>, number>} res - response object
 * @param {string} m - message to return
 * @return {Response<any, Record<string, any>, number>} modified response
 */
const r404 = (res, m) => { return res.status("404").json(message(m)); }

/** 
 * wrap response status as 200
 * 
 * @param {Response<any, Record<string, any>, number>} res - response object
 * @param {string} m - message to return
 * @param {Object} o - Object to return
 * @return {Response<any, Record<string, any>, number>} modified response
 */
const r200 = (res, m, o) => {
    return res.status("200").json({ message: m, data: o });
}

module.exports = {
    r200,
    r400,
    r401,
    r404,
    message
};