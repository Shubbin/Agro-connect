<?php
/**
 * AgroDirect Connect - Extended Seed (10 Farmers × 10 Products)
 * Run: php api/seed_extended.php
 */

require_once __DIR__ . '/config/db.php';
use Config\Database;

$db = Database::getConnection();

echo "🌱 Extended Seed - 10 Farmers × 10 Products\n";
echo "==============================================\n\n";

$farmers = [
    ['name' => 'Chukwudi Nwosu',    'email' => 'chukwudi@agrodirect.ng', 'phone' => '08023456789', 'password' => 'Farmer123!', 'location' => 'Anambra'],
    ['name' => 'Hauwa Suleiman',    'email' => 'hauwa@agrodirect.ng',    'phone' => '07034567890', 'password' => 'Farmer123!', 'location' => 'Sokoto'],
    ['name' => 'Tunde Fashola',     'email' => 'tunde@agrodirect.ng',    'phone' => '09045678901', 'password' => 'Farmer123!', 'location' => 'Lagos'],
    ['name' => 'Amaka Eze',         'email' => 'amaka@agrodirect.ng',    'phone' => '08056789012', 'password' => 'Farmer123!', 'location' => 'Imo'],
    ['name' => 'Ibrahim Musa',      'email' => 'ibrahim@agrodirect.ng',  'phone' => '07067890123', 'password' => 'Farmer123!', 'location' => 'Kaduna'],
    ['name' => 'Ngozi Obi',         'email' => 'ngozi@agrodirect.ng',    'phone' => '09078901234', 'password' => 'Farmer123!', 'location' => 'Rivers'],
    ['name' => 'Kayode Ogundimu',   'email' => 'kayode@agrodirect.ng',   'phone' => '08089012345', 'password' => 'Farmer123!', 'location' => 'Ekiti'],
    ['name' => 'Zainab Garba',      'email' => 'zainab@agrodirect.ng',   'phone' => '07090123456', 'password' => 'Farmer123!', 'location' => 'Kebbi'],
    ['name' => 'Felix Adesanya',    'email' => 'felix@agrodirect.ng',    'phone' => '09001234567', 'password' => 'Farmer123!', 'location' => 'Ogun'],
    ['name' => 'Blessing Nkemdirim','email' => 'blessing@agrodirect.ng', 'phone' => '08012309876', 'password' => 'Farmer123!', 'location' => 'Delta'],
];

