<template>
  <div class="grid h-full">
    <div class="ant-form ant-form-horizontal flex flex-grow-1">
      <div class="w-full">
        <div>
          <a-form-model ref="ruleForm" :model="form">
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div>
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-1">
                  <div>
                    <a-form-model-item
                      ref="lastname"
                      label="lastname"
                      prop="lastname"
                    >
                      <a-input
                        v-model="form.lastname"
                        @blur="
                          () => {
                            $refs.lastname.onFieldBlur()
                          }
                        "
                      /> </a-form-model-item
                  ></div>
                  <div>
                    <a-form-model-item
                      ref="firstname"
                      label="firstname"
                      prop="firstname"
                    >
                      <a-input
                        v-model="form.firstname"
                        @blur="
                          () => {
                            $refs.firstname.onFieldBlur()
                          }
                        "
                      /> </a-form-model-item
                  ></div>
                </div>
              </div>
              <div>
                <div>
                  <a-form-model-item
                    ref="jobtitle"
                    label="jobtitle"
                    prop="jobtitle"
                  >
                    <a-input
                      v-model="form.jobtitle"
                      @blur="
                        () => {
                          $refs.jobtitle.onFieldBlur()
                        }
                      "
                    />
                  </a-form-model-item>
                </div>
              </div>
            </div>
            <div class="grid grid-cols-2 gap-2">
              <div>
                <a-form-model-item ref="login" label="Login" prop="login">
                  <a-input
                    v-model="form.login"
                    @blur="
                      () => {
                        $refs.login.onFieldBlur()
                      }
                    "
                  />
                </a-form-model-item>
              </div>
              <div>
                <a-form-model-item
                  ref="password"
                  label="Password"
                  prop="password"
                >
                  <a-input-password
                    v-model="form.password"
                    @blur="
                      () => {
                        $refs.password.onFieldBlur()
                      }
                    "
                    placeholder="password"
                  />
                </a-form-model-item>
              </div>
            </div>
          </a-form-model>
        </div>
        <div>
          <a-tabs default-active-key="1">
            <a-tab-pane key="1" tab="Permissions">
              <a-table
                :columns="columnsUserPermissions"
                :scroll="{ y: 160 }"
                :pagination="false"
                :data-source="permissions"
                :loading="userPermissionsLoading"
                rowKey="objecttype"
                size="small"
              >
                <span slot-scope="r, record" slot="consultRender">
                  <a-switch
                    v-model="record.r"
                    size="small"
                    :default-checked="r"
                    @change="
                      (e) => {
                        record.allPermissions =
                          e && record.n && record.m && record.d
                      }
                    "
                  />
                </span>
                <span slot-scope="n, record" slot="createRender">
                  <a-switch
                    v-model="record.n"
                    size="small"
                    :default-checked="n"
                    @change="
                      (e) => {
                        record.allPermissions =
                          e && record.r && record.m && record.d
                      }
                    "
                  />
                </span>
                <span slot-scope="m, record" slot="updateRender">
                  <a-switch
                    v-model="record.m"
                    size="small"
                    :default-checked="m"
                    @change="
                      (e) => {
                        record.allPermissions =
                          e && record.n && record.r && record.d
                      }
                    "
                  />
                </span>
                <span slot-scope="d, record" slot="deleteRender">
                  <a-switch
                    v-model="record.d"
                    size="small"
                    :default-checked="d"
                    @change="
                      (e) => {
                        record.allPermissions =
                          e && record.r && record.m && record.n
                      }
                    "
                  />
                </span>
                <span slot-scope="allPermissions, record" slot="allRender">
                  <a-switch
                    v-model="record.allPermissions"
                    size="small"
                    :default-checked="allPermissions"
                    @change="(e) => selectAllPermission(e, record)"
                  />
                </span>
              </a-table>
            </a-tab-pane>
            <a-tab-pane key="2" tab="Addresses"> Addresses </a-tab-pane>
          </a-tabs>
        </div>
      </div>
    </div>
    <div v-if="checkUserHasPermission(currUser.permissions, 'user', 'm')" class="flex h-10 items-center justify-end self-end mx-1">
      <a-button key="back" @click="updateInfos"> Reset </a-button>
      <a-button
        key="submit"
        type="primary"
        :loading="loading"
        @click="onSubmit"
        class="ml-2"
      >
        Update
      </a-button>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import { request, METHOD } from '@/utils/request'
const BASE_URL = process.env.VUE_APP_API_BASE_URL

const checkUserHasPermission = (permissions, objectType, permission) =>
  permissions.find((p) => p.objecttype === objectType) &&
  permissions
    .find((p) => p.objecttype === objectType)
    .permission?.indexOf(permission) !== -1

