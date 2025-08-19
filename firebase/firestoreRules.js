rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
  
    // --- Helper Functions ---
    // Checks if the user is signed in.
    function isSignedIn() {
      return request.auth != null;
    }
    
    // Checks if the signed-in user has a specific role from custom claims.
    function isUserRole(role) {
      return isSignedIn() && request.auth.token.role == role;
    }
    
    // --- Collection Rules ---

    // USERS Collection
    match /users/{userId} {
      // A user can create their own document during sign-up.
      allow create: if request.auth.uid == userId;
      
      // Only the user themselves or an admin can read or update a user's data.
      allow read, update: if request.auth.uid == userId || isUserRole('admin');
      
      // Only admins should be able to delete users.
      allow delete: if isUserRole('admin');
    }

    // MENUITEMS Collection
    match /menuItems/{menuItemId} {
      // Any signed-in staff member can read the menu.
      allow read: if isSignedIn();
      
      // Only an admin can create, update, or delete menu items.
      allow write: if isUserRole('admin');
    }

    // TABLES Collection
    match /tables/{tableId} {
      // Any signed-in staff member can see the table statuses.
      allow read: if isSignedIn();

      // A waiter or cashier can update a table's status.
      allow update: if isUserRole('waiter') || isUserRole('cashier');

      // Only an admin can create or delete tables.
      allow create, delete: if isUserRole('admin');
    }

    // ORDERS Collection
    match /orders/{orderId} {
      // Read allowed for the waiter who created it, or a cashier/admin.
      allow read: if resource.data.waiterId == request.auth.uid || isUserRole('cashier') || isUserRole('admin');

      // Only a waiter can create, and must be assigned to the order.
      allow create: if isUserRole('waiter') && request.resource.data.waiterId == request.auth.uid;

      // Only a cashier or admin can update.
      allow update: if isUserRole('cashier') || isUserRole('admin');

      // Only an admin can delete.
      allow delete: if isUserRole('admin');
    }
    
    // PAYMENTS Collection
    match /payments/{paymentId} {
      // Only cashiers and admins can view.
      allow read: if isUserRole('cashier') || isUserRole('admin');

      // Only a cashier can create, and must be assigned to it.
      allow create: if isUserRole('cashier') && request.resource.data.cashierId == request.auth.uid;
      
      // Only an admin can update or delete.
      allow update, delete: if isUserRole('admin');
    }
  }
}
