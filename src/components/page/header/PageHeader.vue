<template>
  <div :class="['page-header print:hidden', layout, pageWidth]">
    <div class="page-header-wide">
      <div class="detail">
        <div class="main">
          <div class="row">
            <h1 v-if="showPageTitle && title" class="title">{{ title }}</h1>
            <div class="action"><slot name="action"></slot></div>
          </div>
          <div class="row">
            <div
              v-if="this.$slots.extra"
              class="extra md:flex-1 w-full md:w-2/2 md:max-w-lg mx-auto"
            >
              <slot name="extra"></slot>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'PageHeader',
  props: {
    title: {
      type: [String, Boolean],
      required: false,
    },
    breadcrumb: {
      type: Array,
      required: false,
    },
    logo: {
      type: String,
      required: false,
    },
    avatar: {
      type: String,
      required: false,
    },
  },
  computed: {
    ...mapState('setting', ['layout', 'showPageTitle', 'pageWidth']),
  },
}
</script>

<style lang="less" scoped>
@import 'index';
</style>
