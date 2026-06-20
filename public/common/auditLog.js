import auditLog from "../../models/auditLog.js";

export const audit = async (
  userId,
  actorRole,
  action,
  targetId,
  targetType,
  before = null,
  after = null,
) => {
  try {
    let obj = {
      actorId: userId,
      actorRole: actorRole,
      action: action,
      targetId: targetId,
      targetType: targetType,
      before: { status: before },
      after: { status: after },
      // ipAddress: ip
    };
    // const response = await auditLog.create(obj);
    return response;
  } catch (error) {
    throw error;
  }
};
