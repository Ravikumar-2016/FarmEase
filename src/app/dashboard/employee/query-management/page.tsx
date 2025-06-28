"use client"

import type React from "react";
import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/text-area";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  MessageSquare,
  ArrowLeft,
  User,
  Calendar,
  CheckCircle,
  Clock,
  AlertCircle,
  Loader2,
  Send,
  Eye,
  Trash2,
  PlayCircle,
} from "lucide-react";

interface Query {
  _id: string;
  queryId: string;
  submitterName: string;
  submitterUsername: string;
  userType: "farmer" | "labour";
  subject: string;
  message: string;
  status: "pending" | "in-progress" | "resolved";
  assignedEmployee?: string;
  response?: string;
  submittedAt: string;
  respondedAt?: string;
}

interface SuccessMessage {
  show: boolean;
  message: string;
  type: "success" | "error";
}

interface DeleteConfirmation {
  isOpen: boolean;
  queryId: string | null;
  title: string;
}

export default function QueryManagementPage() {
  const router = useRouter();
  const mobileFormRef = useRef<HTMLDivElement>(null);
  const [queries, setQueries] = useState<Query[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState("");
  const [selectedQuery, setSelectedQuery] = useState<Query | null>(null);
  const [queryResponse, setQueryResponse] = useState("");
  const [queryStatus, setQueryStatus] = useState<"pending" | "in-progress" | "resolved">("in-progress");
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<SuccessMessage>({ show: false, message: "", type: "success" });
  const [deleteConfirmation, setDeleteConfirmation] = useState<DeleteConfirmation>({
    isOpen: false,
    queryId: null,
    title: "",
  });

  const showMessage = useCallback((message: string, type: "success" | "error" = "success") => {
    setSuccessMessage({ show: true, message, type });
    setTimeout(() => {
      setSuccessMessage({ show: false, message: "", type: "success" });
    }, 4000);
  }, []);

  const fetchQueries = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/queries");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setQueries(data.queries || []);
    } catch (err) {
      console.error("Error fetching queries:", err);
      showMessage("Failed to fetch queries. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  }, [showMessage]);

  useEffect(() => {
    const userType = localStorage.getItem("userType");
    const username = localStorage.getItem("username");

    if (!userType || !username || userType !== "employee") {
      router.push("/login");
      return;
    }

    setCurrentUser(username);
    fetchQueries();
  }, [router, fetchQueries]);

  const handleQueryResponse = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedQuery) return;

    if (queryResponse.length < 10) {
      showMessage("Response must be at least 10 characters long", "error");
      return;
    }

    if (queryStatus !== "resolved") {
      showMessage("Cannot submit response. Please mark the query as resolved before submitting.", "error");
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch("/api/queries", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          queryId: selectedQuery.queryId,
          status: queryStatus,
          response: queryResponse,
          assignedEmployee: currentUser,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      setQueries((prevQueries) =>
        prevQueries.map((query) =>
          query.queryId === selectedQuery.queryId
            ? {
                ...query,
                status: "resolved",
                response: queryResponse,
                assignedEmployee: currentUser,
                respondedAt: new Date().toISOString(),
              }
            : query
        )
      );

      setSelectedQuery(null);
      setQueryResponse("");
      setQueryStatus("in-progress");
      showMessage("Query response submitted successfully!", "success");
    } catch (err) {
      console.error("Error responding to query:", err);
      showMessage("Failed to submit query response. Please try again.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleMobileRespond = (query: Query) => {
    setSelectedQuery(query);
    setQueryResponse(query.response || "");
    setQueryStatus(query.status);

    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 100);
  };

  const handleMoveToInProgress = async (query: Query) => {
    try {
      const response = await fetch("/api/queries", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          queryId: query.queryId,
          status: "in-progress",
          assignedEmployee: currentUser,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      fetchQueries();
      showMessage("Query moved to in-progress successfully!", "success");
    } catch (err) {
      console.error("Error updating query:", err);
      showMessage("Failed to update query status. Please try again.", "error");
    }
  };

  const showDeleteConfirmation = (queryId: string, title: string) => {
    setDeleteConfirmation({
      isOpen: true,
      queryId,
      title,
    });
  };

  const handleDeleteQuery = async () => {
    if (!deleteConfirmation.queryId) return;

    try {
      const response = await fetch(`/api/queries?queryId=${deleteConfirmation.queryId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      fetchQueries();
      showMessage("Query deleted successfully!", "success");
    } catch (err) {
      console.error("Error deleting query:", err);
      showMessage("Failed to delete query. Please try again.", "error");
    } finally {
      setDeleteConfirmation({
        isOpen: false,
        queryId: null,
        title: "",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 border-yellow-300">
            <Clock className="h-3 w-3 mr-1" />
            Pending
          </Badge>
        );
      case "in-progress":
        return (
          <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-300">
            <AlertCircle className="h-3 w-3 mr-1" />
            In Progress
          </Badge>
        );
      case "resolved":
        return (
          <Badge variant="default" className="bg-green-100 text-green-800 border-green-300">
            <CheckCircle className="h-3 w-3 mr-1" />
            Resolved
          </Badge>
        );
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getUserTypeBadge = (userType: string) => {
    return (
      <Badge
        variant="outline"
        className={`text-xs ${
          userType === "farmer"
            ? "bg-green-50 text-green-700 border-green-200"
            : "bg-blue-50 text-blue-700 border-blue-200"
        }`}
      >
        {userType === "farmer" ? "👨‍🌾 Farmer" : "👷 Labour"}
      </Badge>
    );
  };

  const getQueryActions = (query: Query) => {
    switch (query.status) {
      case "pending":
        return (
          <Button
            size="sm"
            variant="outline"
            onClick={(e) => {
              e.stopPropagation();
              handleMoveToInProgress(query);
            }}
            className="bg-blue-50 text-blue-700 border-blue-300 hover:bg-blue-100"
          >
            <PlayCircle className="h-4 w-4 mr-1" />
            Start Progress
          </Button>
        );
      case "in-progress":
        return (
          <Button
            size="sm"
            variant="outline"
            onClick={(e) => {
              e.stopPropagation();
              if (window.innerWidth < 1024) {
                handleMobileRespond(query);
              } else {
                setSelectedQuery(query);
                setQueryResponse(query.response || "");
                setQueryStatus(query.status);
              }
            }}
            className="bg-green-50 text-green-700 border-green-300 hover:bg-green-100"
          >
            <Send className="h-4 w-4 mr-1" />
            Respond
          </Button>
        );
      case "resolved":
        return (
          <Button
            size="sm"
            variant="outline"
            onClick={(e) => {
              e.stopPropagation();
              showDeleteConfirmation(query.queryId, query.subject);
            }}
            className="bg-red-50 text-red-700 border-red-300 hover:bg-red-100"
          >
            <Trash2 className="h-4 w-4 mr-1" />
            Delete
          </Button>
        );
      default:
        return null;
    }
  };

  const canEditQuery = (query: Query) => {
    return query.status === "in-progress";
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading Queries...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {successMessage.show && (
        <div
          className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg flex items-center space-x-2 ${
            successMessage.type === "success" ? "bg-green-500 text-white" : "bg-red-500 text-white"
          }`}
        >
          {successMessage.type === "success" ? (
            <CheckCircle className="h-5 w-5" />
          ) : (
            <AlertCircle className="h-5 w-5" />
          )}
          <span>{successMessage.message}</span>
        </div>
      )}

      <div className="hidden lg:block bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                onClick={() => router.push("/dashboard/employee")}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back to Dashboard</span>
              </Button>
            </div>
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <MessageSquare className="h-6 w-6 text-green-600" />
              </div>
              <div className="text-center">
                <h1 className="text-2xl font-bold text-gray-900">Query Management</h1>
                <p className="text-gray-600">Respond to user queries and support requests</p>
              </div>
            </div>
            <div className="w-32"></div>
          </div>
        </div>
      </div>

      <div className="lg:hidden bg-white shadow-sm border-b">
        <div className="px-4 py-4">
          <div className="flex items-center justify-center space-x-4">
            <Button
              variant="ghost"
              onClick={() => router.push("/dashboard/employee")}
              className="flex items-center space-x-1 p-2"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="text-sm">Back</span>
            </Button>
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-green-100 rounded-lg">
                <MessageSquare className="h-5 w-5 text-green-600" />
              </div>
              <h1 className="text-lg font-bold text-gray-900">Query Management</h1>
            </div>
          </div>
          <p className="text-sm text-gray-600 text-center mt-2">
            Respond to user queries
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        <div className="hidden lg:grid lg:grid-cols-2 lg:gap-8">
          <Card className="shadow-lg border-0">
            <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-t-lg">
              <CardTitle className="flex items-center gap-2 text-xl">
                <MessageSquare className="h-5 w-5" />
                User Queries ({queries.length})
              </CardTitle>
              <CardDescription>Click on a query to respond or manage</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[600px]">
                <div className="p-6 space-y-4">
                  {queries.map((query) => (
                    <div
                      key={query._id}
                      className={`p-4 border-2 rounded-lg cursor-pointer transition-all hover:shadow-md ${
                        selectedQuery?.queryId === query.queryId
                          ? "border-green-500 bg-green-50"
                          : "bg-white hover:bg-gray-50 border-gray-200"
                      }`}
                      onClick={() => {
                        if (canEditQuery(query)) {
                          setSelectedQuery(query);
                          setQueryResponse(query.response || "");
                          setQueryStatus(query.status);
                        }
                      }}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <h4 className="font-semibold text-base">{query.subject}</h4>
                          {getStatusBadge(query.status)}
                        </div>
                        <div className="flex items-center gap-2">
                          {getUserTypeBadge(query.userType)}
                          {getQueryActions(query)}
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2 leading-relaxed">{query.message}</p>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <div className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          <span>{query.submitterName}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          <span>{formatDate(query.submittedAt)}</span>
                        </div>
                      </div>
                      {query.assignedEmployee && (
                        <div className="mt-2 text-xs text-blue-600">Assigned to: {query.assignedEmployee}</div>
                      )}
                    </div>
                  ))}
                  {queries.length === 0 && (
                    <div className="text-center py-12">
                      <MessageSquare className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500 text-lg">No queries yet</p>
                      <p className="text-sm text-gray-400">User queries will appear here</p>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-lg">
              <CardTitle className="text-xl">{selectedQuery ? "Respond to Query" : "Select a Query"}</CardTitle>
              <CardDescription>
                {selectedQuery
                  ? "Provide a response to the selected query"
                  : "Click on an in-progress query to respond"}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              {selectedQuery ? (
                <div className="space-y-6">
                  <div className="p-4 bg-gray-50 rounded-lg border-l-4 border-green-500">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold text-lg">{selectedQuery.subject}</h4>
                      {getStatusBadge(selectedQuery.status)}
                    </div>
                    <p className="text-sm text-gray-700 mb-4 leading-relaxed">{selectedQuery.message}</p>
                    <div className="grid grid-cols-2 gap-4 text-xs text-gray-500">
                      <div>
                        <strong>From:</strong> {selectedQuery.submitterName} ({selectedQuery.userType})
                      </div>
                      <div>
                        <strong>Submitted:</strong> {formatDate(selectedQuery.submittedAt)}
                      </div>
                    </div>
                  </div>
                  {selectedQuery.response && (
                    <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                      <h5 className="font-semibold text-blue-900 mb-2">Previous Response:</h5>
                      <p className="text-sm text-blue-800 mb-2">{selectedQuery.response}</p>
                      {selectedQuery.respondedAt && (
                        <p className="text-xs text-blue-600">
                          Responded on: {formatDate(selectedQuery.respondedAt)} by {selectedQuery.assignedEmployee}
                        </p>
                      )}
                    </div>
                  )}
                  {canEditQuery(selectedQuery) ? (
                    <form onSubmit={handleQueryResponse} className="space-y-4">
                      <div>
                        <Label htmlFor="status" className="text-sm font-medium text-gray-700">
                          Status
                        </Label>
                        <Select
                          value={queryStatus}
                          onValueChange={(value: "pending" | "in-progress" | "resolved") => setQueryStatus(value)}
                        >
                          <SelectTrigger className="mt-1 h-12 border-gray-300 focus:border-green-500 focus:ring-green-500 bg-white">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="max-h-60 bg-white border border-gray-200 shadow-lg z-[100]">
                            <SelectItem value="in-progress" className="py-3 px-4 hover:bg-blue-50 cursor-pointer">
                              🔄 In Progress
                            </SelectItem>
                            <SelectItem value="resolved" className="py-3 px-4 hover:bg-green-50 cursor-pointer">
                              ✅ Resolved
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        {queryStatus !== "resolved" && (
                          <p className="text-xs text-amber-600 mt-1">
                            &#9888;&#65039; Response can only be submitted when status is &quot;Resolved&quot;
                          </p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="response" className="text-sm font-medium text-gray-700">
                          Response *
                        </Label>
                        <Textarea
                          id="response"
                          value={queryResponse}
                          onChange={(e) => setQueryResponse(e.target.value)}
                          placeholder="Enter your response to the query"
                          rows={6}
                          className="mt-1"
                          required
                        />
                      </div>
                      <Button
                        type="submit"
                        disabled={submitting || queryStatus !== "resolved"}
                        className={`w-full ${queryStatus === "resolved" ? "bg-green-600 hover:bg-green-700" : "bg-gray-400 cursor-not-allowed"}`}
                      >
                        {submitting ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Sending Response...
                          </>
                        ) : (
                          <>
                            <Send className="mr-2 h-4 w-4" />
                            Send Response
                          </>
                        )}
                      </Button>
                    </form>
                  ) : (
                    <div className="text-center py-8 bg-gray-50 rounded-lg">
                      <Eye className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600 font-medium">
                        {selectedQuery.status === "resolved" ? "Query Resolved" : "Query View Only"}
                      </p>
                      <p className="text-sm text-gray-500">
                        {selectedQuery.status === "resolved"
                          ? "This query has been resolved and cannot be edited."
                          : "Only in-progress queries can be edited."}
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-16">
                  <MessageSquare className="h-16 w-16 text-gray-300 mx-auto mb-6" />
                  <p className="text-gray-500 text-lg font-medium">Select a query to manage</p>
                  <p className="text-sm text-gray-400">Click on any query from the list to start managing</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="lg:hidden space-y-6">
          {selectedQuery && canEditQuery(selectedQuery) && (
            <div ref={mobileFormRef}>
              <Card className="shadow-lg border-0">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-lg">
                  <CardTitle className="text-lg">Respond to Query</CardTitle>
                  <CardDescription className="text-sm">Provide your response</CardDescription>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="space-y-4">
                    <div className="p-3 bg-gray-50 rounded-lg border-l-4 border-green-500">
                      <h4 className="font-semibold text-sm mb-2">{selectedQuery.subject}</h4>
                      <p className="text-sm text-gray-700 mb-2">{selectedQuery.message}</p>
                      <p className="text-xs text-gray-500">
                        From: {selectedQuery.submitterName} ({selectedQuery.userType})
                      </p>
                    </div>

                    <form onSubmit={handleQueryResponse} className="space-y-4">
                      <div>
                        <Label htmlFor="mobile-status" className="text-sm font-medium text-gray-700">
                          Status
                        </Label>
                        <Select
                          value={queryStatus}
                          onValueChange={(value: "pending" | "in-progress" | "resolved") => setQueryStatus(value)}
                        >
                          <SelectTrigger className="mt-1 h-12 border-gray-300 focus:border-green-500 focus:ring-green-500 bg-white">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="max-h-60 bg-white border border-gray-200 shadow-lg z-[100]">
                            <SelectItem value="in-progress" className="py-3 px-4 hover:bg-blue-50 cursor-pointer">
                              🔄 In Progress
                            </SelectItem>
                            <SelectItem value="resolved" className="py-3 px-4 hover:bg-green-50 cursor-pointer">
                              ✅ Resolved
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        {queryStatus !== "resolved" && (
                          <p className="text-xs text-amber-600 mt-1">
                            &#9888;&#65039; Response can only be submitted when status is &quot;Resolved&quot;
                          </p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="mobile-response" className="text-sm font-medium text-gray-700">
                          Response *
                        </Label>
                        <Textarea
                          id="mobile-response"
                          value={queryResponse}
                          onChange={(e) => setQueryResponse(e.target.value)}
                          placeholder="Enter your response"
                          rows={4}
                          className="mt-1"
                          required
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button
                          type="submit"
                          disabled={submitting || queryStatus !== "resolved"}
                          className={`flex-1 ${queryStatus === "resolved" ? "bg-green-600 hover:bg-green-700" : "bg-gray-400 cursor-not-allowed"}`}
                        >
                          {submitting ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Sending...
                            </>
                          ) : (
                            <>
                              <Send className="mr-2 h-4 w-4" />
                              Send Response
                            </>
                          )}
                        </Button>
                        <Button type="button" variant="outline" onClick={() => setSelectedQuery(null)} className="px-4">
                          Cancel
                        </Button>
                      </div>
                    </form>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          <Card className="shadow-lg border-0">
            <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-t-lg">
              <CardTitle className="flex items-center gap-2 text-lg">
                <MessageSquare className="h-5 w-5" />
                User Queries ({queries.length})
              </CardTitle>
              <CardDescription className="text-sm">Tap on a query to manage</CardDescription>
            </CardHeader>
            <CardContent className="p-4">
              <div className="space-y-4">
                {queries.map((query) => (
                  <div key={query._id} className="p-4 border rounded-lg bg-white">
                    <div className="flex items-start justify-between mb-3">
                      <h4 className="font-semibold text-sm">{query.subject}</h4>
                      {getStatusBadge(query.status)}
                    </div>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">{query.message}</p>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        {getUserTypeBadge(query.userType)}
                        <span className="text-xs text-gray-500">{query.submitterName}</span>
                      </div>
                      <span className="text-xs text-gray-500">{formatDate(query.submittedAt)}</span>
                    </div>
                    <div className="flex justify-end">{getQueryActions(query)}</div>
                  </div>
                ))}
                {queries.length === 0 && (
                  <div className="text-center py-8">
                    <MessageSquare className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No queries yet</p>
                    <p className="text-sm text-gray-400">User queries will appear here</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {deleteConfirmation.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="p-2 bg-red-100 rounded-full mr-3">
                  <Trash2 className="h-6 w-6 text-red-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Delete Query</h3>
              </div>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete the query &quot;{deleteConfirmation.title}&quot;? This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setDeleteConfirmation({ isOpen: false, queryId: null, title: "" })}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button onClick={handleDeleteQuery} className="flex-1 bg-red-600 hover:bg-red-700 text-white">
                  Delete Query
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}