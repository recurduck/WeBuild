import { storageService } from './storage-service.js'
const axios = require('axios');

const STORAGE_KEY = 'loggedinUser'

export const userService = {
    login,
    logout,
    signup,
}

function login(credentials) {
    return axios.post('/api/login', credentials).then(res => res.data)
        .then(user => {
            storageService.save(STORAGE_KEY, user)
            return user
        })
}
function signup(userInfo) {
    return axios.post('/api/signup', userInfo).then(res => res.data)
        .then(user => {
            storageService.save(STORAGE_KEY, user)
            return user
        })
}
function logout() {
    return axios.post('/api/logout').then(res => res.data)
        .then(() => {
            storageService.save(STORAGE_KEY, null)
            return null
        })
}