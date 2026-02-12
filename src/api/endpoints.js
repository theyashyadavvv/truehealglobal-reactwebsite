/**
 * All API Endpoints — mirrors Flutter AppConstants exactly.
 * Every constant matches the Flutter app's app_constants.dart.
 */

// ─── Config & System ─────────────────────────────────────────────────────
export const CONFIG_URI = '/api/v1/config';
export const MODULE_URI = '/api/v1/module';
export const ZONE_URI = '/api/v1/config/get-zone-id';
export const CHECK_ZONE_URI = '/api/v1/zone/check';
export const ZONE_LIST_URI = '/api/v1/zone/list';
export const LANDING_PAGE_URI = '/api/v1/flutter-landing-page';
export const GEOCODE_URI = '/api/v1/config/geocode-api';
export const SEARCH_LOCATION_URI = '/api/v1/config/place-api-autocomplete';
export const PLACE_DETAILS_URI = '/api/v1/config/place-api-details';
export const DISTANCE_MATRIX_URI = '/api/v1/config/distance-api';
export const DIRECTION_URI = '/api/v1/config/direction-api';

// ─── Auth ────────────────────────────────────────────────────────────────
export const LOGIN_URI = '/api/v1/auth/login';
export const REGISTER_URI = '/api/v1/auth/sign-up';
export const FORGOT_PASSWORD_URI = '/api/v1/auth/forgot-password';
export const VERIFY_TOKEN_URI = '/api/v1/auth/verify-token';
export const RESET_PASSWORD_URI = '/api/v1/auth/reset-password';
export const VERIFY_PHONE_URI = '/api/v1/auth/verify-phone';
export const CHECK_EMAIL_URI = '/api/v1/auth/check-email';
export const VERIFY_EMAIL_URI = '/api/v1/auth/verify-email';
export const SOCIAL_LOGIN_URI = '/api/v1/auth/social-login';
export const SOCIAL_REGISTER_URI = '/api/v1/auth/social-register';
export const GUEST_LOGIN_URI = '/api/v1/auth/guest/request';
export const PERSONAL_INFO_URI = '/api/v1/auth/update-info';
export const FIREBASE_AUTH_VERIFY = '/api/v1/auth/firebase-verify-token';
export const FIREBASE_RESET_PASSWORD = '/api/v1/auth/firebase-reset-password';

// ─── Customer / Profile ──────────────────────────────────────────────────
export const CUSTOMER_INFO_URI = '/api/v1/customer/info';
export const UPDATE_PROFILE_URI = '/api/v1/customer/update-profile';
export const TOKEN_URI = '/api/v1/customer/cm-firebase-token';
export const UPDATE_ZONE_URI = '/api/v1/customer/update-zone';
export const INTEREST_URI = '/api/v1/customer/update-interest';
export const SUGGESTED_ITEM_URI = '/api/v1/customer/suggested-items';
export const NOTIFICATION_URI = '/api/v1/customer/notifications';
export const CUSTOMER_REMOVE_URI = '/api/v1/customer/remove-account';
export const VISIT_AGAIN_STORE_URI = '/api/v1/customer/visit-again';

// ─── Address ─────────────────────────────────────────────────────────────
export const ADDRESS_LIST_URI = '/api/v1/customer/address/list';
export const ADD_ADDRESS_URI = '/api/v1/customer/address/add';
export const UPDATE_ADDRESS_URI = '/api/v1/customer/address/update/';
export const REMOVE_ADDRESS_URI = '/api/v1/customer/address/delete';

// ─── Stores ──────────────────────────────────────────────────────────────
export const STORE_URI = '/api/v1/stores/get-stores';
export const POPULAR_STORE_URI = '/api/v1/stores/popular';
export const LATEST_STORE_URI = '/api/v1/stores/latest';
export const TOP_OFFER_STORE_URI = '/api/v1/stores/top-offer-near-me';
export const STORE_DETAILS_URI = '/api/v1/stores/details/';
export const STORE_REVIEW_URI = '/api/v1/stores/reviews';
export const RECOMMENDED_STORE_URI = '/api/v1/stores/recommended';

