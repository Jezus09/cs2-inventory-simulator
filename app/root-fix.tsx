// Update the loader in app/root.tsx to handle URL-related errors
export async function loader({ request }: LoaderFunctionArgs) {
  await middleware(request);
  const session = await getSession(request.headers.get("Cookie"));
  const user = await findRequestUser(request);
  const ipCountry = request.headers.get("CF-IPCountry");
  
  // Handle the callback URL with proper error handling
  let appUrl = "http://localhost:3000";
  let appSiteName = "CS2 Inventory";
  
  try {
    const callbackUrlRule = await getRule("steamCallbackUrl");
    if (callbackUrlRule) {
      const url = new URL(callbackUrlRule);
      appUrl = url.origin;
      appSiteName = url.host;
    }
  } catch (error) {
    console.error("Error parsing steamCallbackUrl:", error);
    // Continue with default values
  }
  
  return typedjson({
    localization: {
      checksum: getLocalizationChecksum()
    },
    rules: {
      ...(await getRules(
        [
          // Your existing rules...
        ],
        user?.id
      )),
      buildLastCommit: BUILD_LAST_COMMIT,
      meta: { appUrl, appSiteName }
    },
    preferences: {
      ...(await getBackground(session)),
      ...(await getLanguage(session, ipCountry)),
      ...(await getToggleable(session))
    },
    user
  });
}