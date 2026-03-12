import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { AIAssistantButton } from '@/components/ai/AIAssistantButton';
import { OfflineIndicator } from '@/components/ui/OfflineIndicator';



export const MainLayout = ({children, hideFooter = false, hideAI = false }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        {children}
      </main>
      {!hideFooter && <Footer />}
      {!hideAI && <AIAssistantButton />}
      <OfflineIndicator />
    </div>
  );
};
