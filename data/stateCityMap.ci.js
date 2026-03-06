// app/lib/stateCityMap.js
// Central map of states → state-level loan slug → key metro city loan slugs.
// Use this to drive dynamic routes, internal links, and SEO templates.

export const stateCityMap = {
  alabama: {
    stateName: "Alabama",
    stateLoanSlug: "alabama-business-loans",
    cities: [
      { name: "Birmingham", slug: "birmingham" },
      { name: "Montgomery", slug: "montgomery" },
      { name: "Mobile", slug: "mobile" },
      { name: "Huntsville", slug: "huntsville" },
      { name: "Tuscaloosa", slug: "tuscaloosa" }
    ]
  },

  alaska: {
    stateName: "Alaska",
    stateLoanSlug: "alaska-business-loans",
    cities: [
      { name: "Anchorage", slug: "anchorage" },
      { name: "Fairbanks", slug: "fairbanks" },
      { name: "Juneau", slug: "juneau" }
    ]
  },

  arizona: {
    stateName: "Arizona",
    stateLoanSlug: "arizona-business-loans",
    cities: [
      { name: "Phoenix", slug: "phoenix" },
      { name: "Tucson", slug: "tucson" },
      { name: "Mesa", slug: "mesa" },
      { name: "Chandler", slug: "chandler" },
      { name: "Scottsdale", slug: "scottsdale" },
      { name: "Gilbert", slug: "gilbert" },
      { name: "Glendale", slug: "glendale-az" },
      { name: "Tempe", slug: "tempe" }
    ]
  },

  arkansas: {
    stateName: "Arkansas",
    stateLoanSlug: "arkansas-business-loans",
    cities: [
      { name: "Little Rock", slug: "little-rock" },
      { name: "Fort Smith", slug: "fort-smith" },
      { name: "Fayetteville", slug: "fayetteville-ar" },
      { name: "Springdale", slug: "springdale" },
      { name: "Jonesboro", slug: "jonesboro" }
    ]
  },

  california: {
    stateName: "California",
    stateLoanSlug: "california-business-loans",
    cities: [
      { name: "Los Angeles", slug: "los-angeles" },
      { name: "San Diego", slug: "san-diego" },
      { name: "San Jose", slug: "san-jose" },
      { name: "San Francisco", slug: "san-francisco" },
      { name: "Fresno", slug: "fresno" },
      { name: "Sacramento", slug: "sacramento" },
      { name: "Long Beach", slug: "long-beach" },
      { name: "Oakland", slug: "oakland" },
      { name: "Bakersfield", slug: "bakersfield" },
      { name: "Riverside", slug: "riverside" },
      { name: "Stockton", slug: "stockton" },
      { name: "Irvine", slug: "irvine" },
      { name: "Anaheim", slug: "anaheim" },
      { name: "Santa Ana", slug: "santa-ana" },
      { name: "San Bernardino", slug: "san-bernardino" }
    ]
  },

  colorado: {
    stateName: "Colorado",
    stateLoanSlug: "colorado-business-loans",
    cities: [
      { name: "Denver", slug: "denver" },
      { name: "Colorado Springs", slug: "colorado-springs" },
      { name: "Aurora", slug: "aurora-co" },
      { name: "Fort Collins", slug: "fort-collins" },
      { name: "Boulder", slug: "boulder" },
      { name: "Lakewood", slug: "lakewood" }
    ]
  },

  connecticut: {
    stateName: "Connecticut",
    stateLoanSlug: "connecticut-business-loans",
    cities: [
      { name: "Bridgeport", slug: "bridgeport" },
      { name: "New Haven", slug: "new-haven" },
      { name: "Stamford", slug: "stamford" },
      { name: "Hartford", slug: "hartford" },
      { name: "Waterbury", slug: "waterbury" }
    ]
  },

  delaware: {
    stateName: "Delaware",
    stateLoanSlug: "delaware-business-loans",
    cities: [
      { name: "Wilmington", slug: "wilmington" },
      { name: "Dover", slug: "dover" },
      { name: "Newark", slug: "newark-de" }
    ]
  },

  florida: {
    stateName: "Florida",
    stateLoanSlug: "florida-business-loans",
    cities: [
      { name: "Miami", slug: "miami" },
      { name: "Orlando", slug: "orlando" },
      { name: "Tampa", slug: "tampa" },
      { name: "Jacksonville", slug: "jacksonville" },
      { name: "St. Petersburg", slug: "st-petersburg" },
      { name: "Fort Lauderdale", slug: "fort-lauderdale" },
      { name: "West Palm Beach", slug: "west-palm-beach" },
      { name: "Sarasota", slug: "sarasota" },
      { name: "Fort Myers", slug: "fort-myers" }
    ]
  },

  georgia: {
    stateName: "Georgia",
    stateLoanSlug: "georgia-business-loans",
    cities: [
      { name: "Atlanta", slug: "atlanta" },
      { name: "Savannah", slug: "savannah" },
      { name: "Augusta", slug: "augusta" },
      { name: "Columbus", slug: "columbus-ga" },
      { name: "Macon", slug: "macon" },
      { name: "Athens", slug: "athens" }
    ]
  },

  hawaii: {
    stateName: "Hawaii",
    stateLoanSlug: "hawaii-business-loans",
    cities: [
      { name: "Honolulu", slug: "honolulu" },
      { name: "Hilo", slug: "hilo" },
      { name: "Kailua", slug: "kailua" }
    ]
  },

  idaho: {
    stateName: "Idaho",
    stateLoanSlug: "idaho-business-loans",
    cities: [
      { name: "Boise", slug: "boise" },
      { name: "Meridian", slug: "meridian" },
      { name: "Nampa", slug: "nampa" },
      { name: "Idaho Falls", slug: "idaho-falls" }
    ]
  },

  illinois: {
    stateName: "Illinois",
    stateLoanSlug: "illinois-business-loans",
    cities: [
      { name: "Chicago", slug: "chicago" },
      { name: "Aurora", slug: "aurora-il" },
      { name: "Naperville", slug: "naperville" },
      { name: "Joliet", slug: "joliet" },
      { name: "Rockford", slug: "rockford" },
      { name: "Springfield", slug: "springfield-il" }
    ]
  },

  indiana: {
    stateName: "Indiana",
    stateLoanSlug: "indiana-business-loans",
    cities: [
      { name: "Indianapolis", slug: "indianapolis" },
      { name: "Fort Wayne", slug: "fort-wayne" },
      { name: "Evansville", slug: "evansville" },
      { name: "South Bend", slug: "south-bend" },
      { name: "Bloomington", slug: "bloomington-in" }
    ]
  },

  iowa: {
    stateName: "Iowa",
    stateLoanSlug: "iowa-business-loans",
    cities: [
      { name: "Des Moines", slug: "des-moines" },
      { name: "Cedar Rapids", slug: "cedar-rapids" },
      { name: "Davenport", slug: "davenport" },
      { name: "Sioux City", slug: "sioux-city" }
    ]
  },

  kansas: {
    stateName: "Kansas",
    stateLoanSlug: "kansas-business-loans",
    cities: [
      { name: "Wichita", slug: "wichita" },
      { name: "Overland Park", slug: "overland-park" },
      { name: "Kansas City", slug: "kansas-city-ks" },
      { name: "Topeka", slug: "topeka" }
    ]
  },

  kentucky: {
    stateName: "Kentucky",
    stateLoanSlug: "kentucky-business-loans",
    cities: [
      { name: "Louisville", slug: "louisville" },
      { name: "Lexington", slug: "lexington" },
      { name: "Bowling Green", slug: "bowling-green" },
      { name: "Owensboro", slug: "owensboro" }
    ]
  },

  louisiana: {
    stateName: "Louisiana",
    stateLoanSlug: "louisiana-business-loans",
    cities: [
      { name: "New Orleans", slug: "new-orleans" },
      { name: "Baton Rouge", slug: "baton-rouge" },
      { name: "Shreveport", slug: "shreveport" },
      { name: "Lafayette", slug: "lafayette-la" }
    ]
  },

  maine: {
    stateName: "Maine",
    stateLoanSlug: "maine-business-loans",
    cities: [
      { name: "Portland", slug: "portland-me" },
      { name: "Bangor", slug: "bangor" },
      { name: "Augusta", slug: "augusta-me" }
    ]
  },

  maryland: {
    stateName: "Maryland",
    stateLoanSlug: "maryland-business-loans",
    cities: [
      { name: "Baltimore", slug: "baltimore" },
      { name: "Silver Spring", slug: "silver-spring" },
      { name: "Rockville", slug: "rockville" },
      { name: "Annapolis", slug: "annapolis" }
    ]
  },

  massachusetts: {
    stateName: "Massachusetts",
    stateLoanSlug: "massachusetts-business-loans",
    cities: [
      { name: "Boston", slug: "boston" },
      { name: "Worcester", slug: "worcester" },
      { name: "Springfield", slug: "springfield-ma" },
      { name: "Cambridge", slug: "cambridge" },
      { name: "Lowell", slug: "lowell" }
    ]
  },

  michigan: {
    stateName: "Michigan",
    stateLoanSlug: "michigan-business-loans",
    cities: [
      { name: "Detroit", slug: "detroit" },
      { name: "Grand Rapids", slug: "grand-rapids" },
      { name: "Ann Arbor", slug: "ann-arbor" },
      { name: "Lansing", slug: "lansing" },
      { name: "Flint", slug: "flint" }
    ]
  },

  minnesota: {
    stateName: "Minnesota",
    stateLoanSlug: "minnesota-business-loans",
    cities: [
      { name: "Minneapolis", slug: "minneapolis" },
      { name: "Saint Paul", slug: "saint-paul" },
      { name: "Rochester", slug: "rochester-mn" },
      { name: "Duluth", slug: "duluth" }
    ]
  },

  mississippi: {
    stateName: "Mississippi",
    stateLoanSlug: "mississippi-business-loans",
    cities: [
      { name: "Jackson", slug: "jackson-ms" },
      { name: "Gulfport", slug: "gulfport" },
      { name: "Biloxi", slug: "biloxi" },
      { name: "Hattiesburg", slug: "hattiesburg" }
    ]
  },

  missouri: {
    stateName: "Missouri",
    stateLoanSlug: "missouri-business-loans",
    cities: [
      { name: "Kansas City", slug: "kansas-city-mo" },
      { name: "St. Louis", slug: "st-louis" },
      { name: "Springfield", slug: "springfield-mo" },
      { name: "Columbia", slug: "columbia-mo" }
    ]
  },

  montana: {
    stateName: "Montana",
    stateLoanSlug: "montana-business-loans",
    cities: [
      { name: "Billings", slug: "billings" },
      { name: "Missoula", slug: "missoula" },
      { name: "Bozeman", slug: "bozeman" }
    ]
  },

  nebraska: {
    stateName: "Nebraska",
    stateLoanSlug: "nebraska-business-loans",
    cities: [
      { name: "Omaha", slug: "omaha" },
      { name: "Lincoln", slug: "lincoln-ne" },
      { name: "Bellevue", slug: "bellevue" }
    ]
  },

  nevada: {
    stateName: "Nevada",
    stateLoanSlug: "nevada-business-loans",
    cities: [
      { name: "Las Vegas", slug: "las-vegas" },
      { name: "Henderson", slug: "henderson" },
      { name: "Reno", slug: "reno" },
      { name: "North Las Vegas", slug: "north-las-vegas" }
    ]
  },

  "new-hampshire": {
    stateName: "New Hampshire",
    stateLoanSlug: "new-hampshire-business-loans",
    cities: [
      { name: "Manchester", slug: "manchester-nh" },
      { name: "Nashua", slug: "nashua" },
      { name: "Concord", slug: "concord-nh" }
    ]
  },

  "new-jersey": {
    stateName: "New Jersey",
    stateLoanSlug: "new-jersey-business-loans",
    cities: [
      { name: "Newark", slug: "newark-nj" },
      { name: "Jersey City", slug: "jersey-city" },
      { name: "Paterson", slug: "paterson" },
      { name: "Elizabeth", slug: "elizabeth" },
      { name: "Trenton", slug: "trenton" }
    ]
  },

  "new-mexico": {
    stateName: "New Mexico",
    stateLoanSlug: "new-mexico-business-loans",
    cities: [
      { name: "Albuquerque", slug: "albuquerque" },
      { name: "Santa Fe", slug: "santa-fe" },
      { name: "Las Cruces", slug: "las-cruces" }
    ]
  },

  "new-york": {
    stateName: "New York",
    stateLoanSlug: "new-york-business-loans",
    cities: [
      { name: "New York City", slug: "new-york-city" },
      { name: "Buffalo", slug: "buffalo" },
      { name: "Rochester", slug: "rochester-ny" },
      { name: "Yonkers", slug: "yonkers" },
      { name: "Syracuse", slug: "syracuse" },
      { name: "Albany", slug: "albany-ny" }
    ]
  },

  "north-carolina": {
    stateName: "North Carolina",
    stateLoanSlug: "north-carolina-business-loans",
    cities: [
      { name: "Charlotte", slug: "charlotte" },
      { name: "Raleigh", slug: "raleigh" },
      { name: "Greensboro", slug: "greensboro" },
      { name: "Durham", slug: "durham" },
      { name: "Winston-Salem", slug: "winston-salem" },
      { name: "Fayetteville", slug: "fayetteville-nc" }
    ]
  },

  "north-dakota": {
    stateName: "North Dakota",
    stateLoanSlug: "north-dakota-business-loans",
    cities: [
      { name: "Fargo", slug: "fargo" },
      { name: "Bismarck", slug: "bismarck" },
      { name: "Grand Forks", slug: "grand-forks" }
    ]
  },

  ohio: {
    stateName: "Ohio",
    stateLoanSlug: "ohio-business-loans",
    cities: [
      { name: "Columbus", slug: "columbus-oh" },
      { name: "Cleveland", slug: "cleveland" },
      { name: "Cincinnati", slug: "cincinnati" },
      { name: "Toledo", slug: "toledo" },
      { name: "Akron", slug: "akron" },
      { name: "Dayton", slug: "dayton" }
    ]
  },

  oklahoma: {
    stateName: "Oklahoma",
    stateLoanSlug: "oklahoma-business-loans",
    cities: [
      { name: "Oklahoma City", slug: "oklahoma-city" },
      { name: "Tulsa", slug: "tulsa" },
      { name: "Norman", slug: "norman" }
    ]
  },

  oregon: {
    stateName: "Oregon",
    stateLoanSlug: "oregon-business-loans",
    cities: [
      { name: "Portland", slug: "portland-or" },
      { name: "Salem", slug: "salem-or" },
      { name: "Eugene", slug: "eugene" },
      { name: "Gresham", slug: "gresham" }
    ]
  },

  pennsylvania: {
    stateName: "Pennsylvania",
    stateLoanSlug: "pennsylvania-business-loans",
    cities: [
      { name: "Philadelphia", slug: "philadelphia" },
      { name: "Pittsburgh", slug: "pittsburgh" },
      { name: "Allentown", slug: "allentown" },
      { name: "Erie", slug: "erie" },
      { name: "Harrisburg", slug: "harrisburg" }
    ]
  },

  "rhode-island": {
    stateName: "Rhode Island",
    stateLoanSlug: "rhode-island-business-loans",
    cities: [
      { name: "Providence", slug: "providence" },
      { name: "Warwick", slug: "warwick" },
      { name: "Cranston", slug: "cranston" }
    ]
  },

  "south-carolina": {
    stateName: "South Carolina",
    stateLoanSlug: "south-carolina-business-loans",
    cities: [
      { name: "Charleston", slug: "charleston-sc" },
      { name: "Columbia", slug: "columbia-sc" },
      { name: "Greenville", slug: "greenville-sc" },
      { name: "Myrtle Beach", slug: "myrtle-beach" }
    ]
  },

  "south-dakota": {
    stateName: "South Dakota",
    stateLoanSlug: "south-dakota-business-loans",
    cities: [
      { name: "Sioux Falls", slug: "sioux-falls" },
      { name: "Rapid City", slug: "rapid-city" }
    ]
  },

  tennessee: {
    stateName: "Tennessee",
    stateLoanSlug: "tennessee-business-loans",
    cities: [
      { name: "Nashville", slug: "nashville" },
      { name: "Memphis", slug: "memphis" },
      { name: "Knoxville", slug: "knoxville" },
      { name: "Chattanooga", slug: "chattanooga" },
      { name: "Clarksville", slug: "clarksville" }
    ]
  },

  texas: {
    stateName: "Texas",
    stateLoanSlug: "texas-business-loans",
    cities: [
      { name: "Houston", slug: "houston" },
      { name: "Dallas", slug: "dallas" },
      { name: "Austin", slug: "austin" },
      { name: "San Antonio", slug: "san-antonio" },
      { name: "Fort Worth", slug: "fort-worth" },
      { name: "El Paso", slug: "el-paso" },
      { name: "Arlington", slug: "arlington-tx" },
      { name: "Plano", slug: "plano" },
      { name: "Corpus Christi", slug: "corpus-christi" },
      { name: "Lubbock", slug: "lubbock" }
    ]
  },

  utah: {
    stateName: "Utah",
    stateLoanSlug: "utah-business-loans",
    cities: [
      { name: "Salt Lake City", slug: "salt-lake-city" },
      { name: "West Valley City", slug: "west-valley-city" },
      { name: "Provo", slug: "provo" },
      { name: "Ogden", slug: "ogden" }
    ]
  },

  vermont: {
    stateName: "Vermont",
    stateLoanSlug: "vermont-business-loans",
    cities: [
      { name: "Burlington", slug: "burlington-vt" },
      { name: "South Burlington", slug: "south-burlington" },
      { name: "Montpelier", slug: "montpelier" }
    ]
  },

  virginia: {
    stateName: "Virginia",
    stateLoanSlug: "virginia-business-loans",
    cities: [
      { name: "Virginia Beach", slug: "virginia-beach" },
      { name: "Norfolk", slug: "norfolk" },
      { name: "Chesapeake", slug: "chesapeake" },
      { name: "Richmond", slug: "richmond-va" },
      { name: "Arlington", slug: "arlington-va" },
      { name: "Alexandria", slug: "alexandria" }
    ]
  },

  washington: {
    stateName: "Washington",
    stateLoanSlug: "washington-business-loans",
    cities: [
      { name: "Seattle", slug: "seattle" },
      { name: "Spokane", slug: "spokane" },
      { name: "Tacoma", slug: "tacoma" },
      { name: "Vancouver", slug: "vancouver-wa" },
      { name: "Bellevue", slug: "bellevue-wa" }
    ]
  },

  "west-virginia": {
    stateName: "West Virginia",
    stateLoanSlug: "west-virginia-business-loans",
    cities: [
      { name: "Charleston", slug: "charleston-wv" },
      { name: "Huntington", slug: "huntington" },
      { name: "Morgantown", slug: "morgantown" }
    ]
  },

  wisconsin: {
    stateName: "Wisconsin",
    stateLoanSlug: "wisconsin-business-loans",
    cities: [
      { name: "Milwaukee", slug: "milwaukee" },
      { name: "Madison", slug: "madison" },
      { name: "Green Bay", slug: "green-bay" },
      { name: "Kenosha", slug: "kenosha" }
    ]
  },

  wyoming: {
    stateName: "Wyoming",
    stateLoanSlug: "wyoming-business-loans",
    cities: [
      { name: "Cheyenne", slug: "cheyenne" },
      { name: "Casper", slug: "casper" },
      { name: "Laramie", slug: "laramie" }
    ]
  }
};

export default stateCityMap;