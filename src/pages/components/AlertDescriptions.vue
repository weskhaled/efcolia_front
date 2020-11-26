<template>
  <div>
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
    <a-tabs default-active-key="2">
      <a-tab-pane key="1" tab="Requirement">
        test
      </a-tab-pane>
      <a-tab-pane key="2" tab="Action" force-render>
        <a-table
          :columns="columnsAlert"
          :data-source="dataAlert"
          size="small"
        />
      </a-tab-pane>
    </a-tabs>
  </div>
</template>
<script>
import { format } from 'date-fns'
const columnsAlert = [
  {
    title: 'Link',
    dataIndex: 'link',
  },
  {
    title: 'Type',
    dataIndex: 'type',
  },
  {
    title: 'Target',
    dataIndex: 'target',
  },
  {
    title: 'Operator',
    dataIndex: 'operator',
  },
  {
    title: 'Value',
    dataIndex: 'value',
  },
]
const dataAlert = [
  {
    key: '1',
    link: 'John Brown',
    type: 'test',
    target: 'New York',
    operator: 'New York No. 1 Lake Park',
    value: 32,
  },
  {
    key: '2',
    link: 'Jim Green',
    type: 'test',
    target: 'London',
    operator: 'London No. 1 Lake Park',
    value: 42,
  },
  {
    key: '3',
    link: 'Joe Black',
    type: 'test',
    target: 'Sidney',
    operator: 'Sidney No. 1 Lake Park',
    value: 32,
  },
]

export default {
  name: 'AlertDescriptions',
  props: {
    alert: {
      type: Object,
      required: true,
      default: () => ({}),
    },
  },
  data() {
    return {
      columnsAlert,
      dataAlert,
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
