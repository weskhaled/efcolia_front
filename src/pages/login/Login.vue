<template>
  <common-layout>
    <div class="top">
      <div class="header">
        <img alt="logo" class="logo inline-block" src="@/assets/img/logo.png" />
      </div>
    </div>
    <div class="login">
      <a-form @submit="onSubmit" :form="form">
        <a-tabs
          size="large"
          :tabBarStyle="{ textAlign: 'center' }"
          style="padding: 0 2px;"
        >
          <a-tab-pane tab="Login" key="1">
            <a-alert
              type="error"
              :closable="true"
              v-show="error"
              :message="error"
              showIcon
              style="margin-bottom: 24px;"
            />
            <a-form-item>
              <a-input
                autocomplete="autocomplete"
                size="large"
                placeholder="username"
                v-decorator="[
                  'name',
                  {
                    rules: [
                      {
                        required: true,
                        message: 'please enter your username',
                        whitespace: true,
                      },
                    ],
                  },
                ]"
              >
                <a-icon slot="prefix" type="user" />
              </a-input>
            </a-form-item>
            <a-form-item>
              <a-input
                size="large"
                placeholder="password"
                autocomplete="autocomplete"
                type="password"
                v-decorator="[
                  'password',
                  {
                    rules: [
                      {
                        required: true,
                        message: 'Please enter password',
                        whitespace: true,
                      },
                    ],
                  },
                ]"
              >
                <a-icon slot="prefix" type="lock" />
              </a-input>
            </a-form-item>
          </a-tab-pane>
        </a-tabs>
        <a-form-item>
          <a-button
            :loading="logging"
            style="width: 100%;margin-top: 24px"
            size="large"
            htmlType="submit"
            type="primary"
            >log in</a-button
          >
        </a-form-item>
      </a-form>
    </div>
  </common-layout>
</template>

<script>
import CommonLayout from '@/layouts/CommonLayout'
import { login } from '@/services/user'
import { setAuthorization, request, METHOD } from '@/utils/request'
import { loadRoutes } from '@/utils/routerUtil'
import { mapMutations } from 'vuex'
const BASE_URL = process.env.VUE_APP_API_BASE_URL

export default {
  name: 'Login',
  components: { CommonLayout },
  data() {
    return {
      logging: false,
      error: '',
      form: this.$form.createForm(this),
    }
  },
  computed: {
    systemName() {
      return this.$store.state.setting.systemName
    },
  },
  methods: {
    ...mapMutations('account', ['setUser', 'setPermissions', 'setRoles']),
    onSubmit(e) {
      e.preventDefault()
      this.form.validateFields((err) => {
        if (!err) {
          this.logging = true
          const name = this.form.getFieldValue('name')
          const password = this.form.getFieldValue('password')
          login(name, password).then(this.afterLogin)
        }
      })
    },
    async afterLogin(res) {
      this.logging = false
      const loginRes = res.data
      if (loginRes) {
        const now = new Date();
        setAuthorization({
          token: loginRes.token,
          expireAt: new Date(now.getTime() + loginRes.expires*1000),
        })
        const userData = await request(
          `${BASE_URL}/api/request/user`,
          METHOD.GET
        ).then((res) => ({
          message: 'Welcome',
          data: {
            user: {
              name: res.data.lastname,
              avatar:
                'https://gw.alipayobjects.com/zos/rmsportal/cnrhVkzwxjPwAaCfPbdc.png',
              address: '@CITY',
              position: {
                CN: '前端工程师 | 蚂蚁金服-计算服务事业群-VUE平台',
                FR: 'welcome',
                US: 'welcome',
              },
              permissions: res.data.permissions
            },
            permissions: [{ id: 'queryForm', operation: ['add', 'edit'] }],
            roles: [{ id: 'admin', operation: ['add', 'edit', 'delete'] }],
          },
        }))
        const { user, permissions, roles } = userData.data
        this.setUser(user)
        this.setPermissions(permissions)
        this.setRoles(roles)
        const routesConfig = [
          {
            router: 'root',
            children: [
              {
                router: 'cartographie',
                name: 'cartographie',
                icon: 'dashboard',
              }
            ],
          },
        ]
        loadRoutes(routesConfig)
        this.$router.push('/cartographie')
        this.$message.success(userData.message, 3)
      } else {
        this.error = loginRes.message
      }
      this.logging = false
    },
  },
}
</script>

<style lang="less" scoped>
.common-layout {
  .top {
    text-align: center;
    .header {
      a {
        text-decoration: none;
      }
      .logo {
        height: 145px;
        vertical-align: top;
      }
      .title {
        font-size: 33px;
        color: @title-color;
        font-family: 'Myriad Pro', 'Helvetica Neue', Arial, Helvetica,
          sans-serif;
        font-weight: 600;
        position: relative;
        top: 2px;
      }
    }
    .desc {
      font-size: 14px;
      color: @text-color-second;
      margin-top: 12px;
      margin-bottom: 40px;
    }
  }
  .login {
    width: 368px;
    margin: 0 auto;
    @media screen and (max-width: 576px) {
      width: 95%;
    }
    @media screen and (max-width: 320px) {
      .captcha-button {
        font-size: 14px;
      }
    }
    .icon {
      font-size: 24px;
      color: @text-color-second;
      margin-left: 16px;
      vertical-align: middle;
      cursor: pointer;
      transition: color 0.3s;

      &:hover {
        color: @primary-color;
      }
    }
  }
}
</style>
