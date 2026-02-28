// // // User id is set by optionalAuth middleware (from JWT sub or x-user-id header).
// // export const getUserId = (req) => req.userId || req.headers['x-user-id'] || req.query.userId || 'default-user';
// export const getUserId = (req) => {
//   if (!req.user || !req.user.id) {
//     const error = new Error("Unauthorized: User not authenticated");
//     error.statusCode = 401;
//     throw error;
//   }

//   return req.user.id;
// };

export const getUserId = (req) => {
  if (!req.userId) {
    const err = new Error('Unauthorized: User not authenticated');
    err.statusCode = 401;
    throw err;
  }

  return req.userId;
};