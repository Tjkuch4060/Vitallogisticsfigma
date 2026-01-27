import { useEffect, useRef } from 'react';
import { driver } from 'driver.js';
import 'driver.js/dist/driver.css';

export function OnboardingTour() {
  const driverObjRef = useRef<ReturnType<typeof driver> | null>(null);

  useEffect(() => {
    // Check if user has seen the tour
    const hasSeenTour = localStorage.getItem('tour-completed');
    if (hasSeenTour) {
      return;
    }

    // Build steps array - only include elements that exist
    const steps = [];
    
    // Catalog link
    if (document.querySelector('#catalog-link')) {
      steps.push({
        element: '#catalog-link',
        popover: {
          title: 'Product Catalog',
          description: 'Browse all available products here. You can search, filter, and add items to your cart.',
          side: 'bottom',
          align: 'start',
        },
      });
    }

    // Cart button
    if (document.querySelector('#cart-button')) {
      steps.push({
        element: '#cart-button',
        popover: {
          title: 'Shopping Cart',
          description: 'View your cart, manage quantities, and proceed to checkout. Your cart persists across sessions.',
          side: 'bottom',
          align: 'end',
        },
      });
    }

    // Compare button (only if visible)
    const compareButton = document.querySelector('#compare-button');
    if (compareButton && compareButton.parentElement?.style.display !== 'none') {
      steps.push({
        element: '#compare-button',
        popover: {
          title: 'Product Comparison',
          description: 'Compare up to 4 products side-by-side to make informed purchasing decisions. This button appears when you add products to compare.',
          side: 'bottom',
          align: 'end',
        },
      });
    }

    // Dashboard link
    if (document.querySelector('#dashboard-link')) {
      steps.push({
        element: '#dashboard-link',
        popover: {
          title: 'Dashboard',
          description: 'View your revenue metrics, orders, and business insights. Customize which metrics to display.',
          side: 'bottom',
          align: 'start',
        },
      });
    }

    // Initialize driver.js
    driverObjRef.current = driver({
      showProgress: true,
      showButtons: ['next', 'previous', 'close'],
      steps,
      onDestroyStarted: () => {
        // Mark tour as completed when user closes it
        localStorage.setItem('tour-completed', 'true');
      },
      onDestroyed: () => {
        // Mark tour as completed when tour finishes
        localStorage.setItem('tour-completed', 'true');
      },
    });

    // Small delay to ensure DOM is ready
    const timer = setTimeout(() => {
      driverObjRef.current?.drive();
    }, 1000);

    return () => {
      clearTimeout(timer);
      if (driverObjRef.current) {
        driverObjRef.current.destroy();
      }
    };
  }, []);

  return null;
}
