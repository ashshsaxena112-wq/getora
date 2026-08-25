import React, { useState } from 'react';
import {
  Plus,
  Search,
  Trash2
} from 'lucide-react';
import { useAdmin } from '../context/AdminContext';

export const AdminCatalogView: React.FC = () => {
  const { products, addMasterProduct, deleteProduct } = useAdmin();
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    categoryName: 'Hardware & Tools',
    suggestedPrice: 499,
    suggestedSellingPrice: 399,
    unit: 'pcs',
    sku: `GT-SKU-${Math.floor(1000 + Math.random() * 9000)}`,
    imageUrl: 'https://images.unsplash.com/photo-1581783342308-f792dbdd27c5?w=500&auto=format&fit=crop&q=80',
    description: ''
  });

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    const newProd = {
      id: `mp-${Date.now()}`,
      name: formData.name || 'New Master Product',
      brand: formData.brand || 'GETORA Direct',
      categoryName: formData.categoryName,
      suggestedPrice: Number(formData.suggestedPrice),
      suggestedSellingPrice: Number(formData.suggestedSellingPrice),
      unit: formData.unit,
      sku: formData.sku,
      imageUrl: formData.imageUrl,
      description: formData.description,
      isActive: true
    };
    await addMasterProduct(newProd);
    setIsAddModalOpen(false);
  };

  const filteredProducts = products.filter((p) => {
    const matchSearch =
      search === '' ||
      (p.name && p.name.toLowerCase().includes(search.toLowerCase())) ||
      (p.brand && p.brand.toLowerCase().includes(search.toLowerCase())) ||
      (p.sku && p.sku.toLowerCase().includes(search.toLowerCase()));

    const matchCat =
      selectedCategory === 'all' ||
      (p.categoryName && p.categoryName.toLowerCase().includes(selectedCategory.toLowerCase()));

    return matchSearch && matchCat;
  });

  return (
    <div className="space-y-4 font-['Inter',sans-serif] text-white animate-fadeIn">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold font-['Outfit',sans-serif]">Central Master Catalog</h2>
          <p className="text-xs text-[#A7A7A7]">Global database of verified products that retailers can add with 1 click (Synced with Supabase)</p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2 bg-[#1DB954] hover:bg-[#39D353] active:bg-[#169C46] text-black font-extrabold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Add Master Product</span>
        </button>
      </div>

      <div className="p-3 bg-[#181818] border border-[#292929] rounded-2xl flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="flex items-center gap-2 overflow-x-auto custom-scrollbar">
          {['all', 'Hardware', 'Electrical', 'Mobile', 'Stationery'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap cursor-pointer transition-all ${
                selectedCategory === cat
                  ? 'bg-[#14532D] text-white border border-[#1DB954]/50'
                  : 'text-[#A7A7A7] hover:text-white hover:bg-[#202020]'
              }`}
            >
              {cat === 'all' ? 'All Categories' : cat}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-64">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#6F6F6F]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search SKU, brand, product..."
            className="w-full pl-9 pr-3 py-1.5 bg-[#121212] border border-[#292929] rounded-xl text-xs text-white placeholder-[#6F6F6F] focus:outline-none focus:border-[#1DB954]"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredProducts.map((p) => (
          <div
            key={p.id}
            className="p-4 rounded-2xl bg-[#181818] border border-[#292929] hover:border-[#1DB954]/40 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="relative h-36 w-full rounded-xl bg-[#121212] overflow-hidden mb-3 border border-[#292929]">
                <img src={p.imageUrl || p.image_url || 'https://images.unsplash.com/photo-1581783342308-f792dbdd27c5?w=500'} alt={p.name} className="w-full h-full object-cover" />
                <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/80 backdrop-blur-xs text-[9px] font-mono text-white">
                  {p.sku || 'SKU-GEN'}
                </span>
              </div>

              <p className="text-[10px] text-[#1DB954] font-bold uppercase tracking-wider">{p.brand}</p>
              <h3 className="text-xs font-bold text-white line-clamp-2 mt-0.5">{p.name}</h3>
              <p className="text-[10px] text-[#A7A7A7] mt-1">{p.categoryName || 'General'}</p>
            </div>

            <div className="mt-4 pt-3 border-t border-[#292929] flex items-center justify-between">
              <div>
                <span className="text-sm font-extrabold text-[#1DB954] font-mono">₹{p.suggestedSellingPrice || p.selling_price || 399}</span>
                <span className="text-[10px] text-[#6F6F6F] line-through ml-1.5 font-mono">₹{p.suggestedPrice || p.price || 499}</span>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => deleteProduct(p.id)}
                  className="p-1.5 rounded-lg bg-[#202020] hover:bg-[#EF4444]/20 text-[#EF4444] transition-colors cursor-pointer"
                  title="Delete"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="w-full max-w-xl bg-[#181818] border border-[#292929] rounded-2xl p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto custom-scrollbar">
            <div className="flex items-center justify-between pb-3 border-b border-[#292929]">
              <h3 className="text-base font-bold text-white font-['Outfit',sans-serif]">
                Add New Master Product
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="w-7 h-7 rounded-lg bg-[#202020] text-white flex items-center justify-center"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleAddProduct} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-[#A7A7A7] mb-1 font-medium">Product Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Stanley 13mm Impact Hammer Drill"
                  className="w-full px-3 py-2 bg-[#121212] border border-[#292929] rounded-xl text-white focus:outline-none focus:border-[#1DB954]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#A7A7A7] mb-1 font-medium">Brand Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.brand}
                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                    placeholder="e.g. Stanley / Havells"
                    className="w-full px-3 py-2 bg-[#121212] border border-[#292929] rounded-xl text-white focus:outline-none focus:border-[#1DB954]"
                  />
                </div>
                <div>
                  <label className="block text-[#A7A7A7] mb-1 font-medium">Category *</label>
                  <select
                    value={formData.categoryName}
                    onChange={(e) => setFormData({ ...formData, categoryName: e.target.value })}
                    className="w-full px-3 py-2 bg-[#121212] border border-[#292929] rounded-xl text-white focus:outline-none focus:border-[#1DB954]"
                  >
                    <option>Hardware & Tools</option>
                    <option>Electrical & Lighting</option>
                    <option>Mobile Accessories</option>
                    <option>Stationery & Office</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#A7A7A7] mb-1 font-medium">MRP (₹) *</label>
                  <input
                    type="number"
                    required
                    value={formData.suggestedPrice}
                    onChange={(e) => setFormData({ ...formData, suggestedPrice: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-[#121212] border border-[#292929] rounded-xl text-white focus:outline-none focus:border-[#1DB954]"
                  />
                </div>
                <div>
                  <label className="block text-[#A7A7A7] mb-1 font-medium">Suggested Selling (₹) *</label>
                  <input
                    type="number"
                    required
                    value={formData.suggestedSellingPrice}
                    onChange={(e) => setFormData({ ...formData, suggestedSellingPrice: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-[#121212] border border-[#292929] rounded-xl text-[#1DB954] font-bold focus:outline-none focus:border-[#1DB954]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#A7A7A7] mb-1 font-medium">Image URL</label>
                <input
                  type="text"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  className="w-full px-3 py-2 bg-[#121212] border border-[#292929] rounded-xl text-white focus:outline-none focus:border-[#1DB954]"
                />
              </div>

              <div className="pt-3 border-t border-[#292929] flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 bg-[#202020] text-white rounded-xl font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#1DB954] hover:bg-[#39D353] text-black font-extrabold rounded-xl shadow-xs cursor-pointer"
                >
                  Publish to Catalog
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
