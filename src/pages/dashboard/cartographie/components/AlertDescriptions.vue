<template>
  <div v-if="alert">
    <a-descriptions :title="false" :column="3">
      <a-descriptions-item label="Name">
        {{ alert.name }}
      </a-descriptions-item>
      <a-descriptions-item label="Description">
        {{ alert.description || 'No description' }}
      </a-descriptions-item>
      <a-descriptions-item label="Active">
        <a-badge
          :status="alert.status === 1 ? 'processing' : 'error'"
          :text="alert.status === 1 ? 'Yes' : 'No'"
        />
      </a-descriptions-item>
      <a-descriptions-item label="from">
        {{ formatDate(new Date(alert.begindate), 'dd/MM/yyyy') }}
      </a-descriptions-item>
      <a-descriptions-item label="to">
        {{
          alert.enddate
            ? formatDate(new Date(alert.enddate), 'dd/MM/yyyy')
            : 'None'
        }}
      </a-descriptions-item>
      <a-descriptions-item label="importance">
        {{
          alert.level === 3
            ? 'Danger'
            : alert.level === 2
            ? 'Warning'
            : 'Normal'
        }}
      </a-descriptions-item>
      <a-descriptions-item label="Acknowlegment By User" :span="3">
        <a-badge status="processing" text="Yes" />
      </a-descriptions-item>
    </a-descriptions>
    <a-tabs default-active-key="1">
      <a-tab-pane key="1" tab="Alertes et flottes">
        <a-table
          :columns="columnsAlertDeviceAndFlotte"
          :data-source="devicesAndFlottes"
          size="small"
          :loading="devicesAndFlottesLoading"
        >
          <span slot-scope="objectType" slot="objectType">
            <a-icon :type="objectType === 'ensemble' ? 'folder' : 'file'" />
          </span>
        </a-table>
      </a-tab-pane>
      <a-tab-pane key="2" tab="Exigences">
        <a-table
          :columns="columnsConditionsAlert"
          :data-source="conditions"
          size="small"
          :loading="conditionsLoading"
        >
          <span slot-scope="target" slot="targetRender">
            {{ target.length > 3 && target.indexOf('{') === 0 && target.indexOf('}') === target.length - 1 ? $t(target.slice(0, -1).substring(1)) : target }}
          </span>
        </a-table>
      </a-tab-pane>
      <a-tab-pane key="3" tab="Action">
        <a-table
          :columns="columnsActionsAlert"
          :data-source="actions"
          size="small"
          :loading="actionsLoading"
        />
      </a-tab-pane>
    </a-tabs>
  </div>
</template>
<script>
import { format } from 'date-fns'
import { request, METHOD } from '@/utils/request'
const BASE_URL = process.env.VUE_APP_API_BASE_URL

const columnsActionsAlert = [
  {
    title: 'Type',
    dataIndex: 'type',
  },
  {
    title: 'Cible',
    dataIndex: 'target',
  },
]
const columnsConditionsAlert = [
  {
    title: 'Relation',
    dataIndex: 'relation',
  },
  {
    title: 'Type',
    dataIndex: 'type',
  },
  {
    title: 'Cible',
    dataIndex: 'target',
    scopedSlots: { customRender: 'targetRender' },
  },
  {
    title: 'Operateur',
    dataIndex: 'operator',
  },
  {
    title: 'Valeur',
    dataIndex: 'VALUE',
  },
]
const columnsAlertDeviceAndFlotte = [
  {
    title: 'Nom alerte',
    dataIndex: 'alertName',
  },
  {
    title: 'Nom device',
    dataIndex: 'deviceName',
  },
  {
    title: 'Nom flotte',
    dataIndex: 'flotteName',
  },
  {
    title: 'Type d\'objet',
    dataIndex: 'objectType',
    scopedSlots: { customRender: 'objectType' },
  },
]

export default {
  name: 'AlertDescriptions',
  props: {
    alert: {
      type: Object,
      required: false,
      default: () => null,
    },
  },
  i18n: {
    messages: {
      FR: {
        enginestate: 'Etat moteur',
        localizationhour: 'Heure de localisation',
      },
      US: {
        enginestate: 'Contact',
        localizationhour: 'Localization hour',
      },
    },
  },
  data() {
    return {
      columnsActionsAlert,
      columnsConditionsAlert,
      columnsAlertDeviceAndFlotte,
      devicesAndFlottes: [],
      conditions: [],
      actions: [],
      devicesAndFlottesLoading: true,
      conditionsLoading: true,
      actionsLoading: true,
    }
  },
  watch: {
    alert: function(newVal) {
      if (newVal) {
        this.updateInfos()
      }
    },
  },
  created() {},
  methods: {
    formatDate: (date = new Date(), formatDate = 'yyyy-MM-dd') => {
      return format(date, formatDate)
    },
    updateInfos() {
      this.conditionsLoading = true
      this.actionsLoading = true
      this.devicesAndFlottesLoading = true
      request(
        `${BASE_URL}/api/alertDeviceAndFlotte/${this.alert.id}`,
        METHOD.GET
      ).then((res) => {
        this.devicesAndFlottes = res.data
        this.devicesAndFlottesLoading = false
      })
      request(
        `${BASE_URL}/api/alertCondition/${this.alert.id}`,
        METHOD.GET
      ).then((res) => {
        this.conditions = res.data
        this.conditionsLoading = false
      })
      request(`${BASE_URL}/api/alertAction/${this.alert.id}`, METHOD.GET).then(
        (res) => {
          this.actions = res.data
          this.actionsLoading = false
        }
      )
    },
  },
}
</script>

<style lang="less" scoped></style>
