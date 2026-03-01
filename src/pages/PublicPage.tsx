import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar as CalendarIcon, Clock, ChevronLeft, ChevronRight, CheckCircle2 } from 'lucide-react';
import { format, addDays, startOfToday, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isSameMonth, addMonths, subMonths, isBefore, isToday } from 'date-fns';
import { cn, formatTime } from '../lib/utils';
import { Link, FormField } from '../types';

export default function PublicPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [link, setLink] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState<'booking' | 'form' | 'success'>('booking');
  
  // Booking State
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [currentMonth, setCurrentMonth] = useState(startOfMonth(new Date()));
  
  // Form State
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [userInfo, setUserInfo] = useState({ name: '', email: '' });

  useEffect(() => {
    fetch(`/api/links/${slug}`)
      .then(res => res.json())
      .then(data => {
        setLink(data);
        if (data.flow_mode === 'form_then_book') setStep('form');
        setLoading(false);
      });
  }, [slug]);

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (!link) return <div className="min-h-screen flex items-center justify-center">Link not found</div>;

  const days = eachDayOfInterval({
    start: startOfMonth(currentMonth),
    end: endOfMonth(currentMonth),
  });

  const timeSlots = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30', 
    '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00'
  ];

  const handleBookingSubmit = async () => {
    if (link.flow_mode === 'book_then_form') {
      setStep('form');
    } else {
      submitAll();
    }
  };

  const submitAll = async () => {
    setLoading(true);
    const payload = {
      booking: selectedDate ? {
        start_time: format(selectedDate, 'yyyy-MM-dd') + ' ' + selectedTime,
        end_time: format(selectedDate, 'yyyy-MM-dd') + ' ' + selectedTime, // Simple for MVP
        user_name: userInfo.name || formData.name || 'Guest',
        user_email: userInfo.email || formData.email || '',
      } : null,
      formData: formData
    };

    try {
      await fetch(`/api/links/${slug}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      setStep('success');
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] py-12 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-[32px] shadow-xl overflow-hidden flex flex-col md:flex-row min-h-[600px]">
        {/* Sidebar Info */}
        <div className="w-full md:w-80 border-r border-gray-100 p-8 bg-gray-50/50">
          <div className="w-12 h-12 bg-brand rounded-2xl flex items-center justify-center text-white font-bold text-2xl mb-8">S</div>
          <h1 className="text-2xl font-bold mb-2">{link.title}</h1>
          <p className="text-gray-500 text-sm mb-8">{link.description}</p>
          
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <Clock className="w-4 h-4" />
              <span>30 Min Call</span>
            </div>
            {selectedDate && (
              <div className="flex items-center gap-3 text-sm text-brand font-medium">
                <CalendarIcon className="w-4 h-4" />
                <span>{format(selectedDate, 'EEEE, MMMM d')}</span>
              </div>
            )}
            {selectedTime && (
              <div className="flex items-center gap-3 text-sm text-brand font-medium">
                <Clock className="w-4 h-4" />
                <span>{formatTime(selectedTime)}</span>
              </div>
            )}
          </div>
        </div>

        {/* Main Interaction Area */}
        <div className="flex-1 p-8 relative">
          <AnimatePresence mode="wait">
            {step === 'booking' && (
              <motion.div
                key="booking"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="h-full flex flex-col"
              >
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-xl font-bold">Select Date & Time</h2>
                  <div className="flex items-center gap-2">
                    <button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} className="p-2 hover:bg-gray-100 rounded-lg">
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <span className="font-medium min-w-[120px] text-center">{format(currentMonth, 'MMMM yyyy')}</span>
                    <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} className="p-2 hover:bg-gray-100 rounded-lg">
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-7 gap-1 mb-8">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                    <div key={d} className="text-center text-xs font-bold text-gray-400 py-2 uppercase tracking-wider">{d}</div>
                  ))}
                  {days.map((day, i) => {
                    const isPast = isBefore(day, startOfToday());
                    const isSelected = selectedDate && isSameDay(day, selectedDate);
                    return (
                      <button
                        key={day.toString()}
                        disabled={isPast}
                        onClick={() => setSelectedDate(day)}
                        className={cn(
                          "aspect-square flex items-center justify-center rounded-xl text-sm font-medium transition-all",
                          isSelected ? "bg-brand text-white" : isPast ? "text-gray-200 cursor-not-allowed" : "hover:bg-gray-100 text-gray-700",
                          isToday(day) && !isSelected && "text-brand border border-brand/20"
                        )}
                      >
                        {format(day, 'd')}
                      </button>
                    );
                  })}
                </div>

                {selectedDate && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                    <h3 className="font-bold text-sm text-gray-400 uppercase tracking-wider">Available Times</h3>
                    <div className="grid grid-cols-3 gap-3">
                      {timeSlots.map(time => (
                        <button
                          key={time}
                          onClick={() => setSelectedTime(time)}
                          className={cn(
                            "py-3 rounded-xl border text-sm font-medium transition-all",
                            selectedTime === time ? "bg-brand border-brand text-white" : "border-gray-200 hover:border-brand text-gray-600"
                          )}
                        >
                          {formatTime(time)}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}

                <div className="mt-auto pt-8 flex justify-end">
                  <button
                    disabled={!selectedDate || !selectedTime}
                    onClick={handleBookingSubmit}
                    className="btn-primary px-8 py-3 rounded-2xl"
                  >
                    Next Step
                  </button>
                </div>
              </motion.div>
            )}

            {step === 'form' && (
              <motion.div
                key="form"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <h2 className="text-xl font-bold">Additional Information</h2>
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Full Name</label>
                      <input
                        type="text"
                        className="input-field"
                        value={userInfo.name}
                        onChange={e => setUserInfo({ ...userInfo, name: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Email Address</label>
                      <input
                        type="email"
                        className="input-field"
                        value={userInfo.email}
                        onChange={e => setUserInfo({ ...userInfo, email: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  {link.form?.map((field: FormField) => (
                    <div key={field.name} className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">
                        {field.label} {field.required && <span className="text-red-500">*</span>}
                      </label>
                      {field.type === 'textarea' ? (
                        <textarea
                          className="input-field min-h-[100px]"
                          required={field.required}
                          onChange={e => setFormData({ ...formData, [field.name]: e.target.value })}
                        />
                      ) : (
                        <input
                          type={field.type}
                          className="input-field"
                          required={field.required}
                          onChange={e => setFormData({ ...formData, [field.name]: e.target.value })}
                        />
                      )}
                    </div>
                  ))}
                </div>

                <div className="flex justify-between items-center pt-8">
                  <button onClick={() => setStep('booking')} className="text-gray-500 font-medium hover:text-brand">Back to Calendar</button>
                  <button
                    onClick={submitAll}
                    disabled={loading}
                    className="btn-primary px-12 py-3 rounded-2xl"
                  >
                    {loading ? 'Submitting...' : 'Confirm Booking'}
                  </button>
                </div>
              </motion.div>
            )}

            {step === 'success' && (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="h-full flex flex-col items-center justify-center text-center space-y-6"
              >
                <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center">
                  <CheckCircle2 className="w-10 h-10 text-emerald-500" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold mb-2">You're all set!</h2>
                  <p className="text-gray-500">A confirmation email has been sent to {userInfo.email || formData.email}</p>
                </div>
                <div className="bg-gray-50 p-6 rounded-2xl w-full max-w-sm border border-gray-100">
                  <div className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Meeting Details</div>
                  <div className="space-y-3 text-left">
                    <div className="flex items-center gap-3">
                      <CalendarIcon className="w-4 h-4 text-brand" />
                      <span className="font-medium">{selectedDate && format(selectedDate, 'EEEE, MMMM d, yyyy')}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Clock className="w-4 h-4 text-brand" />
                      <span className="font-medium">{selectedTime && formatTime(selectedTime)}</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => window.location.reload()}
                  className="text-brand font-bold hover:underline"
                >
                  Book another session
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      
      <div className="mt-12 text-center text-gray-400 text-sm">
        Powered by <span className="font-bold text-gray-600">SchedForm</span>
      </div>
    </div>
  );
}
