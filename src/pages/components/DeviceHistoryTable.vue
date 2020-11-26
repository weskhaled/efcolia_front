<template>
  <a-table
    :loading="dataHistoryLoading"
    :columns="columnsHistory"
    :data-source="dataHistory"
    rowKey="{record => record.history_id}"
    :scroll="{ x: 1100, y: 'calc(455px)' }"
    :pagination="{ pageSize: 25 }"
    size="small"
    class="table-history-device"
  >
    <div slot="action">
      <a><a-icon type="environment"/></a>
    </div>
    <span slot-scope="gprsstate" slot="gprsstate">
      <a-badge
        :status="gprsstate === 1 ? 'processing' : 'error'"
        :text="gprsstate === 1 ? 'Yes' : 'No'"
      />
    </span>
  </a-table>
</template>
<script>
import { format } from 'date-fns'
const columnsHistory = [
  {
    title: 'History Id',
    width: 120,
    dataIndex: 'history_id',
    fixed: 'left',
  },
  {
    title: 'Engine State',
    width: 100,
    dataIndex: 'enginestate',
    fixed: 'left',
  },
  { title: 'Device ip', width: 160, dataIndex: 'deviceip' },
  {
    title: 'gprs State',
    dataIndex: 'gprsstate',
    width: 150,
    scopedSlots: { customRender: 'gprsstate' },
  },
  { title: 'Speed', dataIndex: 'speed', width: 100 },
  { title: 'Latitude', dataIndex: 'latitude', width: 150 },
  { title: 'Longitude', dataIndex: 'longitude', width: 150 },
  {
    title: 'Localization Date',
    dataIndex: 'localizationdate',
    width: 200,
  },
  {
    title: 'Action',
    key: 'action',
    fixed: 'right',
    width: 100,
    scopedSlots: { customRender: 'action' },
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
    }
  },
  methods: {
    formatDate: (date = new Date(), formatDate = 'yyyy-MM-dd') => {
      return format(date, formatDate)
    },
  },
}
</script>

<style lang="less" scoped></style>
