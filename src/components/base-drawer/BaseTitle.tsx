interface IProps {
  title: string
  size?: 16 | 14,
}

export default function BaseTitle(props: IProps) {
  return (
    <div className={'hpj flex items-center gap-x-4'}>
      <div
        className={'w-[4px] bg-primary rounded-r-sm'}
        style={{
          height: `${props.size ?? 16}px`,
        }}
      />
      <span
        className={`text-text-title font-medium ${props.size === 14 ? 'text-sm' : 'text-base'}`}
      >{props.title}</span>
    </div>
  )
}
