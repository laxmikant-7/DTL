import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useLanguage } from "@/contexts/language-context";
import { useAuth } from "@/hooks/use-auth";
import { Header } from "@/components/layout/header";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Complaint, ComplaintNote, complaintStatuses } from "@shared/schema";
import {
  Loader2,
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
  MessageSquare,
  RefreshCw,
  Filter,
  User,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

const categoryIcons: Record<string, typeof Zap> = {
  electricity: Zap,
  water: Droplets,
  roads: Route,
  waste: Trash2,
  other: HelpCircle,
};

const statusColors: Record<string, string> = {
  submitted: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  in_progress: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  resolved: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
};

const noteSchema = z.object({
  note: z.string().min(5, "Note must be at least 5 characters"),
});

type NoteFormData = z.infer<typeof noteSchema>;

export default function OfficerDashboard() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const { toast } = useToast();
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [showNoteDialog, setShowNoteDialog] = useState(false);

  const noteForm = useForm<NoteFormData>({
    resolver: zodResolver(noteSchema),
    defaultValues: { note: "" },
  });

  const { data: complaints, isLoading } = useQuery<Complaint[]>({
    queryKey: ["/api/officer/complaints"],
  });

  const { data: selectedNotes } = useQuery<ComplaintNote[]>({
    queryKey: ["/api/complaints", selectedComplaint?.id, "notes"],
    queryFn: async () => {
      if (!selectedComplaint?.id) return [];
      const res = await fetch(`/api/complaints/${selectedComplaint.id}/notes`);
      if (!res.ok) return [];
      return res.json();
    },
    enabled: !!selectedComplaint?.id,
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const res = await apiRequest("PATCH", `/api/complaints/${id}/status`, { status });
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/officer/complaints"] });
      toast({ title: "Status updated successfully" });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to update status",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const addNoteMutation = useMutation({
    mutationFn: async ({ complaintId, note }: { complaintId: string; note: string }) => {
      const res = await apiRequest("POST", `/api/complaints/${complaintId}/notes`, { note });
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/complaints", selectedComplaint?.id, "notes"] });
      queryClient.invalidateQueries({ queryKey: ["/api/officer/complaints"] });
      setShowNoteDialog(false);
      noteForm.reset();
      toast({ title: "Note added successfully" });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to add note",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmitNote = (data: NoteFormData) => {
    if (selectedComplaint) {
      addNoteMutation.mutate({
        complaintId: selectedComplaint.id,
        note: data.note,
      });
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

  const filteredComplaints = complaints?.filter((c) => {
    if (statusFilter === "all") return true;
    return c.status === statusFilter;
  });

  const stats = {
    total: complaints?.length || 0,
    submitted: complaints?.filter((c) => c.status === "submitted").length || 0,
    inProgress: complaints?.filter((c) => c.status === "in_progress").length || 0,
    resolved: complaints?.filter((c) => c.status === "resolved").length || 0,
  };

  const departmentLabel = user?.department ? categoryLabels[user.department] : "All";

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 container mx-auto px-4 md:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold" data-testid="text-officer-dashboard-title">
            {t("officer.dashboard")}
          </h1>
          <p className="text-muted-foreground mt-1">
            Department: {departmentLabel} | Officer: {user?.name}
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="hover-elevate">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{t("officer.total")}</p>
                  <p className="text-3xl font-bold" data-testid="text-officer-stat-total">
                    {stats.total}
                  </p>
                </div>
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover-elevate">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{t("officer.pending")}</p>
                  <p className="text-3xl font-bold text-yellow-600" data-testid="text-officer-stat-pending">
                    {stats.submitted}
                  </p>
                </div>
                <div className="h-12 w-12 rounded-lg bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center">
                  <Clock className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover-elevate">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{t("officer.inProgress")}</p>
                  <p className="text-3xl font-bold text-blue-600" data-testid="text-officer-stat-progress">
                    {stats.inProgress}
                  </p>
                </div>
                <div className="h-12 w-12 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                  <RefreshCw className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover-elevate">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{t("officer.resolved")}</p>
                  <p className="text-3xl font-bold text-green-600" data-testid="text-officer-stat-resolved">
                    {stats.resolved}
                  </p>
                </div>
                <div className="h-12 w-12 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <CardTitle>Complaints</CardTitle>
                <CardDescription>
                  Manage complaints assigned to your department
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[150px]" data-testid="select-status-filter">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    {complaintStatuses.map((status) => (
                      <SelectItem key={status} value={status}>
                        {statusLabels[status]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-20 w-full" />
                ))}
              </div>
            ) : filteredComplaints && filteredComplaints.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Complaint ID</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead className="hidden md:table-cell">Location</TableHead>
                      <TableHead className="hidden lg:table-cell">Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredComplaints.map((complaint) => {
                      const Icon = categoryIcons[complaint.category] || HelpCircle;
                      return (
                        <TableRow
                          key={complaint.id}
                          className="cursor-pointer hover:bg-muted/50"
                          onClick={() => setSelectedComplaint(complaint)}
                          data-testid={`row-complaint-${complaint.id}`}
                        >
                          <TableCell className="font-mono font-medium">
                            {complaint.complaintId}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Icon className="h-4 w-4 text-muted-foreground" />
                              <span className="hidden sm:inline">
                                {categoryLabels[complaint.category]}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="hidden md:table-cell max-w-[200px] truncate">
                            {complaint.location}
                          </TableCell>
                          <TableCell className="hidden lg:table-cell">
                            {format(new Date(complaint.createdAt), "MMM d, yyyy")}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="secondary"
                              className={statusColors[complaint.status]}
                            >
                              {statusLabels[complaint.status]}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Select
                                value={complaint.status}
                                onValueChange={(status) => {
                                  updateStatusMutation.mutate({
                                    id: complaint.id,
                                    status,
                                  });
                                }}
                              >
                                <SelectTrigger
                                  className="w-[130px]"
                                  onClick={(e) => e.stopPropagation()}
                                  data-testid={`select-status-${complaint.id}`}
                                >
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {complaintStatuses.map((status) => (
                                    <SelectItem key={status} value={status}>
                                      {statusLabels[status]}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedComplaint(complaint);
                                  setShowNoteDialog(true);
                                }}
                                data-testid={`button-add-note-${complaint.id}`}
                              >
                                <MessageSquare className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-12">
                <FileText className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                <p className="text-muted-foreground">{t("general.noComplaints")}</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Dialog
          open={!!selectedComplaint && !showNoteDialog}
          onOpenChange={() => setSelectedComplaint(null)}
        >
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            {selectedComplaint && (
              <>
                <DialogHeader>
                  <DialogTitle className="font-mono text-xl">
                    {selectedComplaint.complaintId}
                  </DialogTitle>
                  <DialogDescription>
                    View and manage complaint details
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-6 py-4">
                  <div className="flex items-center gap-4 flex-wrap">
                    <Badge
                      variant="secondary"
                      className={statusColors[selectedComplaint.status]}
                    >
                      {statusLabels[selectedComplaint.status]}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      {categoryLabels[selectedComplaint.category]}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {format(new Date(selectedComplaint.createdAt), "MMM d, yyyy")}
                    </span>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <MapPin className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Location</p>
                        <p>{selectedComplaint.location}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <FileText className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Description</p>
                        <p className="whitespace-pre-wrap">{selectedComplaint.description}</p>
                      </div>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-medium flex items-center gap-2">
                        <MessageSquare className="h-4 w-4" />
                        Notes
                      </h4>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowNoteDialog(true)}
                        data-testid="button-add-note-dialog"
                      >
                        {t("officer.addNote")}
                      </Button>
                    </div>
                    {selectedNotes && selectedNotes.length > 0 ? (
                      <div className="space-y-3">
                        {selectedNotes.map((note) => (
                          <div
                            key={note.id}
                            className="p-3 rounded-lg bg-muted/50 border"
                          >
                            <div className="flex items-center gap-2 mb-1">
                              <User className="h-3 w-3 text-muted-foreground" />
                              <span className="text-sm font-medium">{note.officerName}</span>
                              <span className="text-xs text-muted-foreground">
                                {format(new Date(note.createdAt), "MMM d 'at' h:mm a")}
                              </span>
                            </div>
                            <p className="text-sm">{note.note}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground text-center py-4">
                        No notes yet
                      </p>
                    )}
                  </div>
                </div>

                <DialogFooter>
                  <div className="flex items-center gap-2 w-full">
                    <Select
                      value={selectedComplaint.status}
                      onValueChange={(status) => {
                        updateStatusMutation.mutate({
                          id: selectedComplaint.id,
                          status,
                        });
                        setSelectedComplaint({ ...selectedComplaint, status });
                      }}
                    >
                      <SelectTrigger className="flex-1" data-testid="select-detail-status">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {complaintStatuses.map((status) => (
                          <SelectItem key={status} value={status}>
                            {statusLabels[status]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </DialogFooter>
              </>
            )}
          </DialogContent>
        </Dialog>

        <Dialog open={showNoteDialog} onOpenChange={setShowNoteDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t("officer.addNote")}</DialogTitle>
              <DialogDescription>
                Add a note to complaint {selectedComplaint?.complaintId}
              </DialogDescription>
            </DialogHeader>
            <Form {...noteForm}>
              <form onSubmit={noteForm.handleSubmit(onSubmitNote)} className="space-y-4">
                <FormField
                  control={noteForm.control}
                  name="note"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Note</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          rows={4}
                          placeholder="Enter your note..."
                          data-testid="textarea-note"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowNoteDialog(false);
                      noteForm.reset();
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={addNoteMutation.isPending}
                    data-testid="button-submit-note"
                  >
                    {addNoteMutation.isPending ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : null}
                    Add Note
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
}
