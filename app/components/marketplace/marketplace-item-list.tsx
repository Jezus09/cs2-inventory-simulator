/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Ian Lucas. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

// ... a korábbi kód folytatása

                ) : (
                  <button
                    onClick={() => handleBuyItem(item)}
                    disabled={processingId === item.id || userBalance < item.price}
                    className={`flex w-full items-center justify-center rounded-md px-4 py-2 transition ${
                      userBalance < item.price
                        ? "cursor-not-allowed bg-gray-300 text-gray-500"
                        : "bg-green-500 text-white hover:bg-green-600"
                    }`}
                  >
                    {processingId === item.id ? (
                      <FontAwesomeIcon icon={faSpinner} spin className="mr-2" />
                    ) : (
                      <FontAwesomeIcon icon={faMoneyBill} className="mr-2" />
                    )}
                    {localize("MarketplaceBuyNow")}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Pagination controls */}
      {pagination.totalPages > 1 && (
        <div className="mt-6 flex justify-center">
          <div className="flex items-center space-x-1">
            <button
              onClick={() => onPageChange(Math.max(1, pagination.page - 1))}
              disabled={pagination.page === 1}
              className={`rounded-md px-3 py-1 ${
                pagination.page === 1
                  ? "cursor-not-allowed bg-gray-100 text-gray-400"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              &laquo; Prev
            </button>
            
            {/* Page numbers */}
            {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
              const pageNum = pagination.page > 3 && pagination.totalPages > 5
                ? pagination.page - 3 + i + (pagination.page + 2 > pagination.totalPages ? pagination.totalPages - (pagination.page + 2) : 0)
                : i + 1;
                
              if (pageNum > pagination.totalPages) return null;
              
              return (
                <button
                  key={pageNum}
                  onClick={() => onPageChange(pageNum)}
                  className={`rounded-md px-3 py-1 ${
                    pagination.page === pageNum
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
            
            <button
              onClick={() => onPageChange(Math.min(pagination.totalPages, pagination.page + 1))}
              disabled={pagination.page === pagination.totalPages}
              className={`rounded-md px-3 py-1 ${
                pagination.page === pagination.totalPages
                  ? "cursor-not-allowed bg-gray-100 text-gray-400"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              Next &raquo;
            </button>
          </div>
        </div>
      )}
    </div>
  );
}