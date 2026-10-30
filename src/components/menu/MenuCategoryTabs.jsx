
export default function MenuCategoryTabs({
    categories,
    selectedCategory,
    onSelect,
  }) {
    const tabs = ["All", ...categories];
  
    return (
      <nav className="menu-category-tabs" aria-label="Menu categories">
        {tabs.map((category) => (
          <button
            type="button"
            key={category}
            onClick={() => onSelect(category)}
            className={`category-tab ${
              selectedCategory === category ? "active" : ""
            }`}
            aria-pressed={selectedCategory === category}
          >
            {category}
          </button>
        ))}
      </nav>
    );
  }
  