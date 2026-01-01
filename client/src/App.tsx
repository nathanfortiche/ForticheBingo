import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { Analytics } from "@vercel/analytics/react";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Bingo2025 from "@/pages/bingo-2025";
import Bingo2026 from "@/pages/bingo-2026";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/bingo-2025" component={Bingo2025} />
      <Route path="/bingo-2026" component={Bingo2026} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster />
      <Analytics />
    </QueryClientProvider>
  );
}

export default App;