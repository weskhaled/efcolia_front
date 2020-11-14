<template>
  <a-card
    hoverable
    class="w-full device-card"
    :bodyStyle="{ padding: '.5rem .5rem' }"
    :class="device.selected ? 'bg-blue-200' : ''"
  >
    <template slot="actions" class="ant-card-actions p-0">
      <a-tooltip>
        <template slot="title">
          Speed
        </template>
        <span>
          {{ device.speed }} Km/h
        </span>
      </a-tooltip>
      <a-tooltip>
        <template slot="title">
          {{device.batteryvoltage }} V
        </template>
        <span class="icon-wrp">
          <span
            class="battery"
            :class="(device.batterylevel * 100) / 7 < 10 ? 'low' : ''"
            :style="{
              '--battery-level': (device.batterylevel * 100) / 7 + '%',
            }"
          />
        </span>
      </a-tooltip>
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
      <a-tooltip>
        <template slot="title">
          Last update {{formatDate(new Date(device.localizationdate), 'dd/MM/yyyy HH:mm:ss')}}
        </template>
        <span>
          <a-badge :color="(formatDate(new Date(), 'dd') - formatDate(new Date(), 'dd') < 1) && (formatDate(new Date(), 'MM/yyyy') === formatDate(new Date(device.localizationdate), 'MM/yyyy')) && (formatDate(new Date(), 'HH') - formatDate(new Date(device.localizationdate), 'HH') < 8) ? 'green' : 'red'">
            <a-icon class="" key="edit" type="sync" />
          </a-badge>
        </span>
      </a-tooltip>
      <a-tooltip>
        <template slot="title">
          GPRS state
        </template>
        <span>
          <a-badge :color="device.gprsstate ? 'green' : 'red'">
            <a-icon class="" key="edit" type="api" />
          </a-badge>
        </span>
      </a-tooltip>
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
              <span class="float-right">{{ device.latitude }}</span>
            </div>
            <div>
              {{ device.deviceport }}
              <span class="float-right">{{ device.longitude }}</span>
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
              <span v-if="device.msisdn">+{{ device.msisdn }}</span>
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
    formatDate: (date = new Date(), formatDate = 'yyyy-MM-dd HH:mm:ss') => {
      return format(date, formatDate)
    },
  },
}
</script>

<style lang="less" scoped>
.device-card .ant-card-actions li > span > span {
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.battery {
  display: block;
  position: relative;
  margin: 0 auto;
  width: calc(20px);
  color: rgb(0, 255, 109);
  border: calc(1px) solid currentColor;
  height: calc(10px);
  border-radius: calc(2px);
  &:before {
    content: '';
    width: var(--battery-level);
    height: 100%;
    left: 0px;
    top: 0px;
    background: currentColor;
    position: absolute;
    padding: 0.5px 0;
  }
  &:after {
    content: '';
    position: absolute;
    margin-right: calc(-4px);
    right: 0;
    top: 1px;
    width: calc(2px);
    height: calc(100% - 2px);
    background: currentColor;
    border-bottom-right-radius: calc(5px);
    border-top-right-radius: calc(5px);
  }
  &.low {
    color: rgb(255, 38, 0);
  }
}
</style>
