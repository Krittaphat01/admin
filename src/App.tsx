import React, { useEffect, useState } from "react";
import { db } from "./firebaseConfig";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  Box,
  Select,
  MenuItem,
  TextField,
  Button,
} from "@mui/material";

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface OrderData {
  id: string;
  customer: {
    name: string;
    address: string;
    phone: string;
  };
  cartItems: CartItem[];
  totalPrice: number;
  status: string;
  shippingProvider?: string;
  trackingNumber?: string;
}

const statusOptions = ["กำลังเตรียม", "กำลังจัดส่ง"];
const shippingOptions = ["SPX", "KERRY", "FLASH"];

const OrdersTable: React.FC = () => {
  const [orders, setOrders] = useState<OrderData[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const rowsPerPage = 6;
  const [editingOrderId, setEditingOrderId] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "orders"));
        if (querySnapshot.empty) throw new Error("No orders found");

        const ordersList = querySnapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            customer: data.customer || { name: "Unknown", address: "N/A", phone: "N/A" },
            timestamp: data.timestamp?.toDate?.().toLocaleString() || "N/A",
            cartItems: data.items || [],
            totalPrice: data.total || 0,
            status: data.status || "กำลังดำเนินการ",
            shippingProvider: data.shippingProvider || "",
            trackingNumber: data.trackingNumber || "",
          };
        }) as OrderData[];

        setOrders(ordersList);
      } catch (err) {
        console.error("Error fetching orders:", err);
        setError(`Failed to fetch orders: ${err instanceof Error ? err.message : "Unknown error"}`);
      }
    };

    fetchOrders();
  }, []);

  const handleChangePage = (_event: unknown, newPage: number) => setPage(newPage);

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      const orderRef = doc(db, "orders", orderId);
      await updateDoc(orderRef, { status: newStatus });

      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );
    } catch (error) {
      console.error("Error updating status:", error);
      alert("เกิดข้อผิดพลาดในการอัปเดตสถานะ");
    }
  };

  const handleSave = async (orderId: string, shippingProvider: string, trackingNumber: string) => {
    try {
      const orderRef = doc(db, "orders", orderId);
      await updateDoc(orderRef, { shippingProvider, trackingNumber });

      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId ? { ...order, shippingProvider, trackingNumber } : order
        )
      );

      setEditingOrderId(null); 
    } catch (error) {
      console.error("Error updating shipping info:", error);
      alert("เกิดข้อผิดพลาดในการบันทึกข้อมูลขนส่ง");
    }
  };

  return (
    <Box sx={{ minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center", backgroundImage: "url(/123.jpg)", backgroundSize: "cover", backgroundPosition: "center", width: "1700px" }}>
      <TableContainer component={Paper} sx={{ width: "100%", marginLeft: "20px", marginRight: "20px", border: "2px solid rgb(10, 124, 238)" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Order ID</TableCell>
              <TableCell>Customer Name</TableCell>
              <TableCell>Address</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Items</TableCell>
              <TableCell>Total Price</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Shipping Provider</TableCell>
              <TableCell>Tracking Number</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {error ? (
              <TableRow>
                <TableCell colSpan={11} style={{ color: "red" }}>{error}</TableCell>
              </TableRow>
            ) : (
              orders.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((order) => (
                <TableRow key={order.id}>
                  <TableCell>{order.id}</TableCell>
                  <TableCell>{order.customer.name}</TableCell>
                  <TableCell>{order.customer.address}</TableCell>
                  <TableCell>{order.customer.phone}</TableCell>
                  
                  <TableCell>
                    {order.cartItems.map((item) => (
                      <div key={item.id}>{item.name} (x{item.quantity})</div>
                    ))}
                  </TableCell>
                  <TableCell>${order.totalPrice.toFixed()}</TableCell>
                  <TableCell>
                    <Select value={order.status} onChange={(e) => handleStatusChange(order.id, e.target.value)} sx={{ width: 150, backgroundColor: "white" }}>
                      {statusOptions.map((status) => (
                        <MenuItem key={status} value={status}>{status}</MenuItem>
                      ))}
                    </Select>
                  </TableCell>
                  <TableCell>
                    <Select
                      disabled={editingOrderId !== order.id}
                      value={order.shippingProvider || ""}
                      onChange={(e) => setOrders((prev) =>
                        prev.map((o) => (o.id === order.id ? { ...o, shippingProvider: e.target.value } : o))
                      )}
                      sx={{ width: 120, backgroundColor: "white" }}
                    >
                      {shippingOptions.map((option) => (
                        <MenuItem key={option} value={option}>{option}</MenuItem>
                      ))}
                    </Select>
                  </TableCell>
                  <TableCell>
                    <TextField
                      disabled={editingOrderId !== order.id}
                      value={order.trackingNumber || ""}
                      onChange={(e) => setOrders((prev) =>
                        prev.map((o) => (o.id === order.id ? { ...o, trackingNumber: e.target.value } : o))
                      )}
                    />
                  </TableCell>
                  <TableCell>
                    {editingOrderId === order.id ? (
                      <Button variant="contained" color="primary" onClick={() => handleSave(order.id, order.shippingProvider || "", order.trackingNumber || "")}>บันทึก</Button>
                    ) : (
                      <Button variant="outlined" color="secondary" onClick={() => setEditingOrderId(order.id)}>แก้ไข</Button>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        <TablePagination component="div" count={orders.length} rowsPerPage={rowsPerPage} page={page} onPageChange={handleChangePage} rowsPerPageOptions={[rowsPerPage]} />
      </TableContainer>
    </Box>
  );
};

export default OrdersTable;
