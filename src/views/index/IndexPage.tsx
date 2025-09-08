import {useEffect, useRef} from 'react'

export default function Index() {
  // state
  const list = useRef([
    'https://assets-cdn.jable.tv/contents/videos_screenshots/37000/37018/320x180/1.jpg',
    'https://assets-cdn.jable.tv/contents/videos_screenshots/4000/4831/320x180/1.jpg',
    'https://assets-cdn.jable.tv/contents/videos_screenshots/14000/14560/320x180/1.jpg',
    'https://assets-cdn.jable.tv/contents/videos_screenshots/25000/25053/320x180/1.jpg',
    'https://assets-cdn.jable.tv/contents/videos_screenshots/34000/34154/320x180/1.jpg',
    'https://assets-cdn.jable.tv/contents/videos_screenshots/5000/5650/320x180/1.jpg',
    'https://assets-cdn.jable.tv/contents/videos_screenshots/6000/6159/320x180/1.jpg',
    'https://assets-cdn.jable.tv/contents/videos_screenshots/26000/26482/320x180/1.jpg',
  ])
  // mounted
  useEffect(() => {
    navigator.clipboard.writeText('react18的首页')
  }, [])
  // methods
  // render
  return (
    <div className={'w-full min-h-[600px] bg-red-400 flex flex-col'}>
      <span className={'text-3xl'}>首页</span>
      {
        list.current.map((item, index) => (
          <img key={index}
               src={item}
               loading={'lazy'}
               className={'w-full min-h-[600px]'}/>
        ))
      }
    </div>
  )
}
