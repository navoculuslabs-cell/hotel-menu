import Papa from "papaparse";
import * as XLSX from "xlsx";

export const REQUIRED_MENU_COLUMNS = [
  "name",
  "description",
  "veg/non-veg",
  "category",
  "price",
];

const menuFiles = import.meta.glob("../data/menus/*.xlsx", {
  query: "?url",
  import: "default",
  eager: true,
});

export function normalizeHeader(value) {
  return String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/\s*\/\s*/g, "/");
}

export function normalizeFoodType(value) {
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

export function parseHotelsCsv(csvText) {
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

export function getMenuUrl(fileName) {
  const match = Object.entries(menuFiles).find(([path]) =>
    path.endsWith(`/${fileName}`)
  );

  return match?.[1];
}

export async function fetchExcelMenu(url) {
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

  const rows = XLSX.utils.sheet_to_json(workbook.Sheets[firstSheetName], {
    header: 1,
    defval: "",
    raw: true,
  });

  if (rows.length < 2) {
    throw new Error("The Excel menu has no menu items.");
  }

  const headers = rows[0].map(normalizeHeader);

  const missingColumns = REQUIRED_MENU_COLUMNS.filter(
    (column) => !headers.includes(column)
  );

  if (missingColumns.length > 0) {
    throw new Error(
      `Excel file is missing columns: ${missingColumns.join(", ")}`
    );
  }

  const indexes = Object.fromEntries(
    REQUIRED_MENU_COLUMNS.map((column) => [column, headers.indexOf(column)])
  );

  const menuItems = rows
    .slice(1)
    .filter((row) =>
      row.some((cell) => String(cell ?? "").trim() !== "")
    )
    .map((row, index) => {
      const name = String(row[indexes.name] ?? "").trim();
      const description = String(row[indexes.description] ?? "").trim();
      const category = String(row[indexes.category] ?? "").trim();
      const vegNonVeg = normalizeFoodType(row[indexes["veg/non-veg"]]);
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
        throw new Error(`Invalid menu data near Excel row ${index + 2}.`);
      }

      return { name, description, vegNonVeg, category, price };
    });

  if (menuItems.length === 0) {
    throw new Error("No menu items were found.");
  }

  return menuItems;
}