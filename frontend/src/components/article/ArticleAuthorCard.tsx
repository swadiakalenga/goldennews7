import Image from "next/image";
import Link from "next/link";
import type { Author } from "@/types";

interface ArticleAuthorCardProps {
  author: Author;
}

export default function ArticleAuthorCard({ author }: ArticleAuthorCardProps) {
  return (
    <div className="flex gap-4 items-start p-5 bg-gray-50 rounded-xl border border-gray-100">
      <div className="w-14 h-14 rounded-full overflow-hidden bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shrink-0">
        {author.avatar ? (
          <Image src={author.avatar} alt={author.name} width={56} height={56} className="object-cover w-full h-full" />
        ) : (
          <span className="text-xl font-black text-white">{author.name.charAt(0)}</span>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-2 mb-1">
          {author.slug ? (
            <Link href={`/auteur/${author.slug}`} className="text-sm font-black text-gray-900 hover:text-amber-600 transition-colors">
              {author.name}
            </Link>
          ) : (
            <span className="text-sm font-black text-gray-900">{author.name}</span>
          )}
          <span className="text-xs text-amber-600 font-semibold bg-amber-50 px-2 py-0.5 rounded-full">{author.role}</span>
        </div>
        {author.bio && (
          <p className="text-sm text-gray-600 leading-relaxed line-clamp-3 mb-2">{author.bio}</p>
        )}
        <div className="flex items-center gap-3">
          {author.slug && (
            <Link href={`/auteur/${author.slug}`} className="text-xs text-amber-600 hover:text-amber-500 font-semibold transition-colors">
              Voir tous ses articles →
            </Link>
          )}
          {author.twitterUrl && (
            <a href={author.twitterUrl} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-sky-500 transition-colors" title="Twitter">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
          )}
          {author.facebookUrl && (
            <a href={author.facebookUrl} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-500 transition-colors" title="Facebook">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
