<template>
  <a-form-model
    class="add-user-form"
    ref="ruleForm"
    :model="form"
    :rules="rules"
  >
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <div>
        <div>
          <a-form-model-item ref="firstname" label="User name" prop="firstname">
            <a-input
              v-model="form.firstname"
              @blur="
                () => {
                  $refs.firstname.onFieldBlur()
                }
              "
            />
          </a-form-model-item>
        </div>
        <div>
          <a-form-model-item ref="lastname" label="User name" prop="lastname">
            <a-input
              v-model="form.lastname"
              @blur="
                () => {
                  $refs.lastname.onFieldBlur()
                }
              "
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
  name: 'AddContactForm',
  props: {
    user: {
      type: Object,
      required: false,
      default: () => ({}),
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
        deviceTypeId: undefined,
        deviceSubtypeId: undefined,
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
          }
        ],
      },
      permissions: [],
    }
  },
  created() {
    request(`${BASE_URL}/api/deviceType`, METHOD.GET).then(
      (res) => (this.deviceTypes = res.data)
    )
  },
  methods: {
    onSubmit() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          this.$emit('submit', {
            ...this.form,
            clientId: +this.clientId,
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