const columnsUserPermissions = [
  {
    title: 'Function',
    dataIndex: 'objecttype',
    width: '180px',
  },
  {
    title: 'Consult',
    dataIndex: 'r',
    scopedSlots: { customRender: 'consultRender' },
  },
  {
    title: 'Create',
    dataIndex: 'n',
    scopedSlots: { customRender: 'createRender' },
  },
  {
    title: 'Modify',
    dataIndex: 'm',
    scopedSlots: { customRender: 'updateRender' },
  },
  {
    title: 'Delete',
    dataIndex: 'd',
    scopedSlots: { customRender: 'deleteRender' },
  },
  {
    title: 'All',
    dataIndex: 'allPermission',
    scopedSlots: { customRender: 'allRender' },
  },
]
export default {
  name: 'UserInfos',
  props: {
    user: {
      type: Object,
      required: false,
      default: () => null,
    },
    loading: {
      type: Boolean,
      required: false,
      default: () => false,
    },
  },
  data() {
    return {
      form: {
        lastname: '',
        firstname: '',
        jobtitle: '',
        login: '',
        password: '',
      },
      permissions: [],
      columnsUserPermissions,
      userPermissionsLoading: true,
    }
  },
  watch: {
    user: function (newVal) {
      if (newVal) {
        this.updateInfos()
        if (this.currUser.id === newVal.id) {
          this.getPermissions()
        } else this.getUserById(newVal.id)
      }
    },
  },
  computed: {
    ...mapState('account', { currUser: 'user' }),
  },
  created() {
    this.getPermissions()
    this.user && this.updateInfos()
  },
  methods: {
    updateInfos() {
      this.form.lastname = this.user.lastname || ''
      this.form.firstname = this.user.firstname || ''
      this.form.jobtitle = this.user.jobtitle || ''
      this.form.description = this.user.description || ''
      this.form.login = this.user.login || ''
    },
    getUserById(id) {
      this.userPermissionsLoading = true
      request(`${BASE_URL}/api/user/${id}`, METHOD.GET).then((res) => {
        this.getPermissions(res.data)
      })
    },
    getPermissions(user = this.currUser) {
      this.userPermissionsLoading = true
      if (this.permissions.length) {
        this.permissions.forEach((ps) => {
          ps.r =
            user.permissions
              .find((p) => p.objecttype === ps.objecttype)
              ?.permission?.indexOf('r') > -1
          ps.n =
            user.permissions
              .find((p) => p.objecttype === ps.objecttype)
              ?.permission?.indexOf('n') > -1
          ps.m =
            user.permissions
              .find((p) => p.objecttype === ps.objecttype)
              ?.permission?.indexOf('m') > -1
          ps.d =
            user.permissions
              .find((p) => p.objecttype === ps.objecttype)
              ?.permission?.indexOf('d') > -1
          ps.allPermissions =
            user.permissions
              .find((p) => p.objecttype === ps.objecttype)
              ?.permission?.indexOf('rnmd') > -1
        })
        this.userPermissionsLoading = false
      } else {
        request(`${BASE_URL}/api/objectType`, METHOD.GET).then((res) => {
          this.permissions = res.data.map((o) => ({
            objecttype: o.objecttype,
            r:
              user.permissions
                .find((p) => p.objecttype === o.objecttype)
                ?.permission?.indexOf('r') > -1,
            n:
              user.permissions
                .find((p) => p.objecttype === o.objecttype)
                ?.permission?.indexOf('n') > -1,
            m:
              user.permissions
                .find((p) => p.objecttype === o.objecttype)
                ?.permission?.indexOf('m') > -1,
            d:
              user.permissions
                .find((p) => p.objecttype === o.objecttype)
                ?.permission?.indexOf('d') > -1,
            allPermissions:
              user.permissions
                .find((p) => p.objecttype === o.objecttype)
                ?.permission?.indexOf('rnmd') > -1,
          }))
          this.userPermissionsLoading = false
        })
      }
    },
    selectAllPermission(value, record) {
      record.r = value
      record.n = value
      record.m = value
      record.d = value
    },
    convertToPermission(r, n, m, d) {
      let s = ''
      r && (s += 'r')
      n && (s += 'n')
      m && (s += 'm')
      d && (s += 'd')
      return s
    },
    onSubmit() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          this.$emit('submit', {
            ...this.form,
            id: +this.user.id,
            permissions: this.permissions.map((p) => ({
              objectType: p.objecttype,
              permission: this.convertToPermission(p.r, p.n, p.m, p.d),
            })),
          })
        } else {
          return false
        }
      })
    },
    resetForm() {
      this.$refs.ruleForm.resetFields()
      this.permissions.forEach((o) => {
        o.r = false
        o.n = false
        o.m = false
        o.d = false
        o.allPermissions = false
      })
    },
    checkUserHasPermission,
  },
}
</script>

<style lang="less" scoped>
.add-device-form {
  .ant-form-item {
    margin-bottom: 5px;
    .ant-form-item-label {
      line-height: 22px;
    }
  }
}
</style>
