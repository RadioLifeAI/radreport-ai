import { useState } from 'react'
import { 
  Activity, 
  ChevronDown, 
  Scan, 
  BarChart3, 
  Radio, 
  Camera, 
  Zap, 
  Wind, 
  Heart, 
  CircleDot, 
  Database, 
  Circle 
} from 'lucide-react'
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
import { PIRADSModal } from './PIRADSModal'
import { ORADSModal } from './ORADSModal'

interface RADSDropdownProps {
  editor: Editor | null
}

export function RADSDropdown({ editor }: RADSDropdownProps) {
  const [tiradsOpen, setTiradsOpen] = useState(false)
  const [biradsUSGOpen, setBiradsUSGOpen] = useState(false)
  const [biradsMGOpen, setBiradsMGOpen] = useState(false)
  const [biradsRMOpen, setBiradsRMOpen] = useState(false)
  const [usTireoideOpen, setUsTireoideOpen] = useState(false)
  const [piradsOpen, setPiradsOpen] = useState(false)
  const [oradsOpen, setOradsOpen] = useState(false)

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
            <Scan className="mr-2 h-4 w-4 text-cyan-500" />
            US Tireoide (Completo)
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setTiradsOpen(true)} className="cursor-pointer">
            <BarChart3 className="mr-2 h-4 w-4 text-cyan-500" />
            ACR TI-RADS (Nódulos)
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setBiradsUSGOpen(true)} className="cursor-pointer">
            <Radio className="mr-2 h-4 w-4 text-pink-500" />
            ACR BI-RADS (Mama - USG)
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setBiradsMGOpen(true)} className="cursor-pointer">
            <Camera className="mr-2 h-4 w-4 text-pink-500" />
            ACR BI-RADS (Mama - Mamografia)
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setBiradsRMOpen(true)} className="cursor-pointer">
            <Zap className="mr-2 h-4 w-4 text-pink-500" />
            ACR BI-RADS (Mama - RM)
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setPiradsOpen(true)} className="cursor-pointer">
            <CircleDot className="mr-2 h-4 w-4 text-indigo-500" />
            ACR PI-RADS (Próstata)
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setOradsOpen(true)} className="cursor-pointer">
            <Circle className="mr-2 h-4 w-4 text-pink-500" />
            ACR O-RADS US (Ginecologia)
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem disabled className="opacity-50">
            <Wind className="mr-2 h-4 w-4 text-blue-400" />
            Lung-RADS (Pulmão) - Em breve
          </DropdownMenuItem>
          <DropdownMenuItem disabled className="opacity-50">
            <Heart className="mr-2 h-4 w-4 text-red-500" />
            CAD-RADS (Coronárias) - Em breve
          </DropdownMenuItem>
          <DropdownMenuItem disabled className="opacity-50">
            <Database className="mr-2 h-4 w-4 text-amber-600" />
            LI-RADS (Fígado) - Em breve
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

      <PIRADSModal
        open={piradsOpen}
        onOpenChange={setPiradsOpen}
        editor={editor}
      />

      <ORADSModal
        open={oradsOpen}
        onOpenChange={setOradsOpen}
        editor={editor}
      />
    </>
  )
}