// ─── Items / Products ────────────────────────────────────────────────────
export const LATEST_ITEM_URI = '/api/v1/items/latest';
export const POPULAR_ITEM_URI = '/api/v1/items/popular';
export const REVIEWED_ITEM_URI = '/api/v1/items/most-reviewed';
export const ITEM_DETAILS_URI = '/api/v1/items/details/';
export const SET_MENU_URI = '/api/v1/items/set-menu';
export const REVIEW_URI = '/api/v1/items/reviews/submit';
export const RECOMMENDED_ITEM_URI = '/api/v1/items/recommended';
export const DISCOUNTED_ITEMS_URI = '/api/v1/items/discounted';
export const BASIC_MEDICINE_URI = '/api/v1/items/basic';
export const SEARCH_SUGGESTIONS_URI = '/api/v1/items/item-or-store-search';
export const CART_STORE_SUGGESTED_URI = '/api/v1/items/suggested';

// ─── Categories ──────────────────────────────────────────────────────────
export const CATEGORY_URI = '/api/v1/categories';
export const SUB_CATEGORY_URI = '/api/v1/categories/childes/';
export const CATEGORY_ITEM_URI = '/api/v1/categories/items/';
export const CATEGORY_STORE_URI = '/api/v1/categories/stores/';
export const FEATURED_CATEGORIES_URI = '/api/v1/categories/featured/items';
export const POPULAR_CATEGORIES_URI = '/api/v1/categories/popular';

// ─── Banners ─────────────────────────────────────────────────────────────
export const BANNER_URI = '/api/v1/banners';
export const PROMOTIONAL_BANNER_URI = '/api/v1/other-banners';
export const WHY_CHOOSE_URI = '/api/v1/other-banners/why-choose';
export const VIDEO_CONTENT_URI = '/api/v1/other-banners/video-content';
export const ADVERTISEMENT_LIST_URI = '/api/v1/advertisement/list';

// ─── Cart (Online) ──────────────────────────────────────────────────────
export const GET_CART_LIST_URI = '/api/v1/customer/cart/list';
export const ADD_CART_URI = '/api/v1/customer/cart/add';
export const UPDATE_CART_URI = '/api/v1/customer/cart/update';
export const REMOVE_ALL_CART_URI = '/api/v1/customer/cart/remove';
export const REMOVE_ITEM_CART_URI = '/api/v1/customer/cart/remove-item';

// ─── Orders ──────────────────────────────────────────────────────────────
export const PLACE_ORDER_URI = '/api/v1/customer/order/place';
export const PRESCRIPTION_ORDER_URI = '/api/v1/customer/order/prescription/place';
export const RUNNING_ORDER_URI = '/api/v1/customer/order/running-orders';
export const ORDER_LIST_URI = '/api/v1/customer/order/list';
export const ORDER_DETAILS_URI = '/api/v1/customer/order/details';
export const ORDER_CANCEL_URI = '/api/v1/customer/order/cancel';
export const COD_SWITCH_URI = '/api/v1/customer/order/payment-method';
export const ORDER_TRACK_URI = '/api/v1/customer/order/track';
export const REFUND_REASONS_URI = '/api/v1/customer/order/refund-reasons';
export const REFUND_REQUEST_URI = '/api/v1/customer/order/refund-request';
export const CANCELLATION_REASONS_URI = '/api/v1/customer/order/cancellation-reasons';
export const PARCEL_INSTRUCTION_URI = '/api/v1/customer/order/parcel-instructions';
export const OFFLINE_PAYMENT_SAVE_URI = '/api/v1/customer/order/offline-payment';
export const OFFLINE_PAYMENT_UPDATE_URI = '/api/v1/customer/order/offline-payment-update';
export const ORDER_TAX_URI = '/api/v1/customer/order/get-Tax';
export const SURGE_PRICE_URI = '/api/v1/customer/order/get-surge-price';

// ─── Coupons ─────────────────────────────────────────────────────────────
export const COUPON_LIST_URI = '/api/v1/coupon/list';
export const COUPON_APPLY_URI = '/api/v1/coupon/apply';

