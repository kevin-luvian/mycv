import $ from "jquery";
import Util from "../../util/utils";

const destroyTime = 5000;

export const NotificationType = {
    blank: 0,
    success: 1,
    warning: 2,
    danger: 3
}

/**
 * convert type to color
 * @param {number} type 
 * @returns {string} color
 */
function getColor(type) {
    switch (type) {
        case 1: return "#28a745";
        case 2: return "#ffc107";
        case 3: return "#dc3545";
        default: return "white";
    }
}

/**
 * create notification destroy timer
 * @param {string} elemID 
 */
function destroyCallback(elemID) {
    window.setTimeout(() => {
        $("#" + elemID).addClass("terminate");
        window.setTimeout(() => {
            $("#" + elemID).remove();
        }, 500);
    }, destroyTime);
}

/**
 * create elemen id
 * @param {string} id 
 * @param {string} m 
 * @param {string} c 
 * @returns {JQuery<HTMLElement>}
 */
function getElemString(id, m, c) {
    return $(`
            <div 
                id="${id}" 
                class="notificationBoxElement" 
                style="background-color: ${c}">
                <p>${m}</p>
            </div>
        `);
}

export const Notification = {
    type: NotificationType,
    /**
     * create new notification
     * @param {string} message 
     * @param {number} type 
     */
    create(message, type = NotificationType.blank) {
        const elemID = Util.badStringID();
        $("#notificationBox").append(getElemString(elemID, message, getColor(type)));
        destroyCallback(elemID);
    }
};

export default Notification;