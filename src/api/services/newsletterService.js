import { apiPost } from '../config';
import * as EP from '../endpoints';

/**
 * Subscribe to newsletter
 * @param {string} email
 * @returns {Promise<Object>}
 */
export async function subscribeNewsletter(email) {
    return apiPost(EP.NEWSLETTER_URI, { email });
}
