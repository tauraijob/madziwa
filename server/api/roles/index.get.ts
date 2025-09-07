export default defineEventHandler(async (event) => {
  // Static roles for now
  const role = getCookie(event, 'role')
  if (role !== 'superadmin') {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }
  return { roles: ['admin', 'superadmin'] }
})

