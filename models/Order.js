/**
 * Represents a customer's order in the restaurant.
 */
class Order {
  /**
   * @param {object} props - The properties of the order.
   * @param {string} props.id - The unique ID of the document from Firestore.
   * @param {string} props.tableId - The ID of the table associated with the order.
   * @param {number} props.tableNumber - The human-readable number of the table (denormalized for easy display).
   * @param {string} props.waiterId - The UID of the waiter who created the order.
   * @param {Array<object>} props.items - An array of items in the order.
   * @param {string} props.items.itemId - The ID of the menu item.
   * @param {string} props.items.itemName - The name of the menu item.
   * @param {number} props.items.quantity - The quantity of the menu item ordered.
   * @param {number} props.items.price - The price of a single unit of the item at the time of order.
   * @param {number} props.totalPrice - The calculated total price for the entire order.
   * @param {'new' | 'preparing' | 'served' | 'paid'} props.status - The current status of the order.
   * @param {Date} props.createdAt - The timestamp when the order was created.
   * @param {Date | null} props.completedAt - The timestamp when the order was paid. Null if not yet paid.
   */
  constructor({ id, tableId, tableNumber, waiterId, items, totalPrice, status, createdAt, completedAt }) {
    this.id = id;
    this.tableId = tableId;
    this.tableNumber = tableNumber;
    this.waiterId = waiterId;
    this.items = items;
    this.totalPrice = totalPrice;
    this.status = status;
    this.createdAt = createdAt;
    this.completedAt = completedAt;
  }

  /**
   * A helper function to create an Order instance from a Firestore document snapshot.
   * @param {import("firebase/firestore").DocumentSnapshot} doc - The document snapshot from Firestore.
   * @returns {Order} A new instance of the Order class.
   */
  static fromFirestore(doc) {
    const data = doc.data();
    return new Order({
      id: doc.id,
      tableId: data.tableId,
      tableNumber: data.tableNumber,
      waiterId: data.waiterId,
      items: data.items || [], // Default to an empty array if items are missing
      totalPrice: data.totalPrice,
      status: data.status,
      // Convert Firestore Timestamps to JavaScript Date objects
      createdAt: data.createdAt?.toDate(),
      completedAt: data.completedAt?.toDate() || null, // Handle null case for completedAt
    });
  }
}

export default Order;