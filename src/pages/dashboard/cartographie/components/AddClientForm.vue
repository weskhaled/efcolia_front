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
          <a-form-model-item
            ref="commercialName"
            label="Nom commercial"
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
          <a-form-model-item label="Statut" prop="status">
            <a-switch v-model="form.status" />
          </a-form-model-item>
        </div>
        <div>
          <a-form-model-item label="Type de client" prop="clientTypeId">
            <a-select
              v-model="form.clientTypeId"
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
        <div>
          <a-form-model-item label="Pays" prop="country">
            <a-select
              v-model="form.country"
              show-search
              :filter-option="filterOptionCountry"
              placeholder="please select country"
            >
              <a-select-option
                v-for="country in countries"
                :key="country.country_id + '' + country.lang_id"
                :value="country.country_id + ',' + country.lang_id"
              >
                {{ country.name }} " {{ country.lang_id }} "
              </a-select-option>
            </a-select>
          </a-form-model-item>
        </div>
      </div>
      <div>
        <div class="col-span-1">
          <a-form-model-item label="Description" prop="description">
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
  name: 'AddClientForm',
  props: {
    client: {
      type: Object,
      required: false,
      default: () => ({}),
    },
  },
  data() {
    return {
      form: {
        commercialName: '',
        status: false,
        country: undefined,
        clientTypeId: undefined,
        description: '',
      },
      rules: {
        commercialName: [
          {
            required: true,
            message: 'Please input name',
            trigger: 'blur',
          },
        ],
        status: [
          {
            required: true,
            message: 'Please input serialNumber',
          },
        ],
        clientType: [
          {
            required: true,
            message: 'Please input device type',
          },
        ],
      },
      clientTypes: [],
      countries: [],
    }
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
    onSubmit() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          this.$emit('submit', {
            ...this.form,
            clientType: +this.form.clientTypeId,
            country: +this.form.country,
            status: this.form.status ? 1 : 0,
          })
        } else {
          return false
        }
      })
    },
    resetForm() {
      this.$refs.ruleForm.resetFields()
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
