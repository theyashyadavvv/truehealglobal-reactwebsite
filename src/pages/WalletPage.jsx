import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import ScrollReveal from '../components/ScrollReveal';
import GradientButton from '../components/GradientButton';
import { HiCash, HiArrowUp, HiArrowDown, HiPlus, HiGift, HiStar } from 'react-icons/hi';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { fetchWalletTransactions, addFundToWallet, fetchWalletBonuses, fetchLoyaltyTransactions, transferLoyaltyPoints } from '../api/services/wallet';
import { BASE_URL } from '../api/config';
import './WalletPage.css';

export default function WalletPage() {
    const [activeTab, setActiveTab] = useState('wallet');
    const [walletTxns, setWalletTxns] = useState([]);
    const [loyaltyTxns, setLoyaltyTxns] = useState([]);
    const [bonuses, setBonuses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [balance, setBalance] = useState(0);
    const [loyaltyPoints, setLoyaltyPoints] = useState(0);
    const [addAmount, setAddAmount] = useState('');
    const [addModalOpen, setAddModalOpen] = useState(false);
    const [transferAmount, setTransferAmount] = useState('');
    const [transferModalOpen, setTransferModalOpen] = useState(false);
    const { isLoggedIn, user, refreshUser } = useAuth();
    const toast = useToast();
    const navigate = useNavigate();

    useEffect(() => {
        if (!isLoggedIn) { navigate('/login'); return; }
        if (user) {
            setBalance(user.wallet_balance || 0);
            setLoyaltyPoints(user.loyalty_point || 0);
        }
        loadData();
    }, [isLoggedIn, user]);

    const loadData = async () => {
        try {
            const [wt, lt, bn] = await Promise.allSettled([
                fetchWalletTransactions(1, 20),
                fetchLoyaltyTransactions(1, 20),
                fetchWalletBonuses(),
            ]);
            if (wt.status === 'fulfilled') setWalletTxns(wt.value?.data || wt.value || []);
            if (lt.status === 'fulfilled') setLoyaltyTxns(lt.value?.data || lt.value || []);
            if (bn.status === 'fulfilled') setBonuses(bn.value?.data || bn.value || []);
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    };

    const handleAddFund = async () => {
        const amt = parseFloat(addAmount);
        if (!amt || isNaN(amt) || amt <= 0) {
            toast.warning('Please enter a valid amount');
            return;
        }
        try {
            const data = await addFundToWallet({ amount: amt, payment_method: 'stripe' });
            // If backend returns a redirect URL, use it
            if (data?.redirect_link || data?.url) {
                toast.info('Redirecting to payment...');
                window.location.href = data.redirect_link || data.url;
                return;
            }
            // Otherwise redirect to payment-mobile endpoint like Flutter
            const callbackUrl = `${window.location.origin}/wallet`;
            const payUrl = `${BASE_URL}/payment-mobile?customer_id=${user?.id}&order_id=add_fund_${Date.now()}&payment_method=stripe&payment_platform=web&&callback=${encodeURIComponent(callbackUrl)}`;
            toast.info('Redirecting to payment gateway...');
            window.location.href = payUrl;
        } catch (e) {
            toast.error(e.message || 'Failed to add funds');
        }
    };

    const handleTransfer = async () => {
        const pts = parseInt(transferAmount);
        if (!pts || isNaN(pts) || pts <= 0) {
            toast.warning('Please enter valid points');
            return;
        }
        if (pts > loyaltyPoints) {
            toast.error('Insufficient loyalty points');
            return;
        }
        try {
            await transferLoyaltyPoints(pts);
            setTransferModalOpen(false);
            setTransferAmount('');
            toast.success(`${pts} loyalty points transferred to wallet!`);
            refreshUser();
            loadData();
        } catch (e) { toast.error(e.message || 'Transfer failed'); }
    };

    const formatPrice = (p) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 2 }).format(p || 0);
    const formatDate = (d) => d ? new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '';

    return (
        <main className="wallet-page">
            <section className="wallet-page__hero">
                <div className="container">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                        <div className="wallet-page__tabs-hero">
                            <button className={`wallet-hero-tab ${activeTab === 'wallet' ? 'active' : ''}`} onClick={() => setActiveTab('wallet')}>Wallet</button>
                            <button className={`wallet-hero-tab ${activeTab === 'loyalty' ? 'active' : ''}`} onClick={() => setActiveTab('loyalty')}>Loyalty Points</button>
                        </div>

                        {activeTab === 'wallet' ? (
                            <div className="wallet-balance-card">
                                <p className="wallet-balance-label">Wallet Balance</p>
                                <h1 className="wallet-balance-amount">{formatPrice(balance)}</h1>
                                <GradientButton size="sm" onClick={() => setAddModalOpen(true)}><HiPlus size={16} /> Add Money</GradientButton>
                            </div>
                        ) : (
                            <div className="wallet-balance-card">
                                <p className="wallet-balance-label">Loyalty Points</p>
                                <h1 className="wallet-balance-amount"><HiStar style={{ color: '#f59e0b' }} /> {loyaltyPoints}</h1>
                                <GradientButton size="sm" onClick={() => setTransferModalOpen(true)}>Convert to Wallet</GradientButton>
                            </div>
                        )}
                    </motion.div>
                </div>
            </section>

            <section className="wallet-page__content section">
                <div className="container">
                    {/* Bonuses */}
                    {activeTab === 'wallet' && bonuses.length > 0 && (
                        <div className="wallet-bonuses">
                            <h3>Wallet Bonuses</h3>
                            <div className="wallet-bonuses-grid">
                                {bonuses.map((bonus, i) => (
                                    <div key={i} className="bonus-card">
                                        <HiGift size={24} className="bonus-icon" />
                                        <div>
                                            <p className="bonus-title">{bonus.title || `Add ${formatPrice(bonus.minimum_add_amount)} & get ${bonus.bonus_type === 'percentage' ? `${bonus.bonus_amount}%` : formatPrice(bonus.bonus_amount)} bonus`}</p>
                                            <p className="bonus-note">{bonus.note || `Min add: ${formatPrice(bonus.minimum_add_amount)}`}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Transactions */}
                    <h3 style={{ marginBottom: '1rem' }}>{activeTab === 'wallet' ? 'Transaction History' : 'Point History'}</h3>
                    {loading ? (
                        <div>{[1, 2, 3].map(i => <div key={i} className="txn-skeleton" />)}</div>
                    ) : (activeTab === 'wallet' ? walletTxns : loyaltyTxns).length === 0 ? (
                        <div className="txn-empty">No transactions yet</div>
                    ) : (
                        <div className="txn-list">
                            {(activeTab === 'wallet' ? walletTxns : loyaltyTxns).map((txn, i) => {
                                const isCredit = (txn.transaction_type || txn.type || '').includes('credit') || (txn.credit || 0) > 0;
                                return (
                                    <ScrollReveal key={txn.id || i} delay={i * 0.03}>
                                        <div className="txn-card">
                                            <div className={`txn-icon ${isCredit ? 'credit' : 'debit'}`}>
                                                {isCredit ? <HiArrowDown size={18} /> : <HiArrowUp size={18} />}
                                            </div>
                                            <div className="txn-info">
                                                <p className="txn-type">{(txn.transaction_type || txn.type || 'Transaction').replace(/_/g, ' ')}</p>
                                                <p className="txn-date">{formatDate(txn.created_at)}</p>
                                            </div>
                                            <span className={`txn-amount ${isCredit ? 'credit' : 'debit'}`}>
                                                {isCredit ? '+' : '-'}{activeTab === 'wallet' ? formatPrice(txn.credit || txn.debit || txn.amount) : (txn.credit || txn.debit || txn.amount) + ' pts'}
                                            </span>
                                        </div>
                                    </ScrollReveal>
                                );
                            })}
                        </div>
                    )}
                </div>
            </section>

            {/* Add Money Modal */}
            {addModalOpen && (
                <div className="wallet-modal-overlay" onClick={() => setAddModalOpen(false)}>
                    <div className="wallet-modal" onClick={e => e.stopPropagation()}>
                        <h3>Add Money to Wallet</h3>
                        <input type="number" placeholder="Enter amount" value={addAmount} onChange={e => setAddAmount(e.target.value)} className="wallet-modal-input" />
                        <div className="wallet-modal-amounts">
                            {[500, 1000, 2000, 5000].map(a => (
                                <button key={a} onClick={() => setAddAmount(a.toString())} className="wallet-quick-btn">{formatPrice(a)}</button>
                            ))}
                        </div>
                        <GradientButton size="lg" block onClick={handleAddFund} disabled={!addAmount}>Add {addAmount ? formatPrice(addAmount) : ''}</GradientButton>
                    </div>
                </div>
            )}

            {/* Transfer Modal */}
            {transferModalOpen && (
                <div className="wallet-modal-overlay" onClick={() => setTransferModalOpen(false)}>
                    <div className="wallet-modal" onClick={e => e.stopPropagation()}>
                        <h3>Convert Points to Wallet</h3>
                        <p style={{ color: 'var(--color-text-secondary)', marginBottom: '1rem' }}>Available: {loyaltyPoints} points</p>
                        <input type="number" placeholder="Points to convert" value={transferAmount} onChange={e => setTransferAmount(e.target.value)} className="wallet-modal-input" max={loyaltyPoints} />
                        <GradientButton size="lg" block onClick={handleTransfer} disabled={!transferAmount}>Convert Points</GradientButton>
                    </div>
                </div>
            )}
        </main>
    );
}
