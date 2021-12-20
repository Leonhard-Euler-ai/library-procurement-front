<template>
  <div class="dashboard-container">
    <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
      <line-chart />
    </el-row>
    <el-row :gutter="32">
      <el-col :xs="24" :sm="24" :lg="8">
        <div class="chart-wrapper">
          <pie-chart />
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="8">
        <div class="chart-wrapper">
          <bar-chart />
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="8">
        <box-card />
      </el-col>
    </el-row>
  </div>
</template>

<script>
import BarChart from './components/BarChart'
import PieChart from './components/PieChart'
import LineChart from './components/LineChart'
import BoxCard from './components/BoxCard'

export default {
  name: 'Dashboard',
  components: {
    BarChart,
    PieChart,
    LineChart,
    BoxCard
  }
}
</script>

<style lang="scss" scoped>
.dashboard-container {
  padding: 32px;
  background-color: rgb(240, 242, 245);
  position: relative;

  .chart-wrapper {
    background: #fff;
    padding: 16px 16px 0;
    margin-bottom: 32px;
  }
}

@media (max-width:1024px) {
  .chart-wrapper {
    padding: 8px;
  }
}
</style>
