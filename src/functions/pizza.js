import axios from "axios";

const API = import.meta.env.VITE_API;

export const createProduct = async (pizza, authtoken) => {
    return await axios.post(API+`/pizza`, pizza, {
      headers: {
          authtoken,
      },
    });
  }

export const getProductsByCount = async (count) => {
  return await axios.get(API+`/pizzas/${count}`);
}

export const removeProduct = async (slug, authtoken) => {
  return await axios.delete(API+`/pizza/${slug}`, {
    headers: {
        authtoken,
    },
  });
}

export const getProduct = async (slug) => {
  return await axios.get(API+`/pizza/${slug}`);
}

export const updateProduct = async (slug, pizza, authtoken) => {
  return await axios.put(API+`/pizza/${slug}`, pizza, {
    headers: {
        authtoken,
    },
  });
}



