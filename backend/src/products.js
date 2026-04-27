const baseCatalog = [
  { category: 'Clothing', segment: 'Dresses', title: 'Satin Wrap Midi Dress', brand: 'Riva Lane', query: 'satin,dress,fashion', price: 1899, mrp: 3299, fit: 'Regular fit with a soft tie waist', fabric: 'Poly satin', sizes: ['XS', 'S', 'M', 'L', 'XL'], colors: [['Rosewood','#9f5063'], ['Champagne','#d7b98f'], ['Black','#151515']] },
  { category: 'Clothing', segment: 'Tops', title: 'Ribbed Square Neck Top', brand: 'Studio Minori', query: 'ribbed,top,fashion', price: 799, mrp: 1299, fit: 'Slim stretch fit', fabric: 'Cotton rib knit', sizes: ['XS','S','M','L','XL'], colors: [['Ivory','#f6eee3'], ['Sage','#9aaa85'], ['Cocoa','#7b5744']] },
  { category: 'Clothing', segment: 'Jeans', title: 'High Rise Straight Jeans', brand: 'Westfold Denim', query: 'denim,jeans,fashion', price: 1599, mrp: 2799, fit: 'Straight leg, high rise', fabric: 'Cotton denim with light stretch', sizes: ['26','28','30','32','34'], colors: [['Light Blue','#9db6d5'], ['Indigo','#29456a'], ['Washed Black','#303034']] },
  { category: 'Clothing', segment: 'Kurtas', title: 'Cotton Printed Kurta', brand: 'Aarna Edit', query: 'kurta,cotton,fashion', price: 1099, mrp: 1999, fit: 'Comfort fit', fabric: 'Breathable cotton', sizes: ['XS','S','M','L','XL','XXL'], colors: [['Marigold','#d59632'], ['Teal','#17736e'], ['Pink','#d86f93']] },
  { category: 'Clothing', segment: 'Jackets', title: 'Cropped Denim Jacket', brand: 'The Daily Rack', query: 'denim,jacket,fashion', price: 2199, mrp: 3499, fit: 'Cropped relaxed fit', fabric: 'Heavy cotton denim', sizes: ['XS','S','M','L','XL'], colors: [['Blue','#668cbd'], ['Charcoal','#45474d'], ['Ecru','#e7dfd0']] },
  { category: 'Clothing', segment: 'Skirts', title: 'Pleated A-Line Skirt', brand: 'Mellow Mode', query: 'pleated,skirt,fashion', price: 999, mrp: 1699, fit: 'A-line, mid waist', fabric: 'Crepe blend', sizes: ['XS','S','M','L','XL'], colors: [['Navy','#1b2845'], ['Berry','#8c3151'], ['Beige','#c8ad8b']] },
  { category: 'Clothing', segment: 'Co-ords', title: 'Linen Blend Co-ord Set', brand: 'Nomad Theory', query: 'linen,set,fashion', price: 2399, mrp: 3999, fit: 'Easy relaxed fit', fabric: 'Linen-viscose blend', sizes: ['XS','S','M','L','XL'], colors: [['Oat','#d8c5a6'], ['Olive','#77815a'], ['Rust','#a85432']] },
  { category: 'Clothing', segment: 'Ethnic Sets', title: 'Embroidered Straight Suit Set', brand: 'Katha Studio', query: 'embroidered,suit,women,fashion', price: 2999, mrp: 5299, fit: 'Straight kurta with tapered pants', fabric: 'Viscose silk blend', sizes: ['S','M','L','XL','XXL'], colors: [['Wine','#6f213d'], ['Mint','#b2d5c4'], ['Navy','#17284d']] },
  { category: 'Shoes', segment: 'Sneakers', title: 'Cloudwalk White Sneakers', brand: 'Stride House', query: 'white,sneakers,shoes', price: 1799, mrp: 2999, fit: 'Cushioned everyday fit', fabric: 'Vegan leather upper', sizes: ['UK 3','UK 4','UK 5','UK 6','UK 7','UK 8'], colors: [['White','#f6f6f6'], ['Lilac','#b7aad8'], ['Tan','#b98e6f']] },
  { category: 'Shoes', segment: 'Heels', title: 'Block Heel Sandals', brand: 'Solace Steps', query: 'block,heel,sandals', price: 1499, mrp: 2399, fit: 'Secure ankle strap', fabric: 'Faux suede upper', sizes: ['UK 3','UK 4','UK 5','UK 6','UK 7'], colors: [['Nude','#c99778'], ['Black','#1d1d1d'], ['Wine','#7d2339']] },
  { category: 'Shoes', segment: 'Flats', title: 'Braided Slip-On Flats', brand: 'Casa Sole', query: 'braided,flats,shoes', price: 999, mrp: 1699, fit: 'Open toe, easy slip-on', fabric: 'Textured vegan leather', sizes: ['UK 3','UK 4','UK 5','UK 6','UK 7','UK 8'], colors: [['Tan','#b58259'], ['Cream','#eadfce'], ['Gold','#d8b45a']] },
  { category: 'Shoes', segment: 'Boots', title: 'Chelsea Ankle Boots', brand: 'North & Nine', query: 'chelsea,boots,fashion', price: 2699, mrp: 4499, fit: 'Ankle height with elastic side panels', fabric: 'Faux leather', sizes: ['UK 4','UK 5','UK 6','UK 7','UK 8'], colors: [['Black','#111'], ['Brown','#6b432d'], ['Taupe','#928374']] },
  { category: 'Shoes', segment: 'Sports Shoes', title: 'Flex Run Training Shoes', brand: 'PaceLab', query: 'running,shoes,women', price: 2299, mrp: 3799, fit: 'Lightweight cushioned fit', fabric: 'Mesh upper', sizes: ['UK 3','UK 4','UK 5','UK 6','UK 7','UK 8'], colors: [['Grey','#a3a8ac'], ['Pink','#f2a2ba'], ['Blue','#7ba6d8']] },
  { category: 'Bags', segment: 'Totes', title: 'Soft Structure Tote Bag', brand: 'Luma Carry', query: 'tote,bag,fashion', price: 1799, mrp: 2999, fit: 'Fits laptop and daily essentials', fabric: 'Pebbled vegan leather', sizes: ['One Size'], colors: [['Mocha','#8b6048'], ['Black','#181818'], ['Cream','#eee2d1']] },
  { category: 'Bags', segment: 'Sling Bags', title: 'Quilted Chain Sling Bag', brand: 'Velvet Room', query: 'quilted,sling,bag', price: 1399, mrp: 2299, fit: 'Compact crossbody size', fabric: 'Quilted faux leather', sizes: ['One Size'], colors: [['Blush','#d99ab0'], ['Black','#121212'], ['Ivory','#ede5d7']] },
  { category: 'Bags', segment: 'Backpacks', title: 'City Mini Backpack', brand: 'Route 17', query: 'mini,backpack,fashion', price: 1699, mrp: 2699, fit: 'Small everyday backpack', fabric: 'Water-resistant nylon', sizes: ['One Size'], colors: [['Olive','#6d7854'], ['Black','#1a1a1a'], ['Stone','#b8afa0']] },
  { category: 'Bags', segment: 'Wallets', title: 'Zip Around Wallet', brand: 'Mira Goods', query: 'wallet,fashion,accessory', price: 699, mrp: 1199, fit: 'Slim zip wallet', fabric: 'Vegan leather', sizes: ['One Size'], colors: [['Tan','#c18c61'], ['Plum','#6e4058'], ['Black','#111']] },
  { category: 'Accessories', segment: 'Jewellery', title: 'Gold-Tone Hoop Earrings', brand: 'Aurelia Box', query: 'hoop,earrings,jewelry', price: 499, mrp: 899, fit: 'Medium hoops with secure clasp', fabric: 'Gold-tone alloy', sizes: ['One Size'], colors: [['Gold','#d7b54a'], ['Silver','#cfd2d3'], ['Rose Gold','#d49b8f']] },
  { category: 'Accessories', segment: 'Watches', title: 'Minimal Round Dial Watch', brand: 'Arlo Time', query: 'women,watch,accessory', price: 1599, mrp: 2799, fit: 'Adjustable strap', fabric: 'Stainless steel case', sizes: ['One Size'], colors: [['Tan','#b77d55'], ['Black','#171717'], ['Silver','#bfc3c7']] },
  { category: 'Accessories', segment: 'Belts', title: 'Slim Classic Belt', brand: 'Oak & Thread', query: 'belt,fashion,accessory', price: 599, mrp: 999, fit: 'Adjustable buckle', fabric: 'Vegan leather', sizes: ['S','M','L'], colors: [['Black','#111'], ['Brown','#6d432c'], ['Burgundy','#6f2635']] },
  { category: 'Accessories', segment: 'Scarves', title: 'Printed Satin Scarf', brand: 'Rue Bloom', query: 'satin,scarf,fashion', price: 699, mrp: 1199, fit: 'Square scarf', fabric: 'Soft satin weave', sizes: ['One Size'], colors: [['Blue Print','#4c7aa4'], ['Pink Print','#cc7890'], ['Olive Print','#7b8458']] },
  { category: 'Beauty', segment: 'Makeup', title: 'Everyday Lip Tint', brand: 'Glow Parcel', query: 'lip,tint,beauty', price: 449, mrp: 699, fit: 'Lightweight daily tint', fabric: 'Cream finish', sizes: ['5 ml'], colors: [['Rose','#c75b73'], ['Coral','#de7357'], ['Berry','#8f2b50']] },
  { category: 'Beauty', segment: 'Skincare', title: 'Dew Drop Face Serum', brand: 'Skin Pantry', query: 'face,serum,beauty', price: 799, mrp: 1299, fit: 'Lightweight daily serum', fabric: 'Niacinamide blend', sizes: ['30 ml'], colors: [['Clear','#e9f3f4'], ['Amber','#d69a58'], ['Pink','#efc4ce']] },
  { category: 'Beauty', segment: 'Hair', title: 'Satin Heatless Curl Set', brand: 'Soft Rituals', query: 'hair,accessory,beauty', price: 599, mrp: 999, fit: 'Comfortable overnight styling set', fabric: 'Satin fabric', sizes: ['One Size'], colors: [['Pink','#f0a6bd'], ['Lilac','#b7a4d8'], ['Champagne','#dcc58f']] },
  { category: 'Clothing', segment: 'Trousers', title: 'Wide Leg Tailored Trousers', brand: 'Nine to Noon', query: 'wide,leg,trousers,fashion', price: 1499, mrp: 2499, fit: 'High waist, wide leg', fabric: 'Poly-viscose blend', sizes: ['26','28','30','32','34'], colors: [['Charcoal','#45484e'], ['Beige','#c9b18d'], ['Navy','#1a2945']] },
  { category: 'Clothing', segment: 'Shirts', title: 'Oversized Cotton Shirt', brand: 'Paper Moon', query: 'oversized,shirt,fashion', price: 1199, mrp: 1999, fit: 'Oversized relaxed fit', fabric: 'Crisp cotton poplin', sizes: ['XS','S','M','L','XL'], colors: [['White','#f8f8f4'], ['Sky','#9fc6e6'], ['Stripe','#d9dad8']] },
  { category: 'Clothing', segment: 'Sweaters', title: 'Soft Knit Cardigan', brand: 'Quiet Label', query: 'knit,cardigan,fashion', price: 1899, mrp: 2999, fit: 'Relaxed button-front fit', fabric: 'Acrylic wool blend', sizes: ['XS','S','M','L','XL'], colors: [['Cream','#eee4d2'], ['Dusty Pink','#d79aae'], ['Grey','#a5a5a5']] },
  { category: 'Shoes', segment: 'Loafers', title: 'Polished Penny Loafers', brand: 'Elo Step', query: 'loafers,shoes,fashion', price: 1999, mrp: 3299, fit: 'Structured slip-on fit', fabric: 'Faux patent leather', sizes: ['UK 3','UK 4','UK 5','UK 6','UK 7','UK 8'], colors: [['Black','#151515'], ['Oxblood','#6a2024'], ['Tan','#a7754d']] },
  { category: 'Bags', segment: 'Clutches', title: 'Textured Evening Clutch', brand: 'After Eight', query: 'evening,clutch,bag', price: 1199, mrp: 1999, fit: 'Slim party clutch', fabric: 'Textured satin', sizes: ['One Size'], colors: [['Gold','#d4a84e'], ['Black','#111'], ['Silver','#c7c9cb']] },
  { category: 'Accessories', segment: 'Sunglasses', title: 'Oval Tinted Sunglasses', brand: 'Daylight Supply', query: 'sunglasses,fashion,accessory', price: 899, mrp: 1499, fit: 'UV-protected oval frame', fabric: 'Acetate frame', sizes: ['One Size'], colors: [['Tortoise','#7a5132'], ['Black','#111'], ['Clear','#e7dfd2']] },
  { category: 'Beauty', segment: 'Fragrance', title: 'Vanilla Musk Body Mist', brand: 'Bloom Bath', query: 'perfume,bottle,beauty', price: 699, mrp: 999, fit: 'Everyday soft fragrance', fabric: 'Mist spray', sizes: ['100 ml'], colors: [['Vanilla','#e8cf9d'], ['Blush','#e6a7b9'], ['Amber','#c98a55']] },
  { category: 'Clothing', segment: 'Sarees', title: 'Organza Floral Saree', brand: 'Neelkamal', query: 'saree,organza,fashion', price: 3299, mrp: 5999, fit: 'Lightweight drape', fabric: 'Organza blend', sizes: ['Free Size'], colors: [['Lilac','#b9a5d7'], ['Mint','#b7d9c6'], ['Peach','#f0ad8d']] },
  { category: 'Clothing', segment: 'Shorts', title: 'Linen Paperbag Shorts', brand: 'Sundown Club', query: 'linen,shorts,fashion', price: 899, mrp: 1499, fit: 'High waist relaxed fit', fabric: 'Linen blend', sizes: ['XS','S','M','L','XL'], colors: [['Sand','#d3bd9b'], ['Olive','#758057'], ['White','#f6f0e7']] },
  { category: 'Shoes', segment: 'Mules', title: 'Pointed Toe Mules', brand: 'Maison Sole', query: 'mules,heels,shoes', price: 1699, mrp: 2799, fit: 'Slip-on pointed toe', fabric: 'Faux suede', sizes: ['UK 3','UK 4','UK 5','UK 6','UK 7'], colors: [['Black','#121212'], ['Nude','#c89573'], ['Emerald','#1e6b56']] },
  { category: 'Bags', segment: 'Shoulder Bags', title: 'Crescent Shoulder Bag', brand: 'Kindred Carry', query: 'shoulder,bag,fashion', price: 1499, mrp: 2499, fit: 'Curved compact shoulder bag', fabric: 'Smooth vegan leather', sizes: ['One Size'], colors: [['White','#f1ede4'], ['Black','#111'], ['Sage','#9ea889']] },
  { category: 'Accessories', segment: 'Hair', title: 'Pearl Hair Claw Clip', brand: 'Muse Pins', query: 'hair,clip,accessory', price: 349, mrp: 599, fit: 'Medium hold claw clip', fabric: 'Acrylic with faux pearl detail', sizes: ['One Size'], colors: [['Pearl','#f1eadb'], ['Coffee','#7d5948'], ['Pink','#e6a8b9']] },
  { category: 'Beauty', segment: 'Nails', title: 'Gloss Gel Nail Paint', brand: 'Color Desk', query: 'nail,polish,beauty', price: 299, mrp: 499, fit: 'High shine gel finish', fabric: 'Gel polish', sizes: ['9 ml'], colors: [['Cherry','#b91f36'], ['Nude','#c78f7d'], ['Plum','#69304f']] }
];

