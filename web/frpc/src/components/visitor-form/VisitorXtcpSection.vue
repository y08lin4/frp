<template>
  <!-- XTCP Options -->
  <ConfigSection :title="$t('visitorForm.xtcpOptions')" collapsible :readonly="readonly"
    :has-value="form.protocol !== 'quic' || form.keepTunnelOpen || form.maxRetriesAnHour != null || form.minRetryInterval != null || !!form.fallbackTo || form.fallbackTimeoutMs != null">
    <ConfigField :label="$t('visitorForm.protocol')" type="select" v-model="form.protocol"
      :options="[{ label: 'QUIC', value: 'quic' }, { label: 'KCP', value: 'kcp' }]" :readonly="readonly" />
    <ConfigField :label="$t('visitorForm.keepTunnelOpen')" type="switch" v-model="form.keepTunnelOpen" :readonly="readonly" />
    <div class="field-row two-col">
      <ConfigField :label="$t('visitorForm.maxRetriesPerHour')" type="number" v-model="form.maxRetriesAnHour" :min="0" :readonly="readonly" />
      <ConfigField :label="$t('visitorForm.minRetryInterval')" type="number" v-model="form.minRetryInterval" :min="0" :readonly="readonly" />
    </div>
    <div class="field-row two-col">
      <ConfigField :label="$t('visitorForm.fallbackTo')" type="text" v-model="form.fallbackTo" :placeholder="$t('visitorForm.fallbackToPlaceholder')" :readonly="readonly" />
      <ConfigField :label="$t('visitorForm.fallbackTimeout')" type="number" v-model="form.fallbackTimeoutMs" :min="0" :readonly="readonly" />
    </div>
  </ConfigSection>

  <!-- NAT Traversal -->
  <ConfigSection :title="$t('visitorForm.natTraversal')" collapsible :readonly="readonly"
    :has-value="form.natTraversalDisableAssistedAddrs">
    <ConfigField :label="$t('visitorForm.disableAssistedAddrs')" type="switch" v-model="form.natTraversalDisableAssistedAddrs"
      :tip="$t('visitorForm.disableAssistedAddrsTip')" :readonly="readonly" />
  </ConfigSection>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { VisitorFormData } from '../../types'
import ConfigSection from '../ConfigSection.vue'
import ConfigField from '../ConfigField.vue'

const props = withDefaults(defineProps<{
  modelValue: VisitorFormData
  readonly?: boolean
}>(), { readonly: false })

const emit = defineEmits<{ 'update:modelValue': [value: VisitorFormData] }>()

const form = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val),
})
</script>

<style scoped lang="scss">
@use '@/assets/css/form-layout';
</style>
