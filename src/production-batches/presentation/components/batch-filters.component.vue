<!--
  @summary Presentation component for filtering production batches by ID, status, date, and model.
  @author Diego Sebastian Reategui Galarcep (u20201F165)
-->
<template>
  <div class="surface-card p-4 mb-4 border-round shadow-1">
    <div class="grid p-fluid">
      <!-- Search by Batch ID -->
      <div class="col-12 md:col-3">
        <label for="search-id" class="font-semibold block mb-2 text-700">{{ $t('productionBatches.search') }}</label>
        <pv-input-text
            id="search-id"
            v-model="filters.batchId"
            :placeholder="$t('productionBatches.searchPlaceholder')"
            class="w-full"
            @input="emitFilterChange"
        />
      </div>

      <!-- Filter by Status -->
      <div class="col-12 md:col-3">
        <label for="filter-status" class="font-semibold block mb-2 text-700">{{ $t('productionBatches.status') }}</label>
        <pv-dropdown
            id="filter-status"
            v-model="filters.status"
            :options="statusOptions"
            optionLabel="label"
            optionValue="value"
            :placeholder="$t('productionBatches.allStatuses')"
            class="w-full"
            @change="emitFilterChange"
        />
      </div>

      <!-- Filter by Date -->
      <div class="col-12 md:col-3">
        <label for="filter-date" class="font-semibold block mb-2 text-700">{{ $t('productionBatches.date') }}</label>
        <pv-dropdown
            id="filter-date"
            v-model="filters.date"
            :options="dateOptions"
            optionLabel="label"
            optionValue="value"
            :placeholder="$t('productionBatches.allDates')"
            class="w-full"
            @change="emitFilterChange"
        />
      </div>

      <!-- Filter by Garment Model -->
      <div class="col-12 md:col-3">
        <label for="filter-model" class="font-semibold block mb-2 text-700">{{ $t('productionBatches.garmentModel') }}</label>
        <pv-dropdown
            id="filter-model"
            v-model="filters.garmentModel"
            :options="modelOptions"
            optionLabel="label"
            optionValue="value"
            :placeholder="$t('productionBatches.allModels')"
            class="w-full"
            @change="emitFilterChange"
        />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'batch-filters',
  emits: ['filter-change'],
  data() {
    return {
      filters: {
        batchId: '',
        status: null,
        date: null,
        garmentModel: null
      },
    };
  },
  computed: {
    statusOptions() {
      return [
        { label: this.$t('productionBatches.allStatuses'), value: null },
        { label: this.$t('productionBatches.statuses.inProduction'), value: 'In Production' },
        { label: this.$t('productionBatches.statuses.atRisk'), value: 'At Risk' },
        { label: this.$t('productionBatches.statuses.completed'), value: 'Completed' },
        { label: this.$t('productionBatches.statuses.delayed'), value: 'Delayed' }
      ];
    },
    dateOptions() {
      return [
        { label: this.$t('productionBatches.allDates'), value: null },
        { label: this.$t('productionBatches.today'), value: 'today' },
        { label: this.$t('productionBatches.thisWeek'), value: 'week' },
        { label: this.$t('productionBatches.thisMonth'), value: 'month' }
      ];
    },
    modelOptions() {
      return [
        { label: this.$t('productionBatches.allModels'), value: null },
        { label: this.$t('productionBatches.models.tshirtBasic'), value: 'T-Shirt Basic' },
        { label: this.$t('productionBatches.models.hoodie'), value: 'Hoodie' },
        { label: this.$t('productionBatches.models.poloShirt'), value: 'Polo Shirt' },
        { label: this.$t('productionBatches.models.joggerPants'), value: 'Jogger Pants' },
        { label: this.$t('productionBatches.models.crewneck'), value: 'Crewneck' }
      ];
    }
  },
  methods: {
    emitFilterChange() {
      this.$emit('filter-change', { ...this.filters });
    }
  }
};
</script>