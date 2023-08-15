import axios from "axios";
const API = import.meta.env.VITE_API;

export const getSubs = async () => {
  return await axios.get(API+'/subIngredients');
}

export const getSub = async (slug) => {
  return await axios.get(API+`/subIngredient/${slug}`);
}

export const getSubsByCategory = async (_id) => {
  return await axios.get(API+`/subIngredientsByIngredient/${_id}`);
}

export const removeSub = async (slug, authtoken) => {
  return await axios.delete(API+`/subIngredient/${slug}`, {
    headers: {
        authtoken,
    },
  });
}

export const updateSub = async (slug, sub, authtoken) => {
  return await axios.put(API+`/subIngredient/${slug}`, sub, {
    headers: {
        authtoken,
    },
  });
}

export const createSub = async (sub, authtoken) => {
  return await axios.post(API+`/subIngredient`, sub, {
    headers: {
        authtoken,
    },
  });
}

export const addQty = async (_id, qty, authtoken) => {
  return await axios.put(API+`/addQty`, {_id, qty}, {
    headers: {
        authtoken,
    },
  });
}

