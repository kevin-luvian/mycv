const express = require('express');

/** 
 * wrap string to standardize response { message: m }
 * 
 * @param {string} m - message body
 * @return {Object} message as dictionary
 */
const message = m => { return { message: m }; }

/** 
 * wrap response status as 404
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
 * @param {Object} payload - payload Object to return
 * @return {Response<any, Record<string, any>, number>} modified response
 */
const r200 = (res, payload) => { return res.status("200").json(payload); }

module.exports = {
    r200,
    r404,
    message
};