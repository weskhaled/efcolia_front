<template>
  <a-table
    :loading="dataHistoryLoading"
    :columns="columnsHistory.filter((c) => !c.hidden)"
    :data-source="dataHistory"
    :rowKey="(record) => record.history_id"
    :scroll="{ x: 1100, y: 'calc(455px)' }"
    :pagination="{ pageSize: 25 }"
    size="small"
    class="table-history-device"
  >
    <span slot="customActionTitle">
      <a-dropdown>
        <a class="ant-dropdown-link" @click="(e) => e.preventDefault()">
          select columns <a-icon type="down" />
        </a>
        <a-menu slot="overlay" @click="(e) => e.preventDefault()">
          <a-menu-item
            v-for="(column, index) in columnsHistory.filter((c) => c.title)"
            :key="index"
            @click="(e) => e.preventDefault()"
          >
            <a-checkbox
              :checked="!column.hidden"
              @change="
                (e) => {
                  column.hidden = !e.target.checked
                }
              "
            >
              {{ column.title }}
            </a-checkbox>
          </a-menu-item>
        </a-menu>
      </a-dropdown>
    </span>
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
    title: 'Id',
    width: 120,
    dataIndex: 'history_id',
    fixed: 'left',
    hidden: false,
  },
  {
    title: 'Engine State',
    width: 100,
    dataIndex: 'enginestate',
    fixed: 'left',
    hidden: true,
  },
  { title: 'Device ip', width: 160, dataIndex: 'deviceip', hidden: true },
  {
    title: 'gprs State',
    dataIndex: 'gprsstate',
    width: 150,
    scopedSlots: { customRender: 'gprsstate' },
    hidden: false,
  },
  { title: 'Speed', dataIndex: 'speed', width: 100, hidden: false },
  { title: 'Latitude', dataIndex: 'latitude', width: 150, hidden: false },
  { title: 'Longitude', dataIndex: 'longitude', width: 150, hidden: false },
  {
    title: 'Localization Date',
    dataIndex: 'localizationdate',
    width: 200,
    hidden: true,
  },
  {
    key: 'action',
    fixed: 'right',
    width: 160,
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
