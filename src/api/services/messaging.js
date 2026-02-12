/**
 * Messaging API Service — mirrors Flutter chat_repository.dart
 */
import { apiGet, apiPost, apiPostMultipart } from '../config';
import * as EP from '../endpoints';

/** Get conversation list */
export async function fetchConversations({ offset = 1, limit = 10 } = {}) {
    return apiGet(`${EP.CONVERSATION_LIST_URI}?offset=${offset}&limit=${limit}`);
}

/** Search conversations */
export async function searchConversations(query) {
    return apiGet(`${EP.SEARCH_CONVERSATION_URI}?name=${encodeURIComponent(query)}`);
}

/** Get message details for a conversation */
export async function fetchMessageDetails(conversationId, { offset = 1, limit = 20 } = {}) {
    return apiGet(`${EP.MESSAGE_DETAILS_URI}?conversation_id=${conversationId}&offset=${offset}&limit=${limit}`);
}

/** Send a text message */
export async function sendMessage(body) {
    return apiPost(EP.SEND_MESSAGE_URI, body);
}

/** Send message with image (multipart) */
export async function sendMessageWithImage(formData) {
    return apiPostMultipart(EP.SEND_MESSAGE_URI, formData);
}

/** Get messages */
export async function getMessages(conversationId) {
    return apiGet(`${EP.GET_MESSAGE_URI}?conversation_id=${conversationId}`);
}
