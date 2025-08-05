export default defineNuxtRouteMiddleware((to, from) => {
  // Simple admin authentication
  // In a real application, you would implement proper authentication
  const isAdmin = useCookie('isAdmin')
  
  if (!isAdmin.value) {
    // Redirect to admin login or show login dialog
    // For now, we'll just check if the user is authenticated
    // You can implement a proper login system later
    return navigateTo('/admin-login')
  }
}) 