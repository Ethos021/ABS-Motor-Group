import React, { useState } from "react";
import { Enquiry, Booking, Staff, CalendarBlock, Vehicle } from "@/api/entities";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import AdminRoute from "../components/auth/AdminRoute";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Calendar as CalendarIcon, Clock, Repeat, X, ChevronLeft, ChevronRight } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { startOfMonth, endOfMonth, eachDayOfInterval, format, isSameMonth, isSameDay, addMonths, subMonths, startOfWeek, endOfWeek } from "date-fns";

export default function AdminCalendar() {
  const queryClient = useQueryClient();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [showNewBlock, setShowNewBlock] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedBlock, setSelectedBlock] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [newBlock, setNewBlock] = useState({
    title: "",
    start_datetime: "",
    end_datetime: "",
    is_recurring: false,
    recurrence_pattern: "weekly",
    block_type: "holiday",
    notes: "",
    is_active: true
  });

  const { data: blocks, isLoading } = useQuery({
    queryKey: ['calendarBlocks'],
    queryFn: () => CalendarBlock.list('-start_datetime'),
    initialData: []
  });

  const { data: staff } = useQuery({
    queryKey: ['staff'],
    queryFn: () => Staff.list(),
    initialData: []
  });

  const createBlockMutation = useMutation({
    mutationFn: (data) => CalendarBlock.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['calendarBlocks'] });
      setShowNewBlock(false);
      setNewBlock({
        title: "",
        start_datetime: "",
        end_datetime: "",
        is_recurring: false,
        recurrence_pattern: "weekly",
        block_type: "holiday",
        notes: "",
        is_active: true
      });
    }
  });

  const updateBlockMutation = useMutation({
    mutationFn: ({ id, data }) => CalendarBlock.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['calendarBlocks'] });
      setSelectedBlock(null);
      setIsEditing(false);
    }
  });

  const deleteBlockMutation = useMutation({
    mutationFn: (id) => CalendarBlock.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['calendarBlocks'] });
      setSelectedBlock(null);
    }
  });

  const blockTypeColors = {
    holiday: "bg-red-500/20 text-red-400 border-red-500/30",
    meeting: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    maintenance: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    training: "bg-purple-500/20 text-purple-400 border-purple-500/30",
    other: "bg-zinc-500/20 text-zinc-400 border-zinc-500/30"
  };

  const activeBlocks = blocks.filter(b => b.is_active);

  // Get calendar days
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);
  const calendarDays = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  // Check if a day has blocks
  const getBlocksForDay = (day) => {
    return activeBlocks.filter(block => {
      const blockStart = new Date(block.start_datetime);
      const blockEnd = new Date(block.end_datetime);
      return day >= new Date(blockStart.toDateString()) && day <= new Date(blockEnd.toDateString());
    });
  };

  const handleDayClick = (day) => {
    setSelectedDate(day);
    setNewBlock({
      ...newBlock,
      start_datetime: format(day, "yyyy-MM-dd'T'09:00"),
      end_datetime: format(day, "yyyy-MM-dd'T'17:00")
    });
    setShowNewBlock(true);
  };

  return (
    <AdminRoute>
      <div className="min-h-screen bg-zinc-950 py-12">
        <div className="container mx-auto px-6">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-zinc-50 mb-2">Calendar Blocks</h1>
            <p className="text-zinc-400">{activeBlocks.length} active blocks</p>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
                className="bg-zinc-800 border-zinc-700 text-zinc-300"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <span className="text-zinc-50 font-semibold min-w-[150px] text-center">
                {format(currentMonth, 'MMMM yyyy')}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
                className="bg-zinc-800 border-zinc-700 text-zinc-300"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
            
          <Dialog open={showNewBlock} onOpenChange={setShowNewBlock}>
            <DialogTrigger asChild>
              <Button className="gradient-red text-zinc-50">
                <Plus className="w-4 h-4 mr-2" />
                Add Block
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-zinc-900 border-zinc-800 text-zinc-50 max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create Calendar Block</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-zinc-300 mb-2 block">Title</label>
                  <Input
                    value={newBlock.title}
                    onChange={(e) => setNewBlock({...newBlock, title: e.target.value})}
                    className="bg-zinc-800 border-zinc-700 text-zinc-50"
                    placeholder="e.g., Public Holiday, Staff Meeting"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-zinc-300 mb-2 block">Start Date & Time</label>
                    <Input
                      type="datetime-local"
                      value={newBlock.start_datetime}
                      onChange={(e) => setNewBlock({...newBlock, start_datetime: e.target.value})}
                      className="bg-zinc-800 border-zinc-700 text-zinc-50"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-zinc-300 mb-2 block">End Date & Time</label>
                    <Input
                      type="datetime-local"
                      value={newBlock.end_datetime}
                      onChange={(e) => setNewBlock({...newBlock, end_datetime: e.target.value})}
                      className="bg-zinc-800 border-zinc-700 text-zinc-50"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-zinc-300 mb-2 block">Block Type</label>
                  <Select value={newBlock.block_type} onValueChange={(value) => setNewBlock({...newBlock, block_type: value})}>
                    <SelectTrigger className="bg-zinc-800 border-zinc-700">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="holiday">Holiday</SelectItem>
                      <SelectItem value="meeting">Meeting</SelectItem>
                      <SelectItem value="maintenance">Maintenance</SelectItem>
                      <SelectItem value="training">Training</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    checked={newBlock.is_recurring}
                    onCheckedChange={(checked) => setNewBlock({...newBlock, is_recurring: checked})}
                  />
                  <label className="text-sm font-medium text-zinc-300">Recurring Block</label>
                </div>

                {newBlock.is_recurring && (
                  <div>
                    <label className="text-sm font-medium text-zinc-300 mb-2 block">Recurrence Pattern</label>
                    <Select value={newBlock.recurrence_pattern} onValueChange={(value) => setNewBlock({...newBlock, recurrence_pattern: value})}>
                      <SelectTrigger className="bg-zinc-800 border-zinc-700">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                        <SelectItem value="yearly">Yearly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <div>
                  <label className="text-sm font-medium text-zinc-300 mb-2 block">Notes</label>
                  <Textarea
                    value={newBlock.notes}
                    onChange={(e) => setNewBlock({...newBlock, notes: e.target.value})}
                    className="bg-zinc-800 border-zinc-700 text-zinc-50"
                    placeholder="Additional details..."
                  />
                </div>

                <Button 
                  onClick={() => createBlockMutation.mutate(newBlock)}
                  className="w-full gradient-red text-zinc-50"
                  disabled={!newBlock.title || !newBlock.start_datetime || !newBlock.end_datetime}
                >
                  Create Block
                </Button>
              </div>
            </DialogContent>
          </Dialog>
          </div>
        </div>

        {/* Calendar Grid */}
        <Card className="bg-zinc-900 border-zinc-800 mb-8">
          <CardContent className="p-6">
            {/* Weekday Headers */}
            <div className="grid grid-cols-7 gap-2 mb-4">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                <div key={day} className="text-center text-sm font-semibold text-zinc-400 py-2">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Days */}
            <div className="grid grid-cols-7 gap-2">
              {calendarDays.map((day, index) => {
                const dayBlocks = getBlocksForDay(day);
                const isCurrentMonth = isSameMonth(day, currentMonth);
                const isToday = isSameDay(day, new Date());

                return (
                  <div
                    key={index}
                    onClick={() => handleDayClick(day)}
                    className={`
                      min-h-[100px] p-2 rounded-lg border cursor-pointer transition-all
                      ${isCurrentMonth ? 'bg-zinc-800 border-zinc-700' : 'bg-zinc-900/50 border-zinc-800'}
                      ${isToday ? 'ring-2 ring-red-500' : ''}
                      hover:bg-zinc-700
                    `}
                  >
                    <div className={`text-sm font-semibold mb-2 ${isCurrentMonth ? 'text-zinc-50' : 'text-zinc-600'}`}>
                      {format(day, 'd')}
                    </div>
                    
                    {dayBlocks.length > 0 && (
                      <div className="space-y-1">
                        {dayBlocks.slice(0, 2).map((block) => (
                          <div
                            key={block.id}
                            className={`text-xs p-1 rounded truncate ${blockTypeColors[block.block_type]} hover:opacity-80`}
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedBlock(block);
                              setIsEditing(false);
                            }}
                          >
                            {block.title}
                          </div>
                        ))}
                        {dayBlocks.length > 2 && (
                          <div className="text-xs text-zinc-500">
                            +{dayBlocks.length - 2} more
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Legend */}
        <div className="flex flex-wrap gap-4 mb-8">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-red-500/20 border border-red-500/30"></div>
            <span className="text-sm text-zinc-400">Holiday</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-blue-500/20 border border-blue-500/30"></div>
            <span className="text-sm text-zinc-400">Meeting</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-yellow-500/20 border border-yellow-500/30"></div>
            <span className="text-sm text-zinc-400">Maintenance</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-purple-500/20 border border-purple-500/30"></div>
            <span className="text-sm text-zinc-400">Training</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-zinc-500/20 border border-zinc-500/30"></div>
            <span className="text-sm text-zinc-400">Other</span>
          </div>
        </div>

        {/* Block Details Dialog */}
        <Dialog open={!!selectedBlock} onOpenChange={(open) => !open && setSelectedBlock(null)}>
          <DialogContent className="bg-zinc-900 border-zinc-800 text-zinc-50 max-w-2xl">
            <DialogHeader>
              <DialogTitle>{isEditing ? 'Edit Block' : 'Block Details'}</DialogTitle>
            </DialogHeader>
            {selectedBlock && (
              <div className="space-y-4">
                {!isEditing ? (
                  <>
                    <div>
                      <label className="text-sm font-medium text-zinc-400 mb-1 block">Title</label>
                      <p className="text-lg font-semibold text-zinc-50">{selectedBlock.title}</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-zinc-400 mb-1 block">Start Date & Time</label>
                        <p className="text-zinc-50">
                          {new Date(selectedBlock.start_datetime).toLocaleDateString()} at{' '}
                          {new Date(selectedBlock.start_datetime).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-zinc-400 mb-1 block">End Date & Time</label>
                        <p className="text-zinc-50">
                          {new Date(selectedBlock.end_datetime).toLocaleDateString()} at{' '}
                          {new Date(selectedBlock.end_datetime).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})}
                        </p>
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-zinc-400 mb-1 block">Block Type</label>
                      <Badge className={blockTypeColors[selectedBlock.block_type]}>
                        {selectedBlock.block_type}
                      </Badge>
                    </div>

                    {selectedBlock.is_recurring && (
                      <div>
                        <label className="text-sm font-medium text-zinc-400 mb-1 block">Recurrence</label>
                        <Badge variant="outline" className="text-zinc-300 flex items-center gap-1 w-fit">
                          <Repeat className="w-3 h-3" />
                          {selectedBlock.recurrence_pattern}
                        </Badge>
                      </div>
                    )}

                    {selectedBlock.notes && (
                      <div>
                        <label className="text-sm font-medium text-zinc-400 mb-1 block">Notes</label>
                        <p className="text-zinc-300">{selectedBlock.notes}</p>
                      </div>
                    )}

                    <div className="flex gap-3 pt-4">
                      <Button
                        onClick={() => setIsEditing(true)}
                        className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-50"
                      >
                        Edit Block
                      </Button>
                      <Button
                        onClick={() => {
                          if (confirm('Are you sure you want to delete this block?')) {
                            deleteBlockMutation.mutate(selectedBlock.id);
                          }
                        }}
                        variant="outline"
                        className="flex-1 border-red-500/30 text-red-500 hover:bg-red-500/10"
                      >
                        Delete Block
                      </Button>
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <label className="text-sm font-medium text-zinc-300 mb-2 block">Title</label>
                      <Input
                        value={selectedBlock.title}
                        onChange={(e) => setSelectedBlock({...selectedBlock, title: e.target.value})}
                        className="bg-zinc-800 border-zinc-700 text-zinc-50"
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-zinc-300 mb-2 block">Start Date & Time</label>
                        <Input
                          type="datetime-local"
                          value={selectedBlock.start_datetime?.slice(0, 16)}
                          onChange={(e) => setSelectedBlock({...selectedBlock, start_datetime: e.target.value})}
                          className="bg-zinc-800 border-zinc-700 text-zinc-50"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-zinc-300 mb-2 block">End Date & Time</label>
                        <Input
                          type="datetime-local"
                          value={selectedBlock.end_datetime?.slice(0, 16)}
                          onChange={(e) => setSelectedBlock({...selectedBlock, end_datetime: e.target.value})}
                          className="bg-zinc-800 border-zinc-700 text-zinc-50"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-zinc-300 mb-2 block">Block Type</label>
                      <Select value={selectedBlock.block_type} onValueChange={(value) => setSelectedBlock({...selectedBlock, block_type: value})}>
                        <SelectTrigger className="bg-zinc-800 border-zinc-700">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="holiday">Holiday</SelectItem>
                          <SelectItem value="meeting">Meeting</SelectItem>
                          <SelectItem value="maintenance">Maintenance</SelectItem>
                          <SelectItem value="training">Training</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        checked={selectedBlock.is_recurring}
                        onCheckedChange={(checked) => setSelectedBlock({...selectedBlock, is_recurring: checked})}
                      />
                      <label className="text-sm font-medium text-zinc-300">Recurring Block</label>
                    </div>

                    {selectedBlock.is_recurring && (
                      <div>
                        <label className="text-sm font-medium text-zinc-300 mb-2 block">Recurrence Pattern</label>
                        <Select value={selectedBlock.recurrence_pattern} onValueChange={(value) => setSelectedBlock({...selectedBlock, recurrence_pattern: value})}>
                          <SelectTrigger className="bg-zinc-800 border-zinc-700">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="daily">Daily</SelectItem>
                            <SelectItem value="weekly">Weekly</SelectItem>
                            <SelectItem value="monthly">Monthly</SelectItem>
                            <SelectItem value="yearly">Yearly</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    )}

                    <div>
                      <label className="text-sm font-medium text-zinc-300 mb-2 block">Notes</label>
                      <Textarea
                        value={selectedBlock.notes || ''}
                        onChange={(e) => setSelectedBlock({...selectedBlock, notes: e.target.value})}
                        className="bg-zinc-800 border-zinc-700 text-zinc-50"
                      />
                    </div>

                    <div className="flex gap-3 pt-4">
                      <Button
                        onClick={() => setIsEditing(false)}
                        variant="outline"
                        className="flex-1 bg-transparent border-zinc-700 text-zinc-300"
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={() => updateBlockMutation.mutate({ id: selectedBlock.id, data: selectedBlock })}
                        className="flex-1 gradient-red text-zinc-50"
                      >
                        Save Changes
                      </Button>
                    </div>
                  </>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>
        </div>
      </div>
    </AdminRoute>
  );
}
