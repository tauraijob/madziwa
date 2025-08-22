export default defineNuxtRouteMiddleware(() => {
  const role = useCookie('role')
  if (role.value !== 'supervisor') {
    return navigateTo('/supervisor-login')
  }
})