function imageUrl(product, colorName, index, angle = 0) {
  const seed = (index * 7) + angle;
  return `https://picsum.photos/seed/${seed + 500}/400/600`;
}

function shippingFor(category) {
  if (category === 'Beauty') return 'Free delivery in 3-5 days. Sealed products can be returned only if unused.';
  if (category === 'Shoes') return 'Free delivery in 4-6 days. Size exchange available for 7 days.';
  return 'Free delivery in 3-6 days. Easy 7 day return and exchange.';
}

function productDetails(product) {
  return [
    `Material: ${product.fabric}`,
    `Fit: ${product.fit}`,
    'Care: follow the care label; gentle wash recommended',
    'Country of origin: India',
    'Packed and shipped by Uptown partner warehouse'
  ];
}

export function categories() {
  const categoryMap = new Map();
  for (const p of baseCatalog) {
    if (!categoryMap.has(p.category)) categoryMap.set(p.category, new Set());
    categoryMap.get(p.category).add(p.segment);
  }
  return [...categoryMap.entries()].map(([name, segments]) => ({ name, segments: [...segments] }));
}

export function generateProduct(index, category = 'All') {
  const list = category && category !== 'All' ? baseCatalog.filter((p) => p.category.toLowerCase() === category.toLowerCase()) : baseCatalog;
  const safeList = list.length ? list : baseCatalog;
  const base = safeList[index % safeList.length];
  const colorPack = base.colors.map(([name, hex], colorIndex) => ({
    name,
    hex,
    images: [0, 1, 2, 3].map((angle) => imageUrl(base, name, index + colorIndex * 13, angle))
  }));
  const discount = Math.round(((base.mrp - base.price) / base.mrp) * 100);
  const rating = Number((4.1 + ((index % 8) * 0.1)).toFixed(1));
  const idCategory = category && category !== 'All' ? base.category.toLowerCase() : 'all';
  return {
    id: `p_${idCategory}_${index}`,
    slug: base.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
    baseKey: `${base.brand}-${base.title}`.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    title: base.title,
    brand: base.brand,
    category: base.category,
    segment: base.segment,
    price: base.price + ((index % 5) * 40),
    mrp: base.mrp + ((index % 5) * 60),
    discount,
    rating,
    ratingCount: 80 + ((index * 17) % 900),
    seller: `${base.brand} Retail Pvt Ltd`,
    fit: base.fit,
    fabric: base.fabric,
    sizes: base.sizes,
    colors: colorPack,
    image: colorPack[0].images[0],
    details: productDetails(base),
    shipping: shippingFor(base.category),
    terms: 'Return must be placed in unused condition with original tags, invoice and packaging. Beauty items are returnable only if sealed.',
    description: `${base.title} by ${base.brand}, made for clean everyday styling with a polished finish and easy pairing options.`
  };
}

