<template>
    <q-page class="q-pa-md">
        <div class="row items-center q-col-gutter-md">
            <div class="col">
                <div class="text-h5">Rankings Releases</div>
                <div class="text-caption text-grey-7">Weekly ranking releases (draft → published).</div>
            </div>
            <div class="col-auto">
                <q-btn color="primary" icon="add" label="Create Release" to="/admin/rankings/new" />
            </div>
        </div>

        <q-separator class="q-my-md" />

        <q-banner v-if="store.error" class="bg-red-1 text-red-9 q-mb-md" rounded>
            {{ store.error }}
        </q-banner>

        <q-table :rows="store.releases" :columns="columns" row-key="id" :loading="store.loading" flat bordered>
            <template #body-cell-actions="props">
                <q-td :props="props">
                    <q-btn flat dense icon="open_in_new" label="Open" :to="`/admin/rankings/${props.row.id}`" />
                </q-td>
            </template>
        </q-table>
    </q-page>
</template>

<script setup>
import { onMounted } from 'vue'
import { useAdminRankingsStore } from '../../../store/adminRankings.store'

const store = useAdminRankingsStore()

const columns = [
    { name: 'weekOf', label: 'Week Of', field: 'weekOf', sortable: true },
    { name: 'source', label: 'Source', field: 'source', sortable: true },
    { name: 'season', label: 'Season', field: 'season', sortable: true },
    { name: 'status', label: 'Status', field: 'status', sortable: true },
    { name: 'progress', label: 'Resolved', field: row => `${row.resolved}/${row.total}`, sortable: false },
    { name: 'needsReview', label: 'Needs Review', field: 'needsReview', sortable: true },
    { name: 'actions', label: '', field: 'actions' }
]

onMounted(() => store.fetchReleases())
</script>
