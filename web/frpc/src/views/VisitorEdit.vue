<template>
  <div class="visitor-edit-page">
    <div class="edit-header">
      <nav class="breadcrumb">
        <router-link to="/visitors" class="breadcrumb-item">{{ $t('visitors.title') }}</router-link>
        <span class="breadcrumb-separator">›</span>
        <span class="breadcrumb-current">{{ isEditing ? $t('visitorEdit.editVisitor') : $t('visitorEdit.newVisitor') }}</span>
      </nav>
      <div class="header-actions">
        <ActionButton variant="outline" size="small" @click="goBack">{{ $t('common.cancel') }}</ActionButton>
        <ActionButton size="small" :loading="saving" @click="handleSave">
          {{ isEditing ? $t('common.update') : $t('common.create') }}
        </ActionButton>
      </div>
    </div>

    <div v-loading="pageLoading" class="edit-content">
      <el-form
        ref="formRef"
        :model="form"
        :rules="formRules"
        label-position="top"
        @submit.prevent
      >
        <VisitorFormLayout v-model="form" :editing="isEditing" />
      </el-form>
    </div>

    <ConfirmDialog
      v-model="leaveDialogVisible"
      :title="$t('visitorEdit.unsavedTitle')"
      :message="$t('visitorEdit.unsavedMessage')"
      :confirm-text="$t('visitorEdit.leave')"
      :is-mobile="isMobile"
      @confirm="handleLeaveConfirm"
      @cancel="handleLeaveCancel"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch, nextTick } from 'vue'
import { useRoute, useRouter, onBeforeRouteLeave } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { ElMessage } from 'element-plus'
import ActionButton from '@shared/components/ActionButton.vue'
import ConfirmDialog from '@shared/components/ConfirmDialog.vue'
import VisitorFormLayout from '../components/visitor-form/VisitorFormLayout.vue'
import { useResponsive } from '../composables/useResponsive'
import type { FormInstance, FormRules } from 'element-plus'
import {
  type VisitorFormData,
  createDefaultVisitorForm,
  formToStoreVisitor,
  storeVisitorToForm,
} from '../types'
import { getStoreVisitor } from '../api/frpc'
import { useVisitorStore } from '../stores/visitor'

const { t } = useI18n()
const { isMobile } = useResponsive()
const route = useRoute()
const router = useRouter()
const visitorStore = useVisitorStore()

const isEditing = computed(() => !!route.params.name)
const pageLoading = ref(false)
const saving = ref(false)
const formRef = ref<FormInstance>()
const form = ref<VisitorFormData>(createDefaultVisitorForm())
const dirty = ref(false)
const formSaved = ref(false)
const trackChanges = ref(false)

const formRules = computed<FormRules>(() => ({
  name: [
    { required: true, message: t('visitorEdit.nameRequired'), trigger: 'blur' },
    { min: 1, max: 50, message: t('visitorEdit.nameLength'), trigger: 'blur' },
  ],
  type: [{ required: true, message: t('visitorEdit.typeRequired'), trigger: 'change' }],
  serverName: [
    { required: true, message: t('visitorEdit.serverNameRequired'), trigger: 'blur' },
  ],
  bindPort: [
    { required: true, message: t('visitorEdit.bindPortRequired'), trigger: 'blur' },
    {
      validator: (_rule, value, callback) => {
        if (value == null) {
          callback(new Error(t('visitorEdit.bindPortRequired')))
          return
        }
        if (value > 65535) {
          callback(new Error(t('visitorEdit.bindPortMax')))
          return
        }
        if (form.value.type === 'sudp') {
          if (value < 1) {
            callback(new Error(t('visitorEdit.sudpBindPortPositive')))
            return
          }
          callback()
          return
        }
        if (value === 0) {
          callback(new Error(t('visitorEdit.bindPortNonZero')))
          return
        }
        callback()
      },
      trigger: 'blur',
    },
  ],
  pluginDestinationIP: [
    {
      validator: (_rule, value, callback) => {
        if (
          form.value.pluginType === 'virtual_net' &&
          (form.value.type === 'stcp' || form.value.type === 'xtcp') &&
          !value?.trim()
        ) {
          callback(new Error(t('visitorEdit.destinationIpRequired')))
          return
        }
        callback()
      },
      trigger: 'blur',
    },
  ],
}))

