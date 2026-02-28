import { defineStore } from 'pinia'
import api from '../services/api'
export const useAdminRankingsStore = defineStore('adminRankings', {
    state: () => ({
        loading: false,
        error: null,

        releases: [],
        releaseDetail: null, // { release, counts, stagingRows }

        selectedRowId: null,
        candidatesByRowId: {}
    }),

    getters: {
        counts(state) {
            return state.releaseDetail?.counts || { total: 0, resolved: 0, needsReview: 0 }
        },
        stagingRows(state) {
            return state.releaseDetail?.stagingRows || []
        }
    },

    actions: {
        async fetchReleases() {
            this.loading = true; this.error = null
            try {
                const { data } = await api.get('/api/admin/rankings/releases')
                this.releases = data
            } catch (err) {
                this.error = err.response?.data?.error || err.message
            } finally {
                this.loading = false
            }
        },

        async createRelease(payload) {
            this.loading = true; this.error = null
            try {
                const { data } = await api.post('/api/admin/rankings/releases', payload)
                return data
            } catch (err) {
                this.error = err.response?.data?.error || err.message
                throw err
            } finally {
                this.loading = false
            }
        },

        async fetchReleaseDetail(releaseId) {
            this.loading = true; this.error = null
            try {
                const { data } = await api.get(`/api/admin/rankings/releases/${releaseId}`)
                this.releaseDetail = data
            } catch (err) {
                this.error = err.response?.data?.error || err.message
            } finally {
                this.loading = false
            }
        },

        async importPaste(releaseId, payload) {
            this.loading = true; this.error = null
            try {
                await api.post(`/api/admin/rankings/releases/${releaseId}/import`, payload)
                await this.fetchReleaseDetail(releaseId)
            } catch (err) {
                // show parsing details if backend returns them
                const details = err.response?.data?.details
                this.error = details ? `${err.response?.data?.error}: ${details.join(' | ')}` : (err.response?.data?.error || err.message)
                throw err
            } finally {
                this.loading = false
            }
        },

        async publishRelease(releaseId) {
            this.loading = true; this.error = null
            try {
                await api.post(`/api/admin/rankings/releases/${releaseId}/publish`)
                await this.fetchReleaseDetail(releaseId)
            } catch (err) {
                this.error = err.response?.data?.error || err.message
                throw err
            } finally {
                this.loading = false
            }
        },

        async attachWrestlestatIds(items) {
            this.loading = true; this.error = null
            try {
                const { data } = await api.post('/api/admin/rankings/staging/attach', { items })
                return data
            } catch (err) {
                this.error = err.response?.data?.error || err.message
                throw err
            } finally {
                this.loading = false
            }
        },

        // async attachWrestlestatId(rowId, wrestlestatId, releaseId) {
        //     this.loading = true; this.error = null
        //     try {
        //         await api.post(`/api/admin/rankings/staging/${rowId}/attach`, { wrestlestatId })
        //         if (releaseId) await this.fetchReleaseDetail(releaseId)
        //     } catch (err) {
        //         this.error = err.response?.data?.error || err.message
        //         throw err
        //     } finally {
        //         this.loading = false
        //     }
        // },

        async clearWeight(releaseId, weightClass) {
            this.loading = true; this.error = null
            console.log("clearing weight")
            try {
                await api.delete(`/api/admin/rankings/releases/${releaseId}/staging`, { params: { weightClass } })
                await this.fetchReleaseDetail(releaseId)
            } catch (err) {
                this.error = err.response?.data?.error || err.message
                throw err
            } finally {
                this.loading = false
            }
        },

        async bulkLookupCandidates(releaseId, weightClass) {
            this.loading = true; this.error = null
            try {
                const { data } = await api.post(`/api/admin/rankings/releases/${releaseId}/resolve/lookup`, null, {
                    params: { weightClass }
                })

                // Cache by rowId for fast UI rendering
                const map = {}
                for (const r of (data.rows || [])) {
                    map[r.rowId] = r.candidates || []
                }
                this.candidatesByRowId = { ...this.candidatesByRowId, ...map }

                return data
            } catch (err) {
                this.error = err.response?.data?.error || err.message
                throw err
            } finally {
                this.loading = false
            }
        },
    }
})
