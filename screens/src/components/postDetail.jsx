import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './BlogCard.css';
import Navbar from './Navbar';
import Footer from './Footer';
import './postDetail.css';
import { baseurl } from '../baseUrl/baseUrl';





export default function PostDetail() {
    const { id } = useParams();
    const [post, setPost] = useState(null);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const res = await fetch(`${baseurl}/posts/get/${id}`);
                const data = await res.json();
                setPost(data);
            } catch (err) {
                console.error('Error fetching post:', err);
            }
        };

        fetchPost();
    }, [id]);

    if (!post) return <p>Loading...</p>;

    const {
        featuredImage = '/assets/idea.png',
        title = 'Untitled Post',
        category = 'Uncategorized',
        excerpt = '',
        content = 'No content available.',
        updatedAt = '',
        readTime = '0'
    } = post;

    return (
        <>
            <Navbar />
            <h1 style={{ textAlign: 'center', marginTop: '10rem', color: '#6a0dad', fontSize: 'clamp(1.5rem, 5vw, 2.5rem)', }}>
                Blog Post Details
            </h1>
            <div className="blog-card" style={{ margin: '2rem auto', maxWidth: '800px' }}>
                <div className="card-image">
                    <img src={featuredImage} alt={title} />
                </div>
                <div className="card-content">
                    {/* <span className="category">{category}</span> */}
                    <div className="title-date-row">
                        <h2 className="post-title">{title}</h2>
                        <span className="post-date">
                            {new Date(post.updatedAt).toLocaleDateString('en-GB')}
                        </span>
                    </div>

                    <div className="meta" style={{ marginBottom: '1rem', marginTop: '0.5rem' }}>
                        <span>• {readTime} min read</span>
                    </div>

                    {/* <div className="excerpt" style={{ whiteSpace: 'pre-line', fontSize: '1.1rem' }}>
                        {excerpt}
                    </div> */}

                    <div className="excerpt" style={{ whiteSpace: 'pre-line', fontSize: '1.1rem' }}>
                        <p style={{ padding: '1rem' }} dangerouslySetInnerHTML={{ __html: post.content }} />
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}
