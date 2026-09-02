import type { Gender, Size, Species } from "../../../shared/pets";

export const IMAGE_BASE = "https://pets-images.dev-apis.com/pets/";

export interface SeedPet {
  /** Filename under `IMAGE_BASE`; doubles as the pet's stable identity. */
  image: string;
  name: string;
  species: Species;
  breed: string;
  age: string;
  gender: Gender;
  size: Size;
  description: string;
  location: string;
}

const dogs: SeedPet[] = [
  { image: "dog1.jpg", name: "Biscuit", species: "dog", breed: "Golden Retriever", age: "3 years", gender: "male", size: "large", description: "Will trade a paw for a belly rub. Knows 'sit'. Chooses to ignore 'stay'.", location: "Austin, TX" },
  { image: "dog2.jpg", name: "Pepper", species: "dog", breed: "Border Collie", age: "2 years", gender: "female", size: "medium", description: "Herds tennis balls, small children, and the occasional houseplant.", location: "Portland, OR" },
  { image: "dog3.jpg", name: "Waffles", species: "dog", breed: "Beagle", age: "5 years", gender: "male", size: "medium", description: "A nose with a dog attached. Follows every smell to its logical conclusion.", location: "Nashville, TN" },
  { image: "dog4.jpg", name: "Nova", species: "dog", breed: "Australian Shepherd", age: "1 year", gender: "female", size: "medium", description: "Two different coloured eyes, one single-minded devotion to frisbees.", location: "Denver, CO" },
  { image: "dog5.jpg", name: "Tank", species: "dog", breed: "English Bulldog", age: "4 years", gender: "male", size: "medium", description: "Snores like a chainsaw, walks like a bulldozer, loves like a poet.", location: "Chicago, IL" },
  { image: "dog6.jpg", name: "Maple", species: "dog", breed: "Duck Tolling Retriever", age: "2 years", gender: "female", size: "medium", description: "Red as autumn and roughly twice as excitable.", location: "Burlington, VT" },
  { image: "dog7.jpg", name: "Gus", species: "dog", breed: "Basset Hound", age: "6 years", gender: "male", size: "medium", description: "Ears longer than his legs. Considers napping a form of cardio.", location: "Memphis, TN" },
  { image: "dog8.jpg", name: "Luna", species: "dog", breed: "Siberian Husky", age: "3 years", gender: "female", size: "large", description: "Talks back constantly. Has never once conceded an argument.", location: "Anchorage, AK" },
  { image: "dog9.jpg", name: "Pickles", species: "dog", breed: "Dachshund", age: "4 years", gender: "male", size: "small", description: "Long dog. Short patience for squirrels.", location: "Brooklyn, NY" },
  { image: "dog10.jpg", name: "Sadie", species: "dog", breed: "Labrador Retriever", age: "7 years", gender: "female", size: "large", description: "Senior discount on energy, full price on affection.", location: "Raleigh, NC" },
  { image: "dog11.jpg", name: "Mochi", species: "dog", breed: "Shiba Inu", age: "2 years", gender: "female", size: "small", description: "Judges you silently. Loves you loudly, strictly on her own schedule.", location: "Seattle, WA" },
  { image: "dog12.jpg", name: "Bruno", species: "dog", breed: "German Shepherd", age: "5 years", gender: "male", size: "large", description: "Takes his job as your shadow extremely seriously.", location: "Phoenix, AZ" },
  { image: "dog13.jpg", name: "Clementine", species: "dog", breed: "Corgi", age: "1 year", gender: "female", size: "small", description: "Legs: minimal. Personality: enormous.", location: "San Diego, CA" },
  { image: "dog14.jpg", name: "Rufus", species: "dog", breed: "Airedale Terrier", age: "3 years", gender: "male", size: "large", description: "Beard game strong. Opinions about cats, stronger.", location: "Pittsburgh, PA" },
  { image: "dog15.jpg", name: "Daisy", species: "dog", breed: "Cocker Spaniel", age: "4 years", gender: "female", size: "medium", description: "Ears like velvet curtains, heart like a furnace.", location: "Charleston, SC" },
  { image: "dog16.jpg", name: "Otis", species: "dog", breed: "Great Dane", age: "2 years", gender: "male", size: "large", description: "Firmly believes he is a lapdog. Physics disagrees.", location: "Kansas City, MO" },
  { image: "dog17.jpg", name: "Ziggy", species: "dog", breed: "Jack Russell Terrier", age: "3 years", gender: "male", size: "small", description: "Spring-loaded. Batteries never included and never required.", location: "Boise, ID" },
  { image: "dog18.jpg", name: "Hazel", species: "dog", breed: "Weimaraner", age: "5 years", gender: "female", size: "large", description: "Grey as morning fog, clingy as velcro.", location: "Richmond, VA" },
  { image: "dog19.jpg", name: "Chowder", species: "dog", breed: "Chow Chow", age: "4 years", gender: "male", size: "medium", description: "A small cloud with a blue tongue and very firm boundaries.", location: "Milwaukee, WI" },
  { image: "dog20.jpg", name: "Nala", species: "dog", breed: "Rhodesian Ridgeback", age: "3 years", gender: "female", size: "large", description: "Built for the savanna. Settled, happily, for your sofa.", location: "Tucson, AZ" },
  { image: "dog21.jpg", name: "Barnaby", species: "dog", breed: "Old English Sheepdog", age: "6 years", gender: "male", size: "large", description: "Cannot see you through the fringe. Adores you regardless.", location: "Providence, RI" },
  { image: "dog22.jpg", name: "Juniper", species: "dog", breed: "Vizsla", age: "2 years", gender: "female", size: "medium", description: "Copper coat, velcro temperament, zero concept of personal space.", location: "Boulder, CO" },
  { image: "dog23.jpg", name: "Moose", species: "dog", breed: "Bernese Mountain Dog", age: "3 years", gender: "male", size: "large", description: "Gentle giant. Sheds an entire second dog every spring.", location: "Minneapolis, MN" },
  { image: "dog24.jpg", name: "Pip", species: "dog", breed: "Papillon", age: "5 years", gender: "male", size: "small", description: "Ears like butterfly wings, bearing like a four-star general.", location: "New Orleans, LA" },
  { image: "dog25.jpg", name: "Willow", species: "dog", breed: "Whippet", age: "4 years", gender: "female", size: "medium", description: "Forty miles an hour, followed by eighteen hours under a blanket.", location: "Lexington, KY" },
  { image: "dog26.jpg", name: "Bandit", species: "dog", breed: "Boston Terrier", age: "2 years", gender: "male", size: "small", description: "Tuxedo permanently on. Manners entirely optional.", location: "Detroit, MI" },
  { image: "dog27.jpg", name: "Freya", species: "dog", breed: "Norwegian Elkhound", age: "5 years", gender: "female", size: "medium", description: "Silver coat, strong opinions, tail curled like a cinnamon roll.", location: "Duluth, MN" },
  { image: "dog28.jpg", name: "Rocco", species: "dog", breed: "Boxer", age: "3 years", gender: "male", size: "large", description: "Bends into a kidney bean when happy. Is happy more or less always.", location: "Newark, NJ" },
  { image: "dog29.jpg", name: "Poppy", species: "dog", breed: "Cavalier King Charles Spaniel", age: "1 year", gender: "female", size: "small", description: "Small, silky, and entirely convinced she is the guest of honour.", location: "Savannah, GA" },
  { image: "dog30.jpg", name: "Diesel", species: "dog", breed: "Rottweiler", age: "4 years", gender: "male", size: "large", description: "Two hundred pounds of loyalty in an eighty-pound package.", location: "Cleveland, OH" },
  { image: "dog31.jpg", name: "Olive", species: "dog", breed: "Italian Greyhound", age: "6 years", gender: "female", size: "small", description: "Shivers at room temperature. Requires exactly one (1) sweater.", location: "Santa Fe, NM" },
  { image: "dog32.jpg", name: "Duke", species: "dog", breed: "Bloodhound", age: "5 years", gender: "male", size: "large", description: "Has never lost a scent. Has never won a staring contest.", location: "Louisville, KY" },
  { image: "dog33.jpg", name: "Suki", species: "dog", breed: "Akita", age: "3 years", gender: "female", size: "large", description: "Dignified, devoted, and supremely uninterested in strangers.", location: "Honolulu, HI" },
  { image: "dog34.jpg", name: "Cornbread", species: "dog", breed: "Mixed Breed", age: "2 years", gender: "male", size: "medium", description: "Part hound, part mystery, all heart.", location: "Tulsa, OK" },
  { image: "dog35.jpg", name: "Ivy", species: "dog", breed: "Standard Poodle", age: "4 years", gender: "female", size: "medium", description: "Smarter than you. Gracious enough never to bring it up.", location: "Hartford, CT" },
  { image: "dog36.jpg", name: "Bear", species: "dog", breed: "Newfoundland", age: "5 years", gender: "male", size: "large", description: "Swims like an otter. Drools like a broken faucet.", location: "Portland, ME" },
  { image: "dog37.jpg", name: "Nutmeg", species: "dog", breed: "Pembroke Welsh Corgi Mix", age: "1 year", gender: "female", size: "small", description: "Loaf-shaped at rest, startlingly sprint-capable in motion.", location: "Columbus, OH" },
  { image: "dog38.jpg", name: "Scout", species: "dog", breed: "English Pointer", age: "3 years", gender: "male", size: "medium", description: "Freezes mid-step at the sight of a pigeon. Every single time.", location: "Omaha, NE" },
  { image: "dog39.jpg", name: "Marigold", species: "dog", breed: "Golden Retriever Mix", age: "7 years", gender: "female", size: "large", description: "Grey around the muzzle, gold the whole way through.", location: "Spokane, WA" },
];

