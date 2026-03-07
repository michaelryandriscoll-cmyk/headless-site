// app/lib/industryPopularityMap.js

const industryPopularityMap = {
  texas: {
    default: ["roofing", "hvac", "construction", "plumbing"],

    cities: {
      houston: ["roofing", "hvac", "construction", "plumbing"],
      dallas: ["construction", "roofing", "hvac"],
      austin: ["construction", "solar", "hvac"],
      "san-antonio": ["roofing", "hvac", "plumbing"],
      "fort-worth": ["construction", "roofing", "hvac"],
    },
  },

  florida: {
    default: ["roofing", "cleaning", "hvac"],

    cities: {
      miami: ["roofing", "cleaning", "hvac"],
      tampa: ["roofing", "hvac"],
      orlando: ["cleaning", "roofing", "hvac"],
    },
  },

  california: {
    default: ["construction", "hvac", "solar"],

    cities: {
      "los-angeles": ["construction", "hvac", "solar"],
      "san-diego": ["solar", "hvac"],
    },
  },
};

export default industryPopularityMap;