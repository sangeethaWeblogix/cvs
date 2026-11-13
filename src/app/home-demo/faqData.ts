// Home page FAQ (src: "CampervansForSale.au - Faq.docx"). Answers are trusted static HTML
// authored here (internal links are site-relative), rendered by HomeFaq.tsx.
export type FaqItem = { q: string; a: string };
export type FaqCategory = { id: string; label: string; items: FaqItem[] };

export const HOME_FAQS: FaqCategory[] = [
  {
    "id": "campervan-brands",
    "label": "Campervan Brands",
    "items": [
      {
        "q": "What are the most popular campervan brands in Australia?",
        "a": "Well-known campervan brands include Jayco, Avida, Frontline, Trakka, KEA, Avan and Winnebago. Popular base vehicles include Volkswagen Transporter, Toyota HiAce and Mercedes-Benz Sprinter."
      },
      {
        "q": "Where can I find Jayco campervans for sale?",
        "a": "Browse <a href=\"/listings/jayco/\" class=\"hfaq-link\">Jayco campervans for sale</a> on CampervansForSale.au. Compare available JRV and other models by price, condition, layout and specifications."
      },
      {
        "q": "Where can I find Avida campervans for sale?",
        "a": "Explore <a href=\"/listings/avida/\" class=\"hfaq-link\">Avida campervans for sale</a>, including available Diversion, Trek and other models. Compare sleeping arrangements, prices and features."
      },
      {
        "q": "Where can I find Winnebago campervans for sale?",
        "a": "Browse <a href=\"/listings/winnebago/\" class=\"hfaq-link\">Winnebago campervans for sale</a> and compare available models, including van-based touring vehicles, by price, condition and specifications."
      },
      {
        "q": "Where can I find Volkswagen campervans for sale?",
        "a": "Explore <a href=\"/listings/volkswagen-vehicle-make/\" class=\"hfaq-link\">Volkswagen-based campervans for sale</a>, including available Transporter and Crafter conversions. Compare pop-top, high-roof, 2-berth and AWD configurations."
      },
      {
        "q": "Where can I find Mercedes-Benz campervans for sale?",
        "a": "Browse <a href=\"/listings/mercedes-benz-vehicle-make/\" class=\"hfaq-link\">Mercedes-Benz-based campervans</a>, including available Sprinter conversions from different manufacturers. Compare prices, layouts, vehicle weights and touring features."
      },
      {
        "q": "Where can I find Frontline campervans for sale?",
        "a": "Explore <a href=\"/listings/frontline/\" class=\"hfaq-link\">Frontline campervans for sale</a>, including available Adventurer, Transporter and other models. Compare compact layouts, pop-top designs and touring features."
      },
      {
        "q": "Where can I find Trakka campervans for sale?",
        "a": "Browse <a href=\"/listings/trakka/\" class=\"hfaq-link\">Trakka campervans for sale</a>, including available Trakkadu, Akuna and Jabiru models. Compare layouts, features, price and condition."
      }
    ]
  },
  {
    "id": "types-sizes-and-layouts",
    "label": "Types, Sizes & Layouts",
    "items": [
      {
        "q": "Where can I find small campervans for sale?",
        "a": "Browse <a href=\"/listings/under-16-length-in-feet/\" class=\"hfaq-link\">campervans under 16 feet</a> to explore compact models suited to couples, solo travellers and buyers wanting easier parking and manoeuvrability."
      },
      {
        "q": "Where can I find pop-top campervans for sale?",
        "a": "Pop-top campervans feature a roof that raises when parked, providing additional headroom. Browse campervan listings and compare available pop-top models by make, dimensions and sleeping capacity."
      },
      {
        "q": "What is the difference between a high-top and pop-top campervan?",
        "a": "High-top campervans have permanently raised roofs, while pop-top models have roofs that extend when camping. High-tops offer permanent standing room, while pop-tops can reduce travelling height."
      },
      {
        "q": "Where can I find 4WD campervans for sale?",
        "a": "Browse <a href=\"/listings/\" class=\"hfaq-link\">campervans for sale</a> and compare available 4WD and AWD models. Check drivetrain, ground clearance, tyres and manufacturer restrictions before travelling off-road."
      },
      {
        "q": "What is the difference between AWD and 4WD campervans?",
        "a": "AWD systems generally provide automatic traction across different road conditions, while some 4WD systems offer additional off-road capabilities. Suitability depends on the vehicle's drivetrain, clearance and specifications."
      },
      {
        "q": "What size campervan is suitable for families?",
        "a": "Families may prefer campervans with four or more berths, practical storage and flexible sleeping arrangements. Confirm there are enough approved seatbelt-equipped passenger seats for everyone travelling."
      },
      {
        "q": "How many people can sleep in a campervan?",
        "a": "Campervans commonly sleep two to four people, although larger models may accommodate more. Browse <a href=\"/listings/2-people-sleeping-capacity/\" class=\"hfaq-link\">2-berth campervans</a> or select another sleeping-capacity filter."
      },
      {
        "q": "What are the most popular campervan layouts?",
        "a": "Popular layouts include rear beds, convertible lounges, twin singles, transverse beds and pop-top sleeping areas. Compare kitchen placement, storage and available living space before choosing."
      },
      {
        "q": "Are electric and hybrid campervans available in Australia?",
        "a": "Electric and hybrid campervan options are emerging in Australia, although availability remains limited. Compare driving range, charging access, payload and conversion specifications before buying."
      }
    ]
  },
  {
    "id": "new-used-and-prices",
    "label": "New, Used & Prices",
    "items": [
      {
        "q": "How much does a new campervan cost in Australia?",
        "a": "New professionally built campervans often cost around $90,000 to over $200,000, depending on the manufacturer, vehicle platform, size and features. Compare <a href=\"/listings/new-condition/\" class=\"hfaq-link\">new campervans</a> for current asking prices."
      },
      {
        "q": "How much does a used campervan cost?",
        "a": "Used campervans can cost under $30,000 for some older conversions, while newer premium models may exceed $150,000. Price depends on age, kilometres, condition, layout and equipment."
      },
      {
        "q": "Where can I find cheap campervans for sale?",
        "a": "Browse lower-priced campervan listings on CampervansForSale.au and compare older conversions and compact models. Check mechanical condition, registration and possible repair costs before purchasing."
      },
      {
        "q": "Where can I find campervans under $50,000?",
        "a": "Browse <a href=\"/listings/under-50000/\" class=\"hfaq-link\">campervans under $50,000</a> and compare available second-hand models by age, kilometres, condition and features."
      },
      {
        "q": "How much do luxury campervans cost?",
        "a": "Luxury campervans can cost over $150,000, with some premium models exceeding $200,000. Higher prices may reflect larger layouts, ensuites, advanced electrical systems and additional equipment."
      },
      {
        "q": "What factors affect campervan prices?",
        "a": "Prices depend on manufacturer, base vehicle, age, kilometres, condition, layout and equipment. Features such as lithium batteries, solar power, ensuites and AWD systems can also influence value."
      }
    ]
  },
  {
    "id": "features-and-off-grid-living",
    "label": "Features & Off-Grid Living",
    "items": [
      {
        "q": "What features should I look for in a campervan?",
        "a": "Consider comfortable sleeping arrangements, kitchen facilities, storage, refrigeration, ventilation and water capacity. Solar panels, lithium batteries, heating, air conditioning and an ensuite may suit longer trips."
      },
      {
        "q": "What kitchen and bathroom facilities are available in campervans?",
        "a": "Campervans may include gas or induction cooktops, sinks, fridges, toilets and showers. Facilities vary by model, with compact campervans often offering more basic arrangements."
      },
      {
        "q": "What are the benefits of off-grid campervans?",
        "a": "Off-grid campervans can support camping away from powered sites using solar panels, batteries and onboard water storage. Actual independence depends on equipment capacity and usage."
      },
      {
        "q": "What solar systems are suitable for campervans?",
        "a": "Campervan solar systems may use roof-mounted or portable panels connected to a leisure battery. Choose panel capacity based on refrigeration, lighting, appliances and expected power consumption."
      },
      {
        "q": "Are lithium batteries worth having in a campervan?",
        "a": "Lithium batteries can provide useful energy storage with less weight than comparable lead-acid systems. They may suit frequent off-grid travellers, depending on budget and electrical requirements."
      },
      {
        "q": "What are the benefits of campervan awnings?",
        "a": "Awnings provide shade and shelter outside the campervan, creating additional living space. Compare manual, wind-out and electric awnings for size, convenience and suitability."
      },
      {
        "q": "What accessories are essential for a campervan?",
        "a": "Useful accessories include levelling blocks, water hoses, power leads, camping chairs, storage organisers and emergency equipment. Choose accessories that suit your campervan's layout and available payload."
      }
    ]
  },
  {
    "id": "ownership-and-maintenance",
    "label": "Ownership & Maintenance",
    "items": [
      {
        "q": "What licence do I need to drive a campervan in Australia?",
        "a": "A standard Australian car licence generally covers campervans up to 4.5 tonnes GVM. Heavier vehicles may require a higher licence class, depending on their specifications."
      },
      {
        "q": "How often should a campervan be serviced?",
        "a": "Follow the base vehicle manufacturer's servicing schedule and regularly inspect tyres, brakes, batteries, plumbing, roof seals and living-area equipment, especially before extended trips."
      },
      {
        "q": "How do I maintain a campervan?",
        "a": "Keep up with mechanical servicing, inspect seals for water leaks and maintain batteries, appliances and plumbing. Regular cleaning and preventative maintenance help preserve the campervan's condition."
      },
      {
        "q": "How much does campervan insurance cost in Australia?",
        "a": "Insurance premiums depend on vehicle value, age, location, driver history and coverage. Compare quotes from insurers offering campervan policies, including cover for conversions, accessories and contents where available."
      },
      {
        "q": "What are the ongoing costs of owning a campervan?",
        "a": "Ongoing expenses include registration, insurance, fuel, servicing, tyres, repairs and depreciation. Storage, caravan park fees and replacement of batteries or appliances may add costs."
      },
      {
        "q": "Can I get campervan finance in Australia?",
        "a": "Yes. Banks and specialist lenders may offer campervan finance, subject to eligibility and vehicle requirements. Compare interest rates, fees, deposit requirements and total repayments."
      }
    ]
  },
  {
    "id": "campervans-for-sale-by-location",
    "label": "Campervans for Sale by Location",
    "items": [
      {
        "q": "Where can I find campervans for sale in Melbourne?",
        "a": "Browse <a href=\"/listings/victoria-state/melbourne-region/\" class=\"hfaq-link\">campervans for sale in Melbourne</a> on CampervansForSale.au. Compare new and used models from dealerships and private sellers."
      },
      {
        "q": "Where can I find campervans for sale in Sydney?",
        "a": "Explore <a href=\"/listings/new-south-wales-state/sydney-region/\" class=\"hfaq-link\">campervans for sale in Sydney</a> and compare available models by price, manufacturer, condition, layout and specifications."
      },
      {
        "q": "Where can I find campervans for sale in Brisbane?",
        "a": "Browse <a href=\"/listings/queensland-state/brisbane-region/\" class=\"hfaq-link\">campervans for sale in Brisbane</a> and compare available compact, pop-top, luxury and touring campervans."
      },
      {
        "q": "Where can I find campervans for sale in Adelaide?",
        "a": "Find <a href=\"/listings/south-australia-state/adelaide-region/\" class=\"hfaq-link\">campervans for sale in Adelaide</a>, including new and used models advertised by dealerships and private sellers."
      },
      {
        "q": "Where can I find campervans for sale in Perth?",
        "a": "Browse <a href=\"/listings/western-australia-state/perth-region/\" class=\"hfaq-link\">campervans for sale in Perth</a> and compare prices, layouts, vehicle platforms and available features."
      },
      {
        "q": "How can I find campervans for sale near me?",
        "a": "Use the location filters on CampervansForSale.au to browse campervans by state, city or region. Narrow results by price, make, condition and sleeping capacity."
      },
      {
        "q": "Can I buy a campervan from another state in Australia?",
        "a": "Yes. You can contact interstate sellers and arrange inspections or transport. Check registration transfer requirements, roadworthy certificates, delivery costs and vehicle condition before purchasing."
      }
    ]
  },
  {
    "id": "selling-a-campervan",
    "label": "Selling a Campervan",
    "items": [
      {
        "q": "How do I sell my campervan online in Australia?",
        "a": "Create an advertisement on <a href=\"/sell-my-campervan/\" class=\"hfaq-link\">CampervansForSale.au</a>, enter your campervan's specifications, asking price and photos, and receive enquiries directly from interested buyers."
      },
      {
        "q": "Where can I advertise my campervan for sale?",
        "a": "Advertise on CampervansForSale.au for a one-time fee of $49 including GST. Your listing stays live until sold, with no sales commission."
      },
      {
        "q": "How much does it cost to advertise a campervan for sale?",
        "a": "Private sellers pay $49 including GST for a listing on CampervansForSale.au. There are no monthly listing fees or commissions on the final sale."
      },
      {
        "q": "Can private owners list campervans for sale?",
        "a": "Yes. Private owners can advertise their campervans directly on CampervansForSale.au and communicate with interested buyers without using a dealership."
      },
      {
        "q": "Can campervan dealerships advertise their stock?",
        "a": "Yes. Campervan dealerships can advertise their available stock on CampervansForSale.au, allowing buyers to compare vehicles and contact participating dealers directly."
      },
      {
        "q": "What information should I include in a campervan listing?",
        "a": "Include the make, model, year, kilometres, price, condition, GVM, sleeping capacity, layout and features. Add clear photos of the interior, exterior, kitchen, sleeping areas and accessories."
      },
      {
        "q": "How can I attract more buyers to my campervan listing?",
        "a": "Set a competitive price, provide detailed specifications and upload quality photographs. Highlight features such as solar panels, lithium batteries, pop-top roofs, storage and service history."
      },
      {
        "q": "How do I determine the selling price of my campervan?",
        "a": "Compare similar campervans by make, model, year, kilometres, condition and equipment. Review current asking prices on CampervansForSale.au and allow for differences in features and maintenance history."
      }
    ]
  },
  {
    "id": "general-and-buying",
    "label": "General & Buying",
    "items": [
      {
        "q": "Where can I find campervans for sale in Australia?",
        "a": "Browse new and used campervans for sale on CampervansForSale.au. Compare available vehicles from dealerships and private sellers across Australia by price, make, location, sleeping capacity and specifications."
      },
      {
        "q": "What types of campervans are available in Australia?",
        "a": "Popular campervan types include pop-top, high-roof, compact, luxury, family and 4WD campervans. Each offers different living arrangements, storage, features and driving capabilities."
      },
      {
        "q": "What is the difference between a campervan and a motorhome?",
        "a": "Campervans are generally smaller, with living facilities fitted within a van body, while motorhomes often provide more spacious accommodation. Compare campervans with <a href=\"https://www.motorhomesforsale.com.au/\" class=\"hfaq-link\" target=\"_blank\" rel=\"noopener noreferrer\">motorhomes for sale</a> to explore both options."
      },
      {
        "q": "How do I choose the right campervan?",
        "a": "Consider your budget, number of travellers, preferred destinations and driving needs. Compare campervans by size, sleeping capacity, layout, GVM, payload and available facilities."
      },
      {
        "q": "Are campervans available from private sellers and dealers?",
        "a": "Yes. CampervansForSale.au features new and used campervans advertised by Australian dealerships and private sellers, allowing buyers to compare available vehicles and contact advertisers directly."
      },
      {
        "q": "How can I compare different campervans?",
        "a": "Compare make, model, year, price, kilometres, sleeping capacity, length, fuel type, GVM and features. Use the search filters on CampervansForSale.au to narrow your options."
      },
      {
        "q": "Where can I buy new campervans in Australia?",
        "a": "Browse new campervans for sale on CampervansForSale.au. Compare available models from dealerships by manufacturer, vehicle platform, price, layout and location."
      },
      {
        "q": "Where can I buy used campervans in Australia?",
        "a": "Explore <a href=\"/listings/used-condition/\" class=\"hfaq-link\">used campervans for sale</a> across Australia. Compare second-hand vehicles from dealers and private sellers by price, age, condition, kilometres and features."
      },
      {
        "q": "What should I check before buying a used campervan?",
        "a": "Inspect the engine, transmission, roof seals, flooring, plumbing and electrical systems. Check for water damage, review service records and registration, and conduct a PPSR search before purchasing."
      }
    ]
  }
];
