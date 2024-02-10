import { useEffect, useState } from "react";

function useSearch(searches, type) {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState(searches);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    if (query === "") {
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
                return mobile.includes(queryLower) || name.startsWith(queryLower);
              })
            );
            break;
          case "ticket":
            setResult(
              searches.filter((search) => {
                const ticket = search.ticketNo?.toLowerCase();
                const mobile = search.ownerMob?.toLowerCase();
                const name = search.ownerName?.toLowerCase();
                return mobile.includes(queryLower) || name.startsWith(queryLower) || ticket.startsWith(queryLower);
              })
            );
            break;
          case "service":
            setResult(
              searches.filter((search) => {
                const name = search.name?.toLowerCase();
                return name.includes(queryLower);
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
  }, [query, searches]);

  return { query, setQuery, result, searching };
}

export default useSearch;
