import hotelsCsv from "../data/hotels.csv?raw";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Papa from "papaparse";
import * as XLSX from "xlsx";
import ClassicTemplate from "../template/ClassicTemplate";
import hotel1MenuUrl from "../data/menus/hotel-1-menu.xlsx?url";
import hotel2MenuUrl from "../data/menus/hotel-2-menu.xlsx?url";
import hotel3MenuUrl from "../data/menus/hotel-3-menu.xlsx?url";

const MENU_URLS = {
  "hotel-1": hotel1MenuUrl,
  "hotel-2": hotel2MenuUrl,
  "hotel-3": hotel3MenuUrl,
};

function normalizeHeader(value) {
  return String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/\s*\/\s*/g, "/");
}

function normalizeFoodType(value) {
  const type = String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/[\s_-]+/g, "");

  if (["veg", "vegetarian"].includes(type)) return "Veg";

  if (["nonveg", "nonvegetarian"].includes(type)) {
    return "Non-Veg";
  }

  return null;
}

async function fetchCsv(url) {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Unable to load the hotel registry.");
  }

  const csvText = await response.text();

  const result = Papa.parse(csvText, {
    header: true,
    skipEmptyLines: true,
    transformHeader: (header) => header.trim(),
  });

  if (result.errors.length > 0) {
    throw new Error("The hotel registry CSV is invalid.");
  }

  return result.data;
}

async function fetchExcelMenu(url) {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Unable to load this hotel's Excel menu.");
  }

  const buffer = await response.arrayBuffer();
  const workbook = XLSX.read(buffer, { type: "array" });

  const firstSheetName = workbook.SheetNames[0];

  if (!firstSheetName) {
    throw new Error("The Excel file contains no worksheet.");
  }

  const worksheet = workbook.Sheets[firstSheetName];

  const rows = XLSX.utils.sheet_to_json(worksheet, {
    header: 1,
    defval: "",
    raw: true,
  });

  if (rows.length < 2) {
    throw new Error("The Excel menu has no menu items.");
  }

  const headers = rows[0].map(normalizeHeader);

  const requiredColumns = [
    "name",
    "description",
    "veg/non-veg",
    "category",
    "price",
  ];

  const missingColumns = requiredColumns.filter(
    (column) => !headers.includes(column)
  );

  if (missingColumns.length > 0) {
    throw new Error(
      `Excel file is missing columns: ${missingColumns.join(", ")}`
    );
  }

  const indexes = Object.fromEntries(
    requiredColumns.map((column) => [
      column,
      headers.indexOf(column),
    ])
  );

  const menuItems = rows.slice(1)
    .filter((row) =>
      row.some((cell) => String(cell ?? "").trim() !== "")
    )
    .map((row, index) => {
      const name = String(
        row[indexes.name] ?? ""
      ).trim();

      const description = String(
        row[indexes.description] ?? ""
      ).trim();

      const category = String(
        row[indexes.category] ?? ""
      ).trim();

      const vegNonVeg = normalizeFoodType(
        row[indexes["veg/non-veg"]]
      );

      const rawPrice = row[indexes.price];
      const price =
        typeof rawPrice === "number"
          ? rawPrice
          : Number(String(rawPrice ?? "").trim());

      if (
        !name ||
        !category ||
        !vegNonVeg ||
        String(rawPrice ?? "").trim() === "" ||
        !Number.isFinite(price) ||
        price < 0
      ) {
        throw new Error(
          `Invalid menu data near Excel row ${index + 2}.`
        );
      }

      return {
        name,
        description,
        vegNonVeg,
        category,
        price,
      };
    });

  if (menuItems.length === 0) {
    throw new Error("No menu items were found.");
  }

  return menuItems;
}

export default function HotelMenuPage() {
  const { id } = useParams();

  const [hotel, setHotel] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadHotelMenu() {
      setLoading(true);
      setError("");
      setHotel(null);
      setMenuItems([]);

      try {
        if (!/^\d+$/.test(id ?? "")) {
          throw new Error("Invalid hotel ID.");
        }

        const result = Papa.parse(hotelsCsv, {
            header: true,
            skipEmptyLines: true,
            transformHeader: (header) => header.trim(),
          });
          
          if (result.errors.length > 0) {
            throw new Error("The hotel registry CSV is invalid.");
          }
          
          const hotels = result.data;
        const selectedHotel = hotels.find(
          (item) => item.id?.trim() === id
        );

        if (!selectedHotel) {
          throw new Error("Hotel not found.");
        }

        if (
          !selectedHotel.name?.trim() ||
          !selectedHotel.menuType?.trim() ||
          !selectedHotel.excelFile?.trim()
        ) {
          throw new Error(
            "The hotel's registry entry is incomplete."
          );
        }

        // This MVP currently supports the Classic template.
        if (
          selectedHotel.menuType.trim().toLowerCase() !==
          "classic"
        ) {
          throw new Error("This menu template is not supported yet.");
        }

        // Only allow a filename, not a path supplied through the CSV.
        const fileName = selectedHotel.excelFile.trim();

        if (
          !/^[a-zA-Z0-9_-]+\.xlsx$/i.test(fileName)
        ) {
          throw new Error("Invalid Excel filename in the registry.");
        }

        const menuFiles = import.meta.glob("../data/menus/*.xlsx", {
          query: "?url",
          import: "default",
          eager: true,
        });
        
        function getMenuUrl(fileName) {
          const match = Object.entries(menuFiles).find(([path]) =>
            path.endsWith(`/${fileName}`)
          );
        
          return match?.[1];
        }
        
        const items = await fetchExcelMenu(getMenuUrl(selectedHotel.excelFile.trim()));

        if (cancelled) return;

        setHotel({
          ...selectedHotel,
          name: selectedHotel.name.trim(),
          phone: selectedHotel.phone?.trim() ?? "",
          address: selectedHotel.address?.trim() ?? "",
        });

        setMenuItems(items);
      } catch (err) {
        if (!cancelled) {
          setError(
            err.message || "Unable to load this menu."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadHotelMenu();

    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#F7F2E8] p-6">
        <p className="text-[#244B3B]">Loading menu...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#F7F2E8] p-6">
        <div className="max-w-md text-center">
          <h1 className="text-2xl font-bold text-[#244B3B]">
            Menu unavailable
          </h1>
          <p className="mt-3 text-sm leading-6 text-gray-600">
            {error}
          </p>
        </div>
      </main>
    );
  }

  return (
    <ClassicTemplate
      hotel={hotel}
      menuItems={menuItems}
    />
  );
}
