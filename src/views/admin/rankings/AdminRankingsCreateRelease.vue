<template>
    <q-page class="q-pa-md">
        <!-- Header -->
        <div class="row items-center q-col-gutter-md q-mb-md">
            <div class="col">
                <div class="text-h6">Create Rankings Release</div>
                <div class="text-caption text-grey-7">
                    Create a weekly release (draft), then import each weight class and resolve IDs before publishing.
                </div>
            </div>
            <div class="col-auto">
                <q-btn flat icon="arrow_back" label="Back" to="/admin/rankings" />
            </div>
        </div>

        <q-card flat bordered class="q-pa-md" style="max-width: 900px;">
            <q-banner v-if="store.error" class="bg-red-1 text-red-9 q-mb-md" rounded dense>
                {{ store.error }}
            </q-banner>

            <q-form @submit.prevent="onSubmit" class="q-gutter-md">
                <div class="row q-col-gutter-md">
                    <div class="col-12 col-md-6">
                        <q-select v-model="form.source" :options="sources" label="Source" outlined dense emit-value
                            map-options :rules="[v => !!v || 'Source is required']" />
                    </div>

                    <div class="col-12 col-md-3">
                        <q-input v-model="form.season" label="Season" outlined dense placeholder="2024-25"
                            :rules="[v => !!v || 'Season is required']" hint="Example: 2024-25" hide-hint="auto" />
                    </div>

                    <div class="col-12 col-md-3">
                        <q-input v-model="form.weekOf" label="Week Of" type="date" outlined dense
                            :rules="[v => !!v || 'Week Of is required']" hint="Anchor date for this weekly release"
                            hide-hint="auto" />
                    </div>
                </div>

                <q-separator class="q-my-sm" />

                <div class="row items-center q-col-gutter-sm">
                    <div class="col-auto">
                        <q-btn color="primary" icon="add" label="Create & Open" type="submit" :loading="store.loading"
                            :disable="!canSubmit" />
                    </div>

                    <div class="col-auto">
                        <q-btn flat label="Cancel" to="/admin/rankings" />
                    </div>

                    <div class="col">
                        <div class="text-caption text-grey-7">
                            Tip: keep one release per source per week. Releasing again is handled by creating a new
                            week.
                        </div>
                    </div>
                </div>
            </q-form>
        </q-card>
    </q-page>
</template>

<script setup>
import { computed, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAdminRankingsStore } from '../../../store/adminRankings.store'

const router = useRouter()
const store = useAdminRankingsStore()

const sources = [
    { label: 'FloWrestling', value: 'FloWrestling' },
    { label: 'InterMat', value: 'InterMat' },
    { label: 'WrestleStat', value: 'WrestleStat' },
    { label: 'College Wrestling Report', value: 'CWR' }
]

const form = reactive({
    source: 'FloWrestling',
    season: '',
    weekOf: ''
})

const canSubmit = computed(() => {
    return !!form.source && !!form.season?.trim() && !!form.weekOf?.trim()
})

// Small UX helper: prefill season and a reasonable weekOf default
onMounted(() => {
    if (!form.season) form.season = defaultSeason()
    if (!form.weekOf) form.weekOf = todayISO()
})

function todayISO() {
    const d = new Date()
    const yyyy = d.getFullYear()
    const mm = String(d.getMonth() + 1).padStart(2, '0')
    const dd = String(d.getDate()).padStart(2, '0')
    return `${yyyy}-${mm}-${dd}`
}

// Heuristic: if we are in Jul-Dec => currentYear-nextYear, else previousYear-currentYear
function defaultSeason() {
    const d = new Date()
    const year = d.getFullYear()
    const month = d.getMonth() + 1
    const startYear = month >= 7 ? year : year - 1
    const endYear = String(startYear + 1).slice(-2)
    return `${startYear}-${endYear}`
}

async function onSubmit() {
    const payload = {
        source: form.source,
        season: form.season.trim(),
        weekOf: form.weekOf
    }

    const data = await store.createRelease(payload)
    router.push(`/admin/rankings/${data.release.id}`)
}
</script>
