<template>
  <div class="surface-card border-round-xl p-0 shadow-1 overflow-hidden">
    <pv-data-table :value="batches" responsiveLayout="scroll" class="p-datatable-sm" paginator :rows="8">
      <pv-column field="batchNumber" :header="$t('productionBatches.table.batchId')" sortable class="font-bold text-900"></pv-column>
      <pv-column field="garmentModel" :header="$t('productionBatches.garmentModel')" sortable class="text-700">
        <template #body="slotProps">
          {{ translateValue(slotProps.data.garmentModel, 'models') }}
        </template>
      </pv-column>
      <pv-column field="projectedQuantity" :header="$t('productionBatches.table.projectedQuantity')" sortable class="text-700">
        <template #body="slotProps">
          {{ slotProps.data.projectedQuantity ? slotProps.data.projectedQuantity.toLocaleString() : 0 }}
        </template>
      </pv-column>
      <pv-column field="currentStage" :header="$t('productionBatches.table.currentStage')" class="text-700">
        <template #body="slotProps">
          {{ translateValue(slotProps.data.currentStage, 'stages') }}
        </template>
      </pv-column>

      <pv-column :header="$t('productionBatches.table.progress')" style="min-width: 180px;">
        <template #body="slotProps">
          <div class="flex align-items-center gap-2">
            <pv-progress-bar :value="slotProps.data.progressPercentage || 0" :showValue="false" style="height: 8px; flex: 1;" />
            <span class="text-xs font-medium text-600" style="min-width: 32px;">{{ slotProps.data.progressPercentage || 0 }}%</span>
          </div>
        </template>
      </pv-column>

      <pv-column field="deliveryDate" :header="$t('productionBatches.table.deliveryDate')" class="text-700"></pv-column>

      <pv-column :header="$t('productionBatches.status')">
        <template #body="slotProps">
          <span :class="['px-3 py-1 border-round-pill text-xs font-semibold', getBadgeClass(slotProps.data.status)]">
            {{ translateValue(slotProps.data.status, 'statuses') }}
          </span>
        </template>
      </pv-column>

      <pv-column :header="$t('productionBatches.table.actions')" style="min-width: 200px;">
        <template #body="slotProps">
          <div class="batch-row-actions">
            <pv-button
                :label="primaryActionLabel(slotProps.data)"
                class="p-button-sm batch-primary-action"
                @click="openBatch(slotProps.data)"
            />
            <pv-button
                icon="pi pi-ellipsis-v"
                class="p-button-text p-button-secondary p-button-rounded p-button-sm"
                @click="toggleMenu($event, slotProps.data)"
                aria-haspopup="true"
                aria-controls="overlay_menu"
            />
          </div>
        </template>
      </pv-column>
    </pv-data-table>

    <pv-menu ref="menu" id="overlay_menu" :model="menuItems" :popup="true" />
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
    };
  },
  computed: {
    menuItems() {
      const tabs = [
        { tab: 'summary', icon: 'pi pi-eye', label: 'detail' },
        { tab: 'operators', icon: 'pi pi-users', label: 'assignOperators' },
        { tab: 'observations', icon: 'pi pi-comment', label: 'observations' },
        { tab: 'traceability', icon: 'pi pi-history', label: 'history' },
        { tab: 'defects', icon: 'pi pi-exclamation-triangle', label: 'defects' }
      ];
      return tabs.map(item => ({
        label: this.$t(`productionBatches.table.${item.label}`),
        icon: item.icon,
        command: () => {
          if (this.selectedBatch) this.openBatch(this.selectedBatch, item.tab);
        }
      }));
    }
  },
  methods: {
    primaryActionLabel(batch) {
      return batch.status === 'Completed' || batch.currentStage === 'Completed'
        ? this.$t('productionBatches.table.detail')
        : this.$t('productionBatches.table.updateStage');
    },
    openBatch(batch, tab = 'summary') {
      this.$router.push({
        name: 'batch-detail',
        params: { id: batch.id },
        query: tab === 'summary' ? {} : { tab }
      });
    },
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
    },
    translateValue(value, category) {
      const keys = {
        models: {
          'T-Shirt Basic': 'tshirtBasic',
          Hoodie: 'hoodie',
          'Polo Shirt': 'poloShirt',
          'Jogger Pants': 'joggerPants',
          Crewneck: 'crewneck'
        },
        stages: {
          Cutting: 'cutting',
          Sewing: 'sewing',
          Finishing: 'finishing'
        },
        statuses: {
          'In Production': 'inProduction',
          'At Risk': 'atRisk',
          Completed: 'completed',
          Delayed: 'delayed'
        }
      };
      const key = keys[category]?.[value];
      return key ? this.$t(`productionBatches.${category}.${key}`) : value;
    }
  }
}
</script>

<style scoped>
:deep(.p-progressbar .p-progressbar-value) {
  background-color: #4D5628 !important;
}
</style>