import { createRouter, createWebHistory } from 'vue-router'
import PartitionList from '../views/PartitionList.vue'
import PartitionDetail from '../views/PartitionDetail.vue'
import ProjectDetail from '../views/ProjectDetail.vue'
import AppStoreView from '../views/AppStoreView.vue'
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
      component: ProjectDetail,
      props: true,
    },
    {
      path: '/apps/:slug',
      name: 'app-store',
      component: AppStoreView,
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
})

export default router

