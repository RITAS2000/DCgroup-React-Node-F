import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";


axios.defaults.baseURL = "http://localhost:3000/api/auth";

const setAuthHeader = (token) => {
  axios.defaults.headers.common.Authorization = `Bearer ${token}`;
};

const clearAuthHeader = () => {
  axios.defaults.headers.common.Authorization = "";
};

export const register = createAsyncThunk(
  "auth/register",
  async (values, thunkAPI) => {
    try {
      console.log('Registering with:', values);
      const res = await axios.post("/register", values);
      setAuthHeader(res.data.token);
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const login = createAsyncThunk(
  "auth/login",
  async (values, thunkAPI) => {
    try {
      const res = await axios.post("/login", values);
      console.log('Login response:', res);
      setAuthHeader(res.data.token);
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const logout = createAsyncThunk(
    "auth/logout",
    async (_, thunkAPI) => {
    try {
     await axios.post("/logout");
     clearAuthHeader();
    } catch (error) {
       return thunkAPI.rejectWithValue(error.message);
    }
});