import { SceneLoader } from '@/components/scene/SceneLoader'
import { Overlay } from '@/components/overlay/Overlay'
import { italiana } from '@/lib/fonts'

export default function Page() {
  return (
    <main>
      <SceneLoader nameFont={italiana.style.fontFamily} />
      <Overlay />
    </main>
  )
}
