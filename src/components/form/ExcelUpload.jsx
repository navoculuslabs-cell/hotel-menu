
import { useState } from "react";
import * as XLSX from "xlsx";

const REQUIRED_COLUMNS = [
  "name",
  "description",
  "veg/non-veg",
  "category",
  "price",
];

const normalizeHeader = (header) =>
  String(header ?? "")
    .trim()
    .toLowerCase()
    .replace(/\s*\/\s*/g, "/");

const normalizeFoodType = (value) => {
  const type = String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/[\s_-]+/g, "");

  if (["veg", "vegetarian"].includes(type)) return "Veg";

  if (
    ["nonveg", "nonvegetarian"].includes(type)
  ) {
    return "Non-Veg";
  }

  return null;
};

export default function ExcelUpload({
  onBack,
  onContinue,
}) {
  const [menuItems, setMenuItems] = useState([]);
  const [fileName, setFileName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFileUpload = async (event) => {
    const file = event.target.files?.[0];

    setError("");
    setMenuItems([]);
    setFileName("");

    if (!file) return;

    const extension = file.name
      .split(".")
      .pop()
      ?.toLowerCase();

    if (!["xlsx", "xls"].includes(extension)) {
      setError("Please upload an Excel file (.xlsx or .xls).");
      event.target.value = "";
      return;
    }

    setLoading(true);

    try {
      const buffer = await file.arrayBuffer();
      const workbook = XLSX.read(buffer, {
        type: "array",
      });

      const firstSheetName = workbook.SheetNames[0];

      if (!firstSheetName) {
        throw new Error("The Excel file has no worksheet.");
      }

      const worksheet = workbook.Sheets[firstSheetName];

      const rows = XLSX.utils.sheet_to_json(worksheet, {
        header: 1,
        defval: "",
        raw: true,
      });

      if (rows.length < 2) {
        throw new Error(
          "The worksheet must contain column headers and at least one menu item."
        );
      }

      const headers = rows[0].map(normalizeHeader);

      const missingColumns = REQUIRED_COLUMNS.filter(
        (column) => !headers.includes(column)
      );

      if (missingColumns.length > 0) {
        throw new Error(
          `Missing required columns: ${missingColumns.join(
            ", "
          )}. Please use the exact five finalized column names.`
        );
      }

      const columnIndex = Object.fromEntries(
        REQUIRED_COLUMNS.map((column) => [
          column,
          headers.indexOf(column),
        ])
      );

      const errors = [];
      const parsedItems = [];

      rows.slice(1).forEach((row, index) => {
        const excelRowNumber = index + 2;

        // Ignore completely empty rows.
        if (
          row.every(
            (cell) => String(cell ?? "").trim() === ""
          )
        ) {
          return;
        }

        const name = String(
          row[columnIndex.name] ?? ""
        ).trim();

        const description = String(
          row[columnIndex.description] ?? ""
        ).trim();

        const foodType = normalizeFoodType(
          row[columnIndex["veg/non-veg"]]
        );

        const category = String(
          row[columnIndex.category] ?? ""
        ).trim();

        const rawPrice = row[columnIndex.price];
        const price =
          typeof rawPrice === "number"
            ? rawPrice
            : Number(String(rawPrice ?? "").trim());

        const rowErrors = [];

        if (!name) rowErrors.push("Name is required.");

        if (!category) {
          rowErrors.push("Category is required.");
        }

        if (!foodType) {
          rowErrors.push(
            'Veg/Non-Veg must be "Veg" or "Non-Veg".'
          );
        }

        if (
          String(rawPrice ?? "").trim() === "" ||
          !Number.isFinite(price) ||
          price < 0
        ) {
          rowErrors.push(
            "Price must be a valid number greater than or equal to 0."
          );
        }

        if (rowErrors.length > 0) {
          errors.push(
            `Row ${excelRowNumber}: ${rowErrors.join(" ")}`
          );
          return;
        }

        parsedItems.push({
          name,
          description,
          vegNonVeg: foodType,
          category,
          price,
        });
      });

      if (errors.length > 0) {
        throw new Error(
          errors.slice(0, 8).join("\n") +
            (errors.length > 8
              ? `\nAnd ${errors.length - 8} more row error(s).`
              : "")
        );
      }

      if (parsedItems.length === 0) {
        throw new Error(
          "No valid menu items found in the Excel file."
        );
      }

      setMenuItems(parsedItems);
      setFileName(file.name);
    } catch (err) {
      setError(
        err.message || "Unable to read this Excel file."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
      <> 
     <div className="mb-6">
      <p className="text-xs font-bold uppercase tracking-widest text-[#A08448]">
        Step 2 of 4
      </p>

      <h2 className="mt-2 text-2xl font-bold tracking-tight text-[#244B3B] sm:text-3xl">
        Upload your menu
      </h2>
    </div>

    <section className="rounded-2xl border border-[#E7E0D2] bg-white p-5 shadow-sm sm:p-8">
          <div className="rounded-2xl border border-[#E7E0D2] bg-white p-5 shadow-sm sm:p-8">
          <div className="rounded-xl border-2 border-dashed border-[#C8B98F] bg-[#FCFAF5] p-6 text-center sm:p-10">
            <div className="mb-4 text-4xl">📄</div>

            <h2 className="text-lg font-semibold text-[#244B3B]">
              Upload Excel file
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              Supported formats: .xlsx and .xls
            </p>

            <label className="mt-5 inline-flex cursor-pointer items-center justify-center rounded-lg bg-[#244B3B] px-6 py-3 font-medium text-white transition hover:bg-[#19382B]">
              Choose Excel file
              <input
                type="file"
                accept=".xlsx,.xls"
                onChange={handleFileUpload}
                className="sr-only"
              />
            </label>

            {fileName && (
              <p className="mt-4 break-all text-sm font-medium text-[#244B3B]">
                Selected: {fileName}
              </p>
            )}

            {loading && (
              <p className="mt-4 text-sm text-gray-600">
                Reading and validating your menu...
              </p>
            )}
          </div>

          <div className="mt-6 rounded-xl bg-[#F7F2E8] p-4">
            <h3 className="font-semibold text-[#244B3B]">
              Required Excel columns
            </h3>

            <div className="mt-3 flex flex-wrap gap-2">
              {[
                "Name",
                "Description",
                "Veg/Non-Veg",
                "Category",
                "Price",
              ].map((column) => (
                <span
                  key={column}
                  className="rounded-full border border-[#D8CCB4] bg-white px-3 py-1.5 text-sm text-[#244B3B]"
                >
                  {column}
                </span>
              ))}
            </div>

            <p className="mt-3 text-sm text-gray-600">
              Description can be blank. The other four
              fields must be filled for every menu item.
            </p>
          </div>

          {error && (
            <div
              role="alert"
              className="mt-6 whitespace-pre-line rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700"
            >
              <p className="mb-1 font-semibold">
                Please fix the following:
              </p>
              {error}
            </div>
          )}

          {menuItems.length > 0 && (
            <div className="mt-8">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                <h2 className="text-xl font-bold text-[#244B3B]">
                  Menu preview
                </h2>

                <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-800">
                  {menuItems.length} items validated
                </span>
              </div>

              <div className="overflow-x-auto rounded-lg border border-[#E5DDCC]">
                <table className="w-full min-w-[650px] text-left text-sm">
                  <thead className="bg-[#244B3B] text-white">
                    <tr>
                      <th className="px-4 py-3">Name</th>
                      <th className="px-4 py-3">Description</th>
                      <th className="px-4 py-3">
                        Veg/Non-Veg
                      </th>
                      <th className="px-4 py-3">Category</th>
                      <th className="px-4 py-3 text-right">
                        Price
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {menuItems.map((item, index) => (
                      <tr
                        key={`${item.name}-${index}`}
                        className="border-t border-[#E5DDCC] even:bg-[#FCFAF5]"
                      >
                        <td className="px-4 py-3 font-medium text-gray-900">
                          {item.name}
                        </td>

                        <td className="max-w-xs px-4 py-3 text-gray-600">
                          {item.description || "—"}
                        </td>

                        <td className="px-4 py-3">
                          <span
                            className={
                              item.vegNonVeg === "Veg"
                                ? "text-green-700"
                                : "text-red-700"
                            }
                          >
                            {item.vegNonVeg}
                          </span>
                        </td>

                        <td className="px-4 py-3">
                          {item.category}
                        </td>

                        <td className="px-4 py-3 text-right font-medium">
                          ₹{item.price.toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <button
                type="button"
                onClick={() => onContinue(menuItems)}
                className="mt-6 w-full rounded-lg bg-[#244B3B] px-6 py-3 font-semibold text-white transition hover:bg-[#19382B] sm:w-auto"
              >
                Continue to theme selection →
              </button>
            </div>
          )}
        </div>
      </section>   
    </>
  );
}
