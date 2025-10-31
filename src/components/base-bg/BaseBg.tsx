export default function BaseBg() {
  return (
    <div className="hpj base-bg w-screen h-screen fixed top-0 left-0 bg-white -z-10">
      <div className="bg w-full h-full"
           style={{
             background: 'linear-gradient(154deg, #07070915 30%, hsl(212 100% 45%/30%) 48%, #07070915 64%)',
             filter: 'blur(100px)',
           }}
      />
    </div>
  )
}