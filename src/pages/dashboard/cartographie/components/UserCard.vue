<template>
  <a-card
    hoverable
    class="w-full user-card"
    size="small"
    :bodyStyle="{ padding: '.5rem .5rem' }"
    :class="user.selected ? 'bg-blue-200' : ''"
  >
    <div slot="title" @click.stop="$emit('select', user)">
      {{ user.lastname || '' }}
    </div>
    <template
      slot="extra"
      v-if="checkUserHasPermission(currUser.permissions, 'user', 'd')"
    >
      <a-popconfirm
        title="Are you sure delete this user ?"
        ok-text="Yes"
        cancel-text="No"
        @confirm="$emit('delete', user)"
      >
        <a-icon key="delete" type="delete" />
      </a-popconfirm>
    </template>
    <a-card-meta v-if="user.firstname" class="flex" :title="user.firstname" @click.stop="$emit('select', user)"/>
  </a-card>
</template>

<script>
import { format } from 'date-fns'
import { mapState } from 'vuex'

const checkUserHasPermission = (permissions, objectType, permission) =>
  permissions.find((p) => p.objecttype === objectType) &&
  permissions
    .find((p) => p.objecttype === objectType)
    .permission?.indexOf(permission) !== -1

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
  computed: {
    ...mapState('account', { currUser: 'user' }),
  },
  methods: {
    checkUserHasPermission,
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
