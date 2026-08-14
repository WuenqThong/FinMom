import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ScrollToTop } from "@/components/ScrollToTop";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import Index from "./pages/Index.tsx";
import TradingPage from "./pages/Trading.tsx";
import HowItWorksPage from "./pages/HowItWorks.tsx";
import PricingPage from "./pages/Pricing.tsx";
import FaqPage from "./pages/Faq.tsx";
import NotFound from "./pages/NotFound.tsx";
import LoginPage from "./pages/Login.tsx";
import RegisterPage from "./pages/Register.tsx";
import RuleEngineAndAnalysisPage from "./pages/RuleEngineAndAnalysisPage.tsx";
import ProfilePage from "./pages/Profile.tsx";
import MarketplacePage from "./pages/Marketplace.tsx";
import MarketplaceAppPage from "./pages/MarketplaceAppPage.tsx";
import AboutPage from "./pages/About.tsx";

const App = () => (
  <>
    <Toaster />
    <Sonner />
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/trading" element={<TradingPage />} />
        <Route path="/tranding" element={<TradingPage />} />
        <Route path="/rule-engine-and-analysis" element={<RuleEngineAndAnalysisPage />} />
        <Route path="/marketplace" element={<MarketplacePage />} />
        <Route path="/marketplace/app" element={<MarketplaceAppPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/how-it-works" element={<HowItWorksPage />} />
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/faq" element={<FaqPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  </>
);

export default App;
