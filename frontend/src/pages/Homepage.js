import { Link } from 'react-router-dom';
import { FaPlay, FaRocket, FaVideo, FaMagic, FaCheckCircle } from 'react-icons/fa';
import { useEffect, useState } from 'react';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

function Homepage() {
  const [services, setServices] = useState([]);
  const [demoVideos, setDemoVideos] = useState([]);

  useEffect(() => {
    fetchServices();
    fetchDemoVideos();
  }, []);

  const fetchServices = async () => {
    try {
      const response = await axios.get(`${API}/services`);
      setServices(response.data);
    } catch (error) {
      console.error('Error fetching services:', error);
    }
  };

  const fetchDemoVideos = async () => {
    try {
      const response = await axios.get(`${API}/demo-videos`);
      setDemoVideos(response.data);
    } catch (error) {
      console.error('Error fetching demo videos:', error);
    }
  };

  // Helper function to render video player based on video type
  const renderVideoPlayer = (video) => {
    if (video.video_type === 'url') {
      // For Yandex Disk and Google Drive - show clickable preview with thumbnail
      if (video.video_url.includes('disk.yandex') || video.video_url.includes('drive.google')) {
        const platform = video.video_url.includes('disk.yandex') ? 'Яндекс.Диск' : 'Google Drive';
        
        return (
          <div 
            className="w-full h-full flex flex-col items-center justify-center cursor-pointer hover:opacity-90 transition-all relative overflow-hidden group"
            style={{
              backgroundImage: video.thumbnail_url 
                ? `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${video.thumbnail_url})`
                : 'linear-gradient(135deg, #1f2937 0%, #111827 100%)',
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
            onClick={() => window.open(video.video_url, '_blank')}
          >
            <div className="text-center p-6 relative z-10">
              <div className="text-6xl mb-4 group-hover:scale-110 transition-transform">🎥</div>
              <p className="text-white text-lg font-semibold mb-2">Watch on {platform}</p>
              <div className="bg-sky-500 hover:bg-sky-600 text-white px-6 py-3 rounded-lg inline-flex items-center gap-2 mt-4">
                <span>Open Video</span>
                <span className="text-xl">→</span>
              </div>
            </div>
          </div>
        );
      }
      
      // Direct video URL (mp4, webm, etc.)
      return (
        <video
          controls
          className="w-full h-full object-cover"
          poster={video.thumbnail_url || undefined}
        >
          <source src={video.video_url} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      );
    }
    
    // File uploaded to server
    return (
      <video
        controls
        className="w-full h-full object-cover"
        poster={video.thumbnail_url || undefined}
      >
        <source src={`${BACKEND_URL}${video.video_url}`} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    );
  };

  return (
    <div className="homepage">
      {/* Hero Section with Ocean Theme */}
      <section 
        className="relative min-h-[600px] flex items-center justify-center overflow-hidden"
        style={{
          backgroundImage: `linear-gradient(rgba(14, 165, 233, 0.85), rgba(20, 184, 166, 0.85)), url('https://images.unsplash.com/photo-1599622465858-a0b63fdc9b80')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        {/* Animated waves overlay */}
        <div className="absolute inset-0 opacity-30">
          <svg className="absolute bottom-0 w-full animate-wave" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
            <path fill="#ffffff" fillOpacity="0.3" d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,112C672,96,768,96,864,112C960,128,1056,160,1152,160C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
          </svg>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center text-white">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-float">
            Dive Into an <span className="text-yellow-300">Ocean</span> of Video Possibilities
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-sky-50">
            Professional video production services delivered digitally. From custom filming to AI-powered content.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/request" className="bg-yellow-400 text-gray-900 px-8 py-4 rounded-lg font-bold text-lg hover:bg-yellow-300 transition shadow-2xl hover:shadow-yellow-400/50 transform hover:scale-105 inline-flex items-center justify-center">
              <FaRocket className="mr-2" />
              Start Your Project
            </Link>
            <Link to="/services" className="bg-white/20 backdrop-blur-sm text-white border-2 border-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-white/30 transition inline-flex items-center justify-center">
              <FaPlay className="mr-2" />
              Explore Services
            </Link>
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Our <span className="text-ocean">Video Services</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Three waves of creativity to bring your vision to life
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div 
                key={service.id} 
                className="card-ocean group hover:scale-105 transition-transform duration-300"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="aspect-video overflow-hidden">
                  <img 
                    src={service.image_url} 
                    alt={service.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-sky-600 transition">
                    {service.title}
                  </h3>
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {service.description}
                  </p>
                  <div className="mb-4">
                    <span className="text-2xl font-bold text-sky-600">
                      {service.pricing_model === 'per_minute' ? `$${service.base_price}/min` : `From $${service.base_price}`}
                    </span>
                    <p className="text-sm text-gray-500 mt-1">{service.price_description}</p>
                  </div>
                  <Link 
                    to={`/services/${service.id}`}
                    className="inline-block w-full text-center bg-gradient-to-r from-sky-500 to-teal-500 text-white px-6 py-3 rounded-lg font-semibold hover:from-sky-600 hover:to-teal-600 transition"
                  >
                    Learn More
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 px-4 ocean-gradient-light">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Why Ride the <span className="text-ocean">Ocean2joy Wave?</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-sky-400 to-teal-400 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <FaVideo className="text-3xl text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Professional Quality</h3>
              <p className="text-gray-600">High-end equipment and experienced team for stunning results</p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-sky-400 to-teal-400 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <FaMagic className="text-3xl text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Custom Made</h3>
              <p className="text-gray-600">Every project tailored to your specific vision and needs</p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-sky-400 to-teal-400 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <FaRocket className="text-3xl text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Digital Delivery</h3>
              <p className="text-gray-600">Fast electronic delivery through secure client portal</p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-sky-400 to-teal-400 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <FaCheckCircle className="text-3xl text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Revisions Included</h3>
              <p className="text-gray-600">Multiple revision rounds to ensure your satisfaction</p>
            </div>
          </div>
        </div>
      </section>

      {/* Demo Videos Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              See Our <span className="text-ocean">Work in Action</span>
            </h2>
            <p className="text-xl text-gray-600">Sample projects that showcase our capabilities</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {demoVideos.length > 0 ? (
              demoVideos.map((video) => (
                <div key={video.id} className="card-ocean">
                  <div className="aspect-video bg-gray-900 relative overflow-hidden">
                    {renderVideoPlayer(video)}
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{video.title}</h3>
                    <p className="text-gray-600">{video.description}</p>
                    {video.tags.length > 0 && (
                      <div className="mt-3 flex items-center gap-2 flex-wrap">
                        {video.tags.map((tag, idx) => (
                          <span 
                            key={idx} 
                            className="bg-sky-100 text-sky-800 text-xs px-2 py-1 rounded"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              // Fallback to default Vimeo videos if no uploaded videos
              <>
                {/* Demo Video 1 - Custom Production */}
                <div className="card-ocean">
                  <div className="aspect-video bg-gray-900 relative overflow-hidden">
                    <iframe
                      src="https://player.vimeo.com/video/115098447?background=1&autoplay=0&loop=0&byline=0&title=0"
                      className="w-full h-full"
                      frameBorder="0"
                      allow="autoplay; fullscreen; picture-in-picture"
                      allowFullScreen
                      title="Custom Video Production Demo"
                    ></iframe>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Professional Custom Video</h3>
                    <p className="text-gray-600">Example of our custom video production with professional actors and crew</p>
                    <div className="mt-3 flex items-center gap-2">
                      <span className="bg-sky-100 text-sky-800 text-xs px-2 py-1 rounded">Drama</span>
                      <span className="bg-teal-100 text-teal-800 text-xs px-2 py-1 rounded">Professional</span>
                      <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded">HD Quality</span>
                    </div>
                  </div>
                </div>

                {/* Demo Video 2 - AI Generated / Tech Demo */}
                <div className="card-ocean">
                  <div className="aspect-video bg-gray-900 relative overflow-hidden">
                    <iframe
                      src="https://player.vimeo.com/video/342333493?background=1&autoplay=0&loop=0&byline=0&title=0"
                      className="w-full h-full"
                      frameBorder="0"
                      allow="autoplay; fullscreen; picture-in-picture"
                      allowFullScreen
                      title="AI-Generated Video Demo"
                    ></iframe>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">AI-Powered Creation</h3>
                    <p className="text-gray-600">Example of our cutting-edge AI-generated video content with digital effects</p>
                    <div className="mt-3 flex items-center gap-2">
                      <span className="bg-sky-100 text-sky-800 text-xs px-2 py-1 rounded">AI Tech</span>
                      <span className="bg-teal-100 text-teal-800 text-xs px-2 py-1 rounded">Innovative</span>
                      <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded">Digital</span>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Note about demo videos */}
          <div className="text-center mt-8">
            <p className="text-sm text-gray-500 italic">
              * Demo videos are representative examples. Your custom project will be created specifically for your needs.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 ocean-gradient text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Make Waves?
          </h2>
          <p className="text-xl mb-8 text-sky-50">
            Start your video project today. Quick request form takes less than 2 minutes.
          </p>
          <Link 
            to="/request"
            className="inline-block bg-yellow-400 text-gray-900 px-10 py-4 rounded-lg font-bold text-xl hover:bg-yellow-300 transition shadow-2xl hover:shadow-yellow-400/50 transform hover:scale-105"
          >
            Get Started Now
          </Link>
          <p className="mt-6 text-sky-100 text-sm">
            Or <Link to="/contact" className="underline hover:text-white">contact us</Link> to discuss your project
          </p>
        </div>
      </section>
    </div>
  );
}

export default Homepage;
