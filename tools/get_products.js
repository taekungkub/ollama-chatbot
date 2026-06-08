import { companyData } from "../data/company.js";

export const definition = {
  type: "function",
  function: {
    name: "get_products",
    description: "ดึงรายการสินค้าที่บริษัท Volt Corp จำหน่าย",
    parameters: {
      type: "object",
      properties: {},
      required: [],
    },
  },
};

export async function execute(_args) {
  return JSON.stringify(companyData.products, null, 2);
}
