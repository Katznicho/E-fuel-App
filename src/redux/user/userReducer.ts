import { UPDATE_USER_INFO, LOG_OUT, UPDATE_LOCATION } from './userTypes';

// initial state
const initialState = {
    isLoggedIn: false,
    user: {
        adminId: 0,
        name: '',
        email: '',
        roleId: 0,
        gender: '',
        phoneNumber: '',
        profilePicture: null,
        role:{
            id:'',
            name:""
        }
    },
    accessToken: '',
    location: { latitude: 0, longitude: 0 },
};

const userReducer = (
    state = initialState,
    action: { type: string; payload: any },
) => {
    switch (action.type) {
        // Update user info stored in state
        case UPDATE_USER_INFO: {
            const { user, accessToken , role} = action.payload;

            return {
                ...state,
                isLoggedIn: true,
                user: {
                    adminId: user?.adminId,
                    name: user?.name,
                    email: user?.email,
                    roleId: user?.roleId,
                    gender: user?.gender,
                    phoneNumber: user?.phoneNumber,
                    profilePicture: user?.profilePicture,
                    role:{
                        id:role?.id,
                        name:role?.name
                    }
                },
                accessToken,
            };
        }

        // Logout user
        case LOG_OUT: {
            return {
                isLoggedIn: false,
                user: {
                    adminId: 0,
                    name: '',
                    email: '',
                    roleId: 0,
                    gender: '',
                    phoneNumber: '',
                    profilePicture: null,
                    role:{
                        id:"",
                        name:"",
                    }
                },
                accessToken: '',
            };
        }

        // Update Location
        case UPDATE_LOCATION: {
            const { latitude, longitude } = action.payload;
            return { ...state, location: { latitude, longitude } };
        }

        default:
            return state;
    }
};

export default userReducer;
