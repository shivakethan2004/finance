import axios from 'axios';
import api, { BASE_URL, getToken } from './interceptor';

export const uploadInvoice = async (companyname,fileInput) => {
    try {
        // console.log('fileInput:', fileInput); // Log fileInput to debug

        const formData = new FormData();
        formData.append('invoice', fileInput, fileInput.name);
        const token = getToken()
        const config = {
            headers: {
                'Authorization': `Token ${token}`,
                'Content-Type': 'multipart/form-data'
            }
        };

        const response = await axios.post(
            `${BASE_URL}/companies/${companyname}/upload_invoice/`,
            formData,
            config
        );

        console.log(response.data);
        return response.data;
    } catch (error) {
        console.error('Error uploading invoice:', error);
        throw error;
    }
};

export const getCompanyData = async (companyname, startDate, endDate, selectedOption) => {
    try {
        const url = `${BASE_URL}/companies/${companyname}/inferences/?startDate=${startDate}&endDate=${endDate}&date_type=${selectedOption}`;
        return await api.get(url)
    } catch (error) {
        console.error(error)
    }
}

export const getCompanies = async () => {
    try{
        return await api.get(`${BASE_URL}/companies/`)
    }catch(error){
        console.error(error)
    }
}

export const addCompany = async (data) => {
    console.log(data);
    try {
        return await api.post(`/companies/`,data)
    } catch (error) {
        console.log(error);
    }
}

export const addCompanyLogo = async (companyname,file) => {
    try {
        const token = getToken()
        const form = new FormData();
        form.append('logo', file,file.name);
        return await axios.post(`${BASE_URL}/companies/${companyname}/upload_logo/`,form,{
            headers: {
                'Authorization': `Token ${token}`,
                'Content-Type': 'multipart/form-data'
            }
        })
    } catch (error) {
        
    }
}

export const addUserToCompany = async (companyname,data) => {
    try {
        return api.post(`/companies/${companyname}/add_user/`,data)
    }catch(e){
        console.log(e);
    }
}

export const getUserStatus = async (companyname) => {
    try {
        return api.get(`/companies/${companyname}/user_status/`)
    }catch(e){
        console.log(e);
    }
}

export const editInvoice = async (companyname,invoiceid,data) => {
    try{
        return api.patch(`/companies/${companyname}/invoices/${invoiceid}/`,data)
    }catch(e){
        console.log(e)
    }
}

export const getPendingInvoice = async (companyname) => {
    try {
        return api.get(`/companies/${companyname}/next-pending-invoice/`)
    } catch (error) {
        console.log(error)
    }
}

export const getOwnerStatus = async () => {
    try {
        return api.get(`/user_workspace_status/`)
    } catch (error) {
        console.log(error)
    }
}

export const deleteInvoice = async (companyname,id) => {
    try {
        return api.delete(`/companies/${companyname}/delete_invoice/${id}`)
    } catch (error) {
        console.log(error);
    }
}

export const retryInvoice = async (companyname,id) => {
    try {
        return api.post(`/companies/${companyname}/retry_invoice/${id}/`)
    } catch (error) {
        console.log(error);
    }
}