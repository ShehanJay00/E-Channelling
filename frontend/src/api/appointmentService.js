import api from "./axios";

// ==========================================
// Appointment API Services
// Matches backend routes: /api/v1/appointment/*
// ==========================================

const appointmentService = {
  // POST /appointment/create - Book a new appointment (requires auth)
  // Body: { doctorId, date, time }
  createAppointment: async (appointmentData) => {
    const response = await api.post("/appointment/create", appointmentData);
    return response.data;
  },

  // GET /appointment/user/all - Get logged-in user's appointments (requires auth)
  getMyAppointments: async () => {
    const response = await api.get("/appointment/user/all");
    return response.data;
  },

  // GET /appointment/user/details/:id - Get one of user's appointments (requires auth)
  getMyAppointmentDetails: async (id) => {
    const response = await api.get(`/appointment/user/details/${id}`);
    return response.data;
  },

  // GET /appointment/all - Get all appointments (for admin panel)
  getAllAppointments: async () => {
    const response = await api.get("/appointment/all");
    return response.data;
  },

  // GET /appointment/details/:id - Get any appointment by ID
  getAppointmentDetails: async (id) => {
    const response = await api.get(`/appointment/details/${id}`);
    return response.data;
  },

  // PUT /appointment/update/:id - Update appointment status
  // Body: { status } - "pending" | "approved" | "rejected"
  updateAppointmentStatus: async (id, status) => {
    const response = await api.put(`/appointment/update/${id}`, { status });
    return response.data;
  },
};

export default appointmentService;