const cats: SeedPet[] = [
  { image: "cat1.jpg", name: "Miso", species: "cat", breed: "Domestic Shorthair", age: "2 years", gender: "female", size: "small", description: "Sits in every box presented to her, regardless of fit.", location: "San Francisco, CA" },
  { image: "cat2.jpg", name: "Salem", species: "cat", breed: "Bombay", age: "4 years", gender: "male", size: "medium", description: "Pure void. Emerges only for tuna and thunderstorms.", location: "Salem, MA" },
  { image: "cat3.jpg", name: "Marmalade", species: "cat", breed: "Orange Tabby", age: "3 years", gender: "male", size: "medium", description: "Shares one brain cell with the other orange cats. Tuesdays are his turn.", location: "Tampa, FL" },
  { image: "cat4.jpg", name: "Pearl", species: "cat", breed: "Ragdoll", age: "5 years", gender: "female", size: "large", description: "Goes completely limp with joy when picked up. A puddle with whiskers.", location: "Portland, OR" },
  { image: "cat5.jpg", name: "Boots", species: "cat", breed: "Tuxedo", age: "1 year", gender: "male", size: "small", description: "Dressed for a wedding. Behaves like the after-party.", location: "Chicago, IL" },
  { image: "cat6.jpg", name: "Sesame", species: "cat", breed: "Siamese", age: "3 years", gender: "female", size: "medium", description: "Will tell you about her day. At length. At four in the morning.", location: "Berkeley, CA" },
  { image: "cat7.jpg", name: "Winston", species: "cat", breed: "British Shorthair", age: "6 years", gender: "male", size: "medium", description: "Round, plush, and profoundly unbothered by current events.", location: "Boston, MA" },
  { image: "cat8.jpg", name: "Fig", species: "cat", breed: "Russian Blue", age: "2 years", gender: "female", size: "small", description: "Shy for one week, then permanently installed on your shoulder.", location: "Madison, WI" },
  { image: "cat9.jpg", name: "Tofu", species: "cat", breed: "Domestic Longhair", age: "4 years", gender: "male", size: "medium", description: "White, soft, and takes on the flavour of whichever couch he sits on.", location: "Los Angeles, CA" },
  { image: "cat10.jpg", name: "Nori", species: "cat", breed: "Maine Coon", age: "3 years", gender: "female", size: "large", description: "The size of a small dog and roughly twice as fluffy.", location: "Bangor, ME" },
  { image: "cat11.jpg", name: "Peaches", species: "cat", breed: "Calico", age: "5 years", gender: "female", size: "medium", description: "Three colours, three distinct moods, one very specific lap.", location: "Athens, GA" },
  { image: "cat12.jpg", name: "Ollie", species: "cat", breed: "Scottish Fold", age: "2 years", gender: "male", size: "small", description: "Folded ears. Entirely unfolded affection.", location: "Pittsburgh, PA" },
  { image: "cat13.jpg", name: "Juno", species: "cat", breed: "Abyssinian", age: "4 years", gender: "female", size: "medium", description: "Climbs everything. Holds firm views about the top of the fridge.", location: "Flagstaff, AZ" },
  { image: "cat14.jpg", name: "Biscotti", species: "cat", breed: "Domestic Shorthair", age: "8 years", gender: "male", size: "medium", description: "Senior gentleman and sunbeam connoisseur seeking a quiet retirement with you.", location: "Sarasota, FL" },
];

