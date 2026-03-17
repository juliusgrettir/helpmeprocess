"""
HelpMeProcess - France Sector Data Pipeline
============================================
Fetches 10-year import trends for all sectors from Eurostat COMEXT.
Outputs a single JSON file ready to drop into the Next.js dashboard.
"""
import requests
import json
import time
import os
from datetime import datetime

BASE_URL = "https://ec.europa.eu/eurostat/api/comext/dissemination/statistics/1.0/data/DS-059341"

YEARS = [2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023]

# All sectors and products — mirrors app/sectors.js
SECTORS = [
    {
        "id": "animals", "label": "Live Animals & Animal Products", "icon": "🐄",
        "chapters": [
            { "id": "meat", "label": "Meat & Offal", "products": [
                { "hs6": "020110", "label": "Beef carcasses, fresh" },
                { "hs6": "020311", "label": "Pig carcasses, fresh" },
                { "hs6": "020712", "label": "Chicken, frozen" },
            ]},
            { "id": "fish", "label": "Fish & Seafood", "products": [
                { "hs6": "030613", "label": "Shrimps & prawns, frozen" },
                { "hs6": "030490", "label": "Fish fillets, frozen" },
                { "hs6": "030374", "label": "Mackerel, frozen" },
            ]},
            { "id": "dairy", "label": "Dairy & Eggs", "products": [
                { "hs6": "040690", "label": "Cheese (other)" },
                { "hs6": "040210", "label": "Milk powder" },
                { "hs6": "040510", "label": "Butter" },
            ]},
        ]
    },
    {
        "id": "vegetables", "label": "Vegetable Products", "icon": "🌾",
        "chapters": [
            { "id": "cereals", "label": "Cereals", "products": [
                { "hs6": "100190", "label": "Wheat" },
                { "hs6": "100590", "label": "Maize" },
                { "hs6": "100630", "label": "Rice, semi-milled" },
            ]},
            { "id": "fruit", "label": "Fruit & Nuts", "products": [
                { "hs6": "080510", "label": "Oranges, fresh" },
                { "hs6": "080211", "label": "Almonds" },
                { "hs6": "080132", "label": "Cashew nuts" },
            ]},
            { "id": "coffee_tea", "label": "Coffee, Tea & Spices", "products": [
                { "hs6": "090111", "label": "Coffee, not roasted" },
                { "hs6": "090210", "label": "Green tea" },
                { "hs6": "090411", "label": "Pepper, dried" },
            ]},
        ]
    },
    {
        "id": "food_processed", "label": "Processed Food & Beverages", "icon": "🍫",
        "chapters": [
            { "id": "cocoa", "label": "Cocoa & Chocolate", "products": [
                { "hs6": "180100", "label": "Cocoa beans" },
                { "hs6": "180310", "label": "Cocoa paste" },
                { "hs6": "180690", "label": "Chocolate products" },
            ]},
            { "id": "prepared_food", "label": "Prepared Food", "products": [
                { "hs6": "190110", "label": "Baby food" },
                { "hs6": "190230", "label": "Pasta, dry" },
                { "hs6": "190590", "label": "Bread & pastry" },
            ]},
            { "id": "misc_food", "label": "Sauces & Preparations", "products": [
                { "hs6": "210390", "label": "Sauces & condiments" },
                { "hs6": "210410", "label": "Soups & broths" },
                { "hs6": "210690", "label": "Food preparations" },
            ]},
            { "id": "beverages", "label": "Beverages & Spirits", "products": [
                { "hs6": "220300", "label": "Beer" },
                { "hs6": "220421", "label": "Wine" },
                { "hs6": "220830", "label": "Whisky" },
            ]},
        ]
    },
    {
        "id": "minerals", "label": "Mineral Products", "icon": "⛏️",
        "chapters": [
            { "id": "ores", "label": "Ores & Concentrates", "products": [
                { "hs6": "260300", "label": "Copper ores" },
                { "hs6": "260400", "label": "Nickel ores" },
                { "hs6": "260500", "label": "Cobalt ores" },
                { "hs6": "260200", "label": "Manganese ores" },
            ]},
            { "id": "energy_minerals", "label": "Coal & Petroleum", "products": [
                { "hs6": "270900", "label": "Crude petroleum" },
                { "hs6": "271019", "label": "Light petroleum oils" },
                { "hs6": "271121", "label": "Natural gas" },
            ]},
        ]
    },
    {
        "id": "chemicals", "label": "Chemicals & Pharmaceuticals", "icon": "🧪",
        "chapters": [
            { "id": "inorganic_chem", "label": "Inorganic Chemicals", "products": [
                { "hs6": "280461", "label": "Silicon >99.99%" },
                { "hs6": "282520", "label": "Lithium hydroxide" },
                { "hs6": "284610", "label": "Rare earth compounds" },
            ]},
            { "id": "pharma", "label": "Pharmaceuticals", "products": [
                { "hs6": "300490", "label": "Medicaments (other)" },
                { "hs6": "300210", "label": "Vaccines" },
                { "hs6": "300420", "label": "Antibiotics" },
            ]},
            { "id": "specialty_chem", "label": "Specialty Chemicals", "products": [
                { "hs6": "380210", "label": "Activated carbon" },
                { "hs6": "380893", "label": "Herbicides" },
                { "hs6": "380891", "label": "Insecticides" },
            ]},
        ]
    },
    {
        "id": "metals", "label": "Base Metals & Steel", "icon": "⚙️",
        "chapters": [
            { "id": "iron_steel", "label": "Iron & Steel", "products": [
                { "hs6": "720839", "label": "Flat-rolled steel" },
                { "hs6": "720918", "label": "Cold-rolled steel coil" },
                { "hs6": "721420", "label": "Rebar" },
            ]},
            { "id": "aluminium", "label": "Aluminium", "products": [
                { "hs6": "760110", "label": "Aluminium, unwrought" },
                { "hs6": "760612", "label": "Aluminium sheets" },
            ]},
            { "id": "copper_metal", "label": "Copper", "products": [
                { "hs6": "740311", "label": "Copper cathodes" },
                { "hs6": "740819", "label": "Copper wire" },
            ]},
        ]
    },
    {
        "id": "machinery", "label": "Machinery & Electronics", "icon": "🤖",
        "chapters": [
            { "id": "industrial_machinery", "label": "Industrial Machinery", "products": [
                { "hs6": "848790", "label": "Machinery parts" },
                { "hs6": "841381", "label": "Pumps" },
                { "hs6": "844332", "label": "3D printers" },
            ]},
            { "id": "electronics", "label": "Electronics & Computing", "products": [
                { "hs6": "854231", "label": "Processors & controllers" },
                { "hs6": "851762", "label": "Network equipment" },
                { "hs6": "854140", "label": "Photovoltaic cells" },
            ]},
            { "id": "ev_energy", "label": "EV & Clean Energy", "products": [
                { "hs6": "850760", "label": "Li-ion batteries" },
                { "hs6": "854150", "label": "Solar modules" },
                { "hs6": "841861", "label": "Heat pumps" },
            ]},
        ]
    },
    {
        "id": "transport", "label": "Transport Equipment", "icon": "🚗",
        "chapters": [
            { "id": "cars", "label": "Passenger Vehicles", "products": [
                { "hs6": "870321", "label": "Cars under 1000cc" },
                { "hs6": "870322", "label": "Cars 1000-1500cc" },
                { "hs6": "870323", "label": "Cars 1500-3000cc" },
                { "hs6": "870324", "label": "Cars over 3000cc" },
                { "hs6": "870380", "label": "Electric vehicles" },
                { "hs6": "870310", "label": "Golf cars & special vehicles" },
                { "hs6": "870421", "label": "Diesel trucks under 5t" },
                { "hs6": "870431", "label": "Petrol trucks under 5t" },
            ]},
            { "id": "auto_parts", "label": "Auto Parts", "products": [
                { "hs6": "870899", "label": "Auto parts (other)" },
                { "hs6": "870830", "label": "Brakes & servo-brakes" },
                { "hs6": "870840", "label": "Gearboxes & transmissions" },
                { "hs6": "870850", "label": "Drive axles" },
                { "hs6": "870870", "label": "Wheels & parts" },
                { "hs6": "870880", "label": "Suspension systems" },
                { "hs6": "870891", "label": "Radiators" },
                { "hs6": "870894", "label": "Steering wheels & columns" },
                { "hs6": "870895", "label": "Safety airbags" },
                { "hs6": "870821", "label": "Safety belts" },
]           },
            { "id": "aerospace", "label": "Aerospace", "products": [
                { "hs6": "880240", "label": "Aeroplanes >15000kg" },
                { "hs6": "880330", "label": "Aircraft parts" },
            ]},
        ]
    },
    {
        "id": "medical", "label": "Medical & Optical", "icon": "🔬",
        "chapters": [
            { "id": "medical_devices", "label": "Medical Devices", "products": [
                { "hs6": "901890", "label": "Medical instruments" },
                { "hs6": "901812", "label": "Ultrasonic scanning" },
                { "hs6": "901831", "label": "Syringes" },
            ]},
        ]
    },
    {
        "id": "misc_manufactured", "label": "Misc. Manufactured Goods", "icon": "🪑",
        "chapters": [
            { "id": "cosmetics", "label": "Cosmetics & Perfumes", "products": [
                { "hs6": "330300", "label": "Perfumes" },
                { "hs6": "330499", "label": "Cosmetic preparations" },
                { "hs6": "330510", "label": "Shampoos" },
            ]},
            { "id": "pet_food", "label": "Pet Food & Animal Feed", "products": [
                { "hs6": "230910", "label": "Dog & cat food" },
                { "hs6": "230990", "label": "Animal feed" },
                { "hs6": "230120", "label": "Fish flour & pellets" },
            ]},
        ]
    },
]


