export default defineNuxtRouteMiddleware(() => {
  const role = useCookie('role')
  if (role.value !== 'superadmin') {
    return navigateTo('/admin-login')
  }
})

