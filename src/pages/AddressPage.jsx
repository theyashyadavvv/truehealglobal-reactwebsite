import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import ScrollReveal from '../components/ScrollReveal';
import GradientButton from '../components/GradientButton';
import { HiLocationMarker, HiPlus, HiPencil, HiTrash, HiHome, HiOfficeBuilding, HiX } from 'react-icons/hi';
import { useAuth } from '../context/AuthContext';
import { fetchAddresses, addAddress, updateAddress, deleteAddress } from '../api/services/address';
import './AddressPage.css';

export default function AddressPage() {
    const [addresses, setAddresses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [form, setForm] = useState({ address_type: 'home', contact_person_name: '', contact_person_number: '', address: '', city: '', house: '', road: '', floor: '', latitude: '28.6139', longitude: '77.2090' });
    const [saving, setSaving] = useState(false);
    const [formError, setFormError] = useState('');
    const { isLoggedIn, user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!isLoggedIn) { navigate('/login'); return; }
        loadAddresses();
    }, [isLoggedIn]);

    const loadAddresses = async () => {
        try {
            const data = await fetchAddresses();
            setAddresses(data?.addresses || data?.data || (Array.isArray(data) ? data : []));
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    };

    const handleEdit = (addr) => {
        setEditingId(addr.id);
        setForm({
            address_type: addr.address_type || 'home',
            contact_person_name: addr.contact_person_name || '',
            contact_person_number: addr.contact_person_number || '',
            address: addr.address || '',
            city: addr.city || '',
            house: addr.house || '',
            road: addr.road || '',
            floor: addr.floor || '',
            latitude: addr.latitude || '28.6139',
            longitude: addr.longitude || '77.2090',
        });
        setShowForm(true);
    };

    const handleNew = () => {
        setEditingId(null);
        setForm({ address_type: 'home', contact_person_name: user ? `${user.f_name || ''} ${user.l_name || ''}`.trim() : '', contact_person_number: user?.phone || '', address: '', city: '', house: '', road: '', floor: '', latitude: '28.6139', longitude: '77.2090' });
        setShowForm(true);
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setFormError('');
        if (!form.address.trim()) { setFormError('Address is required'); return; }
        if (!form.contact_person_name.trim()) { setFormError('Name is required'); return; }
        setSaving(true);
        try {
            if (editingId) {
                await updateAddress(editingId, form);
            } else {
                await addAddress(form);
            }
            setShowForm(false);
            await loadAddresses();
        } catch (err) {
            setFormError(err.message || 'Failed to save');
        } finally { setSaving(false); }
    };

    const handleDelete = async (id) => {
        try {
            await deleteAddress(id);
            setAddresses(prev => prev.filter(a => a.id !== id));
        } catch (e) { console.error(e); }
    };

    const typeIcon = { home: HiHome, office: HiOfficeBuilding };

    return (
        <main className="address-page">
            <section className="address-page__hero">
                <div className="container">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                        <div>
                            <h1 className="address-page__title">My Addresses</h1>
                            <p className="address-page__subtitle">{addresses.length} saved address{addresses.length !== 1 ? 'es' : ''}</p>
                        </div>
                        <GradientButton onClick={handleNew}><HiPlus size={18} /> Add New Address</GradientButton>
                    </motion.div>
                </div>
            </section>

            <section className="address-page__content section">
                <div className="container">
                    {loading ? (
                        <div className="addr-grid">{[1, 2, 3].map(i => <div key={i} className="addr-skeleton" />)}</div>
                    ) : addresses.length === 0 && !showForm ? (
                        <div className="addr-empty">
                            <div className="addr-empty__icon">📍</div>
                            <h3>No addresses yet</h3>
                            <p>Add your first delivery address</p>
                            <GradientButton onClick={handleNew}><HiPlus size={18} /> Add Address</GradientButton>
                        </div>
                    ) : (
                        <div className="addr-grid">
                            {addresses.map((addr, i) => {
                                const TypeIcon = typeIcon[addr.address_type] || HiLocationMarker;
                                return (
                                    <ScrollReveal key={addr.id} delay={i * 0.05}>
                                        <div className="addr-card">
                                            <div className="addr-card__header">
                                                <span className="addr-card__type"><TypeIcon size={14} /> {addr.address_type || 'other'}</span>
                                                <div className="addr-card__actions">
                                                    <button onClick={() => handleEdit(addr)}><HiPencil size={14} /></button>
                                                    <button onClick={() => handleDelete(addr.id)}><HiTrash size={14} /></button>
                                                </div>
                                            </div>
                                            <h4 className="addr-card__name">{addr.contact_person_name}</h4>
                                            <p className="addr-card__address">{addr.address}</p>
                                            {addr.city && <p className="addr-card__city">{addr.city}</p>}
                                            {addr.contact_person_number && <p className="addr-card__phone">{addr.contact_person_number}</p>}
                                        </div>
                                    </ScrollReveal>
                                );
                            })}
                        </div>
                    )}

                    {/* Address Form Modal */}
                    {showForm && (
                        <div className="addr-modal-overlay" onClick={() => setShowForm(false)}>
                            <motion.div
                                className="addr-modal"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                onClick={e => e.stopPropagation()}
                            >
                                <div className="addr-modal__header">
                                    <h3>{editingId ? 'Edit Address' : 'Add New Address'}</h3>
                                    <button onClick={() => setShowForm(false)}><HiX size={20} /></button>
                                </div>
                                <form onSubmit={handleSave} className="addr-form">
                                    {formError && <div className="addr-form-error">{formError}</div>}

                                    <div className="addr-form__types">
                                        {['home', 'office', 'other'].map(t => (
                                            <button key={t} type="button" className={`addr-type-btn ${form.address_type === t ? 'active' : ''}`} onClick={() => setForm(f => ({ ...f, address_type: t }))}>
                                                {t}
                                            </button>
                                        ))}
                                    </div>

                                    <div className="addr-form__group">
                                        <label>Contact Name *</label>
                                        <input type="text" value={form.contact_person_name} onChange={e => setForm(f => ({ ...f, contact_person_name: e.target.value }))} required />
                                    </div>
                                    <div className="addr-form__group">
                                        <label>Phone Number *</label>
                                        <input type="tel" value={form.contact_person_number} onChange={e => setForm(f => ({ ...f, contact_person_number: e.target.value }))} required />
                                    </div>
                                    <div className="addr-form__group">
                                        <label>Full Address *</label>
                                        <textarea rows={2} value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} required />
                                    </div>
                                    <div className="addr-form__row">
                                        <div className="addr-form__group"><label>House/Flat</label><input type="text" value={form.house} onChange={e => setForm(f => ({ ...f, house: e.target.value }))} /></div>
                                        <div className="addr-form__group"><label>Road</label><input type="text" value={form.road} onChange={e => setForm(f => ({ ...f, road: e.target.value }))} /></div>
                                    </div>
                                    <div className="addr-form__row">
                                        <div className="addr-form__group"><label>Floor</label><input type="text" value={form.floor} onChange={e => setForm(f => ({ ...f, floor: e.target.value }))} /></div>
                                        <div className="addr-form__group"><label>City</label><input type="text" value={form.city} onChange={e => setForm(f => ({ ...f, city: e.target.value }))} /></div>
                                    </div>

                                    <GradientButton type="submit" size="lg" block disabled={saving}>
                                        {saving ? 'Saving...' : editingId ? 'Update Address' : 'Save Address'}
                                    </GradientButton>
                                </form>
                            </motion.div>
                        </div>
                    )}
                </div>
            </section>
        </main>
    );
}
