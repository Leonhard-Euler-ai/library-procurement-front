<template>
  <div class="pay-container">
    <el-row :gutter="20">
      <el-col
        :xs="24"
        :sm="{ span: 20, offset: 2 }"
        :md="{ span: 20, offset: 2 }"
        :lg="{ span: 14, offset: 5 }"
        :xl="{ span: 12, offset: 6 }"
      >
        <el-steps :space="200" :active="active" align-center class="steps">
          <el-step title="填写转账信息" />
          <el-step title="确认转账信息" />
          <el-step title="完成" />
        </el-steps>
        <step1 v-if="active === 1" :price="price" :order-id="orderId" @change-step="handleSetStep" />
        <step2 v-if="active === 2" :info-data="form" @change-step="handleSetStep" />
        <step3 v-if="active === 3" :info-data="form" @change-step="handleSetStep" />
      </el-col>
    </el-row>
  </div>
</template>

<script>
import Step1 from './components/Step1'
import Step2 from './components/Step2'
import Step3 from './components/Step3'
export default {
  name: 'Pay',
  components: { Step1, Step2, Step3 },
  data() {
    return {
      active: 1,
      form: {},
      price: null,
      orderId: null
    }
  },
  created() {
    this.price = parseInt(this.$route.query.price)
    this.orderId = parseInt(this.$route.query.orderId)
  },
  methods: {
    handleSetStep(active, form) {
      this.active = active
      if (form) this.form = Object.assign(this.form, form)
    }
  }
}
</script>

<style lang="scss" scoped>
  .pay-container {
    .steps {
      justify-content: center;
      margin-bottom: 20px;
    }
  }
</style>
