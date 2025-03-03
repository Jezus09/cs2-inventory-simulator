              type="submit"
              disabled={isLoading}
              className="flex items-center rounded-md bg-blue-500 px-4 py-2 text-white transition hover:bg-blue-600"
            >
              {isLoading ? (
                <FontAwesomeIcon icon={faSpinner} spin className="mr-2" />
              ) : (
                <FontAwesomeIcon icon={faTag} className="mr-2" />
              )}
              {localize("MarketplaceList")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}