$productSets = [
    // Chukwudi Nwosu - Anambra (Yams & Tubers specialist)
    [
        ['name' => 'Puna Yam (Large)',    'cat' => 'produce',   'price' => 12000, 'unit' => 'bag (50kg)',   'qty' => 300, 'desc' => 'Premium puna yam from Anambra. Firm texture, long shelf life. Excellent for pounded yam.', 'certs' => ['Organic', 'GAP Certified']],
        ['name' => 'Water Yam',           'cat' => 'produce',   'price' => 8500,  'unit' => 'bag (50kg)',   'qty' => 200, 'desc' => 'Fresh water yam (Dioscorea alata). Ideal for porridge and asaro.', 'certs' => ['Organic']],
        ['name' => 'Coco Yam (Ede)',      'cat' => 'produce',   'price' => 6800,  'unit' => 'bag (30kg)',   'qty' => 150, 'desc' => 'Smooth coco yam with rich starch content. Popular in soups and porridge.', 'certs' => ['Organic']],
        ['name' => 'African Breadfruit',  'cat' => 'produce',   'price' => 3500,  'unit' => 'bag (20kg)',   'qty' => 100, 'desc' => 'Ukwa seeds from Anambra. Nutritious and rich in protein.', 'certs' => ['Organic']],
        ['name' => 'Bitter Leaf (Dried)', 'cat' => 'produce',   'price' => 2200,  'unit' => 'bundle (2kg)', 'qty' => 500, 'desc' => 'Sun-dried bitter leaf. Maintains potency for months. Used in soups and medicine.', 'certs' => ['Organic']],
        ['name' => 'Achi Thickener',      'cat' => 'grains',    'price' => 4500,  'unit' => 'bag (10kg)',   'qty' => 80,  'desc' => 'Ground achi seeds. Natural soup thickener. Gluten-free alternative.', 'certs' => ['Organic', 'NAFDAC']],
        ['name' => 'Ogiri (Fermented)',   'cat' => 'produce',   'price' => 1800,  'unit' => 'pack (500g)',  'qty' => 600, 'desc' => 'Traditionally fermented melon seeds. Used as seasoning in Igbo soups.', 'certs' => ['Organic']],
        ['name' => 'Uziza Leaves',        'cat' => 'produce',   'price' => 1500,  'unit' => 'bundle (3kg)', 'qty' => 400, 'desc' => 'Fresh uziza leaves. Aromatic and medicinal. Used in pepper soup.', 'certs' => ['Organic']],
        ['name' => 'Ofo Thickener Seeds', 'cat' => 'grains',    'price' => 3200,  'unit' => 'bag (5kg)',    'qty' => 120, 'desc' => 'Dried ofo seeds. Traditional Igbo thickener for ofe onugbu.', 'certs' => ['Organic']],
        ['name' => 'Okro (Okra) Dried',  'cat' => 'produce',   'price' => 5500,  'unit' => 'bag (10kg)',   'qty' => 200, 'desc' => 'Sun-dried okra pods. Concentrated flavour. Shelf-stable for 12 months.', 'certs' => ['Organic', 'GAP Certified']],
    ],
    // Hauwa Suleiman - Sokoto (Grains & Livestock feeds)
    [
        ['name' => 'Millet (Fonio)',      'cat' => 'grains',    'price' => 9800,  'unit' => 'bag (100kg)', 'qty' => 200, 'desc' => 'Sokoto white millet. Fine grain, ideal for tuwo and kunu drinks.', 'certs' => ['GAP Certified']],
        ['name' => 'Sorghum (Dawa)',      'cat' => 'grains',    'price' => 8500,  'unit' => 'bag (100kg)', 'qty' => 300, 'desc' => 'Red sorghum from Sokoto plains. Used for burukutu, porridge and livestock.', 'certs' => ['GAP Certified']],
        ['name' => 'Cow Pea (Beans)',     'cat' => 'grains',    'price' => 15000, 'unit' => 'bag (100kg)', 'qty' => 150, 'desc' => 'Olo variety white-eyed beans. Low weevil damage, high protein content.', 'certs' => ['Organic', 'NAFDAC']],
        ['name' => 'Bambara Nuts',        'cat' => 'grains',    'price' => 7500,  'unit' => 'bag (50kg)',  'qty' => 100, 'desc' => 'Sokoto bambara groundnuts. Excellent protein source. Used for porridge.', 'certs' => ['Organic']],
        ['name' => 'Moringa Powder',      'cat' => 'produce',   'price' => 6000,  'unit' => 'kg',          'qty' => 50,  'desc' => 'Cold-pressed moringa leaf powder. 23x more iron than spinach. Export quality.', 'certs' => ['Organic', 'Export Grade']],
        ['name' => 'Roselle (Zobo)',      'cat' => 'produce',   'price' => 5500,  'unit' => 'bag (20kg)',  'qty' => 120, 'desc' => 'Dried hibiscus sabdariffa. Used for zobo drink. Deep red colour.', 'certs' => ['Organic']],
        ['name' => 'Tiger Nut (Dried)',   'cat' => 'produce',   'price' => 8000,  'unit' => 'bag (25kg)',  'qty' => 80,  'desc' => 'Premium yellow tiger nuts. Used for kunu aya. Diabetic-friendly snack.', 'certs' => ['Organic', 'NAFDAC']],
        ['name' => 'Locust Beans (Iru)', 'cat' => 'produce',   'price' => 3500,  'unit' => 'bag (10kg)',  'qty' => 200, 'desc' => 'Fermented African locust beans. Rich umami flavour. Used as seasoning.', 'certs' => ['Organic']],
        ['name' => 'Date Palm Fruit',     'cat' => 'produce',   'price' => 9000,  'unit' => 'bag (20kg)',  'qty' => 90,  'desc' => 'Fresh Sokoto Medjool dates. Sweet, sticky and nutritious.', 'certs' => ['Organic', 'Export Grade']],
        ['name' => 'Coriander Seeds',     'cat' => 'grains',    'price' => 4200,  'unit' => 'bag (10kg)',  'qty' => 150, 'desc' => 'Whole coriander seeds. Aromatic spice used in Hausa cooking and export.', 'certs' => ['Organic', 'Export Grade']],
    ],
    // Tunde Fashola - Lagos (High-value vegetables & aquaculture)
    [
        ['name' => 'Catfish (Fresh)',     'cat' => 'livestock', 'price' => 4500,  'unit' => 'kg',          'qty' => 500, 'desc' => 'Farm-raised fresh catfish from Lagos. Average weight 1.2kg. Same-day delivery.', 'certs' => ['NAFDAC', 'GAP Certified']],
        ['name' => 'Tilapia (Live)',      'cat' => 'livestock', 'price' => 3800,  'unit' => 'kg',          'qty' => 300, 'desc' => 'Live Nile tilapia. Raised in clean ponds. Low fat, high protein.', 'certs' => ['NAFDAC']],
        ['name' => 'Tomato (Plum)',       'cat' => 'produce',   'price' => 6500,  'unit' => 'crate (20kg)','qty' => 400, 'desc' => 'Fresh plum tomatoes from greenhouse farm. Fewer seeds, thicker flesh. Ideal for paste.', 'certs' => ['GAP Certified']],
        ['name' => 'Bell Pepper (Mixed)', 'cat' => 'produce',   'price' => 8500,  'unit' => 'crate (15kg)','qty' => 200, 'desc' => 'Mixed red, yellow and green bell peppers. Crisp and sweet. Restaurant quality.', 'certs' => ['GAP Certified', 'Organic']],
        ['name' => 'Cucumber (Long)',     'cat' => 'produce',   'price' => 4200,  'unit' => 'crate (20kg)','qty' => 300, 'desc' => 'Fresh long cucumber. Low calorie, hydrating. Grown with drip irrigation.', 'certs' => ['Organic']],
        ['name' => 'Lettuce (Iceberg)',   'cat' => 'produce',   'price' => 3500,  'unit' => 'crate (10kg)','qty' => 250, 'desc' => 'Crispy iceberg lettuce. Hydroponic-grown. Ideal for salads and wraps.', 'certs' => ['Organic', 'GAP Certified']],
        ['name' => 'Carrot (Chantenay)',  'cat' => 'produce',   'price' => 5500,  'unit' => 'bag (25kg)',  'qty' => 200, 'desc' => 'Orange Chantenay carrots. Sweet, crunchy. Rich in beta-carotene.', 'certs' => ['Organic']],
        ['name' => 'Cabbage (Green)',     'cat' => 'produce',   'price' => 3200,  'unit' => 'crate (20kg)','qty' => 300, 'desc' => 'Large green cabbage heads. Firm and fresh. For coleslaw and stews.', 'certs' => ['GAP Certified']],
        ['name' => 'Ginger (Root)',       'cat' => 'produce',   'price' => 12000, 'unit' => 'bag (50kg)',  'qty' => 100, 'desc' => 'Fresh ginger root. Pungent aroma. Export and domestic grade available.', 'certs' => ['Organic', 'Export Grade']],
        ['name' => 'Scent Leaf (Efirin)', 'cat' => 'produce',   'price' => 1200,  'unit' => 'bundle (2kg)','qty' => 800, 'desc' => 'Fresh scent leaf bundles. Aromatic. Used in pepper soup and jollof rice.', 'certs' => ['Organic']],
    ],
    // Amaka Eze - Imo (Fruits & Exotic Produce)
    [
        ['name' => 'Mango (Keitt)',       'cat' => 'produce',   'price' => 3500,  'unit' => 'crate (15kg)','qty' => 400, 'desc' => 'Large Keitt mango. Low fibre, fiberless flesh. Excellent export variety.', 'certs' => ['GAP Certified', 'Organic']],
        ['name' => 'Guava (Apple variety)','cat'=> 'produce',   'price' => 2800,  'unit' => 'crate (15kg)','qty' => 300, 'desc' => 'Crispy apple guava. White flesh. High Vitamin C. Grown without pesticides.', 'certs' => ['Organic']],
        ['name' => 'Pawpaw (Red Lady)',   'cat' => 'produce',   'price' => 2200,  'unit' => 'crate (12pcs)','qty'=>350,  'desc' => 'Red Lady pawpaw (papaya). Sweet orange flesh, small seed cavity. Top export variety.', 'certs' => ['GAP Certified']],
        ['name' => 'African Star Apple', 'cat' => 'produce',   'price' => 4500,  'unit' => 'crate (20kg)','qty' => 150, 'desc' => 'Agbalumo / udara. Peak season harvest. Sweet-sour flavour. High Vitamin C.', 'certs' => ['Organic']],
        ['name' => 'Bush Mango (Ogbono)', 'cat' => 'grains',   'price' => 18000, 'unit' => 'bag (20kg)',  'qty' => 80,  'desc' => 'Dried bush mango seeds (Irvingia gabonensis). Premium grade for export.', 'certs' => ['Organic', 'Export Grade']],
        ['name' => 'Soursop (Graviola)', 'cat' => 'produce',   'price' => 5500,  'unit' => 'crate (10pcs)','qty'=>100,  'desc' => 'Fresh soursop fruit. Creamy tart flesh. Prized for health benefits.', 'certs' => ['Organic']],
        ['name' => 'Tamarind Pods',       'cat' => 'produce',   'price' => 3800,  'unit' => 'bag (20kg)',  'qty' => 120, 'desc' => 'Sweet-sour tamarind pods. Used in drinks, candies and sauces.', 'certs' => ['Organic']],
        ['name' => 'Garden Egg (White)',  'cat' => 'produce',   'price' => 2500,  'unit' => 'crate (15kg)','qty' => 280, 'desc' => 'White garden eggs, fresh and firm. Used in garden egg stew and salads.', 'certs' => ['Organic']],
        ['name' => 'African Nutmeg',      'cat' => 'grains',    'price' => 7500,  'unit' => 'bag (5kg)',   'qty' => 60,  'desc' => 'Dried Ehuru (African nutmeg). Ground spice for ofe onugbu and Igbo soups.', 'certs' => ['Organic']],
        ['name' => 'Pumpkin (Ugu) Leaves','cat' => 'produce',   'price' => 1800,  'unit' => 'bundle (5kg)','qty' => 600, 'desc' => 'Fresh fluted pumpkin leaves. Rich in iron. Used in Igbo soups.', 'certs' => ['Organic']],
    ],
    // Ibrahim Musa - Kaduna (Livestock & Grains)
    [
        ['name' => 'Live Broiler Chicken','cat' => 'livestock', 'price' => 7500,  'unit' => 'bird',        'qty' => 500, 'desc' => 'Healthy broiler chickens. Weight 2.2–2.8kg. Raised on antibiotic-free feed.', 'certs' => ['NAFDAC', 'GAP Certified']],
        ['name' => 'Turkey (Matured)',    'cat' => 'livestock', 'price' => 25000, 'unit' => 'bird',        'qty' => 80,  'desc' => 'Matured tom turkey. Average weight 8kg. Raised free-range on Kaduna farm.', 'certs' => ['GAP Certified']],
        ['name' => 'Goat (Savannah)',     'cat' => 'livestock', 'price' => 55000, 'unit' => 'head',        'qty' => 50,  'desc' => 'Savannah breed goat. Lean meat with low fat. Slaughter can be arranged on request.', 'certs' => ['GAP Certified']],
        ['name' => 'Soya Bean',           'cat' => 'grains',    'price' => 22000, 'unit' => 'bag (100kg)', 'qty' => 200, 'desc' => 'Yellow soya beans. High protein (40%). Processing-grade for tofu and animal feed.', 'certs' => ['GAP Certified', 'Export Grade']],
        ['name' => 'Guinea Corn (Sorghum)','cat'=> 'grains',   'price' => 9500,  'unit' => 'bag (100kg)', 'qty' => 300, 'desc' => 'White guinea corn from Kaduna plateau. Used for tuwo and animal feed.', 'certs' => ['GAP Certified']],
        ['name' => 'Beniseed (Sesame)',   'cat' => 'grains',    'price' => 24000, 'unit' => 'bag (100kg)', 'qty' => 90,  'desc' => 'White sesame seeds. FFA below 2%. Premium export grade for Asia markets.', 'certs' => ['Export Grade', 'Organic']],
        ['name' => 'Gum Arabic',          'cat' => 'grains',    'price' => 35000, 'unit' => 'bag (50kg)',  'qty' => 40,  'desc' => 'Grade 1 gum arabic. Used in food, pharma and printing industries.', 'certs' => ['Export Grade', 'NAFDAC']],
        ['name' => 'Dry Cattle Hide',     'cat' => 'livestock', 'price' => 8500,  'unit' => 'piece',       'qty' => 200, 'desc' => 'Dried ponmo (cattle hide). Sun-dried and ready for cooking or further processing.', 'certs' => ['NAFDAC']],
        ['name' => 'Poultry Eggs (Tray)', 'cat' => 'livestock', 'price' => 3800,  'unit' => 'tray (30)',   'qty' => 1000,'desc' => 'Fresh farm eggs from free-range layers. Size A. Collected daily.', 'certs' => ['NAFDAC', 'GAP Certified']],
        ['name' => 'Raw Honey (Wild)',    'cat' => 'produce',   'price' => 12000, 'unit' => 'litre',       'qty' => 100, 'desc' => 'Raw unfiltered wild honey from Kaduna forests. No additives or heating.', 'certs' => ['Organic', 'NAFDAC']],
    ],
    // Ngozi Obi - Rivers (Seafood & Swamp produce)
    [
        ['name' => 'Fresh Crayfish',      'cat' => 'produce',   'price' => 28000, 'unit' => 'bag (20kg)',  'qty' => 60,  'desc' => 'Premium dried crayfish from Rivers creeks. Rich flavour. Export-grade quality.', 'certs' => ['NAFDAC', 'Export Grade']],
        ['name' => 'Dry Fish (Asa)',      'cat' => 'produce',   'price' => 15000, 'unit' => 'bag (15kg)',  'qty' => 80,  'desc' => 'Sun-dried croaker fish (Asa). Strong aroma. Used in soups. No preservatives.', 'certs' => ['NAFDAC']],
        ['name' => 'Smoked Mackerel',     'cat' => 'produce',   'price' => 12000, 'unit' => 'carton (5kg)','qty' => 150, 'desc' => 'Smoked titus fish. Moist, yellow flesh. Popular in Nigerian jollof rice.', 'certs' => ['NAFDAC']],
        ['name' => 'Palm Kernel Oil',     'cat' => 'produce',   'price' => 22000, 'unit' => 'drum (25L)',  'qty' => 50,  'desc' => 'Cold-pressed palm kernel oil. Light golden colour. Used for skincare and cooking.', 'certs' => ['Organic']],
        ['name' => 'Periwinkle (Isam)',   'cat' => 'produce',   'price' => 6500,  'unit' => 'bag (20kg)',  'qty' => 100, 'desc' => 'Fresh-cooked periwinkle. Harvested from Rivers mangroves. Perfect for banga soup.', 'certs' => ['NAFDAC']],
        ['name' => 'Snail (African)',     'cat' => 'livestock', 'price' => 18000, 'unit' => 'crate (50pcs)','qty'=>80,   'desc' => 'Large African giant snails (Archachatina). Protein-rich. Farm-raised.', 'certs' => ['NAFDAC']],
        ['name' => 'Banga Fruit (Palm)', 'cat' => 'produce',   'price' => 3500,  'unit' => 'bag (30kg)',  'qty' => 200, 'desc' => 'Fresh palm fruit bunches. Rich oil content. Ideal for banga soup and palm oil.', 'certs' => ['Organic']],
        ['name' => 'Mangrove Oyster',     'cat' => 'produce',   'price' => 8500,  'unit' => 'basket (5kg)','qty' => 120, 'desc' => 'Fresh-harvested mangrove oysters. Saltwater flavour. Available all year round.', 'certs' => ['NAFDAC']],
        ['name' => 'Prawn (Medium)',      'cat' => 'produce',   'price' => 22000, 'unit' => 'bag (10kg)',  'qty' => 70,  'desc' => 'Fresh Atlantic prawns. Deveined and cleaned. Excellent for jollof and stew.', 'certs' => ['NAFDAC', 'Export Grade']],
        ['name' => 'Ukpaka (Oil Bean)',   'cat' => 'produce',   'price' => 4500,  'unit' => 'pack (2kg)',  'qty' => 300, 'desc' => 'Fermented African oil bean seeds. Used in Ugba salad. Traditional Rivers delicacy.', 'certs' => ['Organic']],
    ],
    // Kayode Ogundimu - Ekiti (Root Crops & Cash Crops)
    [
        ['name' => 'Ekiti Yam Flour',     'cat' => 'grains',    'price' => 9500,  'unit' => 'bag (25kg)',  'qty' => 200, 'desc' => 'Sun-dried and milled yam flour from Ekiti. Smooth texture. No preservatives.', 'certs' => ['Organic', 'NAFDAC']],
        ['name' => 'Cocoa Beans (Raw)',   'cat' => 'grains',    'price' => 42000, 'unit' => 'bag (64kg)',  'qty' => 50,  'desc' => 'Grade 1 Ekiti cocoa beans. Fermented for 7 days. Flavor developed. Export ready.', 'certs' => ['Export Grade', 'Organic']],
        ['name' => 'Coffee Beans (Raw)',  'cat' => 'grains',    'price' => 38000, 'unit' => 'bag (60kg)',  'qty' => 30,  'desc' => 'Robusta coffee beans from Ekiti highlands. Dark roast profile. Specialty grade.', 'certs' => ['Export Grade', 'Organic']],
        ['name' => 'Cashew Nuts (Raw)',   'cat' => 'grains',    'price' => 55000, 'unit' => 'bag (80kg)',  'qty' => 60,  'desc' => 'Grade W320 raw cashew nuts. Low moisture. Ready for the international shell market.', 'certs' => ['Export Grade', 'GAP Certified']],
        ['name' => 'Shea Butter (Raw)',   'cat' => 'produce',   'price' => 18000, 'unit' => 'bucket (10kg)','qty'=>100,  'desc' => 'Grade A raw shea butter. Unrefined, golden ivory. For cosmetics and cooking.', 'certs' => ['Organic', 'Export Grade']],
        ['name' => 'Rubber Latex',        'cat' => 'grains',    'price' => 28000, 'unit' => 'drum (200L)', 'qty' => 20,  'desc' => 'Raw natural rubber latex concentrate from Ekiti plantation.', 'certs' => ['Export Grade']],
        ['name' => 'Kola Nut (Obi)',      'cat' => 'produce',   'price' => 15000, 'unit' => 'bag (25kg)',  'qty' => 80,  'desc' => 'Fresh red kola nut (Obi kola). Bitter and stimulating. Used in ceremonies.', 'certs' => ['Organic']],
        ['name' => 'Bitter Kola (Orogbo)','cat' => 'produce',   'price' => 22000, 'unit' => 'bag (10kg)',  'qty' => 60,  'desc' => 'Dried bitter kola (Garcinia kola). Medicinal. High demand for export.', 'certs' => ['Organic', 'Export Grade']],
        ['name' => 'Shea Nuts (Karinya)', 'cat' => 'produce',   'price' => 8500,  'unit' => 'bag (50kg)',  'qty' => 150, 'desc' => 'Dried shea nuts, ready for crushing. Premium quality from wild shea trees.', 'certs' => ['Organic']],
        ['name' => 'Plantain Flour',      'cat' => 'grains',    'price' => 7500,  'unit' => 'bag (25kg)',  'qty' => 100, 'desc' => 'Green plantain dried and milled into flour. Gluten-free. For pancakes and porridge.', 'certs' => ['Organic', 'NAFDAC']],
    ],
    // Zainab Garba - Kebbi (Rice & Aquaculture)
    [
        ['name' => 'Kebbi Long Grain Rice','cat'=> 'grains',   'price' => 38000, 'unit' => 'bag (50kg)',  'qty' => 500, 'desc' => 'Premium Kebbi State long-grain rice. Aromatic when cooked. Preferred for parties.', 'certs' => ['GAP Certified', 'NAFDAC']],
        ['name' => 'Ofada Rice',           'cat' => 'grains',  'price' => 26000, 'unit' => 'bag (25kg)',  'qty' => 200, 'desc' => 'Indigenous Nigerian brown rice. Nutty flavour. Pairs with ayamase stew.', 'certs' => ['Organic', 'GAP Certified']],
        ['name' => 'Faro Rice (Parboiled)','cat'=> 'grains',   'price' => 32000, 'unit' => 'bag (50kg)',  'qty' => 300, 'desc' => 'Parboiled faro rice from Kebbi. Superior texture after cooking.', 'certs' => ['GAP Certified']],
        ['name' => 'Rice Bran',            'cat' => 'grains',  'price' => 6500,  'unit' => 'bag (25kg)',  'qty' => 400, 'desc' => 'Cold-pressed rice bran. Rich in antioxidants. Used for oil and animal feed.', 'certs' => ['Organic']],
        ['name' => 'Prawn (River)',        'cat' => 'produce',  'price' => 18000, 'unit' => 'bag (10kg)',  'qty' => 80,  'desc' => 'Freshwater prawns from Kebbi River. Sundried or fresh on request.', 'certs' => ['NAFDAC']],
        ['name' => 'Nile Perch (Fillets)','cat' => 'produce',  'price' => 22000, 'unit' => 'carton (10kg)','qty'=>60,   'desc' => 'Smoked Nile perch fillets. Boneless, firm white flesh. Export favourite.', 'certs' => ['NAFDAC', 'Export Grade']],
        ['name' => 'Fresh Tigernut',       'cat' => 'produce',  'price' => 4500,  'unit' => 'bag (20kg)',  'qty' => 150, 'desc' => 'Fresh tigernuts from Kebbi. Naturally sweet. Ready to eat or make kunu aya.', 'certs' => ['Organic']],
        ['name' => 'Fishpond Catfish',     'cat' => 'livestock','price' => 5500,  'unit' => 'kg',          'qty' => 600, 'desc' => 'Pond-raised catfish. Average 1.5kg each. Feed-certified with no hormones.', 'certs' => ['NAFDAC', 'GAP Certified']],
        ['name' => 'Clarias Fingerlings',  'cat' => 'livestock','price' => 45,    'unit' => 'per piece',   'qty' => 5000,'desc' => 'Healthy catfish fingerlings for pond restocking. 6–8 weeks old.', 'certs' => ['GAP Certified']],
        ['name' => 'Garlic (Fresh)',       'cat' => 'produce',  'price' => 9500,  'unit' => 'bag (20kg)',  'qty' => 100, 'desc' => 'Fresh garlic bulbs from Kebbi irrigated farms. Pungent aroma, high allicin.', 'certs' => ['Organic']],
    ],
    // Felix Adesanya - Ogun (Poultry & Vegetables)
    [
        ['name' => 'Day-Old Chicks (Broiler)','cat'=>'livestock','price'=> 650,  'unit' => 'per chick',   'qty' => 3000,'desc' => 'Certified Marshall broiler day-old chicks. Vaccinated at hatchery. 98% survival rate.', 'certs' => ['GAP Certified', 'NAFDAC']],
        ['name' => 'Day-Old Chicks (Layer)','cat'=>'livestock', 'price' => 550,  'unit' => 'per chick',   'qty' => 3000,'desc' => 'Isa Brown layer day-old chicks. Consistent egg producers for 80 weeks.', 'certs' => ['GAP Certified']],
        ['name' => 'Poultry Manure',      'cat' => 'grains',   'price' => 15000, 'unit' => 'ton',         'qty' => 200, 'desc' => 'Composted poultry manure. Rich in NPK. Slow-release organic fertilizer.', 'certs' => ['Organic']],
        ['name' => 'Feed Mill Concentrate','cat'=> 'grains',   'price' => 18000, 'unit' => 'bag (25kg)',  'qty' => 100, 'desc' => 'Broiler starter concentrate (35% CP). Mix with maize and bran for complete feed.', 'certs' => ['NAFDAC', 'GAP Certified']],
        ['name' => 'Sweetcorn (Fresh)',   'cat' => 'produce',  'price' => 900,   'unit' => 'dozen ears',  'qty' => 1000,'desc' => 'Yellow sweetcorn on the cob. Tender and sugary. Delivered fresh same-day in Ogun.', 'certs' => ['Organic']],
        ['name' => 'Pepper (Tatashe)',    'cat' => 'produce',  'price' => 7500,  'unit' => 'crate (20kg)','qty' => 300, 'desc' => 'Red tatashe (bell pepper). Thick flesh, mild heat. Excellent for stew and jollof.', 'certs' => ['GAP Certified']],
        ['name' => 'Eggplant (Purple)',   'cat' => 'produce',  'price' => 4500,  'unit' => 'crate (20kg)','qty' => 200, 'desc' => 'Large purple eggplant. Seeded and ready for oriental dishes and salads.', 'certs' => ['Organic']],
        ['name' => 'Bitter Gourd',        'cat' => 'produce',  'price' => 3500,  'unit' => 'crate (15kg)','qty' => 150, 'desc' => 'Fresh bitter gourd (Momordica charantia). Used in herbal medicine and cooking.', 'certs' => ['Organic']],
        ['name' => 'Taro Root (Cocoyam)', 'cat' => 'produce',  'price' => 7000,  'unit' => 'bag (30kg)',  'qty' => 180, 'desc' => 'Ecoyam taro root. Smooth and starchy. Suitable for pottage and chips.', 'certs' => ['Organic']],
        ['name' => 'Quail Eggs',          'cat' => 'livestock','price' => 4800,  'unit' => 'tray (100pcs)','qty'=>200,  'desc' => 'Fresh quail eggs. Rich in Vitamin B12, iron and selenium. Prized by restaurants.', 'certs' => ['NAFDAC', 'GAP Certified']],
    ],
    // Blessing Nkemdirim - Delta (Palm Produce & Aquatic)
    [
        ['name' => 'Urhobo Palm Wine',    'cat' => 'produce',  'price' => 2500,  'unit' => 'litre',       'qty' => 500, 'desc' => 'Fresh tapped palm wine. Fermented naturally. Delivered within hours of tapping.', 'certs' => ['NAFDAC']],
        ['name' => 'Raffia Palm Oil',     'cat' => 'produce',  'price' => 28000, 'unit' => 'drum (20L)',  'qty' => 60,  'desc' => 'Pure raffia palm oil. Rich golden colour. Used for Delta banga soup.', 'certs' => ['Organic']],
        ['name' => 'Delta Catfish (Smoked)','cat'=>'produce',  'price' => 16000, 'unit' => 'bag (10kg)',  'qty' => 80,  'desc' => 'Traditionally smoked Delta catfish. Intense wood-smoke aroma. No artificial additives.', 'certs' => ['NAFDAC']],
        ['name' => 'Atama Leaves',        'cat' => 'produce',  'price' => 2200,  'unit' => 'bundle (3kg)','qty' => 400, 'desc' => 'Fresh atama leaves for Efik/Bini banga soup. Harvested from wild Delta forests.', 'certs' => ['Organic']],
        ['name' => 'Rubber Seed Oil',     'cat' => 'produce',  'price' => 12000, 'unit' => 'litre',       'qty' => 50,  'desc' => 'Cold-pressed rubber seed oil. Industrial and culinary uses. Unique to Delta region.', 'certs' => ['Export Grade']],
        ['name' => 'Fresh Periwinkle',    'cat' => 'produce',  'price' => 8500,  'unit' => 'basket (10kg)','qty'=>150,  'desc' => 'Fresh river periwinkle. Popular in Delta banga soup and pepper soup.', 'certs' => ['NAFDAC']],
        ['name' => 'Pigeon Peas (Fio Fio)','cat'=> 'grains',  'price' => 11500, 'unit' => 'bag (50kg)',  'qty' => 120, 'desc' => 'Dried pigeon peas. High protein legume. Used in ofe akwu and okpa.', 'certs' => ['Organic']],
        ['name' => 'Noni Fruit (Raw)',    'cat' => 'produce',  'price' => 6500,  'unit' => 'kg',          'qty' => 80,  'desc' => 'Fresh noni (Morinda citrifolia) fruit. Medicinal superfruit. For juice extraction.', 'certs' => ['Organic']],
        ['name' => 'Okazi Leaf (Dried)', 'cat' => 'produce',  'price' => 3500,  'unit' => 'pack (500g)', 'qty' => 600, 'desc' => 'Dried okazi / afang leaves. Used in Efik and Urhobo vegetable soups.', 'certs' => ['Organic']],
        ['name' => 'Water Hyacinth Craft','cat' => 'grains',   'price' => 22000, 'unit' => 'set',         'qty' => 30,  'desc' => 'Handwoven water hyacinth baskets from Delta artisans. Export decorative items.', 'certs' => ['Export Grade']],
    ],
];

