import axios from 'axios';

const API = import.meta.env.VITE_API;

export const getOrders = async (authtoken) => {
    return await axios.get(API+`/admin/orders`, {
        headers: {
            authtoken,
        }
    });
}

export const changeStatus = async (authtoken, orderId, orderStatus) => {
    return await axios.put(API+`/admin/order-status`, {orderId, orderStatus}, {
        headers: {
            authtoken,
        }
    });
}

export const reduceSubCount = async (authtoken, subIngredient, n, count) => {
    return await axios.put(API+`/admin/reduce-sub-count`, {subIngredient, n, count}, {
        headers: {
            authtoken,
        }
    });
}

export const getAlert = async (authtoken) => {
    return await axios.get(API+`/admin/alert`, {
        headers: {
            authtoken,
        }
    });
}