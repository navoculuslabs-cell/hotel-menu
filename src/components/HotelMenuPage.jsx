import hotelsCsv from "../data/hotels.csv?raw";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Papa from "papaparse";
import * as XLSX from "xlsx";
import ClassicTemplate from "../template/ClassicTemplate";
import { normalizeFoodType, normalizeHeader , fetchExcelMenu} from "../utils/Utility";


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
        
        

        const items = await fetchExcelMenu(selectedHotel.excelFile.trim(), menuFiles);

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
