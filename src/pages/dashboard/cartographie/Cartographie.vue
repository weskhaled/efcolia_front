<template>
  <page-layout :avatar="currUser.avatar">
    <div slot="headerContent">
      <div class="title">{{ welcome.timeFix[lang] }}，{{ currUser.name }}</div>
      <div>{{ currUser.position[lang] }}</div>
    </div>
    <template slot="extra">
      <div class="w-full block md:flex justify-end">
        <div class="flex flex-1 mb-4 md:mb-0 relative">
          <a-tree-select
            @change="selectClient"
            treeNodeFilterProp="title"
            class="self-center w-full"
            placeholder="Please select"
            show-search
            tree-data-simple-mode
            :disabled="!!!treeClientsData.length"
            :class="!!!treeClientsData.length ? 'opacity-50' : ''"
            :dropdown-style="{ maxHeight: '300px', overflow: 'auto' }"
            :treeDefaultExpandAll="true"
            :tree-data="treeClientsData"
            v-model="defaultClientValue"
          />
          <a-spin
            :spinning="!!!treeClientsData.length"
            style="position: absolute;top: 15px;right: 5px"
          >
            <a-icon
              slot="indicator"
              type="loading"
              style="font-size: 24px"
              spin
            />
          </a-spin>
        </div>
        <div class="flex">
          <div
            class="inline flex-auto md:flex-none flex flex-1 justify-center mx-1"
          >
            <a-button
              class="self-center"
              type="primary"
              shape="circle"
              icon="search"
            />
          </div>
          <div
            class="inline flex-auto md:flex-none flex flex-1 justify-center mx-1"
          >
            <a-button
              class="self-center"
              type="primary"
              shape="circle"
              icon="plus"
            />
          </div>
          <div
            class="inline flex-auto md:flex-none flex flex-1 justify-center mx-1"
          >
            <a-button
              class="self-center"
              type="primary"
              shape="circle"
              icon="clock-circle"
            />
          </div>
          <div
            class="inline flex-auto md:flex-none flex flex-1 justify-center mx-1"
          >
            <a-button
              class="self-center"
              type="primary"
              shape="circle"
              icon="customer-service"
            />
          </div>
          <div
            class="inline flex-auto md:flex-none flex flex-1 justify-center mx-1 mr-0"
          >
            <a-button
              class="self-center"
              type="primary"
              shape="circle"
              icon="message"
            />
          </div>
        </div>
      </div>
    </template>
    <template>
      <div class="md:flex sm:block">
        <div class="w-full sm:w-full md:w-10 lg:w-12">
          <a-card :title="false" :bordered="false" :body-style="{ padding: 0 }">
            <div class="px-0 overflow-scroll left-tab">
              <div class="flex md:block md:divide-y divide-gray-300">
                <div
                  class="inline flex-auto md:flex-none flex flex-1 justify-center"
                >
                  <a-tooltip placement="rightTop"
                    >``
                    <template slot="title">
                      Devices List
                    </template>
                    <a
                      class="flex justify-center w-full md:w-12 h-12"
                      :class="tab === 1 ? 'bg-blue-100 active' : null"
                      @click.prevent="tab = 1"
                    >
                      <a-icon
                        class="self-center"
                        type="pushpin"
                        :class="tab === 1 ? 'text-blue-600' : null"
                      />
                    </a>
                  </a-tooltip>
                </div>
                <div
                  class="inline flex-auto md:flex-none flex flex-1 justify-center"
                >
                  <a-tooltip placement="rightTop">
                    <template slot="title">
                      Alertes List
                    </template>

                    <a
                      class="flex justify-center w-full md:w-12 h-12"
                      :class="tab === 2 ? 'bg-blue-100 active' : null"
                      @click.prevent="tab = 2"
                    >
                      <a-icon
                        class="self-center"
                        type="alert"
                        :class="tab === 2 ? 'text-blue-600' : null"
                      />
                    </a>
                  </a-tooltip>
                </div>
              </div>
            </div>
          </a-card>
        </div>
        <div class="w-full sm:w-full md:w-3/6 lg:w-3/6">
          <transition-group name="fade-up" target="div" appear>
            <a-card
              v-if="tab === 1"
              key="1"
              :bordered="false"
              :body-style="{ padding: 0 }"
            >
              <template slot="title"
                >{{ $t('devices') }}
                <a-button
                  class="self-center"
                  type="primary"
                  shape="circle"
                  icon="plus"
                  size="small"
                  @click="() => (modalAddAlertVisible = true)"
                />
              </template>
              <a slot="extra">
                <a-input-search
                  class="self-center w-48"
                  placeholder="search device"
                  @search="onSearchDevice"
                />
              </a>
              <div
                class="p-3 overflow-scroll"
                style="height: 550px; border-right: 1px solid rgb(226, 232, 240);"
              >
                <a-result
                  v-if="
                    devices.length === 0 && !devicesLoaded && !devicesLoading
                  "
                  :title="$t('selectClientFirst')"
                >
                </a-result>
                <a-result
                  status="404"
                  title="No Devices"
                  sub-title="Sorry, No devices for this client."
                  v-if="devices.length === 0 && devicesLoaded"
                >
                </a-result>
                <div
                  v-if="!devicesLoaded && devicesLoading"
                  class="w-full h-full flex place-content-center content-center"
                >
                  <a-spin class="self-center" />
                </div>
                <div class="mb-3" v-for="device in devices" :key="device.id">
                  <device-card :device="device" @select="selecteDevice" />
                </div>
              </div>
            </a-card>
            <a-card
              v-if="tab === 2"
              key="2"
              :bordered="false"
              :body-style="{ padding: 0 }"
            >
              <template slot="title"
                >{{ $t('devicesAlerts') }}
                <a-button
                  class="self-center"
                  type="primary"
                  shape="circle"
                  icon="plus"
                  size="small"
                  @click="() => (modalAddAlertVisible = true)"
                />
              </template>
              <a slot="extra">
                <a-input-search
                  class="self-center w-48"
                  placeholder="search alert"
                />
              </a>
              <div
                class="p-3 overflow-scroll"
                style="height: 550px; border-right: 1px solid rgb(226, 232, 240);"
              >
                <a-result
                  v-if="
                    alertes.length === 0 && !alertesLoaded && !alertesLoading
                  "
                  :title="$t('selectClientFirst')"
                >
                </a-result>
                <a-result
                  status="404"
                  title="No Alertes"
                  sub-title="No alertes for this client."
                  v-if="alertes.length === 0 && alertesLoaded"
                >
                </a-result>
                <div
                  v-if="!alertesLoaded && alertesLoading"
                  class="w-full h-full flex place-content-center content-center"
                >
                  <a-spin class="self-center" />
                </div>
                <div class="mb-3" v-for="alert in alertes" :key="alert.id">
                  <device-alert-card
                    :alert="alert"
                    @select="selecteAlert"
                    @delete="deleteAlert"
                  />
                </div>
              </div>
            </a-card>
          </transition-group>
        </div>
        <div class="w-full sm:w-full md:w-3/6 lg:w-full">
          <transition-group name="fade-up" target="div" appear>
            <a-card
              class="project-list"
              v-if="tab === 1"
              key="1"
              :loading="loading"
              :bordered="false"
              :title="$t('geo')"
              :body-style="{ padding: 0 }"
            >
              <div>
                <div style="height: 550px" class="bg-gray-200">
                  <gmaps-map :options="mapOptions">
                    <gmaps-popup
                      v-for="device in devices"
                      :key="'gmaps-popup-' + device.id"
                      :position="{
                        lat: Number(device.latitude),
                        lng: Number(device.longitude),
                      }"
                      :background="
                        device.selected
                          ? 'rgb(255 255 255 / 100%)'
                          : 'rgb(0 0 0 / 25%)'
                      "
                      :zIndex="device.selected ? 2 : 1"
                    >
                      <div :style="{ opacity: device.selected ? 1 : 0.25 }">
                        <a-button
                          class="self-center"
                          :type="
                            formatDate(new Date(), 'dd') -
                              formatDate(new Date(), 'dd') <
                              1 &&
                            formatDate(new Date(), 'MM/yyyy') ===
                              formatDate(
                                new Date(device.localizationdate),
                                'MM/yyyy'
                              ) &&
                            formatDate(new Date(), 'HH') -
                              formatDate(
                                new Date(device.localizationdate),
                                'HH'
                              ) <
                              8
                              ? 'primary'
                              : 'danger'
                          "
                          @click="clickOnMapPin($event, device)"
                          >{{ device.name }}</a-button
                        >
                      </div>
                    </gmaps-popup>
                  </gmaps-map>
                </div>
              </div>
            </a-card>
            <a-card
              class="project-list"
              v-if="tab === 2"
              key="2"
              :bordered="false"
              :title="$t('alertDetails')"
              :body-style="{ padding: '0px', overflowY: 'auto' }"
            >
              <div class="bg-white">
                <div style="height: 550px" class="p-2">
                  <a-result
                    v-if="!selectedAlert"
                    :title="$t('selectAlertFirst')"
                  />
                  <div v-if="selectedAlert">
                    <a-descriptions
                      :title="false"
                      layout="vertical"
                      :column="3"
                    >
                      <a-descriptions-item label="Name">
                        {{ selectedAlert.name }}
                      </a-descriptions-item>
                      <a-descriptions-item label="Description">
                        {{ selectedAlert.description || 'No description' }}
                      </a-descriptions-item>
                      <a-descriptions-item label="Active">
                        <a-badge
                          :status="
                            selectedAlert.status === 1 ? 'processing' : 'error'
                          "
                          :text="selectedAlert.status === 1 ? 'Yes' : 'No'"
                        />
                      </a-descriptions-item>
                      <a-descriptions-item label="from">
                        {{
                          formatDate(
                            new Date(selectedAlert.begindate),
                            'dd/MM/yyyy'
                          )
                        }}
                      </a-descriptions-item>
                      <a-descriptions-item label="to">
                        {{
                          selectedAlert.enddate
                            ? formatDate(
                                new Date(selectedAlert.enddate),
                                'dd/MM/yyyy'
                              )
                            : 'None'
                        }}
                      </a-descriptions-item>
                      <a-descriptions-item label="importance">
                        {{
                          selectedAlert.level === 3
                            ? 'Danger'
                            : selectedAlert.level === 2
                            ? 'Warning'
                            : 'Normal'
                        }}
                      </a-descriptions-item>
                      <a-descriptions-item
                        label="Acknowlegment By User"
                        :span="3"
                      >
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
                </div>
              </div>
            </a-card>
          </transition-group>
        </div>
      </div>
    </template>
    <a-modal
      title="addNewDevice"
      :dialog-style="{ top: '20px' }"
      :visible="modalAddAlertVisible"
      @ok="() => (modalAddAlertVisible = false)"
      @cancel="() => (modalAddAlertVisible = false)"
    >
      <p>some contents...</p>
    </a-modal>
  </page-layout>
