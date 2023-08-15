import axios from "axios";

const API = import.meta.env.VITE_API;

export const order = async (authtoken, coupon) => {
    return await axios.post(API+`/payment/order`, {couponApplied: coupon}, {
        headers: {
            authtoken,
        }
    });
}

export const verify = async (authtoken, response) => {
    return await axios.post(API+`/payment/verify`, response, {
        headers: {
            authtoken,
        }
    });
}