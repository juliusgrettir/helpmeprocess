const SECTORS = [
  {
    id: 'animals',
    section: 'I',
    label: 'Live Animals & Animal Products',
    icon: '🐄',
    chapters: [
      {
        id: 'meat',
        label: 'Meat & Offal',
        chapter: '02',
        products: [
          { hs6: '020110', label: 'Beef carcasses, fresh' },
          { hs6: '020311', label: 'Pig carcasses, fresh' },
          { hs6: '020712', label: 'Chicken, frozen' },
        ]
      },
      {
        id: 'fish',
        label: 'Fish & Seafood',
        chapter: '03',
        products: [
          { hs6: '030613', label: 'Shrimps & prawns, frozen' },
          { hs6: '030490', label: 'Fish fillets, frozen' },
          { hs6: '030374', label: 'Mackerel, frozen' },
        ]
      },
      {
        id: 'dairy',
        label: 'Dairy & Eggs',
        chapter: '04',
        products: [
          { hs6: '040690', label: 'Cheese (other)' },
          { hs6: '040210', label: 'Milk powder' },
          { hs6: '040510', label: 'Butter' },
        ]
      },
    ]
  },
  {
    id: 'vegetables',
    section: 'II',
    label: 'Vegetable Products',
    icon: '🌾',
    chapters: [
      {
        id: 'cereals',
        label: 'Cereals',
        chapter: '10',
        products: [
          { hs6: '100190', label: 'Wheat' },
          { hs6: '100590', label: 'Maize (corn)' },
          { hs6: '100630', label: 'Rice, semi-milled' },
        ]
      },
      {
        id: 'fruit',
        label: 'Fruit & Nuts',
        chapter: '08',
        products: [
          { hs6: '080510', label: 'Oranges, fresh' },
          { hs6: '080211', label: 'Almonds' },
          { hs6: '080132', label: 'Cashew nuts' },
        ]
      },
      {
        id: 'coffee_tea',
        label: 'Coffee, Tea & Spices',
        chapter: '09',
        products: [
          { hs6: '090111', label: 'Coffee, not roasted' },
          { hs6: '090210', label: 'Green tea' },
          { hs6: '090411', label: 'Pepper, dried' },
        ]
      },
    ]
  },
  {
    id: 'food_processed',
    section: 'IV',
    label: 'Processed Food & Beverages',
    icon: '🍫',
    chapters: [
      {
        id: 'cocoa',
        label: 'Cocoa & Chocolate',
        chapter: '18',
        products: [
          { hs6: '180100', label: 'Cocoa beans' },
          { hs6: '180310', label: 'Cocoa paste' },
          { hs6: '180690', label: 'Chocolate products' },
        ]
      },
      {
        id: 'prepared_food',
        label: 'Prepared Food',
        chapter: '19',
        products: [
          { hs6: '190110', label: 'Baby food' },
          { hs6: '190230', label: 'Pasta, dry' },
          { hs6: '190590', label: 'Bread & pastry' },
        ]
      },
      {
        id: 'misc_food',
        label: 'Sauces & Preparations',
        chapter: '21',
        products: [
          { hs6: '210390', label: 'Sauces & condiments' },
          { hs6: '210410', label: 'Soups & broths' },
          { hs6: '210690', label: 'Food preparations (other)' },
        ]
      },
      {
        id: 'beverages',
        label: 'Beverages & Spirits',
        chapter: '22',
        products: [
          { hs6: '220300', label: 'Beer' },
          { hs6: '220421', label: 'Wine' },
          { hs6: '220830', label: 'Whisky' },
        ]
      },
    ]
  },
  {
    id: 'minerals',
    section: 'V',
    label: 'Mineral Products',
    icon: '⛏️',
    chapters: [
      {
        id: 'ores',
        label: 'Ores & Concentrates',
        chapter: '26',
        products: [
          { hs6: '260300', label: 'Copper ores' },
          { hs6: '260400', label: 'Nickel ores' },
          { hs6: '260500', label: 'Cobalt ores' },
          { hs6: '260200', label: 'Manganese ores' },
        ]
      },
      {
        id: 'energy_minerals',
        label: 'Coal & Petroleum',
        chapter: '27',
        products: [
          { hs6: '270900', label: 'Crude petroleum' },
          { hs6: '271019', label: 'Light petroleum oils' },
          { hs6: '271121', label: 'Natural gas' },
        ]
      },
    ]
  },
  {
    id: 'chemicals',
    section: 'VI',
    label: 'Chemicals & Pharmaceuticals',
    icon: '🧪',
    chapters: [
      {
        id: 'inorganic_chem',
        label: 'Inorganic Chemicals',
        chapter: '28',
        products: [
          { hs6: '280461', label: 'Silicon >99.99%' },
          { hs6: '282520', label: 'Lithium hydroxide' },
          { hs6: '284610', label: 'Rare earth compounds' },
        ]
      },
      {
        id: 'pharma',
        label: 'Pharmaceuticals',
        chapter: '30',
        products: [
          { hs6: '300490', label: 'Medicaments (other)' },
          { hs6: '300210', label: 'Vaccines' },
          { hs6: '300420', label: 'Antibiotics' },
        ]
      },
      {
        id: 'specialty_chem',
        label: 'Specialty Chemicals',
        chapter: '38',
        products: [
          { hs6: '380210', label: 'Activated carbon' },
          { hs6: '380893', label: 'Herbicides' },
          { hs6: '380891', label: 'Insecticides' },
        ]
      },
    ]
  },
  {
    id: 'plastics',
    section: 'VII',
    label: 'Plastics & Rubber',
    icon: '🧱',
    chapters: [
      {
        id: 'plastics_raw',
        label: 'Plastics — Raw',
        chapter: '39',
        products: [
          { hs6: '390110', label: 'Polyethylene, low density' },
          { hs6: '390760', label: 'PET' },
          { hs6: '390210', label: 'Polypropylene' },
        ]
      },
      {
        id: 'rubber',
        label: 'Rubber Products',
        chapter: '40',
        products: [
          { hs6: '401110', label: 'Car tyres, new' },
          { hs6: '400122', label: 'Natural rubber' },
        ]
      },
    ]
  },
  {
    id: 'wood',
    section: 'IX',
    label: 'Wood, Paper & Furniture',
    icon: '🪵',
    chapters: [
      {
        id: 'wood_raw',
        label: 'Wood & Timber',
        chapter: '44',
        products: [
          { hs6: '440710', label: 'Coniferous wood, sawn' },
          { hs6: '441214', label: 'Plywood' },
          { hs6: '440130', label: 'Wood pellets' },
        ]
      },
      {
        id: 'furniture',
        label: 'Furniture',
        chapter: '94',
        products: [
          { hs6: '940360', label: 'Wooden furniture' },
          { hs6: '940161', label: 'Upholstered seats' },
          { hs6: '940540', label: 'Lamps & lighting' },
        ]
      },
    ]
  },
  {
    id: 'textiles',
    section: 'XI',
    label: 'Textiles & Clothing',
    icon: '👕',
    chapters: [
      {
        id: 'clothing',
        label: 'Clothing & Apparel',
        chapter: '61',
        products: [
          { hs6: '610910', label: 'T-shirts, cotton' },
          { hs6: '610462', label: 'Trousers (women)' },
          { hs6: '611020', label: 'Jerseys, cotton' },
        ]
      },
      {
        id: 'technical_textiles',
        label: 'Technical Textiles',
        chapter: '59',
        products: [
          { hs6: '591190', label: 'Technical textiles' },
          { hs6: '590310', label: 'PVC coated fabric' },
        ]
      },
    ]
  },
  {
    id: 'metals',
    section: 'XV',
    label: 'Base Metals & Steel',
    icon: '⚙️',
    chapters: [
      {
        id: 'iron_steel',
        label: 'Iron & Steel',
        chapter: '72',
        products: [
          { hs6: '720839', label: 'Flat-rolled steel, hot' },
          { hs6: '720918', label: 'Cold-rolled steel coil' },
          { hs6: '721420', label: 'Rebar' },
        ]
      },
      {
        id: 'aluminium',
        label: 'Aluminium',
        chapter: '76',
        products: [
          { hs6: '760110', label: 'Aluminium, unwrought' },
          { hs6: '760612', label: 'Aluminium plates/sheets' },
        ]
      },
      {
        id: 'copper_metal',
        label: 'Copper',
        chapter: '74',
        products: [
          { hs6: '740311', label: 'Copper cathodes' },
          { hs6: '740819', label: 'Copper wire' },
        ]
      },
    ]
  },
  {
    id: 'machinery',
    section: 'XVI',
    label: 'Machinery & Electronics',
    icon: '🤖',
    chapters: [
      {
        id: 'industrial_machinery',
        label: 'Industrial Machinery',
        chapter: '84',
        products: [
          { hs6: '848790', label: 'Machinery parts' },
          { hs6: '841381', label: 'Pumps' },
          { hs6: '844332', label: '3D printers' },
        ]
      },
      {
        id: 'electronics',
        label: 'Electronics & Computing',
        chapter: '85',
        products: [
          { hs6: '854231', label: 'Processors & controllers' },
          { hs6: '851762', label: 'Network equipment' },
          { hs6: '854140', label: 'Photovoltaic cells' },
        ]
      },
      {
        id: 'ev_energy',
        label: 'EV & Clean Energy',
        chapter: '85',
        products: [
          { hs6: '850760', label: 'Li-ion batteries' },
          { hs6: '854150', label: 'Solar modules' },
          { hs6: '841861', label: 'Heat pumps' },
        ]
      },
    ]
  },
  {
    id: 'transport',
    section: 'XVII',
    label: 'Transport Equipment',
    icon: '🚗',
    chapters: [
      {
        id: 'cars',
        label: 'Passenger Vehicles',
        chapter: '87',
        products: [
          { hs6: '870322', label: 'Cars 1000-1500cc' },
          { hs6: '870380', label: 'Electric vehicles' },
          { hs6: '870421', label: 'Diesel trucks' },
        ]
      },
      {
        id: 'auto_parts',
        label: 'Auto Parts',
        chapter: '87',
        products: [
          { hs6: '870899', label: 'Auto parts (other)' },
          { hs6: '870830', label: 'Brakes' },
          { hs6: '870840', label: 'Gearboxes' },
        ]
      },
      {
        id: 'aerospace',
        label: 'Aerospace',
        chapter: '88',
        products: [
          { hs6: '880240', label: 'Aeroplanes >15000kg' },
          { hs6: '880330', label: 'Aircraft parts' },
        ]
      },
    ]
  },
  {
    id: 'medical',
    section: 'XVIII',
    label: 'Medical & Optical',
    icon: '🔬',
    chapters: [
      {
        id: 'medical_devices',
        label: 'Medical Devices',
        chapter: '90',
        products: [
          { hs6: '901890', label: 'Medical instruments' },
          { hs6: '901812', label: 'Ultrasonic scanning' },
          { hs6: '901831', label: 'Syringes' },
        ]
      },
    ]
  },
  {
    id: 'misc_manufactured',
    section: 'XX',
    label: 'Misc. Manufactured Goods',
    icon: '🪑',
    chapters: [
      {
        id: 'cosmetics',
        label: 'Cosmetics & Perfumes',
        chapter: '33',
        products: [
          { hs6: '330300', label: 'Perfumes' },
          { hs6: '330499', label: 'Cosmetic preparations' },
          { hs6: '330510', label: 'Shampoos' },
        ]
      },
      {
        id: 'pet_food',
        label: 'Pet Food & Animal Feed',
        chapter: '23',
        products: [
          { hs6: '230910', label: 'Dog & cat food' },
          { hs6: '230990', label: 'Animal feed' },
          { hs6: '230120', label: 'Fish flour & pellets' },
        ]
      },
    ]
  },
]

export default SECTORS