export default {
    getListCustomerForManagement: (axios, input) => axios.get(`/customer/GetCustomerForManagement?grouptype_id=${input.grouptype_id}&customer_id=${input.customer_id}`),
    getTypes: (axios) => axios.get('/customer/GetCustomerGroup'),

    insertCustomer: (axios, data) => axios.post('/customer/InsertCustomer', data),
    updateCustomer: (axios, data) => axios.put('/customer/UpdateCustomer', data),
    deleteCustomer: (axios, customer_id) => axios.delete('/customer/DeleteCustomer?customer_id=' + customer_id),

    getCustomerPersonRelationship: (axios, cus_detail_id) => axios.get(`/customer/GetCustomerPersonRelationship?cus_detail_id=${cus_detail_id}`),
    insertCustomerPersonRelationship: (axios, data) => axios.post('/customer/InsertPersonRelationship', data),
    updateCustomerPersonRelationship: (axios, data) => axios.put('/customer/UpdatePersonRelationship', data),
    deleteCustomerPersonRelationship: (axios, person_id) => axios.delete('/customer/DeletePersonRelationship?person_id=' + person_id)
}
