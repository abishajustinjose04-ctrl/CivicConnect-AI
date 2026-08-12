import axios from "axios";

const API = axios.create({
  baseURL: "http://127.0.0.1:5000",
  headers: {
    "Content-Type": "application/json",
  },
});

// Authentication
export const registerUser = (data) =>
  API.post("/register", data);

export const loginUser = (data) =>
  API.post("/login", data);

// Complaints
export const submitComplaint = (data) =>
  API.post("/complaint", data);

export const getComplaints = () =>
  API.get("/complaints");

export const getComplaint = (id) =>
  API.get(`/track_complaint/${id}`);

export const updateComplaintStatus = (id, status) =>
  API.put(`/complaint/${id}`, {
    status,
  });

export const deleteComplaint = (id) =>
  API.delete(`/complaint/${id}`);

// Complaint history
export const getComplaintHistory = (id) =>
  API.get(`/complaint_history/${id}`);

// Image upload
export const uploadComplaintImage = (id, file) => {
  const formData = new FormData();

  formData.append("image", file);

  return API.post(
    `/upload_image/${id}`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
};

export default API;