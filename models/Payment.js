/**
 * Represents a payment transaction for a completed order.
 */
class Payment {
  /**
   * @param {object} props - The properties of the payment.
   * @param {string} props.id - The unique ID of the document from Firestore.
   * @param {string} props.orderId - The ID of the order this payment is for.
   * @param {number} props.amount - The total amount that was paid.
   * @param {'cash' | 'card'} props.paymentMethod - The method used for the payment.
   * @param {string} props.cashierId - The UID of the cashier who processed the payment.
   * @param {Date} props.createdAt - The timestamp when the payment was processed.
   */
  constructor({ id, orderId, amount, paymentMethod, cashierId, createdAt }) {
    this.id = id;
    this.orderId = orderId;
    this.amount = amount;
    this.paymentMethod = paymentMethod;
    this.cashierId = cashierId;
    this.createdAt = createdAt;
  }

  /**
   * A helper function to create a Payment instance from a Firestore document snapshot.
   * @param {import("firebase/firestore").DocumentSnapshot} doc - The document snapshot from Firestore.
   * @returns {Payment} A new instance of the Payment class.
   */
  static fromFirestore(doc) {
    const data = doc.data();
    return new Payment({
      id: doc.id,
      orderId: data.orderId,
      amount: data.amount,
      paymentMethod: data.paymentMethod,
      cashierId: data.cashierId,
      // Convert Firestore Timestamp to a JavaScript Date object
      createdAt: data.createdAt?.toDate(),
    });
  }
}

export default Payment;