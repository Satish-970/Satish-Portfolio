import { useState, useEffect } from 'react';
import ScrollReveal from 'scrollreveal';


const Contact = () => {
    useEffect(() => {
        ScrollReveal().reveal(".contact__container h2", {
            distance: "50px",
            origin: "bottom",
            duration: 1000,
            viewFactor: 0.5,
        });
        ScrollReveal().reveal(".contact__form", {
            distance: "50px",
            origin: "bottom",
            duration: 1000,
            delay: 1000
        });

    }, []);
    const [status, setStatus] = useState(''); // '', 'loading', 'success', 'error'
    const [errorMsg, setErrorMsg] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const form = e.target;
        const email = form.email.value;
        const message = form.message.value;

        // Validation
        const emailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,}$/;
        if (!emailRegex.test(email)) {
            setStatus('error');
            setErrorMsg('Please enter a valid email address!');
            setTimeout(() => setStatus(''), 3000);
            return;
        }

        if (message.length < 10) {
            setStatus('error');
            setErrorMsg('Message must be at least 10 characters long!');
            setTimeout(() => setStatus(''), 3000);
            return;
        }

        setStatus('loading');

        try {
            const response = await fetch("https://formspree.io/f/mvgkywqy", {
                method: 'POST',
                body: new FormData(form),
                headers: { 'Accept': 'application/json' }
            });

            if (response.ok) {
                form.reset();
                setStatus('success');
                setTimeout(() => setStatus(''), 3000);
            } else {
                throw new Error('Submission failed');
            }
        } catch (error) {
            console.error(error);
            setStatus('error');
            setErrorMsg('Failed to send message. Try again!');
            setTimeout(() => setStatus(''), 3000);
        }
    };

    return (
        <section className="section__container contact__container" id="contact">
            <div className="contact__content">
                <div className="contact__form__wrapper">
                    <h2 className="section__header">Connect With Me</h2>
                    <form onSubmit={handleSubmit} className="contact__form">
                        <div className="input__row">
                            <input type="text" name="firstName" placeholder="First Name" required />
                            <input type="text" name="lastName" placeholder="Last Name" required />
                        </div>
                        <input type="email" name="email" placeholder="Email" required />
                        <input type="text" name="message" placeholder="Description" required />
                        <button type="submit" className="btn">Submit</button>

                        {status === 'success' && (
                            <div style={{ color: 'var(--primary-color-dark)', marginTop: '1rem', textAlign: 'center' }}>
                                Message sent successfully!
                            </div>
                        )}
                        {status === 'error' && (
                            <div style={{ color: '#ff3333', marginTop: '1rem', textAlign: 'center' }}>
                                {errorMsg}
                            </div>
                        )}
                        {status === 'loading' && (
                            <div style={{ color: 'var(--text-light)', marginTop: '1rem', textAlign: 'center' }}>
                                Sending...
                            </div>
                        )}
                    </form>
                </div>
            </div>
        </section>
    );
};

export default Contact;
