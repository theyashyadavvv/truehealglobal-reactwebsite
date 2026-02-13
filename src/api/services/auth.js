/**
 * Auth API Service — mirrors Flutter auth_repository.dart
 */
import { apiPost, apiGet, getToken, saveToken, clearAllSession, saveGuestId } from '../config';
import * as EP from '../endpoints';

/** Login with email/phone + password */
export async function login({ phone, email, password, loginType = 'manual', fieldType }) {
    // Detect field type from inputs if not explicitly set
    const ftype = fieldType || (phone ? 'phone' : 'email');
    const body = {
        password,
        login_type: loginType,
        field_type: ftype,
        email_or_phone: ftype === 'phone' ? phone : email,
    };
    if (ftype === 'phone') body.phone = phone;
    else body.email = email;

    const data = await apiPost(EP.LOGIN_URI, body);
    // Save token only if verified (mirrors Flutter auth_service.dart)
    if (data.token && data.is_phone_verified && data.is_email_verified) {
        saveToken(data.token);
    }
    return data;
}

/** Register new user */
export async function register({ name, phone, email, password, ref_code }) {
    const body = { name, phone, email, password };
    if (ref_code) body.ref_code = ref_code;
    const data = await apiPost(EP.REGISTER_URI, body);
    // Save token only if phone/email verified
    if (data.token && data.is_phone_verified && data.is_email_verified) {
        saveToken(data.token);
    }
    return data;
}

/** Social login (Google / Apple / Facebook) — Flutter uses loginUri, not socialLoginUri */
export async function socialLogin({ token, unique_id, email, medium, phone, login_type = 'social', platform = 'web' }) {
    const body = {
        email,
        token,
        unique_id,
        medium,       // 'google', 'facebook', 'apple'
        login_type,
        platform,
    };
    if (phone) body.phone = phone;
    // Flutter uses loginUri for social login too
    const data = await apiPost(EP.LOGIN_URI, body);
    if (data.token) saveToken(data.token);
    return data;
}

/** Social register */
export async function socialRegister({ token, unique_id, email, medium, f_name, l_name, phone }) {
    const body = { token, unique_id, email, medium, f_name, l_name, phone };
    const data = await apiPost(EP.SOCIAL_REGISTER_URI, body);
    if (data.token) saveToken(data.token);
    return data;
}

/** Guest login — returns guest_id for unauthenticated cart/order ops */
export async function guestLogin(fcmToken = '') {
    const data = await apiPost(EP.GUEST_LOGIN_URI, { fcm_token: fcmToken });
    if (data.guest_id) saveGuestId(data.guest_id);
    return data;
}

/** Forgot password — matches Flutter verification_repository.dart */
export async function forgotPassword({ phone, email, verification_method }) {
    const body = {
        phone: phone || '',
        email: email || '',
        verification_method: verification_method || (phone ? 'phone' : 'email'),
    };
    return apiPost(EP.FORGOT_PASSWORD_URI, body);
}

/** Verify OTP token — matches Flutter verification_repository.dart */
export async function verifyToken({ phone, email, reset_token, verification_method }) {
    const body = {
        phone: phone || '',
        email: email || '',
        verification_method: verification_method || (phone ? 'phone' : 'email'),
        reset_token: reset_token || '',
    };
    return apiPost(EP.VERIFY_TOKEN_URI, body);
}

/** Reset password — matches Flutter verification_repository.dart (uses _method: put) */
export async function resetPassword({ _method, reset_token, phone, email, verification_method, password, confirm_password }) {
    const body = {
        _method: _method || 'put',
        reset_token: reset_token || '',
        phone: phone || '',
        email: email || '',
        verification_method: verification_method || (phone ? 'phone' : 'email'),
        password,
        confirm_password,
    };
    return apiPost(EP.RESET_PASSWORD_URI, body);
}

/** Verify phone */
export async function verifyPhone({ phone, otp }) {
    return apiPost(EP.VERIFY_PHONE_URI, { phone, otp });
}

/** Check email */
export async function checkEmail({ email }) {
    return apiPost(EP.CHECK_EMAIL_URI, { email });
}

/** Verify email */
export async function verifyEmail({ email, token }) {
    return apiPost(EP.VERIFY_EMAIL_URI, { email, token });
}

/** Update personal info (name, image) */
export async function updatePersonalInfo(body) {
    return apiPost(EP.PERSONAL_INFO_URI, body);
}

/** Logout — clears all stored session */
export function logout() {
    clearAllSession();
    window.dispatchEvent(new CustomEvent('auth:logout'));
}

/** Get stored token */
export { getToken };
