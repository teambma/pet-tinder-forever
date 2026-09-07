/**
 * The shelter each pet is waiting at, keyed by its town.
 *
 * Derived from location rather than stored per pet so that two animals in the
 * same town are never listed at different shelters — the sort of drift that a
 * hand-written field per row invites.
 */
export const SHELTERS: Record<string, string> = {
  "Albuquerque, NM": "High Desert Animal Haven",
  "Anchorage, AK": "Northern Lights Animal Rescue",
  "Ann Arbor, MI": "Huron Valley Pet Refuge",
  "Athens, GA": "Classic City Animal Shelter",
  "Austin, TX": "Barton Springs Animal Rescue",
  "Baltimore, MD": "Charm City Animal Shelter",
  "Bangor, ME": "Penobscot Pet Rescue",
  "Berkeley, CA": "Bayside Animal Friends",
  "Boise, ID": "Foothills Animal Shelter",
  "Boston, MA": "Beacon Hill Animal Rescue",
  "Boulder, CO": "Flatirons Animal Sanctuary",
  "Brooklyn, NY": "Brownstone Pet Rescue",
  "Burlington, VT": "Green Mountain Animal Shelter",
  "Charleston, SC": "Lowcountry Animal Rescue",
  "Chicago, IL": "Lakeshore Animal Shelter",
  "Cleveland, OH": "Cuyahoga Pet Rescue",
  "Columbus, OH": "Scioto Valley Animal Shelter",
  "Denver, CO": "Mile High Animal Rescue",
  "Detroit, MI": "Motor City Animal Refuge",
  "Duluth, MN": "Lake Superior Animal Rescue",
  "Flagstaff, AZ": "Ponderosa Pet Rescue",
  "Fort Lauderdale, FL": "Las Olas Animal Rescue",
  "Hartford, CT": "Charter Oak Animal Shelter",
  "Honolulu, HI": "Aloha Animal Sanctuary",
  "Kansas City, MO": "Crossroads Animal Shelter",
  "Lancaster, PA": "Conestoga Animal Refuge",
  "Las Vegas, NV": "Mojave Pet Rescue",
  "Lexington, KY": "Bluegrass Animal Shelter",
  "Los Angeles, CA": "Silver Lake Animal Rescue",
  "Louisville, KY": "Ohio River Animal Shelter",
  "Madison, WI": "Four Lakes Animal Refuge",
  "Memphis, TN": "Beale Street Animal Rescue",
  "Miami, FL": "Biscayne Bay Pet Rescue",
  "Milwaukee, WI": "Cream City Animal Shelter",
  "Minneapolis, MN": "North Star Animal Rescue",
  "Nashville, TN": "Music City Animal Shelter",
  "New Orleans, LA": "Bayou Animal Rescue",
  "Newark, NJ": "Ironbound Animal Shelter",
  "Omaha, NE": "Prairie Pet Rescue",
  "Orlando, FL": "Citrus Grove Animal Shelter",
  "Phoenix, AZ": "Sonoran Animal Rescue",
  "Pittsburgh, PA": "Three Rivers Animal Shelter",
  "Portland, ME": "Casco Bay Animal Rescue",
  "Portland, OR": "Rose City Animal Shelter",
  "Providence, RI": "Narragansett Pet Rescue",
  "Raleigh, NC": "Oak City Animal Shelter",
  "Richmond, VA": "James River Animal Rescue",
  "Sacramento, CA": "Delta Animal Shelter",
  "Salem, MA": "Witch City Animal Rescue",
  "San Diego, CA": "Sunset Cliffs Animal Rescue",
  "San Francisco, CA": "Golden Gate Animal Rescue",
  "San Jose, CA": "Valley Oak Animal Shelter",
  "Santa Fe, NM": "Sangre de Cristo Pet Refuge",
  "Sarasota, FL": "Siesta Key Animal Shelter",
  "Savannah, GA": "Spanish Moss Animal Rescue",
  "Seattle, WA": "Puget Sound Animal Rescue",
  "Spokane, WA": "Inland Northwest Animal Shelter",
  "Tampa, FL": "Bayshore Animal Rescue",
  "Tucson, AZ": "Saguaro Pet Rescue",
  "Tulsa, OK": "Red Dirt Animal Shelter",
};

/** Throws rather than silently seeding a pet with no shelter. */
export function shelterFor(location: string): string {
  const shelter = SHELTERS[location];
  if (!shelter) {
    throw new Error(
      `No shelter defined for "${location}". Add one to shelters.ts.`,
    );
  }
  return shelter;
}
