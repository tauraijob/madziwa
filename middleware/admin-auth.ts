export default defineNuxtRouteMiddleware((to, from) => {
  // Basic role-based admin gate
  const role = useCookie('role')
  const isAdmin = role.value === 'admin' || role.value === 'superadmin'
  // Enforce view-only for admins by hiding export routes pages (client-side guard)
  if (role.value === 'admin' && to.path.startsWith('/api/assessments/export')) {
    return navigateTo('/admin')
  }

  if (!isAdmin) {
    return navigateTo('/admin-login')
  }
})