import axios from "axios";

// Link API (json-server)
const API_URL = "http://localhost:3002/shoes";
const CONTACT_API = "http://localhost:3002/contacts";
const ORDER_API = "http://localhost:3002/orders";
const USER_API = "http://localhost:3002/users";

// Lấy d.sách giày
export const getShoes = async () => {
  try {
    const response = await axios.get(API_URL); // Gửi request
    return response.data;
  } catch (error) {
    console.error("Failed to fetch shoes", error);
    throw error;
  }
};

// Thêm giày mới

export const addShoe = async (newShoe) => {
  try {
    const response = await axios.post(API_URL, newShoe);
    return response.data;
  } catch (error) {
    console.error("Error adding shoe", error);
    throw error;
  }
};

// Cập nhật giày
export const updateShoe = async (id, updatedShoe) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, updatedShoe);
    return response.data;
  } catch (error) {
    console.error("Error updating shoe", error);
    throw error;
  }
};

export const updateShoeSizes = async (id, sizesUpdate) => {
  try {
    const response = await axios.patch(`${API_URL}/${id}`, {
      sizes: sizesUpdate,
    });
    return response.data;
  } catch (error) {
    console.error("Error updating shoe sizes", error);
    throw error;
  }
};

export const updateShoeQuantity = async (id, newQuantity) => {
  try {
    const response = await axios.patch(`${API_URL}/${id}`, {
      quantity: newQuantity,
    });
    return response.data;
  } catch (error) {
    console.error("Error updating shoe quantity", error);
    throw error;
  }
};

// Xóa giày
export const deleteShoe = async (id) => {
  try {
    await axios.delete(`${API_URL}/${id}`);
  } catch (error) {
    console.error("Error deleting shoe", error);
    throw error;
  }
};

// Lấy đơn
export const getOrders = async () => {
  try {
    const response = await axios.get(ORDER_API);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch orders", error);
    throw error;
  }
};

// Lưu đơn mới
export const createOrder = async (orderData) => {
  try {
    const response = await axios.post(ORDER_API, orderData);
    return response.data;
  } catch (error) {
    console.error("Error creating order", error);
    throw error;
  }
};

export const updateOrderStatus = async (id, status) => {
  try {
    const response = await axios.patch(`${ORDER_API}/${id}`, { status });
    return response.data;
  } catch (error) {
    console.error("Error updating order status", error);
    throw error;
  }
};

// Lấy d.sách user
export const getUsers = async () => {
  try {
    const response = await axios.get(USER_API);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch users", error);
    throw error;
  }
};

// Tạo user mới
export const createUser = async (newUser) => {
  try {
    const response = await axios.post(USER_API, newUser);
    return response.data;
  } catch (error) {
    console.error("Error creating user", error);
    throw error;
  }
};

// Cập nhật user
export const loginUser = async (id, updates) => {
  try {
    const response = await axios.patch(`${USER_API}/${id}`, updates);
    return response.data;
  } catch (error) {
    console.error("Error updating user login", error);
    throw error;
  }
};
export const updateUser = async (id, updates) => {
  try {
    const response = await axios.patch(`${USER_API}/${id}`, updates);
    return response.data;
  } catch (error) {
    console.error("Error updating user", error);
    throw error;
  }
};
// Tạo liên hệ
export const createContact = async (data) => {
  try {
    const response = await axios.post(CONTACT_API, {
      ...data,
      status: "unread",
      reply: "",
    });
    return response.data;
  } catch (error) {
    console.error("Error creating contact", error);
    throw error;
  }
};

export const getContacts = async () => {
  try {
    const response = await axios.get(CONTACT_API);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch contacts", error);
    throw error;
  }
};

export const updateContact = async (id, updates) => {
  try {
    const response = await axios.patch(`${CONTACT_API}/${id}`, updates);
    return response.data;
  } catch (error) {
    console.error("Error updating contact", error);
    throw error;
  }
};
