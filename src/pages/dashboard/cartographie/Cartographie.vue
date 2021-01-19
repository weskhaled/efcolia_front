<template>
  <page-layout :avatar="currUser.avatar">
    <div slot="headerContent">
      <div class="title">{{ currUser.name }}</div>
      <div>{{ currUser.position[lang] }}</div>
    </div>
    <template slot="extra">
      <div class="w-full block md:flex justify-end">
        <div class="flex flex-1 mb-4 md:mb-0 relative">
          <a-tree-select
            @change="selectClient"
            treeNodeFilterProp="title"
            class="self-center w-full"
            placeholder="Please select a client"
            show-search
            tree-data-simple-mode
            :disabled="!!!treeClientsData.length"
            :class="!!!treeClientsData.length ? 'opacity-50' : ''"
            :dropdown-style="{ maxHeight: '300px', overflow: 'auto' }"
            :treeDefaultExpandAll="false"
            :treeDefaultExpandedKeys="[1]"
            :tree-data="treeClientsData"
            v-model="selectedClientValue"
          />
          <a-spin
            :spinning="!!!treeClientsData.length"
            style="position: absolute;top: calc(50% - 13px);right: 5px"
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
            v-if="
              currUser.permissions
                .find((p) => p.objecttype === 'company')
                .permission.indexOf('d') !== -1
            "
            class="inline flex-auto md:flex-none flex flex-1 justify-center mx-1"
          >
            <a-button
              class="self-center"
              type="danger"
              shape="circle"
              icon="minus"
              @click="() => deleteClient(selectedClientValue)"
            />
          </div>
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
        </div>
      </div>
    </template>
    <template>
      <div class="md:flex sm:block">
        <div class="w-full sm:w-full md:w-10 lg:w-12 overflow-hidden">
          <a-card :title="false" :bordered="false" :body-style="{ padding: 0 }">
            <div class="px-0 left-tab overflow-hidden">
              <div class="flex md:block md:divide-y divide-gray-300">
                <div
                  class="inline flex-auto md:flex-none flex flex-1 justify-center"
                >
                  <a-tooltip placement="rightTop">
                    <template slot="title">
                      {{ $t('ListeBoitiers') }}
                    </template>
                    <a
                      class="flex justify-center w-full md:w-12 h-12"
                      :class="tab === 1 ? 'bg-blue-100 active' : null"
                      @click.prevent="
                        () => {
                          tab = 1
                          showHistoryInMap = false
                          rightCardTabsKey = 'gMaps'
                          zoomExtends(
                            devices.filter((d) => d.latitude && d.longitude)
                          )
                        }
                      "
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
                      {{ $t('ListeAlert') }}
                    </template>

                    <a
                      class="flex justify-center w-full md:w-12 h-12"
                      :class="tab === 2 ? 'bg-blue-100 active' : null"
                      @click.prevent="
                        () => {
                          tab = 2
                          selectedAlert = null
                          alertes.forEach((a) => (a.selected = false))
                        }
                      "
                    >
                      <a-icon
                        class="self-center"
                        type="alert"
                        :class="tab === 2 ? 'text-blue-600' : null"
                      />
                    </a>
                  </a-tooltip>
                </div>
                <div
                  class="inline flex-auto md:flex-none flex flex-1 justify-center"
                >
                  <a-tooltip placement="rightTop">
                    <template slot="title">
                      {{ $t('ListeContacts') }}
                    </template>
                    <a
                      class="flex justify-center w-full md:w-12 h-12"
                      :class="tab === 4 ? 'bg-blue-100 active' : null"
                      @click.prevent="
                        () => {
                          tab = 4
                        }
                      "
                    >
                      <a-icon
                        class="self-center"
                        type="user"
                        :class="tab === 4 ? 'text-blue-600' : null"
                      />
                    </a>
                  </a-tooltip>
                </div>
                <div
                  class="inline flex-auto md:flex-none flex flex-1 justify-center"
                >
                  <a-tooltip placement="rightTop">
                    <template slot="title">
                      {{ $t('ListeSociétés') }}
                    </template>
                    <a
                      class="flex justify-center w-full md:w-12 h-12"
                      :class="tab === 5 ? 'bg-blue-100 active' : null"
                      :disabled="!!!selectedClient"
                      @click.prevent="
                        () => {
                          tab = 5
                          clientChildSelected = { ...selectedClient }
                          $nextTick(() => {
                            $refs.clientChildSelectedRef.updateInfos()
                          })
                        }
                      "
                    >
                      <a-icon
                        class="self-center"
                        type="home"
                        :class="tab === 5 ? 'text-blue-600' : null"
                      />
                    </a>
                  </a-tooltip>
                </div>
              </div>
            </div>
          </a-card>
        </div>
        <!-- left card tabs -->
        <div
          :class="
            tab === 3
              ? 'w-full sm:w-full md:w-3/6 lg:w-3/6 xl:w-3/6'
              : 'w-full sm:w-full md:w-3/6 lg:w-2/6'
          "
        >
          <transition-group name="fade-up" target="div" appear>
            <!-- devices list -->
            <a-card
              v-if="tab === 1"
              key="1"
              :bordered="false"
              :body-style="{ padding: 0 }"
              class="devices-card overflow-hidden"
            >
              <template slot="title"
                >{{ (devices.length > 0 && devices.length) || 0 }}
                {{ $t('devices') }}
                <a-button
                  v-if="selectedClient"
                  class="self-center"
                  type="primary"
                  shape="circle"
                  icon="plus"
                  size="small"
                  @click="
                    () => {
                      modalDeviceVisible = true
                      device = null
                    }
                  "
                />
              </template>
              <a slot="extra">
                <a-input-search
                  class="self-center w-48 invisible md:visible"
                  :placeholder="$t('FiltreBoitier')"
                  v-model="devicesSearch"
                />
              </a>
              <div>
                <div
                  class="p-3 overflow-scroll min-h-555 h-content"
                  style="border-right: 1px solid rgb(226, 232, 240);"
                  v-on:scroll="devicesScroll"
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
                  <div
                    class="mb-3 device"
                    v-for="device in devicesSearch === ''
                      ? devices
                      : devices.filter(
                          (d) =>
                            new RegExp(
                              `${devicesSearch
                                .replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')
                                .toLocaleLowerCase()}`,
                              'i'
                            ).test(d.name + ''.toLocaleLowerCase()) ||
                            new RegExp(
                              `${devicesSearch
                                .replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')
                                .toLocaleLowerCase()}`,
                              'i'
                            ).test(d.simcardNumber + ''.toLocaleLowerCase())
                        )"
                    :key="device.id"
                  >
                    <device-card
                      :device="device"
                      @select="selecteDevice"
                      @history-device="historyDevice"
                      @edit-device="editDevice"
                      @delete-device="deleteDevice"
                    />
                  </div>
                </div>
              </div>
            </a-card>
            <!-- alert list -->
            <a-card
              v-if="tab === 2"
              key="2"
              :bordered="false"
              :body-style="{ padding: 0 }"
            >
              <template slot="title"
                >{{ (alertes.length > 0 && alertes.length) || 0 }}
                {{ $t('devicesAlerts') }}
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
                  class="self-center w-48 invisible md:visible"
                  placeholder="search alert"
                />
              </a>
              <div
                class="p-3 overflow-scroll min-h-555 h-content"
                style="border-right: 1px solid rgb(226, 232, 240);"
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
            <!-- history devices -->
            <a-card
              class="device-history-list"
              v-if="tab === 3"
              key="3"
              :bordered="false"
              :body-style="{ padding: '0px', overflowY: 'auto' }"
            >
              <template slot="title"
                >{{ selectedDevice.name + ' ' + $t('deviceHistory') }}
              </template>
              <template slot="extra">
                <a-range-picker
                  :show-time="{ format: 'HH:mm' }"
                  format="DD-MM-YYYY HH:mm"
                  :default-value="[
                    moment(
                      new Date(
                        new Date().getFullYear(),
                        new Date().getMonth(),
                        new Date().getDate(),
                        0,
                        0
                      ),
                      'DD-MM-YYYY HH:mm'
                    ),
                    moment(
                      new Date(
                        new Date().getFullYear(),
                        new Date().getMonth(),
                        new Date().getDate(),
                        23,
                        59
                      ),
                      'DD-MM-YYYY HH:mm'
                    ),
                  ]"
                  :disabled="dataHistoryLoading"
                  @change="dataHistoryDateChange"
                />
              </template>
              <div>
                <div
                  class="p-0 overflow-auto min-h-555 h-content"
                  style="border-right: 1px solid rgb(226, 232, 240);"
                >
                  <div class="relative w-full h-full">
                    <device-history-table
                      :dataHistory="dataHistory"
                      :dataHistoryLoading="dataHistoryLoading"
                    />
                  </div>
                </div>
              </div>
            </a-card>
            <!-- users list -->
            <a-card
              class="users-list"
              v-if="tab === 4"
              key="4"
              :bordered="false"
              :body-style="{ padding: '0px', overflowY: 'auto' }"
            >
              <template slot="title"
                >{{ (contacts.length > 0 && contacts.length) || 0 }}
                {{ $t('contactList') }}
                <a-button
                  class="self-center"
                  type="primary"
                  shape="circle"
                  icon="plus"
                  size="small"
                  v-if="
                    currUser.permissions
                      .find((p) => p.objecttype === 'contact')
                      .permission.indexOf('n') !== -1
                  "
                  @click="() => (modalAddContactVisible = true)"
                />
              </template>
              <template slot="extra"> </template>
              <div
                class="p-3 overflow-scroll min-h-555 h-content"
                style="border-right: 1px solid rgb(226, 232, 240);"
              >
                <a-result
                  v-if="
                    contacts.length === 0 && !contactsLoaded && !contactsLoading
                  "
                  :title="$t('selectClientFirst')"
                >
                </a-result>
                <a-result
                  status="404"
                  title="No Devices"
                  sub-title="Sorry, No devices for this client."
                  v-if="contacts.length === 0 && contactsLoaded"
                >
                </a-result>
                <div
                  v-if="!contactsLoaded && contactsLoading"
                  class="w-full h-full flex place-content-center content-center"
                >
                  <a-spin class="self-center" />
                </div>
                <div class="mb-3" v-for="contact in contacts" :key="contact.id">
                  <user-card :user="contact" @select="selecteUser" />
                </div>
              </div>
            </a-card>
            <!-- flotte list -->
            <a-card
              class="flotte-list"
              v-if="tab === 5"
              key="5"
              :bordered="false"
              :body-style="{ padding: '0px', overflowY: 'auto' }"
            >
              <template slot="title"
                >{{
                  (clientChildsData.length > 0 && clientChildsData.length) || 0
                }}
                {{ $t('flotteList') }}
                <a-button
                  class="self-center"
                  type="primary"
                  shape="circle"
                  icon="plus"
                  size="small"
                  v-if="
                    currUser.permissions
                      .find((p) => p.objecttype === 'company')
                      .permission.indexOf('n') !== -1
                  "
                  @click="() => (modalClientVisible = true)"
                />
              </template>
              <template slot="extra"> </template>
              <div
                class="p-3 overflow-scroll min-h-555 h-content"
                style="border-right: 1px solid rgb(226, 232, 240);"
              >
                <a-result
                  v-if="!selectedClient"
                  :title="$t('selectClientFirst')"
                >
                </a-result>
                <a-result
                  status="404"
                  title="No Clients"
                  sub-title="Sorry, No clients for this client."
                  v-if="clientChildsData.length === 0"
                >
                </a-result>
                <div
                  v-if="loading"
                  class="w-full h-full flex place-content-center content-center"
                >
                  <a-spin class="self-center" />
                </div>
                <div
                  class="mb-3"
                  v-for="client in clientChildsData"
                  :key="client.id"
                >
                  <client-card
                    :client="client"
                    :selected="
                      clientChildSelected !== null &&
                        clientChildSelected.client_id === client.client_id
                    "
                    @select="selectChildClient"
                    @delete="(client) => deleteClient(client.client_id)"
                  />
                </div>
              </div>
            </a-card>
          </transition-group>
        </div>
        <!-- right card tabs -->
        <div
          :class="
            tab === 3
              ? 'w-full sm:w-full md:w-3/6 lg:w-3/6 xl:w-3/6 md:min-w-xl'
              : 'w-full sm:w-full md:w-3/6 lg:w-4/6'
          "
        >
          <transition-group name="fade-up" target="div" appear>
            <a-card
              v-if="tab === 1 || tab === 3"
              key="1"
              size="small"
              :loading="loading"
              :bordered="false"
              :body-style="{ padding: 0 }"
              :tab-list="
                tab === 3
                  ? rightCardTabsList
                  : [
                      {
                        key: 'gMaps',
                        tab: this.$t('geo'),
                      },
                    ]
              "
              :active-tab-key="rightCardTabsKey"
              @tabChange="
                (key) => {
                  rightCardTabsKey = key
                  key === 'gMaps' && tab === 1
                    ? zoomExtends(
                        devices.filter((d) => d.latitude && d.longitude)
                      )
                    : tab === 3 && zoomExtends(dataHistoryPoints)
                }
              "
            >
              <div
                v-if="rightCardTabsKey === 'gMaps'"
                class="min-h-555 h-content bg-gray-200"
              >
                <gmaps-map :options="mapOptions" ref="devicesMap">
                  <template v-if="!showHistoryInMap">
                    <gmaps-popup
                      v-for="device in devices.filter(
                        (d) => d.latitude && d.longitude
                      )"
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
                  </template>
                  <template v-if="showHistoryInMap && historyPoints.length">
                    <gmaps-polyline
                      v-for="(hpts, index) in historyPoints"
                      :key="`hpts-${index}`"
                      :editable="false"
                      :path="hpts.points"
                      :strokeColor="
                        hpts.speed > 100
                          ? 'red'
                          : hpts.speed > 80
                          ? 'coral'
                          : 'dodgerblue'
                      "
                      strokeOpacity="0.85"
                      strokeWeight="7"
                    />
                  </template>
                  <template v-if="showHistoryInMap">
                    <gmaps-marker
                      v-for="(startFinish, index) in dataHistory
                        .filter((d) => d.latitude && d.longitude)
                        .filter(
                          (d, index) =>
                            index === 0 ||
                            index ===
                              dataHistory.filter(
                                (d) => d.latitude && d.longitude
                              ).length -
                                1
                        )"
                      :key="`startFinish-${index}`"
                      :position="{
                        lat: startFinish.latitude,
                        lng: startFinish.longitude,
                      }"
                      @click="openGmapInfoStop(startFinish.history_id)"
                      :icon="
                        index === 0 && startFinish.enginestate === 1
                          ? require('@/assets/img/finish.svg')
                          : index !== 0
                          ? require('@/assets/img/start.svg')
                          : require('@/assets/img/arrow.svg')
                      "
                    />
                    <gmaps-marker
                      v-for="historyPoint in dataHistory
                        .filter((d) => d.latitude && d.longitude)
                        .filter((d) => d.enginestate === 1)
                        .filter(
                          (d, index) =>
                            index !== 0 &&
                            index !==
                              dataHistory.filter(
                                (d) => d.latitude && d.longitude
                              ).length -
                                1
                        )"
                      :key="historyPoint.history_id"
                      :position="{
                        lat: historyPoint.latitude,
                        lng: historyPoint.longitude,
                      }"
                      :icon="require('@/assets/img/stop.svg')"
                      @click="openGmapInfoStop(historyPoint.history_id)"
                    />
                    <gmaps-info-window
                      v-for="historyPoint in Object.values(
                        dataHistory.reduce(
                          (acc, cur) =>
                            Object.assign(acc, { [cur.history_id]: cur }),
                          {}
                        )
                      ).filter((d) => d.latitude && d.longitude)"
                      :key="`info-window-${historyPoint.history_id}`"
                      :ref="`infoWindowRef-${historyPoint.history_id}`"
                      :options="{
                        hidden: true,
                        position: {
                          lat: historyPoint.latitude,
                          lng: historyPoint.longitude,
                        },
                      }"
                    >
                      <div>
                        <div class="mb-1">
                          <span class="font-medium">Raport Time: </span>
                          <span>{{ historyPoint.appdate }}</span>
                        </div>
                        <div class="mb-1">
                          <span class="font-medium">Adress: </span>
                          <span
                            >{{ historyPoint.latitude }},
                            {{ historyPoint.longitude }}</span
                          >
                        </div>
                      </div>
                    </gmaps-info-window>
                  </template>
                </gmaps-map>
              </div>
              <div
                v-else-if="rightCardTabsKey === 'historyStats'"
                class="min-h-555 h-content bg-white"
              >
                <div id="chart-container" class="p2">
                  <fusioncharts
                    :type="type"
                    :width="width"
                    :height="height"
                    :dataformat="dataFormat"
                    :dataSource="dataSource"
                  >
                  </fusioncharts>
                </div>
              </div>
            </a-card>
            <!-- tab gmaps-map 
            alert details card -->
            <a-card
              class=""
              v-if="tab === 2"
              key="2"
              :bordered="false"
              :title="$t('alertDetails')"
              :body-style="{ padding: '0px', overflowY: 'auto' }"
            >
              <div class="bg-white">
                <div class="p-2 min-h-555 h-content">
                  <a-result
                    v-if="!selectedAlert"
                    :title="$t('selectAlertFirst')"
                  />
                  <alert-descriptions
                    v-show="selectedAlert"
                    ref="alertDescriptionsRef"
                    :alert="selectedAlert"
                  />
                </div>
              </div>
            </a-card>
            <!-- user details card -->
            <a-card
              class=""
              v-if="tab === 4"
              key="3"
              :bordered="false"
              :title="$t('userDetails')"
              :body-style="{ padding: '0px', overflowY: 'auto' }"
            >
              <div class="bg-white">
                <div class="p-2 min-h-555 h-content">
                  <a-result
                    v-if="!selectedUser"
                    :title="$t('selectUserFirst')"
                  />
                  <user-infos
                    v-show="selectedUser"
                    ref="userInfosRef"
                    :user="selectedUser"
                    :loading="addingLoading"
                    @submit="updateUser"
                  />
                </div>
              </div>
            </a-card>
            <!-- clients childs details card -->
            <a-card
              class=""
              v-if="tab === 5"
              key="4"
              :bordered="false"
              :title="$t('clientDetails')"
              :body-style="{ padding: '0px', overflowY: 'auto' }"
            >
              <div class="bg-white">
                <div class="p-2 min-h-555 h-content">
                  <a-result
                    v-if="
                      !clientChildSelectedLoading &&
                        clientChildSelected === null
                    "
                    :title="$t('clientChildSelected')"
                  />
                  <div
                    v-if="
                      clientChildSelectedLoading && clientChildSelected === null
                    "
                    class="w-full h-full flex place-content-center content-center"
                  >
                    <a-spin class="self-center" />
                  </div>
                  <client-infos
                    v-show="
                      clientChildSelected !== null &&
                        !clientChildSelectedLoading
                    "
                    ref="clientChildSelectedRef"
                    :client="clientChildSelected"
                    @updateClient="updateClient"
                  />
                </div>
              </div>
            </a-card>
          </transition-group>
        </div>
      </div>
    </template>
    <!-- modal add new alert -->
    <a-modal
      :title="
        `${$t('addNewAlert')} #${
          selectedClient ? selectedClient.commercialname : ''
        }`
      "
      class="add-evice-modal"
      width="65vw"
      :dialog-style="{ top: '20px' }"
      :visible="modalAddAlertVisible"
      @cancel="
        () => {
          $refs.addAlertFormRef.resetForm()
          modalAddAlertVisible = false
        }
      "
    >
      <template slot="footer">
        <a-button
          type="danger"
          key="cancel"
          @click="
            () => {
              $refs.addAlertFormRef.resetForm()
              modalAddAlertVisible = false
            }
          "
        >
          Cancel
        </a-button>
        <a-button key="back" @click="() => $refs.addAlertFormRef.resetForm()">
          Reset
        </a-button>
        <a-button
          key="submit"
          type="primary"
          :loading="addingLoading"
          @click="() => $refs.addAlertFormRef.onSubmit()"
        >
          Submit
        </a-button>
      </template>
      <add-alert-form
        :devices="devices"
        :clientId="selectedClientValue"
        ref="addAlertFormRef"
        @submit="addNewAlert"
      />
    </a-modal>
    <!-- modal add new contact -->
    <a-modal
      :title="
        `${$t('addNewContact')} #${
          selectedClient ? selectedClient.commercialname : ''
        }`
      "
      class="add-evice-modal"
      width="65vw"
      :dialog-style="{ top: '20px' }"
      :visible="modalAddContactVisible"
      @cancel="
        () => {
          $refs.addContactFormRef.resetForm()
          modalAddContactVisible = false
        }
      "
    >
      <template slot="footer">
        <a-button
          type="danger"
          key="cancel"
          @click="
            () => {
              $refs.addContactFormRef.resetForm()
              modalAddContactVisible = false
            }
          "
        >
          Cancel
        </a-button>
        <a-button key="back" @click="() => $refs.addContactFormRef.resetForm()">
          Reset
        </a-button>
        <a-button
          key="submit"
          type="primary"
          :loading="addingLoading"
          @click="() => $refs.addContactFormRef.onSubmit()"
        >
          Submit
        </a-button>
      </template>
      <add-contact-form
        :deviceTypes="deviceTypes"
        :clientId="selectedClientValue"
        ref="addContactFormRef"
        @submit="addNewContact"
      />
    </a-modal>
    <!-- modal add new device -->
    <a-modal
      :title="
        `${device ? $t('updateDevice') : $t('addNewDevice')} #${
          selectedClient ? selectedClient.commercialname : ''
        }`
      "
      class="add-evice-modal"
      width="65vw"
      :dialog-style="{ top: '20px' }"
      :visible="modalDeviceVisible"
      @cancel="
        () => {
          $refs.addDeviceFormRef.resetForm()
          modalDeviceVisible = false
        }
      "
    >
      <template slot="footer">
        <a-button
          type="danger"
          key="cancel"
          @click="
            () => {
              $refs.addDeviceFormRef.resetForm()
              modalDeviceVisible = false
            }
          "
        >
          Cancel
        </a-button>
        <a-button key="back" @click="() => $refs.addDeviceFormRef.resetForm()">
          Reset
        </a-button>
        <a-button
          key="submit"
          type="primary"
          :loading="addingLoading"
          @click="() => $refs.addDeviceFormRef.onSubmit()"
        >
          Submit
        </a-button>
      </template>
      <add-device-form
        ref="addDeviceFormRef"
        :device="device"
        :deviceTypes="deviceTypes"
        :clients="treeClientsData"
        :clientId="selectedClientValue"
        @submit="submitDevice"
      />
    </a-modal>
    <!-- modal add new client -->
    <a-modal
      :title="
        `${$t('addNewClient')} #${
          selectedClient ? selectedClient.commercialname : ''
        }`
      "
      class="add-evice-modal"
      width="65vw"
      :dialog-style="{ top: '20px' }"
      :visible="modalClientVisible"
      @cancel="
        () => {
          $refs.addClientFormRef.resetForm()
          modalClientVisible = false
        }
      "
    >
      <template slot="footer">
        <a-button
          type="danger"
          key="cancel"
          @click="
            () => {
              $refs.addClientFormRef.resetForm()
              modalClientVisible = false
            }
          "
        >
          Cancel
        </a-button>
        <a-button key="back" @click="() => $refs.addClientFormRef.resetForm()">
          Reset
        </a-button>
        <a-button
          key="submit"
          type="primary"
          :loading="addingLoading"
          @click="() => $refs.addClientFormRef.onSubmit()"
        >
          Submit
        </a-button>
      </template>
      <add-client-form
        :deviceTypes="deviceTypes"
        ref="addClientFormRef"
        @submit="addNewClient"
      />
    </a-modal>
  </page-layout>
