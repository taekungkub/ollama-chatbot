import { companyData } from "../data/company.js";

export const definition = {
  type: "function",
  function: {
    name: "get_faq",
    description: "ดึงคำถามที่พบบ่อย (FAQ) ของบริษัท Volt Corp",
    parameters: {
      type: "object",
      properties: {},
      required: [],
    },
  },
};

export async function execute(_args) {
  return JSON.stringify(companyData.faq, null, 2);
}
