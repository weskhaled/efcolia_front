<template>
  <div class="grid h-full">
    <div class="ant-form ant-form-horizontal flex flex-grow-1">
      <a-form-model ref="ruleForm" :model="form" :rules="rules" class="w-full">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div>
            <div>
              <a-form-model-item
                ref="commercialName"
                label="commercialName"
                prop="commercialName"
              >
                <a-input
                  v-model="form.commercialName"
                  @blur="
                    () => {
                      $refs.commercialName.onFieldBlur()
                    }
                  "
                />
              </a-form-model-item>
            </div>
            <div>
              <a-form-model-item label="country" prop="country">
                <a-select
                  v-model="form.country"
                  show-search
                  :filter-option="filterOptionCountry"
                  placeholder="please select country"
                >
                  <a-select-option
                    v-for="country in countries"
                    :key="country.country_id + '-' + country.lang_id"
                    :value="country.country_id + ',' + country.lang_id"
                  >
                    {{ country.name }} " {{ country.lang_id }} "
                  </a-select-option>
                </a-select>
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
            <div>
              <a-form-model-item label="Client Type" prop="clientType">
                <a-select
                  v-model="form.clientType"
                  placeholder="please select your device type"
                >
                  <a-select-option
                    v-for="clientType in clientTypes"
                    :key="clientType.clienttype_id"
                    :value="clientType.clienttype_id"
                  >
                    {{ clientType.type }}
                  </a-select-option>
                </a-select>
              </a-form-model-item>
            </div>
            <div class="col-span-1">
              <a-form-model-item label="Status" prop="status">
                <a-switch v-model="form.status" />
              </a-form-model-item>
            </div>
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
        @click="onSubmit"
        class="ml-2"
      >
        Update
      </a-button>
    </div>
  </div>
</template>
<script>
import { request, METHOD } from '@/utils/request'
const BASE_URL = process.env.VUE_APP_API_BASE_URL

export default {
  name: 'ClientInfos',
  props: {
    client: {
      type: Object,
      required: false,
      default: () => ({
        client_id: null,
        status: 0,
        clientType: '',
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
        status: false,
        commercialName: '',
        country: '',
        begindate: '',
        description: '',
      },
      updateLoading: false,
      rules: {
        commercialName: [
          {
            required: true,
            message: 'Please input commercialname',
            trigger: 'blur',
          },
        ],
      },
      clientTypes: [],
      countries: [],
    }
  },
  watch: {
    client: function(newVal) {
      if (newVal) {
        this.updateInfos()
      }
    },
  },
  created() {
    request(`${BASE_URL}/api/clientType`, METHOD.GET).then(
      (res) => (this.clientTypes = res.data)
    )
    request(`${BASE_URL}/api/country`, METHOD.GET).then(
      (res) => (this.countries = res.data)
    )
  },
  methods: {
    updateInfos() {
      this.form.client_id = this.client.client_id || ''
      this.form.status = !!this.client.clientstatus || false
      this.form.commercialName = this.client.commercialname || ''
      this.form.clientType = this.client.clientType || undefined
      this.form.country = this.client.country || ''
      this.form.begindate = this.client.begindate || ''
      this.form.description = this.client.description || ''
    },
    onSubmit() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          this.$emit('updateClient', {
            ...this.form,
            country: this.form.country.split(',')[0] || undefined
          })
        } else {
          return false
        }
      })
    },
    filterOptionCountry(input, option) {
      return (
        option.componentOptions.children[0].text
          .toLowerCase()
          .indexOf(input.toLowerCase()) >= 0
      )
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