</template>

<script>
import { format } from 'date-fns'
import moment from 'moment'
import PageLayout from '@/layouts/PageLayout'
import { mapState } from 'vuex'
import { request, METHOD } from '@/utils/request'
import {
  gmapsMap,
  gmapsInfoWindow,
  gmapsMarker,
  gmapsPopup,
  gmapsPolyline,
} from '@/plugins/myGmap'
import {
  DeviceCard,
  UserCard,
  DeviceAlertCard,
  AddDeviceForm,
  AddClientForm,
  AlertDescriptions,
  DeviceHistoryTable,
  UserInfos,
  ClientCard,
  ClientInfos,
  AddAlertForm,
  AddContactForm,
} from '../../components'
const BASE_URL = process.env.VUE_APP_API_BASE_URL
const iconStart = {
  path: 'M 0, 0 m -5, 0 a 5,5 0 1,0 10,0 a 5,5 0 1,0 -10,0',
  strokeOpacity: 0.7,
  strokeWeight: 4,
  strokeColor: '#0bd60b',
  fillColor: '#fff',
  fillOpacity: 0.8,
  scale: 1,
}
const iconFinish = {
  path: 'M 0, 0 m -5, 0 a 5,5 0 1,0 10,0 a 5,5 0 1,0 -10,0',
  strokeOpacity: 0.7,
  strokeWeight: 4,
  strokeColor: '#f00',
  fillColor: '#fff',
  fillOpacity: 0.8,
  scale: 1,
}

