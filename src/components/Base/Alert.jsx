import React from 'react';

// Simple utility function for combining class names
const combineClasses = (...classes) => {
  return classes.filter(Boolean).join(' ');
};

const Alert = React.forwardRef(({ className = "", ...props }, ref) => (
  <div
    ref={ref}
    role="alert"
    className={combineClasses(
      "relative w-full rounded-lg border p-4",
      "bg-background text-foreground",
      className
    )}
    {...props}
  />
));
Alert.displayName = "Alert";

const AlertTitle = React.forwardRef(({ className = "", ...props }, ref) => (
  <h5
    ref={ref}
    className={combineClasses(
      "mb-1 font-medium leading-none tracking-tight",
      className
    )}
    {...props}
  />
));
AlertTitle.displayName = "AlertTitle";

const AlertDescription = React.forwardRef(({ className = "", ...props }, ref) => (
  <div
    ref={ref}
    className={combineClasses(
      "text-sm [&_p]:leading-relaxed",
      className
    )}
    {...props}
  />
));
AlertDescription.displayName = "AlertDescription";

export { Alert, AlertTitle, AlertDescription };