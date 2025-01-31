import React, { useEffect, useState } from "react";
import { db } from "../../../firebse"; // Adjust the import path based on your project structure
import { collection, getDocs } from "firebase/firestore";
import { getAuth } from "firebase/auth";

export default function OrderTab() {
  const [orders, setOrders] = useState([]);
  const auth = getAuth();
  const currentUser = auth.currentUser;

  const [isModalOpen, setIsModalOpen] = useState(false); // For modal visibility
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      const sanitizedEmail = currentUser.email.replace(/\s/g, "_");
      try {
        const querySnapshot = await getDocs(
          collection(
            db,
            "admin",
            "nithya123@gmail.com",
            "users",
            sanitizedEmail,
            "order"
          )
        );
        const ordersList = querySnapshot.docs.map((doc) => doc.data());
        setOrders(ordersList);
      } catch (error) {
        console.error("Error fetching orders: ", error);
      }
    };

    if (currentUser) {
      fetchOrders();
    }
  }, [currentUser]);

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  // Function to handle closing the modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedOrder(null);
  };

  return (
    <>
      <div className="relative w-full overflow-x-auto sm:rounded-lg">
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <tbody>
            {/* Table Heading */}
            <tr className="text-base text-white whitespace-nowrap px-2 border-b default-border-bottom bg-purple-800">
              {/* <td className="py-4 block whitespace-nowrap text-center">Order</td> */}
              <td className="py-4 whitespace-nowrap text-center">Date</td>
              <td className="py-4 whitespace-nowrap text-center">Status</td>
              <td className="py-4 whitespace-nowrap text-center">Amount</td>
              <td className="py-4 whitespace-nowrap text-center">Action</td>
            </tr>
            {/* Table Rows */}
            {orders.map((order, index) => (
              <tr key={index} className="border-b border-gray-300 hover:bg-gray-100 transition">
                {/* <td className="text-center py-4">
                  <span className="text-lg text-qgray font-medium">#{order.id}</span>
                </td> */}
                <td className="text-center py-4 px-2">
                  <span className="text-base text-qgray whitespace-nowrap">
                    {new Date(order.timestamp.seconds * 1000).toLocaleDateString()}
                  </span>
                </td>
                <td className="text-center py-4 px-2">
                  <span
                    className={`text-sm rounded p-2 ${
                      order.status === "Delivered"
                        ? "text-green-500 bg-green-100"
                        : "text-yellow-500 bg-yellow-100"
                    }`}
                  >
                    {order.status}
                  </span>
                </td>
                <td className="text-center py-4 px-2">
                  <span className="text-base text-qblack whitespace-nowrap px-2">
                    ₹{order.grandTotal}
                  </span>
                </td>
                <td className="text-center py-4">
                  <button
                    type="button"
                    className="w-[116px] h-[46px] bg-qyellow text-qblack font-bold"
                    onClick={() => handleViewDetails(order)}
                  >
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {isModalOpen && selectedOrder && (
  <div className="fixed inset-0 z-50 bg-gray-600 bg-opacity-50 flex justify-center items-center">
    <div className="bg-white p-6 rounded-md shadow-lg w-[600px]  h-[200px]max-w-full overflow-y-auto">
      <h3 className="text-2xl font-extrabold mb-0 text-center text-qblack">Order Details</h3>

      <table className="w-full table-auto border-separate border-spacing-1">
        <tbody>
          {/* Name */}
          <tr className="border-b border-gray-200">
            <td className="py-3 px-6 font-semibold text-gray-800">Name:</td>
            <td className="py-3 px-6 text-gray-600">{selectedOrder.name}</td>
          </tr>

          {/* Email */}
          <tr className="border-b border-gray-200">
            <td className="py-3 px-6 font-semibold text-gray-800">Email:</td>
            <td className="py-3 px-6 text-gray-600">{selectedOrder.email}</td>
          </tr>

          {/* Phone */}
          <tr className="border-b border-gray-200">
            <td className="py-3 px-6 font-semibold text-gray-800">Phone:</td>
            <td className="py-3 px-6 text-gray-600">{selectedOrder.phone}</td>
          </tr>

          {/* Address */}
          <tr className="border-b border-gray-200">
            <td className="py-3 px-6 font-semibold text-gray-800">Address:</td>
            <td className="py-3 px-6 text-gray-600">{selectedOrder.address}</td>
          </tr>

          {/* Payment Method */}
          <tr className="border-b border-gray-200">
            <td className="py-3 px-6 font-semibold text-gray-800">Payment Method:</td>
            <td className="py-3 px-6 text-gray-600">{selectedOrder.paymentMethod}</td>
          </tr>

       {/* Cart Items */}
<tr className="border-b border-gray-200">
  <td className="py-3 px-6 font-semibold text-gray-800">Products Details:</td>
  <td className="py-3 px-6">
    <ul className="list-disc pl-6">
      {selectedOrder.cartItems.map((item, index) => (
        <li key={index} className="mb-1 flex items-center space-x-3">
          <img
            src={item.image || "fallback_image_url"}
            alt={item.name}
            className="w-12 h-12 rounded-md"
          />
          <span className="font-semibold text-gray-700">
            {item.name} ({item.quantity})
          </span>
          <span className="ml-2 text-gray-600">- ₹{item.price}</span>
        </li>
      ))}
    </ul>
  </td>
</tr>


          {/* Order Totals */}
          <tr className="border-b border-gray-200">
            <td className="py-3 px-6 font-semibold text-gray-800">Subtotal:</td>
            <td className="py-3 px-6 text-gray-600">₹{selectedOrder.subtotal}</td>
          </tr>
          <tr className="border-b border-gray-200">
            <td className="py-3 px-6 font-semibold text-gray-800">Shipping Charge:</td>
            <td className="py-3 px-6 text-gray-600">₹{selectedOrder.shippingCharge}</td>
          </tr>
          <tr className="border-b border-gray-200">
            <td className="py-3 px-6 font-semibold text-gray-800">Grand Total:</td>
            <td className="py-3 px-6 text-lg font-bold text-qpurple">₹{selectedOrder.grandTotal}</td>
          </tr>
        </tbody>
      </table>

      {/* Close Button */}
      <div className="mt-6 flex justify-end">
        <button
          onClick={handleCloseModal}
          className="px-6 py-3 bg-qyellow text-qblack font-semibold rounded-lg shadow-md hover:bg-yellow-600 transition duration-300"
        >
          Close
        </button>
      </div>
    </div>
  </div>
)}

      </div>
    </>
  );
}
