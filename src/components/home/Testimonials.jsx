import ScrollReveal from '../ScrollReveal';
import CircularTestimonials from '../CircularTestimonials';
import './Testimonials.css';

const testimonialData = [
    {
        quote: 'Since switching to True Heal hydrogen water, my energy levels have noticeably improved. The machine is beautifully designed and so easy to use — I recommend it to everyone!',
        name: 'Priya Sharma',
        designation: 'Health & Wellness Blogger',
        src: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600&h=600&fit=crop&q=80',
    },
    {
        quote: 'The water quality difference is remarkable. As a fitness trainer, hydration is everything to me. True Heal Global delivers the most refreshing, clean-tasting water I have ever tried.',
        name: 'Arjun Mehta',
        designation: 'Certified Fitness Trainer',
        src: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=600&fit=crop&q=80',
    },
    {
        quote: 'I bought the alkaline water machine for my parents and they absolutely love it. The customer support team was incredibly helpful throughout the entire process.',
        name: 'Sneha Reddy',
        designation: 'Software Engineer',
        src: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&h=600&fit=crop&q=80',
    },
    {
        quote: 'After researching hydrogen water benefits for months, I finally invested in True Heal. The ORP levels are exactly as promised — this is the real deal for antioxidant-rich water.',
        name: 'Dr. Vikram Patel',
        designation: 'Naturopathic Physician',
        src: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=600&h=600&fit=crop&q=80',
    },
    {
        quote: 'We installed the THG machine in our yoga studio and our students love it. The purity and taste of the water complement the holistic wellness experience perfectly.',
        name: 'Anjali Desai',
        designation: 'Yoga Studio Owner',
        src: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=600&h=600&fit=crop&q=80',
    },
];

export default function Testimonials() {
    return (
        <section className="testimonials section" style={{ background: 'var(--gradient-dark)' }}>
            <div className="container">
                <ScrollReveal>
                    <div className="section-header">
                        <p className="section-label" style={{ color: 'var(--color-primary-light)' }}>Testimonials</p>
                        <h2 className="section-title" style={{ color: 'var(--color-white)' }}>What People Are Saying</h2>
                        <p className="section-subtitle" style={{ color: 'var(--color-gray-300)' }}>
                            Thousands of customers across India trust True Heal Global for their hydration needs
                        </p>
                    </div>
                </ScrollReveal>

                <ScrollReveal>
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <CircularTestimonials
                            testimonials={testimonialData}
                            autoplay
                            colors={{
                                name: '#ffffff',
                                designation: 'var(--color-primary-light)',
                                testimony: 'var(--color-gray-100)',
                                arrowBackground: 'var(--color-primary)',
                                arrowForeground: '#ffffff',
                                arrowHoverBackground: 'var(--color-accent)',
                            }}
                            fontSizes={{
                                name: '1.75rem',
                                designation: '1rem',
                                quote: '1.1rem',
                            }}
                        />
                    </div>
                </ScrollReveal>
            </div>
        </section>
    );
}
