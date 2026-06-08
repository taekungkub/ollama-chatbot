import { companyData } from "../data/company.js";

export const definition = {
  type: "function",
  function: {
    name: "get_contact",
    description: "ดึงข้อมูลติดต่อและที่อยู่บริษัท Volt Corp",
    parameters: {
      type: "object",
      properties: {},
      required: [],
    },
  },
};

export async function execute(_args) {
  const { name, nameTh, address, phone, email, line, hours } = companyData;
  return JSON.stringify({ name, nameTh, address, phone, email, line, hours }, null, 2);
}
