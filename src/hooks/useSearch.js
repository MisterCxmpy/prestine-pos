import { useEffect, useState } from "react";
import { useService } from "../contexts/ServiceContext";

function useSearch(searches, type) {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState(searches);
  const [searching, setSearching] = useState(false);
  const { service } = useService()

  useEffect(() => {
    if (query === "" && type != "service") {
      setResult(searches);
    } else {
      if (searches.length) {
        const queryLower = query.toLowerCase();

        switch (type) {
          case "customer":
            setResult(
              searches.filter((search) => {
                const mobile = search.ownerMob?.toLowerCase();
                const name = search.ownerName?.toLowerCase();
                return (
                  mobile?.includes(queryLower) || name?.startsWith(queryLower)
                );
              })
            );
            break;
          case "ticket":
            setResult(
              searches.filter((search) => {
                const ticket = search.ticketNo?.toLowerCase();
                const mobile = search.ownerMob?.toLowerCase();
                const name = search.ownerName?.toLowerCase();
                return (
                  mobile?.includes(queryLower) ||
                  name?.startsWith(queryLower) ||
                  ticket?.includes(queryLower)
                );
              })
            );
            break;
          case "service":
            let type = service.length ? service : searches;
            setResult(
              type.filter((search) => {
                const name = search.name?.toLowerCase();
                return name?.includes(queryLower);
              })
            );
            break;
          default:
            break;
        }
      }
    }

    if (query !== "") {
      setSearching(true);
    }

    return () => {
      setSearching(false);
    };
  }, [query, searches, service]);

  return { query, setQuery, result, searching };
}

export default useSearch;
