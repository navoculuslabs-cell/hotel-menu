
import { useMemo, useState, useEffect } from "react";
import MenuHeader from "./MenuHeader";
import MenuCategoryTabs from "./MenuCategoryTabs";
import MenuItem from "./MenuItem";
import MenuFilters from "./MenuFilters";
import { useTranslation } from "react-i18next";
import LanguageSelector from "./LanguageSelector";
import GoogleTranslate from "./GoogleTranslate";

export default function MenuLayout({
  hotel,
  menuItems = [],
  theme = "classic"
}) {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [pureVeg, setPureVeg] = useState(false);

  const { t, i18n } = useTranslation();

  const language = (i18n.resolvedLanguage || "en").split("-")[0].toLowerCase();

  // Reset selected category whenever language changes
  useEffect(() => {
    setSelectedCategory("All");
  }, [language]);

  // Get category in selected language
  const getCategoryName = (item) => {
    const lang = language.toUpperCase();

    return (
      item[`Category_${lang}`] ||
      item[`category_${language}`] ||
      item.Category_EN ||
      item.category_EN ||
      item.category ||
      ""
    );
  };

  // Build translated category list
  const categories = useMemo(() => {
    return [
      ...new Set(
        menuItems
          .map((item) => getCategoryName(item))
          .filter(Boolean)
      )
    ];
  }, [menuItems, language]);

  // Filter menu items
  const filteredItems = useMemo(() => {
    return menuItems.filter((item) => {
      const category = getCategoryName(item);

      const matchesCategory =
        selectedCategory === "All" ||
        category === selectedCategory;

      const foodType = String(
        item.vegNonVeg || item["Veg/Non-Veg"] || ""
      ).trim().toLowerCase();

      const matchesVeg =
        !pureVeg ||
        foodType === "veg" ||
        foodType === "vegetarian";

      return matchesCategory && matchesVeg;
    });
  }, [menuItems, selectedCategory, pureVeg, language]);

  return (
    <main className="menu-page" data-theme={theme}>
      <div className="menu-container">

      <GoogleTranslate />
        {/* Language Selector */}
        <LanguageSelector />

        {/* Hotel Header */}
        <MenuHeader hotel={hotel} />

        {/* Filters */}
        <MenuFilters
          pureVeg={pureVeg}
          onPureVegChange={setPureVeg}
        />

        {/* Category Tabs */}
        <MenuCategoryTabs
          categories={categories}
          selectedCategory={selectedCategory}
          onSelect={setSelectedCategory}
          allLabel={t("all")}
        />

        {/* Menu Items */}
        <section className="menu-items">
          {filteredItems.length > 0 ? (
            filteredItems.map((item, index) => (
              <MenuItem
                key={`${item.Name_EN || item.name || index}-${index}`}
                item={item}
                language={language}
              />
            ))
          ) : (
            <div className="menu-empty">
              {t("noItems")}
            </div>
          )}
        </section>

        {/* Footer */}
        <footer className="menu-footer">
          {hotel?.address && (
            <p>{hotel.address}</p>
          )}

          {hotel?.phone && (
            <p>{hotel.phone}</p>
          )}

          <p className="menu-footer-message">
            {t("thankYou")}
          </p>
        </footer>

      </div>
    </main>
  );
}
