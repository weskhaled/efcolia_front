<template>
  <a-card
    hoverable
    class="w-full device-card"
    size="small"
    :bodyStyle="{ padding: '.5rem .5rem' }"
    :class="device.selected ? 'bg-blue-200' : ''"
  >
    <template slot="actions" class="ant-card-actions p-0 relative">
      <a-tooltip>
        <template slot="title"> Alimentation externe </template>
        <span>
          <svg
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            xmlns:xlink="http://www.w3.org/1999/xlink"
            x="0px"
            y="0px"
            viewBox="0 0 1000 1000"
            width="16px"
            height="16px"
            xml:space="preserve"
            :fill="device.battery2state === 1 ? '#48bb78' : '#6e6e6e'"
          >
            <g>
              <g
                transform="translate(0.000000,511.000000) scale(0.100000,-0.100000)"
              >
                <path
                  d="M4482.4,4879.1c-850.3-87.4-1743.2-444.1-2440-970.8c-255.1-193.7-666.1-595.2-866.9-845.6C266.1,1919.5-90.5,452.7,197.6-976.4C469.3-2325.1,1307.8-3506.1,2503-4217.1c394.5-233.8,956.6-467.7,1124.3-467.7c269.3,2.4,510.2,281.1,463,538.5c-37.8,210.2-139.4,307.1-451.2,427.5c-569.2,222-999.1,496-1403,899.9C1650.3-2240,1298.3-1604.7,1130.6-829.9c-337.8,1570.7,323.6,3210,1662.9,4112.3c1993.6,1344,4707.5,611.8,5765.7-1554.2c689.7-1414.9,472.4-3115.5-550.3-4298.9C7560.1-3088,6759.4-3574.6,6353.1-3574.6c-522,0-843.3,571.6-895.2,1594.4l-14.2,283.4l210.2,40.2c326,61.4,566.9,191.3,812.5,441.7c151.2,151.2,224.4,248,288.2,380.3C6905.8-530,6915.2-452,6915.2,495.2v843.3H5002H3088.8V495.2c0-944.8,9.4-1025.1,155.9-1320.4c203.1-413.3,581.1-708.6,1046.4-819.6l207.9-49.6l14.2-321.2c61.4-1313.3,529.1-2154.2,1351.1-2425.8c264.6-87.4,689.7-92.1,968.4-11.8c503.1,144.1,1247.2,600,1677,1032.2c1443.2,1438.5,1807,3748.5,883.4,5595.6C8471.8,4017,6525.5,5087,4482.4,4879.1z"
                />
                <path
                  d="M3851.7,2944.6c-40.1-23.6-87.4-66.1-99.2-92.1c-16.5-28.3-26-262.2-26-625.9v-581.1H4069h342.5v585.8c0,640.1-2.4,654.3-141.7,725.1C4170.6,3008.4,3943.8,3001.3,3851.7,2944.6z"
                />
                <path
                  d="M5717.7,2944.6c-40.2-23.6-87.4-66.1-99.2-92.1c-16.5-28.3-26-262.2-26-625.9v-581.1H5935h342.5v585.8c0,640.1-2.4,654.3-141.7,725.1C6036.6,3008.4,5809.8,3001.3,5717.7,2944.6z"
                />
              </g>
            </g>
          </svg>
        </span>
      </a-tooltip>
      <a-tooltip>
        <template slot="title">
          {{ (device.batteryvoltage / 1000).toFixed(2) }} V -
          {{ ((device.batterylevel * 100) / 7).toFixed(0) }} %
        </template>
        <span class="icon-wrp">
          <span
            class="battery"
            :class="[
              (device.batterylevel * 100) / 7 < 10 ? 'low' : '',
              !device.batteryvoltage && 'inactive',
            ]"
            :style="{
              '--battery-level': `${(device.batterylevel * 100) / 7}%`,
            }"
          />
        </span>
      </a-tooltip>
      <a-tooltip>
        <template slot="title"> Contact </template>
        <span>
          <a-badge :color="device.enginestate ? (device.enginestate === 3 ? 'green' : 'red') : ''">
            <a-icon
              :class="[
                device.enginestate ? (device.enginestate === 3 ? 'text-green-500' : 'text-red-500') : 'text-gray-400',
              ]"
              key="edit"
              type="poweroff"
            />
          </a-badge>
        </span>
      </a-tooltip>
      <a-tooltip>
        <template slot="title"> Vitesse </template>
        <span class="capitalize" style="font-size: 0.7em">
          {{ device.speed }} km/h
        </span>
      </a-tooltip>
      <a-tooltip>
        <template slot="title"> GSM </template>
        <span>
          <div>
            <div class="signal">
              <div
                :class="[
                  device.csq !== null &&
                    device.csq !== 99 &&
                    20 > device.csq > 30 &&
                    'active',
                ]"
              ></div>
              <div
                :class="[
                  device.csq !== null &&
                    device.csq !== 99 &&
                    16 > device.csq > 20 &&
                    'active',
                ]"
              ></div>
              <div
                :class="[
                  device.csq !== null &&
                    device.csq !== 99 &&
                    11 > device.csq > 15 &&
                    'active',
                ]"
              ></div>
              <div
                :class="[
                  device.csq !== null &&
                    device.csq !== 99 &&
                    device.csq > 10 &&
                    'active',
                ]"
              ></div>
            </div>
          </div>
        </span>
      </a-tooltip>
      <a-tooltip>
        <template slot="title"> GPS </template>
        <span>
          <svg
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            xmlns:xlink="http://www.w3.org/1999/xlink"
            x="0px"
            y="0px"
            width="16px"
            height="16px"
            viewBox="0 0 1000 1000"
            enable-background="new 0 0 1000 1000"
            xml:space="preserve"
            :fill="device.validitycode ? '#48bb78' : '#ff0000'"
          >
            <g>
              <path
                d="M558.6,364.1l55.1-117.5c17.8,9.8,44.5,7.7,59.4-7.2c18.3-17.9,14-67.5-4.2-85.4c-18.2-18.2-56.9-18.2-75.1,0c-15.3,14.4-24.6,50.5-14.4,67.9l-121.7,56L197,10c-68.3,166-44.1,386.4,102.3,529.5c146,143.5,370.9,167.3,540.2,100.2L558.6,364.1z"
              />
              <path d="M565.2,990H289.4l53.2-313.4h148.5L565.2,990z" />
            </g>
          </svg>
          <span
            style="line-height: 0.7; align-self: flex-end; font-size: 0.65rem"
            v-if="device.satsinuse !== null"
            >X{{ device.satsinuse }}</span
          >
        </span>
      </a-tooltip>
      <a-dropdown>
        <a class="ant-dropdown-link" @click="(e) => e.preventDefault()">
          <a-icon class="" key="edit" type="setting" />
        </a>
        <a-menu slot="overlay">
          <a-menu-item>
            <span
              @click.stop="
                $emit('history-device', { id: device.id, name: device.name })
              "
              ><a-icon class="mr-1" type="history" /> Historique</span
            >
          </a-menu-item>
          <a-menu-item>
            <span @click.stop="$emit('edit-device', device)"
              ><a-icon class="mr-1" type="edit" /> Modifier device</span
            >
          </a-menu-item>
          <a-menu-item>
            <span @click.stop="$emit('delete-device', device.id)"
              ><a-icon class="mr-1" type="delete" /> Supprimer device</span
            >
          </a-menu-item>
          <a-menu-item>
            <span @click.stop="$emit('report-device', device.id)"
              ><a-icon class="mr-1" type="read" /> Rapport device</span
            >
          </a-menu-item>
        </a-menu>
      </a-dropdown>
    </template>
    <a-card-meta class="flex" @click.stop="$emit('select', device)">
      <div slot="title" class="flex justify-between">
        <div>
          {{ device.name }}
        </div>
        <div class="font-light text-sm text-gray-700">
          {{
            formatDate(new Date(device.localizationdate), 'dd/MM/yyyy HH:mm:ss')
          }}
        </div>
      </div>
      <div slot="description">
        <a-icon type="environment" />
        {{ device.adress || 'Pas d\'adresse pour ce device' }}
      </div>
      <div slot="avatar" class="self-center">
        <a-button
          size="small"
          shape="circle"
          :icon="showInfos ? 'minus' : 'plus'"
          class="self-center text-white hover:text-white focus:text-white"
          :class="[btnPlusColor]"
          @click.stop="showInfos = !showInfos"
        />
      </div>
    </a-card-meta>
    <div
      class="bg-white mt-1 border-t p-2 bg-opacity-50"
      :class="showInfos ? 'block' : 'hidden'"
      style="margin: 0.5rem -0.5rem -0.5rem -0.5rem"
    >
      <div>
        <div class="flex items-stretch">
          <div
            class="flex self-center flex-0 mr-2 pr-1 border-gray-400 border-r"
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
              <span v-if="device.description">{{ device.description }}</span>
              <span class="float-right">{{ device.latitude }}</span>
            </div>
            <div>
              {{ device.serialnumber
              }}{{ device.simcardNumber && ' | +' + device.simcardNumber }}
              <span class="float-right">{{ device.longitude }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </a-card>
</template>

<script>
import { format } from 'date-fns'
import moment from 'moment'

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
  computed: {
    btnPlusColor() {
      let classes =
        'bg-gray-500 border-gray-500 hover:border-gray-500 hover:bg-gray-500 focus:border-gray-500 focus:bg-gray-500'
      const now = new Date()
      const localizationDate = new Date(this.device.localizationdate)
      const ms = moment(now, 'DD/MM/YYYY HH:mm:ss').diff(
        moment(localizationDate, 'DD/MM/YYYY HH:mm:ss')
      )
      const d = moment.duration(ms)
      const diffHours = d.asHours()
      if (diffHours > 8) {
        return 'bg-gray-500 border-gray-500 hover:border-gray-500 hover:bg-gray-500 focus:border-gray-500 focus:bg-gray-500'
      } else if (diffHours <= 8 && diffHours > 4) {
        return 'bg-red-500 border-red-500 hover:border-red-500 hover:bg-red-600 focus:border-red-500 focus:bg-red-600'
      } else if (diffHours <= 4 && diffHours > 1) {
        return 'bg-yellow-500 border-yellow-500 hover:border-yellow-600 hover:bg-yellow-600 focus:border-yellow-500 focus:bg-yellow-600'
      } else if (1 >= diffHours && diffHours < 4) {
        return 'bg-green-500 border-green-500 hover:border-green-500 hover:bg-green-600 focus:border-green-600 focus:bg-green-600'
      }
      return classes
    },
  },
  methods: {
    formatDate: (date = new Date(), formatDate = 'dd/MM/yyyy HH:mm:ss') => {
      return format(date, formatDate)
    },
    moment,
  },
  mounted() {}
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
  margin: 2px auto;
  width: calc(20px);
  color: #48bb78;
  /* border: calc(1px) solid currentColor; */
  height: calc(10px);
  border-radius: 1px;
  box-shadow: 0px 0px 0px 1px currentColor;
  &:before {
    content: '';
    width: var(--battery-level);
    height: calc(100%);
    left: 0;
    top: 0;
    background: currentColor;
    position: absolute;
    border-radius: 0;
  }
  &:after {
    content: '';
    position: absolute;
    margin-right: calc(-4px);
    right: 0;
    top: 2px;
    width: calc(2px);
    height: calc(100% - 4px);
    background: currentColor;
    border-bottom-right-radius: calc(5px);
    border-top-right-radius: calc(5px);
  }
  &.low {
    color: rgb(255, 38, 0);
  }
  &.inactive {
    color: #969696;
  }
}

.signal {
  width: 10px;
  height: 10px;
  margin: auto;
  position: relative;
  overflow: hidden;
  transform: rotate(45deg) scale(1.5);
  color: #6e6e6e;
  > div {
    color: #6e6e6e;
    &.active {
      color: #48bb78;
    }
    &:nth-child(1) {
      border-radius: 50%;
      border: 1px solid currentColor;
      position: absolute;
      width: 200%;
      height: 200%;
    }
    &:nth-child(2) {
      border-radius: 50%;
      border: 1px solid currentColor;
      position: absolute;
      right: 0%;
      bottom: 0;
      transform: translate(50%, 50%);
      width: 150%;
      height: 150%;
    }
    &:nth-child(3) {
      border-radius: 50%;
      border: 1px solid currentColor;
      position: absolute;
      right: 0%;
      width: 100%;
      transform: translate(50%, 50%);
      height: 100%;
    }
    &:nth-child(4) {
      border-radius: 50%;
      border: 1px solid currentColor;
      position: absolute;
      bottom: 0;
      background-color: #6e6e6e;
      height: 50%;
      right: 0%;
      width: 50%;
      transform: translate(50%, 50%);
      &.active {
        background-color: #48bb78;
      }
    }
  }
}
</style>
