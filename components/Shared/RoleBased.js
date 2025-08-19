import React from 'react';

/**
 * A utility component that conditionally renders its children based on the user's role.
 * It provides a clean, declarative way to implement Role-Based Access Control in the UI.
 *
 * @param {object} props - The properties for the component.
 * @param {string} props.userRole - The role of the currently logged-in user (e.g., 'admin', 'waiter').
 * @param {object} props.roles - An object where keys are role names and values are the components or JSX to render for that role.
 * @param {React.ReactNode} [props.fallback=null] - A fallback component to render if the user's role does not match any key in the 'roles' object.
 * @returns {React.ReactNode} The component corresponding to the user's role, or the fallback.
 */
const RoleBased = ({ userRole, roles, fallback = null }) => {
  // Check if a component is defined for the current user's role.
  if (roles && roles[userRole]) {
    // If it exists, render that component.
    return roles[userRole];
  }
  
  // Otherwise, render the fallback component.
  return fallback;
};

export default RoleBased;