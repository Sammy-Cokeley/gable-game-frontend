<template>
    <q-page class="q-pa-md">
        <div class="row items-center q-col-gutter-md">
            <div class="col">
                <div class="text-h5">Release</div>
                <div class="text-caption text-grey-7">{{ headerText }}</div>
            </div>

            <div class="col-auto">
                <q-btn icon="publish" label="Publish" color="positive" :loading="store.loading" :disable="!canPublish"
                    @click="onPublish" />
            </div>
        </div>

        <q-separator class="q-my-md" />

        <q-banner v-if="store.error" class="bg-red-1 text-red-9 q-mb-md" rounded>
            {{ store.error }}
        </q-banner>

        <q-card flat bordered class="q-mb-md">
            <q-card-section>
                <div class="text-subtitle1">Import (Paste)</div>
                <div class="text-caption text-grey-7">
                    Paste rows with columns: rank, name, school, previous rank (NR allowed). Select weight class.
                </div>

                <div class="row q-col-gutter-md q-mt-sm">
                    <div class="col-12 col-md-3">
                        <q-select v-model="importWeight" :options="weights" label="Weight Class" outlined dense
                            emit-value map-options />
                    </div>
                    <div class="col-12 col-md-9">
                        <q-input v-model="rawText" label="Paste Rankings Rows" type="textarea" outlined autogrow />
                    </div>
                </div>

                <div class="row q-col-gutter-sm q-mt-sm">
                    <div class="col-auto">
                        <q-btn label="Import" color="primary" :disable="!canImport" :loading="store.loading"
                            @click="onImport" />
                    </div>
                </div>
            </q-card-section>
        </q-card>

        <q-card flat bordered>
            <q-card-section>
                <div class="text-subtitle1">Staging Rows</div>
                <div class="text-caption text-grey-7">
                    Total: {{ counts.total }} | Resolved: {{ counts.resolved }} | Needs Review: {{ counts.needsReview }}
                </div>

                <q-table :rows="store.stagingRows" :columns="columns" row-key="id" flat bordered dense class="q-mt-md">
                    <template #body-cell-status="props">
                        <q-td :props="props">
                            <q-badge :color="statusColor(props.row.status)" outline>{{ props.row.status }}</q-badge>
                        </q-td>
                    </template>
                </q-table>
                <q-btn outline icon="search" label="Resolve IDs" :to="`/admin/rankings/${releaseId}/resolve`" />
                <q-btn label="Clear Weight" color="secondary" :loading="store.loading" @click="onClear" />
            </q-card-section>
        </q-card>
    </q-page>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useAdminRankingsStore } from '../../../store/adminRankings.store'

const route = useRoute()
const store = useAdminRankingsStore()
const releaseId = route.params.releaseId

const rawText = ref('')
const importWeight = ref(125)

const weights = [125, 133, 141, 149, 157, 165, 174, 184, 197, 285].map(w => ({ label: String(w), value: w }))

const counts = computed(() => store.counts)

const headerText = computed(() => {
    const r = store.releaseDetail?.release
    if (!r) return ''
    return `${r.source} — ${r.season} — Week of ${r.weekOf} — ${r.status}`
})

const canImport = computed(() => importWeight.value && rawText.value.trim().length > 0)

const canPublish = computed(() => {
    const r = store.releaseDetail?.release
    if (!r || r.status !== 'draft') return false
    return counts.value.total > 0 && counts.value.resolved === counts.value.total && counts.value.needsReview === 0
})

const columns = [
    { name: 'weightClass', label: 'Wt', field: 'weightClass', sortable: true },
    { name: 'rank', label: 'Rank', field: 'rank', sortable: true },
    { name: 'name', label: 'Name', field: 'name', sortable: true },
    { name: 'school', label: 'School', field: 'school', sortable: true },
    { name: 'previousRank', label: 'Prev', field: 'previousRank', sortable: true },
    { name: 'status', label: 'Status', field: 'status', sortable: true },
    { name: 'wrestlestatId', label: 'WrestleStat ID', field: 'wrestlestatId' }
]

function statusColor(status) {
    if (status === 'resolved') return 'positive'
    if (status === 'needs_review') return 'warning'
    return 'grey-7'
}

async function onImport() {
    await store.importPaste(releaseId, { weightClass: importWeight.value, rawText: rawText.value })
    rawText.value = ''
}

async function onClear() {
    await store.clearWeight(releaseId, importWeight.value)
}

async function onPublish() {
    await store.publishRelease(releaseId)
}

onMounted(() => store.fetchReleaseDetail(releaseId))
</script>
