// Retrieves all brands from the database.

export default eventHandler(async (event) => {
  const brands = await useDB().select().from(tables.brands);

  return brands as Brand[];
});
