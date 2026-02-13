import { apiPost } from '../config';
import * as EP from '../endpoints';

/**
 * Send a contact message
 * @param {Object} data - payload
 * @param {string} data.name
 * @param {string} data.email
 * @param {string} data.phone
 * @param {string} data.subject
 * @param {string} data.message
 * @returns {Promise<Object>}
 */
export async function sendMessage(data) {
    // Flutter implementation sends: name, email, mobile_number, subject, message
    const payload = {
        name: data.name,
        email: data.email,
        mobile_number: data.phone,
        subject: data.subject,
        message: data.message,
    };
    return apiPost(EP.SEND_MESSAGE_URI, payload);
}
