/**
 * Represents a single table in the restaurant.
 */
class Table {
  /**
   * @param {object} props - The properties of the table.
   * @param {string} props.id - The unique ID of the document from Firestore.
   * @param {number} props.tableNumber - The human-readable number of the table.
   * @param {'available' | 'occupied' | 'reserved'} props.status - The current status of the table.
   * @param {string | null} props.currentOrderId - The ID of the order currently active on this table. Null if the table is not occupied.
   */
  constructor({ id, tableNumber, status, currentOrderId }) {
    this.id = id;
    this.tableNumber = tableNumber;
    this.status = status;
    this.currentOrderId = currentOrderId;
  }

  /**
   * A helper function to create a Table instance from a Firestore document snapshot.
   * @param {import("firebase/firestore").DocumentSnapshot} doc - The document snapshot from Firestore.
   * @returns {Table} A new instance of the Table class.
   */
  static fromFirestore(doc) {
    const data = doc.data();
    return new Table({
      id: doc.id,
      tableNumber: data.tableNumber,
      status: data.status,
      currentOrderId: data.currentOrderId || null, // Ensure it's null if undefined
    });
  }
}

export default Table;