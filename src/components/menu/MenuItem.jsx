
import { useTranslation } from "react-i18next";

const formatPrice = (price) =>
  `₹${Number(price || 0).toLocaleString("en-IN", {
    maximumFractionDigits: 2,
  })}`;

export default function MenuItem({ item, language = "en" }) {
  const { t } = useTranslation();

  const lang = language.split("-")[0].toUpperCase();

  const getValue = (field, oldField) => {
    return (
      item[`${field}_${lang}`] ||
      item[`${field}_EN`] ||
      item[oldField] ||
      item[field] ||
      ""
    );
  };

  const name = getValue("Name", "name");
  const description = getValue("Description", "description");

  const isVeg =
    String(item.vegNonVeg || item["Veg/Non-Veg"] || "")
      .trim()
      .toLowerCase() === "veg";

  return (
    <article className="menu-item">
      <div className="menu-item-details">
        <div className="menu-item-title">
          <span
            className={`food-indicator ${isVeg ? "veg" : "non-veg"}`}
            aria-label={isVeg ? t("vegetarian") : t("nonVegetarian")}
            title={isVeg ? t("vegetarian") : t("nonVegetarian")}
          >
            <span />
          </span>

          <h3>{name}</h3>
        </div>

        {description && (
          <p className="menu-item-description">
            {description}
          </p>
        )}
      </div>

      <p className="menu-item-price">
        {formatPrice(item.price ?? item.Price)}
      </p>
    </article>
  );
}
