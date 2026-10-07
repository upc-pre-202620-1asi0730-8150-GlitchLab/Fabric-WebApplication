<!--
  @summary Presentation component for filtering production batches by ID, status, date, and model.
  @author Diego Sebastian Reategui Galarcep (u20201F165)
-->
<template>
  <div class="surface-card p-4 mb-4 border-round shadow-1">
    <div class="grid p-fluid">
      <!-- Search by Batch ID -->
      <div class="col-12 md:col-3">
        <label for="search-id" class="font-semibold block mb-2 text-700">Search by Batch ID</label>
        <pv-input-text
            id="search-id"
            v-model="filters.batchId"
            placeholder="e.g. LOT-024"
            class="w-full"
            @input="emitFilterChange"
        />
      </div>

      <!-- Filter by Status -->
      <div class="col-12 md:col-3">
        <label for="filter-status" class="font-semibold block mb-2 text-700">Status</label>
        <pv-dropdown
            id="filter-status"
            v-model="filters.status"
            :options="statusOptions"
            optionLabel="label"
            optionValue="value"
            placeholder="All statuses"
            class="w-full"
            @change="emitFilterChange"
        />
      </div>

      <!-- Filter by Date -->
      <div class="col-12 md:col-3">
        <label for="filter-date" class="font-semibold block mb-2 text-700">Date</label>
        <pv-dropdown
            id="filter-date"
            v-model="filters.date"
            :options="dateOptions"
            optionLabel="label"
            optionValue="value"
            placeholder="All dates"
            class="w-full"
            @change="emitFilterChange"
        />
      </div>

      <!-- Filter by Garment Model -->
      <div class="col-12 md:col-3">
        <label for="filter-model" class="font-semibold block mb-2 text-700">Garment Model</label>
        <pv-dropdown
            id="filter-model"
            v-model="filters.garmentModel"
            :options="modelOptions"
            optionLabel="label"
            optionValue="value"
            placeholder="All models"
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
      statusOptions: [
        { label: 'All statuses', value: null },
        { label: 'In Production', value: 'In Production' },
        { label: 'At Risk', value: 'At Risk' },
        { label: 'Completed', value: 'Completed' },
        { label: 'Delayed', value: 'Delayed' }
      ],
      dateOptions: [
        { label: 'All dates', value: null },
        { label: 'Today', value: 'today' },
        { label: 'This Week', value: 'week' },
        { label: 'This Month', value: 'month' }
      ],
      modelOptions: [
        { label: 'All models', value: null },
        { label: 'T-Shirt Basic', value: 'T-Shirt Basic' },
        { label: 'Hoodie', value: 'Hoodie' },
        { label: 'Polo Shirt', value: 'Polo Shirt' },
        { label: 'Jogger Pants', value: 'Jogger Pants' },
        { label: 'Crewneck', value: 'Crewneck' }
      ]
    };
  },
  methods: {
    emitFilterChange() {
      this.$emit('filter-change', { ...this.filters });
    }
  }
};
</script>