function PharmacistSidebar({
  activePage,
  setActivePage,
}) {
  const menuItems = [
    {
      id: "dashboard",
      label: "Dashboard",
    },
    {
      id: "inventory",
      label: "Medicine Inventory",
    },
    {
      id: "stock-history",
      label: "Stock History",
    },
    {
      id: "allotment",
      label: "Allot Medicine",
    },
    {
      id: "billing",
      label: "Pharmacy Billing",
    },
    {
      id: "reports",
      label: "Sales Reports",
    },
  ];

  return (
    <aside className="pharmacist-sidebar">
      <div className="sidebar-header">
        <h2>Pharmacy</h2>

        <p>Clinic Management System</p>
      </div>

      <div className="sidebar-menu">
        {menuItems.map((item) => (
          <button
            key={item.id}
            className={
              activePage === item.id
                ? "sidebar-item active"
                : "sidebar-item"
            }
            onClick={() => setActivePage(item.id)}
          >
            {item.label}
          </button>
        ))}
      </div>
    </aside>
  );
}

export default PharmacistSidebar;