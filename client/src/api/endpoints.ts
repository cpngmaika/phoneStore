export const apiEndpoints = {
  auth: {
    login: "/api/auth/login",
    register: "/api/auth/register",
    logout: "/api/auth/logout",
    currentUser: "/api/auth/me",
  },
  products: "/api/products",
  cart: "/api/cart",
  orders: "/api/orders",
  users: {
    profile: "/api/user/profile",
    password: "/api/user/change-password",
    addresses: "/api/user/addresses",
  },
  admin: {
    users: "/api/admin/users",
  },
} as const;
