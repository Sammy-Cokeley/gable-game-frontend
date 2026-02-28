<template>
    <q-page class="q-pa-md">
        <div class="row items-center q-col-gutter-md q-mb-md">
            <div class="col">
                <div class="text-h6">Resolve WrestleStat IDs</div>
                <div class="text-caption text-grey-7">
                    Attach a WrestleStat ID to each staging row so the release can be published.
                </div>
            </div>
            <div class="col-auto">
                <q-btn flat icon="arrow_back" label="Back to Release" :to="`/admin/rankings/${releaseId}`" />
            </div>
        </div>

        <q-banner v-if="store.error" class="bg-red-1 text-red-9 q-mb-md" rounded dense>
            {{ store.error }}
        </q-banner>

        <q-card flat bordered>
            <q-card-section class="q-pa-sm">
                <div class="row items-center q-col-gutter-sm">
                    <div class="col-12 col-md-4">
                        <q-input v-model="filter" dense outlined placeholder="Filter by name/school..." />
                    </div>

                    <div class="col-12 col-md-3">
                        <q-select v-model="weightFilter" :options="weightOptions" dense outlined label="Weight filter"
                            emit-value map-options clearable />
                    </div>

                    <div class="col">
                        <div class="text-caption text-grey-7">
                            Unresolved: <b>{{ filteredRows.length }}</b>
                        </div>
                    </div>

                    <div class="col-auto">
                        <q-btn outline icon="search" label="Bulk Resolve" :disable="filteredRows.length === 0"
                            @click="openResolveDialog(filteredRows)" />
                    </div>
                </div>
            </q-card-section>

            <q-separator />

            <q-table :rows="filteredRows" :columns="columns" row-key="id" dense flat :loading="store.loading"
                :pagination="{ rowsPerPage: 25 }">
                <template #body-cell-status="props">
                    <q-td :props="props">
                        <q-badge color="orange" v-if="props.value === 'unresolved'">unresolved</q-badge>
                        <q-badge color="blue" v-else-if="props.value === 'needs_review'">needs_review</q-badge>
                        <q-badge color="green" v-else>resolved</q-badge>
                    </q-td>
                </template>

                <template #body-cell-actions="props">
                    <q-td :props="props" class="q-gutter-xs">
                        <q-btn dense outline icon="search" label="Resolve"
                            @click.stop="openResolveDialog([props.row])" />
                    </q-td>
                </template>
            </q-table>
        </q-card>

        <!-- Unified resolve dialog: handles 1 row or many rows -->
        <q-dialog v-model="dialogOpen">
            <q-card style="min-width: 980px; max-width: 1120px;">
                <q-card-section class="row items-center">
                    <div class="col">
                        <div class="text-subtitle1">
                            Resolve WrestleStat IDs
                            <span class="text-grey-7">— {{ resolveRows.length }} row(s)</span>
                        </div>
                        <div class="text-caption text-grey-7">
                            Click “Lookup candidates” to fetch suggestions from WrestleStat (bulk by weight class).
                            Attach
                            remains manual per row.
                        </div>
                    </div>
                    <div class="col-auto">
                        <q-btn flat icon="close" @click="closeDialog" />
                    </div>
                </q-card-section>

                <q-separator />

                <q-card-section class="q-pa-sm">
                    <div class="row items-center q-col-gutter-sm">
                        <div class="col-auto">
                            <q-btn color="primary" icon="search" label="Lookup candidates" :loading="lookupLoading"
                                @click="lookupCandidatesForRows(resolveRows)" />
                        </div>
                        <div class="col-auto">
                            <q-btn outline icon="refresh" label="Refresh rows" :loading="store.loading"
                                @click="refreshRelease" />
                        </div>
                        <div>
                            <q-btn color="primary" label="Attach All" :disable="attachAllCount === 0"
                                :loading="store.loading" @click="attachAll" />
                        </div>
                        <div class="col">
                            <div class="text-caption text-grey-7" v-if="weightFilter">
                                Weight filter: <b>{{ weightFilter }}</b>
                            </div>
                        </div>
                    </div>

                    <q-banner v-if="candidatesError" class="bg-orange-1 text-orange-9 q-mt-sm" rounded dense>
                        {{ candidatesError }}
                    </q-banner>
                </q-card-section>

                <q-separator />

                <q-card-section class="q-pa-none">
                    <q-table :rows="resolveRows" row-key="id" dense flat :pagination="{ rowsPerPage: 50 }"
                        :columns="resolveColumns">
                        <template #body-cell-suggested="props">
                            <q-td :props="props" style="min-width: 420px;">
                                <div v-if="(candidatesByRowId[props.row.id] || []).length">
                                    <q-select dense outlined emit-value map-options
                                        :model-value="selectedIdByRowId[props.row.id]"
                                        @update:model-value="val => (selectedIdByRowId[props.row.id] = val)" :options="(candidatesByRowId[props.row.id] || []).map(c => ({
                                            label: `ID ${c.wrestlestatId} — ${c.name}${c.school ? ' (' + c.school + ')' : ''}  [${Math.round((c.score || 0) * 100)}%]`,
                                            value: c.wrestlestatId
                                        }))" placeholder="Select candidate" />
                                </div>
                                <div v-else class="text-caption text-grey-7">
                                    No candidates loaded
                                </div>
                            </q-td>
                        </template>

                        <template #body-cell-manual="props">
                            <q-td :props="props" style="min-width: 180px;">
                                <q-input dense outlined type="number" placeholder="WrestleStat ID"
                                    :model-value="manualIdByRowId[props.row.id]"
                                    @update:model-value="val => (manualIdByRowId[props.row.id] = val === '' || val == null ? null : Number(val))" />
                            </q-td>
                        </template>

                        <template #body-cell-actions="props">
                            <q-td :props="props" class="q-gutter-xs">
                                <q-btn dense color="primary" label="Attach" :disable="!getAttachId(props.row.id)"
                                    :loading="!!attachLoadingByRowId[props.row.id]"
                                    @click="attachForRow(props.row.id)" />
                                <q-btn dense outline label="Remove" @click="removeFromDialog(props.row.id)" />
                            </q-td>
                        </template>
                    </q-table>
                </q-card-section>

                <q-separator />

                <q-card-actions align="right" class="q-pa-sm">
                    <q-btn flat label="Close" @click="closeDialog" />
                </q-card-actions>
            </q-card>
        </q-dialog>
    </q-page>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useAdminRankingsStore } from '../../../store/adminRankings.store'