const goBack = () => {
  router.back()
}

watch(
  () => form.value,
  () => {
    if (trackChanges.value) {
      dirty.value = true
    }
  },
  { deep: true },
)

const leaveDialogVisible = ref(false)
const leaveResolve = ref<((value: boolean) => void) | null>(null)

onBeforeRouteLeave(async () => {
  if (dirty.value && !formSaved.value) {
    leaveDialogVisible.value = true
    return new Promise<boolean>((resolve) => {
      leaveResolve.value = resolve
    })
  }
})

const handleLeaveConfirm = () => {
  leaveDialogVisible.value = false
  leaveResolve.value?.(true)
}

const handleLeaveCancel = () => {
  leaveDialogVisible.value = false
  leaveResolve.value?.(false)
}

const loadVisitor = async () => {
  const name = route.params.name as string
  if (!name) return

  trackChanges.value = false
  dirty.value = false
  pageLoading.value = true
  try {
    const res = await getStoreVisitor(name)
    form.value = storeVisitorToForm(res)
    await nextTick()
  } catch (err: any) {
    ElMessage.error(t('visitorEdit.loadFailed') + err.message)
    router.push('/visitors')
  } finally {
    pageLoading.value = false
    nextTick(() => {
      trackChanges.value = true
    })
  }
}

const handleSave = async () => {
  if (!formRef.value) return

  try {
    await formRef.value.validate()
  } catch {
    ElMessage.warning(t('visitorEdit.fixErrors'))
    return
  }

  saving.value = true
  try {
    const data = formToStoreVisitor(form.value)
    if (isEditing.value) {
      await visitorStore.updateVisitor(form.value.name, data)
      ElMessage.success(t('visitorEdit.updated'))
    } else {
      await visitorStore.createVisitor(data)
      ElMessage.success(t('visitorEdit.created'))
    }
    formSaved.value = true
    router.push('/visitors')
  } catch (err: any) {
    ElMessage.error(t('common.operationFailed', { msg: err.message || t('common.unknownError') }))
  } finally {
    saving.value = false
  }
}

onMounted(() => {
  if (isEditing.value) {
    loadVisitor()
  } else {
    trackChanges.value = true
  }
})

watch(
  () => route.params.name,
  (name, oldName) => {
    if (name === oldName) return
    if (name) {
      loadVisitor()
      return
    }
    trackChanges.value = false
    form.value = createDefaultVisitorForm()
    dirty.value = false
    nextTick(() => {
      trackChanges.value = true
    })
  },
)
</script>

<style scoped lang="scss">
.visitor-edit-page {
  display: flex;
  flex-direction: column;
  height: 100%;
  max-width: 960px;
  margin: 0 auto;
}

/* Header */
.edit-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-shrink: 0;
  padding: 20px 24px;
}

.edit-content {
  flex: 1;
  overflow-y: auto;
  padding: 0 24px 160px;

  > * {
    max-width: 960px;
    margin: 0 auto;
  }
}

.header-actions {
  display: flex;
  gap: 8px;
}

/* Breadcrumb */
.breadcrumb {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
}

.breadcrumb-item {
  color: var(--text-secondary);
  text-decoration: none;
  transition: color 0.2s;
}

.breadcrumb-item:hover {
  color: var(--el-color-primary);
}

.breadcrumb-separator {
  color: var(--el-border-color);
}

.breadcrumb-current {
  color: var(--text-primary);
  font-weight: 500;
}

@include mobile {
  .edit-header {
    padding: 20px 16px;
  }

  .edit-content {
    padding: 0 16px 160px;
  }
}
</style>