export function getProductById(id) {
  const parts = String(id || '').split('_');
  if (parts[1] === 'dyn') {
    const query = decodeURIComponent(parts[2] || 'style');
    const index = Number(parts[3] || 0);
    return generateDynamicProduct(index, query);
  }
  const category = parts[1] && parts[1] !== 'all' ? parts[1] : 'All';
  const index = Number(parts[2] || 0);
  return generateProduct(Number.isFinite(index) ? index : 0, category);
}

export function listProducts({ cursor = 0, limit = 24, category = 'All', segment = '', q = '' }) {
  const items = [];
  let scan = Number(cursor) || 0;
  
  if (q) {
    while (items.length < limit) {
      items.push(generateDynamicProduct(scan, q));
      scan += 1;
    }
    return { items, nextCursor: scan, hasMore: true };
  }

  const maxGuard = limit * 30;
  let guard = 0;
  while (items.length < limit && guard < maxGuard) {
    const product = generateProduct(scan, category);
    const matchesSegment = !segment || product.segment.toLowerCase() === segment.toLowerCase();
    if (matchesSegment) items.push(product);
    scan += 1;
    guard += 1;
  }
  return { items, nextCursor: scan, hasMore: true };
}

export function relatedProducts(product, count = 12) {
  const seed = product.baseKey.split('').reduce((sum, ch) => sum + ch.charCodeAt(0), 0);
  return Array.from({ length: count }, (_, i) => generateProduct(seed + i + 1, product.category));
}

