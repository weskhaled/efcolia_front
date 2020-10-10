<template>
  <page-layout :avatar="currUser.avatar">
    <div slot="headerContent">
      <div class="title">{{ welcome.timeFix[lang] }}，{{ currUser.name }}</div>
      <div>{{ currUser.position[lang] }}</div>
    </div>
    <template slot="extra">
      <div class="w-full block md:flex justify-end">
        <div class="flex flex-1 mb-4 md:mb-0">
          <a-select
            show-search
            placeholder="Sélectionner une entreprise"
            option-filter-prop="children"
            class="self-center w-full"
            :loading="clients.length < 0"
            @change="selectClient"
          >
            <div slot="dropdownRender" slot-scope="menu">
              <v-nodes :vnodes="menu" />
              <a-divider style="margin: 0 0 4px 0;" />
              <div
                style="padding: 0 8px 8px;cursor: pointer;"
                @mousedown="(e) => e.preventDefault()"
              >
                <a-icon type="plus" /> Load more client
              </div>
            </div>
            <a-select-option
              v-for="client in clients"
              :key="client.client_id"
              :value="client.client_id"
            >
              {{ client.commercialname }}
            </a-select-option>
          </a-select>
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
              icon="setting"
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
        <div class="w-full sm:w-full md:w-2/5 lg:w-2/6">
          <a-card
            :title="$t('devices')"
            :bordered="false"
            :body-style="{ padding: 0 }"
          >
            <a slot="extra">
              <a-input-search
                class="self-center w-48"
                placeholder="search device"
                @search="onSearchDevice"
              />
            </a>
            <div class="p-3 overflow-scroll" style="height: 550px">
              <a-result
                v-if="devices.length === 0 && !devicesLoaded && !devicesLoading"
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
        </div>
        <div class="w-full sm:w-full md:w-3/5 lg:w-4/6">
          <a-card
            class="project-list"
            :loading="loading"
            :bordered="false"
            :title="$t('geo')"
            :body-style="{ padding: 0 }"
          >
            <div>
              <div style="height: 550px" class="bg-gray-200">
                <gmaps-map :options="mapOptions">
                  <gmaps-marker
                    v-if="devicePosition"
                    :position="devicePosition"
                  />
                  <gmaps-polyline
                    :editable="false"
                    :icons="icons"
                    :path="items"
                    @pathChanged="items = $event"
                    strokeColor="dodgerblue"
                    strokeWeight="5"
                  />
                </gmaps-map>
              </div>
            </div>
          </a-card>
        </div>
      </div>
    </template>
  </page-layout>
</template>

<script>
import PageLayout from '@/layouts/PageLayout'
import { mapState } from 'vuex'
import { request, METHOD } from '@/utils/request'
import { gmapsMap, gmapsMarker, gmapsPolyline } from '@/plugins/myGmap'
import DeviceCard from '../../components/DeviceCard'
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

export default {
  name: 'Cartographie',
  components: {
    PageLayout,
    gmapsMap,
    gmapsMarker,
    gmapsPolyline,
    DeviceCard,
    VNodes: {
      functional: true,
      render: (h, ctx) => ctx.props.vnodes,
    },
  },
  i18n: require('./i18n'),
  data() {
    return {
      clients: [],
      loading: true,
      companies: [],
      devices: [],
      devicesLoaded: false,
      devicesLoading: false,
      welcome: {
        timeFix: '',
        message: '',
      },
      mapOptions: {
        center: { lat: -27.5, lng: 153 },
        zoom: 14,
        fullscreenControl: false,
        mapTypeControl: false,
        rotateControl: false,
        scaleControl: true,
        streetViewControl: false,
        zoomControl: true,
      },
      devicePosition: null,
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
    request('api/client', METHOD.GET).then((res) => {
      this.clients = res.data
    })
    this.loading = false
  },
  methods: {
    onSearchDevice() {},
    selecteDevice(device) {
      device.selected = !device.selected
      this.devices
        .filter((d) => d.id !== device.id)
        .forEach((d) => (d.selected = false))
      if (device.selected) {
        if (device?.deviceState?.latitude && device?.deviceState?.longitude) {
          this.devicePosition = {
            lat: device.deviceState.latitude,
            lng: device.deviceState.longitude,
          }
          this.mapOptions.center = {
            lat: device.deviceState.latitude,
            lng: device.deviceState.longitude,
          }
        }
        else {
          this.$message.warn(this.$t('noGeoForDevice'), 3)
          this.devicePosition = null
        }
      }
      if (this.devices.every((d) => !d.selected)) {
        this.devicePosition = null
      }
    },
    selectClient(client_id) {
      this.devices = []
      this.devicesLoaded = false
      this.devicesLoading = true
      request(`api/device/byClientId/${client_id}`, METHOD.GET).then((res) => {
        this.devices = res.data.map((d) => ({
          id: d.device_id,
          name: d.name,
          date: '1/11/2010 15:11:11',
          deviceState: d.deviceState,
          infos: {
            address: {
              startAddress: 'Rue Voltaire',
              endAddress: '1000 TROYES FRANCE',
              startGeo: '124.234N',
              endGeo: '124.234E',
            },
            desc: {
              text: d.description,
              id: 123124324,
            },
          },
          selected: false,
        }))
        this.devicesLoaded = true
        this.devicesLoading = false
      })
    },
  },
}
</script>

<style lang="less">
@import 'index';
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
  color: greenyellow !important;
}
</style>
