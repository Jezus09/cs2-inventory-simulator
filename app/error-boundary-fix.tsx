// Enhanced error boundary component
export function ErrorBoundary() {
  const routeError = useRouteError();
  const error = routeError instanceof Error ? routeError : 
                typeof routeError === 'string' ? new Error(routeError) :
                new Error('Unknown error occurred');
  
  console.error("Application error:", error);
  
  return (
    <html>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Links />
      </head>
      <div className="flex h-screen w-screen items-center justify-center bg-blue-500 font-mono text-white">
        <div className="lg:w-[1024px]">
          <FontAwesomeIcon icon={faFrown} className="h-16" />
          <h1 className="mt-4 text-lg