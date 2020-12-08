<template>
  <a-form-model
    class="add-alert-form"
    ref="ruleForm"
    :model="form"
    :rules="rules"
  >
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <div>
        <div>
          <a-form-model-item ref="name" label="Alert name" prop="name">
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
          <a-form-model-item label="Devices" prop="device">
            <a-select
              v-model="form.device"
              placeholder="please select your devices"
              mode="multiple"
            >
              <a-select-option
                v-for="device in devices"
                :key="device.id"
                :value="device.id"
              >
                {{ device.name }}
              </a-select-option>
            </a-select>
          </a-form-model-item>
        </div>
        <div>
          <a-form-model-item label="Flotte" prop="flotte">
            <a-select
              v-model="form.flotte"
              placeholder="please select your flotte"
              mode="multiple"
            >
              <a-select-option
                v-for="flotte in flottes"
                :key="flotte.ensembleId"
                :value="flotte.ensembleId"
              >
                {{ flotte.name }}
              </a-select-option>
            </a-select>
          </a-form-model-item>
        </div>
      </div>
      <div>
        <div>
          <a-form-model-item label="level" prop="level">
            <a-select
              v-model="form.level"
              placeholder="please select your device level"
            >
              <a-select-option key="1" value="1">
                1
              </a-select-option>
              <a-select-option key="2" value="2">
                2
              </a-select-option>
              <a-select-option key="3" value="3">
                3
              </a-select-option>
            </a-select>
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
        <div>
          <a-form-model-item label="Statu" prop="status">
            <a-switch v-model="form.status" />
          </a-form-model-item>
        </div>
        <div class="col-span-1">
          <a-form-model-item label="Description" prop="desc">
            <a-input v-model="form.description" type="textarea" />
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
  name: 'AddAlertForm',
  props: {
    devices: {
      type: Array,
      required: true,
      default: () => [],
    },
    clientId: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      form: {
        name: '',
        description: '',
        level: 1,
        status: false,
        fromTo: undefined,
        device: [],
        flotte: [],
        condition: {},
        action: [],
      },
      rules: {
        name: [
          {
            required: true,
            message: 'Please input name',
            trigger: 'blur',
          },
        ],
        fromTo: [
          {
            required: true,
            message: 'Please input activity time',
            trigger: 'blur',
          },
        ],
      },
      flottes: [],
    }
  },
  created() {
    request(
      `${BASE_URL}/api/ensemble/byClientId/${this.clientId}`,
      METHOD.GET
    ).then((res) => (this.flottes = res.data))
  },
  methods: {
    onSubmit() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          this.$emit('submit', {
            ...this.form,
            clientId: +this.clientId,
            from: this.form.fromTo[0]?._d || null,
            to: this.form.fromTo[1]?._d || null,
            status: this.form.status ? 1 : 0,
            fromTo: undefined,
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
