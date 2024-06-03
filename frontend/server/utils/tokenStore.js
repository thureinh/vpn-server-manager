const tokenStore = {};

export const setToken = (id, token) => {
    tokenStore[id] = token
}

export const getToken = (id) => {
    return tokenStore[id]
}