</template>

<script>
import { format } from 'date-fns'
import PageLayout from '@/layouts/PageLayout'
import { mapState } from 'vuex'
import { request, METHOD } from '@/utils/request'
import { gmapsMap, gmapsPopup } from '@/plugins/myGmap'
import { DeviceCard, DeviceAlertCard } from '../../components'
const BASE_URL = process.env.VUE_APP_API_BASE_URL
const icon = {
  path: 'M -2,0 0,-2 2,0 0,2 z',
  strokeColor: '#F00',
  fillColor: '#F00',
  fillOpacity: 1,
}
const circle = {
  path: 'M 0, 0 m -1.5, 0 a 1.5,1.5 0 1,0 2,0 a 1,2 0 3,0 -3,0',
  strokeColor: '#0af',
  fillColor: '#f0a',
  fillOpacity: 1,
}
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
  name: 'Cartographie',
  components: {
    PageLayout,
    gmapsMap,
    gmapsPopup,
    DeviceCard,
    DeviceAlertCard,
    // VNodes: {
    //   functional: true,
    //   render: (h, ctx) => ctx.props.vnodes,
    // },
  },
  i18n: require('./i18n'),
  data() {
    return {
      clients: [],
      loading: true,
      companies: [],
      defaultClientValue: null,
      treeClientsData: [],
      devices: [],
      alertes: [],
      modalAddAlertVisible: false,
      selectedAlert: null,
      selectedDevice: null,
      columnsAlert,
      dataAlert,
      devicesLoaded: false,
      devicesLoading: false,
      alertesLoaded: false,
      alertesLoading: false,
      welcome: {
        timeFix: '',
        message: '',
      },
      tab: 1,
      mapOptions: {
        center: { lat: 48, lng: 2 },
        zoom: 2,
        fullscreenControl: false,
        mapTypeControl: false,
        rotateControl: false,
        scaleControl: true,
        streetViewControl: false,
        zoomControl: true,
      },
      selectedDevices: [],
      items: [
        { lat: -27.41, lng: 153.01 },
        { lat: -27.42, lng: 153.02 },
        { lat: -27.22, lng: 152.099 },
        { lat: -27.55, lng: 152.01 },
      ],
      icons: [
        { icon, offset: '0%' },
        { icon: circle, offset: '100%' },
      ],
    }
  },
  computed: {
    ...mapState('account', { currUser: 'user' }),
    ...mapState('setting', ['lang']),
  },
  created() {
    request('/user/welcome', METHOD.GET).then(
      (res) => (this.welcome = res.data)
    )
    request(`${BASE_URL}/api/client`, METHOD.GET).then((res) => {
      const defaultSelectClient = res.data.find((c) => !c.pId)
      this.treeClientsData = res.data
      this.selectClient(defaultSelectClient.id)
      this.defaultClientValue = defaultSelectClient.id
    })
    this.loading = false
  },
  methods: {
    formatDate: (date = new Date(), formatDate = 'yyyy-MM-dd') => {
      return format(date, formatDate)
    },
    onSearchDevice() {},
    selecteDevice(device) {
      device.selected = !device.selected
      this.devices
        .filter((d) => d.id !== device.id)
        .forEach((d) => (d.selected = false))
      // this.selectedDevices = this.devices
      //   .filter((d) => d.id !== device.id)
      //   .map((d) => ({ ...d, selected: false }))
      if (device.selected) {
        this.selectedDevice = device
        this.mapOptions.zoom = 18
        this.mapOptions.center.lat = device.latitude
        this.mapOptions.center.lng = device.longitude
      } else {
        this.selectedDevice = null
      }
      if (this.devices.every((d) => !d.selected)) {
        this.mapOptions.zoom = 2
      }
      // this.selectedDevices = this.devices.filter((sDevice) => sDevice.selected)
    },
    selectClient(client_id) {
      this.devices = []
      this.alertes = []
      this.selectedDevices = []
      this.devicesLoaded = false
      this.devicesLoading = true
      this.alertesLoaded = false
      this.alertesLoading = true
      request(
        `${BASE_URL}/api/device/byClientId/${client_id}`,
        METHOD.GET
      ).then((res) => {
        this.devices = res.data
        this.selectedDevices = res.data
        this.devicesLoaded = true
        this.devicesLoading = false
      })
      request(`${BASE_URL}/api/alert/byClientId/${client_id}`, METHOD.GET).then(
        (res) => {
          this.alertes = res.data
          this.alertesLoaded = true
          this.alertesLoading = false
        }
      )
    },
    selecteAlert(alert) {
      alert.selected = !alert.selected
      this.alertes
        .filter((a) => a.id !== alert.id)
        .forEach((a) => (a.selected = false))
      if (alert.selected) {
        if (alert) {
          this.selectedAlert = alert
        } else {
          this.selectedAlert = null
        }
      }
      if (this.alertes.every((a) => !a.selected)) {
        this.selectedAlert = null
      }
    },
    onLoadClientsData(treeNode) {
      const { id } = treeNode.dataRef
      return request(
        `${BASE_URL}/api/client/byParentId/${id}`,
        METHOD.GET
      ).then((res) => {
        this.treeClientsData = this.treeClientsData.concat(
          res.data.map((c) => ({
            id: c.client_id,
            pId: c.parentclient_id,
            value: c.client_id,
            title: c.commercialname,
            isLeaf: c.countChilds === 0,
          }))
        )
      })
    },
    clickOnMapPin(event, device) {
      this.selecteDevice(device)
    },
    deleteAlert(alert) {
      request(`${BASE_URL}/api/alert/${alert.id}`, METHOD.DELETE).then(
        (result) => {
          console.log(result)
        }
      )
    },
  },
}
</script>

<style lang="less">
@import 'index';
.ant-spin-container {
  width: 100%;
  align-self: center;
}
.ant-card-actions {
  li {
    margin: 0.4rem 0px;
  }
}
.flex.ant-card-meta {
  .ant-card-meta-title {
    margin-bottom: 0.1rem;
  }
  .ant-card-meta-avatar {
    align-self: center;
  }
}
.red {
  color: red !important;
}
.greenyellow {
  color: rgb(188, 207, 159) !important;
}
.fade-up-enter-active,
.fade-up-leave-active {
  transition: all 0.2s ease-in-out;
}
.fade-up-enter,
.fade-up-leave-to {
  height: 0;
  transform: translateY(0px);
  opacity: 0;
}
.left-tab {
  > div > div > a.active {
    box-shadow: rgb(28, 144, 255) 0px -2px 0px 0px inset;
  }
}
@media only screen and (min-width: 768px) {
  .left-tab {
    height: 598px;
    border-right: solid 1px #e2e8f0;
    > div > div > a.active {
      box-shadow: inset -2px 0 0px 0px #1c90ff;
    }
  }
}
</style>
