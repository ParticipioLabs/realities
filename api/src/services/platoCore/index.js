import platoCore from 'plato-core';

const { db: { getConnection, getModels } } = platoCore;

// eslint-disable-next-line import/prefer-default-export
export async function getCoreModels() {
  const coreDb = await getConnection(process.env.MONGO_URL);
  return getModels(coreDb);
}
