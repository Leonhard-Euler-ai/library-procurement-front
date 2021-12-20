<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
import echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
import resize from './mixins/resize'
import { Random } from '@/utils'
import { getBookCountPerClass } from '@/api/dashboard'

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
      default: '350px'
    },
    autoResize: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      chart: null,
      chartData: {
        'classList': [],
        'borrowList': [],
        'procureList': []
      }
    }
  },
  watch: {
    chartData: {
      deep: true,
      handler(val) {
        this.setOptions(val)
      }
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
      getBookCountPerClass().then(res => {
        const countPerClass = res.data
        const classList = Object.getOwnPropertyNames(countPerClass)
        const borrowList = []
        const procureList = []
        for (const key of classList) {
          procureList.push(countPerClass[key])
          borrowList.push(Math.round(
            (Random(-100, 100) / 100 + 1) * countPerClass[key]
          ))
        }
        this.chartData['classList'] = classList
        this.chartData['borrowList'] = borrowList
        this.chartData['procureList'] = procureList
        this.setOptions(this.chartData)
      })
    },
    setOptions({ classList, borrowList, procureList } = {}) {
      this.chart.setOption({
        xAxis: {
          data: classList,
          boundaryGap: false,
          axisTick: {
            show: false
          }
        },
        grid: {
          left: 10,
          right: 10,
          bottom: 20,
          top: 30,
          containLabel: true
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross'
          },
          padding: [5, 10]
        },
        yAxis: {
          axisTick: {
            show: false
          }
        },
        legend: {
          data: ['借阅量', '采购量']
        },
        series: [{
          name: '借阅量', itemStyle: {
            normal: {
              color: '#FF005A',
              lineStyle: {
                color: '#FF005A',
                width: 2
              }
            }
          },
          smooth: true,
          type: 'line',
          data: borrowList,
          animationDuration: 2800,
          animationEasing: 'cubicInOut'
        },
        {
          name: '采购量',
          smooth: true,
          type: 'line',
          itemStyle: {
            normal: {
              color: '#3888fa',
              lineStyle: {
                color: '#3888fa',
                width: 2
              },
              areaStyle: {
                color: '#f3f8ff'
              }
            }
          },
          data: procureList,
          animationDuration: 2800,
          animationEasing: 'quadraticOut'
        }]
      })
    }
  }
}

</script>
