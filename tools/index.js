import * as fetchApi from "./fetch_api.js";
import * as postApi from "./post_api.js";
import * as calculate from "./calculate.js";
import * as getCurrentTime from "./get_current_time.js";
import * as getServices from "./get_services.js";
import * as getProducts from "./get_products.js";
import * as getContact from "./get_contact.js";
import * as getFaq from "./get_faq.js";

// tools สำหรับ CLI general chatbot
const generalTools = [fetchApi, postApi, calculate, getCurrentTime];

// tools สำหรับ company chatbot — เฉพาะข้อมูลบริษัทเท่านั้น
const companyTools = [getServices, getProducts, getContact, getFaq];

function buildSet(tools) {
  const definitions = tools.map((t) => t.definition);
  const map = Object.fromEntries(tools.map((t) => [t.definition.function.name, t.execute]));
  const execute = async (name, args) => {
    const fn = map[name];
    if (!fn) return `Unknown tool: ${name}`;
    return fn(args);
  };
  return { definitions, execute };
}

const general = buildSet(generalTools);
const company = buildSet(companyTools);

export const toolDefinitions = general.definitions;
export const executeTool = general.execute;

export const companyToolDefinitions = company.definitions;
export const executeCompanyTool = company.execute;
