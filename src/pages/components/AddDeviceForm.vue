<template>
  <a-form-model
    ref="ruleForm"
    :model="form"
    :rules="rules"
    :label-col="labelCol"
    :wrapper-col="wrapperCol"
  >
    <a-form-model-item ref="name" label="Device name" prop="name">
      <a-input
        v-model="form.name"
        @blur="
          () => {
            $refs.name.onFieldBlur()
          }
        "
      />
    </a-form-model-item>
    <a-form-model-item label="Device type" prop="type">
      <a-select
        v-model="form.type"
        placeholder="please select your device type"
      >
        <a-select-option value="type1">
          Type one
        </a-select-option>
        <a-select-option value="type2">
          Type two
        </a-select-option>
      </a-select>
    </a-form-model-item>
    <a-form-model-item label="Device subType" prop="subtype">
      <a-select
        v-model="form.subtype"
        placeholder="please select your device subtype"
      >
        <a-select-option value="subtype1">
          subtype one
        </a-select-option>
        <a-select-option value="subtype2">
          subtype two
        </a-select-option>
      </a-select>
    </a-form-model-item>
    <a-form-model-item label="Activity time" required prop="date1">
      <a-date-picker
        v-model="form.date1"
        show-time
        type="date"
        placeholder="Pick a date"
        style="width: 100%;"
      />
    </a-form-model-item>
    <a-form-model-item label="Instant delivery" prop="delivery">
      <a-switch v-model="form.delivery" />
    </a-form-model-item>
    <a-form-model-item label="Activity type" prop="type1">
      <a-checkbox-group v-model="form.type1">
        <a-checkbox value="1" name="type1">
          Online
        </a-checkbox>
        <a-checkbox value="2" name="type1">
          Promotion
        </a-checkbox>
        <a-checkbox value="3" name="type1">
          Offline
        </a-checkbox>
      </a-checkbox-group>
    </a-form-model-item>
    <a-form-model-item label="Resources" prop="resource">
      <a-radio-group v-model="form.resource">
        <a-radio value="1">
          Sponsor
        </a-radio>
        <a-radio value="2">
          Venue
        </a-radio>
      </a-radio-group>
    </a-form-model-item>
    <a-form-model-item label="Activity form" prop="desc">
      <a-input v-model="form.desc" type="textarea" />
    </a-form-model-item>
    <a-form-model-item :wrapper-col="{ span: 14, offset: 4 }">
      <a-button type="primary" @click="onSubmit">
        Create
      </a-button>
      <a-button style="margin-left: 10px;" @click="resetForm">
        Reset
      </a-button>
    </a-form-model-item>
  </a-form-model>
</template>
<script>
export default {
  name: 'AddDeviceForm',
  props: {
    device: {
      type: Object,
      required: false,
      default: () => ({}),
    },
  },
  data() {
    return {
      labelCol: { span: 9 },
      wrapperCol: { span: 14 },
      other: '',
      form: {
        name: '',
        type: undefined,
        subtype: undefined,
        date1: undefined,
        delivery: false,
        type1: [],
        resource: '',
        desc: '',
      },
      rules: {
        name: [
          {
            required: true,
            message: 'Please input Activity name',
            trigger: 'blur',
          },
          {
            min: 3,
            max: 5,
            message: 'Length should be 3 to 5',
            trigger: 'blur',
          },
        ],
      },
    }
  },
  methods: {
    onSubmit() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          alert('submit!')
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetForm() {
      this.$refs.ruleForm.resetFields()
    },
  },
}
</script>

<style lang="less" scoped></style>
