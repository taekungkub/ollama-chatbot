export const definition = {
  type: "function",
  function: {
    name: "calculate",
    description: "คำนวณสูตรคณิตศาสตร์ เช่น (2+3)*4, Math.sqrt(16)",
    parameters: {
      type: "object",
      properties: {
        expression: { type: "string", description: "สูตรคณิตศาสตร์ที่ต้องการคำนวณ" },
      },
      required: ["expression"],
    },
  },
};

export async function execute(args) {
  try {
    const result = new Function(`"use strict"; return (${args.expression})`)();
    return String(result);
  } catch (e) {
    return `Error: ${e.message}`;
  }
}
