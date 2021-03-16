import { getCoreModels } from '../../services/platoCore';

// eslint-disable-next-line import/prefer-default-export, no-unused-vars
export async function loadFixtures(driver) {
  console.log('Loading fixtures for tests');

  const coreModels = await getCoreModels();

  const testOrg = new coreModels.Organization({
    name: 'Test org',
    subdomain: 'test-org',
  });
  await testOrg.save();

  console.log('Finished loading fixtures');
}
