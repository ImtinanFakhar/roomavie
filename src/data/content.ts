import type { ImageMetadata } from 'astro';

const photos = import.meta.glob<{ default: ImageMetadata }>('../assets/images/*.png', { eager: true });
export function photo(name: string): ImageMetadata {
  return photos[`../assets/images/${name}.png`].default;
}

export const categories = [
  { slug: 'decor-ideas', name: 'Decor Ideas', description: 'Thoughtful details, a little creativity, and a home that feels like you.', image: 'gallery-wall' },
  { slug: 'small-spaces', name: 'Small Spaces', description: 'Beautiful ideas for making the most of every little corner.', image: 'apartment' },
  { slug: 'living-room', name: 'Living Room', description: 'Comfortable, collected spaces for your everyday moments.', image: 'living-room' },
  { slug: 'bedroom', name: 'Bedroom', description: 'Soft layers and simple touches for a restful retreat.', image: 'cozy-bedroom' },
  { slug: 'seasonal', name: 'Seasonal', description: 'Small, lovely ways to welcome a new season into your home.', image: 'seasonal' },
];

export const featuredCategories = [
  { label: 'Small Apartment Ideas', category: 'small-spaces', image: 'apartment', alt: 'Sunlit small dining room with a wooden table and leafy branches' },
  { label: 'Cozy Living Rooms', category: 'living-room', image: 'lounge', alt: 'Cream sofa layered with terracotta cushions and natural textures' },
  { label: 'Bedroom Styling', category: 'bedroom', image: 'bedroom', alt: 'Neutral bedroom with soft white bedding and warm bedside lighting' },
  { label: 'Entryway Ideas', category: 'small-spaces', image: 'entryway', alt: 'Wooden entryway console styled beneath an arched mirror' },
  { label: 'Seasonal Decor', category: 'seasonal', image: 'seasonal', alt: 'White pumpkin and glowing candles beside autumn branches' },
];

export interface Article {
  slug: string;
  content?: string;
  tags?: string[];
  title: string;
  category: string;
  description: string;
  image: string;
  alt: string;
  intro: string;
  sections: { title: string; text: string }[];
}

