import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchItemDetails } from '../api/services/items';
import { addToWishlist, removeFromWishlist } from '../api/services/wishlist';
import ScrollReveal from '../components/ScrollReveal';
import { HiStar, HiShoppingCart, HiHeart, HiShieldCheck, HiArrowLeft, HiTruck, HiRefresh } from 'react-icons/hi';
import GradientButton from '../components/GradientButton';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import './ProductDetailPage.css';

export default function ProductDetailPage() {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('description');
    const [quantity, setQuantity] = useState(1);
    const [addingToCart, setAddingToCart] = useState(false);
    const [wishlistLoading, setWishlistLoading] = useState(false);
    const [isWishlisted, setIsWishlisted] = useState(false);
    // Variation state
    const [selectedVariation, setSelectedVariation] = useState(null); // old-style variation index
    const [selectedFoodVariations, setSelectedFoodVariations] = useState({}); // { groupName: [selectedLabels] }
    const [selectedAddons, setSelectedAddons] = useState({}); // { addonId: qty }

    const { addItem } = useCart();
    const { isLoggedIn, isGuest } = useAuth();
    const toast = useToast();

    useEffect(() => {
        async function loadProduct() {
            try {
                setLoading(true);
                const data = await fetchItemDetails(id);
                setProduct(data);

                // Set default variation
                if (data.variations && data.variations.length > 0) {
                    setSelectedVariation(0);
                }
                if (data.food_variations && data.food_variations.length > 0) {
                    const defaults = {};
                    data.food_variations.forEach(group => {
                        defaults[group.name] = [];
                    });
                    setSelectedFoodVariations(defaults);
                }
            } catch (err) {
                console.error('Failed to load product:', err);
                setError('Failed to load product details.');
            } finally {
                setLoading(false);
            }
        }
        if (id) {
            loadProduct();
            setQuantity(1);
            setSelectedAddons({});
        }
    }, [id]);

    const formatPrice = (price) =>
        new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(price);

    // Calculate final price with variations & addons
    const calculatePrice = () => {
        if (!product) return 0;
        let basePrice = product.price;

        // Old-style variation price
        if (product.variations?.length > 0 && selectedVariation !== null) {
            basePrice = product.variations[selectedVariation]?.price || product.price;
        }

        // Food variation surcharges
        if (product.food_variations?.length > 0) {
            for (const group of product.food_variations) {
                const selected = selectedFoodVariations[group.name] || [];
                for (const val of (group.values || [])) {
                    if (selected.includes(val.label)) {
                        basePrice += (val.optionPrice || 0);
                    }
                }
            }
        }

        // Apply discount
        let discountedPrice = basePrice;
        if (product.discount > 0) {
            discountedPrice = product.discount_type === 'percent'
                ? basePrice - (basePrice * product.discount / 100)
                : basePrice - product.discount;
        }

        // Add addons
        let addonTotal = 0;
        if (product.add_ons?.length > 0) {
            for (const addon of product.add_ons) {
                const qty = selectedAddons[addon.id] || 0;
                addonTotal += (addon.price || 0) * qty;
            }
        }

        return (discountedPrice + addonTotal) * quantity;
    };

    // Handle Add to Cart
    const handleAddToCart = async () => {
        if (!isLoggedIn && !isGuest) {
            toast.warning('Please sign in or continue as guest to add items to cart');
            return;
        }

        // Validate required food variations
        if (product.food_variations?.length > 0) {
            for (const group of product.food_variations) {
                if (group.required === 'on') {
                    const selected = selectedFoodVariations[group.name] || [];
                    if (selected.length === 0) {
                        toast.error(`Please select ${group.name}`);
                        return;
                    }
                    if (group.min && selected.length < group.min) {
                        toast.error(`Please select at least ${group.min} option(s) for ${group.name}`);
                        return;
                    }
                }
            }
        }

        // Check stock
        if (product.stock !== null && product.stock !== undefined && product.stock <= 0) {
            toast.error('This item is currently out of stock');
            return;
        }
        if (product.maximum_cart_quantity && quantity > product.maximum_cart_quantity) {
            toast.error(`Maximum ${product.maximum_cart_quantity} items allowed`);
            return;
        }

        setAddingToCart(true);
        try {
            // Build cart body matching Flutter's OnlineCart.toJson()
            let price = product.price;
            let variationBody = [];
            let variant = '';

            // Old-style variations (non-food: ecommerce, grocery)
            if (product.variations?.length > 0 && selectedVariation !== null) {
                const v = product.variations[selectedVariation];
                price = v.price || product.price;
                variationBody = [v];
                variant = v.type || '';
            }

            // Food variations (OrderVariation format)
            if (product.food_variations?.length > 0) {
                variationBody = product.food_variations
                    .filter(g => (selectedFoodVariations[g.name] || []).length > 0)
                    .map(g => ({
                        name: g.name,
                        values: { label: selectedFoodVariations[g.name] }
                    }));
            }

            // Apply discount to price
            if (product.discount > 0) {
                price = product.discount_type === 'percent'
                    ? price - (price * product.discount / 100)
                    : price - product.discount;
            }

            // Addon IDs and quantities
            const addOnIds = [];
            const addOnQtys = [];
            if (product.add_ons?.length > 0) {
                for (const addon of product.add_ons) {
                    const qty = selectedAddons[addon.id] || 0;
                    if (qty > 0) {
                        addOnIds.push(addon.id);
                        addOnQtys.push(qty);
                    }
                }
            }

            const body = {
                item_id: product.id,
                price: String(price),
                quantity: quantity,
                variant: variant,
                variation: variationBody.length > 0 ? variationBody : [],
                add_on_ids: addOnIds,
                add_on_qtys: addOnQtys,
                model: 'Item',
            };

            await addItem(body);
            toast.success(`${product.name} added to cart!`);
        } catch (err) {
            console.error('Add to cart failed:', err);
            toast.error(err.message || 'Failed to add item to cart');
        } finally {
            setAddingToCart(false);
        }
    };

    // Handle Wishlist Toggle
    const handleWishlistToggle = async () => {
        if (!isLoggedIn) {
            toast.warning('Please sign in to use wishlist');
            return;
        }
        setWishlistLoading(true);
        try {
            if (isWishlisted) {
                await removeFromWishlist(product.id);
                setIsWishlisted(false);
                toast.info('Removed from wishlist');
            } else {
                await addToWishlist(product.id);
                setIsWishlisted(true);
                toast.success('Added to wishlist!');
            }
        } catch (err) {
            toast.error(err.message || 'Wishlist action failed');
        } finally {
            setWishlistLoading(false);
        }
    };

    // Toggle food variation selection
    const toggleFoodVariation = (groupName, label, type, max) => {
        setSelectedFoodVariations(prev => {
            const current = prev[groupName] || [];
            if (type === 'single') {
                return { ...prev, [groupName]: current.includes(label) ? [] : [label] };
            }
            // multi
            if (current.includes(label)) {
                return { ...prev, [groupName]: current.filter(l => l !== label) };
            }
            if (max && current.length >= max) {
                toast.warning(`Maximum ${max} options for ${groupName}`);
                return prev;
            }
            return { ...prev, [groupName]: [...current, label] };
        });
    };

    // Toggle addon
    const toggleAddon = (addonId) => {
        setSelectedAddons(prev => ({
            ...prev,
            [addonId]: prev[addonId] ? 0 : 1,
        }));
    };

    const updateAddonQty = (addonId, delta) => {
        setSelectedAddons(prev => ({
            ...prev,
            [addonId]: Math.max(0, (prev[addonId] || 0) + delta),
        }));
    };

    if (loading) {
        return (
            <div className="pdp" style={{ paddingTop: '120px', minHeight: '60vh', display: 'flex', justifyContent: 'center' }}>
                <div className="loading-spinner"></div>
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="pdp" style={{ paddingTop: '120px', textAlign: 'center' }}>
                <h2>{error || 'Product not found'}</h2>
                <Link to="/products"><GradientButton>Browse Products</GradientButton></Link>
            </div>
        );
    }

    // Calculate discount percentage for badge
    const discount = product.discount
        ? product.discount_type === 'percent'
            ? product.discount
            : Math.round((product.discount / product.price) * 100)
        : 0;

    const image = product.image_full_url || product.image || '/assets/image/placeholder.png';
    const images = product.images_full_url?.length > 0
        ? product.images_full_url
        : [image];

    const tabs = [
        { id: 'description', label: 'Description' },
        { id: 'specs', label: 'Specifications' },
        { id: 'reviews', label: `Reviews (${product.rating_count || 0})` },
    ];

    const totalPrice = calculatePrice();

    return (
        <main className="pdp">
            <section className="pdp__hero">
                <div className="container">
                    <Link to="/products" className="pdp__back">
                        <HiArrowLeft /> Back to Products
                    </Link>
                </div>
            </section>

            <section className="pdp__main section">
                <div className="container">
                    <div className="pdp__layout">
                        {/* Image */}
                        <ScrollReveal direction="right" className="pdp__gallery">
                            <div className="pdp__image-main">
                                {discount > 0 && <span className="pdp__badge">-{discount}% OFF</span>}
                                <img src={image} alt={product.name} />
                            </div>
                        </ScrollReveal>

                        {/* Info */}
                        <ScrollReveal direction="left" className="pdp__info">
                            <span className="pdp__category">
                                {product.store_name || product.category_ids?.map(c => c.id).join(', ') || 'Wellness'}
                            </span>
                            <h1 className="pdp__name">{product.name}</h1>

                            <div className="pdp__rating">
                                <div className="stars">
                                    {[...Array(5)].map((_, i) => (
                                        <HiStar key={i} size={18} style={{ opacity: i < Math.floor(product.avg_rating || 0) ? 1 : 0.3 }} />
                                    ))}
                                </div>
                                <span>{product.avg_rating ? product.avg_rating.toFixed(1) : 'New'} · {product.rating_count || 0} reviews</span>
                            </div>

                            <div className="pdp__pricing">
                                <span className="pdp__price">{formatPrice(totalPrice)}</span>
                                {product.discount > 0 && (
                                    <span className="pdp__original">{formatPrice(product.price * quantity)}</span>
                                )}
                            </div>

                            {product.description && (
                                <p className="pdp__desc">{product.description}</p>
                            )}

                            {/* Old-style Variations (ecommerce/grocery) */}
                            {product.variations?.length > 0 && (
                                <div className="pdp__variations">
                                    <h4>Select Variant</h4>
                                    <div className="pdp__variation-options">
                                        {product.variations.map((v, i) => (
                                            <button
                                                key={i}
                                                className={`pdp__variation-btn ${selectedVariation === i ? 'pdp__variation-btn--active' : ''}`}
                                                onClick={() => setSelectedVariation(i)}
                                            >
                                                {v.type}
                                                {v.price !== product.price && (
                                                    <span className="pdp__variation-price">{formatPrice(v.price)}</span>
                                                )}
                                                {v.stock !== null && v.stock <= 0 && <span className="pdp__variation-oos">Out of Stock</span>}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Food Variations (new-style) */}
                            {product.food_variations?.length > 0 && product.food_variations.map(group => (
                                <div key={group.name} className="pdp__variations">
                                    <h4>
                                        {group.name}
                                        {group.required === 'on' && <span className="pdp__required"> (Required)</span>}
                                        {group.type === 'multi' && group.max && (
                                            <span className="pdp__var-hint"> — select up to {group.max}</span>
                                        )}
                                    </h4>
                                    <div className="pdp__variation-options">
                                        {(group.values || []).map(val => {
                                            const selected = (selectedFoodVariations[group.name] || []).includes(val.label);
                                            return (
                                                <button
                                                    key={val.label}
                                                    className={`pdp__variation-btn ${selected ? 'pdp__variation-btn--active' : ''}`}
                                                    onClick={() => toggleFoodVariation(group.name, val.label, group.type, group.max)}
                                                >
                                                    {val.label}
                                                    {val.optionPrice > 0 && (
                                                        <span className="pdp__variation-price">+{formatPrice(val.optionPrice)}</span>
                                                    )}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            ))}

                            {/* Add-ons */}
                            {product.add_ons?.length > 0 && (
                                <div className="pdp__addons">
                                    <h4>Add-ons</h4>
                                    <div className="pdp__addon-list">
                                        {product.add_ons.map(addon => {
                                            const qty = selectedAddons[addon.id] || 0;
                                            return (
                                                <div key={addon.id} className={`pdp__addon-item ${qty > 0 ? 'pdp__addon-item--active' : ''}`}>
                                                    <label onClick={() => toggleAddon(addon.id)}>
                                                        <input type="checkbox" checked={qty > 0} readOnly />
                                                        <span>{addon.name}</span>
                                                        <span className="pdp__addon-price">+{formatPrice(addon.price)}</span>
                                                    </label>
                                                    {qty > 0 && (
                                                        <div className="pdp__addon-qty">
                                                            <button onClick={() => updateAddonQty(addon.id, -1)}>−</button>
                                                            <span>{qty}</span>
                                                            <button onClick={() => updateAddonQty(addon.id, 1)}>+</button>
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            {/* Quantity + Cart */}
                            <div className="pdp__actions">
                                <div className="pdp__quantity">
                                    <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>−</button>
                                    <span>{quantity}</span>
                                    <button onClick={() => setQuantity(q => {
                                        const max = product.maximum_cart_quantity || 999;
                                        return Math.min(max, q + 1);
                                    })}>+</button>
                                </div>
                                <GradientButton
                                    size="lg"
                                    className="pdp__add-cart"
                                    onClick={handleAddToCart}
                                    disabled={addingToCart || (product.stock !== null && product.stock <= 0)}
                                >
                                    <HiShoppingCart size={20} />
                                    {addingToCart ? 'Adding...' : product.stock !== null && product.stock <= 0
                                        ? 'Out of Stock'
                                        : `Add to Cart — ${formatPrice(totalPrice)}`}
                                </GradientButton>
                                <button
                                    className={`pdp__wishlist ${isWishlisted ? 'pdp__wishlist--active' : ''}`}
                                    onClick={handleWishlistToggle}
                                    disabled={wishlistLoading}
                                >
                                    <HiHeart size={22} />
                                </button>
                            </div>

                            {/* Stock info */}
                            {product.stock !== null && product.stock !== undefined && product.stock > 0 && product.stock <= 10 && (
                                <p style={{ color: '#f59e0b', fontSize: '0.85rem', marginTop: '0.5rem' }}>
                                    Only {product.stock} left in stock!
                                </p>
                            )}

                            {/* Trust */}
                            <div className="pdp__trust-bar">
                                <div className="pdp__trust-item"><HiTruck size={18} /> Free Shipping</div>
                                <div className="pdp__trust-item"><HiRefresh size={18} /> 30-Day Returns</div>
                                <div className="pdp__trust-item"><HiShieldCheck size={18} /> Quality Guarantee</div>
                            </div>
                        </ScrollReveal>
                    </div>

                    {/* Tabs */}
                    <div className="pdp__tabs-section">
                        <div className="pdp__tabs">
                            {tabs.map(tab => (
                                <button
                                    key={tab.id}
                                    className={`pdp__tab ${activeTab === tab.id ? 'pdp__tab--active' : ''}`}
                                    onClick={() => setActiveTab(tab.id)}
                                >
                                    {tab.label}
                                    {activeTab === tab.id && (
                                        <motion.div className="pdp__tab-indicator" layoutId="tab-indicator" />
                                    )}
                                </button>
                            ))}
                        </div>

                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeTab}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.3 }}
                                className="pdp__tab-content"
                            >
                                {activeTab === 'description' && (
                                    <div className="pdp__tab-desc">
                                        <p>{product.description || 'No description available.'}</p>
                                    </div>
                                )}

                                {activeTab === 'specs' && (
                                    <div className="pdp__tab-specs">
                                        <table className="pdp__specs-table">
                                            <tbody>
                                                {product.unit_type && <tr><td>Unit</td><td>{product.unit_type}</td></tr>}
                                                {product.store_name && <tr><td>Store</td><td>{product.store_name}</td></tr>}
                                                {product.organic === 1 && <tr><td>Organic</td><td>Yes</td></tr>}
                                                {product.veg !== null && <tr><td>Type</td><td>{product.veg === 1 ? 'Vegetarian' : 'Non-Vegetarian'}</td></tr>}
                                                {(!product.unit_type && !product.store_name) && (
                                                    <tr><td colSpan={2}>No specifications available.</td></tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                )}

                                {activeTab === 'reviews' && (
                                    <div className="pdp__tab-reviews">
                                        {product.rating_count > 0 ? (
                                            <div className="pdp__review-summary">
                                                <div className="pdp__review-avg">
                                                    <span className="pdp__review-number">{product.avg_rating?.toFixed(1) || '0'}</span>
                                                    <div className="stars">
                                                        {[...Array(5)].map((_, i) => (
                                                            <HiStar key={i} size={16} style={{ opacity: i < Math.floor(product.avg_rating || 0) ? 1 : 0.3, color: '#f59e0b' }} />
                                                        ))}
                                                    </div>
                                                    <span>{product.rating_count} review{product.rating_count !== 1 ? 's' : ''}</span>
                                                </div>
                                            </div>
                                        ) : (
                                            <p>No reviews yet. Be the first to review this product!</p>
                                        )}
                                    </div>
                                )}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>
            </section>
        </main>
    );
}
