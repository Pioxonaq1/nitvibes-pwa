import Link from "next/link";
import Image from "next/image";
import { client } from "../../../sanity/client";
import { PortableText } from "@portabletext/react";

export const dynamic = "force-dynamic";

async function getPost(slug: string) {
  const query = `*[_type == "post" && slug.current == $slug][0] {
    title,
    "image": mainImage.asset->url,
    publishedAt,
    "category": categories[0]->title,
    body
  }`;
  return await client.fetch(query, { slug });
}

export default async function PostPage({ params }: { params: { slug: string } }) {
  const post = await getPost(params.slug);

  if (!post) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center pb-20">
        <p className="text-xl text-gray-400">Vibe no encontrado.</p>
        <Link href="/vibes" className="mt-4 text-cyan-400 hover:underline">Volver a Vibes</Link>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white pb-28">
      
      {/* CABECERA FLOTANTE - Botón Volver corregido */}
      <div className="sticky top-0 z-20 bg-black/80 backdrop-blur-md border-b border-gray-800 p-4 flex items-center gap-4">
        <Link href="/vibes" className="text-gray-400 hover:text-white transition-colors flex items-center gap-1 text-sm font-bold uppercase tracking-wider">
          <span>⬅</span> Vibes
        </Link>
      </div>

      {/* IMAGEN DE PORTADA */}
      {post.image && (
        <div className="relative w-full h-80 md:h-[50vh] lg:h-[60vh]">
          <Image 
            src={post.image} 
            alt={post.title}
            fill
            className="object-cover object-top" 
            priority 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
        </div>
      )}

      {/* CONTENIDO */}
      <article className="px-5 py-8 max-w-2xl mx-auto relative -mt-24 z-10">
        <div className="flex items-center gap-3 mb-4">
            {post.category && (
                <span className="bg-purple-600 shadow-[0_0_15px_rgba(147,51,234,0.5)] text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                    {post.category}
                </span>
            )}
             <span className="text-gray-300 text-xs font-bold uppercase tracking-widest drop-shadow-md">
                {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : ''}
             </span>
        </div>

        <h1 className="text-3xl md:text-5xl font-black mb-8 leading-tight text-white drop-shadow-lg">
          {post.title}
        </h1>

        <div className="prose prose-invert prose-lg max-w-none prose-p:text-gray-300 prose-a:text-cyan-400 prose-headings:text-white prose-img:rounded-xl">
          {post.body ? <PortableText value={post.body} /> : <p className="text-gray-500 italic">Sin contenido...</p>}
        </div>
      </article>
    </main>
  );
}