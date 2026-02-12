/**
 * Parcel API Service
 */
import { apiGet } from '../config';
import * as EP from '../endpoints';

/** Fetch parcel categories */
export async function fetchParcelCategories() {
    return apiGet(EP.PARCEL_CATEGORY_URI);
}