// Register farmers and insert products
foreach ($farmers as $idx => $farmer) {
    $stmt = $db->prepare("SELECT id FROM users WHERE email = ?");
    $stmt->execute([$farmer['email']]);
    $existing = $stmt->fetch();

    if ($existing) {
        $farmerId = $existing['id'];
        echo "ℹ️  Farmer '{$farmer['name']}' already exists (ID: {$farmerId})\n";
    } else {
        try {
            $hashed = password_hash($farmer['password'], PASSWORD_DEFAULT);
            $stmt = $db->prepare("INSERT INTO users (name, email, phone, password, role, is_verified, verification_status) VALUES (?, ?, ?, ?, 'farmer', 1, 'verified')");
            $stmt->execute([$farmer['name'], $farmer['email'], $farmer['phone'], $hashed]);
            $farmerId = $db->lastInsertId();
            echo "✅ Created farmer '{$farmer['name']}' (ID: {$farmerId})\n";
        } catch (Exception $e) {
            echo "❌ Error creating farmer '{$farmer['name']}': " . $e->getMessage() . "\n";
            continue;
        }
    }

    $products = $productSets[$idx] ?? [];
    foreach ($products as $p) {
        $chk = $db->prepare("SELECT id FROM products WHERE farmer_id = ? AND name = ?");
        $chk->execute([$farmerId, $p['name']]);
        if ($chk->fetch()) {
            echo "    ℹ️  Product '{$p['name']}' already exists\n";
            continue;
        }
        $stmt = $db->prepare("INSERT INTO products (farmer_id, name, description, category, price, unit, available, images, location, certifications) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
        $stmt->execute([
            $farmerId,
            $p['name'],
            $p['desc'],
            $p['cat'],
            $p['price'],
            $p['unit'],
            $p['qty'],
            json_encode(['/placeholder.svg']),
            $farmer['location'],
            json_encode($p['certs']),
        ]);
        echo "    ✅ {$p['name']}\n";
    }
}

// Final count
$products = $db->query("SELECT COUNT(*) as c FROM products")->fetch()['c'];
$farmers  = $db->query("SELECT COUNT(*) as c FROM users WHERE role='farmer'")->fetch()['c'];

echo "\n🎉 Extended seed complete!\n";
echo "  Farmers in DB: $farmers\n";
echo "  Products in DB: $products\n";
echo "\nNew farmer credentials (all: Farmer123!):\n";
foreach ($GLOBALS['farmers'] ?? $farmers as $f) {
    if (is_array($f)) echo "  {$f['email']}\n";
}
