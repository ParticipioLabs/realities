import platoCore from 'plato-core';

const { db: { getConnection, getModels } } = platoCore;

export async function getCoreModels() {
  const coreDb = await getConnection(process.env.MONGO_URL);
  return getModels(coreDb);
}

export async function createOrgMembership({ coreModels, userId, orgId }) {
  // idempotently creates user org membership in core
  if (userId === undefined) {
    return null;
  }

  const wantedUser = {
    userId,
    organizationId: orgId,
  };

  // NOTE: there should be 1 OrgMember doc per user<->org pair. i.e. one user
  // can have more than 1 OrgMember doc
  return coreModels.OrgMember.findOneAndUpdate(wantedUser, {}, {
    new: true,
    upsert: true, // creates the membership if it's missing
    setDefaultsOnInsert: true,
  });
  // we run findOneAndUpdate instead of findOne followed by a new...save()
  // to avoid race conditions. OrgMembers have to be unique on userId+orgId
  // so if save() runs into a collision the app crashes
}
