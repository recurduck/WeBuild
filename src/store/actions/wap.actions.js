import { wapService } from '../../services/wap.service.js'
import { cmpService } from '../../services/cmp.service.js'
import { utilService } from '../../services/utils.js'

export function loadWaps() { // Action Creator
    return async dispatch => {
        try {
            const waps = await wapService.query()
            const action = {
                type: 'SET_WAPS',
                waps
            }
            dispatch(action);
            return waps
        } catch (err) {
            throw new Error('Error in loadWaps  :', err)
        }
    }
}

//Load all the saved cmps on the storage
export function loadCmps() {
    return async dispatch => {
        try {
            const cmps = await cmpService.query()
            const action = {
                type: 'SET_CMPS',
                cmps: cmps[0].cmps
            }
            dispatch(action);
        } catch (err) {
            throw new Error('Error in loadCmps  :', err)
        }
    }
}

export function setWapToEdit(wap) {
    return async dispatch => {
        if(wap) wap.sessionId = utilService.makeId();
        const action = {
            type: 'SET_WAP_TO_EDIT',
            wapToEdit: wap
        }
        dispatch(action)
        return wap
    }
}

