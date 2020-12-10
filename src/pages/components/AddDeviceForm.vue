<template>
  <a-form-model
    class="add-device-form"
    ref="ruleForm"
    :model="form"
    :rules="rules"
  >
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <div>
        <div>
          <a-form-model-item ref="name" label="Device name" prop="name">
            <a-input
              v-model="form.name"
              @blur="
                () => {
                  $refs.name.onFieldBlur()
                }
              "
            />
          </a-form-model-item>
        </div>
        <div>
          <a-form-model-item label="Type boîtier" prop="deviceTypeId">
            <a-select
              v-model="form.deviceTypeId"
              placeholder="please select your device type"
              @change="selectDeviceType"
            >
              <a-select-option
                v-for="deviceType in deviceTypes"
                :key="deviceType.devicetype_id"
                :value="deviceType.devicetype_id"
              >
                {{ deviceType.name }}
              </a-select-option>
            </a-select>
          </a-form-model-item>
        </div>
        <div>
          <a-form-model-item label="Device Sub Type" prop="deviceSubtypeId">
            <a-select
              v-model="form.deviceSubtypeId"
              placeholder="please select your device sub type"
            >
              <a-select-option
                v-for="deviceSubType in deviceSubTypes"
                :key="deviceSubType.devicesubtype_id"
                :value="deviceSubType.devicesubtype_id"
              >
                {{ deviceSubType.name }}
              </a-select-option>
            </a-select>
          </a-form-model-item>
        </div>
        <div>
          <a-form-model-item
            ref="serialNumber"
            label="Identifiant"
            prop="device_id2"
          >
            <a-input
              v-model="form.device_id2"
              @blur="
                () => {
                  $refs.device_id2.onFieldBlur()
                }
              "
            />
          </a-form-model-item>
        </div>
        <div>
          <a-form-model-item
            ref="serialNumber"
            label="Numéro de série"
            prop="serialNumber"
          >
            <a-input
              v-model="form.serialNumber"
              @blur="
                () => {
                  $refs.serialNumber.onFieldBlur()
                }
              "
            />
          </a-form-model-item>
        </div>
        <div>
          <a-form-model-item label="Activity time" prop="fromTo">
            <a-range-picker
              v-model="form.fromTo"
              show-time
              :placeholder="['from', 'to']"
              style="width: 100%;"
            />
          </a-form-model-item>
        </div>
      </div>
      <div>
        <div>
          <a-form-model-item label="Activeted" prop="status">
            <a-switch v-model="form.status" />
          </a-form-model-item>
        </div>
        <div>
          <a-form-model-item label="Find Address" prop="findAddress">
            <a-switch v-model="form.findAddress" />
          </a-form-model-item>
        </div>
        <div class="col-span-1">
          <a-form-model-item label="Description" prop="desc">
            <a-input v-model="form.desc" type="textarea" />
          </a-form-model-item>
        </div>
      </div>
    </div>
  </a-form-model>
</template>
<script>
import { request, METHOD } from '@/utils/request'
const BASE_URL = process.env.VUE_APP_API_BASE_URL

export default {
  name: 'AddDeviceForm',
  props: {
    device: {
      type: Object,
      required: false,
      default: () => ({}),
    },
  },
  data() {
    return {
      form: {
        name: '',
        deviceTypeId: undefined,
        deviceSubtypeId: undefined,
        device_id2: '',
        serialNumber: '',
        fromTo: undefined,
        status: false,
        simCardId: 1,
        findAddress: false,
        timezone: 'Europe/Paris',
        desc: '',
      },
      rules: {
        name: [
          {
            required: true,
            message: 'Please input name',
            trigger: 'blur',
          },
        ],
        serialNumber: [
          {
            required: true,
            message: 'Please input serialNumber',
          },
          {
            min: 1,
            max: 15,
            message: 'Length should be 1 to 15',
          },
        ],
        device_id2: [
          {
            required: true,
            message: 'Please input Identifiant',
          },
        ],
        deviceTypeId: [
          {
            required: true,
            message: 'Please input device type',
          },
        ],
      },
      deviceTypes: [],
      deviceSubTypes: [],
    }
  },
  created() {
    request(`${BASE_URL}/api/deviceType`, METHOD.GET).then(
      (res) => (this.deviceTypes = res.data)
    )
  },
  methods: {
    selectDeviceType(deviceTypeId) {
      request(`${BASE_URL}/api/deviceSubType/${deviceTypeId}`, METHOD.GET).then(
        (res) => (this.deviceSubTypes = res.data)
      )
    },
    onSubmit() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          this.$emit('submit', {
            ...this.form,
            deviceTypeId: +this.form.deviceTypeId,
            deviceSubtypeId: +this.form.deviceSubtypeId,
            status: this.form.status ? 1 : 0,
            findAddress: this.form.findAddress ? 1 : 0,
          })
        } else {
          return false
        }
      })
    },
    resetForm() {
      this.$refs.ruleForm.resetFields()
    },
  },
}
</script>

<style lang="less" scoped>
.add-device-form {
  .ant-form-item {
    margin-bottom: 5px;
    .ant-form-item-label {
      line-height: 22px;
    }
  }
}
</style>
