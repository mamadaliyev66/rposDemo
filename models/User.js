/**
 * Represents a user (staff member) of the POS application.
 */
class User {
  /**
   * @param {object} props - The properties of the user.
   * @param {string} props.uid - The user's unique ID from Firebase Authentication. This is also the document ID.
   * @param {string} props.email - The user's login email address.
   * @param {string} props.displayName - The full name of the user.
   * @param {'admin' | 'waiter' | 'cashier'} props.role - The user's role in the system, which determines their permissions.
   * @param {Date} props.createdAt - The timestamp when the user was created.
   */
  constructor({ uid, email, displayName, role, createdAt }) {
    this.uid = uid;
    this.email = email;
    this.displayName = displayName;
    this.role = role;
    this.createdAt = createdAt;
  }

  /**
   * A helper function to create a User instance from a Firestore document snapshot.
   * @param {import("firebase/firestore").DocumentSnapshot} doc - The document snapshot from Firestore.
   * @returns {User} A new instance of the User class.
   */
  static fromFirestore(doc) {
    const data = doc.data();
    return new User({
      // The document ID in the 'users' collection is the UID
      uid: doc.id,
      email: data.email,
      displayName: data.displayName,
      role: data.role,
      // Convert Firestore Timestamp to a JavaScript Date object
      createdAt: data.createdAt?.toDate(),
    });
  }
}

export default User;