<template>
  <a-card
    class="flotte-list"
    :bordered="false"
    :body-style="{ padding: '0px', overflowY: 'auto' }"
  >
    <template slot="title">
      {{ dataFlotte && dataFlotte.count }}
      {{ $t('flotteList') }}
    </template>
    <div
      class="p-3 overflow-scroll min-h-555 h-content"
      style="border-right: 1px solid rgb(226, 232, 240)"
    >
      <a-result
        v-if="!selectedClient"
        :title="$t('selectClientFirst')"
      ></a-result>
      <a-result
        status="404"
        title="No Clients"
        sub-title="Sorry, No clients for this client."
        v-if="dataFlotte && dataFlotte.count === 0 && loaded"
      ></a-result>
      <div
        v-if="loading"
        class="w-full h-full flex place-content-center content-center"
      >
        <a-spin class="self-center" />
      </div>
      <template v-if="dataFlotte">
        <a-card
          size="small"
          v-for="flotte in dataFlotte.listFlot"
          :key="flotte.ensemble_id"
          :body-style="{ padding: '0.5rem' }"
          class="mb-3 flotte-card overflow-visible"
        >
          <a-card-meta class="flex mb-2 relative" @click.stop="$emit('select', flotte)">
            <div slot="title" class="">
              <div>
                {{ flotte.name }}
              </div>
              <div class="font-light text-sm text-gray-700">
                {{ flotte.description }}
              </div>
              <div class="font-light bg-blue-400 text-white absolute rounded-b-sm p-1 text-xs -top-1 right-0">
                {{ flotte.countDevice }}
              </div>
            </div>
            <div slot="avatar" class="self-center">
              <a-button
                size="small"
                shape="circle"
                :icon="flotte.selected ? 'minus' : 'plus'"
                class="self-center text-white hover:text-black bg-blue-400"
                :disabled="flotte.countDevice === 0"
                @click.stop="
                  () => {
                    flotte.selected = !flotte.selected
                  }
                "
              />
            </div>
          </a-card-meta>
          <div class="list-devices-wrp relative">
            <div
              v-show="flotte.selected"
              style="max-height: 350px"
              class="overflow-y-auto pt-2 pl-5"
              @scroll="scrollDevicesList($event, flotte.ensemble_id)"
            >
              <div
                v-if="!devicesLoaded && devicesLoading"
                class="w-full h-full flex place-content-center content-center absolute z-10 bg-white bg-opacity-75"
                style="margin: -0.8rem"
              >
                <a-spin class="self-center" />
              </div>
              <div
                class="device-wrp mb-3 pr-2"
                v-for="device in flotte.listDevices"
                :key="device.id"
              >
                <device-card :device="device" />
              </div>
            </div>
          </div>
        </a-card>
      </template>
    </div>
  </a-card>
</template>

<script>
import { defineComponent, onMounted, ref, watch } from 'vue-demi'
import { request, METHOD } from '@/utils/request'
import DeviceCard from '../DeviceCard'
const BASE_URL = process.env.VUE_APP_API_BASE_URL

const checkUserHasPermission = (permissions, objectType, permission) =>
  permissions.find((p) => p.objecttype === objectType) &&
  permissions
    .find((p) => p.objecttype === objectType)
    .permission?.indexOf(permission) !== -1

export default defineComponent({
  name: 'flotteList',
  components: {
    DeviceCard,
  },
  props: {
    selectedClient: {
      type: Object,
      required: true,
    },
  },
  setup(props) {
    const showListDevices = ref(false)
    const listFlotteDevicesRefs = ref([])
    const devicesLoaded = ref(false)
    const devicesLoading = ref(false)
    const loading = ref(true)
    const loaded = ref(false)
    const dataFlotte = ref(null)
    const getFlotteList = (clientId) => {
      dataFlotte.value = null
      loading.value = true
      loaded.value = false
      request(`${BASE_URL}/api/float/byClientId/${clientId}`, METHOD.GET).then(
        (res) => {
          dataFlotte.value = res.data
          loading.value = false
          loaded.value = true
          devicesLoaded.value = true
        }
      )
    }
    const getDevicesByFlotteId = (flotteId, skip = 5) => {
      devicesLoading.value = true
      devicesLoaded.value = false
      request(
        `${BASE_URL}/api/device/byfloatId/${flotteId}?skip=${skip}`,
        METHOD.GET
      ).then((res) => {

        if (res.data.length) {
          const selectedFlotteIndex = dataFlotte.value.listFlot.findIndex(
            (f) => f.ensemble_id === flotteId
          )
          selectedFlotteIndex > -1 && dataFlotte.value.listFlot[selectedFlotteIndex].listDevices.push(...res.data)
        }
        devicesLoading.value = false
        devicesLoaded.value = true
      })
    }
    // const toggleDevicesList = (event, flotteIdex) => {
    //   let content = event.target.closest('.ant-card.flotte-card')
    //   const { height } = useElementSize(content)
    //   showListDevices.value = !showListDevices.value
    //   nextTick(() => {
    //     console.log(listFlotteDevicesRefs.value)
    //     // const { height } = useElementSize()
    //     // console.log(height.value)
    //   })
    // }
    const scrollDevicesList = ($event, flotteId) => {
      const { offsetHeight, scrollTop, scrollHeight } = $event.target
      if (scrollHeight - (offsetHeight + scrollTop) < 50) {
        if (devicesLoaded.value) {
          const localFlotte = dataFlotte.value.listFlot.find(
            (f) => f.ensemble_id === flotteId
          )
          if (
            localFlotte.listDevices.length < localFlotte.countDevice
          ) {
            getDevicesByFlotteId(flotteId, localFlotte.listDevices.length)
          }
        }
        // this.devices.listDevice.length < this.devices.count &&
        // this.devicesSearch === '' &&
        // this.getDevicesByFlotteId(
        //   this.flotteId,
        //   this.devices.listDevice.length || 0
        // )
      }
    }
    onMounted(() => {
      if (props.selectedClient) {
        getFlotteList(props.selectedClient.client_id)
      }
    })
    watch(
      () => props.selectedClient,
      (val) => {
        val && getFlotteList(val.client_id)
      }
    )
    return {
      loading,
      loaded,
      dataFlotte,
      listFlotteDevicesRefs,
      showListDevices,
      checkUserHasPermission,
      scrollDevicesList,
      devicesLoading,
      devicesLoaded,
    }
  },
})
</script>

<style lang="postcss" scoped>
.list-devices-wrp {
  @apply p-0 -mx-1 border-t border-gray-200 shadow-inner relative;
}
.list-devices-wrp::before {
  content: '';
  position: absolute;
  width: 1px;
  height: calc(100%);
  top: 0;
  left: 0.5rem;
  background-color: #e4e7eb;
}
.device-wrp {
  @apply relative;
}
.device-wrp::before {
  @apply absolute;
  content: '';
  width: 0.8rem;
  height: 1px;
  top: 1rem;
  left: -0.7rem;
  background-color: #e4e7eb;
}
</style>
