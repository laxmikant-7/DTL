import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useLanguage } from "@/contexts/language-context";
import { Header } from "@/components/layout/header";
import { Complaint, ComplaintNote } from "@shared/schema";
import {
  Search,
  FileText,
  Clock,
  CheckCircle,
  AlertCircle,
  Zap,
  Droplets,
  Route,
  Trash2,
  HelpCircle,
  MapPin,
  Calendar,
  MessageSquare,
  User,
} from "lucide-react";
import { format } from "date-fns";

const categoryIcons: Record<string, typeof Zap> = {
  electricity: Zap,
  water: Droplets,
  roads: Route,
  waste: Trash2,
  other: HelpCircle,
};

const statusIcons: Record<string, typeof Clock> = {
  submitted: Clock,
  in_progress: AlertCircle,
  resolved: CheckCircle,
};

const statusColors: Record<string, string> = {
  submitted: "bg-yellow-100 text-yellow-800 border-yellow-300 dark:bg-yellow-900/30 dark:text-yellow-200 dark:border-yellow-800",
  in_progress: "bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-900/30 dark:text-blue-200 dark:border-blue-800",
  resolved: "bg-green-100 text-green-800 border-green-300 dark:bg-green-900/30 dark:text-green-200 dark:border-green-800",
};

const timelineColors: Record<string, string> = {
  submitted: "bg-yellow-500",
  in_progress: "bg-blue-500",
  resolved: "bg-green-500",
};

