"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  ArrowLeft, Building, Mail, Phone, MapPin, 
  Clock, Tag, Send, Check, X, ShieldAlert, FileText, User, MessageCircle, AlertTriangle
} from "lucide-react";
import { 
  updateInquiryStatusWithNotification, 
  assignInquiry, 
  addInquiryNote,
  markInquirySpam
} from "@/app/actions/inquiry";
import { generateWhatsAppMessage, InquiryStatus } from "@/lib/whatsapp/templates";

export default function InquiryDetailClient({ 
  initialInquiry,
  activities: initialActivities,
  admins
}: { 
  initialInquiry: any,
  activities: any[],
  admins: any[]
}) {
  const router = useRouter();
  const [inquiry, setInquiry] = useState(initialInquiry);
  const [activities, setActivities] = useState(initialActivities);
  const [note, setNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isActionSubmitting, setIsActionSubmitting] = useState(false);

  // Modal State
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [pendingStatus, setPendingStatus] = useState<string>("");
  const [notifyWhatsApp, setNotifyWhatsApp] = useState(true);
  const [adminNote, setAdminNote] = useState("");
  const [actionError, setActionError] = useState("");

  const openStatusModal = (status: string) => {
    setPendingStatus(status);
    setStatusModalOpen(true);
    setAdminNote("");
    setActionError("");
    setNotifyWhatsApp(inquiry.whatsapp_opt_in !== false);
  };

  const confirmStatusChange = async () => {
    setIsActionSubmitting(true);
    setActionError("");
    
    const res = await updateInquiryStatusWithNotification(
      inquiry.id, 
      pendingStatus, 
      notifyWhatsApp, 
      adminNote
    );
    
    if (res.success) {
      setInquiry({ 
        ...inquiry, 
        status: pendingStatus,
        last_whatsapp_notification_status: notifyWhatsApp ? (res.warning ? 'FAILED' : 'DELIVERED') : inquiry.last_whatsapp_notification_status,
        last_whatsapp_notification_at: notifyWhatsApp ? new Date().toISOString() : inquiry.last_whatsapp_notification_at,
        last_whatsapp_error: res.warning || null
      });
      setStatusModalOpen(false);
      router.refresh();
    } else {
      setActionError(res.error || "Failed to update status.");
    }
    
    setIsActionSubmitting(false);
  };

  const handleAssign = async (adminId: string) => {
    const res = await assignInquiry(inquiry.id, adminId === "UNASSIGNED" ? null : adminId);
    if (res.success) {
      const assignedTo = admins.find(a => a.id === adminId);
      setInquiry({ ...inquiry, assigned_to: assignedTo || null });
      router.refresh();
    }
  };

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!note.trim()) return;
    setIsSubmitting(true);
    const res = await addInquiryNote(inquiry.id, note);
    if (res.success) {
      setNote("");
      router.refresh();
    }
    setIsSubmitting(false);
  };

  const handleSpam = async () => {
    if (!confirm("Are you sure you want to mark this as spam?")) return;
    setIsActionSubmitting(true);
    const res = await markInquirySpam(inquiry.id);
    if (res.success) {
      setInquiry({ ...inquiry, status: 'SPAM', is_spam: true });
      router.refresh();
    }
    setIsActionSubmitting(false);
  };

  const currentMessagePreview = pendingStatus ? generateWhatsAppMessage(pendingStatus as InquiryStatus, {
    customerName: inquiry.name,
    inquiryId: inquiry.id,
    company: inquiry.company,
    adminNote
  }) : "";

  return (
    <div className="space-y-6">
      {/* Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link href="/admin/inquiries" className="p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
            <ArrowLeft className="h-5 w-5 text-zinc-500" />
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">{inquiry.name}</h1>
              <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                inquiry.status === 'NEW' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' :
                inquiry.status === 'QUALIFIED' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                inquiry.status === 'CLOSED' ? 'bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-400' :
                inquiry.status === 'SPAM' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' :
                'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400'
              }`}>
                {inquiry.status}
              </span>
            </div>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
              Received {new Date(inquiry.created_at).toLocaleString()}
            </p>
          </div>
        </div>
        
        <div className="flex flex-wrap items-center gap-2">
          {inquiry.status !== 'QUALIFIED' && inquiry.status !== 'CONVERTED' && (
             <button 
                onClick={() => openStatusModal('QUALIFIED')}
                disabled={isActionSubmitting}
                className="inline-flex items-center rounded-md bg-green-50 px-3 py-2 text-sm font-medium text-green-700 hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-1 dark:bg-green-900/30 dark:text-green-400 dark:hover:bg-green-900/50"
              >
                <Check className="h-4 w-4 mr-2" />
                Mark Qualified
              </button>
          )}
          {inquiry.status !== 'CLOSED' && (
             <button 
                onClick={() => openStatusModal('CLOSED')}
                disabled={isActionSubmitting}
                className="inline-flex items-center rounded-md bg-zinc-100 px-3 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-1 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
              >
                <X className="h-4 w-4 mr-2" />
                Close
              </button>
          )}
          {!inquiry.is_spam && (
             <button 
                onClick={handleSpam}
                disabled={isActionSubmitting}
                className="inline-flex items-center rounded-md bg-red-50 px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50"
              >
                <ShieldAlert className="h-4 w-4 mr-2" />
                Spam
              </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Details */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-sm">
            <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50">
              <h3 className="text-sm font-semibold text-zinc-900 dark:text-white">Contact Info</h3>
            </div>
            <div className="p-4 space-y-4">
              {inquiry.company && (
                <div className="flex items-start gap-3">
                  <Building className="h-5 w-5 text-zinc-400 shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-zinc-900 dark:text-white">{inquiry.company}</p>
                    <p className="text-xs text-zinc-500">Company</p>
                  </div>
                </div>
              )}
              <div className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-zinc-400 shrink-0" />
                <div>
                  <a href={`mailto:${inquiry.email}`} className="text-sm font-medium text-green-600 hover:underline dark:text-green-500">{inquiry.email}</a>
                  <p className="text-xs text-zinc-500">Email</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="h-5 w-5 text-zinc-400 shrink-0" />
                <div>
                  <a href={`tel:${inquiry.phone}`} className="text-sm font-medium text-green-600 hover:underline dark:text-green-500">{inquiry.phone}</a>
                  <p className="text-xs text-zinc-500">Phone</p>
                </div>
              </div>
              {(inquiry.city || inquiry.state || inquiry.country) && (
                 <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-zinc-400 shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-zinc-900 dark:text-white">
                      {[inquiry.city, inquiry.state, inquiry.country].filter(Boolean).join(", ")}
                    </p>
                    <p className="text-xs text-zinc-500">Location</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-sm">
            <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50">
              <h3 className="text-sm font-semibold text-zinc-900 dark:text-white">Inquiry Details</h3>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <p className="text-xs text-zinc-500 mb-1">Source</p>
                <div className="flex items-center gap-2">
                  <span className="inline-flex rounded bg-zinc-100 px-2 py-1 text-xs font-medium text-zinc-800 dark:bg-zinc-800 dark:text-zinc-300 capitalize">
                    {inquiry.source?.replace('_', ' ') || 'Direct'}
                  </span>
                </div>
              </div>
              <div>
                <p className="text-xs text-zinc-500 mb-1">Inquiry Type</p>
                <p className="text-sm text-zinc-900 dark:text-white capitalize">{inquiry.inquiry_type}</p>
              </div>
              {inquiry.product_interest && (
                <div>
                  <p className="text-xs text-zinc-500 mb-1">Product/Solution Interest</p>
                  <p className="text-sm font-medium text-zinc-900 dark:text-white">{inquiry.product_interest}</p>
                </div>
              )}
              
              <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800">
                <p className="text-xs text-zinc-500 mb-2">Assignment</p>
                <select 
                  value={inquiry.assigned_to?.id || "UNASSIGNED"}
                  onChange={(e) => handleAssign(e.target.value)}
                  className="block w-full rounded-md border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 py-2 text-sm focus:border-green-500 focus:ring-green-500 dark:text-white"
                >
                  <option value="UNASSIGNED">Unassigned</option>
                  {admins.map(admin => (
                    <option key={admin.id} value={admin.id}>{admin.name} ({admin.email})</option>
                  ))}
                </select>
              </div>

              <div>
                <p className="text-xs text-zinc-500 mb-2">Status</p>
                <select 
                  value={inquiry.status}
                  onChange={(e) => openStatusModal(e.target.value)}
                  className="block w-full rounded-md border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 py-2 text-sm focus:border-green-500 focus:ring-green-500 dark:text-white"
                >
                  <option value="NEW">New</option>
                  <option value="OPEN">Open</option>
                  <option value="IN PROGRESS">In Progress</option>
                  <option value="CONTACTED">Contacted</option>
                  <option value="QUALIFIED">Qualified</option>
                  <option value="CONVERTED">Converted</option>
                  <option value="CLOSED">Closed</option>
                </select>
              </div>

            </div>
          </div>
          
          {/* WhatsApp Status Panel */}
          <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-sm">
            <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 flex justify-between items-center">
              <h3 className="text-sm font-semibold text-zinc-900 dark:text-white">WhatsApp Notifications</h3>
              <MessageCircle className="h-4 w-4 text-[#25D366]" />
            </div>
            <div className="p-4 space-y-4">
              <div>
                <p className="text-xs text-zinc-500 mb-1">Customer Phone</p>
                <p className="text-sm font-medium text-zinc-900 dark:text-white">{inquiry.phone}</p>
              </div>
              <div>
                <p className="text-xs text-zinc-500 mb-1">Opt-In Status</p>
                <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${inquiry.whatsapp_opt_in !== false ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'}`}>
                  {inquiry.whatsapp_opt_in !== false ? 'Eligible' : 'Opted Out'}
                </span>
              </div>
              
              <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800">
                <p className="text-xs text-zinc-500 mb-1">Last Delivery Status</p>
                {inquiry.last_whatsapp_notification_status ? (
                  <div>
                    <span className={`inline-flex items-center text-sm font-medium ${inquiry.last_whatsapp_notification_status === 'DELIVERED' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                      {inquiry.last_whatsapp_notification_status === 'DELIVERED' ? <Check className="h-4 w-4 mr-1" /> : <AlertTriangle className="h-4 w-4 mr-1" />}
                      {inquiry.last_whatsapp_notification_status}
                    </span>
                    <p className="text-xs text-zinc-400 mt-1">
                      {new Date(inquiry.last_whatsapp_notification_at).toLocaleString()}
                    </p>
                    {inquiry.last_whatsapp_error && (
                      <p className="text-xs text-red-500 mt-1 bg-red-50 p-2 rounded dark:bg-red-900/20">{inquiry.last_whatsapp_error}</p>
                    )}
                  </div>
                ) : (
                  <p className="text-sm text-zinc-400 italic">No notifications sent yet.</p>
                )}
              </div>
              
              <button 
                onClick={() => openStatusModal(inquiry.status)}
                className="w-full flex items-center justify-center rounded-md bg-zinc-100 px-3 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
              >
                <MessageCircle className="h-4 w-4 mr-2" />
                Send Manual Update
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Message & Timeline */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-sm">
            <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50">
              <h3 className="text-sm font-semibold text-zinc-900 dark:text-white">Original Message</h3>
            </div>
            <div className="p-6">
              <div className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap">
                {inquiry.message}
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-sm">
            <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50">
              <h3 className="text-sm font-semibold text-zinc-900 dark:text-white">Activity Timeline</h3>
            </div>
            
            <div className="p-4 border-b border-zinc-200 dark:border-zinc-800">
              <form onSubmit={handleAddNote} className="space-y-3">
                <textarea
                  rows={3}
                  className="block w-full rounded-md border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 py-2 text-sm focus:border-green-500 focus:ring-green-500 dark:text-white resize-none"
                  placeholder="Add an internal note..."
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  required
                />
                <div className="flex justify-end">
                  <button 
                    type="submit"
                    disabled={isSubmitting || !note.trim()}
                    className="inline-flex items-center rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-green-700 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                  >
                    <Send className="h-4 w-4 mr-2" />
                    Add Note
                  </button>
                </div>
              </form>
            </div>

            <div className="p-6">
              <ul role="list" className="-mb-8">
                {activities.map((activity, activityIdx) => (
                  <li key={activity.id}>
                    <div className="relative pb-8">
                      {activityIdx !== activities.length - 1 ? (
                         <span className="absolute left-4 top-4 -ml-px h-full w-0.5 bg-zinc-200 dark:bg-zinc-800" aria-hidden="true" />
                      ) : null}
                      <div className="relative flex space-x-3">
                        <div>
                          <span className={`h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white dark:ring-zinc-900 ${
                            activity.activity_type === 'NOTE' ? 'bg-blue-100 text-blue-500' :
                            activity.activity_type === 'STATUS_CHANGE' ? 'bg-amber-100 text-amber-500' :
                            activity.activity_type === 'WHATSAPP' ? 'bg-[#25D366]/20 text-[#25D366]' :
                            'bg-zinc-100 text-zinc-500'
                          }`}>
                            {activity.activity_type === 'NOTE' ? <FileText className="h-4 w-4" /> : 
                             activity.activity_type === 'STATUS_CHANGE' ? <Tag className="h-4 w-4" /> : 
                             activity.activity_type === 'WHATSAPP' ? <MessageCircle className="h-4 w-4" /> :
                             <User className="h-4 w-4" />}
                          </span>
                        </div>
                        <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                          <div>
                            <p className="text-sm text-zinc-500 dark:text-zinc-400">
                              {activity.content}{' '}
                              {activity.user?.name && (
                                <span className="font-medium text-zinc-900 dark:text-white">
                                  by {activity.user.name}
                                </span>
                              )}
                            </p>
                          </div>
                          <div className="whitespace-nowrap text-right text-xs text-zinc-500">
                            {new Date(activity.created_at).toLocaleString()}
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
              {activities.length === 0 && (
                <p className="text-sm text-zinc-500 text-center py-4">No activities logged yet.</p>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Status Change & Notification Modal */}
      {statusModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg bg-white dark:bg-zinc-900 rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-zinc-200 dark:border-zinc-800 flex justify-between items-center">
              <h2 className="text-lg font-bold text-zinc-900 dark:text-white">Update Status to {pendingStatus}</h2>
              <button onClick={() => setStatusModalOpen(false)} className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300">
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="px-6 py-4 space-y-6 overflow-y-auto">
              {actionError && (
                <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm border border-red-100 dark:bg-red-900/20 dark:border-red-900/30 dark:text-red-400">
                  {actionError}
                </div>
              )}
            
              {/* WhatsApp Toggle */}
              <label className="flex items-start gap-3 cursor-pointer p-4 border border-zinc-200 dark:border-zinc-800 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
                <div className="flex items-center h-5">
                  <input
                    type="checkbox"
                    checked={notifyWhatsApp}
                    onChange={(e) => setNotifyWhatsApp(e.target.checked)}
                    className="h-4 w-4 rounded border-zinc-300 text-green-600 focus:ring-green-500 dark:border-zinc-600 dark:bg-zinc-700"
                  />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-zinc-900 dark:text-white flex items-center gap-2">
                    <MessageCircle className="h-4 w-4 text-[#25D366]" />
                    Notify customer on WhatsApp
                  </p>
                  <p className="text-xs text-zinc-500 mt-1">Send an automated status update to {inquiry.phone}</p>
                </div>
              </label>

              {notifyWhatsApp && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                      Include a custom note (optional)
                    </label>
                    <textarea
                      rows={2}
                      className="block w-full rounded-md border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 py-2 text-sm focus:border-green-500 focus:ring-green-500 dark:text-white resize-none"
                      placeholder="E.g., Please check your email for the quote."
                      value={adminNote}
                      onChange={(e) => setAdminNote(e.target.value)}
                    />
                  </div>
                  
                  <div className="bg-[#E5DDD5] dark:bg-[#111B21] p-4 rounded-xl border border-zinc-200 dark:border-zinc-800">
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-2 font-medium">Message Preview</p>
                    <div className="bg-white dark:bg-[#005C4B] rounded-lg p-3 text-sm text-zinc-800 dark:text-zinc-100 shadow-sm relative whitespace-pre-wrap rounded-tl-none">
                      {currentMessagePreview}
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <div className="px-6 py-4 border-t border-zinc-200 dark:border-zinc-800 flex justify-end gap-3 bg-zinc-50 dark:bg-zinc-900/50">
              <button 
                onClick={() => setStatusModalOpen(false)}
                className="px-4 py-2 text-sm font-medium text-zinc-700 bg-white border border-zinc-300 rounded-md shadow-sm hover:bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 dark:bg-zinc-800 dark:text-zinc-300 dark:border-zinc-700 dark:hover:bg-zinc-700"
              >
                Cancel
              </button>
              <button 
                onClick={confirmStatusChange}
                disabled={isActionSubmitting}
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50"
              >
                {isActionSubmitting ? (
                   <span className="flex items-center">
                     <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                     Updating...
                   </span>
                ) : 'Confirm Update'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
