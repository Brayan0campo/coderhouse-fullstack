const Errors = Object.freeze({
  ROUTING_ERROR: { code: 1, description: "Routing error" },
  INVALID_TYPES_ERROR: { code: 2, description: "Invalid types error" },
  DATABASE_ERROR: { code: 3, description: "Database error" },
  REQUIRED_DATA: { code: 4, description: "Required data missing" },
  INVALID_DATA: { code: 5, description: "Invalid data" },
  AUTHENTICATION_ERROR: { code: 6, description: "Authentication error" },
  AUTHORIZATION_ERROR: { code: 7, description: "Authorization error" },
  PERMISSION_ERROR: { code: 8, description: "Permission error" },
  INTERNAL_SERVER_ERROR: { code: 9, description: "Internal server error" },
  INVALID_TOKEN: { code: 10, description: "Invalid token" },
});

export default Errors;
