import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
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
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { useLanguage } from "@/contexts/language-context";
import { useAuth } from "@/hooks/use-auth";
import { Header } from "@/components/layout/header";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { complaintFormSchema, ComplaintFormData, Complaint, complaintCategories } from "@shared/schema";
import {
  Loader2,
  Plus,
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
  Copy,
  Check,
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

export default function CitizenDashboard() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const { toast } = useToast();
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [newComplaintId, setNewComplaintId] = useState<string>("");
  const [copiedId, setCopiedId] = useState(false);

  const form = useForm<ComplaintFormData>({
    resolver: zodResolver(complaintFormSchema),
    defaultValues: {
      category: undefined,
      location: "",
      description: "",
    },
  });

  const { data: complaints, isLoading: complaintsLoading } = useQuery<Complaint[]>({
    queryKey: ["/api/complaints"],
  });

  const submitMutation = useMutation({
    mutationFn: async (data: ComplaintFormData) => {
      const res = await apiRequest("POST", "/api/complaints", data);
      return await res.json();
    },
    onSuccess: (complaint: Complaint) => {
      queryClient.invalidateQueries({ queryKey: ["/api/complaints"] });
      setNewComplaintId(complaint.complaintId);
      setShowSuccessDialog(true);
      form.reset();
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to submit complaint",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: ComplaintFormData) => {
    submitMutation.mutate(data);
  };

  const copyComplaintId = () => {
    navigator.clipboard.writeText(newComplaintId);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
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

  const stats = {
    total: complaints?.length || 0,
    submitted: complaints?.filter((c) => c.status === "submitted").length || 0,
    inProgress: complaints?.filter((c) => c.status === "in_progress").length || 0,
    resolved: complaints?.filter((c) => c.status === "resolved").length || 0,
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 container mx-auto px-4 md:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold" data-testid="text-dashboard-title">
            {t("nav.dashboard")}
          </h1>
          <p className="text-muted-foreground mt-1">
            Welcome back, {user?.name}
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">{t("general.myComplaints")}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 rounded-lg bg-muted/50">
                    <p className="text-2xl font-bold" data-testid="text-stat-total">{stats.total}</p>
                    <p className="text-sm text-muted-foreground">{t("officer.total")}</p>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-yellow-50 dark:bg-yellow-900/20">
                    <p className="text-2xl font-bold text-yellow-600" data-testid="text-stat-submitted">
                      {stats.submitted}
                    </p>
                    <p className="text-sm text-muted-foreground">{t("officer.pending")}</p>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20">
                    <p className="text-2xl font-bold text-blue-600" data-testid="text-stat-progress">
                      {stats.inProgress}
                    </p>
                    <p className="text-sm text-muted-foreground">{t("officer.inProgress")}</p>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-green-50 dark:bg-green-900/20">
                    <p className="text-2xl font-bold text-green-600" data-testid="text-stat-resolved">
                      {stats.resolved}
                    </p>
                    <p className="text-sm text-muted-foreground">{t("officer.resolved")}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Recent Complaints</CardTitle>
              </CardHeader>
              <CardContent>
                {complaintsLoading ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <Skeleton key={i} className="h-20 w-full" />
                    ))}
                  </div>
                ) : complaints && complaints.length > 0 ? (
                  <div className="space-y-3">
                    {complaints.slice(0, 5).map((complaint) => {
                      const Icon = categoryIcons[complaint.category] || HelpCircle;
                      return (
                        <div
                          key={complaint.id}
                          className="flex items-start gap-3 p-3 rounded-lg border hover-elevate transition-shadow"
                          data-testid={`card-complaint-${complaint.id}`}
                        >
                          <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center shrink-0">
                            <Icon className="h-5 w-5 text-muted-foreground" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-mono text-sm font-medium">
                                {complaint.complaintId}
                              </span>
                              <Badge
                                variant="secondary"
                                className={statusColors[complaint.status]}
                              >
                                {statusLabels[complaint.status]}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground truncate mt-1">
                              {complaint.description}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {format(new Date(complaint.createdAt), "MMM d, yyyy")}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <FileText className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                    <p className="text-muted-foreground">{t("general.noComplaints")}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5" />
                  {t("complaint.new")}
                </CardTitle>
                <CardDescription>
                  Fill in the details below to submit a new complaint
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                      control={form.control}
                      name="category"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("complaint.category")}</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger data-testid="select-complaint-category">
                                <SelectValue placeholder="Select a category" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {complaintCategories.map((cat) => {
                                const Icon = categoryIcons[cat];
                                return (
                                  <SelectItem
                                    key={cat}
                                    value={cat}
                                    data-testid={`select-category-${cat}`}
                                  >
                                    <div className="flex items-center gap-2">
                                      <Icon className="h-4 w-4" />
                                      {categoryLabels[cat]}
                                    </div>
                                  </SelectItem>
                                );
                              })}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="location"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("complaint.location")}</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                              <Input
                                {...field}
                                className="pl-10"
                                placeholder={t("complaint.location.placeholder")}
                                data-testid="input-complaint-location"
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("complaint.description")}</FormLabel>
                          <FormControl>
                            <Textarea
                              {...field}
                              rows={6}
                              placeholder={t("complaint.description.placeholder")}
                              className="resize-none"
                              data-testid="textarea-complaint-description"
                            />
                          </FormControl>
                          <div className="flex justify-between text-xs text-muted-foreground mt-1">
                            <FormMessage />
                            <span>{field.value?.length || 0} / 500</span>
                          </div>
                        </FormItem>
                      )}
                    />

                    <Button
                      type="submit"
                      className="w-full"
                      disabled={submitMutation.isPending}
                      data-testid="button-submit-complaint"
                    >
                      {submitMutation.isPending ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <FileText className="mr-2 h-4 w-4" />
                      )}
                      {t("complaint.submit")}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="mx-auto h-16 w-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <DialogTitle className="text-center text-xl">
              {t("complaint.success")}
            </DialogTitle>
            <DialogDescription className="text-center">
              Your complaint has been submitted successfully. Please save your complaint ID for tracking.
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center justify-center gap-2 p-4 bg-muted rounded-lg my-4">
            <span className="font-mono text-2xl font-bold" data-testid="text-new-complaint-id">
              {newComplaintId}
            </span>
            <Button
              variant="ghost"
              size="icon"
              onClick={copyComplaintId}
              data-testid="button-copy-complaint-id"
            >
              {copiedId ? (
                <Check className="h-4 w-4 text-green-600" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          </div>
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>Status: {t("status.submitted")}</span>
          </div>
          <Button
            onClick={() => setShowSuccessDialog(false)}
            className="w-full mt-4"
            data-testid="button-close-success"
          >
            Close
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
