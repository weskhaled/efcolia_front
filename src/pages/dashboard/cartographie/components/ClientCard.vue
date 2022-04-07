<template>
  <a-card
    hoverable
    class="w-full"
    :bodyStyle="{ padding: '.5rem .5rem' }"
    :class="!!selected ? 'bg-blue-200' : ''"
  >
    <div slot="title" @click.stop="$emit('select', client)">
      {{ client.commercialname || '' }}
    </div>
    <template
      slot="extra"
      v-if="checkUserHasPermission(currUser.permissions, 'company', 'd')"
    >
      <a-popconfirm
        title="Vous êtes sûr de supprimer ce client ?"
        ok-text="Oui"
        cancel-text="Non"
        @confirm="$emit('delete', client)"
      >
        <a-icon key="delete" type="delete" />
      </a-popconfirm>
    </template>
    <a-card-meta
      v-if="client.description"
      :title="client.description"
      @click.stop="$emit('select', client)"
    />
  </a-card>
</template>

<script>
import { mapState } from 'vuex'

const checkUserHasPermission = (permissions, objectType, permission) =>
  permissions.find((p) => p.objecttype === objectType) &&
  permissions
    .find((p) => p.objecttype === objectType)
    .permission?.indexOf(permission) !== -1

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
  },
  computed: {
    ...mapState('account', { currUser: 'user' }),
  },
  methods: {
    checkUserHasPermission,
  },
}
</script>

<style lang="less" scoped></style>