function generateDynamicProduct(index, query) {
  const seed = index + 1000;
  const cleanQuery = query.replace(/[^a-zA-Z0-9 ]/g, '').trim();
  const capitalizedQuery = cleanQuery.charAt(0).toUpperCase() + cleanQuery.slice(1);
  const colorPack = [{
    name: 'Featured',
    hex: '#333333',
    images: [0, 1, 2, 3].map((angle) => `https://picsum.photos/seed/${seed + angle + 1000}/400/600`)
  }];
  
  return {
    id: `p_dyn_${encodeURIComponent(cleanQuery)}_${index}`,
    slug: cleanQuery.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    baseKey: `uptown-${cleanQuery}`.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    title: `${capitalizedQuery} Edit`,
    brand: 'Uptown Customs',
    category: 'Clothing',
    segment: capitalizedQuery,
    price: 1299 + ((index % 5) * 100),
    mrp: 1999 + ((index % 5) * 150),
    discount: 30,
    rating: Number((4.2 + ((index % 8) * 0.1)).toFixed(1)),
    ratingCount: 120 + index,
    seller: 'Uptown Customs Pvt Ltd',
    fit: 'Regular fit',
    fabric: 'Premium Blend',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: colorPack,
    image: colorPack[0].images[0],
    details: [
      'Custom generated style',
      'Material: Premium Blend',
      'Fit: Regular fit'
    ],
    shipping: 'Free delivery in 3-5 days.',
    terms: 'Easy return and exchange on eligible items.',
    description: `Exclusive ${cleanQuery} tailored for a fresh, modern look.`
  };
}
