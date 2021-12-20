<template>
  <div class="app-container">
    <el-table
      v-loading="listLoading"
      :data="orderList"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >
      <el-table-column label="订单编号" align="center">
        <template slot-scope="scope">
          {{ scope.row.orderId }}
        </template>
      </el-table-column>
      <el-table-column label="订单金额" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.orderPrice }}</span>
        </template>
      </el-table-column>
      <el-table-column label="付款时间" align="center">
        <template slot-scope="scope">
          {{ scope.row.payTime }}
        </template>
      </el-table-column>
      <el-table-column label="订单详情" align="center">
        <template slot-scope="scope">
          <el-button type="info" size="mini" @click="handleFetchOrderDetail(scope.row.orderId)">
            查看订单详情
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :visible.sync="orderDetailDialogVisible" title="订单详情">
      <el-table :data="orderDetailList" border fit highlight-current-row style="width: 100%">
        <el-table-column label="类别" align="center">
          <template slot-scope="scope">
            {{ scope.row.bookClass }}
          </template>
        </el-table-column>
        <el-table-column label="ISBN" align="center">
          <template slot-scope="scope">
            {{ scope.row.bookIsbn }}
          </template>
        </el-table-column>
        <el-table-column label="书名" align="center">
          <template slot-scope="scope">
            {{ scope.row.bookName }}
          </template>
        </el-table-column>
        <el-table-column label="封面" align="center">
          <template slot-scope="scope">
            <img :src="scope.row.bookPicUrl" alt="" height="100" width="100">
          </template>
        </el-table-column>
        <el-table-column label="单价" align="center">
          <template slot-scope="scope">
            {{ scope.row.unitPrice }}
          </template>
        </el-table-column>
        <el-table-column label="数量" align="center">
          <template slot-scope="scope">
            {{ scope.row.count }}
          </template>
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="orderDetailDialogVisible = false">返回</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getOrderList, getOrderDetailList } from '@/api/order'

export default {
  name: 'Order',
  data() {
    return {
      orderList: null,
      listLoading: true,
      orderDetailList: null,
      orderDetailDialogVisible: false
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.listLoading = true
      getOrderList().then(response => {
        this.orderList = response.data
        this.listLoading = false
      })
    },
    handleFetchOrderDetail(orderId) {
      getOrderDetailList(orderId).then(response => {
        this.orderDetailList = response.data
        this.orderDetailDialogVisible = true
      })
    }
  }
}
</script>
