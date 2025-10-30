import {useParams} from 'react-router'

export default function AboutPage() {
  const {id} = useParams()

  return (
    <div>
      <div>ss</div>
      <span>{id}</span>
    </div>
  )
}