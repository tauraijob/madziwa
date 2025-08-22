export default defineNuxtRouteMiddleware((to, from) => {
  // Basic role-based admin gate
  const role = useCookie('role')
  const isAdmin = role.value === 'admin' || role.value === 'superadmin'

  if (!isAdmin) {
    return navigateTo('/admin-login')
  }
})