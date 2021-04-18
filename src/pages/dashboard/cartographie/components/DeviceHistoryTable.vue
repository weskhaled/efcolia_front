<template>
  <div class="h-full" ref="historyTableWrapper">
    <a-table
      :loading="dataHistoryLoading"
      :columns="columnsHistory.filter((c) => !c.hidden)"
      :data-source="dataHistory"
      :rowKey="(record) => record.history_id"
      :scroll="tableScroll"
      :pagination="{
        pageSize: 25,
        pageSizeOptions: ['25', '50', '100'],
        showSizeChanger: true,
        showTotal: (total) => `Total ${total} items`,
      }"
      size="small"
      class="table-history-device"
    >
      <span slot="customActionTitle">
        <a-popover placement="bottom" class="device-history">
          <template slot="content">
            <div class="h-64 overflow-y-auto">
              <div
                v-for="(column, index) in columnsHistory
                  .filter((c) => c.title)
                  .filter((c) => c.title !== 'Id')"
                :key="index"
                class="py-1"
                :class="[
                  columnsHistory
                    .filter((c) => c.title)
                    .filter((c) => c.title !== 'Id').length -
                    1 >
                  index
                    ? 'border-b border-gray-200'
                    : '',
                ]"
              >
                <a-checkbox
                  :checked="!column.hidden"
                  class="w-full"
                  @change="
                    (e) => {
                      column.hidden = !e.target.checked
                      saveToLocal()
                    }
                  "
                >
                  {{ column.title }}
                </a-checkbox>
              </div>
            </div>
          </template>
          <a class="ant-dropdown-link" @click="(e) => e.preventDefault()">
            Action <a-icon type="down" />
          </a>
        </a-popover>
      </span>
      <div slot="action" slot-scope="record">
        <a v-if="record.latitude && record.longitude"
          ><a-icon type="environment"
        /></a>
      </div>
      <span slot-scope="enginestate" slot="enginestate">
        <a-icon
          :class="[
            enginestate === 3
              ? 'text-green-500'
              : (enginestate === 1 && 'text-red-500') || 'text-grey-500',
          ]"
          key="edit"
          type="poweroff"
        />
      </span>
    </a-table>
  </div>
</template>
<script>
import { format } from 'date-fns'
const columnsHistory = [
  {
    title: 'Nom du boitier',
    width: 120,
    dataIndex: 'name',
    fixed: 'left',
    hidden: false,
  },
  {
    title: 'Date serveur',
    width: 180,
    dataIndex: 'appdate',
    hidden: false,
  },
  {
    title: 'Date de localisation',
    width: 180,
    dataIndex: 'localizationdate',
    hidden: false,
  },
  {
    title: 'Latitude',
    width: 120,
    dataIndex: 'latitude',
    hidden: false,
  },
  {
    title: 'Longitude',
    width: 120,
    dataIndex: 'longitude',
    hidden: false,
  },
  {
    title: 'Altitude',
    width: 100,
    dataIndex: 'altitude',
    hidden: false,
  },
  {
    title: 'Vitesse',
    width: 100,
    dataIndex: 'speed',
    hidden: false,
  },
  {
    title: 'GPS',
    width: 100,
    dataIndex: 'satsinuse',
    hidden: false,
  },
  {
    title: 'Etat moteur',
    width: 120,
    dataIndex: 'enginestate',
    hidden: false,
    scopedSlots: { customRender: 'enginestate' },
  },
  {
    title: 'Etat acceleromètre',
    width: 150,
    dataIndex: 'accelerostate',
    hidden: false,
  },
  {
    title: 'Odomètre',
    width: 100,
    dataIndex: 'totaldistance',
    hidden: false,
  },
  {
    title: 'Input',
    width: 100,
    dataIndex: 'sensors',
    hidden: false,
  },
  {
    title: 'Temp 1',
    width: 100,
    dataIndex: 'temperature1',
    hidden: false,
  },
  {
    title: 'Temp 2',
    width: 100,
    dataIndex: 'temperature2',
    hidden: false,
  },
  {
    title: 'Temp 3',
    width: 100,
    dataIndex: 'temperature3',
    hidden: false,
  },
  {
    title: 'Niveau GSM',
    width: 100,
    dataIndex: 'csq',
    hidden: false,
  },
  {
    title: 'Voltage batterie',
    width: 160,
    dataIndex: 'batteryvoltage',
    hidden: false,
  },
  {
    title: 'Voltage batterie Ext.',
    width: 160,
    dataIndex: 'battery2voltage',
    hidden: false,
  },
  {
    title: 'Firmware',
    width: 120,
    dataIndex: 'firmware',
    hidden: false,
  },
  {
    title: 'Conducteur',
    width: 120,
    dataIndex: 'driver_id2',
    hidden: false,
  },
  {
    title: 'Adresse',
    width: 280,
    dataIndex: 'adress',
    hidden: false,
  },
  {
    key: 'action',
    fixed: 'right',
    width: 90,
    slots: { title: 'customActionTitle' },
    scopedSlots: { customRender: 'action', hidden: true },
  },
]
export default {
  name: 'DeviceHistoryTable',
  props: {
    dataHistory: {
      type: Array,
      required: true,
      default: () => [],
    },
    dataHistoryLoading: {
      type: Boolean,
      required: true,
      default: () => true,
    },
  },
  data() {
    return {
      columnsHistory,
      visibleSelectColumns: false,
      tableScroll: { x: 1100, y: 455 },
    }
  },
  created() {},
  mounted() {
    this.tableScroll.y = this.$refs.historyTableWrapper.clientHeight - 85
    this.getFromLocal()
  },
  methods: {
    formatDate: (date = new Date(), formatDate = 'yyyy-MM-dd') => {
      return format(date, formatDate)
    },
    getFromLocal() {
      const historyColumns = localStorage.getItem('historyColumnsHidden')
      if (historyColumns && JSON.parse(historyColumns)) {
        const savedHistoryColumnsHidden = JSON.parse(historyColumns)
        this.columnsHistory.forEach(
          (c) =>
            (c.hidden = savedHistoryColumnsHidden.find(
              (sc) => sc.title === c.title
            )?.value)
        )
      } else {
        this.saveToLocal()
      }
    },
    saveToLocal() {
      const historyColumnsHidden = this.columnsHistory.filter(c => c.key !== 'action').map((ch) => ({
        title: ch.title,
        value: ch.hidden,
        dataIndex: ch.dataIndex
      }))
      localStorage.setItem(
        'historyColumnsHidden',
        JSON.stringify(historyColumnsHidden)
      )
    },
  },
}
</script>

<style lang="less" scoped></style>
