<template>
  <a-form-model
    class="add-user-form"
    ref="ruleForm"
    :model="form"
    :rules="rules"
  >
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <div>
        <div>
          <a-form-model-item
            ref="firstname"
            label="First Name"
            prop="firstname"
          >
            <a-input
              v-model="form.firstname"
              @blur="
                () => {
                  $refs.firstname.onFieldBlur()
                }
              "
            />
          </a-form-model-item>
        </div>
        <div>
          <a-form-model-item ref="lastname" label="Last Name" prop="lastname">
            <a-input
              v-model="form.lastname"
              @blur="
                () => {
                  $refs.lastname.onFieldBlur()
                }
              "
            />
          </a-form-model-item>
        </div>
      </div>
      <div>
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
          <a-form-model-item ref="password" label="Password" prop="password">
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
    </div>
    <div>
      <a-tabs default-active-key="1">
        <a-tab-pane key="1" tab="Permissions">
          <a-table
            :columns="columnsUserPermissions"
            :scroll="{ y: 200 }"
            :pagination="{ pageSize: 100 }"
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
        <a-tab-pane key="2" tab="Addresses">
          Addresses
        </a-tab-pane>
      </a-tabs>
    </div>
  </a-form-model>
</template>
<script>
import { request, METHOD } from '@/utils/request'
const BASE_URL = process.env.VUE_APP_API_BASE_URL

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
  name: 'AddContactForm',
  props: {
    user: {
      type: Object,
      required: false,
      default: () => ({}),
    },
    clientId: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      form: {
        firstname: '',
        lastname: '',
        login: '',
        password: '',
      },
      rules: {
        firstname: [
          {
            required: true,
            message: 'Please input firstname',
            trigger: 'blur',
          },
        ],
        login: [
          {
            required: true,
            message: 'Please input login',
            trigger: 'blur',
          },
        ],
        password: [
          {
            required: true,
            message: 'Please input password',
            trigger: 'blur',
          },
        ],
      },
      permissions: [],
      columnsUserPermissions,
      userPermissionsLoading: true,
    }
  },
  created() {
    this.getPermissions()
  },
  // watch: {
  //   clientId: function () {
  //     this.$nextTick(() => {
  //       this.resetForm()
  //     })
  //   },
  // },
  methods: {
    getPermissions() {
      request(`${BASE_URL}/api/objectType`, METHOD.GET).then((res) => {
        this.permissions = res.data.map((o) => ({
          objecttype: o.objecttype,
          r: false,
          n: false,
          m: false,
          d: false,
          allPermissions: false,
        }))
        this.userPermissionsLoading = false
      })
    },
    selectAllPermission(value, record) {
      record.r = value
      record.n = value
      record.m = value
      record.d = value
    },
    convertToPermission(r, n, m, d) {
      let s = ''
      if (r) s += 'r'
      if (n) s += 'n'
      if (m) s += 'm'
      if (d) s += 'd'
      return s
    },
    onSubmit() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          this.$emit('submit', {
            ...this.form,
            clientId: +this.clientId,
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