const route = useRoute()
const store = useAdminRankingsStore()

const releaseId = Number(route.params.releaseId)

const filter = ref('')
const weightFilter = ref(null)

const dialogOpen = ref(false)
const resolveRows = ref([])

// Per-row dialog state
const candidatesByRowId = ref({})       // { [rowId]: Candidate[] }
const selectedIdByRowId = ref({})       // { [rowId]: wrestlestatId }
const manualIdByRowId = ref({})         // { [rowId]: number|null }
const attachLoadingByRowId = ref({})    // { [rowId]: bool }

const candidatesError = ref('')
const lookupLoading = ref(false)

const columns = [
    { name: 'weightClass', label: 'Wt', field: 'weightClass', align: 'left', sortable: true },
    { name: 'rank', label: 'Rank', field: 'rank', align: 'left', sortable: true },
    { name: 'name', label: 'Name', field: 'name', align: 'left', sortable: true },
    { name: 'school', label: 'School', field: 'school', align: 'left', sortable: true },
    { name: 'status', label: 'Status', field: 'status', align: 'left', sortable: true },
    { name: 'actions', label: '', field: 'actions', align: 'right' }
]

const resolveColumns = [
    { name: 'rank', label: 'Rank', field: 'rank', align: 'left', sortable: true },
    { name: 'name', label: 'Name', field: 'name', align: 'left', sortable: true },
    { name: 'school', label: 'School', field: 'school', align: 'left', sortable: true },
    { name: 'suggested', label: 'Candidates', field: 'suggested', align: 'left' },
    { name: 'manual', label: 'Manual ID', field: 'manual', align: 'left' },
    { name: 'actions', label: '', field: 'actions', align: 'right' }
]

const weightOptions = [
    { label: '125', value: 125 }, { label: '133', value: 133 }, { label: '141', value: 141 },
    { label: '149', value: 149 }, { label: '157', value: 157 }, { label: '165', value: 165 },
    { label: '174', value: 174 }, { label: '184', value: 184 }, { label: '197', value: 197 },
    { label: '285', value: 285 }
]

