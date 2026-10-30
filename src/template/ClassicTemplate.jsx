
import MenuLayout from "../components/menu/MenuLayout";
import "../styles/menu.css";
import "../styles/themes/classic.css";

export default function ClassicTemplate({ hotel, menuItems }) {
  return (
    <MenuLayout
      hotel={hotel}
      menuItems={menuItems}
      theme="classic"
    />
  );
}