export default function TrackComplaint() {
  const { t } = useLanguage();
  const [searchId, setSearchId] = useState("");
  const [queriedId, setQueriedId] = useState<string | null>(null);

  const { data: complaint, isLoading, error } = useQuery<Complaint | null>({
    queryKey: ["/api/complaints/track", queriedId],
    queryFn: async () => {
      if (!queriedId) return null;
      const res = await fetch(`/api/complaints/track/${queriedId}`);
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Failed to fetch complaint");
      return res.json();
    },
    enabled: !!queriedId,
  });

  const { data: notes } = useQuery<ComplaintNote[]>({
    queryKey: ["/api/complaints", complaint?.id, "notes"],
    queryFn: async () => {
      if (!complaint?.id) return [];
      const res = await fetch(`/api/complaints/${complaint.id}/notes`);
      if (!res.ok) return [];
      return res.json();
    },
    enabled: !!complaint?.id,
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchId.trim()) {
      setQueriedId(searchId.trim().toUpperCase());
    }
  };

  const categoryLabels: Record<string, string> = {
    electricity: t("complaint.category.electricity"),
    water: t("complaint.category.water"),
    roads: t("complaint.category.roads"),
    waste: t("complaint.category.waste"),
    other: t("complaint.category.other"),
  };

  const statusLabels: Record<string, string> = {
    submitted: t("status.submitted"),
    in_progress: t("status.in_progress"),
    resolved: t("status.resolved"),
  };

  const statusOrder = ["submitted", "in_progress", "resolved"];
  const currentStatusIndex = complaint ? statusOrder.indexOf(complaint.status) : -1;

  const CategoryIcon = complaint ? categoryIcons[complaint.category] || HelpCircle : HelpCircle;
  const StatusIcon = complaint ? statusIcons[complaint.status] || Clock : Clock;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 container mx-auto px-4 md:px-6 lg:px-8 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-2xl md:text-3xl font-bold mb-2" data-testid="text-track-title">
              {t("track.title")}
            </h1>
            <p className="text-muted-foreground">
              Enter your complaint ID to view the current status and updates
            </p>
          </div>

          <Card className="mb-8">
            <CardContent className="pt-6">
              <form onSubmit={handleSearch} className="flex gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    value={searchId}
                    onChange={(e) => setSearchId(e.target.value)}
                    className="pl-10"
                    placeholder={t("track.input.placeholder")}
                    data-testid="input-track-search"
                  />
                </div>
                <Button type="submit" data-testid="button-track-search">
                  {t("track.search")}
                </Button>
              </form>
            </CardContent>
          </Card>

          {isLoading && (
            <Card>
              <CardContent className="pt-6">
                <Skeleton className="h-8 w-48 mb-4" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-3/4 mb-6" />
                <Skeleton className="h-24 w-full" />
              </CardContent>
            </Card>
          )}

          {queriedId && !isLoading && !complaint && (
            <Card className="border-destructive/50">
              <CardContent className="pt-6">
                <div className="text-center py-8">
                  <div className="h-16 w-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-4">
                    <AlertCircle className="h-8 w-8 text-destructive" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{t("track.notFound")}</h3>
                  <p className="text-muted-foreground">
                    No complaint found with ID: <span className="font-mono font-medium">{queriedId}</span>
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Please check the ID and try again
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {complaint && (
            <>
              <Card className="mb-6">
                <CardHeader>
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div>
                      <CardTitle className="flex items-center gap-2 text-xl">
                        <span className="font-mono" data-testid="text-complaint-id">
                          {complaint.complaintId}
                        </span>
                      </CardTitle>
                      <CardDescription className="flex items-center gap-4 mt-2 flex-wrap">
                        <span className="flex items-center gap-1">
                          <CategoryIcon className="h-4 w-4" />
                          {categoryLabels[complaint.category]}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {format(new Date(complaint.createdAt), "MMM d, yyyy")}
                        </span>
                      </CardDescription>
                    </div>
                    <Badge
                      variant="outline"
                      className={`${statusColors[complaint.status]} px-4 py-1`}
                      data-testid="badge-complaint-status"
                    >
                      <StatusIcon className="h-4 w-4 mr-2" />
                      {statusLabels[complaint.status]}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Location</p>
                      <p data-testid="text-complaint-location">{complaint.location}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <FileText className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Description</p>
                      <p className="whitespace-pre-wrap" data-testid="text-complaint-description">
                        {complaint.description}
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <p className="text-sm font-medium text-muted-foreground mb-4">
                      Status Timeline
                    </p>
                    <div className="flex items-center justify-between relative">
                      <div className="absolute left-0 right-0 top-4 h-1 bg-muted" />
                      <div
                        className={`absolute left-0 top-4 h-1 ${timelineColors[complaint.status]} transition-all`}
                        style={{ width: `${(currentStatusIndex / (statusOrder.length - 1)) * 100}%` }}
                      />
                      {statusOrder.map((status, index) => {
                        const Icon = statusIcons[status];
                        const isComplete = index <= currentStatusIndex;
                        const isCurrent = index === currentStatusIndex;
                        return (
                          <div
                            key={status}
                            className="relative flex flex-col items-center z-10"
                            data-testid={`timeline-step-${status}`}
                          >
                            <div
                              className={`h-8 w-8 rounded-full flex items-center justify-center border-2 ${
                                isComplete
                                  ? `${timelineColors[status]} border-transparent`
                                  : "bg-background border-muted"
                              } ${isCurrent ? "ring-4 ring-offset-2 ring-offset-background ring-primary/20" : ""}`}
                            >
                              <Icon
                                className={`h-4 w-4 ${isComplete ? "text-white" : "text-muted-foreground"}`}
                              />
                            </div>
                            <span
                              className={`text-xs mt-2 ${
                                isComplete ? "font-medium" : "text-muted-foreground"
                              }`}
                            >
                              {statusLabels[status]}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {notes && notes.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <MessageSquare className="h-5 w-5" />
                      Officer Notes
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {notes.map((note) => (
                        <div
                          key={note.id}
                          className="p-4 rounded-lg bg-muted/50 border"
                          data-testid={`note-${note.id}`}
                        >
                          <div className="flex items-center gap-2 mb-2">
                            <User className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium text-sm">{note.officerName}</span>
                            <span className="text-xs text-muted-foreground">
                              {format(new Date(note.createdAt), "MMM d, yyyy 'at' h:mm a")}
                            </span>
                          </div>
                          <p className="text-sm">{note.note}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}
