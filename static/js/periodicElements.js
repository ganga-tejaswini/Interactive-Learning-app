const periodicElements = [
  {
    "symbol": "H",
    "name": "Hydrogen",
    "number": 1,
    "group": 1,
    "period": 1
  },
  {
    "symbol": "He",
    "name": "Helium",
    "number": 2,
    "group": 18,
    "period": 1
  },
  {
    "symbol": "Li",
    "name": "Lithium",
    "number": 3,
    "group": 1,
    "period": 2
  },
  {
    "symbol": "Be",
    "name": "Beryllium",
    "number": 4,
    "group": 2,
    "period": 2
  },
  {
    "symbol": "B",
    "name": "Boron",
    "number": 5,
    "group": 13,
    "period": 2
  },
  {
    "symbol": "C",
    "name": "Carbon",
    "number": 6,
    "group": 14,
    "period": 2
  },
  {
    "symbol": "N",
    "name": "Nitrogen",
    "number": 7,
    "group": 15,
    "period": 2
  },
  {
    "symbol": "O",
    "name": "Oxygen",
    "number": 8,
    "group": 16,
    "period": 2
  },
  {
    "symbol": "F",
    "name": "Fluorine",
    "number": 9,
    "group": 17,
    "period": 2
  },
  {
    "symbol": "Ne",
    "name": "Neon",
    "number": 10,
    "group": 18,
    "period": 2
  },
  {
    "symbol": "Na",
    "name": "Sodium",
    "number": 11,
    "group": 1,
    "period": 3
  },
  {
    "symbol": "Mg",
    "name": "Magnesium",
    "number": 12,
    "group": 2,
    "period": 3
  },
  {
    "symbol": "Al",
    "name": "Aluminium",
    "number": 13,
    "group": 13,
    "period": 3
  },
  {
    "symbol": "Si",
    "name": "Silicon",
    "number": 14,
    "group": 14,
    "period": 3
  },
  {
    "symbol": "P",
    "name": "Phosphorus",
    "number": 15,
    "group": 15,
    "period": 3
  },
  {
    "symbol": "S",
    "name": "Sulfur",
    "number": 16,
    "group": 16,
    "period": 3
  },
  {
    "symbol": "Cl",
    "name": "Chlorine",
    "number": 17,
    "group": 17,
    "period": 3
  },
  {
    "symbol": "Ar",
    "name": "Argon",
    "number": 18,
    "group": 18,
    "period": 3
  },
  {
    "symbol": "K",
    "name": "Potassium",
    "number": 19,
    "group": 1,
    "period": 4
  },
  {
    "symbol": "Ca",
    "name": "Calcium",
    "number": 20,
    "group": 2,
    "period": 4
  },
  {
    "symbol": "Sc",
    "name": "Scandium",
    "number": 21,
    "group": 3,
    "period": 4
  },
  {
    "symbol": "Ti",
    "name": "Titanium",
    "number": 22,
    "group": 4,
    "period": 4
  },
  {
    "symbol": "V",
    "name": "Vanadium",
    "number": 23,
    "group": 5,
    "period": 4
  },
  {
    "symbol": "Cr",
    "name": "Chromium",
    "number": 24,
    "group": 6,
    "period": 4
  },
  {
    "symbol": "Mn",
    "name": "Manganese",
    "number": 25,
    "group": 7,
    "period": 4
  },
  {
    "symbol": "Fe",
    "name": "Iron",
    "number": 26,
    "group": 8,
    "period": 4
  },
  {
    "symbol": "Co",
    "name": "Cobalt",
    "number": 27,
    "group": 9,
    "period": 4
  },
  {
    "symbol": "Ni",
    "name": "Nickel",
    "number": 28,
    "group": 10,
    "period": 4
  },
  {
    "symbol": "Cu",
    "name": "Copper",
    "number": 29,
    "group": 11,
    "period": 4
  },
  {
    "symbol": "Zn",
    "name": "Zinc",
    "number": 30,
    "group": 12,
    "period": 4
  },
  {
    "symbol": "Ga",
    "name": "Gallium",
    "number": 31,
    "group": 13,
    "period": 4
  },
  {
    "symbol": "Ge",
    "name": "Germanium",
    "number": 32,
    "group": 14,
    "period": 4
  },
  {
    "symbol": "As",
    "name": "Arsenic",
    "number": 33,
    "group": 15,
    "period": 4
  },
  {
    "symbol": "Se",
    "name": "Selenium",
    "number": 34,
    "group": 16,
    "period": 4
  },
  {
    "symbol": "Br",
    "name": "Bromine",
    "number": 35,
    "group": 17,
    "period": 4
  },
  {
    "symbol": "Kr",
    "name": "Krypton",
    "number": 36,
    "group": 18,
    "period": 4
  },
  {
    "symbol": "Rb",
    "name": "Rubidium",
    "number": 37,
    "group": 1,
    "period": 5
  },
  {
    "symbol": "Sr",
    "name": "Strontium",
    "number": 38,
    "group": 2,
    "period": 5
  },
  {
    "symbol": "Y",
    "name": "Yttrium",
    "number": 39,
    "group": 3,
    "period": 5
  },
  {
    "symbol": "Zr",
    "name": "Zirconium",
    "number": 40,
    "group": 4,
    "period": 5
  },
  {
    "symbol": "Nb",
    "name": "Niobium",
    "number": 41,
    "group": 5,
    "period": 5
  },
  {
    "symbol": "Mo",
    "name": "Molybdenum",
    "number": 42,
    "group": 6,
    "period": 5
  },
  {
    "symbol": "Tc",
    "name": "Technetium",
    "number": 43,
    "group": 7,
    "period": 5
  },
  {
    "symbol": "Ru",
    "name": "Ruthenium",
    "number": 44,
    "group": 8,
    "period": 5
  },
  {
    "symbol": "Rh",
    "name": "Rhodium",
    "number": 45,
    "group": 9,
    "period": 5
  },
  {
    "symbol": "Pd",
    "name": "Palladium",
    "number": 46,
    "group": 10,
    "period": 5
  },
  {
    "symbol": "Ag",
    "name": "Silver",
    "number": 47,
    "group": 11,
    "period": 5
  },
  {
    "symbol": "Cd",
    "name": "Cadmium",
    "number": 48,
    "group": 12,
    "period": 5
  },
  {
    "symbol": "In",
    "name": "Indium",
    "number": 49,
    "group": 13,
    "period": 5
  },
  {
    "symbol": "Sn",
    "name": "Tin",
    "number": 50,
    "group": 14,
    "period": 5
  },
  {
    "symbol": "Sb",
    "name": "Antimony",
    "number": 51,
    "group": 15,
    "period": 5
  },
  {
    "symbol": "Te",
    "name": "Tellurium",
    "number": 52,
    "group": 16,
    "period": 5
  },
  {
    "symbol": "I",
    "name": "Iodine",
    "number": 53,
    "group": 17,
    "period": 5
  },
  {
    "symbol": "Xe",
    "name": "Xenon",
    "number": 54,
    "group": 18,
    "period": 5
  },
  {
    "symbol": "Cs",
    "name": "Cesium",
    "number": 55,
    "group": 1,
    "period": 6
  },
  {
    "symbol": "Ba",
    "name": "Barium",
    "number": 56,
    "group": 2,
    "period": 6
  },
  {
    "symbol": "La",
    "name": "Lanthanum",
    "number": 57,
    "group": 3,
    "period": 8
  },
  {
    "symbol": "Ce",
    "name": "Cerium",
    "number": 58,
    "group": 4,
    "period": 8
  },
  {
    "symbol": "Pr",
    "name": "Praseodymium",
    "number": 59,
    "group": 5,
    "period": 8
  },
  {
    "symbol": "Nd",
    "name": "Neodymium",
    "number": 60,
    "group": 6,
    "period": 8
  },
  {
    "symbol": "Pm",
    "name": "Promethium",
    "number": 61,
    "group": 7,
    "period": 8
  },
  {
    "symbol": "Sm",
    "name": "Samarium",
    "number": 62,
    "group": 8,
    "period": 8
  },
  {
    "symbol": "Eu",
    "name": "Europium",
    "number": 63,
    "group": 9,
    "period": 8
  },
  {
    "symbol": "Gd",
    "name": "Gadolinium",
    "number": 64,
    "group": 10,
    "period": 8
  },
  {
    "symbol": "Tb",
    "name": "Terbium",
    "number": 65,
    "group": 11,
    "period": 8
  },
  {
    "symbol": "Dy",
    "name": "Dysprosium",
    "number": 66,
    "group": 12,
    "period": 8
  },
  {
    "symbol": "Ho",
    "name": "Holmium",
    "number": 67,
    "group": 13,
    "period": 8
  },
  {
    "symbol": "Er",
    "name": "Erbium",
    "number": 68,
    "group": 14,
    "period": 8
  },
  {
    "symbol": "Tm",
    "name": "Thulium",
    "number": 69,
    "group": 15,
    "period": 8
  },
  {
    "symbol": "Yb",
    "name": "Ytterbium",
    "number": 70,
    "group": 16,
    "period": 8
  },
  {
    "symbol": "Lu",
    "name": "Lutetium",
    "number": 71,
    "group": 17,
    "period": 8
  },
  {
    "symbol": "Hf",
    "name": "Hafnium",
    "number": 72,
    "group": 4,
    "period": 6
  },
  {
    "symbol": "Ta",
    "name": "Tantalum",
    "number": 73,
    "group": 5,
    "period": 6
  },
  {
    "symbol": "W",
    "name": "Tungsten",
    "number": 74,
    "group": 6,
    "period": 6
  },
  {
    "symbol": "Re",
    "name": "Rhenium",
    "number": 75,
    "group": 7,
    "period": 6
  },
  {
    "symbol": "Os",
    "name": "Osmium",
    "number": 76,
    "group": 8,
    "period": 6
  },
  {
    "symbol": "Ir",
    "name": "Iridium",
    "number": 77,
    "group": 9,
    "period": 6
  },
  {
    "symbol": "Pt",
    "name": "Platinum",
    "number": 78,
    "group": 10,
    "period": 6
  },
  {
    "symbol": "Au",
    "name": "Gold",
    "number": 79,
    "group": 11,
    "period": 6
  },
  {
    "symbol": "Hg",
    "name": "Mercury",
    "number": 80,
    "group": 12,
    "period": 6
  },
  {
    "symbol": "Tl",
    "name": "Thallium",
    "number": 81,
    "group": 13,
    "period": 6
  },
  {
    "symbol": "Pb",
    "name": "Lead",
    "number": 82,
    "group": 14,
    "period": 6
  },
  {
    "symbol": "Bi",
    "name": "Bismuth",
    "number": 83,
    "group": 15,
    "period": 6
  },
  {
    "symbol": "Po",
    "name": "Polonium",
    "number": 84,
    "group": 16,
    "period": 6
  },
  {
    "symbol": "At",
    "name": "Astatine",
    "number": 85,
    "group": 17,
    "period": 6
  },
  {
    "symbol": "Rn",
    "name": "Radon",
    "number": 86,
    "group": 18,
    "period": 6
  },
  {
    "symbol": "Fr",
    "name": "Francium",
    "number": 87,
    "group": 1,
    "period": 7
  },
  {
    "symbol": "Ra",
    "name": "Radium",
    "number": 88,
    "group": 2,
    "period": 7
  },
  {
    "symbol": "Ac",
    "name": "Actinium",
    "number": 89,
    "group": 3,
    "period": 9
  },
  {
    "symbol": "Th",
    "name": "Thorium",
    "number": 90,
    "group": 4,
    "period": 9
  },
  {
    "symbol": "Pa",
    "name": "Protactinium",
    "number": 91,
    "group": 5,
    "period": 9
  },
  {
    "symbol": "U",
    "name": "Uranium",
    "number": 92,
    "group": 6,
    "period": 9
  },
  {
    "symbol": "Np",
    "name": "Neptunium",
    "number": 93,
    "group": 7,
    "period": 9
  },
  {
    "symbol": "Pu",
    "name": "Plutonium",
    "number": 94,
    "group": 8,
    "period": 9
  },
  {
    "symbol": "Am",
    "name": "Americium",
    "number": 95,
    "group": 9,
    "period": 9
  },
  {
    "symbol": "Cm",
    "name": "Curium",
    "number": 96,
    "group": 10,
    "period": 9
  },
  {
    "symbol": "Bk",
    "name": "Berkelium",
    "number": 97,
    "group": 11,
    "period": 9
  },
  {
    "symbol": "Cf",
    "name": "Californium",
    "number": 98,
    "group": 12,
    "period": 9
  },
  {
    "symbol": "Es",
    "name": "Einsteinium",
    "number": 99,
    "group": 13,
    "period": 9
  },
  {
    "symbol": "Fm",
    "name": "Fermium",
    "number": 100,
    "group": 14,
    "period": 9
  },
  {
    "symbol": "Md",
    "name": "Mendelevium",
    "number": 101,
    "group": 15,
    "period": 9
  },
  {
    "symbol": "No",
    "name": "Nobelium",
    "number": 102,
    "group": 16,
    "period": 9
  },
  {
    "symbol": "Lr",
    "name": "Lawrencium",
    "number": 103,
    "group": 17,
    "period": 9
  },
  {
    "symbol": "Rf",
    "name": "Rutherfordium",
    "number": 104,
    "group": 4,
    "period": 7
  },
  {
    "symbol": "Db",
    "name": "Dubnium",
    "number": 105,
    "group": 5,
    "period": 7
  },
  {
    "symbol": "Sg",
    "name": "Seaborgium",
    "number": 106,
    "group": 6,
    "period": 7
  },
  {
    "symbol": "Bh",
    "name": "Bohrium",
    "number": 107,
    "group": 7,
    "period": 7
  },
  {
    "symbol": "Hs",
    "name": "Hassium",
    "number": 108,
    "group": 8,
    "period": 7
  },
  {
    "symbol": "Mt",
    "name": "Meitnerium",
    "number": 109,
    "group": 9,
    "period": 7
  },
  {
    "symbol": "Ds",
    "name": "Darmstadtium",
    "number": 110,
    "group": 10,
    "period": 7
  },
  {
    "symbol": "Rg",
    "name": "Roentgenium",
    "number": 111,
    "group": 11,
    "period": 7
  },
  {
    "symbol": "Cn",
    "name": "Copernicium",
    "number": 112,
    "group": 12,
    "period": 7
  },
  {
    "symbol": "Nh",
    "name": "Nihonium",
    "number": 113,
    "group": 13,
    "period": 7
  },
  {
    "symbol": "Fl",
    "name": "Flerovium",
    "number": 114,
    "group": 14,
    "period": 7
  },
  {
    "symbol": "Mc",
    "name": "Moscovium",
    "number": 115,
    "group": 15,
    "period": 7
  },
  {
    "symbol": "Lv",
    "name": "Livermorium",
    "number": 116,
    "group": 16,
    "period": 7
  },
  {
    "symbol": "Ts",
    "name": "Tennessine",
    "number": 117,
    "group": 17,
    "period": 7
  },
  {
    "symbol": "Og",
    "name": "Oganesson",
    "number": 118,
    "group": 18,
    "period": 7
  }
];
