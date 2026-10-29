import { Product } from "@/types/store";

export const PRODUCTS: Product[] = [
  {
    id: "vhw-01",
    lotNumber: "LOT #01",
    itemCode: "VHW-ST-01",
    name: "Brutalist Mil-Spec Studio Stool",
    tagline: "Solid white oak utility stool with exposed through-tenons and carry slot",
    category: "seating",
    priceCents: 48000, // $480.00
    weightLbs: 16.5, // > 10 lbs -> LOCAL PICKUP ONLY
    woodSpecies: "Appalachian White Oak (FAS Grade)",
    finish: "Raw Look Matte Hardwax-Oil (Osmo 3041)",
    dimensions: '14.5"W × 14.5"D × 18.0"H',
    joinery: "Exposed through-mortise & wedged walnut tenons",
    leadTime: "In Stock (3 ready for studio pickup)",
    inStock: true,
    stockCount: 3,
    description:
      "A utilitarian seating piece engineered for heavy studio use. Inspired by industrial workshop jigs and brutalist architecture. Constructed from 1.75\" thick solid white oak with hand-cut wedged tenons that will never loosen. Includes a CNC-relieved centerline carry port.",
    primaryImage:
      "https://images.unsplash.com/photo-1503602642458-232111445657?auto=format&fit=crop&w=1000&q=80",
    secondaryImage:
      "https://images.unsplash.com/photo-1538688525198-9b88f6f53126?auto=format&fit=crop&w=1000&q=80",
    provenance: "Handmade at VH Woodwork Studio — Fort Lauderdale, FL",
  },
  {
    id: "vhw-02",
    lotNumber: "LOT #02",
    itemCode: "VHW-OB-01",
    name: "End-Grain Butcher Board No. 4",
    tagline: "Heavyweight American black walnut & hard maple end-grain block",
    category: "studio-objects",
    priceCents: 19500, // $195.00
    weightLbs: 7.8, // < 10 lbs -> SHIPS NATIONWIDE
    woodSpecies: "Black Walnut & Hard Rock Maple",
    finish: "Deep soak food-grade mineral oil & organic beeswax",
    dimensions: '16.0"L × 12.0"W × 1.75"H',
    joinery: "End-grain brickwork pattern with routed finger grips",
    leadTime: "In Stock (Ready to ship or pickup in 24h)",
    inStock: true,
    stockCount: 8,
    description:
      "Self-healing end-grain construction preserves knife edges while enduring decades of daily culinary prep. Finished with rounded chamfers, deep finger-relief undercut channels, and non-slip silicone feet secured with solid brass screws.",
    primaryImage:
      "https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?auto=format&fit=crop&w=1000&q=80",
    secondaryImage:
      "https://images.unsplash.com/photo-1615873968403-89e068629265?auto=format&fit=crop&w=1000&q=80",
    provenance: "Batch 08 — Fort Lauderdale, FL",
  },
  {
    id: "vhw-03",
    lotNumber: "LOT #03",
    itemCode: "VHW-TB-02",
    name: "Monolithic Slab Coffee Table",
    tagline: "Continuous waterfall joint walnut low table with brass spline keys",
    category: "tables",
    priceCents: 165000, // $1,650.00
    weightLbs: 48.0, // > 10 lbs -> LOCAL PICKUP ONLY
    woodSpecies: "Single-Origin American Black Walnut",
    finish: "Hand-rubbed conversion hardwax satin",
    dimensions: '48.0"L × 24.0"W × 15.5"H',
    joinery: "45° compound miter with four hand-fitted brass butterfly keys",
    leadTime: "1 available in studio / Made to order: 3 weeks",
    inStock: true,
    stockCount: 1,
    description:
      "A sculptured low coffee table celebrating grain continuity across waterfall edges. The substantial 2-inch solid slab exudes quiet power, anchored by structural brass splines on stress points. Heavy, grounded, and built to age into an antique.",
    primaryImage:
      "https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&w=1000&q=80",
    secondaryImage:
      "https://images.unsplash.com/photo-1538688525198-9b88f6f53126?auto=format&fit=crop&w=1000&q=80",
    provenance: "Studio Collection — Fort Lauderdale, FL",
  },
  {
    id: "vhw-04",
    lotNumber: "LOT #04",
    itemCode: "VHW-OB-02",
    name: "Solid Oak Sculptural Bookend Pair",
    tagline: "Geometric faceted counterweight bookends with cork base",
    category: "studio-objects",
    priceCents: 14500, // $145.00
    weightLbs: 6.2, // < 10 lbs -> SHIPS NATIONWIDE
    woodSpecies: "Quarter-sawn White Oak & Raw Brass",
    finish: "Fumed ammonia grey patina with matte natural oil",
    dimensions: '6.0"W × 4.0"D × 7.5"H (each)',
    joinery: "Monolithic timber block with inset counterweight",
    leadTime: "In Stock (Ships in 24-48h)",
    inStock: true,
    stockCount: 5,
    description:
      "Sculpted from heavy offcuts of quarter-sawn white oak beams. Each block undergoes a natural ammonia fuming process that reacts with the wood's inherent tannins, producing a deep weathered charcoal-grey tone. Stamped with studio serial marks.",
    primaryImage:
      "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=1000&q=80",
    secondaryImage:
      "https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?auto=format&fit=crop&w=1000&q=80",
    provenance: "Hand-carved in Fort Lauderdale, FL",
  },
  {
    id: "vhw-05",
    lotNumber: "LOT #05",
    itemCode: "VHW-CH-01",
    name: "Low Slung Studio Lounge Chair",
    tagline: "Ergonomic angled walnut frame with hand-stretched vegetable-tan leather",
    category: "seating",
    priceCents: 125000, // $1,250.00
    weightLbs: 29.5, // > 10 lbs -> LOCAL PICKUP ONLY
    woodSpecies: "Black Walnut & 9oz Wickett & Craig Harness Leather",
    finish: "Zero-VOC Natural Citrus Wood Oil",
    dimensions: '26.0"W × 30.0"D × 28.0"H',
    joinery: "Bridle joints pinned with aircraft-grade aluminum rivets",
    leadTime: "Made to Order (2-3 weeks / Local pickup)",
    inStock: true,
    stockCount: 2,
    description:
      "An aggressive, honest lounge chair balancing heavy timber mass with supple leather suspension. The seat angle is set at 104° for optimal lumbar support. Copper rivets and brass tensioners are exposed, highlighting mechanical honesty.",
    primaryImage:
      "https://images.unsplash.com/photo-1580481077195-73ab013f33d7?auto=format&fit=crop&w=1000&q=80",
    secondaryImage:
      "https://images.unsplash.com/photo-1503602642458-232111445657?auto=format&fit=crop&w=1000&q=80",
    provenance: "Edition of 10 — Fort Lauderdale, FL",
  },
  {
    id: "vhw-06",
    lotNumber: "LOT #06",
    itemCode: "VHW-OB-03",
    name: "Turned Sinker Cypress Catchall",
    tagline: "Lathe-turned deep bowl carved from river-recovered Florida sinker cypress",
    category: "studio-objects",
    priceCents: 12000, // $120.00
    weightLbs: 2.4, // < 10 lbs -> SHIPS NATIONWIDE
    woodSpecies: "Submerged Florida Sinker Cypress (100+ yrs preserved)",
    finish: "Buffed Carnauba Wax & Food-Safe Walnut Oil",
    dimensions: '9.5" Diameter × 3.0"H',
    joinery: "Single piece spindle turning",
    leadTime: "In Stock (Ships nationwide)",
    inStock: true,
    stockCount: 4,
    description:
      "Turned on our heavy studio lathe from logs recovered from North Florida riverbeds. The mineral-rich river mud creates vivid rings of olive, amber, and deep pewter grain. Irregular bark inclusion left intact along the rim.",
    primaryImage:
      "https://images.unsplash.com/photo-1615873968403-89e068629265?auto=format&fit=crop&w=1000&q=80",
    secondaryImage:
      "https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?auto=format&fit=crop&w=1000&q=80",
    provenance: "Turned by hand in Fort Lauderdale, FL",
  },
  {
    id: "vhw-07",
    lotNumber: "LOT #07",
    itemCode: "VHW-BN-01",
    name: "Architectural Slat Bench",
    tagline: "Heavy beam cantilevered bench in white ash with matte steel plinths",
    category: "seating",
    priceCents: 185000, // $1,850.00
    weightLbs: 58.0, // > 10 lbs -> LOCAL PICKUP ONLY
    woodSpecies: "Kiln-Dried American White Ash",
    finish: "Soap finish (traditional Scandinavian lye & natural flakes)",
    dimensions: '72.0"L × 16.0"W × 17.5"H',
    joinery: "Full-lap joinery reinforced with internal stainless all-thread rod",
    leadTime: "1 in studio display / Custom lengths available",
    inStock: true,
    stockCount: 1,
    description:
      "Originally designed for an art collector's gallery in Fort Lauderdale. Built from consecutive solid ash boards running full 6-foot spans. Structural cold-rolled 0.25\" blackened steel base plates create a floating cantilever effect.",
    primaryImage:
      "https://images.unsplash.com/photo-1538688525198-9b88f6f53126?auto=format&fit=crop&w=1000&q=80",
    secondaryImage:
      "https://images.unsplash.com/photo-1503602642458-232111445657?auto=format&fit=crop&w=1000&q=80",
    provenance: "VH Woodwork Studio — Fort Lauderdale, FL",
  },
  {
    id: "vhw-08",
    lotNumber: "LOT #08",
    itemCode: "VHW-ST-02",
    name: "Trestle Work Table & Dining Slab",
    tagline: "Modular knock-down trestle table with hand-hewn wedged key ties",
    category: "tables",
    priceCents: 320000, // $3,200.00
    weightLbs: 94.0, // > 10 lbs -> LOCAL PICKUP ONLY
    woodSpecies: "Old-Growth Hard White Oak",
    finish: "Commercial polyurethane matte low-sheen coating",
    dimensions: '84.0"L × 38.0"W × 30.0"H',
    joinery: "Demountable tusk tenon trestle with solid oak wedge keys",
    leadTime: "Commission order (4 weeks build time)",
    inStock: true,
    stockCount: 2,
    description:
      "Our flagship studio table. Can be completely disassembled and reassembled using only a wooden mallet to tap the tusk tenons into place. Massive 2.25\" thick top plane with breadboard ends that allow seasonal wood movement without warping.",
    primaryImage:
      "https://images.unsplash.com/photo-1577140917170-285929fb55b7?auto=format&fit=crop&w=1000&q=80",
    secondaryImage:
      "https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&w=1000&q=80",
    provenance: "Custom commission — Fort Lauderdale, FL",
  },
  {
    id: "vhw-09",
    lotNumber: "LOT #09",
    itemCode: "VHW-OB-04",
    name: "Magnetic Studio Tool Bar / Knife Rack",
    tagline: "Concealed rare-earth neodymium magnetic strip in rift-sawn oak",
    category: "studio-objects",
    priceCents: 11000, // $110.00
    weightLbs: 3.8, // < 10 lbs -> SHIPS NATIONWIDE
    woodSpecies: "Rift-Sawn White Oak",
    finish: "Natural Danish Oil",
    dimensions: '22.0"L × 2.75"H × 0.85"D',
    joinery: "Concealed rear keyhole mounts & internal countersunk N52 magnets",
    leadTime: "In Stock (Ships in 24h)",
    inStock: true,
    stockCount: 7,
    description:
      "Holds up to 8 heavy chef knives or shop chisels securely without scratching steel blades. The continuous magnetic field allows flexible placement along the full 22-inch length. Includes drywall and masonry mounting hardware.",
    primaryImage:
      "https://images.unsplash.com/photo-1590736969955-71cc94801759?auto=format&fit=crop&w=1000&q=80",
    secondaryImage:
      "https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?auto=format&fit=crop&w=1000&q=80",
    provenance: "Studio Accessory — Fort Lauderdale, FL",
  },
  {
    id: "vhw-10",
    lotNumber: "LOT #10",
    itemCode: "VHW-CR-01",
    name: "Brutalist Fluted Walnut Credenza",
    tagline: "Hand-fluted tambour sliding doors with integrated brass track",
    category: "storage",
    priceCents: 380000, // $3,800.00
    weightLbs: 115.0, // > 10 lbs -> LOCAL PICKUP ONLY
    woodSpecies: "American Black Walnut & Solid Brass Track",
    finish: "Hand-rubbed Tung Oil & Poly combo",
    dimensions: '68.0"W × 19.0"D × 31.0"H',
    joinery: "Concealed miters, dovetailed drawer boxes, hand-routed tambour slats",
    leadTime: "Made to order / White-glove local pickup",
    inStock: true,
    stockCount: 1,
    description:
      "Heirloom side-cabinet featuring hand-shaped triangular flutes across the sliding tambour doors. Inside features adjustable solid walnut shelving and soft-close dovetailed drawers. Built exclusively for local pickup at our Fort Lauderdale workshop.",
    primaryImage:
      "https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=1000&q=80",
    secondaryImage:
      "https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&w=1000&q=80",
    provenance: "Masterpiece Piece — Fort Lauderdale, FL",
  },
];

