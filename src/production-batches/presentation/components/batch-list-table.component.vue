<template>
  <div class="surface-card border-round-xl p-0 shadow-1 overflow-hidden">
    <pv-data-table :value="batches" responsiveLayout="scroll" class="p-datatable-sm">
      <pv-column field="batchNumber" header="Batch ID" sortable class="font-bold text-900"></pv-column>
      <pv-column field="garmentModel" header="Garment Model" sortable class="text-700"></pv-column>
      <pv-column field="projectedQuantity" header="Projected Quantity" sortable class="text-700">
        <template #body="slotProps">
          {{ slotProps.data.projectedQuantity ? slotProps.data.projectedQuantity.toLocaleString() : 0 }}
        </template>
      </pv-column>
      <pv-column field="currentStage" header="Current Stage" class="text-700"></pv-column>

      <pv-column header="Progress" style="min-width: 180px;">
        <template #body="slotProps">
          <div class="flex align-items-center gap-2">
            <pv-progress-bar :value="slotProps.data.progressPercentage || 0" :showValue="false" style="height: 8px; flex: 1;" />
            <span class="text-xs font-medium text-600" style="min-width: 32px;">{{ slotProps.data.progressPercentage || 0 }}%</span>
          </div>
        </template>
      </pv-column>

      <pv-column field="deliveryDate" header="Delivery Date" class="text-700"></pv-column>

      <pv-column header="Status">
        <template #body="slotProps">
          <span :class="['px-3 py-1 border-round-pill text-xs font-semibold', getBadgeClass(slotProps.data.status)]">
            {{ slotProps.data.status }}
          </span>
        </template>
      </pv-column>

      <pv-column header="Actions" style="width: 50px; text-align: center;">
        <template #body="slotProps">
          <pv-button
              icon="pi pi-ellipsis-v"
              class="p-button-text p-button-secondary p-button-rounded p-button-sm"
              @click="toggleMenu($event, slotProps.data)"
              aria-haspopup="true"
              aria-controls="overlay_menu"
          />
        </template>
      </pv-column>
    </pv-data-table>

    <!-- Context Menu para las acciones del lote -->
    <pv-menu ref="menu" id="overlay_menu" :model="menuItems" :popup="true" />

    <div class="flex align-items-center justify-content-between p-3 text-xs text-600 bg-white">
      <span>Showing 1–8 of {{ totalBatches }} batches</span>
      <div class="flex gap-1 align-items-center">
        <pv-button icon="pi pi-chevron-left" class="p-button-text p-button-sm p-button-secondary" disabled />
        <pv-button label="1" class="p-button-sm btn-olive px-3 py-1" />
        <pv-button label="2" class="p-button-text p-button-sm p-button-secondary" />
        <pv-button label="3" class="p-button-text p-button-sm p-button-secondary" />
        <pv-button icon="pi pi-chevron-right" class="p-button-text p-button-sm p-button-secondary" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'batch-list-table',
  props: { batches: Array, totalBatches: Number },
  emits: ['select-batch'],
  data() {
    return {
      selectedBatch: null,
      menuItems: [
        {
          label: 'Batch Detail',
          icon: 'pi pi-eye',
          command: () => {
            if (this.selectedBatch) {
              this.$router.push({ name: 'batch-detail', params: { id: this.selectedBatch.id } });
            }
          }
        },
        {
          label: 'Assign Operators',
          icon: 'pi pi-users',
          command: () => {
            if (this.selectedBatch) {
              this.$router.push({ name: 'batch-operator-assignment', params: { id: this.selectedBatch.id } });
            }
          }
        },
        {
          label: 'History',
          icon: 'pi pi-history',
          command: () => {
            if (this.selectedBatch) {
              this.$router.push({ name: 'traceability-history', params: { id: this.selectedBatch.id } });
            }
          }
        },
        {
          label: 'Observations',
          icon: 'pi pi-comment',
          command: () => {
            if (this.selectedBatch) {
              this.$router.push({ name: 'batch-observations', params: { id: this.selectedBatch.id } });
            }
          }
        }
      ]
    };
  },
  methods: {
    toggleMenu(event, batch) {
      this.selectedBatch = batch;
      this.$emit('select-batch', batch);
      this.$refs.menu.toggle(event);
    },
    getBadgeClass(status) {
      switch (status) {
        case 'In Production': return 'status-badge-in-production';
        case 'At Risk': return 'status-badge-at-risk';
        case 'Completed': return 'status-badge-completed';
        case 'Delayed': return 'status-badge-delayed';
        default: return 'bg-gray-100 text-gray-700';
      }
    }
  }
}
</script>

<style scoped>
:deep(.p-progressbar .p-progressbar-value) {
  background-color: #4D5628 !important;
}
</style>