export default {
  name: 'Cartographie',
  components: {
    PageLayout,
    gmapsMap,
    gmapsPopup,
    gmapsMarker,
    gmapsInfoWindow,
    gmapsPolyline,
    DeviceCard,
    UserCard,
    DeviceAlertCard,
    AddDeviceForm,
    AddClientForm,
    AlertDescriptions,
    DeviceHistoryTable,
    UserInfos,
    ClientCard,
    ClientInfos,
    AddAlertForm,
    AddContactForm,
  },
  i18n: require('./i18n'),
  data() {
    return {
      loading: true,
      selectedClientValue: null,
      selectedClient: null,
      clientChildSelected: null,
      clientChildSelectedLoading: true,
      treeClientsData: [],
      clientChildsData: [],
      devices: [],
      device: null,
      devicesSearch: '',
      contacts: [],
      contactsLoaded: false,
      contactsLoading: false,
      selectedUser: null,
      alertes: [],
      modalDeviceVisible: false,
      modalAddAlertVisible: false,
      modalClientVisible: false,
      modalAddContactVisible: false,
      addingLoading: false,
      selectedAlert: null,
      selectedDevice: null,
      deviceTypes: [],
      dataHistory: [],
      dataHistoryPoints: [],
      showHistoryInMap: false,
      dataHistoryLoading: true,
      devicesLoaded: false,
      devicesLoading: false,
      alertesLoaded: false,
      alertesLoading: false,
      welcome: {
        timeFix: '',
        message: '',
      },
      tab: 1,
      rightCardTabsList: [
        {
          key: 'gMaps',
          tab: this.$t('geo'),
        },
        {
          key: 'historyStats',
          tab: 'Statistics',
        },
      ],
      rightCardTabsKey: 'gMaps',
      mapOptions: {
        center: { lat: 48, lng: 2 },
        zoom: 2,
        fullscreenControl: false,
        mapTypeControl: true,
        rotateControl: false,
        scaleControl: true,
        streetViewControl: false,
        zoomControl: true,
        // mapTypeId: 'satellite',
      },
      historyPoints: [],
      icons: [
        { icon: iconStart, offset: '0%' },
        { icon: iconFinish, offset: '100%' },
      ],
      //test
      type: 'scrollcombidy2d',
      renderAt: 'chart-container',
      width: '100%',
      height: '550',
      dataFormat: 'json',
      dataSource: {},
    }
  },
  computed: {
    ...mapState('account', { currUser: 'user' }),
    ...mapState('setting', ['lang']),
  },
  created() {
    this.getClients()
  },
  methods: {
    formatDate: (date = new Date(), formatDate = 'yyyy-MM-dd') => {
      return format(date, formatDate)
    },
    moment,
    getClients() {
      this.loading = true
      this.treeClientsData = []
      request(`${BASE_URL}/api/client`, METHOD.GET).then((res) => {
        // this.selectedClient = res.data.find((c) => !c.pId)
        this.treeClientsData = res.data
        this.selectClient(res.data[0].id)
        this.selectedClientValue = res.data[0].id
      })
      this.loading = false
    },
    selecteDevice(device) {
      device.selected = !device.selected
      this.devices
        .filter((d) => d.id !== device.id)
        .forEach((d) => (d.selected = false))
      if (device.selected) {
        if (device.latitude && device.longitude) {
          this.selectedDevice = device
          this.mapOptions.zoom = 20
          this.mapOptions.center.lat = device.latitude
          this.mapOptions.center.lng = device.longitude
        }
      } else {
        this.selectedDevice = null
      }
      if (this.devices.every((d) => !d.selected)) {
        this.zoomExtends(this.devices.filter((d) => d.latitude && d.longitude))
      }
    },
    selectClient(client_id) {
      // this.selectedClient = this.treeClientsData.find((c) => c.id === client_id)
      this.selectedClientValue = client_id

      this.getDevicesByClientId(client_id)
      this.getAlertByClientId(client_id)
      this.getContactsByClientId(client_id)
      this.getClientChilds(client_id)
      this.clientChildSelected = null
      this.clientChildSelectedLoading = true
      request(`${BASE_URL}/api/client/${client_id}`, METHOD.GET).then((res) => {
        this.clientChildSelectedLoading = false
        this.selectedClient = res.data
        this.clientChildSelected = { ...this.selectedClient }
      })
    },
    getClientChilds(clientId) {
      request(`${BASE_URL}/api/client/${clientId}/childs`, METHOD.GET).then(
        (res) => {
          this.clientChildsData = res.data
        }
      )
    },
    getDevicesByClientId(clientId, skip = 0) {
      skip === 0 && (this.devices = [])
      this.devicesLoaded = false
      this.devicesLoading = true
      request(
        `${BASE_URL}/api/device/byClientId/${clientId}?skip=${skip}`,
        METHOD.GET
      ).then((res) => {
        // just for check if exisit
        const { data } = res
        const uniqDevices = data.filter(
          (d) => !this.devices.find((cd) => cd.id === d.id)
        )
        this.devices.push(...uniqDevices)
        // this.devices.push(...data)
        this.devicesLoaded = true
        this.devicesLoading = false
        if (this.tab === 1) {
          this.showHistoryInMap = false
          this.zoomExtends(
            this.devices.filter((d) => d.latitude && d.longitude)
          )
        }
      })
    },
    getAlertByClientId(clientId) {
      this.alertes = []
      this.alertesLoaded = false
      this.alertesLoading = true
      request(`${BASE_URL}/api/alert/byClientId/${clientId}`, METHOD.GET).then(
        (res) => {
          this.alertes = res.data
          this.alertesLoaded = true
          this.alertesLoading = false
        }
      )
    },
    getContactsByClientId(client_id) {
      this.contacts = []
      this.contactsLoading = true
      this.contactsLoaded = false
      request(`${BASE_URL}/api/contact/${client_id}`, METHOD.GET).then(
        (res) => {
          this.contacts = res.data
          const currentUser = this.contacts.find(
            (cu) => cu.id === this.currUser.id
          )
          currentUser && (currentUser.selected = true)
          this.selectedUser = currentUser
          this.contactsLoading = false
          this.contactsLoaded = true
        }
      )
    },
    selecteAlert(alert) {
      alert.selected = !alert.selected
      this.alertes
        .filter((a) => a.id !== alert.id)
        .forEach((a) => (a.selected = false))
      if (alert.selected) {
        this.selectedAlert = alert
      } else {
        this.selectedAlert = null
      }
      if (this.alertes.every((a) => !a.selected)) {
        this.selectedAlert = null
      }
    },
    selecteUser(user) {
      user.selected = !user.selected
      this.contacts
        .filter((a) => a.id !== user.id)
        .forEach((a) => (a.selected = false))
      if (user.selected) {
        this.selectedUser = user
      } else {
        this.selectedUser = null
      }
      if (this.contacts.every((a) => !a.selected)) {
        this.selectedUser = null
      }
    },
    clickOnMapPin(event, device) {
      this.selecteDevice(device)
    },
    deleteAlert(alert) {
      request(`${BASE_URL}/api/alert/${alert.id}`, METHOD.DELETE)
        .then(() => {
          this.alertes = []
          this.alertesLoaded = false
          this.alertesLoading = true
          this.getAlertByClientId(this.selectedClientValue)
          this.$message.success(`${alert.name}, Alert has been deleted`, 5)
        })
        .catch((error) =>
          this.$message.error(
            `${alert.name}, Sorry alert not deleted, error: ${error.status}`,
            5
          )
        )
    },
    historyDevice(device, filter = { from: null, to: null }) {
      this.dataHistory = []
      this.historyPoints = []
      this.dataHistoryLoading = true
      this.showHistoryInMap = true
      request(
        `${BASE_URL}/api/history/${device.id}?from=${filter.from}&to=${filter.to}`,
        METHOD.GET
      ).then((res) => {
        this.dataHistory = res.data
        this.dataHistoryLoading = false
        this.dataHistoryPoints = res.data.filter(
          (d) => +d.latitude && +d.longitude
        )
        for (let i = 0; i < this.dataHistoryPoints.length - 1; i++) {
          if (
            res.data[i].latitude &&
            res.data[i].longitude &&
            res.data[i + 1].latitude &&
            res.data[i + 1].longitude
          ) {
            this.historyPoints.push({
              speed:
                (res.data[i + 1].speed || 0) + (res.data[i]?.speed || 0) / 2,
              points: [
                {
                  lat: +res.data[i].latitude,
                  lng: +res.data[i].longitude,
                },
                {
                  lat: +res.data[i + 1].latitude,
                  lng: +res.data[i + 1].longitude,
                },
              ],
            })
          }
        }
        this.zoomExtends(this.dataHistoryPoints)
        this.dataSource = {
          chart: {
            caption: 'Temperature1 et Speed',
            subCaption: `${new Date(
              filter.from && filter.from ? filter.from : new Date()
            ).toLocaleString('fr-fr', {
              month: 'long',
              year: 'numeric',
              day: 'numeric',
            })} to ${new Date(
              filter.from && filter.from ? filter.to : new Date()
            ).toLocaleString('fr-fr', {
              month: 'long',
              year: 'numeric',
              day: 'numeric',
            })}`,
            xAxisname: 'Month',
            pYAxisName: 'Temperature',
            sYAxisName: 'Speed K/H',
            numberPrefix: '',
            sNumberSuffix: '',
            sYAxisMaxValue: '50',
            showValues: '1',
            numVisiblePlot: '12',
            flatScrollBars: '1',
            scrollheight: '10',
            theme: 'fusion',
          },
          categories: [
            {
              category: this.dataHistory.map((hd) => ({
                label: new Date(hd.localizationdate).toLocaleString('fr-fr', {
                  hour: 'numeric',
                }),
              })),
            },
          ],
          dataset: [
            {
              seriesName: 'Temperature1',
              renderAs: 'area',
              showValues: '0',
              data: this.dataHistory.map((hd) => ({ value: hd.temperature1 })),
            },
            {
              seriesName: 'Speed',
              parentYAxis: 'S',
              renderAs: 'line',
              showValues: '0',
              data: this.dataHistory.map((hd) => ({ value: hd.speed })),
            },
          ],
        }
      })
      this.selectedDevice = device
      this.devices.forEach((d) => (d.selected = false))
      this.tab = 3
    },
    zoomExtends(points) {
      let bounds = new window.google.maps.LatLngBounds()
      if (points.length > 0) {
        for (let i = 0; i < points.length; i++) {
          bounds.extend({
            lat: points[i].latitude,
            lng: points[i].longitude,
          })
        }
        if (this.tab === 1 || this.tab === 3) {
          setTimeout(() => {
            this.$refs.devicesMap?.getMap() &&
              this.$refs.devicesMap.getMap().fitBounds(bounds)
          }, 20)
        }
      }
    },
    submitDevice(device) {
      this.addingLoading = true
      request(`${BASE_URL}/api/device`, device.id ? METHOD.PUT : METHOD.POST, {
        ...device,
      })
        .then(() => {
          this.getDevicesByClientId(this.selectedClientValue)
          this.$refs.addDeviceFormRef.resetForm()
          this.modalDeviceVisible = false
          this.addingLoading = false
          this.$message.success(
            `${device.name}, Device has been ${
              device.id ? 'updated' : 'Adedd'
            }`,
            5
          )
          device.id && (this.device = null)
        })
        .catch((error) => {
          this.addingLoading = false
          this.$message.error(
            `${device.name}, Sorry device can not ${
              device.id ? 'updated' : 'created'
            }, error: ${error.status}`,
            5
          )
        })
    },
    editDevice(device) {
      this.modalDeviceVisible = true
      this.device = Object.assign(device, {})
    },
    deleteDevice(deviceId) {
      const self = this
      this.$confirm({
        content: 'Delete Device',
        okText: 'Yes',
        onOk() {
          return request(`${BASE_URL}/api/device/${deviceId}`, METHOD.DELETE)
            .then(() => {
              self.getDevicesByClientId(self.selectedClientValue)
              self.$message.success(`Device has been deleted`, 5)
              self.$destroyAll()
            })
            .catch((error) => {
              self.$destroyAll()
              self.$message.error(
                `Sorry device not deleted, error: ${error.status}`,
                5
              )
            })
        },
        cancelText: 'No',
      })
    },
    updateUser(user) {
      console.log(user)
      this.addingLoading = true
      request(`${BASE_URL}/api/user`, METHOD.PUT, {
        ...user,
      })
        .then(() => {
          this.addingLoading = false
          this.getContactsByClientId(this.selectedClientValue)
          this.$message.success(
            `${user.lastname}, User has been updated`,
            5
          )
        })
        .catch((error) => {
          this.addingLoading = false
          this.$message.error(
            `${user.lastname}, Sorry user can not updated, error: ${error.status}`,
            5
          )
        })
    },
    addNewClient(client) {
      this.addingLoading = true
      request(`${BASE_URL}/api/client`, METHOD.POST, {
        ...client,
        parentId: this.selectedClientValue,
      })
        .then(() => {
          this.getClients()
          this.$refs.addClientFormRef.resetForm()
          this.modalClientVisible = false
          this.addingLoading = false
          this.$message.success(
            `${client.commercialName}, Client has been Adedd`,
            5
          )
        })
        .catch((error) => {
          this.addingLoading = false
          this.$message.error(
            `${client.commercialName}, Sorry client not created, error: ${error.status}`,
            5
          )
        })
    },
    updateClient(client) {
      const self = this
      this.$confirm({
        content: 'Update Client',
        okText: 'Yes',
        onOk() {
          return request(`${BASE_URL}/api/client`, METHOD.PUT, {
            ...client,
            id: client.client_id,
            parentId: self.selectedClientValue,
          })
            .then(() => {
              self.getClients()
              self.$message.success(`Client has been Updated`, 5)
              self.$destroyAll()
            })
            .catch((error) => {
              self.$destroyAll()
              self.$message.error(
                `Sorry client not updated, error: ${error.status}`,
                5
              )
            })
        },
        cancelText: 'No',
      })
    },
    deleteClient(clientId) {
      const self = this
      this.$confirm({
        content: 'Delete Client',
        okText: 'Yes',
        onOk() {
          return request(`${BASE_URL}/api/client/${clientId}`, METHOD.DELETE)
            .then(() => {
              self.getClients()
              self.$message.success(`Client has been deleted`, 5)
              self.$destroyAll()
            })
            .catch((error) => {
              self.$destroyAll()
              self.$message.error(
                `Sorry client not deleted, error: ${error.status}`,
                5
              )
            })
        },
        cancelText: 'No',
      })
    },
    async selectChildClient(client) {
      if (
        this.clientChildSelected &&
        client.client_id === this.clientChildSelected.client_id
      ) {
        this.clientChildSelected = this.selectedClient
      } else {
        this.clientChildSelected = null
        this.clientChildSelectedLoading = true
        const { data } = await request(
          `${BASE_URL}/api/client/${client.client_id}`,
          METHOD.GET
        )
        this.clientChildSelectedLoading = false
        this.clientChildSelected = data
      }
    },
    dataHistoryDateChange(dates) {
      this.historyDevice(this.selectedDevice, {
        from: dates[0].format('YYYY-MM-DD'),
        to: dates[1].format('YYYY-MM-DD'),
      })
    },
    addNewAlert(alert) {
      request(`${BASE_URL}/api/alert`, METHOD.POST, alert)
        .then(() => {
          this.alertes = []
          this.alertesLoaded = false
          this.alertesLoading = true
          this.modalAddAlertVisible = false
          this.getAlertByClientId(this.selectedClientValue)
          this.$message.success(`${alert.name}, Alert has been added`, 5)
        })
        .catch((error) =>
          this.$message.error(
            `${alert.name}, Sorry alert not added, error: ${error.status}`,
            5
          )
        )
    },
    addNewContact(user) {
      request(`${BASE_URL}/api/user`, METHOD.POST, user)
        .then(() => {
          this.contacts = []
          this.contactsLoaded = false
          this.contactsLoading = true
          this.modalAddContactVisible = false
          this.getContactsByClientId(this.selectedClientValue)
          this.$message.success(`${user.firstname}, User has been added`, 5)
        })
        .catch((error) =>
          this.$message.error(
            `${alert.name}, Sorry user not added, error: ${error.status}`,
            5
          )
        )
    },
    openGmapInfoStop(historyId) {
      this.$refs[`infoWindowRef-${historyId}`][0] &&
        this.$refs[`infoWindowRef-${historyId}`][0].open()
    },
    devicesScroll($event) {
      const { offsetHeight, scrollTop, scrollHeight } = $event.target
      if (offsetHeight + scrollTop === scrollHeight) {
        this.devicesLoaded &&
          this.getDevicesByClientId(this.selectedClientValue, this.devices.length)
        console.log('load more devices with skip', this.devices.length)
      }
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
    min-height: 609px;
    height: calc(100vh - 146px);
    border-right: solid 1px #e2e8f0;
    > div > div > a.active {
      box-shadow: inset -2px 0 0px 0px #1c90ff;
    }
  }
}
.table-history-device {
  .ant-table {
    border-radius: 0;
    border: none;
  }
}
.add-evice-modal .ant-modal {
  min-width: 350px;
}
</style>
