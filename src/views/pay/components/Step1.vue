<template>
  <div>
    <el-form ref="form" :model="form" :rules="rules" label-width="120px">
      <el-form-item label-width="0">
        <el-alert show-icon>请务必仔细填写并核对</el-alert>
      </el-form-item>
      <el-form-item label="订单编号" prop="orderId">
        <el-input v-model="orderId" />
      </el-form-item>
      <el-form-item label="收款账户" prop="gatheringAccount">
        <el-input v-model="form.gatheringAccount" disabled />
      </el-form-item>
      <el-form-item label="收款人姓名" prop="gatheringName">
        <el-input v-model="form.gatheringName" disabled />
      </el-form-item>
      <el-form-item label="转账金额" prop="price">
        <el-input v-model="price" disabled />
      </el-form-item>
      <el-form-item label="付款账户" prop="payAccount">
        <el-input v-model="form.payAccount" />
      </el-form-item>
    </el-form>
    <div class="pay-button-group">
      <el-button type="primary" @click="handleSubmit">下一步</el-button>
    </div>
  </div>
</template>
<script>
export default {
  name: 'Step1',
  props: {
    price: {
      type: Number,
      required: true
    },
    orderId: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      form: {
        payAccount: '',
        gatheringAccount: '873406454@qq.com',
        gatheringName: 'lhf'
      },
      rules: {
        payAccount: [
          { required: true, message: '请选择付款账户', trigger: 'blur' }
        ]
        // gatheringAccount: [
        //   { required: true, message: '请输入收款账户', trigger: 'blur' },
        //   { type: 'email', message: '账户名应为邮箱格式', trigger: 'blur' }
        // ],
        // gatheringName: [
        //   { required: true, message: '请输入收款人姓名', trigger: 'blur' }
        // ],
        // price: [
        //   { required: true, message: '请输入转账金额', trigger: 'blur' },
        //   { pattern: /^(\d+)((?:\.\d+)?)$/, message: '请输入合法金额数字' }
        // ]
      }
    }
  },
  methods: {
    handleSubmit() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.form['price'] = this.price
          this.form['orderId'] = this.orderId
          this.$emit('change-step', 2, this.form)
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.pay-button-group {
  display: block;
  margin: 20px auto;
  text-align: center;
}
</style>
