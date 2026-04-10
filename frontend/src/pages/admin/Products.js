import { useState, useEffect } from "react";
import api from "../../utils/api";
import { toast } from "react-toastify";
import AdminLayout from "./AdminLayout";

const EMPTY_PRODUCT = {
  name: "", description: "", price: "", originalPrice: "",
  category: "unisex", stock: "", sizes: [], colors: [],
  images: [""], featured: false, isActive: true,
};

const SIZES = ["XS","S","M","L","XL","XXL","One Size"];
const CATEGORIES = ["men","women","unisex","kids","accessories"];

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY_PRODUCT);
  const [saving, setSaving] = useState(false);

  const load = () => {
    api.get("/api/admin/products")
      .then((r) => setProducts(r.data.products))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const openNew = () => { setForm(EMPTY_PRODUCT); setEditing(null); setModal(true); };
  const openEdit = (p) => {
    setForm({ ...p, images: p.images?.length ? p.images : [""] });
    setEditing(p._id); setModal(true);
  };

  const set = (f) => (e) => setForm({ ...form, [f]: e.target.value });
  const toggleSize = (s) => setForm({ ...form, sizes: form.sizes.includes(s) ? form.sizes.filter((x) => x !== s) : [...form.sizes, s] });

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { ...form, price: Number(form.price), originalPrice: form.originalPrice ? Number(form.originalPrice) : undefined, stock: Number(form.stock), images: form.images.filter(Boolean) };
      if (editing) await api.put(`/api/admin/products/${editing}`, payload);
      else await api.post("/api/admin/products", payload);
      toast.success(editing ? "Product updated!" : "Product created!");
      setModal(false); load();
    } catch (err) {
      toast.error(err.response?.data?.message || "Error saving product");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    try {
      await api.delete(`/api/admin/products/${id}`);
      toast.success("Product deleted");
      load();
    } catch { toast.error("Error deleting"); }
  };

  return (
    <AdminLayout title="Products">
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 24 }}>
        <button className="btn btn-primary" onClick={openNew}>+ Add Product</button>
      </div>

      {loading ? <div className="loader" /> : (
        <div className="card" style={{ padding: 0 }}>
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Product</th><th>Category</th><th>Price</th><th>Stock</th><th>Featured</th><th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p._id}>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <img src={p.images?.[0] || `https://placehold.co/40x50/1a1a1a/f5f5f0?text=IMG`} alt="" style={{ width: 40, height: 50, objectFit: "cover", borderRadius: 4 }} />
                        <span style={{ fontWeight: 500 }}>{p.name}</span>
                      </div>
                    </td>
                    <td><span className="badge badge-gray">{p.category}</span></td>
                    <td>${p.price.toFixed(2)}</td>
                    <td><span className={p.stock < 5 ? "badge badge-red" : "badge badge-green"}>{p.stock}</span></td>
                    <td>{p.featured ? "⭐" : "—"}</td>
                    <td>
                      <div style={{ display: "flex", gap: 8 }}>
                        <button className="btn btn-dark btn-sm" onClick={() => openEdit(p)}>Edit</button>
                        <button className="btn btn-danger btn-sm" onClick={() => handleDelete(p._id)}>Del</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {modal && (
        <div className="admin-modal-overlay" onClick={(e) => e.target === e.currentTarget && setModal(false)}>
          <div className="admin-modal">
            <h3>{editing ? "Edit Product" : "New Product"}</h3>
            <form onSubmit={handleSave}>
              <div className="form-group"><label>Name</label><input value={form.name} onChange={set("name")} required /></div>
              <div className="form-group"><label>Description</label><textarea value={form.description} onChange={set("description")} required /></div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <div className="form-group"><label>Price ($)</label><input type="number" step="0.01" value={form.price} onChange={set("price")} required /></div>
                <div className="form-group"><label>Original Price ($)</label><input type="number" step="0.01" value={form.originalPrice} onChange={set("originalPrice")} /></div>
                <div className="form-group"><label>Stock</label><input type="number" value={form.stock} onChange={set("stock")} required /></div>
                <div className="form-group">
                  <label>Category</label>
                  <select value={form.category} onChange={set("category")}>
                    {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label>Image URL</label>
                <input value={form.images[0]} onChange={(e) => setForm({ ...form, images: [e.target.value] })} placeholder="https://..." />
              </div>
              <div className="form-group">
                <label>Sizes</label>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {SIZES.map((s) => (
                    <button key={s} type="button"
                      className={`btn btn-sm ${form.sizes.includes(s) ? "btn-primary" : "btn-outline"}`}
                      onClick={() => toggleSize(s)}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>
              <div className="form-group">
                <label>Colors (comma-separated)</label>
                <input value={form.colors?.join(",")} onChange={(e) => setForm({ ...form, colors: e.target.value.split(",").map((c) => c.trim()).filter(Boolean) })} placeholder="black, white, red" />
              </div>
              <div className="form-group" style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <input type="checkbox" id="featured" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} />
                <label htmlFor="featured" style={{ marginBottom: 0 }}>Featured product</label>
              </div>
              <div className="admin-modal-actions">
                <button type="button" className="btn btn-outline" onClick={() => setModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? "Saving..." : "Save"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
