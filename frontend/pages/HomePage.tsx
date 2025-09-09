import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Eye, Calendar, Plus } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import backend from "~backend/client";
import type { PasteSummary } from "~backend/paste/list";

export function HomePage() {
  const [pastes, setPastes] = useState<PasteSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadPastes();
  }, []);

  const loadPastes = async () => {
    try {
      const response = await backend.paste.list({ limit: 20 });
      setPastes(response.pastes);
    } catch (error) {
      console.error("Failed to load pastes:", error);
      toast({
        title: "Error",
        description: "Failed to load pastes",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Recent Pastes</h1>
        </div>
        <div className="grid gap-4">
          {[...Array(5)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-4 bg-muted rounded w-1/3"></div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="h-3 bg-muted rounded w-1/4"></div>
                  <div className="h-3 bg-muted rounded w-1/6"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Recent Pastes</h1>
          <p className="text-muted-foreground mt-2">
            Share text snippets and code with others
          </p>
        </div>
        <Link to="/create">
          <Button size="lg" className="gap-2">
            <Plus className="h-4 w-4" />
            Create New Paste
          </Button>
        </Link>
      </div>

      {pastes.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <FileText className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold mb-2">No pastes yet</h2>
            <p className="text-muted-foreground mb-4">
              Be the first to create a paste!
            </p>
            <Link to="/create">
              <Button>Create Your First Paste</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {pastes.map((paste) => (
            <Card key={paste.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg">
                    <Link
                      to={`/paste/${paste.id}`}
                      className="hover:text-primary transition-colors"
                    >
                      {paste.title || `Paste ${paste.id}`}
                    </Link>
                  </CardTitle>
                  <Badge variant="secondary">{paste.language}</Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {formatDate(paste.createdAt)}
                  </div>
                  <div className="flex items-center gap-1">
                    <Eye className="h-3 w-3" />
                    {paste.views} views
                  </div>
                  {paste.expiresAt && (
                    <div className="text-orange-600">
                      Expires: {formatDate(paste.expiresAt)}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
