<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.keyword" placeholder="请输入关键词" style="width: 200px;" class="filter-item" @keyup.enter.native="handleSearch" />
      <el-select v-model="listQuery.searchType" placeholder="搜索类型" class="filter-item" style="width: 130px">
        <el-option v-for="item in calendarTypeOptions" :key="item.key" :label="item.display_name" :value="item.key" />
      </el-select>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
      <el-popconfirm
        title="由于技术水平限制,只能下载本页，确定下载吗？"
        style="padding-left: 10px; padding-right: 10px;"
        @onConfirm="handleDownload"
      >
        <el-button
          slot="reference"
          :loading="downloadLoading"
          class="filter-item"
          type="primary"
          icon="el-icon-download"
        >
          导出
        </el-button>
      </el-popconfirm>
      <el-button :loading="listLoading" class="filter-item" type="primary" icon="el-icon-refresh" @click="flush">刷新</el-button>
      <el-button class="filter-item" type="primary" icon="el-icon-goods" @click="dialogBatchSelectVisible=true">批量选购</el-button>
    </div>

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
      max-height="680px"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" align="center" width="40" />
      <el-table-column label="ID" prop="id" sortable align="center" width="70">
        <template slot-scope="{row}">
          <span>{{ row.bookId }}</span>
        </template>
      </el-table-column>
      <el-table-column label="分类" align="center">
        <template slot-scope="{row}">
          <span>{{ row.bookClass }}</span>
        </template>
      </el-table-column>
      <el-table-column label="书名" align="center">
        <template slot-scope="{row}">
          <span style="font-weight: 900;">{{ row.bookName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="ISBN" align="center">
        <template slot-scope="{row}">
          {{ row.bookIsbn }}
        </template>
      </el-table-column>
      <el-table-column label="作者" align="center">
        <template slot-scope="{row}">
          {{ row.bookAuthor }}
        </template>
      </el-table-column>
      <el-table-column label="封面(可放大)" align="center">
        <template slot-scope="{row}">
          <el-image class="table-td-thumb" :src="row.bookPicUrl" :preview-src-list="[row.bookPicUrl]" />
        </template>
      </el-table-column>
      <el-table-column label="出版社" align="center">
        <template slot-scope="{row}">
          {{ row.bookPublisher }}
        </template>
      </el-table-column>
      <el-table-column label="出版时间" align="center">
        <template slot-scope="{row}">
          {{ row.bookDate }}
        </template>
      </el-table-column>
      <el-table-column label="简介" align="center" min-width="200">
        <template slot-scope="{row}">
          {{ row.bookIntro }}
        </template>
      </el-table-column>
      <el-table-column label="单价" align="center">
        <template slot-scope="{row}">
          {{ row.bookPrice | priceFilter }}
        </template>
      </el-table-column>
      <el-table-column label="是否已选" align="center" class-name="status-col">
        <template slot-scope="{row}">
          <el-tag :type="row.flag | statusFilter">
            {{ row.flag===1?'已选购':'未选购' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="动作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button v-if="row.flag!==1" size="mini" type="success" @click="handleModifyStatus(row,1)">选购</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.pageNum" :limit.sync="listQuery.pageSize" @pagination="getBooksByPage" />

    <el-dialog :visible.sync="dialogBatchSelectVisible" title="批量选购">
      <el-input v-model="batchBookCount" placeholder="请输入批量选购的图书数量" />
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="confirmBatchBookCount">确定</el-button>
        <el-button type="info" @click="dialogBatchSelectVisible = false">取消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import { searchBook, getAllBooksCount, getPageBook } from '@/api/book'
import { addCartBook, addBatchBooks } from '@/api/cart'

const calendarTypeOptions = [
  { key: 'allTypes', display_name: '全部' },
  { key: 'bookName', display_name: '书名' },
  { key: 'bookAuthor', display_name: '作者' },
  { key: 'bookClass', display_name: '类别' },
  { key: 'bookPublisher', display_name: '出版社' }
]

export default {
  name: 'BookTable',
  components: { Pagination },
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
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        pageNum: 1,
        pageSize: 10,
        keyword: null,
        searchType: 'bookName'
      },
      calendarTypeOptions,
      multipleSelectionList: [],
      batchBookCount: 1,
      dialogBatchSelectVisible: false,
      downloadLoading: false
    }
  },
  created() {
    this.flush()
  },
  methods: {
    // 分页获取图书
    getBooksByPage(pageParam) {
      this.listLoading = true
      getPageBook(pageParam.pageNum, pageParam.pageSize).then(res => {
        this.list = res.data
        // this.list.splice(0, this.list.length, res.data)
        this.listLoading = false
      })
    },
    // 刷新
    flush() {
      this.listQuery.pageNum = 1
      getAllBooksCount().then(res => {
        this.total = res.data
      })
      this.getBooksByPage({ 'pageNum': this.listQuery.pageNum, 'pageSize': this.listQuery.pageSize })
    },
    // 模糊查询
    handleSearch() {
      if (this.listQuery.keyword === null || this.listQuery.keyword === '') {
        this.flush()
      } else {
        searchBook(this.listQuery.keyword, this.listQuery.searchType).then(res => {
          this.list = res.data
          this.total = this.list.length
          this.listQuery.pageNum = 1
        })
      }
    },
    // 更改是否已选购状态
    handleModifyStatus(row, status) {
      // 这里选购1本，数量再在选购列表里调整
      addCartBook(row.bookId, 1).then(res => {
        this.$message({
          message: '已选购',
          type: 'success'
        })
        row.flag = status
      })
    },
    // 多选状态改变，element ui里的回调
    handleSelectionChange(val) {
      this.multipleSelectionList = []
      val.forEach(row => {
        this.multipleSelectionList.push(row.bookId)
      })
    },
    // 确认批量选购数量
    confirmBatchBookCount() {
      if (this.multipleSelectionList.length === 0) {
        this.$message.error('未选择图书')
        return
      }
      const bookList = []
      this.multipleSelectionList.forEach(bookId => {
        bookList.push({ 'bookId': bookId, 'bookCount': parseInt(this.batchBookCount) })
      })
      addBatchBooks(bookList).then(res => {
        this.$message.success('批量添加成功！')
        this.dialogBatchSelectVisible = false
        this.multipleSelectionList = []
        this.batchBookCount = 1
      })
    },
    // 导出excel
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['ID', '分类', '书名', 'ISBN', '作者', '封面图片URL', '出版社', '出版时间', '简介', '单价(元)', '是否已选']
        const filterVal = ['bookId', 'bookClass', 'bookName', 'bookIsbn', 'bookAuthor', 'bookPicUrl',
          'bookPublisher', 'bookDate', 'bookIntro', 'bookPrice', 'flag']
        const data = this.formatJson(filterVal)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: 'book-list'
        })
        this.downloadLoading = false
      })
    },
    // 将表格中数据转为Json
    formatJson(filterVal) {
      return this.list.map(v => filterVal.map(j => {
        if (j === 'flag') {
          return v[j] === 1 ? '是' : '否'
        } else {
          return v[j]
        }
      }))
    }
  }
}
</script>
