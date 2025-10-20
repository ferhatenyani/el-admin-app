import { useEffect } from 'react';

/**
 * Custom hook to lock/unlock body scroll when modals are open
 *
 * @param {boolean} isLocked - Whether to lock the scroll
 *
 * Features:
 * - Prevents background scrolling when modals are open
 * - Restores original overflow state when modal closes
 * - Prevents layout shift by maintaining scrollbar space
 * - Cleans up properly on unmount
 *
 * Usage:
 * ```jsx
 * const MyModal = ({ isOpen, onClose }) => {
 *   useScrollLock(isOpen);
 *   // ... rest of component
 * }
 * ```
 */
const useScrollLock = (isLocked) => {
  useEffect(() => {
    if (!isLocked) return;

    // Store original overflow values
    const originalOverflow = document.body.style.overflow;
    const originalPaddingRight = document.body.style.paddingRight;

    // Get scrollbar width to prevent layout shift
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

    // Lock scroll
    document.body.style.overflow = 'hidden';

    // Add padding to prevent layout shift when scrollbar disappears
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }

    // Cleanup function to restore original state
    return () => {
      document.body.style.overflow = originalOverflow;
      document.body.style.paddingRight = originalPaddingRight;
    };
  }, [isLocked]);
};

export default useScrollLock;
