interface ArticleContentProps {
  content: string;
}

export default function ArticleContent({ content }: ArticleContentProps) {
  return (
    <div
      className="article-prose"
      // Content comes from our controlled mock data; sanitize before rendering
      // real CMS HTML with a library like DOMPurify or sanitize-html.
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
}
