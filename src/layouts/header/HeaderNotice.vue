<template>
  <a-dropdown :trigger="['click']" v-model="show">
    <div slot="overlay">
      <a-spin :spinning="loading">
        <a-tabs class="dropdown-tabs" :tabBarStyle="{textAlign: 'center'}" :style="{width: '297px'}">
          <a-tab-pane :tab="$t('notice')" key="1">
            <a-list class="tab-pane">
              <a-list-item>
                <a-list-item-meta title="You received 14 new weekly reports" description="a minute ago">
                  <a-avatar style="background-color: white" slot="avatar" src="https://gw.alipayobjects.com/zos/rmsportal/ThXAXghbEsBCCSDihZxY.png"/>
                </a-list-item-meta>
              </a-list-item>
              <a-list-item>
                <a-list-item-meta title="Your recommended Qu Nini has passed the third round of interviews" description="a year ago">
                  <a-avatar style="background-color: white" slot="avatar" src="https://gw.alipayobjects.com/zos/rmsportal/OKJXDXrmkNshAMvwtvhu.png"/>
                </a-list-item-meta>
              </a-list-item>
              <a-list-item>
                <a-list-item-meta title="This template can distinguish multiple notification types" description="a year ago">
                  <a-avatar style="background-color: white" slot="avatar" src="https://gw.alipayobjects.com/zos/rmsportal/kISTdvpyTAhtGxpovNWd.png"/>
                </a-list-item-meta>
              </a-list-item>
            </a-list>
          </a-tab-pane>
          <a-tab-pane :tab="$t('news')" key="2">
            <a-list class="tab-pane"></a-list>
          </a-tab-pane>
          <a-tab-pane :tab="$t('upcoming')" key="3">
            <a-list class="tab-pane"></a-list>
          </a-tab-pane>
        </a-tabs>
      </a-spin>
    </div>
    <span @click="fetchNotice" class="header-notice">
      <a-badge class="notice-badge" count="12">
        <a-icon :class="['header-notice-icon']" type="bell" />
      </a-badge>
    </span>
  </a-dropdown>
</template>

<script>
export default {
  name: 'HeaderNotice',
  i18n: require('./i18n'),
  data () {
    return {
      loading: false,
      show: false
    }
  },
  computed: {
  },
  methods: {
    fetchNotice () {
      if (this.loading) {
        this.loading = false
        return
      }
      this.loadding = true
      setTimeout(() => {
        this.loadding = false
      }, 1000)
    }
  }
}
</script>

<style lang="less">
  .header-notice{
    display: inline-block;
    transition: all 0.3s;
    span {
      vertical-align: initial;
    }
    .notice-badge{
      color: inherit;
      .header-notice-icon{
        font-size: 16px;
        padding: 4px;
      }
    }
  }
  .dropdown-tabs{
    background-color: @base-bg-color;
    box-shadow: 0 2px 8px @shadow-color;
    border-radius: 4px;
    .tab-pane{
      padding: 0 24px 12px;
      min-height: 250px;
    }
  }
  body.header-fixed .ant-dropdown.ant-dropdown-placement-bottomRight {
    position: fixed;
    top: 4.2rem!important;
  }
</style>
