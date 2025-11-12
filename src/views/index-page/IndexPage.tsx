import {useEffect, useRef} from 'react'
import * as echarts from 'echarts'

export default function Index() {
  const divRef = useRef<HTMLDivElement | null>(null)
  useEffect(() => {
    if (!divRef.current) {
      return
    }

    const chartDom = divRef.current
    const myChart = echarts.init(chartDom)

    const option = {
      xAxis: {
        type: 'category',
        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      },
      yAxis: {
        type: 'value',
      },
      series: [
        {
          data: [150, 230, 224, 218, 135, 147, 260],
          type: 'line',
        },
      ],
    }

    myChart.setOption(option)

    return () => {
      myChart.dispose()
    }
  }, [])

  return (
    <div className="w-full h-[600px] flex flex-col">
      <span className="text-primary text-3xl">你好,react19-ts</span>
      <div
        ref={divRef}
        className="w-[500px] h-[500px]"
      />
    </div>
  )
}
