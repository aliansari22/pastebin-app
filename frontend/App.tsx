import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { HomePage } from "./pages/HomePage";
import { CreatePage } from "./pages/CreatePage";
import { ViewPage } from "./pages/ViewPage";
import { Header } from "./components/Header";

export default function App() {
  return (
    <div className="min-h-screen bg-background">
      <Router>
        <Header />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/create" element={<CreatePage />} />
            <Route path="/paste/:id" element={<ViewPage />} />
          </Routes>
        </main>
        <Toaster />
      </Router>
    </div>
  );
}
