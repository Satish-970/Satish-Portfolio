import { useState, useEffect } from 'react';
import ScrollReveal from 'scrollreveal';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';


// Fallback image if a post has no image
import blog1 from '../assets/images/{60FD904D-E775-4C9F-9597-3531F8724AA6}.jpg';

const Blog = () => {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        ScrollReveal().reveal(".section__header", {
            distance: "50px",
            origin: "bottom",
            duration: 1000,
        });

        const fetchPosts = async () => {
            try {
                // Using rss2json to bypass CORS and ad-blockers for client-side fetching
                const response = await fetch('https://api.rss2json.com/v1/api.json?rss_url=https://satishportfolio.blogspot.com/feeds/posts/default');
                const data = await response.json();

                if (data.items) {
                    const formattedPosts = data.items.map((item, index) => {
                        const title = item.title;

                        // rss2json returns content in 'content' or 'description'
                        const content = item.content || item.description || '';

                        const publishedDate = new Date(item.pubDate).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        });

                        // Extract image from content
                        const imgMatch = content.match(/<img[^>]+src="([^">]+)"/);
                        let image = imgMatch ? imgMatch[1] : (item.thumbnail || blog1);

                        // Decode HTML entities in the URL (e.g., &amp; -> &)
                        if (image) {
                            const txt = document.createElement("textarea");
                            txt.innerHTML = image;
                            image = txt.value;
                        }

                        // Create snippet by stripping HTML
                        const tempDiv = document.createElement('div');
                        tempDiv.innerHTML = content;
                        // Clean up text
                        const cleanText = tempDiv.textContent || tempDiv.innerText || '';
                        const snippet = cleanText.substring(0, 150) + '...';

                        const link = item.link;

                        // rss2json returns categories as an array of strings
                        const category = item.categories && item.categories.length > 0 ? item.categories[0] : 'Blog';

                        return {
                            id: index,
                            title,
                            image,
                            category,
                            date: publishedDate,
                            description: snippet,
                            link
                        };
                    });
                    setPosts(formattedPosts);
                }
            } catch (error) {
                console.error("Error fetching blog posts:", error);
            }
        };

        fetchPosts();
    }, []);

    return (
        <section className="section__container blog__container" id="blog">
            <p className="section__subheader">My Articles</p>
            <h2 className="section__header">I Love To Write Blogs</h2>

            <div className="blog__slider-wrapper">
                {posts.length > 0 ? (
                    <Swiper
                        modules={[Navigation, Pagination, Autoplay]}
                        spaceBetween={30}
                        slidesPerView={1}
                        breakpoints={{
                            640: {
                                slidesPerView: 1,
                            },
                            768: {
                                slidesPerView: 2,
                            },
                            1024: {
                                slidesPerView: 3,
                            },
                        }}
                        navigation={{
                            nextEl: '.blog-button-next',
                            prevEl: '.blog-button-prev',
                        }}
                        pagination={{ clickable: true }}
                        loop={true}
                        autoplay={{
                            delay: 5000,
                            disableOnInteraction: false,
                        }}
                        className="blog__swiper"
                    >
                        {posts.map((post) => (
                            <SwiperSlide key={post.id} className="blog__slide">
                                <div className="blog__content-left">
                                    <div className="blog__meta">
                                        <span className="blog__category">{post.category}</span>
                                        <span className="blog__date">{post.date}</span>
                                    </div>
                                    <h3 className="blog__title">{post.title}</h3>
                                    <p className="blog__description">{post.description}</p>
                                    <a href={post.link} target="_blank" rel="noopener noreferrer" className="btn blog__btn">
                                        Read Article
                                    </a>
                                </div>
                                <div className="blog__image-right">
                                    <div className="blog__image-wrapper">
                                        <img src={post.image} alt={post.title} />
                                        <div className="blog__image-overlay"></div>
                                    </div>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                ) : (
                    <div style={{ textAlign: 'center', color: 'var(--text-light)', padding: '2rem' }}>
                        <p>Loading latest articles...</p>
                    </div>
                )}

                {/* Custom Navigation Buttons */}
                <div className="blog__navigation">
                    <div className="blog-button-prev">
                        <i className="ri-arrow-left-line"></i>
                    </div>
                    <div className="blog-button-next">
                        <i className="ri-arrow-right-line"></i>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Blog;
