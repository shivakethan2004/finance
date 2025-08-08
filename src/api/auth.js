import api, { BASE_URL } from './interceptor';

export const registerUser = async (formData) => {
  try {
    return await api.post(`${BASE_URL}/register/`,formData);
  } catch (error) {
    throw error;
  }
};

export const loginUser = async (formData) => {
  try{
    return await api.post(`${BASE_URL}/login/`,formData)
  }catch(e){
    throw e
  }
}