// ─── Wishlist ────────────────────────────────────────────────────────────
export const WISHLIST_GET_URI = '/api/v1/customer/wish-list';
export const WISHLIST_ADD_URI = '/api/v1/customer/wish-list/add';
export const WISHLIST_REMOVE_URI = '/api/v1/customer/wish-list/remove';

// ─── Wallet & Loyalty ────────────────────────────────────────────────────
export const WALLET_TRANSACTION_URI = '/api/v1/customer/wallet/transactions';
export const ADD_FUND_URI = '/api/v1/customer/wallet/add-fund';
export const WALLET_BONUS_URI = '/api/v1/customer/wallet/bonuses';
export const LOYALTY_TRANSACTION_URI = '/api/v1/customer/loyalty-point/transactions';
export const LOYALTY_TRANSFER_URI = '/api/v1/customer/loyalty-point/point-transfer';

// ─── Cashback ────────────────────────────────────────────────────────────
export const CASHBACK_LIST_URI = '/api/v1/cashback/list';
export const CASHBACK_AMOUNT_URI = '/api/v1/cashback/getCashback';

// ─── Messaging ───────────────────────────────────────────────────────────
export const CONVERSATION_LIST_URI = '/api/v1/customer/message/list';
export const SEARCH_CONVERSATION_URI = '/api/v1/customer/message/search-list';
export const MESSAGE_DETAILS_URI = '/api/v1/customer/message/details';
export const SEND_MESSAGE_URI = '/api/v1/customer/message/send';
export const GET_MESSAGE_URI = '/api/v1/customer/message/get';

// ─── Campaigns ───────────────────────────────────────────────────────────
export const BASIC_CAMPAIGN_URI = '/api/v1/campaigns/basic';
export const ITEM_CAMPAIGN_URI = '/api/v1/campaigns/item';
export const CAMPAIGN_DETAILS_URI = '/api/v1/campaigns/basic-campaign-details';

// ─── Flash Sales ─────────────────────────────────────────────────────────
export const FLASH_SALE_URI = '/api/v1/flash-sales';
export const FLASH_SALE_PRODUCTS_URI = '/api/v1/flash-sales/items';

// ─── Brands ──────────────────────────────────────────────────────────────
export const BRAND_LIST_URI = '/api/v1/brand';
export const BRAND_ITEMS_URI = '/api/v1/brand/items';

// ─── Delivery Man ────────────────────────────────────────────────────────
export const LAST_LOCATION_URI = '/api/v1/delivery-man/last-location';
export const DELIVERY_REVIEW_URI = '/api/v1/delivery-man/reviews/submit';

// ─── Parcel ──────────────────────────────────────────────────────────────
export const PARCEL_CATEGORY_URI = '/api/v1/parcel-category';

// ─── Common Conditions (Pharmacy) ────────────────────────────────────────
export const COMMON_CONDITION_URI = '/api/v1/common-condition';
export const CONDITION_ITEMS_URI = '/api/v1/common-condition/items/';

// ─── Static Pages ────────────────────────────────────────────────────────
export const ABOUT_US_URI = '/api/v1/about-us';
export const PRIVACY_POLICY_URI = '/api/v1/privacy-policy';
export const TERMS_URI = '/api/v1/terms-and-conditions';
export const CANCELLATION_URI = '/api/v1/cancelation';
export const REFUND_POLICY_URI = '/api/v1/refund-policy';
export const SHIPPING_POLICY_URI = '/api/v1/shipping-policy';

// ─── Newsletter ──────────────────────────────────────────────────────────
export const NEWSLETTER_URI = '/api/v1/newsletter/subscribe';

// ─── Miscellaneous ───────────────────────────────────────────────────────
export const MOST_TIPS_URI = '/api/v1/most-tips';
export const OFFLINE_METHODS_URI = '/api/v1/offline_payment_method_list';

// ─── Vendor Registration & Subscription ──────────────────────────────────
export const STORE_REGISTER_URI = '/api/v1/auth/vendor/register';
export const DM_REGISTER_URI = '/api/v1/auth/delivery-man/store';
export const BUSINESS_PLAN_URI = '/api/v1/vendor/business_plan';
export const STORE_PACKAGES_URI = '/api/v1/vendor/package-view';
