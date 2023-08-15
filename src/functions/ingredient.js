import axios from 'axios'

const API = import.meta.env.VITE_API;

export const getIngredients = async () => {
    return await axios.get(API+'/ingredients')
}

export const getIngredient = async (slug) => {
    return await axios.get(API+`/ingredient/${slug}`)
}

export const getIngredientById = async (_id) => {
    return await axios.get(API+`/ingredientById/${_id}`)
}

export const createIngredient = async (title, authtoken) => {
    return await axios.post(API+`/ingredient`, {title}, {
        headers: {
            authtoken,
        }
    })
}

export const removeIngredient = async (slug, authtoken) => {
    return await axios.delete(API+`/ingredient/${slug}`, {
        headers: {
            authtoken,
        }
    })
}

export const updateIngredient = async (slug, title, authtoken) => {
    return await axios.put(API+`/ingredient/${slug}`, {title}, {
        headers: {
            authtoken,
        }
    })
}

export const getIngredientSubs = async (_id) => {
    return await axios.get(API+`/ingredient/subs/${_id}`)
}