const birds: SeedPet[] = [
  { image: "bird1.jpg", name: "Kiwi", species: "bird", breed: "Green Cheek Conure", age: "2 years", gender: "female", size: "small", description: "Pocket-sized parrot with a startlingly large vocabulary of insults.", location: "Miami, FL" },
  { image: "bird2.jpg", name: "Sunny", species: "bird", breed: "Cockatiel", age: "3 years", gender: "male", size: "small", description: "Whistles the first four notes of everything and learns no further.", location: "Phoenix, AZ" },
  { image: "bird3.jpg", name: "Mango", species: "bird", breed: "Sun Conure", age: "4 years", gender: "female", size: "small", description: "Audible from low earth orbit. Entirely worth it.", location: "Orlando, FL" },
  { image: "bird4.jpg", name: "Basil", species: "bird", breed: "Budgerigar", age: "1 year", gender: "male", size: "small", description: "Blue, chatty, and deeply committed to his own reflection.", location: "Austin, TX" },
  { image: "bird5.jpg", name: "Clover", species: "bird", breed: "Lovebird", age: "2 years", gender: "female", size: "small", description: "Bonds hard and fast. Choose carefully, because she already has.", location: "San Jose, CA" },
  { image: "bird6.jpg", name: "Gizmo", species: "bird", breed: "African Grey", age: "7 years", gender: "male", size: "medium", description: "Sharper than most houseguests. Remembers every word you have said.", location: "Baltimore, MD" },
  { image: "bird7.jpg", name: "Sage", species: "bird", breed: "Parrotlet", age: "3 years", gender: "female", size: "small", description: "Two ounces of undiluted attitude.", location: "Portland, OR" },
  { image: "bird8.jpg", name: "Rio", species: "bird", breed: "Blue and Gold Macaw", age: "9 years", gender: "male", size: "large", description: "Magnificent, theatrical, and in this for the very long haul.", location: "Fort Lauderdale, FL" },
  { image: "bird9.jpg", name: "Bluebell", species: "bird", breed: "Pacific Parrotlet", age: "1 year", gender: "female", size: "small", description: "Tiny, teal, and utterly without fear.", location: "Sacramento, CA" },
];

