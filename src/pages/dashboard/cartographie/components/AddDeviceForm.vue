<template>
  <a-form-model class="add-device-form" ref="ruleForm" :model="form" :rules="rules" layout="inline">
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <div>
        <div>
          <a-form-model-item label="Active" prop="status">
            <a-switch v-model="form.status" />
          </a-form-model-item>
        </div>
        <div>
          <a-form-model-item ref="name" label="Nom" prop="name">
            <a-input v-model="form.name" />
          </a-form-model-item>
        </div>
        <div>
          <a-form-model-item label="Type" prop="deviceTypeId">
            <a-select
              v-model="form.deviceTypeId"
              placeholder="please select your device type"
              @change="selectDeviceType"
            >
              <a-select-option
                v-for="deviceType in deviceTypes"
                :key="deviceType.devicetype_id"
                :value="deviceType.devicetype_id"
              >{{ deviceType.name }}</a-select-option>
            </a-select>
          </a-form-model-item>
        </div>
        <div>
          <a-form-model-item label="Sous Type" prop="deviceSubtypeId">
            <a-select
              v-model="form.deviceSubtypeId"
              placeholder="please select your device sub type"
            >
              <a-select-option
                v-for="deviceSubType in deviceSubTypes"
                :key="deviceSubType.devicesubtype_id"
                :value="deviceSubType.devicesubtype_id"
              >{{ deviceSubType.name }}</a-select-option>
            </a-select>
          </a-form-model-item>
        </div>
        <div>
          <a-form-model-item ref="serialNumber" label="N° de série" prop="serialNumber">
            <a-input v-model="form.serialNumber" />
          </a-form-model-item>
        </div>
        <div>
          <a-form-model-item ref="imei" label="IMEI" prop="imei">
            <a-input v-model="form.imei" />
          </a-form-model-item>
        </div>
        <div>
          <a-form-model-item ref="serialNumber" label="Identifiant" prop="device_id2">
            <a-input v-model="form.device_id2" />
          </a-form-model-item>
        </div>
      </div>
      <div>
        <div>
          <a-form-model-item label="Du / Au" prop="fromTo">
            <a-range-picker
              v-model="form.fromTo"
              show-time
              :placeholder="['du', 'au']"
              style="width: 100%"
            />
          </a-form-model-item>
        </div>
        <div>
          <a-form-model-item label="Client" prop="client">
            <div class="flex flex-1 mb-4 md:mb-0 relative">
              <a-tree-select
                v-model="form.clientId"
                treeNodeFilterProp="title"
                class="self-center w-full"
                placeholder="Please select a client"
                show-search
                tree-data-simple-mode
                :disabled="!!!clients.length"
                :class="!!!clients.length ? 'opacity-50' : ''"
                :dropdown-style="{ maxHeight: '300px', overflow: 'auto' }"
                :treeDefaultExpandAll="false"
                :treeDefaultExpandedKeys="[1]"
                :tree-data="clients"
              />
              <a-spin
                :spinning="!!!clients.length"
                style="position: absolute; top: calc(50% - 13px); right: 5px"
              >
                <a-icon slot="indicator" type="loading" style="font-size: 24px" spin />
              </a-spin>
            </div>
          </a-form-model-item>
        </div>
        <div class="col-span-1">
          <a-form-model-item label="Description" prop="description">
            <a-input
              v-model="form.description"
              type="textarea"
              :auto-size="{ minRows: 7, maxRows: 12 }"
            />
          </a-form-model-item>
        </div>
        <div>
          <a-form-model-item label="Recherche" prop="findaddress">
            <a-switch v-model="form.findaddress" />
          </a-form-model-item>
        </div>
      </div>
    </div>
    <hr class="my-3" />
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <div>
        <div>
          <a-form-model-item label="Carte SIM" prop="simcard">
            <a-select
              v-model="form.simcard"
              placeholder="please select Sim Card"
              show-search
              :filter-option="filterOptionSimcard"
            >
              <a-select-option
                v-for="simcard in simCards"
                :key="simcard.simcard_id"
                :value="simcard.simcard_id"
              >{{ simcard.sim }}</a-select-option>
            </a-select>
          </a-form-model-item>
        </div>
        <div>
          <a-form-model-item label="Vie privee" prop="device_privacy">
            <a-select v-model="form.privacy" placeholder="please select Vie privee">
              <a-select-option value="aucun">Aucun</a-select-option>
              <a-select-option value="input1">Input 1</a-select-option>
              <a-select-option value="input2">Input 2</a-select-option>
            </a-select>
          </a-form-model-item>
        </div>
      </div>
      <div></div>
    </div>
  </a-form-model>
