
import { useTranslation } from "react-i18next";

export default function MenuFilters({
  pureVeg,
  onPureVegChange,
}) {
  const { t } = useTranslation();

  return (
    <div className="menu-filters">
      <span className="filter-label"></span>

      <button
        type="button"
        role="switch"
        aria-checked={pureVeg}
        onClick={() => onPureVegChange(!pureVeg)}
        className={`veg-toggle ${pureVeg ? "active" : ""}`}
      >
        <span className="veg-indicator" />

        <span>{t("pureVeg")}</span>

        <span className="toggle-track">
          <span className="toggle-thumb" />
        </span>
      </button>
    </div>
  );
}
