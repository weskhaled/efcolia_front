<template>
  <common-layout>
    <div class="top">
      <div class="header mb-4">
        <img alt="logo" class="logo inline-block" src="@/assets/img/logo.png" />
      </div>
    </div>
    <div class="login">
      <h2 class="text-center my-3 text-xl">Reset Password</h2>
      <a-alert
        type="error"
        :closable="true"
        v-show="error"
        :message="error"
        showIcon
        style="margin-bottom: 24px;"
      />
      <a-form @submit="onSubmit" :form="formReset">
        <a-form-item label="New Password" has-feedback>
          <a-input
            size="large"
            v-decorator="[
              'password',
              {
                rules: [
                  {
                    required: true,
                    message: 'Please input your password!',
                  },
                  {
                    validator: validateToNextPassword,
                  },
                ],
              },
            ]"
            type="password"
          />
        </a-form-item>
        <a-form-item label="Confirm New Password" has-feedback>
          <a-input
            size="large"
            v-decorator="[
              'confirm',
              {
                rules: [
                  {
                    required: true,
                    message: 'Please confirm your password!',
                  },
                  {
                    validator: compareToFirstPassword,
                  },
                ],
              },
            ]"
            type="password"
            @blur="handleConfirmBlur"
          />
        </a-form-item>
        <a-form-item>
          <a-button
            :loading="resetting"
            style="width: 100%;margin-top: 24px"
            size="large"
            htmlType="submit"
            type="primary"
          >Reset</a-button>
        </a-form-item>
      </a-form>
    </div>
  </common-layout>
</template>

<script>
import CommonLayout from '@/layouts/CommonLayout'
// import { request, METHOD } from '@/utils/request'
// import { loadRoutes } from '@/utils/routerUtil'
// const BASE_URL = process.env.VUE_APP_API_BASE_URL

export default {
  name: 'ResetPassword',
  components: { CommonLayout },
  data() {
    return {
      resetting: false,
      error: '',
      formReset: this.$form.createForm(this),
      errorResetPassword: '',
      email: ''
    }
  },
  computed: {
  },
  mounted() {
    this.email = this.$route.query.email
    if (!this.email) {
      this.$message.error('email invalid')
      this.$router.push('/')
    }
  },
  methods: {
    handleConfirmBlur(e) {
      const value = e.target.value;
      this.confirmDirty = this.confirmDirty || !!value;
    },
    compareToFirstPassword(rule, value, callback) {
      const form = this.formReset;
      if (value && value !== form.getFieldValue('password')) {
        callback('Two passwords that you enter is inconsistent!');
      } else {
        callback();
      }
    },
    validateToNextPassword(rule, value, callback) {
      const form = this.formReset;
      if (value && this.confirmDirty) {
        form.validateFields(['confirm'], { force: true });
      }
      callback();
    },
    onSubmit(e) {
      e.preventDefault()
      this.formReset.validateFields((err) => {
        if (!err) {
          this.resetting = true
          const newPassword = this.formReset.getFieldValue('newPassword')
          console.log(newPassword)
        }
      })
    }
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
        font-family: "Myriad Pro", "Helvetica Neue", Arial, Helvetica,
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
