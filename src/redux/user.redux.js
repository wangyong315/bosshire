import axios from "axios"
import { getRedirectPath } from '../util';

const ERROR_MSG = 'ERROR_MSG'
const LOAD_DATA = 'LOAD_DATA'
const LOG_OUT = 'LOG_OUT'
const AUTH_SUCCESS = 'AUTH_SUCCESS'

const initState = {
  redirectTo: '',
  msg:'',
  user: '',
  type: '',
}

// reducer
export function user(state = initState, action) {
  console.log('action', action);
  switch (action.type) {
    case AUTH_SUCCESS:
      return { ...state, msg:'', redirectTo: getRedirectPath(action.payload), ...action.payload }
    case LOAD_DATA:
      return { ...state, ...action.payload }
    case LOG_OUT:
      return { ...initState, redirectTo: '/login' }
    case ERROR_MSG:
      return { ...state, msg: action.msg, isAuth: false }
    default:
      return state
  }
}

function authSuccess(obj) {
  const {pwd, ...data} = obj
  return {payload: data, type: AUTH_SUCCESS}
}

function errorMsg(msg) {
  return {msg, type: ERROR_MSG}
}

export function loadData(userinfo) {
  return {type: LOAD_DATA, payload: userinfo}
}

export function register({user, pwd, repeatpwd, type}) {
  if (!user || !pwd || !type) {
    return errorMsg('用户名密码必须输入')
  }
  if (pwd !== repeatpwd) {
    return errorMsg('密码和确认密码不同')
  }
  console.log('registesr', user, pwd, repeatpwd, type);
  return dispatch => {
    axios.post('/user/register', {user, pwd, repeatpwd, type})
      .then(res => {
        if (res.status === 200 && res.data.code === 1) {
          dispatch(authSuccess({user, pwd, type}))
        } else {
          dispatch(errorMsg(res.data.msg))
        }
      })
  }
}

export function login({user, pwd}) {
  if (!user || !pwd) {
    return errorMsg('用户名密码必须输入')
  }
  return dispatch => {
    axios.post('/user/login', {user, pwd})
      .then(res => {
        console.log('resa', res);
        if (res.status === 200 && res.data.code === 1) {
          const { type } = res.data.data
          dispatch(authSuccess({user, type, pwd}))
        } else {
          dispatch(errorMsg(res.data.msg))
        }
      })
  }
}

export function update(data) {
  return dispatch => {
    axios.post('/user/update', data)
      .then(res => {
        if (res.status === 200 && res.data.code === 1) {
          dispatch(authSuccess(res.data.data))
        } else {
          dispatch(errorMsg(res.data.msg))
        }
      })
  }
}

export function logoutSubmit() {
  return { type: LOG_OUT }
}