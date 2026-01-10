import React, { useState } from "react";
import { localApi } from "@/api/localApiClient";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import AdminRoute from "../components/auth/AdminRoute";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Download, Eye, Phone, Mail } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

export default function AdminEnquiries() {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);

  const { data: enquiries, isLoading } = useQuery({
    queryKey: ['enquiries'],
    queryFn: () => localApi.entities.Enquiry.list('-created_date'),
    initialData: []
  });

  const { data: staff } = useQuery({
    queryKey: ['staff'],
    queryFn: () => localApi.entities.Staff.list(),
    initialData: []
  });

  const updateEnquiryMutation = useMutation({
    mutationFn: ({ id, data }) => localApi.entities.Enquiry.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['enquiries'] });
      setSelectedEnquiry(null);
    }
  });

  const filteredEnquiries = enquiries.filter(enquiry => {
    const searchableText = `
      ${enquiry.firstName || ''} 
      ${enquiry.lastName || ''} 
      ${enquiry.email || ''} 
      ${enquiry.mobile || ''} 
      ${enquiry.message || ''} 
      ${enquiry.vehicleDetails || ''} 
      ${enquiry.tradeInMake || ''} 
      ${enquiry.tradeInModel || ''} 
      ${enquiry.tradeInYear || ''}
      ${enquiry.internalNotes || ''}
    `.toLowerCase();
    const matchesSearch = searchableText.includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || enquiry.status === statusFilter;
    const matchesType = typeFilter === 'all' || enquiry.enquiry_type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  const handleExportCSV = () => {
    const headers = ['ID', 'Date', 'Name', 'Email', 'Phone', 'Type', 'Status', 'Vehicle', 'Message'];
    const rows = filteredEnquiries.map(e => [
      e.id,
      new Date(e.created_date).toLocaleDateString(),
      `${e.firstName} ${e.lastName}`,
      e.email,
      e.mobile,
      e.enquiry_type,
      e.status,
      e.vehicleDetails || '',
      e.message || ''
    ]);
    
    const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `enquiries-${new Date().toISOString()}.csv`;
    a.click();
  };

  const statusColors = {
    new: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    contacted: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    qualified: "bg-purple-500/20 text-purple-400 border-purple-500/30",
    appointment_set: "bg-green-500/20 text-green-400 border-green-500/30",
    lost: "bg-red-500/20 text-red-400 border-red-500/30",
    closed_won: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    closed_lost: "bg-zinc-500/20 text-zinc-400 border-zinc-500/30"
  };

  return (
    <AdminRoute>
      <div className="min-h-screen bg-zinc-950 py-12">
        <div className="container mx-auto px-6">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-zinc-50 mb-2">Enquiries</h1>
            <p className="text-zinc-400">{filteredEnquiries.length} enquiries</p>
          </div>
          <Button onClick={handleExportCSV} variant="outline" className="bg-transparent border-zinc-700 text-zinc-300">
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400 w-5 h-5" />
            <Input
              placeholder="Search by name, email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-zinc-800 border-zinc-700 text-zinc-50"
            />
          </div>
          
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-48 bg-zinc-800 border-zinc-700">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="new">New</SelectItem>
              <SelectItem value="contacted">Contacted</SelectItem>
              <SelectItem value="qualified">Qualified</SelectItem>
              <SelectItem value="appointment_set">Appointment Set</SelectItem>
              <SelectItem value="closed_won">Closed Won</SelectItem>
              <SelectItem value="closed_lost">Closed Lost</SelectItem>
            </SelectContent>
          </Select>

          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-48 bg-zinc-800 border-zinc-700">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="vehicle_interest">Vehicle Interest</SelectItem>
              <SelectItem value="test_drive">Test Drive</SelectItem>
              <SelectItem value="finance">Finance</SelectItem>
              <SelectItem value="trade_in">Trade In</SelectItem>
              <SelectItem value="general">General</SelectItem>
              <SelectItem value="sell_vehicle">Sell Vehicle</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Enquiries List */}
        <div className="space-y-4">
          {isLoading ? (
            <p className="text-zinc-400 text-center py-8">Loading enquiries...</p>
          ) : filteredEnquiries.length === 0 ? (
            <p className="text-zinc-400 text-center py-8">No enquiries found</p>
          ) : (
            filteredEnquiries.map((enquiry) => (
              <Card key={enquiry.id} className="bg-zinc-900 border-zinc-800 hover:border-zinc-700 transition-colors">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <h3 className="text-lg font-semibold text-zinc-50">
                          {enquiry.firstName} {enquiry.lastName}
                        </h3>
                        <Badge className={statusColors[enquiry.status]}>
                          {enquiry.status.replace('_', ' ')}
                        </Badge>
                        <Badge variant="outline" className="text-zinc-400">
                          {enquiry.enquiry_type?.replace('_', ' ')}
                        </Badge>
                      </div>
                      
                      <div className="grid md:grid-cols-2 gap-4 mb-4">
                        <div className="space-y-1">
                          <p className="text-sm text-zinc-400 flex items-center gap-2">
                            <Mail className="w-4 h-4" />
                            {enquiry.email || 'No email'}
                          </p>
                          <p className="text-sm text-zinc-400 flex items-center gap-2">
                            <Phone className="w-4 h-4" />
                            {enquiry.mobile || 'No phone'}
                          </p>
                        </div>
                        
                        <div className="space-y-1">
                          <p className="text-sm text-zinc-400">
                            <span className="font-medium">Vehicle:</span> {enquiry.vehicleDetails || 'None'}
                          </p>
                          <p className="text-sm text-zinc-400">
                            <span className="font-medium">Date:</span> {new Date(enquiry.created_date).toLocaleDateString()}
                          </p>
                          <p className="text-sm text-zinc-400">
                            <span className="font-medium">Assigned to:</span> {staff.find(s => s.id === enquiry.assignedStaffId)?.full_name || 'Unassigned'}
                          </p>
                        </div>
                      </div>
                      
                      {enquiry.message && (
                        <p className="text-sm text-zinc-400 mb-4 line-clamp-2">{enquiry.message}</p>
                      )}
                    </div>
                    
                    <Button 
                      onClick={() => setSelectedEnquiry(enquiry)}
                      variant="ghost"
                      size="sm"
                      className="text-red-500 hover:bg-red-500/10"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Enquiry Detail Modal */}
        <Dialog open={!!selectedEnquiry} onOpenChange={() => setSelectedEnquiry(null)}>
          <DialogContent className="bg-zinc-900 border-zinc-800 text-zinc-50 max-w-3xl">
            <DialogHeader>
              <DialogTitle>Enquiry Details</DialogTitle>
            </DialogHeader>
            
            {selectedEnquiry && (
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm font-medium text-zinc-300 mb-2 block">Status</label>
                    <Select 
                      value={selectedEnquiry.status} 
                      onValueChange={(value) => 
                        updateEnquiryMutation.mutate({ 
                          id: selectedEnquiry.id, 
                          data: { status: value, contactedAt: value === 'contacted' && !selectedEnquiry.contactedAt ? new Date().toISOString() : selectedEnquiry.contactedAt } 
                        })
                      }
                    >
                      <SelectTrigger className="bg-zinc-800 border-zinc-700">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="new">New</SelectItem>
                        <SelectItem value="contacted">Contacted</SelectItem>
                        <SelectItem value="qualified">Qualified</SelectItem>
                        <SelectItem value="appointment_set">Appointment Set</SelectItem>
                        <SelectItem value="closed_won">Closed Won</SelectItem>
                        <SelectItem value="closed_lost">Closed Lost</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-zinc-300 mb-2 block">Assign to Staff</label>
                    <Select 
                      value={selectedEnquiry.assignedStaffId || ""} 
                      onValueChange={(value) => 
                        updateEnquiryMutation.mutate({ id: selectedEnquiry.id, data: { assignedStaffId: value } })
                      }
                    >
                      <SelectTrigger className="bg-zinc-800 border-zinc-700">
                        <SelectValue placeholder="Select staff" />
                      </SelectTrigger>
                      <SelectContent>
                        {staff.map(s => (
                          <SelectItem key={s.id} value={s.id}>{s.full_name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-zinc-300 mb-2 block">Internal Notes</label>
                  <Textarea
                    value={selectedEnquiry.internalNotes || ""}
                    onChange={(e) => setSelectedEnquiry({...selectedEnquiry, internalNotes: e.target.value})}
                    className="bg-zinc-800 border-zinc-700 text-zinc-50 h-32"
                    placeholder="Add internal notes..."
                  />
                  <Button 
                    onClick={() => updateEnquiryMutation.mutate({ 
                      id: selectedEnquiry.id, 
                      data: { internalNotes: selectedEnquiry.internalNotes } 
                    })}
                    className="mt-2 gradient-red text-zinc-50"
                  >
                    Save Notes
                  </Button>
                </div>

                <div className="grid md:grid-cols-2 gap-4 pt-4 border-t border-zinc-800">
                  <div>
                    <p className="text-sm text-zinc-400 mb-1">Customer Message</p>
                    <p className="text-zinc-300">{selectedEnquiry.message || 'No message'}</p>
                  </div>
                  
                  {selectedEnquiry.hasTradein && (
                    <div>
                      <p className="text-sm text-zinc-400 mb-1">Trade-In</p>
                      <p className="text-zinc-300">
                        {selectedEnquiry.tradeInYear} {selectedEnquiry.tradeInMake} {selectedEnquiry.tradeInModel}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
        </div>
      </div>
    </AdminRoute>
  );
}
