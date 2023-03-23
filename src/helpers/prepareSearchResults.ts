export const prepareSearchResults = (
  data: { "1. symbol": string; "2. name": string }[]
) => {
  if (!data) {
    return [];
  }
  const result = data.map((el) => {
    return { symbol: el["1. symbol"], name: el["2. name"] };
  });

  return result;
};
