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
        setResult(
          type == "customer" ? 
          searches.filter((search) => {
            const mobile = search.ownerMob?.toLowerCase();
            const name = search.ownerName?.toLowerCase();
            const queryLower = query.toLowerCase();
            return mobile.includes(queryLower) || name.includes(queryLower);
          })
          : 
          searches.filter((search) => {
            const ticket = search.ticketNo?.toLowerCase();
            const mobile = search.ownerMob?.toLowerCase();
            const name = search.ownerName.toLowerCase();
            const queryLower = query.toLowerCase();
            return mobile.includes(queryLower) || name.includes(queryLower) || ticket.includes(queryLower);
          })
        );
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