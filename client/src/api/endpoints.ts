export const apiEndpoints = {
  auth: {
    login: "/api/auth/login",
    register: "/api/auth/register",
    logout: "/api/auth/logout",
    currentUser: "/api/auth/me",
  },
  products: {
    list: "/api/products",
    byId: (id: number | string) => `/api/products/${id}`,
  },
  cart: {
    current: "/api/cart",
    items: "/api/cart/items",
    item: (id: number | string) => `/api/cart/items/${id}`,
    clear: "/api/cart/clear",
  },
  orders: {
    list: "/api/orders",
    create: "/api/orders",
    byId: (id: number | string) => `/api/orders/${id}`,
  },
  users: {
    profile: "/api/user/profile",
    changePassword: "/api/user/change-password",
    addresses: "/api/user/addresses",
    address: (id: number | string) => `/api/user/addresses/${id}`,
  },
  admin: {
    users: "/api/admin/users",
    userDetail: "/api/admin/users/detail",
    createUser: "/api/admin/users/create",
    updateUser: "/api/admin/users/update",
    toggleUserStatus: "/api/admin/users/toggle-status",
    orders: "/api/admin/orders",
    updateOrderStatus: (id: number | string) =>
      `/api/admin/orders/${id}/status`,
  },
  brands: {
    list: "/api/brands",
    byId: (id: number | string) => `/api/brands/${id}`,
  },
  reviews: "/api/reviews",
  warrantyPolicies: {
    list: "/api/warranty-policies",
    byId: (id: number | string) => `/api/warranty-policies/${id}`,
  },
} as const;
