import { UPDATE_USER_INFO, LOG_OUT, UPDATE_LOCATION } from './userTypes';

interface Login {
    adminId: number;
    name: string;
    email: string;
    email_verified_at: null;
    roleId: number;
    gender: string;
    phoneNumber: string;
    profilePicture: null | string;
    
}

interface Role{
    id:number,
    name:string
}

// Update user info in state
export function updateUserInfo(user: Login, accessToken: string, role:Role) {
    return { type: UPDATE_USER_INFO, payload: { user, accessToken, role } };
}

// Logout user
export function logOut() {
    return { type: LOG_OUT };
}

// Update Location
export function updateLocation(latitude: number, longitude: number) {
    return { type: UPDATE_LOCATION, payload: { latitude, longitude } };
}