const rabbits: SeedPet[] = [
  { image: "rabbit1.jpg", name: "Thumper", species: "rabbit", breed: "Holland Lop", age: "2 years", gender: "male", size: "small", description: "Ears at half-mast, zoomies at full throttle.", location: "Boulder, CO" },
  { image: "rabbit2.jpg", name: "Cinnabun", species: "rabbit", breed: "Mini Rex", age: "3 years", gender: "female", size: "small", description: "Velvet coat, cinnamon-roll shape, uncompromising views on kale.", location: "Ann Arbor, MI" },
  { image: "rabbit3.jpg", name: "Hopscotch", species: "rabbit", breed: "Flemish Giant", age: "4 years", gender: "male", size: "large", description: "The size of a beagle with the temperament of a throw pillow.", location: "Lancaster, PA" },
];

const reptiles: SeedPet[] = [
  { image: "reptile1.jpg", name: "Sheldon", species: "reptile", breed: "Bearded Dragon", age: "5 years", gender: "male", size: "medium", description: "Waves hello. Genuinely. Ask him about his heat lamp.", location: "Las Vegas, NV" },
  { image: "reptile2.jpg", name: "Noodle", species: "reptile", breed: "Corn Snake", age: "3 years", gender: "female", size: "medium", description: "A polite noodle who has never bitten anyone in her life.", location: "Albuquerque, NM" },
];

export const SEED_PETS: SeedPet[] = [
  ...dogs,
  ...cats,
  ...birds,
  ...rabbits,
  ...reptiles,
];

/** Expected counts, asserted by the seeder so a typo can't slip through. */
export const EXPECTED_COUNTS: Record<Species, number> = {
  dog: 39,
  cat: 14,
  bird: 9,
  rabbit: 3,
  reptile: 2,
};
