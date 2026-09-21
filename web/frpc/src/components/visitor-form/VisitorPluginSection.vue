<template>
  <ConfigSection :title="$t('visitorForm.plugin')" :readonly="readonly">
    <div class="field-row two-col">
      <ConfigField
        :label="$t('visitorForm.pluginType')"
        type="select"
        v-model="form.pluginType"
        :options="pluginOptions"
        :placeholder="$t('visitorForm.nonePlaceholder')"
        :readonly="readonly"
      />
      <ConfigField
        v-if="form.pluginType === 'virtual_net'"
        :label="$t('visitorForm.destinationIp')"
        type="text"
        v-model="form.pluginDestinationIP"
        prop="pluginDestinationIP"
        :placeholder="$t('visitorForm.destinationIpPlaceholder')"
        :tip="$t('visitorForm.destinationIpTip')"
        :readonly="readonly"
      />
    </div>
  </ConfigSection>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import type { VisitorFormData } from '../../types'
import ConfigField from '../ConfigField.vue'
import ConfigSection from '../ConfigSection.vue'

const { t } = useI18n()

const pluginOptions = computed(() => [
  { label: t('visitorForm.nonePlaceholder'), value: '' },
  { label: 'virtual_net', value: 'virtual_net' },
])

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
