<template>
  <ConfigSection :title="$t('proxyForm.loadBalancer')" collapsible :readonly="readonly" :has-value="!!form.loadBalancerGroup">
    <div class="field-row two-col">
      <ConfigField :label="$t('proxyForm.group')" type="text" v-model="form.loadBalancerGroup" :placeholder="$t('proxyForm.groupPlaceholder')" :readonly="readonly" />
      <ConfigField :label="$t('proxyForm.groupKey')" type="text" v-model="form.loadBalancerGroupKey" :readonly="readonly" />
    </div>
  </ConfigSection>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { ProxyFormData } from '../../types'
import ConfigSection from '../ConfigSection.vue'
import ConfigField from '../ConfigField.vue'

const props = withDefaults(defineProps<{
  modelValue: ProxyFormData
  readonly?: boolean
}>(), { readonly: false })

const emit = defineEmits<{ 'update:modelValue': [value: ProxyFormData] }>()

const form = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val),
})
</script>

<style scoped lang="scss">
@use '@/assets/css/form-layout';
</style>
