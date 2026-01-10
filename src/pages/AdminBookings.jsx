import React, { useState } from "react";
import { localApi } from "@/api/localApiClient";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import AdminRoute from "../components/auth/AdminRoute";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar as CalendarIcon, Clock, User, Car, Phone, Mail, Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

export default function AdminBookings() {
  const queryClient = useQueryClient();
  const [selectedDate, setSelectedDate] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showNewBooking, setShowNewBooking] = useState(false);
  const [newBooking, setNewBooking] = useState({
    booking_type: "test_drive",
    scheduled_datetime: "",
    customer_name: "",
    customer_phone: "",
    customer_email: "",
    duration_minutes: 60
  });

  const { data: bookings, isLoading } = useQuery({
    queryKey: ['bookings'],
    queryFn: () => localApi.entities.Booking.list('-scheduled_datetime'),
    initialData: []
  });

  const { data: staff } = useQuery({
    queryKey: ['staff'],
    queryFn: () => localApi.entities.Staff.list(),
    initialData: []
  });

  const updateBookingMutation = useMutation({
    mutationFn: ({ id, data }) => localApi.entities.Booking.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      setSelectedBooking(null);
    }
  });

  const createBookingMutation = useMutation({
    mutationFn: (data) => localApi.entities.Booking.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      setShowNewBooking(false);
      setNewBooking({
        booking_type: "test_drive",
        scheduled_datetime: "",
        customer_name: "",
        customer_phone: "",
        customer_email: "",
        duration_minutes: 60
      });
    }
  });

  const filteredBookings = bookings.filter(booking => {
    const matchesDate = !selectedDate || new Date(booking.scheduled_datetime).toDateString() === new Date(selectedDate).toDateString();
    const matchesStatus = statusFilter === 'all' || booking.status === statusFilter;
    return matchesDate && matchesStatus;
  });

  const statusColors = {
    pending: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    confirmed: "bg-green-500/20 text-green-400 border-green-500/30",
    completed: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    cancelled: "bg-red-500/20 text-red-400 border-red-500/30",
    no_show: "bg-zinc-500/20 text-zinc-400 border-zinc-500/30"
  };

  const groupedBookings = filteredBookings.reduce((acc, booking) => {
    const date = new Date(booking.scheduled_datetime).toLocaleDateString();
    if (!acc[date]) acc[date] = [];
    acc[date].push(booking);
    return acc;
  }, {});

  return (
    <AdminRoute>
      <div className="min-h-screen bg-zinc-950 py-12">
        <div className="container mx-auto px-6">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-zinc-50 mb-2">Bookings</h1>
            <p className="text-zinc-400">{filteredBookings.length} bookings</p>
          </div>
          
          <Dialog open={showNewBooking} onOpenChange={setShowNewBooking}>
            <DialogTrigger asChild>
              <Button className="gradient-red text-zinc-50">
                <Plus className="w-4 h-4 mr-2" />
                New Booking
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-zinc-900 border-zinc-800 text-zinc-50">
              <DialogHeader>
                <DialogTitle>Create New Booking</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-zinc-300 mb-2 block">Booking Type</label>
                  <Select value={newBooking.booking_type} onValueChange={(value) => setNewBooking({...newBooking, booking_type: value})}>
                    <SelectTrigger className="bg-zinc-800 border-zinc-700">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="test_drive">Test Drive</SelectItem>
                      <SelectItem value="inspection">Inspection</SelectItem>
                      <SelectItem value="finance_meeting">Finance Meeting</SelectItem>
                      <SelectItem value="delivery">Delivery</SelectItem>
                      <SelectItem value="consultation">Consultation</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium text-zinc-300 mb-2 block">Date & Time</label>
                  <Input
                    type="datetime-local"
                    value={newBooking.scheduled_datetime}
                    onChange={(e) => setNewBooking({...newBooking, scheduled_datetime: e.target.value})}
                    className="bg-zinc-800 border-zinc-700 text-zinc-50"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-zinc-300 mb-2 block">Customer Name</label>
                  <Input
                    value={newBooking.customer_name}
                    onChange={(e) => setNewBooking({...newBooking, customer_name: e.target.value})}
                    className="bg-zinc-800 border-zinc-700 text-zinc-50"
                    placeholder="Full name"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-zinc-300 mb-2 block">Phone</label>
                  <Input
                    value={newBooking.customer_phone}
                    onChange={(e) => setNewBooking({...newBooking, customer_phone: e.target.value})}
                    className="bg-zinc-800 border-zinc-700 text-zinc-50"
                    placeholder="Phone number"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-zinc-300 mb-2 block">Email (optional)</label>
                  <Input
                    type="email"
                    value={newBooking.customer_email}
                    onChange={(e) => setNewBooking({...newBooking, customer_email: e.target.value})}
                    className="bg-zinc-800 border-zinc-700 text-zinc-50"
                    placeholder="Email address"
                  />
                </div>

                <Button 
                  onClick={() => createBookingMutation.mutate(newBooking)}
                  className="w-full gradient-red text-zinc-50"
                  disabled={!newBooking.customer_name || !newBooking.customer_phone || !newBooking.scheduled_datetime}
                >
                  Create Booking
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <Input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="bg-zinc-800 border-zinc-700 text-zinc-50"
          />
          
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-48 bg-zinc-800 border-zinc-700">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="confirmed">Confirmed</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
              <SelectItem value="no_show">No Show</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Bookings by Date */}
        <div className="space-y-8">
          {isLoading ? (
            <p className="text-zinc-400 text-center py-8">Loading bookings...</p>
          ) : Object.keys(groupedBookings).length === 0 ? (
            <p className="text-zinc-400 text-center py-8">No bookings found</p>
          ) : (
            Object.entries(groupedBookings).map(([date, dateBookings]) => (
              <div key={date}>
                <h3 className="text-xl font-semibold text-zinc-50 mb-4 flex items-center gap-2">
                  <CalendarIcon className="w-5 h-5 text-red-500" />
                  {date}
                </h3>
                
                <div className="space-y-4">
                  {dateBookings.map((booking) => (
                    <Card key={booking.id} className="bg-zinc-900 border-zinc-800 hover:border-zinc-700 transition-colors">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-3">
                              <h4 className="text-lg font-semibold text-zinc-50">{booking.customer_name}</h4>
                              <Badge className={statusColors[booking.status]}>
                                {booking.status}
                              </Badge>
                              <Badge variant="outline" className="text-zinc-400">
                                {booking.booking_type?.replace('_', ' ')}
                              </Badge>
                            </div>
                            
                            <div className="grid md:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <p className="text-sm text-zinc-400 flex items-center gap-2">
                                  <Clock className="w-4 h-4" />
                                  {new Date(booking.scheduled_datetime).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})} ({booking.duration_minutes} mins)
                                </p>
                                <p className="text-sm text-zinc-400 flex items-center gap-2">
                                  <Phone className="w-4 h-4" />
                                  {booking.customer_phone}
                                </p>
                                {booking.customer_email && (
                                  <p className="text-sm text-zinc-400 flex items-center gap-2">
                                    <Mail className="w-4 h-4" />
                                    {booking.customer_email}
                                  </p>
                                )}
                              </div>
                              
                              <div className="space-y-2">
                                {booking.staff_id && (
                                  <p className="text-sm text-zinc-400 flex items-center gap-2">
                                    <User className="w-4 h-4" />
                                    Staff: {staff.find(s => s.id === booking.staff_id)?.full_name || 'Unknown'}
                                  </p>
                                )}
                                {booking.vehicle_id && (
                                  <p className="text-sm text-zinc-400 flex items-center gap-2">
                                    <Car className="w-4 h-4" />
                                    Vehicle ID: {booking.vehicle_id}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                          
                          <Button 
                            onClick={() => setSelectedBooking(booking)}
                            variant="ghost"
                            size="sm"
                            className="text-red-500 hover:bg-red-500/10"
                          >
                            Manage
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Booking Management Modal */}
        <Dialog open={!!selectedBooking} onOpenChange={() => setSelectedBooking(null)}>
          <DialogContent className="bg-zinc-900 border-zinc-800 text-zinc-50 max-w-2xl">
            <DialogHeader>
              <DialogTitle>Manage Booking</DialogTitle>
            </DialogHeader>
            
            {selectedBooking && (
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-zinc-300 mb-2 block">Status</label>
                    <Select 
                      value={selectedBooking.status} 
                      onValueChange={(value) => 
                        updateBookingMutation.mutate({ id: selectedBooking.id, data: { status: value } })
                      }
                    >
                      <SelectTrigger className="bg-zinc-800 border-zinc-700">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="confirmed">Confirmed</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                        <SelectItem value="no_show">No Show</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-zinc-300 mb-2 block">Assign Staff</label>
                    <Select 
                      value={selectedBooking.staff_id || ""} 
                      onValueChange={(value) => 
                        updateBookingMutation.mutate({ id: selectedBooking.id, data: { staff_id: value } })
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
                    value={selectedBooking.notes || ""}
                    onChange={(e) => setSelectedBooking({...selectedBooking, notes: e.target.value})}
                    className="bg-zinc-800 border-zinc-700 text-zinc-50 h-24"
                  />
                  <Button 
                    onClick={() => updateBookingMutation.mutate({ id: selectedBooking.id, data: { notes: selectedBooking.notes } })}
                    className="mt-2 gradient-red text-zinc-50"
                  >
                    Save Notes
                  </Button>
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
