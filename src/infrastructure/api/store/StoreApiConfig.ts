export const STORE_ENDPOINTS = {
  GET_ALL: '/stores',
  GET_BY_ID: (id: number) => `/stores/${id}`,
  GET_BY_PRODUCT: '/stores/getStoreByProductID',
};