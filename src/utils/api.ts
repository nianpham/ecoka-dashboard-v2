const BASE_URL = "https://api.farmcode.io.vn/v1";
// const BASE_URL = 'http://localhost:8000/api/v1';

export const API = {
  // PRODUCT
  GET_ALL_PRODUCTS: `${BASE_URL}/ecoka/product`,
  CREATE_PRODUCT: `${BASE_URL}/ecoka/product/`,
  UPDATE_PRODUCT: `${BASE_URL}/ecoka/product`,
  DELETE_PRODUCT: `${BASE_URL}/ecoka/product`,
  // BLOG
  GET_ALL_BLOGS: `${BASE_URL}/ecoka/blog`,
  GET_BLOG_BY_ID: `${BASE_URL}/ecoka/blog`,
  CREATE_BLOG: `${BASE_URL}/ecoka/blog/`,
  UPDATE_BLOG: `${BASE_URL}/ecoka/blog`,
  DELETE_BLOG: `${BASE_URL}/ecoka/blog`,
  // ESG
  GET_ALL_ESG: `${BASE_URL}/ecoka/esg`,
  UPDATE_ESG: `${BASE_URL}/ecoka/esg`,
  // ENTERPRISE
  GET_ALL_ENTERPRISE: `${BASE_URL}/ecoka/enterprise`,
  UPDATE_ENTERPRISE: `${BASE_URL}/ecoka/enterprise`,
};
