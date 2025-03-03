// Keresd meg a navigációs linkek listáját, és add hozzá ezt a kódot:

{hasUser && (
  <NavLink
    to="/marketplace"
    className={({ isActive }) =>
      `flex items-center px-4 py-2 rounded-md ${
        isActive
          ? "bg-blue-500 text-white"
          : "text-gray-700 hover:bg-gray-100"
      }`
    }
  >
    <FontAwesomeIcon icon={faStore} className="mr-2" />
    Marketplace
  </NavLink>
)}