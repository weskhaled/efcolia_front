<template>
  <a-card
    hoverable
    class="w-full user-card"
    size="small"
    :bodyStyle="{ padding: '.5rem .5rem' }"
    :class="user.selected ? 'bg-blue-200' : ''"
  >
    <a-card-meta
      class="flex"
      :title="user.firstname"
      :description="user.lastname"
      @click.stop="$emit('select', user)"
    >
      <div slot="avatar" class="self-center">
        <a-button
          size="small"
          type="primary"
          shape="circle"
          :icon="showInfos ? 'minus' : 'plus'"
          class="self-center"
          @click.stop="showInfos = !showInfos"
        />
      </div>
    </a-card-meta>
    <div
      class="bg-white mt-1 border-t p-2 bg-opacity-50"
      :class="showInfos ? 'block' : 'hidden'"
      style="margin: 0.5rem -.5rem -.5rem -.5rem;"
    >
      <div>
        <div class="flex items-stretch">
          <div
            class="flex self-center flex-0 mr-2 pr-1 border-gray-400 border-r h-100"
          >
            <a-icon
              type="flag"
              class="self-center"
              :style="{ fontSize: '18px', color: '#08c' }"
            >
            </a-icon>
          </div>
          <div class="self-center flex-auto text-left">
            <div>
              {{ 'user.appsource' }}
              <span class="float-right">{{ 'user.latitude' }}</span>
            </div>
            <div>
              {{ 'user.deviceport'}}
              <span class="float-right">{{ 'user.longitude' }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </a-card>
</template>

<script>
import { format } from 'date-fns'

export default {
  name: 'UserCard',
  props: {
    user: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      showInfos: false,
    }
  },
  methods: {
    formatDate: (date = new Date(), formatDate = 'yyyy-MM-dd HH:mm:ss') => {
      return format(date, formatDate)
    },
  },
}
</script>

<style lang="less" scoped>
.user-card .ant-card-actions li > span > span {
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.battery {
  display: block;
  position: relative;
  margin: 2px auto;
  width: calc(20px);
  color: #00ff6d;
  /* border: calc(1px) solid currentColor; */
  height: calc(10px);
  border-radius: 1px;
  box-shadow: 0px 0px 0px 1px currentColor;
  &:before {
    content: '';
    width: var(--battery-level);
    height: calc(100%);
    left: 0;
    top: 0;
    background: currentColor;
    position: absolute;
    border-radius: 0;
  }
  &:after {
    content: '';
    position: absolute;
    margin-right: calc(-4px);
    right: 0;
    top: 2px;
    width: calc(2px);
    height: calc(100% - 4px);
    background: currentColor;
    border-bottom-right-radius: calc(5px);
    border-top-right-radius: calc(5px);
  }
  &.low {
    color: rgb(255, 38, 0);
  }
}
</style>
