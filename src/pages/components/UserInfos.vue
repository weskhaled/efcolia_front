<template>
  <a-form-model
    ref="ruleForm"
    :model="form"
  >
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <div>
        <div>
          <a-form-model-item ref="firstname" label="firstname" prop="firstname">
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
          <a-form-model-item ref="lastname" label="lastname" prop="lastname">
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
        <div>
          <a-form-model-item ref="jobtitle" label="jobtitle" prop="jobtitle">
            <a-input
              v-model="form.jobtitle"
              @blur="
                () => {
                  $refs.jobtitle.onFieldBlur()
                }
              "
            />
          </a-form-model-item>
        </div>
        <!-- <div>
          <a-form-model-item label="Client Type" prop="clientTypeId">
            <a-select v-model="form.clientId">
              <a-select-option
                v-for="client in clients"
                :key="client.client_id"
                :value="client.client_id"
              >
                {{ client.commercialname }}
              </a-select-option>
            </a-select>
          </a-form-model-item>
        </div> -->
      </div>
      <div>
        <div class="col-span-1">
          <a-form-model-item label="description" prop="description">
            <a-input v-model="form.description" type="textarea" />
          </a-form-model-item>
        </div>
      </div>
    </div>
  </a-form-model>
</template>
<script>
// import { request, METHOD } from '@/utils/request'
// const BASE_URL = process.env.VUE_APP_API_BASE_URL

export default {
  name: 'UserInfos',
  props: {
    user: {
      type: Object,
      required: false,
      default: () => ({}),
    },
  },
  data() {
    return {
      form: {
        lastname: '',
        firstname: '',
        jobtitle: '',
        description: '',
      },
    }
  },
  mounted() {
    console.log(this.user)
    this.form.lastname = this.user.lastname || ''
    this.form.firstname = this.user.firstname || ''
    this.form.jobtitle = this.user.jobtitle || ''
    this.form.description = this.user.description || ''
  },
  methods: {},
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
