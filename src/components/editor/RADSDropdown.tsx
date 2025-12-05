import { useState } from 'react'
import { Activity, ChevronDown } from 'lucide-react'
import { Editor } from '@tiptap/react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import { TIRADSModal } from './TIRADSModal'
import { BIRADSModal } from './BIRADSModal'
import { BIRADSMGModal } from './BIRADSMGModal'
import { BIRADSRMModal } from './BIRADSRMModal'
import { USTireoideModal } from './USTireoideModal'

interface RADSDropdownProps {
  editor: Editor | null
}

export function RADSDropdown({ editor }: RADSDropdownProps) {
  const [tiradsOpen, setTiradsOpen] = useState(false)
  const [biradsUSGOpen, setBiradsUSGOpen] = useState(false)
  const [biradsMGOpen, setBiradsMGOpen] = useState(false)
  const [biradsRMOpen, setBiradsRMOpen] = useState(false)
  const [usTireoideOpen, setUsTireoideOpen] = useState(false)

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="flex items-center gap-1 md:gap-2 px-2 md:px-4 py-2 rounded-lg hover:bg-muted transition-colors">
            <Activity size={16} className="md:w-[18px] md:h-[18px] text-violet-500" />
            <span className="text-xs md:text-sm hidden sm:inline">RADS</span>
            <ChevronDown size={14} className="opacity-50" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-64">
          <DropdownMenuItem onClick={() => setUsTireoideOpen(true)} className="cursor-pointer">
            <span className="mr-2">🦋</span>
            US Tireoide (Completo)
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setTiradsOpen(true)} className="cursor-pointer">
            <span className="mr-2">📊</span>
            ACR TI-RADS (Nódulos)
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setBiradsUSGOpen(true)} className="cursor-pointer">
            <span className="mr-2">🎀</span>
            ACR BI-RADS (Mama - USG)
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setBiradsMGOpen(true)} className="cursor-pointer">
            <span className="mr-2">📷</span>
            ACR BI-RADS (Mama - Mamografia)
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setBiradsRMOpen(true)} className="cursor-pointer">
            <span className="mr-2">🧲</span>
            ACR BI-RADS (Mama - RM)
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem disabled className="opacity-50">
            <span className="mr-2">🫁</span>
            Lung-RADS (Pulmão) - Em breve
          </DropdownMenuItem>
          <DropdownMenuItem disabled className="opacity-50">
            <span className="mr-2">🫀</span>
            CAD-RADS (Coronárias) - Em breve
          </DropdownMenuItem>
          <DropdownMenuItem disabled className="opacity-50">
            <span className="mr-2">🔵</span>
            PI-RADS (Próstata) - Em breve
          </DropdownMenuItem>
          <DropdownMenuItem disabled className="opacity-50">
            <span className="mr-2">🟤</span>
            LI-RADS (Fígado) - Em breve
          </DropdownMenuItem>
          <DropdownMenuItem disabled className="opacity-50">
            <span className="mr-2">🥚</span>
            O-RADS (Ovário) - Em breve
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <TIRADSModal
        open={tiradsOpen}
        onOpenChange={setTiradsOpen}
        editor={editor}
      />

      <BIRADSModal
        open={biradsUSGOpen}
        onOpenChange={setBiradsUSGOpen}
        editor={editor}
      />

      <BIRADSMGModal
        open={biradsMGOpen}
        onOpenChange={setBiradsMGOpen}
        editor={editor}
      />

      <BIRADSRMModal
        open={biradsRMOpen}
        onOpenChange={setBiradsRMOpen}
        editor={editor}
      />

      <USTireoideModal
        open={usTireoideOpen}
        onOpenChange={setUsTireoideOpen}
        editor={editor}
      />
    </>
  )
}
