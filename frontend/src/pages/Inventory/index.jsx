import React, { useState, useEffect } from 'react';
import { Package, Plus, Search, AlertTriangle, ArrowUp, ArrowDown, History, Trash2, Edit2 } from 'lucide-react';
import api from '../../utils/api';

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="ui-card w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-slate-800">{title}</h2>
          <button onClick={onClose} className="ui-btn ui-btn-secondary px-2 py-2">✕</button>
        </div>
        {children}
      </div>
    </div>
  );
};

export default function Inventory() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modals
  const [showItemModal, setShowItemModal] = useState(false);
  const [showTransactionModal, setShowTransactionModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);

  // Forms
  const [itemForm, setItemForm] = useState({ name: '', category: '', quantity: 0, unit: 'pcs', minStock: 5, location: '' });
  const [transForm, setTransForm] = useState({ type: 'OUT', quantity: 1, notes: '' });

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const res = await api.get('/inventory');
      setItems(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateOrUpdate = async (e) => {
    e.preventDefault();
    try {
      if (editingItem) {
        await api.put(`/inventory/${editingItem.id}`, itemForm);
      } else {
        await api.post('/inventory', itemForm);
      }
      setShowItemModal(false);
      setEditingItem(null);
      setItemForm({ name: '', category: '', quantity: 0, unit: 'pcs', minStock: 5, location: '' });
      fetchItems();
    } catch (error) {
      alert('Operation failed');
    }
  };

  const handleTransaction = async (e) => {
    e.preventDefault();
    try {
      await api.post('/inventory/transaction', {
        itemId: selectedItem.id,
        ...transForm
      });
      setShowTransactionModal(false);
      setSelectedItem(null);
      setTransForm({ type: 'OUT', quantity: 1, notes: '' });
      fetchItems();
    } catch (error) {
      alert(error.response?.data?.error || 'Transaction failed');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this item?')) return;
    try {
      await api.delete(`/inventory/${id}`);
      fetchItems();
    } catch (error) {
      alert('Delete failed');
    }
  };

  const openEdit = (item) => {
    setEditingItem(item);
    setItemForm({
      name: item.name,
      category: item.category || '',
      quantity: item.quantity,
      unit: item.unit || 'pcs',
      minStock: item.minStock,
      location: item.location || ''
    });
    setShowItemModal(true);
  };

  const openTransaction = (item, type) => {
    setSelectedItem(item);
    setTransForm({ type, quantity: 1, notes: '' });
    setShowTransactionModal(true);
  };

  const filteredItems = items.filter(i => 
    i.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    i.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-700 uppercase">Inventory Management</h2>
          <p className="text-slate-600">Track stock levels and assets</p>
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search items..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="ui-input pl-10"
            />
          </div>
          <button 
            onClick={() => { setEditingItem(null); setItemForm({ name: '', category: '', quantity: 0, unit: 'pcs', minStock: 5, location: '' }); setShowItemModal(true); }}
            className="ui-btn ui-btn-primary"
          >
            <Plus size={18} /> Add Item
          </button>
        </div>
      </div>

      {loading ? <div>Loading inventory...</div> : (
        <div className="ui-card ui-card-muted overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-surface-50 border-b border-surface-200">
                <tr>
                  <th className="p-4 font-semibold text-slate-600">Item Name</th>
                  <th className="p-4 font-semibold text-slate-600">Category</th>
                  <th className="p-4 font-semibold text-slate-600">Location</th>
                  <th className="p-4 font-semibold text-slate-600">Stock Level</th>
                  <th className="p-4 font-semibold text-slate-600 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredItems.map(item => (
                  <tr key={item.id} className="hover:bg-surface-50">
                    <td className="p-4">
                      <div className="font-medium text-slate-800">{item.name}</div>
                      <div className="text-xs text-slate-500">Min: {item.minStock} {item.unit}</div>
                    </td>
                    <td className="p-4 text-slate-600">{item.category || '-'}</td>
                    <td className="p-4 text-slate-600">{item.location || '-'}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <span className={`font-bold ${item.quantity <= item.minStock ? 'text-danger' : 'text-success'}`}>
                          {item.quantity}
                        </span>
                        <span className="text-sm text-slate-500">{item.unit}</span>
                        {item.quantity <= item.minStock && (
                          <AlertTriangle size={16} className="text-danger" />
                        )}
                      </div>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => openTransaction(item, 'IN')}
                          className="ui-btn ui-btn-secondary px-2 py-2 text-success hover:bg-success/10"
                          title="Restock (In)"
                        >
                          <ArrowDown size={18} />
                        </button>
                        <button 
                          onClick={() => openTransaction(item, 'OUT')}
                          className="ui-btn ui-btn-secondary px-2 py-2 text-danger hover:bg-danger/10"
                          title="Distribute (Out)"
                        >
                          <ArrowUp size={18} />
                        </button>
                        <button 
                          onClick={() => openEdit(item)}
                          className="ui-btn ui-btn-secondary px-2 py-2 text-brand-700 hover:bg-brand-50"
                          title="Edit"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button 
                          onClick={() => handleDelete(item.id)}
                          className="ui-btn ui-btn-secondary px-2 py-2 text-danger hover:bg-danger/10"
                          title="Delete"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredItems.length === 0 && (
                  <tr>
                    <td colSpan="5" className="p-8 text-center text-slate-500">No items found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Item Modal */}
      <Modal isOpen={showItemModal} onClose={() => setShowItemModal(false)} title={editingItem ? "Edit Item" : "New Item"}>
        <form onSubmit={handleCreateOrUpdate} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Item Name</label>
            <input type="text" required className="ui-input" value={itemForm.name} onChange={e => setItemForm({...itemForm, name: e.target.value})} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Category</label>
              <input type="text" className="ui-input" value={itemForm.category} onChange={e => setItemForm({...itemForm, category: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Location</label>
              <input type="text" className="ui-input" value={itemForm.location} onChange={e => setItemForm({...itemForm, location: e.target.value})} />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Quantity</label>
              <input type="number" required className="ui-input" value={itemForm.quantity} onChange={e => setItemForm({...itemForm, quantity: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Unit</label>
              <input type="text" className="ui-input" value={itemForm.unit} onChange={e => setItemForm({...itemForm, unit: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Min Stock</label>
              <input type="number" className="ui-input" value={itemForm.minStock} onChange={e => setItemForm({...itemForm, minStock: e.target.value})} />
            </div>
          </div>
          <button type="submit" className="ui-btn ui-btn-primary w-full">Save Item</button>
        </form>
      </Modal>

      {/* Transaction Modal */}
      <Modal isOpen={showTransactionModal} onClose={() => setShowTransactionModal(false)} title={`Record Transaction: ${selectedItem?.name}`}>
        <form onSubmit={handleTransaction} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Transaction Type</label>
            <div className="flex gap-2">
              <button 
                type="button" 
                onClick={() => setTransForm({...transForm, type: 'IN'})}
                className={`ui-btn ui-btn-secondary flex-1 py-2 ${transForm.type === 'IN' ? 'bg-success/10 border-success/30 text-success' : 'bg-surface-50'}`}
              >
                Stock In (+)
              </button>
              <button 
                type="button" 
                onClick={() => setTransForm({...transForm, type: 'OUT'})}
                className={`ui-btn ui-btn-secondary flex-1 py-2 ${transForm.type === 'OUT' ? 'bg-danger/10 border-danger/20 text-danger' : 'bg-surface-50'}`}
              >
                Stock Out (-)
              </button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Quantity</label>
            <input 
              type="number" 
              min="1"
              required 
              className="ui-input" 
              value={transForm.quantity} 
              onChange={e => setTransForm({...transForm, quantity: e.target.value})} 
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Notes (Optional)</label>
            <textarea 
              className="ui-textarea" 
              rows="3"
              value={transForm.notes} 
              onChange={e => setTransForm({...transForm, notes: e.target.value})} 
            />
          </div>
          <button type="submit" className="ui-btn ui-btn-primary w-full">Confirm Transaction</button>
        </form>
      </Modal>
    </div>
  );
}