export const articles: Article[] = [
  {
    slug: 'how-to-make-a-small-home-feel-less-cluttered',
    content: 'how-to-make-a-small-home-feel-less-cluttered',
    title: 'How to Make a Small Home Feel Less Cluttered Without Getting Rid of Everything',
    category: 'small-spaces',
    description: 'Learn how to make a small home feel less cluttered without getting rid of everything using clearer surfaces, closed storage, better furniture placement and simple organization systems.',
    image: 'visual-clutter-reset',
    alt: 'A small living area with a mostly clear wooden console, a lamp, a small tray and a ceramic vase',
    intro: 'A small home can feel cluttered even when it is clean. Clutter is not only about how many things you own. It is also about how many things your eyes have to process at once.',
    tags: ['small home organization', 'visual clutter', 'small spaces', 'home organization', 'clutter solutions', 'small home ideas'],
    sections: [],
  },
  {
    slug: 'small-living-room-ideas', title: '12 Small Living Room Ideas That Feel Instantly Calmer', category: 'living-room',
    description: 'Simple, stylish ideas to create a more peaceful and inviting living room, no matter the size.', image: 'living-room', alt: 'Airy small living room with a linen sectional, greenery, and a round wooden coffee table',
    intro: 'A calmer living room begins with giving everyday life a little breathing room. You don’t need more square footage or an entirely new sofa. A few thoughtful choices can make the space you already have feel lighter, softer, and easier to enjoy.',
    sections: [
      { title: '1. Start with a clear path', text: 'Keep the route between your doorway and seating easy to walk through. Move a side table, tuck a basket under a console, or turn a chair slightly. Let the room work for the way you actually move.' },
      { title: '2. Choose a quiet color palette', text: 'Warm white, oatmeal, and soft taupe sit beautifully together. Repeat two or three main colors throughout the room, allowing natural wood and greenery to add depth.' },
      { title: '3. Let the curtains breathe', text: 'Hang curtains above the window frame and let them fall close to the floor. A light, simple fabric softens the window without blocking the daylight that makes a small room feel open.' },
      { title: '4. Bring in a round coffee table', text: 'Curved edges make it easier to move around a compact seating area. Measure your walkway before you shop, and choose a table that leaves comfortable space in front of the sofa.' },
      { title: '5. Edit your cushions', text: 'A few cushions in different textures feel more considered than a sofa crowded with them. Pair linen with a subtle pattern, and leave enough room to sit comfortably.' },
      { title: '6. Give everyday things a home', text: 'Use a basket for throws and a tray for remotes. Storage doesn’t need to disappear completely; it just needs to feel intentional and be easy to use.' },
      { title: '7. Layer your lighting', text: 'A reading lamp, a soft table lamp, and natural daylight create more atmosphere than one bright ceiling light. Place lamps where you spend time, and keep cords out of walking routes.' },
      { title: '8. Try one generous rug', text: 'A rug that reaches under the front legs of your seating helps the room feel connected. Choose a low pile if doors open over it, and use an appropriate rug pad to keep it in place.' },
      { title: '9. Make space on the walls', text: 'A little blank wall can be restful. Group artwork where it has a relationship to furniture, instead of filling every gap with another small frame.' },
      { title: '10. Add something living', text: 'One leafy plant or a simple arrangement of branches brings movement into a neutral room. Choose a spot and a plant suited to the light you actually have.' },
      { title: '11. Choose furniture with a little lift', text: 'Visible legs let you see more floor and can make substantial furniture feel lighter. You can achieve a similar effect by leaving space around the pieces you already own.' },
      { title: '12. Leave one surface mostly clear', text: 'Try keeping a corner of your coffee table or console free. A small moment of empty space gives your eye a place to rest and makes your favorite objects stand out.' },
    ],
  },
  {
    slug: 'renter-friendly-wall-decor', title: 'Renter-Friendly Wall Decor Ideas', category: 'decor-ideas',
    description: 'Beautiful, renter-approved ways to add personality to your walls — no damage required.', image: 'gallery-wall', alt: 'Neutral living room gallery wall with botanical prints in warm wooden frames',
    intro: 'A rental can still feel personal. Start with pieces you love and methods that suit your walls, your lease, and your budget. There are plenty of ways to create a collected look without a major project.',
    sections: [
      { title: 'Lean into the layered look', text: 'Rest framed prints on a console, dresser, or existing shelf. Mix two sizes and let one overlap the other slightly. Keep larger frames stable and away from places where they could be knocked over.' },
      { title: 'Plan a small gallery before hanging', text: 'Lay your frames on the floor first. Choose a shared thread, such as pale timber frames or botanical subjects, and keep the spacing consistent. Photograph the arrangement so you can refer to it later.' },
      { title: 'Match the hanging method to the wall', text: 'Removable strips can work for lightweight frames, but they are not right for every paint finish or surface. Follow the manufacturer’s weight limits and removal instructions, test discreetly, and check your lease before hanging.' },
      { title: 'Use what is already there', text: 'An existing picture rail, shelf, or peg rail is a lovely starting point. Change the artwork rather than the hardware, and rotate a few favorites when you want a fresh feeling.' },
      { title: 'Let texture do some of the work', text: 'A small woven piece or lightweight textile can add warmth beside flat artwork. Keep the arrangement simple, with a little breathing room between objects, so each piece feels deliberate.' },
    ],
  },
  {
    slug: 'small-home-entryway-decor', title: 'Entryway Decor Ideas for Small Homes', category: 'small-spaces',
    description: 'Make a lasting first impression with these stylish and space-saving entryway ideas.', image: 'small-entryway', alt: 'Slim oak entryway table, a round mirror, and a vase of green branches',
    intro: 'Even a narrow hallway can offer a welcoming pause between the outside world and home. The best small entryways are practical first, with just enough beauty to make coming home feel good.',
    sections: [
      { title: 'Choose a shallow landing spot', text: 'A narrow console or an existing shelf can hold keys without stealing your walkway. Measure the space with the door fully open before adding furniture.' },
      { title: 'Give the essentials a place', text: 'A small dish for keys, a hook for the bag you use most, and a basket for shoes help keep clutter from moving farther into the house. Make the system simple enough for everyone to use.' },
      { title: 'Add a mirror thoughtfully', text: 'Place a mirror where it reflects light or a pleasing view. Match the fixing to your wall and the mirror’s weight. In a rental, a tabletop mirror can give a similar effect without a new wall fixing.' },
      { title: 'Keep the styling light', text: 'Try a vase with a few branches and one useful bowl. Vary their heights, and leave some open surface for the things you bring home each day.' },
      { title: 'Finish with a warm welcome', text: 'A washable runner and a gentle lamp can soften a hard hallway. Keep the rug clear of the door swing and use a nonslip backing where needed.' },
    ],
  },
  {
    slug: 'cozy-bedroom-decor', title: 'Cozy Bedroom Decor Touches You’ll Love', category: 'bedroom',
    description: 'Small changes that make a big difference in creating a cozy, relaxing bedroom.', image: 'cozy-bedroom', alt: 'Warm neutral bedroom with layered cream linen and two softly glowing bedside lamps',
    intro: 'A bedroom feels cozy when it is easy to settle into. Focus on the things you touch and see every evening: soft bedding, gentle light, and a bedside surface with room for a book.',
    sections: [
      { title: 'Build your bedding in soft layers', text: 'Start with comfortable sheets, then add a duvet and a lighter throw that you can move as the temperature changes. Cream, stone, and oatmeal create a relaxed mix without matching perfectly.' },
      { title: 'Lower the light in the evening', text: 'Bedside lamps bring light closer to where you need it. A warm bulb and a shade that diffuses the light help create a softer atmosphere than a bare overhead fixture.' },
      { title: 'Give your feet a soft landing', text: 'A rug beside the bed can make the morning feel a little gentler. Choose a size that fits the room and check that it won’t interfere with drawers or doors.' },
      { title: 'Keep the bedside edit simple', text: 'Leave space for water, a book, and the things you actually use. A small bowl catches jewelry, while a drawer or basket keeps chargers and less beautiful necessities close by.' },
      { title: 'Add one personal detail', text: 'A favorite print, a small ceramic vase, or a treasured photograph makes the room feel yours. You don’t need to finish every corner at once; let the space grow slowly.' },
    ],
  },
  {
    slug: 'black-accent-wall-ideas', title: 'Black Accent Wall Ideas That Don’t Feel Heavy', category: 'living-room',
    description: 'Bold, modern and surprisingly versatile — here’s how to make a black accent wall work.', image: 'black-wall', alt: 'Charcoal living room wall behind a dark sofa with a light rug and warm wooden table',
    intro: 'A dark wall can make a room feel grounded and intimate. The trick is to give it a little balance: softer textures, warm materials, and light where you need it.',
    sections: [
      { title: 'Test the shade in your own light', text: 'Paint large sample cards and move them around the room over a few days. A charcoal with a brown undertone feels different from a blue-black, especially after sunset.' },
      { title: 'Choose a wall with a purpose', text: 'The wall behind a sofa or a favorite piece of artwork is a natural place to start. Think about what you want the dark color to frame, rather than choosing a wall at random.' },
      { title: 'Balance it with warm wood', text: 'An oak coffee table, a timber frame, or a woven basket keeps the palette from feeling cold. Repeat the warmth in a few small places so it feels connected.' },
      { title: 'Bring in lighter textiles', text: 'An ivory rug, linen curtains, and a softly patterned cushion add contrast. Allow dark furniture to blend into the wall while lighter pieces give the room depth.' },
      { title: 'Layer light around the room', text: 'A floor lamp near the sofa and a table lamp on the other side help the room feel welcoming. Avoid relying on one bright overhead light to do all the work.' },
    ],
  },
  {
    slug: 'simple-fall-apartment-decor', title: 'Simple Fall Apartment Decor for a Cozy Home', category: 'seasonal',
    description: 'Easy, affordable ways to bring cozy fall style into your apartment.', image: 'fall-decor', alt: 'Autumn branches in a cream vase beside a pumpkin, stacked books, and candles',
    intro: 'Welcoming fall can be as simple as changing a few textures and bringing something seasonal to the table. Keep your everyday palette and add little moments of warmth.',
    sections: [
      { title: 'Start with a single seasonal arrangement', text: 'A vase of autumn branches creates height and color without needing a lot of accessories. Use responsibly gathered branches, dried stems, or reusable faux foliage.' },
      { title: 'Swap a texture, not a whole room', text: 'A knit throw or a rust-colored cushion cover can shift the feeling of your sofa. Store the summer covers neatly and bring them back when the weather changes.' },
      { title: 'Use a quiet pumpkin palette', text: 'One or two pumpkins in cream or muted orange can sit alongside your usual decor. Put them on a protective tray and check fresh pumpkins regularly so they don’t mark your furniture.' },
      { title: 'Make evenings feel softer', text: 'Switch on a table lamp before dusk and bring a throw within reach. If you enjoy candles, keep them away from dried foliage and never leave a flame unattended; flameless candles are another lovely option.' },
      { title: 'Shop your own shelves', text: 'Bring out wooden bowls, copper-toned pieces, and warm ceramics you already have. A seasonal refresh can be more about rearranging favorites than buying something new.' },
    ],
  },
  {
    slug: 'open-shelving-decor', title: 'Open Shelving Decor Ideas', category: 'decor-ideas', description: 'Make everyday essentials part of a beautifully balanced shelf.', image: 'shelving', alt: 'Open kitchen shelves with neutral pottery and everyday dishes',
    intro: 'Open shelves work best when useful objects and beautiful details share the space. Begin with the pieces you reach for most and let the styling grow around them.',
    sections: [
      { title: 'Keep the everyday pieces within reach', text: 'Place the plates and bowls you use regularly on the lower shelf. Group like items together and keep heavy objects on shelves designed to hold their weight.' },
      { title: 'Vary the shapes', text: 'Balance a stack of shallow bowls with a taller pitcher or vase. Let the shapes create interest, keeping the color palette simple.' },
      { title: 'Leave room between groups', text: 'Small gaps make a shelf easier to read and easier to clean. Resist the urge to fill every inch, and change the arrangement as you discover what works day to day.' },
      { title: 'Add one soft detail', text: 'A small plant suited to the light or a framed recipe can break up the hard edges of crockery. Keep greenery away from heat and food preparation areas.' },
    ],
  },
  {
    slug: 'apartment-decor-on-a-budget', title: 'Apartment Decor on a Budget', category: 'small-spaces', description: 'A thoughtful home refresh with the things you already love.', image: 'budget-decor', alt: 'Budget-friendly wooden console styled with a leafy vase and ceramics',
    intro: 'The most satisfying refresh often starts with what is already at home. A little editing and a few useful changes can do more than a basket of new accessories.',
    sections: [
      { title: 'Rearrange before you shop', text: 'Move a lamp, exchange cushions between rooms, or bring a favorite vase out of a cupboard. Live with the new arrangement for a few days before deciding what is missing.' },
      { title: 'Make a short wish list', text: 'Name the actual problem: not enough reading light, nowhere for shoes, or a bare wall above the sofa. Buy for that need and set a comfortable budget before browsing.' },
      { title: 'Look for useful secondhand pieces', text: 'A sturdy side table or simple frame can bring character for less. Check dimensions, condition, and whether repairs would cost more than you want to spend.' },
      { title: 'Refresh the small details', text: 'Wash cushion covers, clear a surface, and rearrange books. Clean, cared-for pieces help a room feel considered even when very little has changed.' },
    ],
  },
  {
    slug: 'cozy-corner-ideas', title: 'Cozy Corner Ideas', category: 'living-room', description: 'Turn a quiet corner into your favorite place to pause.', image: 'cozy-corner', alt: 'Cozy armchair with a warm brown throw and a leafy plant',
    intro: 'A cozy corner doesn’t need much space. A comfortable seat, somewhere to put your tea, and light for a few pages of a book are a lovely beginning.',
    sections: [
      { title: 'Start with the seat', text: 'Use a chair you enjoy sitting in, and angle it toward the room or a pleasing view. Keep the corner connected to the space without blocking a walkway.' },
      { title: 'Put a surface within reach', text: 'A small side table gives a mug and book a safe home. Choose a height that works with the arm of your chair and leaves room for your legs.' },
      { title: 'Add light and a soft layer', text: 'A reading lamp and a throw make the corner useful through the evening. Keep the lamp positioned so it lights the page without shining directly into your eyes.' },
      { title: 'Keep it personal', text: 'A favorite book, a cushion you love, and perhaps one plant are enough. Let the corner be a place to use, rather than another surface to maintain.' },
    ],
  },
  {
    slug: 'neutral-bedroom-ideas', title: 'Neutral Bedroom Ideas', category: 'bedroom', description: 'Create a restful room with a palette of warm, natural neutrals.', image: 'neutral-bedroom', alt: 'Restful neutral bedroom with ivory bedding and a taupe headboard',
    intro: 'Neutral doesn’t have to mean flat. Soft differences in color, texture, and shape give a bedroom depth while keeping the feeling calm.',
    sections: [
      { title: 'Choose a warm starting point', text: 'Begin with one color from a piece you already own, such as a rug or headboard. Add neighboring shades rather than trying to match every item exactly.' },
      { title: 'Mix the textures', text: 'Smooth cotton sheets, a linen cushion, and a lightly textured throw catch the light in different ways. Choose fabrics for comfort first, then let the mix add interest.' },
      { title: 'Ground the room with wood', text: 'A wooden bedside table or simple timber frame gives pale colors a little warmth. Repeating the material on both sides of the room helps the palette feel settled.' },
      { title: 'Let the room breathe', text: 'Keep a few surfaces open and choose artwork with soft contrast. Quiet spaces between objects are part of the design.' },
    ],
  },
  {
    slug: 'fall-decor-inspiration', title: 'Fall Decor Inspiration', category: 'seasonal', description: 'Natural textures and autumn color for the slower days ahead.', image: 'fall-inspiration', alt: 'Tall vase of golden autumn leaves on a warmly styled wooden table',
    intro: 'Take your cue from the season outside: muted leaves, warm wood, and soft evening light. A few natural touches can make home feel ready for slower days.',
    sections: [
      { title: 'Bring in a muted autumn color', text: 'Try ochre, cinnamon, or a soft clay tone in one small detail. Let it sit alongside the neutrals already in your room so the change feels easy.' },
      { title: 'Style a simple gathering place', text: 'Use a wooden bowl, a favorite vase, and a folded linen cloth on your dining table. Keep the center low enough for conversation and easy to move for everyday meals.' },
      { title: 'Repeat natural textures', text: 'Woven baskets, ceramics, and warm timber are useful all year and especially lovely in fall. Gather a few pieces from other rooms before buying more.' },
      { title: 'Enjoy a slower refresh', text: 'Change one small corner each weekend instead of decorating everything at once. Notice which touches make you happy and give those a permanent place.' },
    ],
  },
];

export const categoryName = (slug: string) => categories.find((category) => category.slug === slug)?.name || 'Decor Ideas';
export const articleUrl = (slug: string) => {
  const article = articles.find((item) => item.slug === slug);
  if (!article) throw new Error(`Unknown article: ${slug}`);
  return `/${article.category}/${article.slug}/`;
};
