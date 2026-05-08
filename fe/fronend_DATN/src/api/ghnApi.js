import axios from "axios";

const TOKEN = "YOUR_GHN_TOKEN";

const ghn = axios.create({
  baseURL: "https://online-gateway.ghn.vn/shiip/public-api",
  headers: {
    Token: TOKEN,
  },
});

export const getProvinces = () =>
  ghn.get("/master-data/province");

export const getDistricts = (provinceId) =>
  ghn.get("/master-data/district", {
    params: { province_id: provinceId },
  });

export const getWards = (districtId) =>
  ghn.get("/master-data/ward", {
    params: { district_id: districtId },
  });