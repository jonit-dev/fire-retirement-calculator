export const usTaxBrackets = [
  { rate: 0.10, threshold: 9950 },
  { rate: 0.12, threshold: 40525 },
  { rate: 0.22, threshold: 86375 },
  { rate: 0.24, threshold: 164925 },
  { rate: 0.32, threshold: 209425 },
  { rate: 0.35, threshold: 523600 },
  { rate: 0.37, threshold: Infinity },
];

export const canadaFederalTaxBrackets = [
  { rate: 0.15, threshold: 49020 },
  { rate: 0.205, threshold: 98040 },
  { rate: 0.26, threshold: 151978 },
  { rate: 0.29, threshold: 216511 },
  { rate: 0.33, threshold: Infinity },
];

export const canadaProvincialTaxBrackets = {
  BC: [
    { rate: 0.0506, threshold: 43070 },
    { rate: 0.077, threshold: 86141 },
    { rate: 0.105, threshold: 98901 },
    { rate: 0.1229, threshold: 120094 },
    { rate: 0.147, threshold: 162832 },
    { rate: 0.168, threshold: Infinity },
  ],
  AB: [
    { rate: 0.10, threshold: 131220 },
    { rate: 0.12, threshold: 157464 },
    { rate: 0.13, threshold: 209952 },
    { rate: 0.14, threshold: 314928 },
    { rate: 0.15, threshold: Infinity },
  ],
  SK: [
    { rate: 0.105, threshold: 46773 },
    { rate: 0.125, threshold: 133638 },
    { rate: 0.145, threshold: Infinity },
  ],
  MB: [
    { rate: 0.108, threshold: 33723 },
    { rate: 0.1275, threshold: 72885 },
    { rate: 0.174, threshold: Infinity },
  ],
  ON: [
    { rate: 0.0505, threshold: 49231 },
    { rate: 0.0915, threshold: 98463 },
    { rate: 0.1116, threshold: 150000 },
    { rate: 0.1216, threshold: 220000 },
    { rate: 0.1316, threshold: Infinity },
  ],
  QC: [
    { rate: 0.15, threshold: 49275 },
    { rate: 0.20, threshold: 98540 },
    { rate: 0.24, threshold: 119910 },
    { rate: 0.2575, threshold: Infinity },
  ],
  NB: [
    { rate: 0.0968, threshold: 44715 },
    { rate: 0.1482, threshold: 89431 },
    { rate: 0.1652, threshold: 145955 },
    { rate: 0.1784, threshold: 166280 },
    { rate: 0.203, threshold: Infinity },
  ],
  NS: [
    { rate: 0.0879, threshold: 29590 },
    { rate: 0.1495, threshold: 59180 },
    { rate: 0.1667, threshold: 93000 },
    { rate: 0.175, threshold: 150000 },
    { rate: 0.21, threshold: Infinity },
  ],
  PE: [
    { rate: 0.098, threshold: 31984 },
    { rate: 0.138, threshold: 63969 },
    { rate: 0.167, threshold: Infinity },
  ],
  NL: [
    { rate: 0.087, threshold: 39147 },
    { rate: 0.145, threshold: 78294 },
    { rate: 0.158, threshold: 139780 },
    { rate: 0.173, threshold: 195693 },
    { rate: 0.183, threshold: 250000 },
    { rate: 0.198, threshold: Infinity },
  ],
  YT: [
    { rate: 0.064, threshold: 49020 },
    { rate: 0.09, threshold: 98040 },
    { rate: 0.109, threshold: 151978 },
    { rate: 0.128, threshold: 216511 },
    { rate: 0.15, threshold: 500000 },
    { rate: 0.1704, threshold: Infinity },
  ],
  NT: [
    { rate: 0.059, threshold: 45285 },
    { rate: 0.086, threshold: 90570 },
    { rate: 0.122, threshold: 147826 },
    { rate: 0.1405, threshold: Infinity },
  ],
  NU: [
    { rate: 0.04, threshold: 49220 },
    { rate: 0.07, threshold: 98440 },
    { rate: 0.09, threshold: 160597 },
    { rate: 0.115, threshold: Infinity },
  ],
};
