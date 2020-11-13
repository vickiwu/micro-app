import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:3000",
});

instance.interceptors.response.use(reply => reply.data);

/**
 * 快速登录
 */
export const ApiLoginQuickly = () => {
  return instance.get("/member", );
};
