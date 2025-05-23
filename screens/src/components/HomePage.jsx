import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import BlogCard from '../components/BlogCard';
import './HomePage.css';
import Navbar from './Navbar';
import Footer from './Footer';
import { baseurl } from '../baseUrl/baseUrl';



export default function HomePage() {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);

  const location = useLocation();
  const navigate = useNavigate();


  const searchQuery = new URLSearchParams(location.search).get("q") || "";

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch(`${baseurl}/posts/get`);
        const data = await res.json();
        setPosts(data);

        if (searchQuery.trim()) {
          const filtered = data.filter(post =>
            post.title.toLowerCase().includes(searchQuery.toLowerCase())
          );
          setFilteredPosts(filtered);
          const url = new URL(window.location);
          url.searchParams.delete("q");
          window.history.replaceState({}, '', url);
        } else {
          setFilteredPosts(data);
        }
      } catch (err) {
        console.error('Failed to fetch posts:', err);
      }
    };

    fetchPosts();
  }, [searchQuery]);



  const handleNavigation = () => {
    navigate('/');
  };

  return (
    <>
      <Navbar />
      <div className="home-page">
        <section className="hero">
          <div className="hero-content">
            <h1 className="animate-title">Welcome to CreativeBlog</h1>
            <p className="animate-subtitle">
              A space for <span className="highlight">creative minds</span> to share insights and inspiration
            </p>
            <button className="start-blogging-button" onClick={handleNavigation}>
              Start Blogging
            </button>
          </div>
        </section>

        <section className="featured-posts">
          <div className="container">
            <h2 style={{ marginBottom: '2rem' }}>
              {searchQuery ? `Search Results for "${searchQuery}"` : 'Latest Articles'}
            </h2>

            {filteredPosts.length > 0 ? (
              <div className="posts-grid">
                {filteredPosts.map((post) => (
                  <BlogCard key={post.id} post={post} />
                ))}
              </div>
            ) : (
              <p>No articles found for "{searchQuery}".</p>
            )}
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
}
