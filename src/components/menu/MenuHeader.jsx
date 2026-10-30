
import { useTranslation } from "react-i18next";

export default function MenuHeader({ hotel }) {
  const { t } = useTranslation();

  return (
    <header className="menu-header">
      <p className="menu-eyebrow">
        {t("welcome")}
      </p>

      <h1 className="menu-hotel-name">
        {hotel?.name || t("yourRestaurant")}
      </h1>

      {hotel?.tagline && (
        <p className="menu-tagline">
          {hotel.tagline}
        </p>
      )}

      <p className="menu-subtitle">
        {t("menuSubtitle")}
      </p>
    </header>
  );
}
