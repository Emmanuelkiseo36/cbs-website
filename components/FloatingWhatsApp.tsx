import { WhatsAppIcon } from '@/components/ui/icons';
import type { SiteSettings } from '@/lib/store';

export default function FloatingWhatsApp({ settings }: { settings: SiteSettings }) {
  return (
    <a
      href={`https://wa.me/${settings.whatsappNumber}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with CBS on WhatsApp"
      className="group fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_12px_30px_-8px_rgba(37,211,102,0.6)] transition-transform duration-300 hover:scale-110"
    >
      <span className="absolute inset-0 -z-10 rounded-full bg-[#25D366]/60 animate-ping [animation-duration:2.4s]" aria-hidden="true" />
      <WhatsAppIcon className="h-7 w-7" />
    </a>
  );
}