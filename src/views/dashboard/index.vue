<template>
  <div class="dashboard-container">
    <div class="on-dashboard-wrapper">
      <div>
        <h1>One Belt, One Road</h1>
        <p>Thoughts, stories and ideas.</p>
        <p>
          <el-button type="info">写文章</el-button>
        </p>
      </div>
    </div>
    <div class="dashboard-content">
      <div class="statistics">
        <div class="panel panel-default">
          <div class="panel-heading">
            <h3 class="panel-title">站点内容统计：</h3>
          </div>
          <ul class="list-group">
            <li class="list-group-item"><strong>{{ contentStatistics.countArticle.article }}</strong>篇文章（<strong>{{ contentStatistics.countArticle.draft }}</strong>篇草稿）
            </li>
            <li class="list-group-item"><strong>{{ contentStatistics.classifyCount.count }}</strong>个分类</li>
            <li class="list-group-item"><strong>{{ contentStatistics.comment.commentCount }}</strong>条评论（<strong>{{ contentStatistics.comment.toAudit }}</strong>条待审核）
            </li>
          </ul>
        </div>
      </div>
      <div id="myChart">
        <div class="box2" />
      </div>
    </div>
  </div>
</template>

<script>

import { DeepCopy } from '../../utils/tool'
import { getContent } from '../../api/dashboard'

export default {
  name: 'Dashboard',
  data() {
    return {
      option: {
        title: {
          text: '站点内容统计',
          x: 'left'
        },
        tooltip: {
          trigger: 'item'
        },
        legend: {
          type: 'scroll',
          orient: 'vertical',
          right: 10,
          top: 20,
          bottom: 20,
          data: ['文章', '分类', '评论'],
          selected: {
            '文章': true,
            '分类': true,
            '评论': true
          }
        },
        series: [
          {
            name: '统计',
            type: 'pie',
            radius: '65%',
            center: ['40%', '50%'],
            data: [
              { name: '文章', value: 0 },
              { name: '分类', value: 0 },
              { name: '评论', value: 0 }
            ],
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      },
      contentStatistics: {
        countArticle: {
          article: 0,
          draft: 0
        },
        classifyCount: { count: 0 },
        comment: {
          commentCount: 0,
          toAudit: 0
        }
      }
    }
  },
  async  created() {
    // 获取站点统计类容
    await getContent().then(res => {
      console.log('res：', res)
      const contentStatistics = res.data.contentStatistics
      Object.keys(this.contentStatistics).forEach(key => {
        console.log('key：', key)
        // eslint-disable-next-line no-undef
        this.contentStatistics[key] = DeepCopy(contentStatistics[key])
      })
    })
    console.log('this.contentStatistics：', this.contentStatistics)
    this.$nextTick(() => {
      this.drawLine()
    })
  },
  methods: {
    drawLine() {
      const $ = document.querySelectorAll.bind(document)
      const oRight = $('.box2')[0]
      console.log('this.contentStatistics.countArticle.article：', this.contentStatistics)
      this.option.series[0].data[0].value = this.contentStatistics.countArticle.article
      this.option.series[0].data[1].value = this.contentStatistics.classifyCount.count
      this.option.series[0].data[2].value = this.contentStatistics.comment.commentCount
      const chart = this.$echarts.init(oRight)
      chart.setOption(this.option)
      // let oRight = $(".box2")[0]
      // let datas = [
      //   {
      //     name: "文章",
      //     value: 1675,
      //     citys: [
      //       {name: "长沙", value: 816},
      //       {name: "潭州", value: 435},
      //       {name: "桃园", value: 424}
      //     ]
      //   },
      //   {
      //     name: "山东",
      //     value: 1354,
      //     citys: [
      //       {name: "济南", value: 615},
      //       {name: "临沂", value: 443},
      //       {name: "德州", value: 296}
      //     ]
      //   },
      //   {
      //     name: "东北",
      //     value: 374,
      //     citys: [
      //       {name: "黑龙江", value: 112},
      //       {name: "牡丹江", value: 65},
      //       {name: "漠河", value: 197}
      //     ]
      //   }
      // ]
      // 左边——省份
      // let option = {
      //   title: {
      //     text: "站点统计"
      //   },
      //   series: [
      //     {
      //       name: "省数据",
      //       type: "pie",
      //       radius: "50%",
      //       data: datas.map(json => ({name: json.name, value: json.value}))
      //     }
      //   ]
      // }

      // let chart2 = this.$echarts.init(oRight)

      // let that = this
      // chart.on("mouseover", function (ev) {
      //   that.setCity(ev.name, chart2, datas)
      // })
      // that.setCity(datas[0].name, chart2, datas)
    },
    setCity(name, chart2, datas) {
      let data = null
      datas.forEach(json => {
        if (json.name === name) {
          data = json
        }
      })
      const option = {
        title: {
          text: `${name}省`
        },
        xAxis: [
          {
            type: 'category',
            data: data.citys.map(city => city.name)
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ],
        series: [
          {
            name: 'city',
            type: 'bar',
            data: data.citys.map(city => city.value)
          }
        ]
      }
      chart2.setOption(option)
    }
  }
}
</script>

<style lang="scss" scoped>
  .dashboard-container {
  padding: 15px;
  display: flex;
  flex-direction: column;

  .on-dashboard-wrapper {
    width: 100%;
    border-radius: 10px;
    color: black;
    height: 400px;
    text-align: center;
    background-color: #eeeeee;

    > div {
      margin: 100px auto;

      h1 {
        font-size: 34px;
      }

      p {
        font-size: 20px;
        line-height: 40px;
      }
    }
  }

  .dashboard-content {
    margin-top: 10px;
    height: 300px;

    .statistics {
      border: 1px solid #ccc;
      border-radius: 15px;
      background-color: #eeeeee;
      width: 400px;
      color: black;
      float: left;

      .panel {
        width: 100%;

        .panel-heading {
          padding-left: 15px;
          border-bottom: 1px solid #ccc;
          line-height: 40px;
          height: 40px;

          .panel-title {
            font-size: 18px;
            color: #303133;
            font-weight: normal;
          }
        }

        .list-group {
          width: 100%;
          background-color: #fff;
          border-bottom-right-radius: 15px;
          border-bottom-left-radius: 15px;

          .list-group-item {
            padding-left: 15px;
            list-style: none;
            border-bottom: 1px solid #ccc;
            line-height: 40px;
            height: 40px;

            &:last-child {
              border: none;
            }
          }

        }

      }
    }

    #myChart {
      float: left;
      width: 60%;
      height: 100%;

      .box2 {
        width: 60%;
        height: 500px;
        float: right
      }
    }
  }

}
</style>
