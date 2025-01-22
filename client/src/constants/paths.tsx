export const paths = {
  HOME: "/",
  CHART: "/chart",
  PROFILE: {
    MAIN: "/profile",
    EDIT: "/profile/edit",
    DELETE: "/profile/delete",
  },
  LIST: "/list",
  FAVORITES: "/favorites",
  DETAIL: (id = ":id") => `/detail/${id}`,
  PAYMENT: (id = ":id") => `/payment/${id}`,
  RESERVATIONS: "/reservations",
  DASHBOARD: {
    MAIN: "/dashboard",
    USERS: {
      LIST: "/dashboard/users",
    },
    RENTS: {
      LIST: "/dashboard/rents",
      CREATE: "/dashboard/rents/create",
      EDIT: (id = ":id") => `/dashboard/rent/edit/${id}`,
      DELETE: (id = ":id") => `/dashboard/rent/delete/${id}`,
    },
    CATEGORIES: {
      LIST: "/dashboard/categories",
      CREATE: "/dashboard/categories/create",
      EDIT: (id = ":id") => `/dashboard/category/edit/${id}`,
      DELETE: (id = ":id") => `/dashboard/category/delete/${id}`,
    },
    LOCATIONS: {
      LIST: "/dashboard/locations",
      CREATE: "/dashboard/locations/create",
      EDIT: (id = ":id") => `/dashboard/location/edit/${id}`,
      DELETE: (id = ":id") => `/dashboard/location/delete/${id}`,
    },
    RESERVATIONS: {
      LIST: "/dashboard/reservations",
    },
    REVIEWS: {
      LIST: "/dashboard/reviews",
    },
    CHAT: {
      VIEW: "/dashboard/chat",
      USER: (id = ":id") => `/dashboard/chat/${id}`,
    },
  },
};
