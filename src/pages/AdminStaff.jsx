import React, { useState } from "react";
import { Enquiry, Booking, Staff, CalendarBlock, Vehicle } from "@/api/entities";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import AdminRoute from "../components/auth/AdminRoute";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Mail, Phone, UserCheck, UserX } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export default function AdminStaff() {
  const queryClient = useQueryClient();
  const [showNewStaff, setShowNewStaff] = useState(false);
  const [newStaff, setNewStaff] = useState({
    full_name: "",
    email: "",
    phone: "",
    role: "Sales",
    is_active: true
  });

  const { data: staff, isLoading } = useQuery({
    queryKey: ['staff'],
    queryFn: () => Staff.list('-created_date'),
    initialData: []
  });

  const createStaffMutation = useMutation({
    mutationFn: (data) => Staff.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staff'] });
      setShowNewStaff(false);
      setNewStaff({ full_name: "", email: "", phone: "", role: "Sales", is_active: true });
    }
  });

  const updateStaffMutation = useMutation({
    mutationFn: ({ id, data }) => Staff.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staff'] });
    }
  });

  return (
    <AdminRoute>
      <div className="min-h-screen bg-zinc-950 py-12">
        <div className="container mx-auto px-6">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-zinc-50 mb-2">Staff Management</h1>
            <p className="text-zinc-400">{staff.length} team members</p>
          </div>
          
          <Dialog open={showNewStaff} onOpenChange={setShowNewStaff}>
            <DialogTrigger asChild>
              <Button className="gradient-red text-zinc-50">
                <Plus className="w-4 h-4 mr-2" />
                Add Staff
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-zinc-900 border-zinc-800 text-zinc-50">
              <DialogHeader>
                <DialogTitle>Add New Staff Member</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-zinc-300 mb-2 block">Full Name</label>
                  <Input
                    value={newStaff.full_name}
                    onChange={(e) => setNewStaff({...newStaff, full_name: e.target.value})}
                    className="bg-zinc-800 border-zinc-700 text-zinc-50"
                    placeholder="Enter full name"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-zinc-300 mb-2 block">Email</label>
                  <Input
                    type="email"
                    value={newStaff.email}
                    onChange={(e) => setNewStaff({...newStaff, email: e.target.value})}
                    className="bg-zinc-800 border-zinc-700 text-zinc-50"
                    placeholder="email@example.com"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-zinc-300 mb-2 block">Phone</label>
                  <Input
                    value={newStaff.phone}
                    onChange={(e) => setNewStaff({...newStaff, phone: e.target.value})}
                    className="bg-zinc-800 border-zinc-700 text-zinc-50"
                    placeholder="Phone number"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-zinc-300 mb-2 block">Role</label>
                  <Select value={newStaff.role} onValueChange={(value) => setNewStaff({...newStaff, role: value})}>
                    <SelectTrigger className="bg-zinc-800 border-zinc-700">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Sales">Sales</SelectItem>
                      <SelectItem value="Finance">Finance</SelectItem>
                      <SelectItem value="Manager">Manager</SelectItem>
                      <SelectItem value="Service Advisor">Service Advisor</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button 
                  onClick={() => createStaffMutation.mutate(newStaff)}
                  className="w-full gradient-red text-zinc-50"
                  disabled={!newStaff.full_name || !newStaff.email || !newStaff.role}
                >
                  Add Staff Member
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Staff List */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            <p className="text-zinc-400 col-span-full text-center py-8">Loading staff...</p>
          ) : staff.length === 0 ? (
            <p className="text-zinc-400 col-span-full text-center py-8">No staff members found</p>
          ) : (
            staff.map((member) => (
              <Card key={member.id} className="bg-zinc-900 border-zinc-800">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-zinc-50 mb-1">{member.full_name}</h3>
                      <Badge variant="outline" className="text-zinc-400">
                        {member.role}
                      </Badge>
                    </div>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => updateStaffMutation.mutate({ 
                        id: member.id, 
                        data: { is_active: !member.is_active } 
                      })}
                      className={member.is_active ? "text-green-500" : "text-red-500"}
                    >
                      {member.is_active ? <UserCheck className="w-4 h-4" /> : <UserX className="w-4 h-4" />}
                    </Button>
                  </div>
                  
                  <div className="space-y-2">
                    <p className="text-sm text-zinc-400 flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      {member.email}
                    </p>
                    {member.phone && (
                      <p className="text-sm text-zinc-400 flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        {member.phone}
                      </p>
                    )}
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-zinc-800">
                    <Badge className={member.is_active ? "bg-green-500/20 text-green-400 border-green-500/30" : "bg-red-500/20 text-red-400 border-red-500/30"}>
                      {member.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
        </div>
      </div>
    </AdminRoute>
  );
}