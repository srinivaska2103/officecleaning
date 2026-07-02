document.addEventListener('DOMContentLoaded', () => {
  const steps = document.querySelectorAll('.booking-step-content');
  const stepIndicators = document.querySelectorAll('.step-indicator');
  const prevBtns = document.querySelectorAll('.booking-prev-btn');
  const nextBtns = document.querySelectorAll('.booking-next-btn');
  const bookingForm = document.getElementById('booking-form');
  const priceSummaryBox = document.getElementById('price-summary-box');
  
  let currentStep = 0;

  // Pricing State
  const pricingData = {
    services: {
      'office-cleaning': 120,
      'deep-cleaning': 200,
      'commercial-cleaning': 250,
      'carpet-cleaning': 90,
      'glass-cleaning': 80,
      'floor-polishing': 150,
      'washroom-sanitization': 70,
      'industrial-cleaning': 450,
      'facility-management': 500,
      'pest-control': 110,
      'landscape-maintenance': 180,
      'housekeeping-services': 130
    },
    frequencies: {
      'one-time': { discount: 0, label: 'One-Time' },
      'weekly': { discount: 0.20, label: 'Weekly (Save 20%)' },
      'bi-weekly': { discount: 0.15, label: 'Bi-Weekly (Save 15%)' },
      'monthly': { discount: 0.10, label: 'Monthly (Save 10%)' }
    },
    sizes: {
      'small': { add: 0, label: 'Under 1,000 sq ft' },
      'medium': { add: 75, label: '1,000 - 3,000 sq ft (+$75)' },
      'large': { add: 150, label: '3,000 - 5,000 sq ft (+$150)' },
      'enterprise': { add: 300, label: 'Over 5,000 sq ft (+$300)' }
    },
    addons: {
      'carpet-shampoo': 60,
      'window-exterior': 50,
      'refrigerator-clean': 30,
      'disinfection-mist': 45
    }
  };

  const getFormState = () => {
    const selectedService = document.querySelector('input[name="service"]:checked')?.value || 'office-cleaning';
    const selectedFrequency = document.querySelector('input[name="frequency"]:checked')?.value || 'one-time';
    const selectedSize = document.querySelector('input[name="office-size"]:checked')?.value || 'small';
    const selectedDate = document.getElementById('booking-date')?.value || '';
    const selectedTime = document.querySelector('input[name="time-slot"]:checked')?.value || '';
    
    // Add-ons
    const addons = [];
    document.querySelectorAll('input[name="addons"]:checked').forEach(cb => {
      addons.push(cb.value);
    });

    // Contact info
    const fullName = document.getElementById('book-name')?.value || '';
    const email = document.getElementById('book-email')?.value || '';
    const phone = document.getElementById('book-phone')?.value || '';
    const company = document.getElementById('book-company')?.value || '';
    const address = document.getElementById('book-address')?.value || '';
    const notes = document.getElementById('book-notes')?.value || '';

    return {
      service: selectedService,
      frequency: selectedFrequency,
      size: selectedSize,
      date: selectedDate,
      time: selectedTime,
      addons,
      contact: { fullName, email, phone, company, address, notes }
    };
  };

  const calculateEstimate = () => {
    const state = getFormState();
    
    const basePrice = pricingData.services[state.service] || 120;
    const sizeAdder = pricingData.sizes[state.size]?.add || 0;
    
    let addonSum = 0;
    state.addons.forEach(addon => {
      addonSum += (pricingData.addons[addon] || 0);
    });

    const subtotal = basePrice + sizeAdder + addonSum;
    const freqInfo = pricingData.frequencies[state.frequency] || { discount: 0 };
    const discountAmount = subtotal * freqInfo.discount;
    const total = subtotal - discountAmount;

    return {
      basePrice,
      sizeAdder,
      addonSum,
      subtotal,
      discountAmount,
      discountPct: freqInfo.discount * 100,
      total
    };
  };

  const updatePriceSummaryUI = () => {
    if (!priceSummaryBox) return;

    const state = getFormState();
    const cost = calculateEstimate();

    // Human-readable names
    const serviceName = document.querySelector(`input[value="${state.service}"]`)?.closest('label')?.querySelector('.service-title')?.textContent || 'Office Cleaning';
    const frequencyLabel = pricingData.frequencies[state.frequency]?.label || 'One-Time';
    const sizeLabel = pricingData.sizes[state.size]?.label || 'Under 1,000 sq ft';

    priceSummaryBox.innerHTML = `
      <div class="space-y-3">
        <h4 class="font-semibold text-slate-800 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2 flex justify-between items-center">
          <span>Cost Summary</span>
          <span class="text-sm font-normal text-slate-500">${frequencyLabel}</span>
        </h4>
        <div class="space-y-2 text-sm text-slate-600 dark:text-slate-400">
          <div class="flex justify-between">
            <span>Base Service (${serviceName}):</span>
            <span class="font-medium text-slate-800 dark:text-slate-200">$${cost.basePrice.toFixed(2)}</span>
          </div>
          <div class="flex justify-between">
            <span>Office Size adjustment:</span>
            <span class="font-medium text-slate-800 dark:text-slate-200">+$${cost.sizeAdder.toFixed(2)}</span>
          </div>
          ${cost.addonSum > 0 ? `
          <div class="flex justify-between">
            <span>Selected Add-ons:</span>
            <span class="font-medium text-slate-800 dark:text-slate-200">+$${cost.addonSum.toFixed(2)}</span>
          </div>` : ''}
          <div class="flex justify-between border-t border-slate-100 dark:border-slate-800 pt-2 font-medium">
            <span>Subtotal:</span>
            <span class="text-slate-800 dark:text-slate-200">$${cost.subtotal.toFixed(2)}</span>
          </div>
          ${cost.discountAmount > 0 ? `
          <div class="flex justify-between text-emerald-600 dark:text-emerald-400">
            <span>Frequency Discount (${cost.discountPct}%):</span>
            <span>-$${cost.discountAmount.toFixed(2)}</span>
          </div>` : ''}
        </div>
        <div class="flex justify-between items-center border-t border-slate-200 dark:border-slate-700 pt-3">
          <span class="font-bold text-slate-800 dark:text-white text-base">Estimated Total:</span>
          <span class="text-2xl font-extrabold text-primary dark:text-secondary">$${cost.total.toFixed(2)}</span>
        </div>
      </div>
    `;
  };

  const updateStepsUI = () => {
    steps.forEach((step, idx) => {
      if (idx === currentStep) {
        step.classList.remove('hidden');
      } else {
        step.classList.add('hidden');
      }
    });

    stepIndicators.forEach((indicator, idx) => {
      const circle = indicator.querySelector('.step-circle');
      const text = indicator.querySelector('.step-text');
      const connector = indicator.querySelector('.step-connector');

      if (idx < currentStep) {
        // Completed Step
        circle.classList.add('bg-secondary', 'border-secondary', 'text-white');
        circle.classList.remove('bg-white', 'border-slate-300', 'text-slate-500', 'dark:bg-slate-800', 'dark:border-slate-700', 'bg-primary', 'border-primary');
        circle.innerHTML = '<i data-lucide="check" class="w-5 h-5"></i>';
        if (text) text.classList.add('text-secondary', 'font-medium');
        if (text) text.classList.remove('text-slate-500', 'text-primary');
        if (connector) connector.classList.add('bg-secondary');
        if (connector) connector.classList.remove('bg-slate-200', 'dark:bg-slate-700');
      } else if (idx === currentStep) {
        // Active Step
        circle.classList.add('bg-primary', 'border-primary', 'text-white', 'dark:bg-primary');
        circle.classList.remove('bg-white', 'border-slate-300', 'text-slate-500', 'bg-secondary', 'border-secondary');
        circle.textContent = idx + 1;
        if (text) text.classList.add('text-primary', 'font-semibold', 'dark:text-secondary');
        if (text) text.classList.remove('text-slate-500', 'text-secondary');
        if (connector) connector.classList.remove('bg-secondary');
        if (connector) connector.classList.add('bg-slate-200', 'dark:bg-slate-700');
      } else {
        // Upcoming Step
        circle.classList.add('bg-white', 'border-slate-300', 'text-slate-500', 'dark:bg-slate-800', 'dark:border-slate-700');
        circle.classList.remove('bg-primary', 'border-primary', 'bg-secondary', 'border-secondary', 'text-white');
        circle.textContent = idx + 1;
        if (text) text.classList.remove('text-primary', 'text-secondary', 'font-semibold', 'font-medium');
        if (text) text.classList.add('text-slate-500');
        if (connector) connector.classList.remove('bg-secondary');
        if (connector) connector.classList.add('bg-slate-200', 'dark:bg-slate-700');
      }
    });

    if (typeof lucide !== 'undefined') {
      lucide.createIcons();
    }

    // Build Summary in the 5th step
    if (currentStep === 4) {
      renderConfirmationSummary();
    }
  };

  const renderConfirmationSummary = () => {
    const summaryContainer = document.getElementById('booking-summary-container');
    if (!summaryContainer) return;

    const state = getFormState();
    const cost = calculateEstimate();

    const serviceName = document.querySelector(`input[value="${state.service}"]`)?.closest('label')?.querySelector('.service-title')?.textContent || 'Office Cleaning';
    const frequencyLabel = pricingData.frequencies[state.frequency]?.label || 'One-Time';
    const sizeLabel = pricingData.sizes[state.size]?.label || 'Under 1,000 sq ft';
    
    let addonsHTML = '';
    if (state.addons.length > 0) {
      addonsHTML = state.addons.map(addon => {
        const title = document.querySelector(`input[value="${addon}"]`)?.closest('label')?.querySelector('span')?.textContent || addon;
        return `<span class="bg-primary/10 text-primary dark:bg-slate-800 dark:text-secondary px-2.5 py-1 rounded-full text-xs font-medium">${title}</span>`;
      }).join(' ');
    } else {
      addonsHTML = '<span class="text-slate-500 text-sm">No optional add-ons selected</span>';
    }

    summaryContainer.innerHTML = `
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50 dark:bg-slate-900/50 p-6 rounded-xl border border-slate-100 dark:border-slate-800">
        <div class="space-y-4">
          <h4 class="font-bold text-slate-800 dark:text-white text-base border-b border-slate-200 dark:border-slate-800 pb-2">Service Details</h4>
          <div class="grid grid-cols-2 gap-y-2 gap-x-4 text-sm">
            <span class="text-slate-500">Service:</span>
            <span class="font-semibold text-slate-800 dark:text-slate-200">${serviceName}</span>
            <span class="text-slate-500">Frequency:</span>
            <span class="font-semibold text-slate-800 dark:text-slate-200">${frequencyLabel}</span>
            <span class="text-slate-500">Office Size:</span>
            <span class="font-semibold text-slate-800 dark:text-slate-200">${sizeLabel}</span>
            <span class="text-slate-500">Date:</span>
            <span class="font-semibold text-slate-800 dark:text-slate-200">${state.date || 'Not selected'}</span>
            <span class="text-slate-500">Preferred Time:</span>
            <span class="font-semibold text-slate-800 dark:text-slate-200">${state.time || 'Not selected'}</span>
          </div>
          <div>
            <span class="text-slate-500 text-sm block mb-1.5">Add-ons:</span>
            <div class="flex flex-wrap gap-1.5">${addonsHTML}</div>
          </div>
        </div>
        <div class="space-y-4">
          <h4 class="font-bold text-slate-800 dark:text-white text-base border-b border-slate-200 dark:border-slate-800 pb-2">Client Details</h4>
          <div class="grid grid-cols-2 gap-y-2 gap-x-4 text-sm">
            <span class="text-slate-500">Contact Person:</span>
            <span class="font-semibold text-slate-800 dark:text-slate-200">${state.contact.fullName || 'Not specified'}</span>
            <span class="text-slate-500">Company:</span>
            <span class="font-semibold text-slate-800 dark:text-slate-200">${state.contact.company || 'Not specified'}</span>
            <span class="text-slate-500">Email:</span>
            <span class="font-semibold text-slate-800 dark:text-slate-200 break-all">${state.contact.email || 'Not specified'}</span>
            <span class="text-slate-500">Phone:</span>
            <span class="font-semibold text-slate-800 dark:text-slate-200">${state.contact.phone || 'Not specified'}</span>
            <span class="text-slate-500">Address:</span>
            <span class="font-semibold text-slate-800 dark:text-slate-200">${state.contact.address || 'Not specified'}</span>
          </div>
          ${state.contact.notes ? `
          <div class="mt-2 pt-2 border-t border-slate-200 dark:border-slate-800">
            <span class="text-slate-500 text-xs block">Special Instructions:</span>
            <p class="text-slate-600 dark:text-slate-400 text-xs mt-1 bg-white dark:bg-slate-800 p-2 rounded border border-slate-100 dark:border-slate-700 italic">
              "${state.contact.notes}"
            </p>
          </div>` : ''}
        </div>
      </div>
      <div class="bg-primary/5 dark:bg-slate-900 border border-primary/20 dark:border-slate-800 p-6 rounded-xl flex flex-col sm:flex-row justify-between items-center gap-4">
        <div>
          <span class="text-sm font-semibold text-primary dark:text-secondary uppercase tracking-wider block">Estimated Total Cost</span>
          <p class="text-slate-500 text-xs mt-0.5">Recurring cleanings billed on the day of service.</p>
        </div>
        <div class="text-right">
          <span class="text-3xl font-black text-primary dark:text-secondary">$${cost.total.toFixed(2)}</span>
          <span class="text-slate-500 text-xs block">including tax & discounts</span>
        </div>
      </div>
    `;
  };

  const validateCurrentStep = () => {
    let isValid = true;
    
    // Clear previous errors
    steps[currentStep].querySelectorAll('.error-msg').forEach(el => el.classList.add('hidden'));

    if (currentStep === 0) {
      // Step 1: Check if service is selected
      const serviceSelected = document.querySelector('input[name="service"]:checked');
      if (!serviceSelected) {
        const errorEl = document.getElementById('error-step-1');
        if (errorEl) errorEl.classList.remove('hidden');
        isValid = false;
      }
    } else if (currentStep === 1) {
      // Step 2: Check date and time
      const bookingDate = document.getElementById('booking-date')?.value;
      const timeSelected = document.querySelector('input[name="time-slot"]:checked');
      
      if (!bookingDate) {
        const dateErr = document.getElementById('error-date');
        if (dateErr) dateErr.classList.remove('hidden');
        isValid = false;
      }
      if (!timeSelected) {
        const timeErr = document.getElementById('error-time');
        if (timeErr) timeErr.classList.remove('hidden');
        isValid = false;
      }
    } else if (currentStep === 2) {
      // Step 3: Office dimensions (Office size input is required, select box has default)
      const sizeSelected = document.querySelector('input[name="office-size"]:checked');
      if (!sizeSelected) {
        const sizeErr = document.getElementById('error-size');
        if (sizeErr) sizeErr.classList.remove('hidden');
        isValid = false;
      }
    } else if (currentStep === 3) {
      // Step 4: Contact details
      const name = document.getElementById('book-name')?.value.trim();
      const email = document.getElementById('book-email')?.value.trim();
      const phone = document.getElementById('book-phone')?.value.trim();
      const address = document.getElementById('book-address')?.value.trim();

      if (!name) {
        const err = document.getElementById('error-book-name');
        if (err) err.classList.remove('hidden');
        isValid = false;
      }
      if (!email || !validateEmail(email)) {
        const err = document.getElementById('error-book-email');
        if (err) err.classList.remove('hidden');
        isValid = false;
      }
      if (!phone) {
        const err = document.getElementById('error-book-phone');
        if (err) err.classList.remove('hidden');
        isValid = false;
      }
      if (!address) {
        const err = document.getElementById('error-book-address');
        if (err) err.classList.remove('hidden');
        isValid = false;
      }
    }

    return isValid;
  };

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  // Event Listeners for wizard buttons
  nextBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      if (validateCurrentStep()) {
        currentStep++;
        updateStepsUI();
        window.scrollTo({ top: 300, behavior: 'smooth' });
      }
    });
  });

  prevBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      currentStep--;
      updateStepsUI();
      window.scrollTo({ top: 300, behavior: 'smooth' });
    });
  });

  // Calculate pricing when inputs change
  if (bookingForm) {
    bookingForm.addEventListener('change', () => {
      updatePriceSummaryUI();
    });
    // Trigger first update
    updatePriceSummaryUI();
  }

  // Handle wizard submission
  if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      if (!validateCurrentStep()) return;

      // Show loader simulation
      const submitBtn = document.getElementById('booking-submit-btn');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span class="inline-block animate-spin mr-2">&#9696;</span> Submitting Request...';
      }

      setTimeout(() => {
        // Show confirmation step
        const bookingCard = document.getElementById('booking-card-main');
        const confirmationCard = document.getElementById('booking-confirmation-card');
        
        if (bookingCard && confirmationCard) {
          bookingCard.classList.add('hidden');
          confirmationCard.classList.remove('hidden');
          
          // Populate unique reference ID
          const refEl = document.getElementById('booking-ref-id');
          if (refEl) {
            const randomRef = 'CP-' + Math.floor(100000 + Math.random() * 900000);
            refEl.textContent = randomRef;
          }
          
          window.scrollTo({ top: 150, behavior: 'smooth' });
        }
      }, 1500);
    });
  }
});
