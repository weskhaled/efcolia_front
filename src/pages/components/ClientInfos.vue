<template>
  <div class="grid h-full">
    <div class="ant-form ant-form-horizontal flex flex-grow-1">
      <a-form-model ref="ruleForm" :model="form" class="w-full">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div>
            <div>
              <a-form-model-item
                ref="commercialname"
                label="commercialname"
                prop="commercialname"
              >
                <a-input
                  v-model="form.commercialname"
                  @blur="
                    () => {
                      $refs.commercialname.onFieldBlur()
                    }
                  "
                />
              </a-form-model-item>
            </div>
            <div>
              <a-form-model-item ref="country" label="country" prop="country">
                <a-input
                  v-model="form.country"
                  @blur="
                    () => {
                      $refs.country.onFieldBlur()
                    }
                  "
                />
              </a-form-model-item>
            </div>
            <div>
              <a-form-model-item
                ref="begindate"
                label="begindate"
                prop="begindate"
              >
                <a-input
                  v-model="form.begindate"
                  @blur="
                    () => {
                      $refs.begindate.onFieldBlur()
                    }
                  "
                />
              </a-form-model-item>
            </div>
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
    </div>
    <div class="flex h-10 items-center justify-end self-end mx-1">
      <a-button key="back" @click="updateInfos">
        Reset
      </a-button>
      <a-button
        key="submit"
        type="primary"
        :loading="updateLoading"
        @click="() => updateClient"
        class="ml-2"
      >
        Update
      </a-button>
    </div>
  </div>
</template>
<script>
// import { request, METHOD } from '@/utils/request'
// const BASE_URL = process.env.VUE_APP_API_BASE_URL

export default {
  name: 'ClientInfos',
  props: {
    client: {
      type: Object,
      required: false,
      default: () => ({
        client_id: null,
        clientstatus: 0,
        commercialname: '',
        country: '',
        begindate: '',
        description: '',
      }),
    },
  },
  data() {
    return {
      form: {
        client_id: '',
        clientstatus: 0,
        commercialname: '',
        country: '',
        begindate: '',
        description: '',
      },
      updateLoading: false,
    }
  },
  watch: {
    client: function(newVal) {
      if (newVal) {
        this.updateInfos()
      }
    },
  },
  mounted() {},
  methods: {
    updateInfos() {
      this.form.client_id = this.client.client_id || ''
      this.form.clientstatus = this.client.clientstatus || ''
      this.form.commercialname = this.client.commercialname || ''
      this.form.country = this.client.country || ''
      this.form.begindate = this.client.begindate || ''
      this.form.description = this.client.description || ''
    },
    updateClient() {
      console.log(this.form)
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
