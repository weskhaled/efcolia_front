<template>
  <a-card
    hoverable
    class="w-full"
    :bodyStyle="{ padding: '.5rem .5rem' }"
    :class="!!selected ? 'bg-blue-200' : ''"
  >
    <a-card-meta
      class="flex"
      :title="client.title"
      @click.stop="$emit('select', client)"
    >
    </a-card-meta>
    <template slot="actions" class="ant-card-actions">
      <a-icon key="edit" type="edit" />
      <a-popconfirm
        title="Are you sure delete this client ?"
        ok-text="Yes"
        cancel-text="No"
        @confirm="$emit('delete', client)"
      >
        <a-icon key="delete" type="delete" />
      </a-popconfirm>
    </template>
  </a-card>
</template>

<script>
export default {
  name: 'ClientCard',
  props: {
    client: {
      type: Object,
      required: true,
    },
    selected: {
      type: [Boolean],
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
