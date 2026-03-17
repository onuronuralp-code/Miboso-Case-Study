"use client";

import { useState, useMemo, useEffect } from "react";
import { useGetReservationsQuery, useCreateReservationMutation } from "../lib/features/api/apiSlice";
import { 
  ChevronLeft,
  ChevronRight,
  Waves,
  CheckCircle2,
  Loader2
} from "lucide-react";
import Image from "next/image";

export default function SPA() {
  const [selectedDate, setSelectedDate] = useState<{ day: number, month: number, year: number } | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  
  const { data: reservations = [] } = useGetReservationsQuery();
  const [createReservation] = useCreateReservationMutation();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);
  
  // Current date for constraints
  const today = useMemo(() => new Date(), []);
  // Initialize current view to current month
  const [currentViewDate, setCurrentViewDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1));

  const hours = [
    "9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", 
    "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM"
  ];

  // Calendar logic
  const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (year: number, month: number) => {
    const day = new Date(year, month, 1).getDay();
    // Adjust to start from Monday (0: Mon, ..., 6: Sun)
    return day === 0 ? 6 : day - 1;
  };

  const monthName = currentViewDate.toLocaleString('en-US', { month: 'long', year: 'numeric' });
  
  const handlePrevMonth = () => {
    const newDate = new Date(currentViewDate.getFullYear(), currentViewDate.getMonth() - 1, 1);
    // Only allow going back to current month
    if (newDate >= new Date(today.getFullYear(), today.getMonth(), 1)) {
      setCurrentViewDate(newDate);
    }
  };

  const handleNextMonth = () => {
    const maxDate = new Date(today.getFullYear(), today.getMonth() + 2, 1);
    const newDate = new Date(currentViewDate.getFullYear(), currentViewDate.getMonth() + 1, 1);
    // Limit to 2 months after current
    if (newDate <= maxDate) {
      setCurrentViewDate(newDate);
    }
  };

  const isPrevDisabled = currentViewDate.getMonth() === today.getMonth() && currentViewDate.getFullYear() === today.getFullYear();
  
  const maxViewDate = new Date(today.getFullYear(), today.getMonth() + 2, 1);
  const isNextDisabled = currentViewDate.getMonth() === maxViewDate.getMonth() && currentViewDate.getFullYear() === maxViewDate.getFullYear();

  const days = useMemo(() => {
    const totalDays = daysInMonth(currentViewDate.getFullYear(), currentViewDate.getMonth());
    const offset = firstDayOfMonth(currentViewDate.getFullYear(), currentViewDate.getMonth());
    return { totalDays, offset };
  }, [currentViewDate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDate || !selectedTime || !formData.email || !formData.firstName || !formData.lastName) {
      alert("Please fill all fields and select a date/time.");
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await createReservation({
        ...formData,
        date: selectedDate,
        time: selectedTime
      }).unwrap();

      if (result.success) {
        setShowSuccess(true);
        // Reset form
        setFormData({ email: '', firstName: '', lastName: '' });
        setSelectedDate(null);
        setSelectedTime(null);
        // Hide success bar after 5 seconds
        setTimeout(() => setShowSuccess(false), 5000);
      }
    } catch (error: any) {
      console.error("Submission failed:", error);
      alert(error?.data?.message || "Submission failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!mounted) return null;

  return (
    <div className="bg-[#FDFBF7] min-h-screen">
      <div className="flex flex-col justify-start">
        
        {/* Booking Section */}
        <section id="booking" className="bg-[#2A332C] text-white overflow-hidden flex-grow flex items-stretch">
          <div className="max-w-7xl mx-auto flex flex-col lg:flex-row w-full">
            {/* Form Side */}
            <div className="flex-1 px-8 pt-32 pb-20 lg:pt-48 lg:pb-32 lg:pr-24">
              <p className="text-[#A7B4A9] font-medium tracking-[0.2em] uppercase mb-4 text-xs">Ready to unwind?</p>
              <h2 className="text-5xl md:text-6xl font-serif mb-10 text-[#FDFBF7] leading-tight">Secure Your Dates</h2>
              <p className="text-[#A7B4A9] mb-16 max-w-lg text-lg leading-relaxed">
                Experience the pinnacle of wellness. Reserve your stay today and step into a world of curated tranquility.
              </p>

              <form onSubmit={handleSubmit} className="space-y-10 max-w-xl">
                <div className="space-y-4">
                  <label className="text-xs font-bold tracking-widest text-[#A7B4A9] uppercase">Email Address</label>
                  <input 
                    type="email" 
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="jane@email.com" 
                    className="w-full bg-[#364038] border-b border-[#4A5D4E] py-4 px-4 text-white placeholder:text-gray-600 focus:border-[#A7B4A9] outline-none transition-all"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
                  <div className="space-y-4">
                    <label className="text-xs font-bold tracking-widest text-[#A7B4A9] uppercase">First name</label>
                    <input 
                      type="text" 
                      required
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      placeholder="Jane" 
                      className="w-full bg-[#364038] border-b border-[#4A5D4E] py-4 px-4 text-white placeholder:text-gray-600 focus:border-[#A7B4A9] outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-4">
                    <label className="text-xs font-bold tracking-widest text-[#A7B4A9] uppercase">Last name</label>
                    <input 
                      type="text" 
                      required
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      placeholder="Doe" 
                      className="w-full bg-[#364038] border-b border-[#4A5D4E] py-4 px-4 text-white placeholder:text-gray-600 focus:border-[#A7B4A9] outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-8">
                  <div className="flex justify-between items-center text-xs font-bold tracking-widest text-[#A7B4A9] uppercase">
                    <span>{selectedDate ? `Available Hours for ${currentViewDate.toLocaleString('en-US', { month: 'long' })} ${selectedDate.day}` : "Choose Date"}</span>
                    {!selectedDate && (
                      <div className="flex gap-6 items-center">
                        <button 
                          type="button" 
                          onClick={handlePrevMonth} 
                          disabled={isPrevDisabled}
                          className={`transition-colors ${isPrevDisabled ? 'opacity-20 cursor-not-allowed' : 'hover:text-white'}`}
                        >
                          <ChevronLeft size={20} />
                        </button>
                        <span className="text-white font-serif text-xl normal-case tracking-normal min-w-[160px] text-center">
                          {monthName}
                        </span>
                        <button 
                          type="button" 
                          onClick={handleNextMonth}
                          disabled={isNextDisabled}
                          className={`transition-colors ${isNextDisabled ? 'opacity-20 cursor-not-allowed' : 'hover:text-white'}`}
                        >
                          <ChevronRight size={20} />
                        </button>
                      </div>
                    )}
                    {selectedDate && (
                      <button 
                        type="button" 
                        onClick={() => {setSelectedDate(null); setSelectedTime(null);}}
                        className="text-[#A7B4A9] hover:text-white text-[10px] underline tracking-widest"
                      >
                        Change Date
                      </button>
                    )}
                  </div>

                  {!selectedDate ? (
                    <div className="animate-fade-in-up">
                      <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-bold text-[#4A5D4E] uppercase tracking-widest mb-2">
                        {['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'].map(day => <div key={day} className="py-2">{day}</div>)}
                      </div>
                      <div className="grid grid-cols-7 gap-2">
                        {Array.from({ length: days.offset }).map((_, i) => (
                          <div key={`offset-${i}`} className="h-12 w-full"></div>
                        ))}
                        {Array.from({ length: days.totalDays }, (_, i) => i + 1).map((day) => {
                          const isPast = currentViewDate.getFullYear() === today.getFullYear() && 
                                         currentViewDate.getMonth() === today.getMonth() && 
                                         day < today.getDate();
                          
                          return (
                            <button
                              key={day}
                              type="button"
                              disabled={isPast}
                              onClick={() => setSelectedDate({ day, month: currentViewDate.getMonth(), year: currentViewDate.getFullYear() })}
                              className={`h-12 w-full rounded-xl flex items-center justify-center text-sm font-medium transition-all duration-300
                                ${isPast ? 'opacity-10 cursor-not-allowed' : ''}
                                ${selectedDate?.day === day && selectedDate?.month === currentViewDate.getMonth()
                                  ? 'bg-[#A7B4A9] text-[#2A332C] scale-90' 
                                  : isPast ? '' : 'bg-[#364038] text-white/70 hover:bg-[#4A5D4E] hover:text-white'}`}
                            >
                              {day}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ) : (
                    <div className="animate-fade-in-up">
                      <div className="grid grid-cols-3 gap-3">
                        {hours.map((time) => {
                          const isReserved = reservations.some(res => 
                            res.date.day === selectedDate?.day && 
                            res.date.month === selectedDate?.month && 
                            res.date.year === selectedDate?.year && 
                            res.time === time
                          );

                          return (
                            <button
                              key={time}
                              type="button"
                              disabled={isReserved}
                              onClick={() => setSelectedTime(time)}
                              className={`py-4 rounded-xl text-xs font-bold tracking-widest uppercase transition-all duration-300 border
                                ${isReserved 
                                  ? 'bg-[#1a1f1b] text-[#4A5D4E] border-[#364038] cursor-not-allowed opacity-50' 
                                  : selectedTime === time 
                                    ? 'bg-[#A7B4A9] text-[#2A332C] border-[#A7B4A9] shadow-lg scale-95' 
                                    : 'bg-transparent text-[#A7B4A9] border-[#4A5D4E] hover:border-[#A7B4A9] hover:text-white'}`}
                            >
                              {isReserved ? "Reserved" : time}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>

                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-6 bg-[#A7B4A9] text-[#2A332C] font-bold text-lg tracking-widest uppercase rounded-2xl hover:bg-white transition-all shadow-2xl hover:shadow-[#A7B4A9]/40 transform active:scale-[0.98] flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <Loader2 className="animate-spin" size={24} />
                  ) : "Submit Reservation"}
                </button>
              </form>
            </div>

            {/* Image Side */}
            <div className="hidden lg:block lg:w-5/12 relative">
              <div className="absolute inset-0 bg-gradient-to-t from-[#2A332C] via-transparent to-transparent z-10 opacity-30"></div>
              <Image 
                src="/wellness-hero.png" 
                alt="Zen Interior View" 
                fill
                className="object-cover rounded-l-[4rem] border-l border-[#4A5D4E]"
              />
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-[#2A332C] pt-20 pb-10 px-6 border-t border-white/5">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-center mb-16 gap-10">
              <img src="/logo.svg" alt="Miboso Logo" className="h-10 w-auto" />
              <div className="flex gap-10">
                 <a href="#" className="text-white/50 hover:text-white transition-colors uppercase tracking-widest text-xs font-bold">Instagram</a>
                 <a href="#" className="text-white/50 hover:text-white transition-colors uppercase tracking-widest text-xs font-bold">Twitter</a>
                 <a href="#" className="text-white/50 hover:text-white transition-colors uppercase tracking-widest text-xs font-bold">Facebook</a>
              </div>
            </div>
            <div className="flex flex-col md:flex-row justify-between items-center text-[#4A5D4E] text-[10px] font-bold tracking-[0.2em] uppercase">
              <p>© 2024 Miboso Well Being Concept. Handcrafted Experience.</p>
              <div className="flex gap-10 mt-6 md:mt-0">
                <a href="#" className="hover:text-[#A7B4A9] transition-colors">Privacy</a>
                <a href="#" className="hover:text-[#A7B4A9] transition-colors">Terms</a>
              </div>
            </div>
          </div>
        </footer>
      </div>
      {/* Success Notification Bar */}
      <div className={`fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] transition-all duration-500 transform ${showSuccess ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
        <div className="bg-[#A7B4A9] text-[#2A332C] px-8 py-4 rounded-full shadow-2xl flex items-center gap-4 border border-white/20 backdrop-blur-md">
          <div className="bg-white/30 rounded-full p-1">
            <CheckCircle2 size={24} className="text-[#2A332C]" />
          </div>
          <span className="font-bold tracking-widest uppercase text-xs">Slot is reserved!</span>
        </div>
      </div>
    </div>
  );
}
