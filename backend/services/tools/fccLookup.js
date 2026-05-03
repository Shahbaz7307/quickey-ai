const fccDatabase = [
  {
    fccId: "HYQ12BDM",

    frequency: "315 MHz",

    chip: "4D-67",

    vehicle: "Toyota Corolla 2018",
  },

  {
    fccId: "KR55WK49622",

    frequency: "433 MHz",

    chip: "46 Chip",

    vehicle: "Honda Civic 2020",
  },

  {
    fccId: "CWTWB1U793",

    frequency: "315 MHz",

    chip: "80 Bit",

    vehicle: "Ford F-150 2019",
  },
];

export const lookupFCC = async (fccId) => {
  const result = fccDatabase.find((item) => item.fccId === fccId.toUpperCase());

  return result || null;
};
