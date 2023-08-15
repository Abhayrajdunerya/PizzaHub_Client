import axios from 'axios';

const API = import.meta.env.VITE_API;

export const createOrUpdateUser = async (authtoken) => {
    return await axios.post(API+'/create-or-update-user', {}, {
        headers: {
            authtoken,
        }
    })
}

export const currentUser = async (authtoken) => {
    return await axios.post(API+'/current-user', {}, {
        headers: {
            authtoken,
        }
    })
}

export const currentAdmin = async (authtoken) => {
    return await axios.post(API+'/current-admin', {}, {
        headers: {
            authtoken,
        }
    })
}