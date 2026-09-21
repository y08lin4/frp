<template>
  <ConfigSection :title="$t('visitorForm.connection')" :readonly="readonly">
    <div class="field-row two-col">
      <ConfigField :label="$t('visitorForm.serverName')" type="text" v-model="form.serverName" prop="serverName"
        :placeholder="$t('visitorForm.serverNamePlaceholder')" :readonly="readonly" />
      <ConfigField :label="$t('visitorForm.serverUser')" type="text" v-model="form.serverUser"
        :placeholder="$t('visitorForm.serverUserPlaceholder')" :readonly="readonly" />
    </div>
    <ConfigField :label="$t('visitorForm.secretKey')" type="password" v-model="form.secretKey"
      :placeholder="$t('visitorForm.secretKeyPlaceholder')" :readonly="readonly" />
    <div class="field-row two-col">
      <ConfigField :label="$t('visitorForm.bindAddress')" type="text" v-model="form.bindAddr"
        placeholder="127.0.0.1" :readonly="readonly" />
      <ConfigField :label="$t('visitorForm.bindPort')" type="number" v-model="form.bindPort"
        :min="bindPortMin" :max="65535" prop="bindPort" :readonly="readonly"
        :tip="bindPortTip" />
    </div>
  </ConfigSection>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import type { VisitorFormData } from '../../types'
import ConfigSection from '../ConfigSection.vue'
import ConfigField from '../ConfigField.vue'

const { t } = useI18n()

const props = withDefaults(defineProps<{
  modelValue: VisitorFormData
  readonly?: boolean
}>(), { readonly: false })

const emit = defineEmits<{ 'update:modelValue': [value: VisitorFormData] }>()

const form = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val),
})

const bindPortMin = computed(() => (form.value.type === 'sudp' ? 1 : undefined))
const bindPortTip = computed(() => form.value.type === 'sudp'
  ? ''
  : t('visitorForm.bindPortTip'))
</script>

<style scoped lang="scss">
@use '@/assets/css/form-layout';
</style>
