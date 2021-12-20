<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
import echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
import resize from './mixins/resize'
import { getOrderList } from '@/api/dashboard'

const animationDuration = 6000

export default {
  mixins: [resize],
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '300px'
    }
  },
  data() {
    return {
      chart: null
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.initChart()
    })
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    initChart() {
      this.chart = echarts.init(this.$el, 'macarons')

      getOrderList().then(res => {
        const orderList = res.data
        const countList = Array(7).fill(0)
        const priceList = Array(7).fill(0)
        for (const order of orderList) {
          const index = new Date(order['payTime']).getDay()
          countList[index] += 1
          priceList[index] += order['orderPrice']
        }
        this.chart.setOption({
          tooltip: {
            trigger: 'axis',
            axisPointer: { // 坐标轴指示器，坐标轴触发有效
              type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
            }
          },
          grid: {
            top: 10,
            left: '2%',
            right: '2%',
            bottom: '3%',
            containLabel: true
          },
          xAxis: [{
            type: 'category',
            data: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'],
            axisTick: {
              alignWithLabel: true
            }
          }],
          yAxis: [{
            type: 'value',
            axisTick: {
              show: false
            }
          }],
          series: [{
            name: '采购总价',
            type: 'bar',
            stack: 'order',
            barWidth: '60%',
            data: priceList,
            animationDuration
          }, {
            name: '采购单数',
            type: 'bar',
            stack: 'order',
            barWidth: '60%',
            data: countList,
            animationDuration
          }
            //   {
            //   name: 'pageC',
            //   type: 'bar',
            //   stack: 'vistors',
            //   barWidth: '60%',
            //   data: [30, 52, 200, 334, 390, 330, 220],
            //   animationDuration
            // }
          ]
        })
      })
    }
  }
}
</script>
