import { defineStore } from 'pinia'
import type { ApplicationStatus } from '../types/application'

export const useApplicationListStore = defineStore('application-list', {
  state: () => ({
    key: '',
    name: '',
    project_id: '',
    status: '' as ApplicationStatus | '',
    page: 1,
    pageSize: 6,
  }),
  actions: {
    setPage(page: number, pageSize: number) {
      this.page = page
      this.pageSize = pageSize
    },
    resetFilters() {
      this.key = ''
      this.name = ''
      this.project_id = ''
      this.status = ''
      this.page = 1
      this.pageSize = 6
    },
  },
})
