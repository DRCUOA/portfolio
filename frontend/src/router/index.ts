import { createRouter, createWebHistory } from 'vue-router'
import PartitionList from '../views/PartitionList.vue'
import PartitionDetail from '../views/PartitionDetail.vue'
import ProjectView from '../views/ProjectView.vue'
import AdminDashboard from '../views/admin/AdminDashboard.vue'
import AdminPartitionList from '../views/admin/PartitionList.vue'
import AdminPartitionForm from '../views/admin/PartitionForm.vue'
import AdminProjectList from '../views/admin/ProjectList.vue'
import AdminProjectForm from '../views/admin/ProjectForm.vue'

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

export default router

