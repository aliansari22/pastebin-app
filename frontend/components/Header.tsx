import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { FileText, Plus } from "lucide-react";

export function Header() {
  return (
    <header className="border-b border-border bg-card/50 backdrop-blur">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-xl font-bold">
            <FileText className="h-6 w-6" />
            SimplePaste
          </Link>
          <Link to="/create">
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              New Paste
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
