import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Plus, Trash2, GripVertical, Sparkles, Clock, Calendar as CalendarIcon, FormInput, CheckCircle2 } from 'lucide-react';
import { generateFormFields } from '../services/geminiService';
import { FormField } from '../types';

export default function LinkEditor() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    description: '',
    type: 'combined' as const,
    flow_mode: 'book_then_form' as const,
    availability: [
      { day_of_week: 1, start_time: '09:00', end_time: '17:00' },
      { day_of_week: 2, start_time: '09:00', end_time: '17:00' },
      { day_of_week: 3, start_time: '09:00', end_time: '17:00' },
      { day_of_week: 4, start_time: '09:00', end_time: '17:00' },
      { day_of_week: 5, start_time: '09:00', end_time: '17:00' },
    ],
    formFields: [] as FormField[],
  });

  const handleAiGenerate = async () => {
    if (!formData.description) return alert('Please provide a description first');
    setLoading(true);
    try {
      const fields = await generateFormFields(formData.description);
      setFormData(prev => ({ ...prev, formFields: fields }));
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/links', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.slug) {
        navigate('/links');
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Stepper */}
      <div className="flex items-center justify-between mb-12 relative">
        <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gray-200 -translate-y-1/2 z-0"></div>
        {[1, 2, 3].map((s) => (
          <div key={s} className="relative z-10 flex flex-col items-center gap-2">
            <div className={cn(
              "w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all",
              step >= s ? "bg-brand text-white scale-110" : "bg-white border-2 border-gray-200 text-gray-400"
            )}>
              {step > s ? <CheckCircle2 className="w-6 h-6" /> : s}
            </div>
            <span className={cn("text-xs font-medium", step >= s ? "text-brand" : "text-gray-400")}>
              {s === 1 ? 'Details' : s === 2 ? 'Availability' : 'Form Builder'}
            </span>
          </div>
        ))}
      </div>

      <motion.div
        key={step}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm"
      >
        {step === 1 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Basic Details</h2>
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Link Title</label>
                <input
                  type="text"
                  placeholder="e.g. 15 Min Consultation"
                  className="input-field"
                  value={formData.title}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">URL Slug</label>
                <div className="flex items-center">
                  <span className="bg-gray-50 px-3 py-2 border border-r-0 border-gray-200 rounded-l-lg text-gray-500 text-sm">schedform.com/</span>
                  <input
                    type="text"
                    placeholder="my-link"
                    className="input-field rounded-l-none"
                    value={formData.slug}
                    onChange={e => setFormData({ ...formData, slug: e.target.value })}
                  />
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Description</label>
              <textarea
                placeholder="What is this booking for?"
                className="input-field min-h-[100px]"
                value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Link Type</label>
                <select
                  className="input-field"
                  value={formData.type}
                  onChange={e => setFormData({ ...formData, type: e.target.value as any })}
                >
                  <option value="combined">Combined (Booking + Form)</option>
                  <option value="booking">Booking Only</option>
                  <option value="form">Form Only</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Flow Mode</label>
                <select
                  className="input-field"
                  value={formData.flow_mode}
                  onChange={e => setFormData({ ...formData, flow_mode: e.target.value as any })}
                >
                  <option value="book_then_form">Book → Then Fill Form</option>
                  <option value="form_then_book">Fill Form → Then Book</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Weekly Availability</h2>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Clock className="w-4 h-4" />
                Timezone: UTC
              </div>
            </div>
            <div className="space-y-3">
              {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map((day, i) => {
                const active = formData.availability.find(a => a.day_of_week === i);
                return (
                  <div key={day} className="flex items-center gap-4 p-4 rounded-xl border border-gray-100 hover:bg-gray-50 transition-colors">
                    <div className="w-32 font-medium text-sm">{day}</div>
                    {active ? (
                      <div className="flex items-center gap-3 flex-1">
                        <input
                          type="time"
                          className="px-2 py-1 border rounded"
                          value={active.start_time}
                          onChange={e => {
                            const newAvail = [...formData.availability];
                            const idx = newAvail.findIndex(a => a.day_of_week === i);
                            newAvail[idx].start_time = e.target.value;
                            setFormData({ ...formData, availability: newAvail });
                          }}
                        />
                        <span className="text-gray-400">to</span>
                        <input
                          type="time"
                          className="px-2 py-1 border rounded"
                          value={active.end_time}
                          onChange={e => {
                            const newAvail = [...formData.availability];
                            const idx = newAvail.findIndex(a => a.day_of_week === i);
                            newAvail[idx].end_time = e.target.value;
                            setFormData({ ...formData, availability: newAvail });
                          }}
                        />
                        <button
                          onClick={() => setFormData({ ...formData, availability: formData.availability.filter(a => a.day_of_week !== i) })}
                          className="ml-auto p-2 text-gray-400 hover:text-red-500"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setFormData({ ...formData, availability: [...formData.availability, { day_of_week: i, start_time: '09:00', end_time: '17:00' }] })}
                        className="text-sm text-brand font-medium hover:underline"
                      >
                        Add hours
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Form Builder</h2>
              <button
                onClick={handleAiGenerate}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-xl font-medium hover:bg-emerald-100 transition-all disabled:opacity-50"
              >
                <Sparkles className="w-4 h-4" />
                {loading ? 'Generating...' : 'AI Generate Fields'}
              </button>
            </div>

            <div className="space-y-4">
              {formData.formFields.map((field, i) => (
                <div key={i} className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100 group">
                  <GripVertical className="w-4 h-4 text-gray-300 cursor-grab" />
                  <div className="flex-1 grid grid-cols-3 gap-4">
                    <input
                      type="text"
                      className="bg-transparent border-none focus:ring-0 font-medium text-sm"
                      value={field.label}
                      onChange={e => {
                        const newFields = [...formData.formFields];
                        newFields[i].label = e.target.value;
                        setFormData({ ...formData, formFields: newFields });
                      }}
                    />
                    <select
                      className="bg-transparent border-none focus:ring-0 text-sm text-gray-500"
                      value={field.type}
                      onChange={e => {
                        const newFields = [...formData.formFields];
                        newFields[i].type = e.target.value as any;
                        setFormData({ ...formData, formFields: newFields });
                      }}
                    >
                      <option value="text">Short Text</option>
                      <option value="textarea">Long Text</option>
                      <option value="email">Email</option>
                      <option value="tel">Phone</option>
                      <option value="select">Dropdown</option>
                    </select>
                    <div className="flex items-center justify-end gap-4">
                      <label className="flex items-center gap-2 text-xs text-gray-500">
                        <input
                          type="checkbox"
                          checked={field.required}
                          onChange={e => {
                            const newFields = [...formData.formFields];
                            newFields[i].required = e.target.checked;
                            setFormData({ ...formData, formFields: newFields });
                          }}
                        />
                        Required
                      </label>
                      <button
                        onClick={() => setFormData({ ...formData, formFields: formData.formFields.filter((_, idx) => idx !== i) })}
                        className="p-2 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              <button
                onClick={() => setFormData({ ...formData, formFields: [...formData.formFields, { label: 'New Field', name: 'new_field', type: 'text', required: false }] })}
                className="w-full p-4 border-2 border-dashed border-gray-200 rounded-2xl text-gray-400 hover:text-brand hover:border-brand transition-all flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Field
              </button>
            </div>
          </div>
        )}

        <div className="mt-12 flex items-center justify-between">
          <button
            onClick={() => step > 1 ? setStep(step - 1) : navigate('/links')}
            className="btn-secondary"
          >
            {step === 1 ? 'Cancel' : 'Back'}
          </button>
          <button
            onClick={() => step < 3 ? setStep(step + 1) : handleSubmit()}
            disabled={loading}
            className="btn-primary min-w-[120px]"
          >
            {loading ? 'Saving...' : step === 3 ? 'Create Link' : 'Continue'}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

import { cn } from '../lib/utils';
