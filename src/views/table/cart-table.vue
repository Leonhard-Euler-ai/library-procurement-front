<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button :loading="listLoading" class="filter-item" type="primary" icon="el-icon-refresh" @click="flush">刷新</el-button>
      <el-button class="filter-item" type="danger" icon="el-icon-delete" @click="handleClearCart">清空</el-button>
      <el-button class="filter-item" type="warning" icon="el-icon-sold-out" @click="handlePay">支付下单</el-button>
    </div>

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" align="center" width="40" />
      <el-table-column label="封面(可放大)" align="center">
        <template slot-scope="{row}">
          <el-image class="table-td-thumb" :src="row.bookPicUrl" :preview-src-list="[row.bookPicUrl]" />
        </template>
      </el-table-column>
      <el-table-column label="书名" align="center">
        <template slot-scope="{row}">
          <span style="font-weight: 900;">{{ row.bookName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="作者" align="center">
        <template slot-scope="{row}">
          {{ row.bookAuthor }}
        </template>
      </el-table-column>
      <el-table-column label="单价" align="center">
        <template slot-scope="{row}">
          {{ row.bookPrice | priceFilter }}
        </template>
      </el-table-column>
      <el-table-column label="数量" align="center" min-width="50px">
        <template slot-scope="{row}">
          <template v-if="row.edit">
            <div style="display: flex">
              <el-input v-model="row.bookCount" style="padding-right: 5px;" size="small" />
              <el-button class="cancel-btn" size="small" icon="el-icon-refresh" type="warning" @click="cancelEdit(row)">取消</el-button>
            </div>
          </template>
          <span v-else>{{ row.bookCount }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="{row}">
          <el-button v-if="row.edit" type="success" size="small" icon="el-icon-circle-check-outline" @click="confirmEdit(row)">确定</el-button>
          <el-button v-else type="primary" round size="small" icon="el-icon-edit" @click="row.edit=!row.edit">调整</el-button>
          <el-button type="danger" round size="small" icon="el-icon-delete" @click="handleDeleteBook(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { getCartBookList, deleteCartBook, resetCartBookCount, clearCart } from '@/api/cart'
import { generateOrder } from '@/api/order'

export default {
  name: 'BookTable',
  filters: {
    statusFilter(status) {
      const statusMap = {
        1: 'success',
        0: 'info'
      }
      return statusMap[status]
    },
    priceFilter(price) {
      return price + ' 元'
    }
  },
  data() {
    return {
      tableKey: 1,
      list: null,
      listLoading: true,
      multipleSelectionList: []
    }
  },
  created() {
    this.flush()
  },
  methods: {
    // 获取已选购的图书列表
    getList() {
      this.listLoading = true
      getCartBookList().then(res => {
        this.list = res.data.map(cartBook => {
          this.$set(cartBook, 'edit', false)
          cartBook.originalBookCount = cartBook.bookCount
          return cartBook
        })
        this.listLoading = false
      })
    },
    // 刷新
    flush() {
      this.getList()
    },
    cancelEdit(row) {
      row.bookCount = row.originalBookCount
      row.edit = false
      this.$message({
        message: '数量重设取消',
        type: 'warning'
      })
    },
    confirmEdit(row) {
      resetCartBookCount(row.bookId, row.bookCount).then(res => {
        row.originalBookCount = row.bookCount
        row.edit = false
        this.$notify({
          title: '调整',
          message: '数量更新成功',
          type: 'success'
        })
      })
    },
    handleDeleteBook(row) {
      this.$confirm('确定删除该图书?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteCartBook(row.bookId).then(res => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this.flush()
        })
      }).catch(() => {
      })
    },
    handleClearCart() {
      if (this.list.length === 0) {
        this.$message.info('暂无选购图书')
        return
      }
      this.$confirm('此操作无法恢复，确定清空所有已选购图书?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'error'
      }).then(() => {
        clearCart().then(res => {
          this.$message({
            type: 'success',
            message: '清空成功!'
          })
          this.flush()
        })
      }).catch(() => {
      })
    },
    handleSelectionChange(val) {
      this.multipleSelectionList = []
      val.forEach(row => {
        this.multipleSelectionList.push({ 'bookId': row.bookId, 'bookCount': row.bookCount })
      })
    },
    handlePay() {
      if (this.multipleSelectionList.length === 0) {
        this.$message.error('请选择购买的图书！')
        return
      }
      generateOrder(this.multipleSelectionList).then(res => {
        this.$router.push('/pay?price=' + res.data.orderPrice + '&orderId=' + res.data.orderId)
      })
    }
  }
}
</script>
