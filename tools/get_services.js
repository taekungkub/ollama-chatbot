import { companyData } from "../data/company.js";

export const definition = {
  type: "function",
  function: {
    name: "get_services",
    description: "ดึงรายการบริการทั้งหมดของบริษัท Volt Corp",
    parameters: {
      type: "object",
      properties: {},
      required: [],
    },
  },
};

export async function execute(_args) {
  return JSON.stringify(companyData.services, null, 2);
}
