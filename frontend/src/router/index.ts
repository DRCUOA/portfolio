import { createRouter, createWebHistory } from 'vue-router'
import { usePortfolioStore } from '../stores/portfolio'
import PartitionList from '../views/PartitionList.vue'
import PartitionDetail from '../views/PartitionDetail.vue'
import ProjectView from '../views/ProjectView.vue'
import AdminDashboard from '../views/admin/AdminDashboard.vue'
import AdminPartitionList from '../views/admin/PartitionList.vue'
import AdminPartitionForm from '../views/admin/PartitionForm.vue'
import AdminProjectList from '../views/admin/ProjectList.vue'
import AdminProjectForm from '../views/admin/ProjectForm.vue'
import AdminPortList from '../views/admin/PortList.vue'
import AdminPortForm from '../views/admin/PortForm.vue'
import AdminTrafficAnalytics from '../views/admin/TrafficAnalytics.vue'
import AdminTVDashboard from '../views/admin/TVDashboard.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: PartitionList,
    },
    {
      path: '/partitions/:slug',
      name: 'partition',
      component: PartitionDetail,
      props: true,
    },
    {
      path: '/projects/:slug',
      name: 'project',
      component: ProjectView,
      props: true,
    },
    {
      path: '/apps/:slug',
      name: 'app-store',
      component: ProjectView,
      props: true,
    },
    {
      path: '/admin',
      name: 'admin',
      component: AdminDashboard,
    },
    {
      path: '/admin/partitions',
      name: 'admin-partitions',
      component: AdminPartitionList,
    },
    {
      path: '/admin/partitions/new',
      name: 'new-partition',
      component: AdminPartitionForm,
    },
    {
      path: '/admin/partitions/:id/edit',
      name: 'edit-partition',
      component: AdminPartitionForm,
      props: true,
    },
    {
      path: '/admin/projects',
      name: 'admin-projects',
      component: AdminProjectList,
    },
    {
      path: '/admin/projects/new',
      name: 'new-project',
      component: AdminProjectForm,
    },
    {
      path: '/admin/projects/:id/edit',
      name: 'edit-project',
      component: AdminProjectForm,
      props: true,
    },
    {
      path: '/admin/ports',
      name: 'admin-ports',
      component: AdminPortList,
    },
    {
      path: '/admin/ports/new',
      name: 'new-port',
      component: AdminPortForm,
    },
    {
      path: '/admin/ports/:id/edit',
      name: 'edit-port',
      component: AdminPortForm,
      props: true,
    },
    {
      path: '/admin/traffic',
      name: 'admin-traffic',
      component: AdminTrafficAnalytics,
    },
    {
      path: '/admin/tv',
      name: 'admin-tv',
      component: AdminTVDashboard,
    },
  ],
  scrollBehavior(_to, _from, savedPosition) {
    // Always scroll to top on route change (instant for immediate positioning)
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0, behavior: 'instant' }
    }
  },
})

// Navigation guard to track clicks
router.beforeEach((to, _from, next) => {
  // Track clicks to project/app routes
  if (to.name === 'project' || to.name === 'app-store') {
    const slug = to.params.slug as string
    if (slug) {
      // Find the port ID based on project slug
      // Try to match project slug to port (e.g., "portfolio" -> "portfolio-frontend" or "portfolio-backend")
      const store = usePortfolioStore()
      
      // Use frontend port for tracking clicks (users click through frontend)
      const portId = `${slug}-frontend`
      
      // Log click asynchronously to not block navigation
      setTimeout(() => {
        store.logClick(portId, {
          route: to.name,
          slug,
          path: to.path,
          timestamp: new Date().toISOString(),
        })
      }, 0)
    }
  }
  
  next()
})

export default router

