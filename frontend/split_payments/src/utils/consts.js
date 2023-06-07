export const API = process.env.REACT_APP_SPLIT_PAYMENTS_API;

if (!API) {
  throw new Error('missing API const')
}