</template>
<script>
import { request, METHOD } from '@/utils/request'
import moment from 'moment'
const BASE_URL = process.env.VUE_APP_API_BASE_URL

export default {
  name: 'AddDeviceForm',
  props: {
    clients: {
      type: Array,
      required: false,
      default: () => [],
    },
    device: {
      type: Object,
      required: false,
      default: () => null,
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
        device_id2: '',
        csq: '',
        imei: '',
        serialNumber: '',
        fromTo: [null, null],
        status: false,
        clientId: undefined,
        privacy: '',
        simcard: undefined,
        description: '',
        findaddress: false
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
      simCards: [],
    }
  },
  watch: {
    device: function () {
      this.$nextTick(() => {
        this.resetForm()
      })
    },
  },
  mounted() {
    this.getDeviceTypes()
    this.getSimCards()
  },
  created() {
    this.resetForm()
  },
  methods: {
    getDeviceTypes() {
      request(`${BASE_URL}/api/deviceType`, METHOD.GET).then((res) => {
        this.deviceTypes = res.data
        this.device?.devicesubtype_id &&
          this.selectDeviceType(this.device.devicetype_id)
      })
    },
    getSimCards() {
      request(`${BASE_URL}/api/simcard/${this.clientId}`, METHOD.GET).then(
        (res) => {
          this.simCards = res.data
          if (this.device && this.device.simcard_id) {
            this.form.simcard =
              this.simCards.find(
                (sc) => +sc.simcard_id === +this.device.simcard_id
              )?.simcard_id || null
          }
        }
      )
    },
    selectDeviceType(deviceTypeId) {
      request(`${BASE_URL}/api/deviceSubType/${deviceTypeId}`, METHOD.GET).then(
        (res) => (this.deviceSubTypes = res.data || [])
      )
    },
    onSubmit() {
      this.$refs.ruleForm?.validate((valid) => {
        console.log(valid)
        console.log(this.form)
        if (valid) {
          const form = JSON.parse(JSON.stringify(this.form))

          this.$emit('submit', {
            ...form,
            findaddress: undefined,
            id: this.device?.id || undefined,
            simCardId: this.form.simcard,
            timezone: 'Europe/Paris',
            deviceTypeId: +form.deviceTypeId,
            deviceSubtypeId: +form.deviceSubtypeId,
            status: form.status ? true : false,
            findAddress: form.findaddress ? 1 : 0,
            begindate: (form.fromTo && form.fromTo[0]) || null,
            enddate: (form.fromTo && form.fromTo[1]) || null,
            fromTo: undefined,
          })
        } else {
          return false
        }
      })
    },
    resetForm() {
      this.fillInputs()
    },
    filterOptionClient(input, option) {
      return (
        option.componentOptions.children[0].text
          .toLowerCase()
          .indexOf(input.toLowerCase()) >= 0
      )
    },
    filterOptionSimcard(input, option) {
      return (
        option.componentOptions.children[0].text
          .toLowerCase()
          .indexOf(input.toLowerCase()) >= 0
      )
    },
    fillInputs() {
      this.deviceTypes.length === 0 && this.getDeviceTypes()
      this.getSimCards()
      this.form.name = this.device?.name || ''
      this.form.deviceTypeId = this.device?.devicetype_id || ''
      this.form.deviceSubtypeId = this.device?.devicesubtype_id || ''
      this.form.device_id2 = this.device?.device_id2 || ''
      this.form.csq = this.device?.csq || ''
      this.form.imei = this.device?.imei || ''
      this.form.serialNumber = this.device?.serialnumber || ''
      this.form.fromTo = [this.moment(new Date()), null]
      if (this.device) {
        this.device?.begindate ? (this.form.fromTo[0] = this.moment(new Date(this.device?.begindate))) : (this.form.fromTo[0] = this.moment(new Date()).format('YYYY-MM-DD HH:mm:ss'))
        this.device?.enddate ? (this.form.fromTo[1] = this.moment(new Date(this.device?.enddate))) : (this.form.fromTo[1] = null)
      }
      this.form.status = this.device?.status === 1 || false
      this.form.clientId = this.device?.clientId || this.clientId || ''
      this.form.findaddress = this.device?.findaddress === 1 || false
      this.form.description = this.device?.description || ''
      this.form.simcard = this.device?.simcard_id || ''
    },
    moment,
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
