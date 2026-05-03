export const decodeVIN = async (vin) => {
  try {
    const response = await fetch(
      `https://vpic.nhtsa.dot.gov/api/vehicles/DecodeVin/${vin}?format=json`,
    );

    const data = await response.json();

    const results = data.Results;

    const vehicleData = {
      make: results.find((r) => r.Variable === "Make")?.Value,

      model: results.find((r) => r.Variable === "Model")?.Value,

      year: results.find((r) => r.Variable === "Model Year")?.Value,

      engine: results.find((r) => r.Variable === "Engine Model")?.Value,
    };

    return vehicleData;
  } catch (error) {
    console.log(error);

    return null;
  }
};
