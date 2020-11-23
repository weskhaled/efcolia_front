<template>
  <a-card
    hoverable
    class="w-full"
    :bodyStyle="{ padding: '.5rem .5rem' }"
    :class="alert.selected ? 'bg-blue-200' : ''"
  >
    <a-card-meta
      class="flex"
      :title="alert.name"
      @click.stop="$emit('select', alert)"
    >
      <div slot="avatar" class="self-center">
        <a-badge color="orange" />
      </div>
    </a-card-meta>
    <template slot="actions" class="ant-card-actions">
      <a-icon key="edit" type="edit" />
      <a-popconfirm
        title="Are you sure delete this alert?"
        ok-text="Yes"
        cancel-text="No"
        @confirm="$emit('delete', alert)"
      >
        <a-icon key="delete" type="delete" />
      </a-popconfirm>
    </template>
  </a-card>
</template>

<script>
export default {
  name: 'DeviceAlertCard',
  props: {
    alert: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      showInfos: false,
    }
  }
}
</script>

<style lang="less" scoped></style>
