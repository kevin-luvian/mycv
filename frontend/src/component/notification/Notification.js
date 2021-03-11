import $ from "jquery";
import Util from "../../util/utils";

export const NotificationType = {
    blank: 0,
    success: 1,
    warning: 2,
    danger: 3
}

export const Notification = {
    type: NotificationType,
    show: function (message, type = NotificationType.blank) {
        this.create(type, message);
    },
    /**
     * convert type to color
     * @param {number} type 
     * @returns {string} color
     */
    getColor(type) {
        switch (type) {
            case 1: return "#28a745";
            case 2: return "#ffc107";
            case 3: return "#dc3545";
            default: return "white";
        }
    },
    /**
     * create elemen id
     * @param {string} id 
     * @param {string} m 
     * @param {string} c 
     * @returns {JQuery<HTMLElement>}
     */
    getElemString(id, m, c) {
        return $(`
                <div 
                    id="${id}" 
                    class="notificationBoxElement" 
                    style="background-color: ${c}">
                    <p>${m}</p>
                </div>
            `);
    },
    /**
     * create elemen id
     * @param {number} num 
     * @returns {string}
     */
    getElemID(num) { return "notificationelemid" + num; },
    /**
     * create new notification
     * @param {number} type 
     * @param {string} message 
     */
    create(type, message) {
        const elemID = this.getElemID(Util.simpleID());
        $("#notificationBox").append(this.getElemString(elemID, message, this.getColor(type)));
        this.destroyCallback(elemID);
    },
    /**
     * create notification destroy timer
     * @param {string} elemID 
     */
    destroyCallback(elemID) {
        window.setTimeout(() => {
            $("#" + elemID).addClass("terminate");
            window.setTimeout(() => {
                $("#" + elemID).remove();
            }, 500);
        }, 3000);
    }
};

export default Notification;