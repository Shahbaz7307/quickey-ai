import { decodeVIN } from "./tools/vinDecoder.js";
import { lookupFCC } from "./tools/fccLookup.js";

export const detectAndRunTool = async (message) => {
  // VIN TOOL

  const vinMatch = message.match(/\b[A-HJ-NPR-Z0-9]{17}\b/);

  if (
    vinMatch &&
    (message.toLowerCase().includes("vin") ||
      message.toLowerCase().includes("decode"))
  ) {
    const vinData = await decodeVIN(vinMatch[0]);

    if (vinData) {
      return {
        type: "vin_result",

        data: vinData,
      };
    }
  }

  // FCC TOOL

  const fccMatch = message.match(/\b[A-Z0-9]{8,15}\b/);

  if (fccMatch && message.toLowerCase().includes("fcc")) {
    const fccData = await lookupFCC(fccMatch[0]);

    if (fccData) {
      return {
        type: "fcc_result",

        data: fccData,
      };
    }
  }

  return null;
};
