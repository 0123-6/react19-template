import type {IBaseProps} from '@/components/IBaseProps.ts'
import {Tooltip} from 'antd'
import {useEffect, useRef} from 'react'
import {useResetState} from '@/util/hooks/useResetState.ts'

interface IProps extends IBaseProps {
  lineHeight?: number,
  lineClamp?: number,
  text: any,
}

export default function BaseSpanTooltip(props: IProps) {
  const lineClamp = props.lineHeight ?? 1
  const lineHeight = props.lineHeight ?? 20
  const textRef = useRef<HTMLSpanElement>(null)
  const [isOverflow, setIsOverview] = useResetState(() => false)

  useEffect(() => {
    setIsOverview(textRef.current.scrollHeight > lineClamp * lineHeight)
  }, [props.text])

  return (
    <div className={`hpj w-full flex items-center ${props.className ?? ''}`}>
      <Tooltip
        title={isOverflow ? props.text : undefined}
      >
        <span
          ref={textRef}
          className={'text-left tracking-tight break-all overflow-hidden'}
          style={{
            display: '-webkit-box',
            WebkitBoxOrient: 'vertical',
            WebkitLineClamp: lineClamp,
            lineHeight: `${lineHeight}px`,
          }}
        >{props.text}</span>
      </Tooltip>
    </div>
  )
}
