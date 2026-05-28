import { Link } from 'react-router-dom';
import { Calendar, User, ChevronRight, Clock } from 'lucide-react';
import { getImageUrl } from '../utils/image';

const ArticleCard = ({ article }) => {
  const { title, slug, excerpt, featuredImage, createdAt, author, category, readingTime } = article;
  
  const formattedDate = new Date(createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <article className="card group hover:shadow-md transition-shadow">
      <Link to={`/article/${slug}`} className="block relative aspect-video overflow-hidden">
        <img 
          src={featuredImage ? getImageUrl(featuredImage) : `https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=800`} 
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {category && (
          <span className="absolute top-4 left-4 bg-primary-600 text-white text-[10px] uppercase font-bold tracking-widest px-2 py-1 rounded shadow-lg">
            {category.name}
          </span>
        )}
      </Link>
      
      <div className="p-6">
        <div className="flex items-center space-x-4 text-xs text-slate-400 mb-3 font-semibold uppercase tracking-wider">
          <div className="flex items-center">
            <Calendar size={14} className="mr-1.5" />
            <span>{formattedDate}</span>
          </div>
          {readingTime && (
            <div className="flex items-center text-primary-600">
              <Clock size={14} className="mr-1.5" />
              <span>{readingTime}</span>
            </div>
          )}
        </div>
        
        <Link to={`/article/${slug}`}>
          <h2 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-primary-600 transition-colors line-clamp-2">
            {title}
          </h2>
        </Link>
        
        <p className="text-slate-500 text-sm leading-relaxed mb-6 line-clamp-3">
          {excerpt}
        </p>
        
        <Link 
          to={`/article/${slug}`}
          className="inline-flex items-center text-sm font-bold text-primary-600 hover:text-primary-700 uppercase tracking-wider group/link"
        >
          Read Article
          <ChevronRight size={16} className="ml-1 group-hover/link:translate-x-1 transition-transform" />
        </Link>
      </div>
    </article>
  );
};

export default ArticleCard;