const unresolvedRows = computed(() => {
    const rows = store.releaseDetail?.stagingRows || []
    // Your data uses `status` (based on your code). If you later standardize to row_status, update here.
    return rows.filter(r => r.status === 'unresolved' || r.status === 'needs_review')
})

const filteredRows = computed(() => {
    const q = filter.value.trim().toLowerCase()
    return unresolvedRows.value.filter(r => {
        if (weightFilter.value && r.weightClass !== weightFilter.value) return false
        if (!q) return true
        return (r.name || '').toLowerCase().includes(q) || (r.school || '').toLowerCase().includes(q)
    })
})

const attachAllCount = computed(() =>
    resolveRows.value.filter(r => !!getAttachId(r.id)).length
)

onMounted(async () => {
    await store.fetchReleaseDetail(releaseId)
})

function openResolveDialog(rows) {
    // rows MUST be an array
    resolveRows.value = Array.isArray(rows) ? rows : [rows]
    dialogOpen.value = true

    candidatesByRowId.value = {}
    selectedIdByRowId.value = {}
    manualIdByRowId.value = {}
    attachLoadingByRowId.value = {}
    candidatesError.value = ''
}

async function refreshRelease() {
    await store.fetchReleaseDetail(releaseId)
}

function removeFromDialog(rowId) {
    resolveRows.value = resolveRows.value.filter(r => r.id !== rowId)
}

function getAttachId(rowId) {
    const manualRaw = manualIdByRowId.value[rowId]
    const selectedRaw = selectedIdByRowId.value[rowId]

    const manual = manualRaw === '' || manualRaw == null ? null : Number(manualRaw)
    const selected = selectedRaw === '' || selectedRaw == null ? null : Number(selectedRaw)

    if (Number.isInteger(manual) && manual > 0) return manual
    if (Number.isInteger(selected) && selected > 0) return selected
    return null
}

async function lookupCandidatesForRows(rows) {
    candidatesError.value = ''
    lookupLoading.value = true

    console.log(rows)

    // Group by weight class to do ONE backend call per weight class
    const byWeight = rows.reduce((acc, r) => {
        (acc[r.weightClass] ||= []).push(r)
        return acc
    }, {})

    try {
        for (const [weightClassStr] of Object.entries(byWeight)) {
            const weightClass = Number(weightClassStr)

            // Uses your existing backend bulk lookup endpoint (via store.bulkLookupCandidates)
            const resp = await store.bulkLookupCandidates(releaseId, weightClass)

            // Merge into local map
            const map = { ...candidatesByRowId.value }
            for (const rr of (resp.rows || [])) {
                map[rr.rowId] = rr.candidates || []
                // default top candidate selected if not already selected
                if (!selectedIdByRowId.value[rr.rowId] && (rr.candidates || []).length) {
                    selectedIdByRowId.value[rr.rowId] = rr.candidates[0].wrestlestatId
                }
            }
            candidatesByRowId.value = map
        }
    } catch (err) {
        candidatesError.value = store.error || 'Failed to lookup candidates'
        throw err
    } finally {
        lookupLoading.value = false
    }
}

async function attachForRow(rowId) {
    const wsid = getAttachId(rowId)

    if (!wsid) return

    attachLoadingByRowId.value = { ...attachLoadingByRowId.value, [rowId]: true }
    try {
        await store.attachWrestlestatIds([{ rowId, wrestlestatId: wsid }])
        await store.fetchReleaseDetail(releaseId)
        removeFromDialog(rowId)
    } catch (err) {
        console.error('attach error', err?.response?.status, err?.response?.data || err.message)
        throw err
    } finally {
        attachLoadingByRowId.value = { ...attachLoadingByRowId.value, [rowId]: false }
    }
}

async function attachAll() {
    const items = resolveRows.value
        .map(r => ({ rowId: r.id, wrestlestatId: getAttachId(r.id) }))
        .filter(x => Number.isInteger(x.wrestlestatId) && x.wrestlestatId > 0)

    if (!items.length) return

    await store.attachWrestlestatIds(items)
    await store.fetchReleaseDetail(releaseId)

    const attachedIds = new Set(items.map(i => i.rowId))
    resolveRows.value = resolveRows.value.filter(r => !attachedIds.has(r.id))
}


function closeDialog() {
    dialogOpen.value = false
}

</script>
