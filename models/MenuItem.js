/**
 * Represents a single item on the restaurant's menu.
 */
class MenuItem {
  /**
   * @param {object} props - The properties of the menu item.
   * @param {string} props.id - The unique ID of the document from Firestore.
   * @param {string} props.name - The name of the item (e.g., "Osh").
   * @param {string} props.description - A brief description of the item.
   * @param {number} props.price - The price of the item in UZS.
   * @param {string} props.category - The category the item belongs to (e.g., "Issiq ovqatlar").
   * @param {string} props.imageUrl - The URL of the item's image in Firebase Storage.
   * @param {boolean} [props.isAvailable=true] - Whether the item is currently available for order.
   * @param {Date} props.createdAt - The timestamp when the item was added.
   */
  constructor({ id, name, description, price, category, imageUrl, isAvailable = true, createdAt }) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.price = price;
    this.category = category;
    this.imageUrl = imageUrl;
    this.isAvailable = isAvailable;
    this.createdAt = createdAt;
  }

  /**
   * A helper function to create a MenuItem instance from a Firestore document snapshot.
   * This is a clean way to convert Firestore data into our structured model.
   * @param {import("firebase/firestore").DocumentSnapshot} doc - The document snapshot from Firestore.
   * @returns {MenuItem} A new instance of the MenuItem class.
   */
  static fromFirestore(doc) {
    const data = doc.data();
    return new MenuItem({
      id: doc.id,
      name: data.name,
      description: data.description,
      price: data.price,
      category: data.category,
      imageUrl: data.imageUrl,
      isAvailable: data.isAvailable,
      // Convert Firestore Timestamp to a JavaScript Date object
      createdAt: data.createdAt?.toDate(),
    });
  }
}

export default MenuItem;