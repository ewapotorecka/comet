export const toggleFavorites = ({
  symbol,
  name,
}: {
  symbol: string;
  name: string;
}) => {
  const favorites = localStorage.getItem("favorites");

  if (favorites) {
    const favoritesToUpdate = JSON.parse(favorites);

    if (
      favoritesToUpdate.findIndex(
        (el: { symbol: string; name: string }) => el.symbol === symbol
      ) >= 0
    ) {
      favoritesToUpdate.splice(
        favoritesToUpdate.findIndex(
          (el: { symbol: string; name: string }) => el.symbol === symbol
        ),
        1
      );
      localStorage.setItem("favorites", JSON.stringify(favoritesToUpdate));
    } else {
      favoritesToUpdate.push({ symbol, name });
      localStorage.setItem("favorites", JSON.stringify(favoritesToUpdate));
    }
  } else {
    localStorage.setItem("favorites", JSON.stringify([{ symbol, name }]));
  }
};
