<template>
  <a-card
    hoverable
    class="w-full"
    :bodyStyle="{ padding: '.5rem .5rem' }"
    :class="device.selected ? 'bg-blue-200' : ''"
  >
    <template slot="actions" class="ant-card-actions p-0">
      <a-popover title="Speed" overlayClassName="device-card">
        <template slot="content">
          <p>{{ device.speed }} Km/h</p>
        </template>
        <a-icon class="" key="setting" type="car" />
      </a-popover>
      <a-popover title="Batry Level" overlayClassName="device-card">
        <template slot="content">
          <a-rate :default-value="device.speed" count="7" disabled />
        </template>
        <a-icon key="edit" type="thunderbolt" />
      </a-popover>
      <a-tooltip>
        <template slot="title">
          GPRS state
        </template>
        <span>
          <a-badge :color="device.gprsstate ? 'green' : 'red'">
            <a-icon class="" key="ellipsis" type="global" />
          </a-badge>
        </span>
      </a-tooltip>
      <a-tooltip>
        <template slot="title">
          Engine state
        </template>
        <span>
          <a-badge :color="device.enginestate ? 'green' : 'red'">
            <a-icon class="" key="edit" type="dashboard" />
          </a-badge>
        </span>
      </a-tooltip>
      <a-icon class="" key="ellipsis" type="wifi" />
      <a-icon class="" key="ellipsis" type="sync" />
      <a-icon class="" key="ellipsis" type="car" />
      <a-icon class="" key="ellipsis" type="setting" />
    </template>
    <a-card-meta
      class="flex"
      :title="device.name"
      :description="formatDate(new Date(device.appdate), 'dd/MM/yyyy HH:mm:ss')"
      @click.stop="$emit('select', device)"
    >
      <div slot="avatar" class="self-center">
        <a-button
          size="small"
          type="primary"
          shape="circle"
          :icon="showInfos ? 'minus' : 'plus'"
          class="self-center"
          @click.stop="showInfos = !showInfos"
        />
      </div>
    </a-card-meta>
    <div
      class="bg-white mt-1 border-t p-2 bg-opacity-50"
      :class="showInfos ? 'block' : 'hidden'"
      style="margin: 0.5rem -.5rem -.5rem -.5rem;"
    >
      <div>
        <div class="flex items-stretch">
          <div
            class="flex self-center flex-0 mr-2 pr-1 border-gray-400 border-r h-100"
          >
            <a-icon
              type="flag"
              class="self-center"
              :style="{ fontSize: '18px', color: '#08c' }"
            >
            </a-icon>
          </div>
          <div class="self-center flex-auto text-left">
            <div>
              {{ device.appsource }}
              <span class="float-right">{{ device.appsource }}</span>
            </div>
            <div>
              {{ device.deviceport }}
              <span class="float-right">{{ device.deviceip }}</span>
            </div>
          </div>
        </div>
      </div>
      <div class="border-gray-200 border-t mt-1 pt-1">
        <div class="flex items-stretch">
          <div
            class="flex self-center flex-0 mr-2 pr-1 border-gray-400 border-r h-100"
          >
            <a-icon
              type="info-circle"
              class="self-center"
              :style="{ fontSize: '18px', color: '#08c' }"
            >
            </a-icon>
          </div>
          <div class="self-center flex-auto text-left">
            <div>
              +{{ device.msisdn }}
              <span class="float-right">{{ device.serialnumber }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </a-card>
</template>

<script>
import { format } from 'date-fns'

export default {
  name: 'DeviceCard',
  props: {
    device: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      showInfos: false,
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
