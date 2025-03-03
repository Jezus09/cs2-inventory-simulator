// Add this where you have your other navigation links in the header component
<Link
  to="/marketplace"
  className="px-4 py-2 text-white hover:text-blue-400"
  prefetch="intent"
>
  <FontAwesomeIcon icon={faStore} className="mr-2" />
  {localize("MarketplaceTitle")}
</Link>