def fetch_product_trend(hs6):
    """Fetch 10-year import trend for a single product for France."""
    trend = {}
    for year in YEARS:
        try:
            r = requests.get(BASE_URL, params={
                "format": "JSON", "lang": "EN", "freq": "A",
                "reporter": "FR", "flow": "1",
                "product": hs6, "time": str(year)
            }, timeout=30)
            data = r.json()
            if not data.get("value"):
                trend[str(year)] = 0
                continue
            total = sum(
                float(v) for k, v in data["value"].items()
                if int(k) % 3 == 0
            )
            trend[str(year)] = round(total / 1_000_000, 2)  # convert to €M
        except Exception as e:
            print(f"      Error {hs6} {year}: {e}")
            trend[str(year)] = 0
        time.sleep(0.3)
    return trend


def compute_growth(trend):
    """Compute 10-year growth % from first to last non-zero year."""
    values = [v for v in trend.values() if v > 0]
    if len(values) < 2:
        return 0
    first, last = values[0], values[-1]
    if first == 0:
        return 0
    return round(((last - first) / first) * 100, 1)


def build_dataset():
    output = []
    total_products = sum(
        len(ch["products"])
        for s in SECTORS
        for ch in s["chapters"]
    )
    count = 0

    for sector in SECTORS:
        print(f"\n{'='*50}")
        print(f"SECTOR: {sector['label']}")
        sector_out = {
            "id": sector["id"],
            "label": sector["label"],
            "icon": sector["icon"],
            "chapters": []
        }

        for chapter in sector["chapters"]:
            print(f"  Chapter: {chapter['label']}")
            chapter_out = {
                "id": chapter["id"],
                "label": chapter["label"],
                "products": []
            }

            for product in chapter["products"]:
                count += 1
                print(f"    [{count}/{total_products}] {product['label']} ({product['hs6']})...", end=" ")
                trend = fetch_product_trend(product["hs6"])
                growth = compute_growth(trend)
                latest = trend.get("2023", 0)
                print(f"€{latest}M, growth: {growth}%")

                chapter_out["products"].append({
                    "hs6": product["hs6"],
                    "label": product["label"],
                    "trend": trend,
                    "growth_pct": growth,
                    "latest_eur_m": latest,
                })

            # Chapter-level summary
            chapter_growth = round(
                sum(p["growth_pct"] for p in chapter_out["products"]) /
                max(len(chapter_out["products"]), 1), 1
            )
            chapter_imports = round(
                sum(p["latest_eur_m"] for p in chapter_out["products"]), 1
            )
            chapter_out["growth_pct"] = chapter_growth
            chapter_out["total_eur_m"] = chapter_imports
            sector_out["chapters"].append(chapter_out)

        # Sector-level summary
        all_products = [p for ch in sector_out["chapters"] for p in ch["products"]]
        sector_out["growth_pct"] = round(
            sum(p["growth_pct"] for p in all_products) / max(len(all_products), 1), 1
        )
        sector_out["total_eur_m"] = round(
            sum(p["latest_eur_m"] for p in all_products), 1
        )
        output.append(sector_out)

    return output


if __name__ == "__main__":
    print("HelpMeProcess — France Sector Data Pipeline")
    print(f"Fetching {sum(len(ch['products']) for s in SECTORS for ch in s['chapters'])} products × 10 years")
    print("This will take about 15-20 minutes. Go make a coffee ☕\n")

    data = build_dataset()

    os.makedirs("../data/france", exist_ok=True)
    timestamp = datetime.now().strftime("%Y%m%d_%H%M")
    path = f"../data/france/sectors_{timestamp}.json"

    with open(path, "w") as f:
        json.dump(data, f, indent=2)

    # Also save as latest.json for easy access
    with open("../data/france/latest.json", "w") as f:
        json.dump(data, f, indent=2)

    print(f"\n✅ Done! Saved to {path}")
    print(f"   Also saved as data/france/latest.json")

    # Print summary
    print("\n📊 SUMMARY")
    print("="*50)
    sorted_sectors = sorted(data, key=lambda x: -x["growth_pct"])
    for s in sorted_sectors:
        arrow = "↗" if s["growth_pct"] > 0 else "↘"
        print(f"{arrow} {s['label']:<35} €{s['total_eur_m']:>8.0f}M  {s['growth_pct']:>+6.1f}%")