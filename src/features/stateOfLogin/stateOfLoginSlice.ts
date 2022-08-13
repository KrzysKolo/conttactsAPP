import { createSlice } from '@reduxjs/toolkit';
import { RootState, } from '../../app/store';

export type LoginStateType = {
  isLoginUser: boolean;
  user: {
    userID: string,
    email: string,
    password: string,
    token: string,
  },
  userGoogle: {
    userName: string,
    email: string,
    photo: string,
  }
}

const initialState: LoginStateType = {
  isLoginUser: false,
  user: {
    userID: '',
    email: '',
    password: '',
    token: ''
  },
  userGoogle: {
    userName: '',
    email: '',
    photo: '',
  }
  };

const stateOfLoginSlice = createSlice({
  name: 'loginUser',
  initialState,
  reducers: {
    isAuthenticated: (state, action) => {
      state.isLoginUser = action.payload;
    },
    userOfLogged: (state, action) => {
      state.user = action.payload;
    },
    userOfLoggedWithGoogle: (state, action) => {
      state.userGoogle = action.payload;
    }
  }
})

export const { isAuthenticated, userOfLogged, userOfLoggedWithGoogle } = stateOfLoginSlice.actions;
export const stateLogin = (state: RootState) => state;
export const stateUser = (state: RootState) => state.stateOfLogin.user;
export const stateUserGoogle = (state: RootState) => state.stateOfLogin.userGoogle;
export default stateOfLoginSlice.reducer;